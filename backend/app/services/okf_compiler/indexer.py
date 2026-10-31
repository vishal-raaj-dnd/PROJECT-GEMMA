import os
import re
import yaml
from typing import Dict, Any, List


def format_yaml_frontmatter(metadata: Dict[str, Any]) -> str:
    """Formats metadata dictionary into clean YAML frontmatter."""
    okf_meta: Dict[str, Any] = {
        "id": metadata.get("id") or metadata.get("filename"),
        "type": metadata.get("type"),
        "title": metadata.get("title"),
        "description": metadata.get("description", ""),
        "tags": metadata.get("tags", []),
        "timestamp": metadata.get("timestamp"),
    }

    # Include industrial specific fields if provided
    for opt_field in ["subsystem", "part_numbers", "safety_prerequisites", "required_tools", "procedures"]:
        if metadata.get(opt_field):
            okf_meta[opt_field] = metadata[opt_field]

    yaml_str = yaml.safe_dump(okf_meta, default_flow_style=False, sort_keys=False, allow_unicode=True)
    return f"---\n{yaml_str}---\n"


def build_raw_mermaid_graph(concepts: Dict[str, Dict[str, Any]]) -> str:
    """Generates Mermaid flowchart syntax mapping connections across concepts."""
    edges: List[str] = []
    nodes: Dict[str, tuple[str, str]] = {}

    for concept_id, concept_data in concepts.items():
        meta = concept_data["metadata"]
        filename = meta["filename"]
        title = meta["title"]
        mermaid_id = "node_" + re.sub(r"[^a-zA-Z0-9]", "", filename)
        nodes[filename] = (mermaid_id, title)

    link_pattern = re.compile(r"\]\((?:\./|\.\./[a-zA-Z0-9_\-]+/)?([a-zA-Z0-9_\-]+)\.md\)")

    for concept_id, concept_data in concepts.items():
        source_meta = concept_data["metadata"]
        source_filename = source_meta["filename"]
        content = concept_data["content"]

        if source_filename not in nodes:
            continue

        source_id, source_title = nodes[source_filename]
        targets = link_pattern.findall(content)

        for target_filename in targets:
            if target_filename in nodes and target_filename != source_filename:
                target_id, target_title = nodes[target_filename]
                edge = f'    {source_id}["{source_title}"] --> {target_id}["{target_title}"]'
                if edge not in edges:
                    edges.append(edge)

    if not edges:
        for filename, (mermaid_id, title) in nodes.items():
            edges.append(f'    {mermaid_id}["{title}"]')

    graph_lines = ["graph TD"]
    graph_lines.extend(edges)
    return "\n".join(graph_lines)


def generate_index_md(concepts: Dict[str, Dict[str, Any]]) -> str:
    """Generates master index.md file categorizing all concepts."""
    by_category: Dict[str, List[Dict[str, Any]]] = {}
    for concept_data in concepts.values():
        meta = concept_data["metadata"]
        category = meta.get("type", "general")
        if category not in by_category:
            by_category[category] = []
        by_category[category].append(meta)

    raw_graph = build_raw_mermaid_graph(concepts)
    lines = [
        "# Knowledge Catalog Index",
        "",
        "Structured graph index of all available equipment, safety protocols, and repair procedures.",
        "",
        "## 📊 Knowledge Graph",
        "",
        "```mermaid",
        raw_graph,
        "```",
        "",
        "## Catalog by Category",
        "",
    ]

    for category in sorted(by_category.keys()):
        lines.append(f"### {category.capitalize()}")
        lines.append("")
        sorted_metas = sorted(by_category[category], key=lambda x: x["title"])
        for meta in sorted_metas:
            title = meta["title"]
            filename = meta["filename"]
            description = meta.get("description", "")
            tags_str = ", ".join(meta.get("tags", []))
            link_path = f"./{category}/{filename}.md"
            lines.append(f"- **[{title}]({link_path})** - {description} *({tags_str})*")
        lines.append("")

    return "\n".join(lines)


def write_okf_bundle(output_dir: str, concepts: Dict[str, Dict[str, Any]], linked_contents: Dict[str, str]) -> None:
    """Writes compiled concept files and index.md to the output directory."""
    os.makedirs(output_dir, exist_ok=True)

    for concept_id, content in linked_contents.items():
        concepts[concept_id]["content"] = content

    for concept_id, concept_data in concepts.items():
        meta = concept_data["metadata"]
        category = meta["type"]
        filename = meta["filename"]
        content = concept_data["content"]

        category_dir = os.path.join(output_dir, category)
        os.makedirs(category_dir, exist_ok=True)

        yaml_frontmatter = format_yaml_frontmatter(meta)
        file_path = os.path.join(category_dir, f"{filename}.md")

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(yaml_frontmatter)
            f.write("\n")
            f.write(content)

    index_content = generate_index_md(concepts)
    index_path = os.path.join(output_dir, "index.md")
    with open(index_path, "w", encoding="utf-8") as f:
        f.write(index_content)

