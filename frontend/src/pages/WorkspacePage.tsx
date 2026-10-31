import React, { useState, useEffect, useRef, useCallback } from "react";
import { TopToolbar } from "../components/workspace/TopToolbar";
import { SourceSidebar } from "../components/workspace/SourceSidebar";
import { ChatWorkspace } from "../components/workspace/ChatWorkspace";
import { KnowledgeGraphPanel } from "../components/workspace/KnowledgeGraphPanel";
import { SourcePreviewModal } from "../components/workspace/SourcePreviewModal";
import { DocumentService } from "../services/documentService";
import { ChatService } from "../services/chatService";
import { useProcessing } from "../context/ProcessingContext";
import { SourceDocument, ChatMessage, Conversation, Citation } from "../types/workspace";

export const WorkspacePage: React.FC = () => {
  const { setProcessing } = useProcessing();

  // Sources state
  const [documents, setDocuments] = useState<SourceDocument[]>([]);
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [previewDoc, setPreviewDoc] = useState<SourceDocument | null>(null);

  // Chat & Conversation state
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingStatus, setStreamingStatus] = useState<string | undefined>(undefined);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Knowledge Graph synchronization state
  const [highlightedNodePaths, setHighlightedNodePaths] = useState<string[]>([]);
  const [focusNodePath, setFocusNodePath] = useState<string | null>(null);

  // Panel sizing & collapse state
  const [leftWidth, setLeftWidth] = useState<number>(() => {
    return Number(localStorage.getItem("pg_left_width")) || 280;
  });
  const [rightWidth, setRightWidth] = useState<number>(() => {
    return Number(localStorage.getItem("pg_right_width")) || 380;
  });
  const [leftCollapsed, setLeftCollapsed] = useState<boolean>(() => {
    return localStorage.getItem("pg_left_collapsed") === "true";
  });
  const [rightCollapsed, setRightCollapsed] = useState<boolean>(() => {
    return localStorage.getItem("pg_right_collapsed") === "true";
  });

  const isDraggingLeft = useRef(false);
  const isDraggingRight = useRef(false);

  // Sync isStreaming to global processing flame animation
  useEffect(() => {
    setProcessing(isStreaming, streamingStatus || "Gemma 4 is synthesizing grounded reasoning...");
  }, [isStreaming, streamingStatus, setProcessing]);

  // Load documents and existing conversation
  const loadDocuments = useCallback(async () => {
    try {
      const docs = await DocumentService.listDocuments();
      setDocuments(docs);
      setSelectedDocIds((prev) => {
        if (prev.length === 0 && docs.length > 0) {
          return docs.map((d) => d.id);
        }
        return prev;
      });
    } catch (err) {
      console.error("Could not load documents:", err);
    }
  }, []);

  const loadOrCreateConversation = useCallback(async () => {
    try {
      const convs = await ChatService.listConversations();
      if (convs.length > 0) {
        const active = await ChatService.getConversation(convs[0].id);
        setConversation(active);
        setMessages(active.messages || []);
        if (active.selected_document_ids && active.selected_document_ids.length > 0) {
          setSelectedDocIds(active.selected_document_ids);
        }
      } else {
        const newConv = await ChatService.createConversation("MECH-G Master Documentation");
        setConversation(newConv);
        setMessages([]);
      }
    } catch (err) {
      console.error("Could not initialize conversation:", err);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
    loadOrCreateConversation();
  }, [loadDocuments, loadOrCreateConversation]);

  // Persist panel layout
  useEffect(() => {
    localStorage.setItem("pg_left_width", String(leftWidth));
    localStorage.setItem("pg_right_width", String(rightWidth));
    localStorage.setItem("pg_left_collapsed", String(leftCollapsed));
    localStorage.setItem("pg_right_collapsed", String(rightCollapsed));
  }, [leftWidth, rightWidth, leftCollapsed, rightCollapsed]);

  // Mouse drag handlers for resizing
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDraggingLeft.current) {
        const newW = Math.max(220, Math.min(450, e.clientX));
        setLeftWidth(newW);
      } else if (isDraggingRight.current) {
        const newW = Math.max(280, Math.min(550, window.innerWidth - e.clientX));
        setRightWidth(newW);
      }
    };

    const onMouseUp = () => {
      isDraggingLeft.current = false;
      isDraggingRight.current = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const handleToggleSelectDoc = (id: string) => {
    setSelectedDocIds((prev) => {
      const next = prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id];
      if (conversation) {
        ChatService.updateConversation(conversation.id, undefined, next);
      }
      return next;
    });
  };

  const handleSelectAllDocs = (selectAll: boolean) => {
    const next = selectAll ? documents.map((d) => d.id) : [];
    setSelectedDocIds(next);
    if (conversation) {
      ChatService.updateConversation(conversation.id, undefined, next);
    }
  };

  // Chat message sending with SSE stream
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    let convId = conversation?.id;
    if (!convId) {
      const newConv = await ChatService.createConversation(
        text.slice(0, 35),
        selectedDocIds
      );
      setConversation(newConv);
      convId = newConv.id;
    }

    const tempUserMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      conversation_id: convId,
      role: "user",
      content: text,
      citations: [],
      related_nodes: [],
    };

    const tempAssistantMsgId = `asst-${Date.now()}`;
    const tempAssistantMsg: ChatMessage = {
      id: tempAssistantMsgId,
      conversation_id: convId,
      role: "assistant",
      content: "",
      citations: [],
      related_nodes: [],
      status: "streaming",
    };

    setMessages((prev) => [...prev, tempUserMsg, tempAssistantMsg]);
    setIsStreaming(true);
    setStreamingStatus("Retrieving context from OKF knowledge graph...");

    const controller = new AbortController();
    abortControllerRef.current = controller;

    await ChatService.streamChat(
      convId,
      text,
      selectedDocIds,
      {
        onStatus: (stage) => {
          if (stage === "retrieving_context") {
            setStreamingStatus("Querying OKF knowledge graph...");
          } else if (stage === "generating") {
            setStreamingStatus("Gemma 4 is synthesizing grounded response...");
          }
        },
        onToken: (token) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempAssistantMsgId ? { ...m, content: m.content + token } : m
            )
          );
        },
        onCitation: (citation) => {
          setMessages((prev) =>
            prev.map((m) => {
              if (m.id === tempAssistantMsgId) {
                const exists = m.citations.some(
                  (c) => c.citation_id === citation.citation_id || c.node_path === citation.node_path
                );
                return exists ? m : { ...m, citations: [...m.citations, citation] };
              }
              return m;
            })
          );
        },
        onGraphUpdate: (nodeIds) => {
          setHighlightedNodePaths(nodeIds);
        },
        onDone: (data) => {
          setIsStreaming(false);
          setStreamingStatus(undefined);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempAssistantMsgId ? { ...m, id: data.message_id, status: "completed" } : m
            )
          );
        },
        onError: (err) => {
          setIsStreaming(false);
          setStreamingStatus(undefined);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempAssistantMsgId
                ? { ...m, content: m.content + `\n\n*(Error: ${err})*`, status: "error" }
                : m
            )
          );
        },
      },
      controller.signal
    );
  };

  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      setStreamingStatus(undefined);
    }
  };

  const handleNewChat = async () => {
    handleStopStreaming();
    try {
      const newConv = await ChatService.createConversation(
        "MECH-G Master Documentation",
        selectedDocIds
      );
      setConversation(newConv);
      setMessages([]);
      setHighlightedNodePaths([]);
      setFocusNodePath(null);
    } catch (err) {
      console.error("Could not create new conversation:", err);
    }
  };

  const handleCitationClick = (citation: Citation) => {
    setFocusNodePath(citation.node_path);
    if (rightCollapsed) {
      setRightCollapsed(false);
    }
  };

  const selectedSources = documents.filter((d) => selectedDocIds.includes(d.id));

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0B0B0C] overflow-hidden select-none relative z-10">
      {/* Top Application Toolbar */}
      <TopToolbar
        title="MECH-G Master Documentation"
        sourceCount={documents.length}
        onNewChat={handleNewChat}
      />

      {/* Main 3-Column Floating Islands Layout matching NotebookLM */}
      <div className="flex-1 flex overflow-hidden p-3 pt-1 gap-3 relative">
        {/* Left Floating Island: Sources */}
        <div
          data-tour="sources"
          style={{ width: leftCollapsed ? 48 : leftWidth }}
          className="h-full shrink-0 flex flex-col min-h-0 transition-[width] duration-150 ease-out relative"
        >
          <SourceSidebar
            documents={documents}
            selectedDocIds={selectedDocIds}
            onToggleSelectDoc={handleToggleSelectDoc}
            onSelectAllDocs={handleSelectAllDocs}
            onRefreshDocs={loadDocuments}
            onPreviewDoc={(doc) => setPreviewDoc(doc)}
            isCollapsed={leftCollapsed}
            onToggleCollapse={() => setLeftCollapsed(!leftCollapsed)}
          />

          {!leftCollapsed && (
            <div
              onMouseDown={() => (isDraggingLeft.current = true)}
              className="absolute top-0 -right-1.5 w-3 h-full cursor-col-resize z-20"
              title="Drag to resize sources"
            />
          )}
        </div>

        {/* Center Column: Gemma Conversational Canvas */}
        <div data-tour="chat" className="flex-1 h-full min-h-0 flex flex-col overflow-hidden relative">
          <ChatWorkspace
            messages={messages}
            isStreaming={isStreaming}
            streamingStatus={streamingStatus}
            onSendMessage={handleSendMessage}
            onStopStreaming={handleStopStreaming}
            onNewChat={handleNewChat}
            selectedSources={selectedSources}
            onCitationClick={handleCitationClick}
            workspaceTitle="MECH-G Master Documentation"
          />
        </div>

        {/* Right Floating Island: Studio > Mindmap */}
        <div
          data-tour="graph"
          style={{ width: rightCollapsed ? 48 : rightWidth }}
          className="h-full shrink-0 flex flex-col min-h-0 transition-[width] duration-150 ease-out relative"
        >
          {!rightCollapsed && (
            <div
              onMouseDown={() => (isDraggingRight.current = true)}
              className="absolute top-0 -left-1.5 w-3 h-full cursor-col-resize z-20"
              title="Drag to resize mindmap"
            />
          )}

          <KnowledgeGraphPanel
            highlightedNodePaths={highlightedNodePaths}
            focusNodePath={focusNodePath}
            onClearFocusNode={() => setFocusNodePath(null)}
            isCollapsed={rightCollapsed}
            onToggleCollapse={() => setRightCollapsed(!rightCollapsed)}
            sourceCount={selectedSources.length || 1}
          />
        </div>
      </div>

      {/* Source Preview Modal */}
      <SourcePreviewModal
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
        onSelectGraphNode={(nodePath) => {
          setFocusNodePath(nodePath);
          if (rightCollapsed) setRightCollapsed(false);
        }}
      />
    </div>
  );
};
