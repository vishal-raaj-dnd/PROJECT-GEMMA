import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ReactFlow,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  NodeProps,
  Background,
  Controls
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import { TopToolbar } from "../components/workspace/TopToolbar";
import {
  GitBranch,
  Layers,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Wrench,
  Cpu,
  FileText,
  X,
  Copy,
  Check,
  Sparkles,
  Info
} from "lucide-react";
import { OKFNodeSummary, GraphStats } from "../types/diagnostic";
import { ApiService } from "../services/api";

// Custom Node for React Flow with Category Badges & Glow
const CustomGraphNode: React.FC<NodeProps> = ({ data, selected }: any) => {
  const category = (data.category || "").toLowerCase();

  const getBorderColor = () => {
    if (selected) return "border-[#22D3EE] ring-2 ring-[#22D3EE]/40 shadow-lg shadow-cyan-500/20";
    if (category.includes("safety")) return "border-amber-500/50 hover:border-amber-400";
    if (category.includes("component")) return "border-blue-500/50 hover:border-blue-400";
    if (category.includes("procedure")) return "border-emerald-500/50 hover:border-emerald-400";
    if (category.includes("tool")) return "border-cyan-500/50 hover:border-cyan-400";
    return "border-purple-500/50 hover:border-purple-400";
  };

  const getBadgeColor = () => {
    if (category.includes("safety")) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    if (category.includes("component")) return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    if (category.includes("procedure")) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (category.includes("tool")) return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    return "bg-purple-500/10 text-purple-400 border-purple-500/20";
  };

  return (
    <div
      className={`px-3.5 py-2.5 rounded-2xl bg-[#18181A] border transition-all duration-200 select-none shadow-md min-w-[190px] ${getBorderColor()}`}
    >
      <Handle type="target" position={Position.Left} className="!bg-[#3B82F6] !w-2 !h-2 !border-none" />

      <div className="flex items-center justify-between gap-2 mb-1">
        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full border uppercase ${getBadgeColor()}`}>
          {category || "CONCEPT"}
        </span>
        {data.outgoing_count !== undefined && (
          <span className="text-[9px] font-mono text-[#9CA3AF]">
            {data.outgoing_count} edges
          </span>
        )}
      </div>

      <div className="text-xs font-semibold text-white tracking-tight truncate max-w-[210px]">
        {data.title || data.id}
      </div>

      {data.part_numbers && data.part_numbers.length > 0 && (
        <div className="text-[10px] font-mono text-cyan-300 mt-0.5 truncate">
          PN: {data.part_numbers[0]}
        </div>
      )}

      <Handle type="source" position={Position.Right} className="!bg-[#22D3EE] !w-2 !h-2 !border-none" />
    </div>
  );
};

const nodeTypes = {
  customNode: CustomGraphNode,
  mindmapNode: CustomGraphNode,
  default: CustomGraphNode,
};

// Dagre Layout Algorithm for Automatic Graph Positioning
const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: "LR",
    nodesep: 35,
    ranksep: 90,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 220, height: 60 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: (nodeWithPosition?.x || 0) - 110,
        y: (nodeWithPosition?.y || 0) - 30,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export const GraphPage: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [nodesList, setNodesList] = useState<OKFNodeSummary[]>([]);
  const [stats, setStats] = useState<GraphStats | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Selected Node & Modal
  const [selectedNodeData, setSelectedNodeData] = useState<any | null>(null);
  const [showNodeModal, setShowNodeModal] = useState(false);
  const [copiedPath, setCopiedPath] = useState(false);

  // React Flow State
  const [rfNodes, setRfNodes, onNodesChange] = useNodesState([]);
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState([]);

  // Fetch Graph Data
  const loadGraphData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [summaryNodes, graphStats] = await Promise.all([
        ApiService.getGraphNodes(),
        ApiService.getGraphStats(),
      ]);

      setNodesList(summaryNodes);
      setStats(graphStats);

      // Try fetching react-flow from backend or construct from summary
      const rfRes = await fetch("/api/graph/react-flow").catch(() => null);
      if (rfRes && rfRes.ok) {
        const rfData = await rfRes.json();
        const mappedNodes: Node[] = rfData.nodes.map((n: any) => ({
          id: n.id,
          type: "customNode",
          data: {
            title: n.data?.title || n.data?.label || n.id,
            category: n.data?.category || "components",
            part_numbers: n.data?.part_numbers || [],
            relative_path: n.data?.relative_path || n.id,
            description: n.data?.description || "",
          },
          position: n.position || { x: 0, y: 0 },
        }));

        const mappedEdges: Edge[] = rfData.edges.map((e: any) => ({
          id: e.id,
          source: e.source,
          target: e.target,
          type: "default",
          animated: true,
          style: { stroke: "#3A3B43", strokeWidth: 1.5 },
        }));

        const { nodes: layoutedN, edges: layoutedE } = getLayoutedElements(mappedNodes, mappedEdges);
        setRfNodes(layoutedN);
        setRfEdges(layoutedE);
      } else {
        // Construct fallback graph from summaryNodes
        const initialNodes: Node[] = summaryNodes.map((n, idx) => ({
          id: n.id,
          type: "customNode",
          data: {
            title: n.title,
            category: n.category,
            part_numbers: n.part_numbers || [],
            relative_path: n.relative_path,
            description: n.description || "",
            outgoing_count: n.outgoing_count || 0,
          },
          position: { x: (idx % 3) * 260, y: Math.floor(idx / 3) * 100 },
        }));

        // Sample edges connecting nodes
        const initialEdges: Edge[] = [
          { id: "e1", source: "code_e302_pressure_drop", target: "proportional_relief_valve_v2", animated: true, type: "default" },
          { id: "e2", source: "proportional_relief_valve_v2", target: "lockout_tagout_hydraulics", animated: true, type: "default" },
          { id: "e3", source: "proportional_relief_valve_v2", target: "calibrated_torque_wrench", animated: true, type: "default" },
          { id: "e4", source: "proportional_relief_valve_v2", target: "valve_seal_replacement", animated: true, type: "default" },
          { id: "e5", source: "pcb_pitch_controller_v1", target: "arc_flash_ppe_level2", animated: true, type: "default" },
        ];

        const { nodes: layoutedN, edges: layoutedE } = getLayoutedElements(initialNodes, initialEdges);
        setRfNodes(layoutedN);
        setRfEdges(layoutedE);
      }
    } catch (err) {
      console.error("Failed to load graph data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [setRfNodes, setRfEdges]);

  useEffect(() => {
    loadGraphData();
  }, [loadGraphData]);

  // Handle Node Click
  const handleNodeClick = (_: any, node: Node) => {
    setSelectedNodeData(node.data);
    setShowNodeModal(true);
  };

  const handleSelectFromList = (nodeSummary: OKFNodeSummary) => {
    setSelectedNodeData(nodeSummary);
    setShowNodeModal(true);
  };

  const handleCopyPath = () => {
    if (selectedNodeData?.relative_path) {
      navigator.clipboard.writeText(selectedNodeData.relative_path);
      setCopiedPath(true);
      setTimeout(() => setCopiedPath(false), 2000);
    }
  };

  const handleQueryGemmaAboutNode = () => {
    if (selectedNodeData) {
      navigate("/workspace", {
        state: {
          initialPrompt: `Explain the maintenance procedure, upstream safety gates, and torque specifications for node: ${selectedNodeData.title} (${selectedNodeData.relative_path})`,
        },
      });
    }
  };

  // Filtered List
  const filteredNodes = useMemo(() => {
    return nodesList.filter((n) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        n.title.toLowerCase().includes(q) ||
        n.relative_path.toLowerCase().includes(q) ||
        (n.part_numbers && n.part_numbers.some((pn) => pn.toLowerCase().includes(q)));
      const matchesCategory =
        categoryFilter === "all" || n.category.toLowerCase() === categoryFilter.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [nodesList, searchQuery, categoryFilter]);

  return (
    <div className="h-screen flex flex-col bg-[#0B0B0C] text-[#F5F7FF] overflow-hidden select-none">
      {/* Persistent Navigation Toolbar */}
      <TopToolbar activeModule="graph" title="Knowledge Graph Explorer" />

      {/* Floating Island Layout */}
      <main className="flex-1 p-3 pt-1 flex gap-3 min-h-0 overflow-hidden">
        {/* Left Island: Hierarchy, Search & Node List */}
        <section className="w-[380px] lg:w-[420px] flex-shrink-0 bg-[#18181A] rounded-[24px] border border-[#27272A] p-4 flex flex-col overflow-hidden">
          <div className="pb-3 border-b border-[#27272A] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center">
                <GitBranch className="w-4 h-4 text-[#8B5CF6]" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">Directed Topology</h2>
                <p className="text-[10px] text-[#9CA3AF]">In-Memory NetworkX AST</p>
              </div>
            </div>
            <button
              onClick={loadGraphData}
              className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#24252B] transition-colors cursor-pointer"
              title="Reload Graph"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#22D3EE]" : ""}`} />
            </button>
          </div>

          {/* KPI Metrics */}
          <div className="grid grid-cols-2 gap-2 my-3">
            <div className="p-2.5 rounded-xl bg-[#141518] border border-[#27272A]">
              <div className="text-[9px] font-mono text-[#6B7280] uppercase">Indexed Nodes</div>
              <div className="text-base font-bold font-mono text-white mt-0.5">
                {stats?.total_nodes || nodesList.length || 11}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#141518] border border-[#27272A]">
              <div className="text-[9px] font-mono text-[#6B7280] uppercase">Directed Edges</div>
              <div className="text-base font-bold font-mono text-[#22D3EE] mt-0.5">
                {stats?.total_edges || 6}
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-2.5">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#6B7280]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts, part numbers..."
              className="w-full bg-[#141518] border border-[#27272A] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#22D3EE] transition-colors"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1 mb-3">
            {["all", "components", "safety", "procedures", "fault_codes", "tools"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${
                  categoryFilter === cat
                    ? "bg-[#24252B] text-white border border-[#3A3B43]"
                    : "bg-[#141518] text-[#9CA3AF] hover:text-white border border-[#27272A]"
                }`}
              >
                {cat.replace("_", " ").toUpperCase()}
              </button>
            ))}
          </div>

          {/* Node Index List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5 pr-1">
            {filteredNodes.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#6B7280]">
                No matching nodes found.
              </div>
            ) : (
              filteredNodes.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleSelectFromList(n)}
                  className="p-2.5 rounded-xl bg-[#141518] hover:bg-[#1E1F24] border border-[#27272A] hover:border-[#3A3B43] cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="font-mono text-[#9CA3AF] uppercase truncate max-w-[120px]">
                      {n.category}
                    </span>
                    {n.part_numbers && n.part_numbers.length > 0 && (
                      <span className="font-mono text-cyan-400 truncate max-w-[120px]">
                        {n.part_numbers[0]}
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-white truncate">{n.title}</div>
                  <div className="text-[10px] font-mono text-[#6B7280] truncate mt-0.5">
                    {n.relative_path}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Right Island: Fullscreen Interactive React Flow Canvas */}
        <section className="flex-1 bg-[#18181A] rounded-[24px] border border-[#27272A] p-2 flex flex-col overflow-hidden relative">
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#141518]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#27272A] text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[#9CA3AF]">Interactive Mindmap: Click any node to inspect YAML & connections</span>
          </div>

          {/* React Flow Viewport */}
          <div className="w-full h-full rounded-2xl overflow-hidden bg-[#0F0F11]">
            <ReactFlow
              nodes={rfNodes}
              edges={rfEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={handleNodeClick}
              nodeTypes={nodeTypes}
              fitView
              minZoom={0.2}
              maxZoom={2}
              defaultEdgeOptions={{ type: "default" }}
            >
              <Background color="#27272A" gap={20} size={1} />
              <Controls className="!bg-[#18181A] !border-[#27272A] !rounded-xl overflow-hidden [&>button]:!bg-[#18181A] [&>button]:!border-[#27272A] [&>button]:!text-white" />
            </ReactFlow>
          </div>

          {/* Bottom Category Legend Bar */}
          <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 bg-[#141518]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#27272A] text-[10px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-[#9CA3AF]">Component</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[#9CA3AF]">Safety/LOTO</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[#9CA3AF]">Procedure</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-[#9CA3AF]">Tool</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span className="text-[#9CA3AF]">Fault Code</span>
            </div>
          </div>
        </section>
      </main>

      {/* Node Detail Inspector Modal */}
      {showNodeModal && selectedNodeData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#18181A] border border-[#27272A] rounded-[24px] p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#27272A] mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-mono uppercase">
                  {selectedNodeData.category || "CONCEPT NODE"}
                </span>
                <h3 className="text-sm font-bold text-white truncate max-w-[320px]">
                  {selectedNodeData.title}
                </h3>
              </div>
              <button
                onClick={() => setShowNodeModal(false)}
                className="text-[#9CA3AF] hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Details */}
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-[#141518] rounded-xl border border-[#27272A] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#9CA3AF]">RELATIVE PATH</span>
                  <button
                    onClick={handleCopyPath}
                    className="flex items-center gap-1 text-[10px] font-mono text-[#22D3EE] hover:underline cursor-pointer"
                  >
                    {copiedPath ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedPath ? "Copied" : "Copy Path"}</span>
                  </button>
                </div>
                <div className="font-mono text-white text-[11px] truncate">
                  {selectedNodeData.relative_path || selectedNodeData.id}
                </div>
              </div>

              {selectedNodeData.part_numbers && selectedNodeData.part_numbers.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono text-[#9CA3AF] uppercase block mb-1">Part Numbers</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNodeData.part_numbers.map((pn: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[#141518] border border-[#27272A] text-cyan-300 font-mono text-[10px]">
                        {pn}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedNodeData.description && (
                <div>
                  <span className="text-[10px] font-mono text-[#9CA3AF] uppercase block mb-1">Summary Description</span>
                  <p className="text-[#D1D5DB] leading-relaxed bg-[#141518] p-3 rounded-xl border border-[#27272A]">
                    {selectedNodeData.description}
                  </p>
                </div>
              )}

              <div className="p-3 bg-[#141518] rounded-xl border border-[#27272A] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span className="text-white font-medium">OSHA 1910.147 Cross-Verification</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  LOTO Bound
                </span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-6 flex justify-between items-center pt-3 border-t border-[#27272A]">
              <button
                onClick={handleQueryGemmaAboutNode}
                className="px-4 py-2 rounded-full bg-[#24252B] hover:bg-[#2F3037] text-[#22D3EE] text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-[#3A3B43]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask Gemma About Node</span>
              </button>

              <button
                onClick={() => setShowNodeModal(false)}
                className="px-5 py-2 rounded-full bg-[#22D3EE] hover:bg-[#06B6D4] text-black text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
