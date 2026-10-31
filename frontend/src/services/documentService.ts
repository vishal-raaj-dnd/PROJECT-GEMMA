import { API_BASE, fetchWithTimeout } from "./apiClient";
import { SourceDocument } from "../types/workspace";

export class DocumentService {
  static async listDocuments(): Promise<SourceDocument[]> {
    const res = await fetchWithTimeout("/api/documents", { method: "GET" });
    if (!res.ok) {
      throw new Error(`Failed to list documents: ${res.statusText}`);
    }
    return await res.json();
  }

  static async getDocument(id: string): Promise<SourceDocument> {
    const res = await fetchWithTimeout(`/api/documents/${id}`, { method: "GET" });
    if (!res.ok) {
      throw new Error(`Failed to get document: ${res.statusText}`);
    }
    return await res.json();
  }

  static async deleteDocument(id: string): Promise<void> {
    const res = await fetchWithTimeout(`/api/documents/${id}`, { method: "DELETE" });
    if (!res.ok) {
      throw new Error(`Failed to delete document: ${res.statusText}`);
    }
  }

  static async uploadDocuments(files: File[]): Promise<any> {
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }

    const res = await fetch(`${API_BASE}/api/ingest/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Upload failed: ${err}`);
    }
    return await res.json();
  }

  static async recompileDocument(id: string): Promise<any> {
    const res = await fetchWithTimeout(`/api/documents/${id}/recompile`, { method: "POST" });
    if (!res.ok) {
      throw new Error(`Recompile failed: ${res.statusText}`);
    }
    return await res.json();
  }
}
