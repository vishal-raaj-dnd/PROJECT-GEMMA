import os
import re
from typing import List, Dict, Any, Optional
from collections import Counter
from pathlib import Path


def parse_pdf_layout(filepath: str) -> str:
    """
    Parses a PDF using PyMuPDF (fitz) and reconstructs structured Markdown text.
    Infers headers (#, ##, ###) dynamically based on relative font size analysis.
    """
    import fitz  # PyMuPDF

    doc = fitz.open(filepath)
    all_sizes: List[float] = []

    # Pass 1: Compute font size distribution
    for page in doc:
        blocks = page.get_text("dict").get("blocks", [])
        for b in blocks:
            if "lines" not in b:
                continue
            for line in b["lines"]:
                for span in line["spans"]:
                    text = span["text"].strip()
                    if len(text) > 3:
                        all_sizes.append(round(span["size"], 1))

    body_font_size = Counter(all_sizes).most_common(1)[0][0] if all_sizes else 10.0
    h1_thresh = body_font_size * 1.45
    h2_thresh = body_font_size * 1.25

    markdown_lines: List[str] = []

    # Pass 2: Extract text and reconstruct markdown headers
    for page in doc:
        dict_blocks = page.get_text("dict").get("blocks", [])
        for b in dict_blocks:
            if "lines" not in b:
                continue
            block_text = ""
            max_size = 0.0
            is_bold = False

            for line in b["lines"]:
                line_spans = []
                for span in line["spans"]:
                    text = span["text"]
                    size = span["size"]
                    flags = span.get("flags", 0)
                    if size > max_size:
                        max_size = size
                    if flags & 2 or "bold" in span.get("font", "").lower():
                        is_bold = True
                    line_spans.append(text)
                block_text += "".join(line_spans) + "\n"

            stripped = block_text.strip()
            if not stripped:
                continue

            # Classify headers
            if max_size >= h1_thresh:
                markdown_lines.append(f"# {stripped}\n")
            elif max_size >= h2_thresh or (is_bold and max_size > body_font_size):
                markdown_lines.append(f"## {stripped}\n")
            else:
                markdown_lines.append(f"{stripped}\n")

    doc.close()
    return "\n".join(markdown_lines)


def read_file_to_markdown(filepath: str) -> str:
    """
    Universal reader converting PDF, DOCX, XLSX, PPTX, HTML, or MD to clean markdown.
    """
    path = Path(filepath)
    ext = path.suffix.lower()

    if ext == ".md":
        with open(filepath, "r", encoding="utf-8", errors="replace") as f:
            return f.read()

    if ext == ".pdf":
        try:
            return parse_pdf_layout(filepath)
        except Exception:
            # Fall back to markitdown if fitz encounters an issue
            pass

    # Microsoft MarkItDown for Office and other formats
    try:
        from markitdown import MarkItDown
        md = MarkItDown()
        result = md.convert(filepath)
        return result.text_content
    except Exception as e:
        # Final text fallback
        with open(filepath, "r", encoding="utf-8", errors="replace") as f:
            return f.read()


def split_markdown(content: str, split_level: str = "##") -> List[Dict[str, Any]]:
    """
    Heuristically splits markdown content into discrete concept chunks at header boundaries.
    """
    header_regex = re.compile(r"^(#{1,6})\s+(.+)$")
    split_level_num = len(split_level.strip())

    lines = content.splitlines()
    chunks: List[Dict[str, Any]] = []

    current_header = "System Overview"
    current_header_level = 1
    current_chunk_lines: List[str] = []

    for line in lines:
        match = header_regex.match(line.strip())
        if match:
            level_str, title = match.groups()
            level_num = len(level_str)

            if level_num <= split_level_num:
                joined_content = "\n".join(current_chunk_lines).strip()
                if joined_content:
                    chunks.append({
                        "header": current_header,
                        "level": current_header_level,
                        "content": joined_content
                    })
                current_header = title.strip()
                current_header_level = level_num
                current_chunk_lines = [line]
                continue

        current_chunk_lines.append(line)

    joined_content = "\n".join(current_chunk_lines).strip()
    if joined_content:
        chunks.append({
            "header": current_header,
            "level": current_header_level,
            "content": joined_content
        })

    return chunks


def smart_local_classify(header: str, content: str, idx: int) -> Dict[str, Any]:
    """
    Deterministic offline heuristic classifier if Gemma API key is not configured.
    """
    text_lower = (header + " " + content).lower()
    inferred_type = "concept"

    if any(k in text_lower for k in ["safety", "hazard", "warning", "lockout", "loto", "ppe", "caution"]):
        inferred_type = "safety"
    elif any(k in text_lower for k in ["tool", "wrench", "multimeter", "gauge", "calibration"]):
        inferred_type = "tool"
    elif any(k in text_lower for k in ["valve", "pump", "motor", "pcb", "bearing", "solenoid", "sensor"]):
        inferred_type = "component"
    elif any(k in text_lower for k in ["fault", "error", "code", "alarm", "blink", "troubleshoot"]):
        inferred_type = "fault_code"
    elif any(k in text_lower for k in ["procedure", "replace", "install", "maintenance", "step", "sequence"]):
        inferred_type = "procedure"
    elif any(k in text_lower for k in ["torque", "spec", "rating", "dimension", "pressure", "voltage"]):
        inferred_type = "specification"

    # Clean description
    clean = re.sub(r"^(#+)\s+.*$", "", content, flags=re.MULTILINE)
    clean = re.sub(r"`.*?`", "", clean)
    clean = re.sub(r"\s+", " ", clean).strip()
    desc = clean[:180] + "..." if len(clean) > 180 else clean

    slug = re.sub(r"[^a-zA-Z0-9]+", "-", header.strip().lower()).strip("-")
    if not slug:
        slug = f"concept-{idx + 1}"

    return {
        "type": inferred_type,
        "title": header.strip(),
        "description": desc or f"Overview of {header}",
        "tags": [inferred_type, "fieldops"],
        "filename": slug
    }

