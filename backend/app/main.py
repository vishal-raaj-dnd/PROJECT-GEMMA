import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.services.graph_engine import OKFGraphEngine
from app.services.gemma_client import GemmaClient
from app.services.diagnostic_service import DiagnosticService
from app.routers import ingest_router, graph_router, diagnostic_router

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper(), logging.INFO),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("fieldops_api")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initializes in-memory graph engine and diagnostic services on startup."""
    logger.info("Starting FieldOps Diagnostic Engine...")
    logger.info("OKF Storage Directory: %s", settings.resolved_okf_dir)
    logger.info("Gemma Model: %s", settings.gemma_model)

    # 1. Initialize Graph Engine
    graph_engine = OKFGraphEngine(root_dir=str(settings.resolved_okf_dir))
    graph_router.set_graph_engine(graph_engine)

    # 2. Initialize Gemma Client & Diagnostic Orchestrator
    gemma_client = GemmaClient()
    diag_service = DiagnosticService(graph_engine=graph_engine, gemma_client=gemma_client)
    diagnostic_router.set_diagnostic_service(diag_service)

    stats = graph_engine.get_stats()
    logger.info("Knowledge Graph initialized: %d nodes, %d edges.", stats.total_nodes, stats.total_edges)

    yield

    logger.info("Shutting down FieldOps Diagnostic Engine...")


app = FastAPI(
    title="Field Engineering & Hardware Diagnostic Engine API",
    description=(
        "Production-grade, offline-first multimodal hardware diagnostic engine. "
        "Powered by OmniOKF knowledge graphs, Gemma multimodal vision, and a deterministic verifiable citation engine."
    ),
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware for local frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(ingest_router.router)
app.include_router(graph_router.router)
app.include_router(diagnostic_router.router)


@app.get("/", tags=["Health"])
async def root():
    return {
        "system": "Field Engineering & Hardware Diagnostic Engine",
        "version": "1.0.0",
        "status": "operational",
        "docs_url": "/docs",
        "model": settings.gemma_model
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy"}

