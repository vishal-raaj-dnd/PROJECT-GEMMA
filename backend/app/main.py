import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.services.graph_engine import OKFGraphEngine
from app.services.gemma_client import GemmaClient
from app.services.diagnostic_service import DiagnosticService
from app.services.retrieval_service import RetrievalService
from app.services.chat_service import ChatService
from app.database.connection import init_database
from app.routers import (
    ingest_router,
    graph_router,
    diagnostic_router,
    document_router,
    chat_router
)

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper(), logging.INFO),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("fieldops_api")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initializes SQLite database, in-memory graph engine, and chat services on startup."""
    logger.info("Starting PROJECT-GEMMA Knowledge & Diagnostic Engine...")
    logger.info("OKF Storage Directory: %s", settings.resolved_okf_dir)
    logger.info("Gemma Model: %s", settings.gemma_model)

    # 1. Initialize SQLite persistence
    init_database()

    # 2. Initialize Graph Engine
    graph_engine = OKFGraphEngine(root_dir=str(settings.resolved_okf_dir))
    graph_router.set_graph_engine(graph_engine)

    # 3. Initialize Gemma Client & Diagnostic Orchestrator
    gemma_client = GemmaClient()
    diag_service = DiagnosticService(graph_engine=graph_engine, gemma_client=gemma_client)
    diagnostic_router.set_diagnostic_service(diag_service)

    # 4. Initialize RAG Retrieval & Chat Service
    retrieval_service = RetrievalService(graph_engine=graph_engine)
    chat_service = ChatService(
        graph_engine=graph_engine,
        gemma_client=gemma_client,
        retrieval_service=retrieval_service
    )
    chat_router.set_chat_service(chat_service)

    stats = graph_engine.get_stats()
    logger.info("Knowledge Graph initialized: %d nodes, %d edges.", stats.total_nodes, stats.total_edges)

    yield

    logger.info("Shutting down PROJECT-GEMMA Engine...")


app = FastAPI(
    title="PROJECT-GEMMA Knowledge & Diagnostic Engine API",
    description=(
        "Production-grade, offline-first multimodal knowledge workspace and hardware diagnostic engine. "
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
app.include_router(document_router.router)
app.include_router(chat_router.router)


@app.get("/", tags=["Health"])
async def root():
    return {
        "system": "PROJECT-GEMMA AI Knowledge Workspace",
        "version": "1.0.0",
        "status": "operational",
        "docs_url": "/docs",
        "model": settings.gemma_model
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy"}
