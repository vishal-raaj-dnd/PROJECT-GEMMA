import sys
import os
from pathlib import Path

# Add backend directory to sys.path
ROOT_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = ROOT_DIR / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

# On Vercel serverless, ensure temporary/writable directories are used
if os.environ.get("VERCEL"):
    okf_dir = BACKEND_DIR / "data" / "okf_bundle"
    os.environ.setdefault("OKF_STORAGE_DIR", str(okf_dir))
    os.environ.setdefault("RAW_DOCS_DIR", "/tmp/raw_docs")
    os.makedirs("/tmp/raw_docs", exist_ok=True)

from app.main import app

