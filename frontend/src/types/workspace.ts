export interface SourceDocument {
  id: string;
  filename: string;
  stored_path: string;
  mime_type?: string;
  file_size: number;
  status: "UPLOADING" | "PARSING" | "COMPILING_OKF" | "INDEXING_GRAPH" | "READY" | "FAILED";
  concepts_count: number;
  node_paths: string[];
  error?: string | null;
  created_at: string;
  updated_at: string;
  source_metadata?: Record<string, any>;
}

export interface Citation {
  citation_id: string;
  document_id?: string;
  source_name: string;
  node_path: string;
  heading?: string;
  excerpt: string;
  verification_status: "verified" | "unverified";
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  citations: Citation[];
  related_nodes: string[];
  created_at?: string;
  status?: "streaming" | "completed" | "error";
}

export interface Conversation {
  id: string;
  title: string;
  selected_document_ids: string[];
  created_at: string;
  updated_at: string;
  messages?: ChatMessage[];
}

export interface ReactFlowNodeData {
  title: string;
  category: string;
  description?: string;
  tags: string[];
  relativePath: string;
  partNumbers?: string[];
  sourceDocumentIds?: string[];
  isHighlighted?: boolean;
}

export interface ReactFlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: ReactFlowNodeData;
}

export interface ReactFlowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  data?: {
    relationship: string;
  };
}

export interface ReactFlowGraphData {
  nodes: ReactFlowNode[];
  edges: ReactFlowEdge[];
  stats: {
    total_nodes: number;
    total_edges: number;
    category_counts: Record<string, number>;
  };
}
