import sqlite3
import json
import logging
from pathlib import Path
from contextlib import contextmanager
from typing import Generator
from app.config import settings

logger = logging.getLogger(__name__)


def get_db_path() -> Path:
    data_dir = settings.resolved_okf_dir.parent
    data_dir.mkdir(parents=True, exist_ok=True)
    return data_dir / "workspace.db"


@contextmanager
def get_db_connection() -> Generator[sqlite3.Connection, None, None]:
    """Provides a transactional SQLite database connection."""
    db_path = get_db_path()
    conn = sqlite3.connect(str(db_path), check_same_thread=False, timeout=10.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_database() -> None:
    """Initializes SQLite schema for documents, conversations, messages, and provenance."""
    db_path = get_db_path()
    logger.info("Initializing SQLite database at: %s", db_path)
    with get_db_connection() as conn:
        conn.executescript("""
        CREATE TABLE IF NOT EXISTS documents (
            id TEXT PRIMARY KEY,
            filename TEXT NOT NULL,
            stored_path TEXT NOT NULL,
            mime_type TEXT,
            file_size INTEGER DEFAULT 0,
            status TEXT NOT NULL,
            concepts_count INTEGER DEFAULT 0,
            source_metadata TEXT DEFAULT '{}',
            error TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS document_nodes (
            document_id TEXT NOT NULL,
            node_path TEXT NOT NULL,
            PRIMARY KEY (document_id, node_path),
            FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS conversations (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            selected_document_ids TEXT DEFAULT '[]',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            conversation_id TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            citations_json TEXT DEFAULT '[]',
            related_nodes_json TEXT DEFAULT '[]',
            status TEXT DEFAULT 'completed',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_messages_conv_id ON messages(conversation_id);
        CREATE INDEX IF NOT EXISTS idx_doc_nodes_path ON document_nodes(node_path);
        """)

        # Seed baseline document if documents table is empty and OKF bundle exists
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM documents")
        count = cursor.fetchone()[0]
        if count == 0 and settings.resolved_okf_dir.exists():
            okf_nodes = [
                p.relative_to(settings.resolved_okf_dir).as_posix()
                for p in settings.resolved_okf_dir.glob("**/*.md")
                if p.name != "index.md"
            ]
            if okf_nodes:
                baseline_id = "doc-baseline-industrial"
                cursor.execute("""
                    INSERT INTO documents (id, filename, stored_path, mime_type, file_size, status, concepts_count, source_metadata, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
                """, (
                    baseline_id,
                    "Industrial Machinery Field Service Manual.pdf",
                    str(settings.resolved_okf_dir / "index.md"),
                    "application/pdf",
                    245760,
                    "READY",
                    len(okf_nodes),
                    json.dumps({"description": "Pre-indexed field diagnostic manual with hydraulic and electrical subsystems.", "generated_nodes": okf_nodes})
                ))
                for np in okf_nodes:
                    cursor.execute("""
                        INSERT OR IGNORE INTO document_nodes (document_id, node_path) VALUES (?, ?)
                    """, (baseline_id, np))
                logger.info("Seeded baseline document '%s' with %d OKF nodes.", baseline_id, len(okf_nodes))
