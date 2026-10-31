import uuid
import shutil
import logging
from typing import List
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends

from app.config import settings
from app.models.ingest_models import IngestResponse
from app.services.okf_compiler.compiler_service import OKFCompilerService
from app.services.okf_compiler.manifest import load_manifest
from app.database.repository import DocumentRepository
from app.routers.graph_router import get_graph_engine
from app.services.graph_engine import OKFGraphEngine

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/ingest", tags=["Ingestion & OKF Compilation"])


def get_compiler_service() -> OKFCompilerService:
    return OKFCompilerService(output_dir=str(settings.resolved_okf_dir))


@router.post("/upload", response_model=IngestResponse)
async def upload_and_compile(
    files: List[UploadFile] = File(...),
    compiler: OKFCompilerService = Depends(get_compiler_service),
    engine: OKFGraphEngine = Depends(get_graph_engine)
):
    """
    Uploads raw documents (PDF, DOCX, XLSX, Markdown) and compiles them into
    the Open Knowledge Format (OKF) bundle with SQLite provenance tracking.
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")

    saved_paths: List[str] = []
    doc_id_map = {}
    raw_dir = settings.resolved_raw_docs_dir

    for file in files:
        safe_filename = Path(file.filename).name
        target_path = raw_dir / safe_filename
        doc_id = f"doc-{uuid.uuid4().hex[:8]}"

        try:
            with open(target_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            saved_paths.append(str(target_path))
            file_size = target_path.stat().st_size

            # Create document in SQLite
            DocumentRepository.create(
                doc_id=doc_id,
                filename=safe_filename,
                stored_path=str(target_path),
                mime_type=file.content_type or "application/octet-stream",
                file_size=file_size,
                status="COMPILING_OKF"
            )
            doc_id_map[safe_filename] = doc_id
        except Exception as e:
            logger.error("Failed to save uploaded file %s: %s", safe_filename, e)
            raise HTTPException(status_code=500, detail=f"Failed to save {safe_filename}")

    # Run OmniOKF compilation
    result = compiler.compile_files(saved_paths)

    # Refresh in-memory knowledge graph
    engine.reload()

    # Link generated nodes and update status in database
    for item in result.file_details:
        doc_id = doc_id_map.get(item.filename)
        if not doc_id:
            continue

        if item.status in ["compiled", "cached"]:
            nodes_to_link = item.node_paths
            if not nodes_to_link:
                stem = Path(item.filename).stem.lower()
                nodes_to_link = [
                    p for p in engine.nodes_by_path.keys()
                    if stem in p.lower()
                ]
            DocumentRepository.link_nodes(doc_id, nodes_to_link)
            DocumentRepository.update_status(
                doc_id,
                status="READY",
                concepts_count=len(nodes_to_link)
            )
        else:
            DocumentRepository.update_status(
                doc_id,
                status="FAILED",
                error=item.error_message
            )

    return result


@router.post("/compile-all", response_model=IngestResponse)
async def compile_all_raw_docs(
    compiler: OKFCompilerService = Depends(get_compiler_service),
    engine: OKFGraphEngine = Depends(get_graph_engine)
):
    """Recompiles all documents present in the raw documents directory."""
    raw_dir = settings.resolved_raw_docs_dir
    raw_files = [str(p) for p in raw_dir.glob("*") if p.is_file() and not p.name.startswith(".")]

    if not raw_files:
        raise HTTPException(status_code=404, detail="No raw documents found to compile.")

    res = compiler.compile_files(raw_files)
    engine.reload()
    return res


@router.get("/manifest")
async def get_compilation_manifest():
    """Returns the current incremental compilation cache manifest."""
    return load_manifest(str(settings.resolved_okf_dir))
