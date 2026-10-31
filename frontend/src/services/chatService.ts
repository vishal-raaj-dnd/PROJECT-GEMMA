import { API_BASE, fetchWithTimeout } from "./apiClient";
import { Conversation, ChatMessage, Citation } from "../types/workspace";

export interface StreamCallbacks {
  onStatus?: (stage: string) => void;
  onToken?: (text: string) => void;
  onCitation?: (citation: Citation) => void;
  onGraphUpdate?: (nodeIds: string[]) => void;
  onDone?: (data: { message_id: string; finish_reason: string }) => void;
  onError?: (error: string) => void;
}

export class ChatService {
  static async createConversation(title = "New Conversation", selectedDocIds: string[] = []): Promise<Conversation> {
    const res = await fetchWithTimeout("/api/chat/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, selected_document_ids: selectedDocIds }),
    });
    if (!res.ok) {
      throw new Error(`Failed to create conversation: ${res.statusText}`);
    }
    return await res.json();
  }

  static async listConversations(): Promise<Conversation[]> {
    const res = await fetchWithTimeout("/api/chat/conversations", { method: "GET" });
    if (!res.ok) {
      throw new Error(`Failed to list conversations: ${res.statusText}`);
    }
    return await res.json();
  }

  static async getConversation(id: string): Promise<Conversation> {
    const res = await fetchWithTimeout(`/api/chat/conversations/${id}`, { method: "GET" });
    if (!res.ok) {
      throw new Error(`Failed to get conversation: ${res.statusText}`);
    }
    return await res.json();
  }

  static async deleteConversation(id: string): Promise<void> {
    const res = await fetchWithTimeout(`/api/chat/conversations/${id}`, { method: "DELETE" });
    if (!res.ok) {
      throw new Error(`Failed to delete conversation: ${res.statusText}`);
    }
  }

  static async updateConversation(id: string, title?: string, selectedDocIds?: string[]): Promise<void> {
    const res = await fetchWithTimeout(`/api/chat/conversations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, selected_document_ids: selectedDocIds }),
    });
    if (!res.ok) {
      throw new Error(`Failed to update conversation: ${res.statusText}`);
    }
  }

  static async streamChat(
    conversationId: string,
    message: string,
    selectedDocIds: string[] = [],
    callbacks: StreamCallbacks,
    signal?: AbortSignal
  ): Promise<void> {
    const res = await fetch(`${API_BASE}/api/chat/conversations/${conversationId}/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        selected_document_ids: selectedDocIds,
      }),
      signal,
    });

    if (!res.ok) {
      const err = await res.text();
      callbacks.onError?.(err || res.statusText);
      return;
    }

    if (!res.body) {
      callbacks.onError?.("ReadableStream not supported on this browser.");
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let currentEvent = "";

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        // Keep the last partial line in the buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) {
            currentEvent = "";
            continue;
          }

          if (trimmed.startsWith("event:")) {
            currentEvent = trimmed.substring(6).trim();
          } else if (trimmed.startsWith("data:")) {
            const rawData = trimmed.substring(5).trim();
            try {
              const data = JSON.parse(rawData);
              if (currentEvent === "status") {
                callbacks.onStatus?.(data.stage);
              } else if (currentEvent === "token") {
                callbacks.onToken?.(data.text);
              } else if (currentEvent === "citation") {
                callbacks.onCitation?.(data as Citation);
              } else if (currentEvent === "graph_update") {
                callbacks.onGraphUpdate?.(data.node_ids);
              } else if (currentEvent === "done") {
                callbacks.onDone?.(data);
              } else if (currentEvent === "error") {
                callbacks.onError?.(data.message);
              }
            } catch (err) {
              console.warn("Could not parse SSE JSON chunk:", rawData, err);
            }
          }
        }
      }
    } catch (e: any) {
      if (e.name === "AbortError") {
        console.log("Chat stream aborted by user.");
      } else {
        callbacks.onError?.(e.message || "Stream connection failed");
      }
    } finally {
      reader.releaseLock();
    }
  }
}
