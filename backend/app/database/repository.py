import json
import uuid
from typing import List, Optional, Dict, Any
from app.database.connection import get_db_connection


class DocumentRepository:
    @staticmethod
    def create(
        doc_id: str,
        filename: str,
        stored_path: str,
        mime_type: str = "application/octet-stream",
        file_size: int = 0,
        status: str = "UPLOADING",
        source_metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        meta_json = json.dumps(source_metadata or {})
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO documents (id, filename, stored_path, mime_type, file_size, status, source_metadata, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
            """, (doc_id, filename, stored_path, mime_type, file_size, status, meta_json))
        return DocumentRepository.get(doc_id)

    @staticmethod
    def list_all() -> List[Dict[str, Any]]:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT d.*, COUNT(dn.node_path) as actual_nodes_count
                FROM documents d
                LEFT JOIN document_nodes dn ON d.id = dn.document_id
                GROUP BY d.id
                ORDER BY d.created_at DESC
            """)
            rows = cursor.fetchall()
            results = []
            for r in rows:
                doc = dict(r)
                try:
                    doc["source_metadata"] = json.loads(doc["source_metadata"] or "{}")
                except Exception:
                    doc["source_metadata"] = {}
                results.append(doc)
            return results

    @staticmethod
    def get(doc_id: str) -> Optional[Dict[str, Any]]:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM documents WHERE id = ?", (doc_id,))
            row = cursor.fetchone()
            if not row:
                return None
            doc = dict(row)
            try:
                doc["source_metadata"] = json.loads(doc["source_metadata"] or "{}")
            except Exception:
                doc["source_metadata"] = {}
            cursor.execute("SELECT node_path FROM document_nodes WHERE document_id = ?", (doc_id,))
            doc["node_paths"] = [r[0] for r in cursor.fetchall()]
            return doc

    @staticmethod
    def update_status(
        doc_id: str,
        status: str,
        concepts_count: Optional[int] = None,
        error: Optional[str] = None,
        source_metadata: Optional[Dict[str, Any]] = None
    ) -> None:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            updates = ["status = ?", "updated_at = datetime('now')"]
            params: list = [status]
            if concepts_count is not None:
                updates.append("concepts_count = ?")
                params.append(concepts_count)
            if error is not None:
                updates.append("error = ?")
                params.append(error)
            if source_metadata is not None:
                updates.append("source_metadata = ?")
                params.append(json.dumps(source_metadata))
            params.append(doc_id)
            cursor.execute(f"UPDATE documents SET {', '.join(updates)} WHERE id = ?", params)

    @staticmethod
    def link_nodes(doc_id: str, node_paths: List[str]) -> None:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            for np in node_paths:
                cursor.execute("INSERT OR IGNORE INTO document_nodes (document_id, node_path) VALUES (?, ?)", (doc_id, np))

    @staticmethod
    def get_nodes_for_documents(doc_ids: List[str]) -> List[str]:
        if not doc_ids:
            return []
        placeholders = ",".join("?" for _ in doc_ids)
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(f"SELECT DISTINCT node_path FROM document_nodes WHERE document_id IN ({placeholders})", doc_ids)
            return [r[0] for r in cursor.fetchall()]

    @staticmethod
    def delete(doc_id: str) -> Optional[Dict[str, Any]]:
        doc = DocumentRepository.get(doc_id)
        if not doc:
            return None
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM document_nodes WHERE document_id = ?", (doc_id,))
            cursor.execute("DELETE FROM documents WHERE id = ?", (doc_id,))
        return doc


class ConversationRepository:
    @staticmethod
    def create(title: str = "New Conversation", selected_doc_ids: Optional[List[str]] = None) -> Dict[str, Any]:
        conv_id = f"conv-{uuid.uuid4().hex[:8]}"
        docs_json = json.dumps(selected_doc_ids or [])
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO conversations (id, title, selected_document_ids, created_at, updated_at)
                VALUES (?, ?, ?, datetime('now'), datetime('now'))
            """, (conv_id, title, docs_json))
        return ConversationRepository.get(conv_id)

    @staticmethod
    def list_all() -> List[Dict[str, Any]]:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM conversations ORDER BY updated_at DESC")
            rows = cursor.fetchall()
            results = []
            for r in rows:
                c = dict(r)
                try:
                    c["selected_document_ids"] = json.loads(c["selected_document_ids"] or "[]")
                except Exception:
                    c["selected_document_ids"] = []
                results.append(c)
            return results

    @staticmethod
    def get(conv_id: str) -> Optional[Dict[str, Any]]:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM conversations WHERE id = ?", (conv_id,))
            row = cursor.fetchone()
            if not row:
                return None
            c = dict(row)
            try:
                c["selected_document_ids"] = json.loads(c["selected_document_ids"] or "[]")
            except Exception:
                c["selected_document_ids"] = []
            return c

    @staticmethod
    def update(conv_id: str, title: Optional[str] = None, selected_doc_ids: Optional[List[str]] = None) -> None:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            updates = ["updated_at = datetime('now')"]
            params: list = []
            if title is not None:
                updates.append("title = ?")
                params.append(title)
            if selected_doc_ids is not None:
                updates.append("selected_document_ids = ?")
                params.append(json.dumps(selected_doc_ids))
            params.append(conv_id)
            cursor.execute(f"UPDATE conversations SET {', '.join(updates)} WHERE id = ?", params)

    @staticmethod
    def delete(conv_id: str) -> bool:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM messages WHERE conversation_id = ?", (conv_id,))
            cursor.execute("DELETE FROM conversations WHERE id = ?", (conv_id,))
            return cursor.rowcount > 0


class MessageRepository:
    @staticmethod
    def create(
        message_id: str,
        conversation_id: str,
        role: str,
        content: str,
        citations: Optional[List[Dict[str, Any]]] = None,
        related_nodes: Optional[List[str]] = None,
        status: str = "completed"
    ) -> Dict[str, Any]:
        cit_json = json.dumps(citations or [])
        rel_json = json.dumps(related_nodes or [])
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO messages (id, conversation_id, role, content, citations_json, related_nodes_json, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
            """, (message_id, conversation_id, role, content, cit_json, rel_json, status))
            cursor.execute("UPDATE conversations SET updated_at = datetime('now') WHERE id = ?", (conversation_id,))
        return {
            "id": message_id, "conversation_id": conversation_id, "role": role,
            "content": content, "citations": citations or [], "related_nodes": related_nodes or [], "status": status
        }

    @staticmethod
    def list_by_conversation(conv_id: str) -> List[Dict[str, Any]]:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC", (conv_id,))
            rows = cursor.fetchall()
            results = []
            for r in rows:
                m = dict(r)
                try:
                    m["citations"] = json.loads(m["citations_json"] or "[]")
                except Exception:
                    m["citations"] = []
                try:
                    m["related_nodes"] = json.loads(m["related_nodes_json"] or "[]")
                except Exception:
                    m["related_nodes"] = []
                results.append(m)
            return results

