import logging
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, Depends

from app.models.okf_models import OKFGraphStats, OKFNode
from app.services.graph_engine import OKFGraphEngine
from app.services.okf_compiler.indexer import build_raw_mermaid_graph

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/graph", tags=["Knowledge Graph"])

# Shared engine instance initialized in main.py lifespan
_graph_engine: OKFGraphEngine = None


def set_graph_engine(engine: OKFGraphEngine):
    global _graph_engine
    _graph_engine = engine


def get_graph_engine() -> OKFGraphEngine:
    if _graph_engine is None:
        raise HTTPException(status_code=503, detail="Graph engine is not yet initialized.")
    return _graph_engine


@router.get("/stats", response_model=OKFGraphStats)
async def get_graph_statistics(engine: OKFGraphEngine = Depends(get_graph_engine)):
    """Returns total node count, edge count, and category breakdown."""
    return engine.get_stats()


@router.get("/nodes")
async def list_all_nodes(engine: OKFGraphEngine = Depends(get_graph_engine)) -> List[Dict[str, Any]]:
    """Returns a summary list of all nodes currently loaded in the knowledge graph."""
    return [
        {
            "id": node.id,
            "relative_path": node.relative_path,
            "category": node.category,
            "title": node.frontmatter.title,
            "description": node.frontmatter.description,
            "tags": node.frontmatter.tags,
            "part_numbers": node.frontmatter.part_numbers,
            "outgoing_count": len(node.outgoing_links),
        }
        for node in engine.nodes_by_path.values()
    ]


@router.get("/nodes/{node_path:path}", response_model=OKFNode)
async def get_node_by_path(node_path: str, engine: OKFGraphEngine = Depends(get_graph_engine)):
    """Retrieves full content, frontmatter, and connections for a specific OKF node."""
    clean_path = node_path.strip().lstrip("/")
    node = engine.nodes_by_path.get(clean_path)
    if not node:
        # Try matching by filename stem
        for path, n in engine.nodes_by_path.items():
            if path.endswith(clean_path) or clean_path in path:
                node = n
                break

    if not node:
        raise HTTPException(status_code=404, detail=f"Node '{clean_path}' not found in OKF graph")

    return node


@router.get("/mermaid")
async def get_graph_mermaid(engine: OKFGraphEngine = Depends(get_graph_engine)) -> Dict[str, str]:
    """Returns the live Mermaid flowchart definition of the in-memory knowledge graph."""
    # Convert nodes_by_path into format expected by indexer
    concepts_dict = {
        node.id: {
            "metadata": {
                "filename": node.id,
                "title": node.frontmatter.title,
                "type": node.category
            },
            "content": node.content
        }
        for node in engine.nodes_by_path.values()
    }
    raw_mermaid = build_raw_mermaid_graph(concepts_dict)
    return {"mermaid": raw_mermaid}


@router.post("/reload", response_model=OKFGraphStats)
async def reload_graph(engine: OKFGraphEngine = Depends(get_graph_engine)):
    """Forces a refresh of the knowledge graph from disk."""
    engine.reload()
    return engine.get_stats()

