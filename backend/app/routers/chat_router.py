import logging
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse

from app.models.chat_models import (
    ChatMessageCreate,
    ChatMessageResponse,
    ConversationCreate,
    ConversationUpdate,
    ConversationResponse,
    Citation
)
from app.services.chat_service import ChatService
from app.database.repository import ConversationRepository, MessageRepository

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/chat", tags=["Gemma Conversational AI"])

_chat_service: Optional[ChatService] = None


def set_chat_service(service: ChatService):
    global _chat_service
    _chat_service = service


def get_chat_service() -> ChatService:
    if _chat_service is None:
        raise HTTPException(status_code=503, detail="Chat service is not yet initialized.")
    return _chat_service


@router.post("/conversations", response_model=ConversationResponse)
async def create_conversation(req: ConversationCreate):
    """Creates a new conversational workspace session."""
    conv = ConversationRepository.create(
        title=req.title or "New Conversation",
        selected_doc_ids=req.selected_document_ids
    )
    return ConversationResponse(
        id=conv["id"],
        title=conv["title"],
        selected_document_ids=conv.get("selected_document_ids") or [],
        created_at=str(conv.get("created_at") or ""),
        updated_at=str(conv.get("updated_at") or ""),
        messages=[]
    )


@router.get("/conversations", response_model=List[ConversationResponse])
async def list_conversations():
    """Lists all active and persisted conversation sessions."""
    convs = ConversationRepository.list_all()
    return [
        ConversationResponse(
            id=c["id"],
            title=c["title"],
            selected_document_ids=c.get("selected_document_ids") or [],
            created_at=str(c.get("created_at") or ""),
            updated_at=str(c.get("updated_at") or "")
        )
        for c in convs
    ]


@router.get("/conversations/{conversation_id}", response_model=ConversationResponse)
async def get_conversation(conversation_id: str):
    """Retrieves conversation details and all message history."""
    conv = ConversationRepository.get(conversation_id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    raw_msgs = MessageRepository.list_by_conversation(conversation_id)
    messages = []
    for m in raw_msgs:
        citations = [Citation(**c) if isinstance(c, dict) else c for c in m.get("citations") or []]
        messages.append(ChatMessageResponse(
            id=m["id"],
            conversation_id=m["conversation_id"],
            role=m["role"],
            content=m["content"],
            citations=citations,
            related_nodes=m.get("related_nodes") or [],
            created_at=str(m.get("created_at") or ""),
            status=m.get("status") or "completed"
        ))

    return ConversationResponse(
        id=conv["id"],
        title=conv["title"],
        selected_document_ids=conv.get("selected_document_ids") or [],
        created_at=str(conv.get("created_at") or ""),
        updated_at=str(conv.get("updated_at") or ""),
        messages=messages
    )


@router.put("/conversations/{conversation_id}")
async def update_conversation(conversation_id: str, req: ConversationUpdate):
    """Updates conversation title or active source document filters."""
    conv = ConversationRepository.get(conversation_id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    ConversationRepository.update(
        conv_id=conversation_id,
        title=req.title,
        selected_doc_ids=req.selected_document_ids
    )
    return {"status": "updated", "id": conversation_id}


@router.delete("/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str):
    """Deletes conversation and message history."""
    deleted = ConversationRepository.delete(conversation_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"message": "Conversation deleted", "id": conversation_id}


@router.get("/conversations/{conversation_id}/messages", response_model=List[ChatMessageResponse])
async def list_messages(conversation_id: str):
    """Retrieves message history for a conversation."""
    raw_msgs = MessageRepository.list_by_conversation(conversation_id)
    results = []
    for m in raw_msgs:
        citations = [Citation(**c) if isinstance(c, dict) else c for c in m.get("citations") or []]
        results.append(ChatMessageResponse(
            id=m["id"],
            conversation_id=m["conversation_id"],
            role=m["role"],
            content=m["content"],
            citations=citations,
            related_nodes=m.get("related_nodes") or [],
            created_at=str(m.get("created_at") or ""),
            status=m.get("status") or "completed"
        ))
    return results


@router.post("/conversations/{conversation_id}/stream")
async def stream_chat_response(
    conversation_id: str,
    req: ChatMessageCreate,
    chat_service: ChatService = Depends(get_chat_service)
):
    """
    Server-Sent Events (SSE) streaming endpoint.
    Streams token-by-token Gemma output, live verified citations, and graph node updates.
    """
    conv = ConversationRepository.get(conversation_id)
    if not conv:
        # Create conversation on the fly if it does not exist
        conv = ConversationRepository.create(
            title=req.message[:35] + ("..." if len(req.message) > 35 else ""),
            selected_doc_ids=req.selected_document_ids
        )
        conversation_id = conv["id"]

    # Use document IDs from request or from conversation record
    selected_docs = req.selected_document_ids if req.selected_document_ids is not None else conv.get("selected_document_ids")

    generator = chat_service.stream_chat(
        conversation_id=conversation_id,
        message=req.message,
        selected_document_ids=selected_docs
    )

    return StreamingResponse(
        generator,
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

