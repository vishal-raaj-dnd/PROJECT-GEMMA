import os
import json
import hashlib
from typing import Dict, Any

MANIFEST_FILENAME = "manifest.json"


def calculate_file_hash(filepath: str) -> str:
    """Calculates the MD5 hash of a file for incremental compilation caching."""
    hasher = hashlib.md5()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hasher.update(chunk)
    return hasher.hexdigest()


def load_manifest(output_dir: str) -> Dict[str, Any]:
    """Loads manifest.json from output_dir if present."""
    manifest_path = os.path.join(output_dir, MANIFEST_FILENAME)
    if os.path.exists(manifest_path):
        try:
            with open(manifest_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}


def save_manifest(output_dir: str, manifest_data: Dict[str, Any]) -> None:
    """Saves manifest.json to output_dir."""
    os.makedirs(output_dir, exist_ok=True)
    manifest_path = os.path.join(output_dir, MANIFEST_FILENAME)
    try:
        with open(manifest_path, "w", encoding="utf-8") as f:
            json.dump(manifest_data, f, indent=2, ensure_ascii=False)
    except Exception:
        pass

