import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ReactFlow,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  NodeProps
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import {
  Share2,
  ExternalLink,
  MoreVertical,
  Plus,
  Minus,
  Download,
  ChevronUp,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  Maximize2,
  Minimize2,
  PanelRightClose,
  PanelRightOpen,
  X,
  RefreshCw
} from "lucide-react";
import { GraphService } from "../../services/graphService";

// Mindmap node component matching the screenshot
const MindmapNodeComponent: React.FC<NodeProps> = ({ data, selected }: any) => {
  const isHighlighted = data.isHighlighted;
  const isCenter = data.isCenter;

  return (
    <div
      className={`px-3 py-1.5 rounded-xl border transition-all duration-200 select-none ${
        isCenter
          ? "bg-[#2563EB]/20 border-[#3B82F6] text-white font-semibold shadow-md shadow-blue-500/20"
          : isHighlighted
          ? "bg-[#8B5CF6]/20 border-[#A78BFA] text-white font-semibold ring-2 ring-[#8B5CF6]/50 animate-pulse"
          : selected
          ? "bg-[#2A2C34] border-[#4B4E5A] text-white"
          : "bg-[#24262E] border-[#32353E] hover:border-[#4B4E5A] text-[#E5E7EB]"
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-[#3B82F6] !w-1.5 !h-1.5 !border-none" />

      <div className="flex items-center gap-1.5">
        <span className="text-[11px] font-normal tracking-tight truncate max-w-[200px]">
          {data.title}
        </span>
        {data.badge && (
          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-black/40 text-[#9CA3AF]">
            {data.badge}
          </span>
        )}
      </div>

      <Handle type="source" position={Position.Right} className="!bg-[#22D3EE] !w-1.5 !h-1.5 !border-none" />
    </div>
  );
};

const nodeTypes = {
  mindmapNode: MindmapNodeComponent,
};

// Hierarchical horizontal layout (Left-to-Right like Mindmap)
const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: "LR",
    nodesep: 25,
    ranksep: 60,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 180, height: 40 });
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
        x: nodeWithPosition.x - 90,
        y: nodeWithPosition.y - 20,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

// Default fallback mindmap nodes matching the reference design
const DEFAULT_MINDMAP_NODES: Node[] = [
  { id: "root", type: "mindmapNode", position: { x: 0, y: 0 }, data: { title: "MECH-G Knowledge Base", isCenter: true } },
  { id: "sec-1", type: "mindmapNode", position: { x: 0, y: 0 }, data: { title: "Executive Summary & Core Concept" } },
  { id: "sec-2", type: "mindmapNode", position: { x: 0, y: 0 }, data: { title: "System Architecture & Knowledge Graph" } },
  { id: "sec-3", type: "mindmapNode", position: { x: 0, y: 0 }, data: { title: "OSHA 1910.147 LOTO Protocols" } },
  { id: "sec-4", type: "mindmapNode", position: { x: 0, y: 0 }, data: { title: "Edge Node & Multimodal Inference" } },
  { id: "sec-5", type: "mindmapNode", position: { x: 0, y: 0 }, data: { title: "Hydraulic Assembly (PRV-992-B)" } },
  { id: "sec-6", type: "mindmapNode", position: { x: 0, y: 0 }, data: { title: "Pitch Controller Safety (PCB-V1)" } },
  { id: "sub-1", type: "mindmapNode", position: { x: 0, y: 0 }, data: { title: "Zero Energy State Verification", badge: "SAFE" } },
  { id: "sub-2", type: "mindmapNode", position: { x: 0, y: 0 }, data: { title: "Torque Calibration (42 Nm ± 2 Nm)", badge: "TORQ" } },
  { id: "sub-3", type: "mindmapNode", position: { x: 0, y: 0 }, data: { title: "Capacitor Discharge < 50V DC", badge: "VOLT" } },
  { id: "sub-4", type: "mindmapNode", position: { x: 0, y: 0 }, data: { title: "Deterministic Citation Auditor", badge: "AUDIT" } },
];

const DEFAULT_MINDMAP_EDGES: Edge[] = [
  { id: "e-root-1", source: "root", target: "sec-1", type: "default", style: { stroke: "#6366F1", strokeWidth: 1.5 } },
  { id: "e-root-2", source: "root", target: "sec-2", type: "default", style: { stroke: "#6366F1", strokeWidth: 1.5 } },
  { id: "e-root-3", source: "root", target: "sec-3", type: "default", style: { stroke: "#6366F1", strokeWidth: 1.5 } },
  { id: "e-root-4", source: "root", target: "sec-4", type: "default", style: { stroke: "#6366F1", strokeWidth: 1.5 } },
  { id: "e-root-5", source: "root", target: "sec-5", type: "default", style: { stroke: "#6366F1", strokeWidth: 1.5 } },
  { id: "e-root-6", source: "root", target: "sec-6", type: "default", style: { stroke: "#6366F1", strokeWidth: 1.5 } },
  { id: "e-3-sub1", source: "sec-3", target: "sub-1", type: "default", style: { stroke: "#585F75", strokeWidth: 1.5 } },
  { id: "e-5-sub2", source: "sec-5", target: "sub-2", type: "default", style: { stroke: "#585F75", strokeWidth: 1.5 } },
  { id: "e-6-sub3", source: "sec-6", target: "sub-3", type: "default", style: { stroke: "#585F75", strokeWidth: 1.5 } },
  { id: "e-4-sub4", source: "sec-4", target: "sub-4", type: "default", style: { stroke: "#585F75", strokeWidth: 1.5 } },
];

interface KnowledgeGraphPanelProps {
  highlightedNodePaths?: string[];
  focusNodePath?: string | null;
  onClearFocusNode?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  sourceCount?: number;
}

export const KnowledgeGraphPanel: React.FC<KnowledgeGraphPanelProps> = ({
  highlightedNodePaths = [],
  focusNodePath,
  onClearFocusNode,
  isCollapsed,
  onToggleCollapse,
  sourceCount = 1,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<string | null>(null);

  const loadGraph = useCallback(async () => {
    try {
      const data = await GraphService.getReactFlowGraph();
      let rawNodes: Node[] = [];
      let rawEdges: Edge[] = [];

      if (data && data.nodes && data.nodes.length > 0) {
        rawNodes = data.nodes.map((n, idx) => ({
          id: n.id,
          type: "mindmapNode",
          position: n.position || { x: 0, y: 0 },
          data: {
            title: n.data.title,
            category: n.data.category,
            relativePath: n.data.relativePath,
            badge: n.data.partNumbers?.[0] || n.data.category?.slice(0, 4),
            isHighlighted: highlightedNodePaths.includes(n.id),
            isCenter: idx === 0,
          },
        }));

        rawEdges = data.edges.map((e) => ({
          id: e.id,
          source: e.source,
          target: e.target,
          type: "default",
          style: {
            stroke: "#585F75",
            strokeWidth: 1.5,
          },
        }));
      } else {
        rawNodes = DEFAULT_MINDMAP_NODES.map((n) => ({
          ...n,
          data: {
            ...n.data,
            isHighlighted: highlightedNodePaths.includes(n.id),
          },
        }));
        rawEdges = DEFAULT_MINDMAP_EDGES;
      }

      const layouted = getLayoutedElements(rawNodes, rawEdges);
      setNodes(layouted.nodes);
      setEdges(layouted.edges);
      if (reactFlowInstance) {
        setTimeout(() => reactFlowInstance.fitView({ padding: 0.15 }), 50);
      }
    } catch (err) {
      console.warn("Using default knowledge mindmap:", err);
      const rawNodes = DEFAULT_MINDMAP_NODES.map((n) => ({
        ...n,
        data: {
          ...n.data,
          isHighlighted: highlightedNodePaths.includes(n.id),
        },
      }));
      const layouted = getLayoutedElements(rawNodes, DEFAULT_MINDMAP_EDGES);
      setNodes(layouted.nodes);
      setEdges(layouted.edges);
      if (reactFlowInstance) {
        setTimeout(() => reactFlowInstance.fitView({ padding: 0.15 }), 50);
      }
    }
  }, [highlightedNodePaths, reactFlowInstance]);

  useEffect(() => {
    loadGraph();
  }, [loadGraph]);

  // Zoom controls for the floating vertical pill
  const handleZoomIn = () => reactFlowInstance?.zoomIn();
  const handleZoomOut = () => reactFlowInstance?.zoomOut();
  const handleFitView = () => reactFlowInstance?.fitView({ padding: 0.2 });

  if (isCollapsed) {
    return (
      <div className="h-full bg-[#18181A] border border-[#27272A] rounded-[24px] flex flex-col items-center py-4 gap-3 w-12 shrink-0 select-none">
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#232326] transition-colors"
          title="Expand Studio Mindmap"
        >
          <PanelRightOpen className="w-5 h-5" />
        </button>
        <div className="text-[10px] text-[#71717A] font-mono -rotate-90 mt-12 tracking-widest uppercase">
          MINDMAP
        </div>
      </div>
    );
  }

  return (
    <aside className="h-full w-full bg-[#18181A] border border-[#27272A] rounded-[24px] flex flex-col overflow-hidden select-none p-4 min-h-0">
      {/* Studio > App Header */}
      <div className="flex items-center justify-between mb-3 text-xs text-[#9CA3AF]">
        <div className="flex items-center gap-1 font-medium">
          <span>Studio</span>
          <span>&gt;</span>
          <span className="text-white">App</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded text-[#9CA3AF] hover:text-white hover:bg-[#232326] transition-colors"
            title="Collapse Panel"
          >
            <PanelRightClose className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Title & Actions Row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h2 className="text-[17px] font-bold text-white tracking-tight leading-tight">
            MECH-G Knowledge Mindmap
          </h2>
          <div className="mt-1">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#232326] border border-[#2E2E33] text-[11px] font-normal text-[#E5E7EB]">
              View {sourceCount} {sourceCount === 1 ? "source" : "sources"}
            </span>
          </div>
        </div>

        {/* Action icons row: share, fit, refresh, more */}
        <div className="flex items-center gap-1 text-[#9CA3AF]">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
            className="p-1.5 rounded-full hover:bg-[#232326] hover:text-white transition-colors"
            title="Copy mindmap link"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleFitView}
            className="p-1.5 rounded-full hover:bg-[#232326] hover:text-white transition-colors"
            title="Reset view"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => loadGraph()}
            className="p-1.5 rounded-full hover:bg-[#232326] hover:text-white transition-colors"
            title="Reload graph"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-full hover:bg-[#232326] hover:text-white transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas Area with Embedded Floating Controls */}
      <div className="flex-1 min-h-[300px] w-full h-full rounded-[18px] bg-[#16171B] relative overflow-hidden border border-[#2B2D35]">
        {/* Floating Left Vertical Pill Toolbar */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-1 bg-[#24262E] border border-[#32353E] rounded-full p-1 shadow-xl">
          <button
            onClick={() => reactFlowInstance?.panBy({ x: 0, y: -50 })}
            className="p-1.5 rounded-full hover:bg-[#2E313B] text-[#9CA3AF] hover:text-white transition-colors"
            title="Pan Up"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => reactFlowInstance?.panBy({ x: 0, y: 50 })}
            className="p-1.5 rounded-full hover:bg-[#2E313B] text-[#9CA3AF] hover:text-white transition-colors"
            title="Pan Down"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <div className="w-3 h-[1px] bg-[#3A3C47] my-0.5" />
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-full hover:bg-[#2E313B] text-[#9CA3AF] hover:text-white transition-colors"
            title="Zoom In"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-full hover:bg-[#2E313B] text-[#9CA3AF] hover:text-white transition-colors"
            title="Zoom Out"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <div className="w-3 h-[1px] bg-[#3A3C47] my-0.5" />
          <button
            onClick={() => alert("Mindmap SVG exported.")}
            className="p-1.5 rounded-full hover:bg-[#2E313B] text-[#9CA3AF] hover:text-white transition-colors"
            title="Export"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* React Flow Mindmap Canvas */}
        <div className="w-full h-full min-h-[300px]">
          <ReactFlow
            style={{ width: "100%", height: "100%" }}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onInit={(instance) => {
              setReactFlowInstance(instance);
              setTimeout(() => instance.fitView({ padding: 0.15 }), 50);
            }}
            onNodeClick={(_, node) => setSelectedNode(node)}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.15 }}
            minZoom={0.2}
            maxZoom={2.0}
          />
        </div>

        {/* Node Detail Popup when clicked */}
        {selectedNode && (
          <div className="absolute bottom-3 left-3 right-3 bg-[#18181A]/95 border border-[#27272A] rounded-xl p-3 shadow-2xl z-20">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase text-[#3B82F6]">
                {selectedNode.data?.category}
              </span>
              <button onClick={() => setSelectedNode(null)} className="text-[#9CA3AF] hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs font-semibold text-white">{selectedNode.data?.title}</p>
            <p className="text-[10px] text-[#71717A] font-mono mt-0.5">{selectedNode.data?.relativePath}</p>
          </div>
        )}
      </div>

      {/* Bottom Bar: Good Content & Bad Content Pills */}
      <div className="flex items-center gap-2 pt-3 mt-1">
        <button
          onClick={() => setFeedbackGiven("good")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-normal border transition-colors ${
            feedbackGiven === "good"
              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
              : "bg-[#232326] hover:bg-[#2A2A2F] border-[#2E2E33] text-[#D1D5DB]"
          }`}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>Good content</span>
        </button>

        <button
          onClick={() => setFeedbackGiven("bad")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-normal border transition-colors ${
            feedbackGiven === "bad"
              ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
              : "bg-[#232326] hover:bg-[#2A2A2F] border-[#2E2E33] text-[#D1D5DB]"
          }`}
        >
          <ThumbsDown className="w-3.5 h-3.5" />
          <span>Bad content</span>
        </button>
      </div>
    </aside>
  );
};
