import { fetchWithTimeout } from "./apiClient";
import { ReactFlowGraphData } from "../types/workspace";

export class GraphService {
  static async getReactFlowGraph(): Promise<ReactFlowGraphData> {
    const res = await fetchWithTimeout("/api/graph/react-flow", { method: "GET" });
    if (!res.ok) {
      throw new Error(`Failed to load knowledge graph: ${res.statusText}`);
    }
    return await res.json();
  }

  static async searchGraph(query: string): Promise<any[]> {
    const res = await fetchWithTimeout(`/api/graph/search?q=${encodeURIComponent(query)}`, { method: "GET" });
    if (!res.ok) {
      return [];
    }
    return await res.json();
  }

  static async getNodeNeighborhood(nodePath: string, depth = 2): Promise<any> {
    const res = await fetchWithTimeout(`/api/graph/neighborhood/${encodeURIComponent(nodePath)}?depth=${depth}`, {
      method: "GET",
    });
    if (!res.ok) {
      throw new Error(`Failed to load neighborhood: ${res.statusText}`);
    }
    return await res.json();
  }

  static async getNodeDetails(nodePath: string): Promise<any> {
    const res = await fetchWithTimeout(`/api/graph/nodes/${encodeURIComponent(nodePath)}`, { method: "GET" });
    if (!res.ok) {
      throw new Error(`Node not found: ${res.statusText}`);
    }
    return await res.json();
  }

  static async reloadGraph(): Promise<any> {
    const res = await fetchWithTimeout("/api/graph/reload", { method: "POST" });
    if (!res.ok) {
      throw new Error(`Reload failed: ${res.statusText}`);
    }
    return await res.json();
  }
}
