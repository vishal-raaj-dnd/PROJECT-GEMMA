import re
import json
import uuid
import logging
from typing import AsyncGenerator, List, Optional, Dict, Any

from app.services.graph_engine import OKFGraphEngine
from app.services.gemma_client import GemmaClient
from app.services.retrieval_service import RetrievalService
from app.database.repository import MessageRepository, ConversationRepository, DocumentRepository

logger = logging.getLogger(__name__)

CITATION_REGEX = re.compile(r"\[\^([a-zA-Z0-9_\-/\.]+?)(?:#([a-zA-Z0-9_\-]+))?\]")


class ChatService:
    """Orchestrates document-grounded conversational chat with SSE streaming and citation verification."""

    def __init__(self, graph_engine: OKFGraphEngine, gemma_client: GemmaClient, retrieval_service: RetrievalService):
        self.graph_engine = graph_engine
        self.gemma_client = gemma_client
        self.retrieval_service = retrieval_service

    async def stream_chat(
        self,
        conversation_id: str,
        message: str,
        selected_document_ids: Optional[List[str]] = None
    ) -> AsyncGenerator[str, None]:
        """Yields SSE events for real-time token streaming and citation updates."""
        # 1. Save user message to database
        user_msg_id = f"msg-{uuid.uuid4().hex[:8]}"
        MessageRepository.create(
            message_id=user_msg_id,
            conversation_id=conversation_id,
            role="user",
            content=message
        )

        # Emit initial status
        yield f"event: status\ndata: {json.dumps({'stage': 'retrieving_context'})}\n\n"

        # 2. Retrieve grounded knowledge nodes
        retrieval_res = self.retrieval_service.retrieve(
            query=message,
            selected_document_ids=selected_document_ids
        )
        context_text = retrieval_res["context_text"]
        retrieved_nodes = retrieval_res["retrieved_nodes"]
        node_paths = retrieval_res["node_paths"]

        # Emit graph update for nodes being inspected
        if node_paths:
            yield f"event: graph_update\ndata: {json.dumps({'node_ids': node_paths})}\n\n"

        yield f"event: status\ndata: {json.dumps({'stage': 'generating'})}\n\n"

        # 3. Construct system instruction & prompt
        system_instruction = (
            "You are an expert field engineering AI assistant and hardware diagnostics intelligence system "
            "for industrial machinery, powered by Open Knowledge Format (OKF) knowledge graphs and Gemma.\n"
            "ANTI-HALLUCINATION RULES:\n"
            "1. Ground all technical assertions strictly in the provided OKF Context.\n"
            "2. Whenever citing facts, parts, safety interlocks, or repair steps, reference the exact node and heading "
            "using citation format: [^node/relative/path.md#heading].\n"
            "3. Format your answers clearly with Markdown headings, lists, tables, and separate Mermaid diagram blocks (```mermaid ... ```) for workflows, schematics, or decision trees.\n"
            "   IMPORTANT: Always isolate diagrams in their own separate ```mermaid blocks with standard graph syntax (e.g. graph TD / flowchart LR) with quotes around node labels.\n"
            "4. Highlight safety prerequisites and OSHA lockout/tagout (LOTO) protocols prominently."
        )

        prompt = (
            f"=== VERIFIED OKF KNOWLEDGE CONTEXT ===\n"
            f"{context_text}\n"
            f"=== END CONTEXT ===\n\n"
            f"Technician / Engineer Question: {message}\n"
            f"Provide a clear, authoritative, and citation-grounded response."
        )

        # 4. Stream response from Gemma
        accumulated_text = ""
        try:
            async for chunk in self.gemma_client.generate_chat_stream(prompt, system_instruction):
                accumulated_text += chunk
                yield f"event: token\ndata: {json.dumps({'text': chunk})}\n\n"
        except Exception as e:
            logger.error("Error during streaming generation: %s", e)
            yield f"event: error\ndata: {json.dumps({'message': str(e)})}\n\n"
            return

        # 5. Extract and audit citations
        citations = self._audit_citations(accumulated_text)

        # Emit verified citations
        for cite in citations:
            yield f"event: citation\ndata: {json.dumps(cite)}\n\n"

        # 6. Save assistant message with citations to database
        assistant_msg_id = f"msg-{uuid.uuid4().hex[:8]}"
        MessageRepository.create(
            message_id=assistant_msg_id,
            conversation_id=conversation_id,
            role="assistant",
            content=accumulated_text,
            citations=citations,
            related_nodes=node_paths,
            status="completed"
        )

        # 7. Emit done event
        yield f"event: done\ndata: {json.dumps({'message_id': assistant_msg_id, 'finish_reason': 'stop'})}\n\n"

    def _audit_citations(self, text: str) -> List[Dict[str, Any]]:
        """Finds all citation anchors in text and validates them against the graph."""
        matches = CITATION_REGEX.findall(text)
        citations = []
        seen = set()

        for idx, match in enumerate(matches):
            raw_path, heading = match
            clean_path = raw_path.strip().lstrip("/")
            cite_key = f"{clean_path}#{heading}"
            if cite_key in seen:
                continue
            seen.add(cite_key)

            node = self.graph_engine.nodes_by_path.get(clean_path)
            if not node:
                # Try suffix match
                for p, n in self.graph_engine.nodes_by_path.items():
                    if p.endswith(clean_path) or Path(p).stem == Path(clean_path).stem:
                        node = n
                        clean_path = p
                        break

            if node:
                source_name = node.frontmatter.title or Path(node.relative_path).name
                excerpt = node.content[:250].strip() + "..."
                citations.append({
                    "citation_id": f"cite_{idx+1}",
                    "source_name": source_name,
                    "node_path": clean_path,
                    "heading": heading or node.frontmatter.title,
                    "excerpt": excerpt,
                    "verification_status": "verified"
                })
            else:
                citations.append({
                    "citation_id": f"cite_{idx+1}",
                    "source_name": clean_path,
                    "node_path": clean_path,
                    "heading": heading or "Reference",
                    "excerpt": "Unverified citation anchor",
                    "verification_status": "unverified"
                })

        return citations
