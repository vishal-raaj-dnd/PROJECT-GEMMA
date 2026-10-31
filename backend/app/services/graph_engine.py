import os
import re
import yaml
import logging
from typing import Dict, List, Optional, Any, Set
from pathlib import Path
import networkx as nx
from rapidfuzz import process, fuzz

from app.models.okf_models import OKFNode, OKFFrontmatter, OKFNodeType, OKFGraphStats

logger = logging.getLogger(__name__)


class OKFGraphEngine:
    """In-memory Directed Knowledge Graph managing OKF nodes, links, and safety traversals."""

    def __init__(self, root_dir: str):
        self.root_dir = Path(root_dir)
        self.graph = nx.DiGraph()
        self.nodes_by_path: Dict[str, OKFNode] = {}
        self.part_number_map: Dict[str, str] = {}  # part_no -> node_path
        self._load_graph()

    def reload(self) -> None:
        """Reloads the entire knowledge graph from the OKF directory."""
        self.graph.clear()
        self.nodes_by_path.clear()
        self.part_number_map.clear()
        self._load_graph()

    def _parse_file(self, filepath: Path) -> Optional[OKFNode]:
        try:
            with open(filepath, "r", encoding="utf-8", errors="replace") as f:
                content = f.read()

            frontmatter_dict: Dict[str, Any] = {}
            body = content

            if content.startswith("---"):
                parts = content.split("---", 2)
                if len(parts) >= 3:
                    try:
                        frontmatter_dict = yaml.safe_load(parts[1]) or {}
                    except Exception as ye:
                        logger.warning("YAML parse error in %s: %s", filepath, ye)
                    body = parts[2].strip()

            rel_path = filepath.relative_to(self.root_dir).as_posix()
            category = filepath.parent.name if filepath.parent != self.root_dir else "root"
            title = frontmatter_dict.get("title") or filepath.stem.replace("-", " ").title()

            node_type = frontmatter_dict.get("type", OKFNodeType.GUIDE.value)
            fm = OKFFrontmatter(
                id=frontmatter_dict.get("id", filepath.stem),
                type=node_type,
                title=title,
                description=frontmatter_dict.get("description", ""),
                tags=frontmatter_dict.get("tags", []),
                subsystem=frontmatter_dict.get("subsystem"),
                part_numbers=frontmatter_dict.get("part_numbers", []),
                safety_prerequisites=frontmatter_dict.get("safety_prerequisites", []),
                required_tools=frontmatter_dict.get("required_tools", []),
                procedures=frontmatter_dict.get("procedures", []),
                timestamp=frontmatter_dict.get("timestamp")
            )

            # Extract markdown links: [text](path.md)
            link_pattern = re.compile(r"\]\((?:\./|\.\./[a-zA-Z0-9_\-]+/)?([a-zA-Z0-9_\-]+)\.md\)")
            raw_links = link_pattern.findall(body)

            return OKFNode(
                id=fm.id or filepath.stem,
                relative_path=rel_path,
                category=category,
                frontmatter=fm,
                content=body,
                outgoing_links=raw_links
            )
        except Exception as e:
            logger.error("Failed to parse node file %s: %s", filepath, e)
            return None

    def _load_graph(self) -> None:
        if not self.root_dir.exists():
            return

        md_files = list(self.root_dir.glob("**/*.md"))
        temp_slug_map: Dict[str, str] = {}

        for mf in md_files:
            if mf.name == "index.md":
                continue
            node = self._parse_file(mf)
            if node:
                self.nodes_by_path[node.relative_path] = node
                self.graph.add_node(node.relative_path, data=node)
                slug = Path(node.relative_path).stem
                temp_slug_map[slug] = node.relative_path
                for pn in node.frontmatter.part_numbers:
                    self.part_number_map[pn.strip().upper()] = node.relative_path

        # Connect edges
        for rel_path, node in self.nodes_by_path.items():
            # Outgoing links
            for target_slug in node.outgoing_links:
                target_path = temp_slug_map.get(target_slug)
                if target_path and target_path != rel_path:
                    self.graph.add_edge(rel_path, target_path, edge_type="reference")

            # Explicit safety prerequisites
            for sp in node.frontmatter.safety_prerequisites:
                target_slug = Path(sp.replace("[[", "").replace("]]", "")).stem
                target_path = temp_slug_map.get(target_slug)
                if target_path:
                    self.graph.add_edge(target_path, rel_path, edge_type="safety_prerequisite")

            # Procedures and tools
            for pr in node.frontmatter.procedures:
                target_slug = Path(pr.replace("[[", "").replace("]]", "")).stem
                target_path = temp_slug_map.get(target_slug)
                if target_path:
                    self.graph.add_edge(rel_path, target_path, edge_type="procedure")

    def resolve_entry_node(self, query: str) -> Optional[OKFNode]:
        """Resolves part numbers, exact titles, or fuzzy matches to a primary entry node."""
        q_upper = query.strip().upper()

        # 1. Exact Part Number Match
        if q_upper in self.part_number_map:
            return self.nodes_by_path.get(self.part_number_map[q_upper])

        # Substring part number search
        for pn, path in self.part_number_map.items():
            if pn in q_upper or q_upper in pn:
                return self.nodes_by_path.get(path)

        # 2. Exact Title or Slug Match
        q_lower = query.strip().lower()
        for path, node in self.nodes_by_path.items():
            if node.frontmatter.title.lower() == q_lower or Path(path).stem.lower() == q_lower:
                return node

        # 3. Fuzzy search across titles first (prefer exact subject over description mentions)
        title_candidates = {
            path: node.frontmatter.title
            for path, node in self.nodes_by_path.items()
        }
        if title_candidates:
            match = process.extractOne(query, title_candidates, scorer=fuzz.token_set_ratio)
            if match and match[1] >= 60:
                return self.nodes_by_path.get(match[2])

        # 4. Fuzzy search across titles and descriptions fallback
        candidates = {
            path: f"{node.frontmatter.title} {node.frontmatter.description}"
            for path, node in self.nodes_by_path.items()
        }
        if candidates:
            match = process.extractOne(query, candidates, scorer=fuzz.token_set_ratio)
            if match and match[1] >= 65:
                return self.nodes_by_path.get(match[2])

        return None

    def get_upstream_safety_prerequisites(self, node_path: str) -> List[OKFNode]:
        """Traverses incoming safety edges and prerequisite metadata."""
        safety_nodes: List[OKFNode] = []
        visited: Set[str] = set()

        def _traverse(curr: str):
            if curr in visited or curr not in self.graph:
                return
            visited.add(curr)
            curr_node = self.nodes_by_path.get(curr)

            if curr_node and (curr_node.frontmatter.type == OKFNodeType.SAFETY or "safety" in curr_node.category):
                if curr_node not in safety_nodes:
                    safety_nodes.append(curr_node)

            for predecessor in self.graph.predecessors(curr):
                _traverse(predecessor)

        _traverse(node_path)
        return safety_nodes

    def get_connected_subgraph_nodes(self, node_path: str, max_depth: int = 2) -> List[OKFNode]:
        """Returns all connected nodes within a given traversal depth."""
        if node_path not in self.graph:
            node = self.nodes_by_path.get(node_path)
            return [node] if node else []

        collected: Set[str] = {node_path}
        frontier: Set[str] = {node_path}

        for _ in range(max_depth):
            next_frontier = set()
            for n in frontier:
                neighbors = set(self.graph.successors(n)).union(set(self.graph.predecessors(n)))
                for neighbor in neighbors:
                    if neighbor not in collected:
                        collected.add(neighbor)
                        next_frontier.add(neighbor)
            frontier = next_frontier

        return [self.nodes_by_path[p] for p in collected if p in self.nodes_by_path]

    def get_stats(self) -> OKFGraphStats:
        """Returns summary statistics for the loaded graph."""
        cats: Dict[str, int] = {}
        for node in self.nodes_by_path.values():
            cats[node.category] = cats.get(node.category, 0) + 1
        return OKFGraphStats(
            total_nodes=self.graph.number_of_nodes(),
            total_edges=self.graph.number_of_edges(),
            category_counts=cats,
            is_indexed=self.graph.number_of_nodes() > 0
        )

    def get_react_flow_graph(self) -> Dict[str, Any]:
        """Returns node and edge representations formatted directly for @xyflow/react."""
        nodes = []
        category_order = ["components", "procedures", "safety", "tools", "fault_codes", "root"]

        grouped_by_cat: Dict[str, List[OKFNode]] = {}
        for node in self.nodes_by_path.values():
            grouped_by_cat.setdefault(node.category, []).append(node)

        cat_col = 0
        for cat in category_order + [c for c in grouped_by_cat if c not in category_order]:
            cat_nodes = grouped_by_cat.get(cat, [])
            for row_idx, node in enumerate(cat_nodes):
                x = cat_col * 280.0 + 50.0
                y = row_idx * 160.0 + 50.0
                nodes.append({
                    "id": node.relative_path,
                    "type": "conceptNode",
                    "position": {"x": x, "y": y},
                    "data": {
                        "title": node.frontmatter.title,
                        "category": node.category,
                        "description": node.frontmatter.description or "",
                        "tags": node.frontmatter.tags or [],
                        "relativePath": node.relative_path,
                        "partNumbers": node.frontmatter.part_numbers or [],
                        "sourceDocumentIds": []
                    }
                })
            if cat_nodes:
                cat_col += 1

        edges = []
        for u, v, data in self.graph.edges(data=True):
            edge_type = data.get("edge_type", "reference")
            edges.append({
                "id": f"e-{u}->{v}",
                "source": u,
                "target": v,
                "type": "smoothstep",
                "animated": edge_type == "safety_prerequisite",
                "data": {
                    "relationship": edge_type
                }
            })

        stats = self.get_stats()
        return {
            "nodes": nodes,
            "edges": edges,
            "stats": {
                "total_nodes": stats.total_nodes,
                "total_edges": stats.total_edges,
                "category_counts": stats.category_counts
            }
        }

    def search_nodes(self, query: str, limit: int = 15) -> List[Dict[str, Any]]:
        """Searches graph nodes by title, tags, description, and part numbers."""
        q_lower = query.strip().lower()
        if not q_lower:
            return []

        scored_nodes = []
        for path, node in self.nodes_by_path.items():
            score = 0.0
            title_lower = node.frontmatter.title.lower()
            desc_lower = (node.frontmatter.description or "").lower()

            if q_lower == title_lower:
                score += 100.0
            elif q_lower in title_lower:
                score += 50.0

            for pn in node.frontmatter.part_numbers:
                if q_lower == pn.lower():
                    score += 90.0
                elif q_lower in pn.lower():
                    score += 45.0

            for tag in node.frontmatter.tags:
                if q_lower == tag.lower():
                    score += 40.0
                elif q_lower in tag.lower():
                    score += 20.0

            if q_lower in desc_lower:
                score += 15.0

            fuzz_score = fuzz.partial_ratio(q_lower, f"{title_lower} {desc_lower}")
            if fuzz_score > 60:
                score = max(score, float(fuzz_score))

            if score > 20:
                scored_nodes.append((score, node))

        scored_nodes.sort(key=lambda x: x[0], reverse=True)
        return [
            {
                "id": node.relative_path,
                "relative_path": node.relative_path,
                "category": node.category,
                "title": node.frontmatter.title,
                "description": node.frontmatter.description,
                "tags": node.frontmatter.tags,
                "score": score
            }
            for score, node in scored_nodes[:limit]
        ]

    def get_node_neighborhood(self, node_path: str, depth: int = 2) -> Dict[str, Any]:
        """Returns nodes and edges within a given neighborhood depth."""
        clean_path = node_path.strip().lstrip("/")
        if clean_path not in self.nodes_by_path:
            for p in self.nodes_by_path:
                if p.endswith(clean_path) or Path(p).stem == Path(clean_path).stem:
                    clean_path = p
                    break

        connected_nodes = self.get_connected_subgraph_nodes(clean_path, max_depth=depth)
        connected_paths = {n.relative_path for n in connected_nodes}

        nodes = []
        for idx, node in enumerate(connected_nodes):
            nodes.append({
                "id": node.relative_path,
                "type": "conceptNode",
                "position": {"x": (idx % 3) * 260.0 + 50.0, "y": (idx // 3) * 160.0 + 50.0},
                "data": {
                    "title": node.frontmatter.title,
                    "category": node.category,
                    "description": node.frontmatter.description or "",
                    "tags": node.frontmatter.tags or [],
                    "relativePath": node.relative_path,
                    "partNumbers": node.frontmatter.part_numbers or [],
                    "sourceDocumentIds": []
                }
            })

        edges = []
        for u, v, data in self.graph.edges(data=True):
            if u in connected_paths and v in connected_paths:
                edges.append({
                    "id": f"e-{u}->{v}",
                    "source": u,
                    "target": v,
                    "type": "smoothstep",
                    "animated": False,
                    "data": {"relationship": data.get("edge_type", "reference")}
                })

        return {"nodes": nodes, "edges": edges, "center_node": clean_path}
