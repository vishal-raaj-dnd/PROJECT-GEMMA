import shutil
import logging
from typing import List
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends

from app.config import settings
from app.models.ingest_models import IngestResponse
from app.services.okf_compiler.compiler_service import OKFCompilerService
from app.services.okf_compiler.manifest import load_manifest

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/ingest", tags=["Ingestion & OKF Compilation"])


def get_compiler_service() -> OKFCompilerService:
    return OKFCompilerService(output_dir=str(settings.resolved_okf_dir))


@router.post("/upload", response_model=IngestResponse)
async def upload_and_compile(
    files: List[UploadFile] = File(...),
    compiler: OKFCompilerService = Depends(get_compiler_service)
):
    """
    Uploads raw documents (PDF, DOCX, XLSX, Markdown) and compiles them into
    the Open Knowledge Format (OKF) bundle.
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")

    saved_paths: List[str] = []
    raw_dir = settings.resolved_raw_docs_dir

    for file in files:
        safe_filename = Path(file.filename).name
        target_path = raw_dir / safe_filename
        try:
            with open(target_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            saved_paths.append(str(target_path))
        except Exception as e:
            logger.error("Failed to save uploaded file %s: %s", safe_filename, e)
            raise HTTPException(status_code=500, detail=f"Failed to save {safe_filename}")

    # Run OmniOKF compilation
    result = compiler.compile_files(saved_paths)
    return result


@router.post("/compile-all", response_model=IngestResponse)
async def compile_all_raw_docs(compiler: OKFCompilerService = Depends(get_compiler_service)):
    """Recompiles all documents present in the raw documents directory."""
    raw_dir = settings.resolved_raw_docs_dir
    raw_files = [str(p) for p in raw_dir.glob("*") if p.is_file() and not p.name.startswith(".")]

    if not raw_files:
        raise HTTPException(status_code=404, detail="No raw documents found to compile.")

    return compiler.compile_files(raw_files)


@router.get("/manifest")
async def get_compilation_manifest():
    """Returns the current incremental compilation cache manifest."""
    return load_manifest(str(settings.resolved_okf_dir))
