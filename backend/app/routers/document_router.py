import os
import logging
from typing import List
from pathlib import Path
from fastapi import APIRouter, HTTPException, Depends

from app.config import settings
from app.models.chat_models import DocumentResponse
from app.database.repository import DocumentRepository
from app.services.graph_engine import OKFGraphEngine
from app.routers.graph_router import get_graph_engine
from app.services.okf_compiler.compiler_service import OKFCompilerService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/documents", tags=["Document Management"])


@router.get("", response_model=List[DocumentResponse])
async def list_documents():
    """Lists all uploaded documents and source library items with processing status."""
    docs = DocumentRepository.list_all()
    results = []
    for d in docs:
        results.append(DocumentResponse(
            id=d["id"],
            filename=d["filename"],
            stored_path=d["stored_path"],
            mime_type=d.get("mime_type"),
            file_size=d.get("file_size") or 0,
            status=d.get("status") or "READY",
            concepts_count=d.get("actual_nodes_count") or d.get("concepts_count") or 0,
            node_paths=d.get("node_paths") or [],
            error=d.get("error"),
            created_at=str(d.get("created_at") or ""),
            updated_at=str(d.get("updated_at") or ""),
            source_metadata=d.get("source_metadata") or {}
        ))
    return results


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: str):
    """Retrieves metadata and associated OKF nodes for a single document."""
    doc = DocumentRepository.get(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return DocumentResponse(
        id=doc["id"],
        filename=doc["filename"],
        stored_path=doc["stored_path"],
        mime_type=doc.get("mime_type"),
        file_size=doc.get("file_size") or 0,
        status=doc.get("status") or "READY",
        concepts_count=len(doc.get("node_paths") or []),
        node_paths=doc.get("node_paths") or [],
        error=doc.get("error"),
        created_at=str(doc.get("created_at") or ""),
        updated_at=str(doc.get("updated_at") or ""),
        source_metadata=doc.get("source_metadata") or {}
    )


@router.delete("/{document_id}")
async def delete_document(document_id: str, engine: OKFGraphEngine = Depends(get_graph_engine)):
    """
    Safely deletes a source document, deletes its associated generated OKF files,
    and updates the in-memory knowledge graph.
    """
    doc = DocumentRepository.get(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # Safe node removal
    node_paths = doc.get("node_paths", [])
    okf_dir = settings.resolved_okf_dir
    for np in node_paths:
        target_file = okf_dir / np
        if target_file.exists():
            try:
                target_file.unlink()
                logger.info("Deleted generated node file: %s", target_file)
            except Exception as e:
                logger.warning("Could not delete node file %s: %s", target_file, e)

    # Remove stored raw file if exists
    raw_path = Path(doc["stored_path"])
    if raw_path.exists() and raw_path.is_file() and raw_path.name != "index.md":
        try:
            raw_path.unlink()
        except Exception as e:
            logger.warning("Could not delete raw file %s: %s", raw_path, e)

    DocumentRepository.delete(document_id)
    engine.reload()

    return {"message": f"Document '{doc['filename']}' deleted successfully", "id": document_id}


@router.post("/{document_id}/recompile")
async def recompile_document(
    document_id: str,
    engine: OKFGraphEngine = Depends(get_graph_engine)
):
    """Recompiles a single source document into OKF nodes."""
    doc = DocumentRepository.get(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    raw_path = Path(doc["stored_path"])
    if not raw_path.exists():
        raise HTTPException(status_code=400, detail="Original source file is missing from disk")

    compiler = OKFCompilerService(output_dir=str(settings.resolved_okf_dir))
    DocumentRepository.update_status(document_id, "COMPILING_OKF")

    try:
        res = compiler.compile_files([str(raw_path)], force=True)
        engine.reload()
        matched_nodes = []
        if res.file_details:
            matched_nodes = res.file_details[0].node_paths
        if not matched_nodes:
            stem = raw_path.stem.lower()
            matched_nodes = [
                p for p in engine.nodes_by_path.keys()
                if stem in p.lower()
            ]
        DocumentRepository.link_nodes(document_id, matched_nodes)
        DocumentRepository.update_status(document_id, "READY", concepts_count=len(matched_nodes))
        return {"status": "recompiled", "concepts_created": len(matched_nodes)}
    except Exception as e:
        DocumentRepository.update_status(document_id, "FAILED", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))

