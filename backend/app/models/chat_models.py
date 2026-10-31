from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class Citation(BaseModel):
    citation_id: str
    document_id: Optional[str] = None
    source_name: str
    node_path: str
    heading: Optional[str] = None
    excerpt: str
    verification_status: str = "verified"  # verified, unverified


class ChatMessageCreate(BaseModel):
    message: str = Field(..., min_length=1, description="Technician or engineer question")
    selected_document_ids: Optional[List[str]] = Field(default=None, description="Filter retrieval to selected source documents")
    model: Optional[str] = Field(default=None, description="Optional model identifier override")


class ChatMessageResponse(BaseModel):
    id: str
    conversation_id: str
    role: str
    content: str
    citations: List[Citation] = Field(default_factory=list)
    related_nodes: List[str] = Field(default_factory=list)
    created_at: Optional[str] = None
    status: str = "completed"


class ConversationCreate(BaseModel):
    title: Optional[str] = "New Conversation"
    selected_document_ids: Optional[List[str]] = Field(default_factory=list)


class ConversationUpdate(BaseModel):
    title: Optional[str] = None
    selected_document_ids: Optional[List[str]] = None


class ConversationResponse(BaseModel):
    id: str
    title: str
    selected_document_ids: List[str] = Field(default_factory=list)
    created_at: str
    updated_at: str
    messages: Optional[List[ChatMessageResponse]] = None


class DocumentResponse(BaseModel):
    id: str
    filename: str
    stored_path: str
    mime_type: Optional[str] = None
    file_size: int = 0
    status: str
    concepts_count: int = 0
    node_paths: List[str] = Field(default_factory=list)
    error: Optional[str] = None
    created_at: str
    updated_at: str
    source_metadata: Dict[str, Any] = Field(default_factory=dict)


class ReactFlowNodeData(BaseModel):
    title: str
    category: str
    description: Optional[str] = ""
    tags: List[str] = Field(default_factory=list)
    relativePath: str
    partNumbers: List[str] = Field(default_factory=list)
    sourceDocumentIds: List[str] = Field(default_factory=list)


class ReactFlowNode(BaseModel):
    id: str
    type: str = "conceptNode"
    position: Dict[str, float]
    data: ReactFlowNodeData


class ReactFlowEdgeData(BaseModel):
    relationship: str


class ReactFlowEdge(BaseModel):
    id: str
    source: str
    target: str
    type: str = "smoothstep"
    animated: bool = False
    data: Optional[ReactFlowEdgeData] = None


class ReactFlowGraphResponse(BaseModel):
    nodes: List[ReactFlowNode]
    edges: List[ReactFlowEdge]
    stats: Dict[str, Any]
