import sys
import os
from pathlib import Path
import uvicorn

# Add backend directory to sys.path
backend_dir = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_dir))

if __name__ == "__main__":
    from app.config import settings

    print("=" * 70)
    print("🚀 FIELD ENGINEERING & HARDWARE DIAGNOSTIC ENGINE (FastAPI)")
    print(f"📡 API Server: http://{settings.host}:{settings.port}")
    print(f"📖 Swagger Docs: http://localhost:{settings.port}/docs")
    print(f"🧠 OKF Knowledge Base: {settings.resolved_okf_dir}")
    print(f"🤖 Model: {settings.gemma_model}")
    print("=" * 70)

    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=True,
        reload_dirs=[str(backend_dir / "app")]
    )

