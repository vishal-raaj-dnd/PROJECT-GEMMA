import re
import logging
from typing import List, Dict, Tuple, Optional
from pathlib import Path

from app.models.diagnostic_models import CitationVerification
from app.services.graph_engine import OKFGraphEngine

logger = logging.getLogger(__name__)


class CitationAuditor:
    """
    Enforces deterministic citation integrity.
    Verifies that all citations emitted by the LLM correspond to actual,
    locally existing OKF nodes and headings, flagging hallucinated citations.
    """

    CITATION_PATTERN = re.compile(
        r"\[\^(?:REF:\s*)?([a-zA-Z0-9_\-\./]+?\.md)(?:#([a-zA-Z0-9_\-]+))?\]|"
        r"\[REF:\s*([a-zA-Z0-9_\-\./]+?\.md)(?:#([a-zA-Z0-9_\-]+))?\]"
    )

    def __init__(self, graph_engine: OKFGraphEngine):
        self.graph_engine = graph_engine

    def audit_text(
        self,
        raw_text: str,
        active_subgraph_paths: Optional[List[str]] = None
    ) -> Tuple[List[CitationVerification], bool]:
        """
        Parses all citations in the generated text, cross-references with the graph,
        and extracts verified source text snippets.

        Returns:
            Tuple of (List of CitationVerification objects, all_verified_boolean)
        """
        matches = self.CITATION_PATTERN.findall(raw_text)
        verifications: List[CitationVerification] = []
        all_verified = True
        seen_keys = set()

        for idx, match in enumerate(matches):
            # match has 4 groups due to two regex alternation branches
            node_path = match[0] or match[2]
            heading = match[1] or match[3] or None

            # Normalize path (handle leading ./ or ../)
            clean_path = re.sub(r"^\.+/", "", node_path.strip())

            # Attempt path matching against graph
            resolved_node_path = self._resolve_graph_path(clean_path)
            cite_id = f"cite_{idx + 1}"
            raw_cite_str = f"[^{node_path}{f'#{heading}' if heading else ''}]"

            if raw_cite_str in seen_keys:
                continue
            seen_keys.add(raw_cite_str)

            if not resolved_node_path:
                logger.warning("HALLUCINATION DETECTED: Node %s does not exist in OKF graph.", clean_path)
                verifications.append(CitationVerification(
                    citation_id=cite_id,
                    raw_citation=raw_cite_str,
                    node_path=clean_path,
                    heading=heading,
                    exact_source_text="[Citation Failed: Referenced file does not exist in local knowledge base]",
                    verification_status="unverified_node"
                ))
                all_verified = False
                continue

            # Verify against active subgraph if provided
            if active_subgraph_paths and resolved_node_path not in active_subgraph_paths:
                logger.warning("UNGROUNDED CITATION: %s was not in the active reasoning subgraph.", resolved_node_path)

            # Node exists, now check heading and extract quote
            node = self.graph_engine.nodes_by_path[resolved_node_path]
            snippet, section_valid = self._extract_section_snippet(node.content, heading)

            status = "verified" if section_valid else "unverified_section"
            if not section_valid:
                all_verified = False

            verifications.append(CitationVerification(
                citation_id=cite_id,
                raw_citation=raw_cite_str,
                node_path=resolved_node_path,
                heading=heading,
                exact_source_text=snippet,
                verification_status=status
            ))

        return verifications, all_verified

    def _resolve_graph_path(self, target_path: str) -> Optional[str]:
        """Resolves target relative path or slug to actual node key."""
        if target_path in self.graph_engine.nodes_by_path:
            return target_path

        # Match by filename stem
        stem = Path(target_path).stem.lower()
        for key in self.graph_engine.nodes_by_path.keys():
            if Path(key).stem.lower() == stem:
                return key

        return None

    def _extract_section_snippet(self, markdown_body: str, heading_slug: Optional[str]) -> Tuple[str, bool]:
        """Locates the section in markdown and returns a clean quote."""
        if not heading_slug:
            # Return first non-empty paragraph
            paragraphs = [p.strip() for p in markdown_body.split("\n\n") if p.strip() and not p.startswith("#")]
            return (paragraphs[0][:250] + "...") if paragraphs else markdown_body[:250], True

        norm_slug = heading_slug.lower().replace("-", " ")
        header_regex = re.compile(r"^(#{1,6})\s+(.+)$", re.MULTILINE)

        lines = markdown_body.splitlines()
        found_section = False
        section_lines = []

        for line in lines:
            h_match = header_regex.match(line.strip())
            if h_match:
                title = h_match.group(2).lower()
                if norm_slug in title or title in norm_slug:
                    found_section = True
                    continue
                elif found_section:
                    # Next header reached, end of section
                    break

            if found_section and line.strip():
                section_lines.append(line.strip())

        if found_section and section_lines:
            text = " ".join(section_lines)
            return (text[:280] + "...") if len(text) > 280 else text, True

        # Fallback snippet if heading was not an exact match
        clean_body = re.sub(r"^(#+)\s+.*$", "", markdown_body, flags=re.MULTILINE).strip()
        return (clean_body[:200] + "..."), False
