import re
import math
from typing import Dict, Any, List


def get_relative_path(source_type: str, target_type: str, target_filename: str) -> str:
    """Computes relative link between two category folders."""
    if source_type == target_type:
        return f"./{target_filename}.md"
    return f"../{target_type}/{target_filename}.md"


def get_link_keywords(title: str) -> List[str]:
    """Generates clean search phrases from a concept title."""
    keywords = [title]
    cleaned_num = re.sub(r"^\d+(?:\.\d+)*\.?\s+", "", title)
    if cleaned_num != title:
        keywords.append(cleaned_num)

    cleaned_paren = re.sub(r"\s*\([^)]*\)\s*$", "", title)
    if cleaned_paren != title:
        keywords.append(cleaned_paren)

    cleaned_both = re.sub(r"\s*\([^)]*\)\s*$", "", cleaned_num)
    if cleaned_both not in keywords:
        keywords.append(cleaned_both)

    stopwords = {"plan", "view", "show", "step", "guide", "concept", "process", "overview", "stack", "tools", "schema"}
    valid_keywords = []
    for kw in keywords:
        kw_s = kw.strip()
        if len(kw_s) >= 4 and kw_s.lower() not in stopwords:
            valid_keywords.append(kw_s)

    return sorted(list(set(valid_keywords)), key=len, reverse=True)


def cross_link_concepts(concepts: Dict[str, Dict[str, Any]]) -> Dict[str, str]:
    """
    Performs deterministic auto-linking across concepts using TF-IDF relevance.
    """
    targets_info = []
    for target_id, target in concepts.items():
        meta = target["metadata"]
        targets_info.append({
            "id": target_id,
            "title": meta["title"],
            "type": meta["type"],
            "filename": meta["filename"],
            "keywords": get_link_keywords(meta["title"]),
        })

    n_docs = len(concepts)
    if n_docs == 0:
        return {}

    # Document frequency
    keyword_df: Dict[str, int] = {}
    for target in targets_info:
        for kw in target["keywords"]:
            df = sum(1 for doc in concepts.values() if re.search(rf"\b{re.escape(kw.lower())}\b", doc["content"].lower()))
            keyword_df[kw] = df

    doc_words: Dict[str, int] = {
        cid: max(len(re.findall(r"\w+", doc["content"].lower())), 1)
        for cid, doc in concepts.items()
    }

    updated_contents: Dict[str, str] = {}

    for source_id, concept_data in concepts.items():
        content = concept_data["content"]
        source_meta = concept_data["metadata"]
        source_type = source_meta["type"]
        words_len = doc_words[source_id]

        scored_links = []
        for target in targets_info:
            if target["id"] == source_id:
                continue

            for kw in target["keywords"]:
                matches = len(re.findall(rf"\b{re.escape(kw.lower())}\b", content.lower()))
                if matches == 0:
                    continue

                tf = matches / words_len
                df = keyword_df.get(kw, 1)
                idf = math.log(1 + (n_docs / (1 + df)))
                tfidf = tf * idf
                is_exact = kw.lower() == target["title"].lower()

                scored_links.append({
                    "keyword": kw,
                    "target_type": target["type"],
                    "target_filename": target["filename"],
                    "tfidf": tfidf,
                    "is_exact": is_exact,
                })

        scored_links.sort(key=lambda x: (x["is_exact"], x["tfidf"]), reverse=True)

        active_links = []
        seen = set()
        for link in scored_links:
            key = f"{link['target_type']}/{link['target_filename']}"
            if key not in seen and (link["is_exact"] or link["tfidf"] >= 0.008):
                active_links.append(link)
                seen.add(key)
                if len(active_links) >= 4:
                    break

        active_links.sort(key=lambda x: len(x["keyword"]), reverse=True)

        for link in active_links:
            kw = link["keyword"]
            rel_path = get_relative_path(source_type, link["target_type"], link["target_filename"])
            prefix = r"\b" if re.match(r"^\w", kw) else ""
            suffix = r"\b" if re.search(r"\w$", kw) else ""

            pattern = re.compile(rf"(\[.*?\]\(.*?\))|({prefix}{re.escape(kw)}{suffix})", re.IGNORECASE)

            def repl(m: re.Match) -> str:
                return m.group(1) if m.group(1) else f"[{m.group(2)}]({rel_path})"

            content = pattern.sub(repl, content)

        updated_contents[source_id] = content

    return updated_contents

