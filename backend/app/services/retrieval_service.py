import re
import math
import logging
from typing import List, Optional, Dict, Any, Set
from collections import Counter
from pathlib import Path

from app.services.graph_engine import OKFGraphEngine
from app.models.okf_models import OKFNode
from app.database.repository import DocumentRepository

logger = logging.getLogger(__name__)


def tokenize(text: str) -> List[str]:
    """Simple lowercase alphanumeric tokenizer."""
    return [w for w in re.findall(r"\b[a-zA-Z0-9_\-]{2,}\b", text.lower())]


class RetrievalService:
    """
    RAG Retrieval Service:
    Resolves queries into relevant OKF knowledge nodes with source document filtering,
    lexical ranking, and graph neighborhood expansion.
    """

    def __init__(self, graph_engine: OKFGraphEngine):
        self.graph_engine = graph_engine

    def retrieve(
        self,
        query: str,
        selected_document_ids: Optional[List[str]] = None,
        max_nodes: int = 5
    ) -> Dict[str, Any]:
        """
        Retrieves context nodes and formats grounded prompts.
        If selected_document_ids is provided and non-empty, restricts retrieval to those documents.
        """
        all_nodes = list(self.graph_engine.nodes_by_path.values())
        if not all_nodes:
            return {
                "context_text": "No indexed OKF knowledge nodes available.",
                "retrieved_nodes": [],
                "node_paths": []
            }

        allowed_paths: Optional[Set[str]] = None
        if selected_document_ids:
            doc_paths = DocumentRepository.get_nodes_for_documents(selected_document_ids)
            if doc_paths:
                allowed_paths = set(doc_paths)
            else:
                stem_matches = set()
                for doc_id in selected_document_ids:
                    doc = DocumentRepository.get(doc_id)
                    if doc:
                        raw_stem = Path(doc["filename"]).stem.lower()
                        for p, n in self.graph_engine.nodes_by_path.items():
                            if raw_stem in p.lower() or raw_stem in n.content.lower():
                                stem_matches.add(p)
                if stem_matches:
                    allowed_paths = stem_matches
                else:
                    # Allow all candidates if doc nodes were not explicitly mapped
                    allowed_paths = None

        # Filter candidate nodes
        candidates = [
            node for node in all_nodes
            if allowed_paths is None or node.relative_path in allowed_paths
        ]

        if not candidates:
            candidates = all_nodes

        query_tokens = tokenize(query)
        q_lower = query.strip().lower()

        # 1. Check exact part numbers or title
        entry_node = self.graph_engine.resolve_entry_node(query)
        scored: List[tuple[float, OKFNode]] = []

        for node in candidates:
            score = 0.0
            node_title = node.frontmatter.title.lower()
            node_text = f"{node.frontmatter.title} {node.frontmatter.description} {node.content}".lower()
            node_tokens = tokenize(node_text)

            # High priority if it was the entry node match
            if entry_node and node.relative_path == entry_node.relative_path:
                score += 150.0

            # Exact phrase match in title
            if q_lower in node_title:
                score += 80.0

            # Part number matches
            for pn in node.frontmatter.part_numbers:
                if pn.lower() in q_lower:
                    score += 100.0

            # Term frequency token overlap
            if query_tokens and node_tokens:
                node_counts = Counter(node_tokens)
                overlap = sum(node_counts[qt] for qt in query_tokens if qt in node_counts)
                score += overlap * 5.0

            # Tag match
            for tag in node.frontmatter.tags:
                if tag.lower() in query_tokens:
                    score += 25.0

            if score > 0:
                scored.append((score, node))

        # Sort candidate nodes
        scored.sort(key=lambda x: x[0], reverse=True)
        top_nodes = [node for _, node in scored[:max_nodes]]

        # If no positive matches, fallback to top candidates from collection
        if not top_nodes and candidates:
            top_nodes = candidates[:max_nodes]

        # 2. Graph neighborhood expansion: include upstream safety or critical prerequisites
        final_nodes: List[OKFNode] = []
        seen_paths: Set[str] = set()

        for node in top_nodes:
            if node.relative_path not in seen_paths:
                seen_paths.add(node.relative_path)
                final_nodes.append(node)

            # Add upstream safety prerequisites if any
            safety_prereqs = self.graph_engine.get_upstream_safety_prerequisites(node.relative_path)
            for sn in safety_prereqs:
                if sn.relative_path not in seen_paths and (allowed_paths is None or sn.relative_path in allowed_paths):
                    seen_paths.add(sn.relative_path)
                    final_nodes.append(sn)

        # 3. Format grounded context block with exact citation anchors
        context_blocks = []
        for n in final_nodes:
            heading = n.frontmatter.title
            excerpt = n.content.strip()
            # Allow full node content up to 8000 characters
            if len(excerpt) > 8000:
                excerpt = excerpt[:8000] + "..."

            block = (
                f"### [^{n.relative_path}#{heading}]\n"
                f"**Category:** {n.category} | **Subsystem:** {n.frontmatter.subsystem or 'General'}\n"
                f"**Part Numbers:** {', '.join(n.frontmatter.part_numbers) if n.frontmatter.part_numbers else 'N/A'}\n"
                f"{excerpt}\n"
            )
            context_blocks.append(block)

        context_str = "\n\n".join(context_blocks)
        return {
            "context_text": context_str,
            "retrieved_nodes": final_nodes,
            "node_paths": list(seen_paths)
        }
