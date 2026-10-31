import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  GitBranch,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  Layers,
  Wrench,
  ShieldCheck,
  FileText,
  Activity,
  ArrowRight,
  Eye,
  Filter
} from "lucide-react";
import { useMecG } from "../context/MecGContext";
import { ApiService } from "../services/api";
import { OKFNodeSummary, GraphStats } from "../types/diagnostic";

export const KnowledgeGraphPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useMecG();

  const [nodes, setNodes] = useState<OKFNodeSummary[]>([]);
  const [stats, setStats] = useState<GraphStats | null>(null);
  const [selectedNode, setSelectedNode] = useState<OKFNodeSummary | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const load = async () => {
      const [nList, st] = await Promise.all([
        ApiService.getGraphNodes(),
        ApiService.getGraphStats()
      ]);
      setNodes(nList);
      setStats(st);
      if (nList.length > 0) setSelectedNode(nList[0]);
    };
    load();
  }, []);

  const canvasNodes = [
    { id: "node_vestas_v112", title: "Vestas V112 3.3MW Turbine", category: "machines", x: 80, y: 220, refId: "vestas_v112" },
    { id: "node_yaw_hydraulics", title: "Nacelle Yaw Circuit", category: "subsystems", x: 260, y: 220, refId: "yaw_hydraulics" },
    { id: "node_proportionalreliefvalvev2", title: "Proportional Relief Valve V2", category: "components", x: 480, y: 220, refId: "proportional_relief_valve_v2" },
    { id: "node_codee302pressuredrop", title: "Fault Code E-302 (Pressure Decay)", category: "fault_codes", x: 480, y: 80, refId: "code_e302_pressure_drop" },
    { id: "node_lockouttagouthydraulics", title: "Hydraulic LOTO Protocol", category: "safety", x: 740, y: 120, refId: "lockout_tagout_hydraulics" },
    { id: "node_calibratedtorquewrench", title: "Calibrated Torque Wrench (10-100 Nm)", category: "tools", x: 740, y: 240, refId: "calibrated_torque_wrench" },
    { id: "node_valvesealreplacement", title: "Valve Seal Replacement", category: "procedures", x: 740, y: 360, refId: "valve_seal_replacement" }
  ];

  const canvasEdges = [
    { from: "node_vestas_v112", to: "node_yaw_hydraulics", label: "subsystem" },
    { from: "node_yaw_hydraulics", to: "node_proportionalreliefvalvev2", label: "contains" },
    { from: "node_codee302pressuredrop", to: "node_proportionalreliefvalvev2", label: "triggers" },
    { from: "node_proportionalreliefvalvev2", to: "node_lockouttagouthydraulics", label: "requires LOTO" },
    { from: "node_proportionalreliefvalvev2", to: "node_calibratedtorquewrench", label: "requires tool" },
    { from: "node_proportionalreliefvalvev2", to: "node_valvesealreplacement", label: "repair procedure" }
  ];

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "safety":
        return { stroke: "#D99A29", fill: "#F2B544", label: "SAFETY" };
      case "components":
        return { stroke: "#F2B544", fill: "#F2B544", label: "COMPONENT" };
      case "procedures":
        return { stroke: "#279C70", fill: "#279C70", label: "PROCEDURE" };
      case "tools":
        return { stroke: "#38BDF8", fill: "#38BDF8", label: "TOOL" };
      case "fault_codes":
        return { stroke: "#A855F7", fill: "#A855F7", label: "FAULT CODE" };
      case "machines":
        return { stroke: "#FFFFFF", fill: "#FFFFFF", label: "MACHINE" };
      default:
        return { stroke: "#929AA6", fill: "#929AA6", label: "SUBSYSTEM" };
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setIsDragging(false);

  const handleSelectNodeRef = (refId: string) => {
    const found = nodes.find((n) => n.id === refId || n.relative_path.includes(refId));
    if (found) setSelectedNode(found);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#252B35]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F2B544]/15 text-[#F2B544] border border-[#F2B544]/30 font-bold uppercase">
              NETWORKX RAM GRAPH
            </span>
            <span className="text-xs font-mono text-[#929AA6]">Deterministic In-Memory Traversal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Engineering Knowledge Map
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#929AA6] max-w-2xl">
            NetworkX-backed directed graph connecting machines, subsystems, components, fault codes, safety LOTO rules, tools, and repair procedures.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-[#929AA6]">
          <span>Nodes: <strong className="text-white">{stats?.total_nodes || 7}</strong></span>
          <span>•</span>
          <span>Edges: <strong className="text-white">{stats?.total_edges || 6}</strong></span>
          <span>•</span>
          <span className="text-[#279C70] font-bold">100% In-Memory</span>
        </div>
      </div>

      {/* Main Graph Grid (Left Canvas 8 cols, Right Inspector 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual SVG Canvas (8 cols) */}
        <div className="lg:col-span-8 card-industrial p-1 rounded-2xl overflow-hidden relative shadow-2xl">
          {/* Zoom controls */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-[#101318]/90 border border-[#252B35] backdrop-blur-md">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.8))}
              className="p-1.5 rounded-lg text-[#929AA6] hover:text-white hover:bg-[#252B35]"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.6))}
              className="p-1.5 rounded-lg text-[#929AA6] hover:text-white hover:bg-[#252B35]"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setZoomLevel(1);
                setPanOffset({ x: 0, y: 0 });
              }}
              className="p-1.5 rounded-lg text-[#929AA6] hover:text-white hover:bg-[#252B35]"
              title="Reset Viewport"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* SVG Canvas Area */}
          <div
            className="w-full h-[520px] bg-[#101318] cursor-grab active:cursor-grabbing relative overflow-hidden select-none bg-industrial-grid"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <svg
              className="w-full h-full"
              viewBox="0 0 960 520"
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                transformOrigin: "center center",
                transition: isDragging ? "none" : "transform 0.12s ease-out"
              }}
            >
              <defs>
                <linearGradient id="amberEdge" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F2B544" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#D99A29" stopOpacity="0.7" />
                </linearGradient>
              </defs>

              {/* Edges */}
              {canvasEdges.map((e, idx) => {
                const f = canvasNodes.find((n) => n.id === e.from);
                const t = canvasNodes.find((n) => n.id === e.to);
                if (!f || !t) return null;
                const midX = (f.x + t.x) / 2;
                const midY = (f.y + t.y) / 2;

                return (
                  <g key={idx}>
                    <line x1={f.x} y1={f.y} x2={t.x} y2={t.y} stroke="#252B35" strokeWidth="3" />
                    <line x1={f.x} y1={f.y} x2={t.x} y2={t.y} stroke="#F2B544" strokeWidth="1.5" strokeDasharray="3 3" />
                    <rect x={midX - 35} y={midY - 8} width="70" height="16" rx="8" fill="#171A21" stroke="#252B35" />
                    <text x={midX} y={midY + 3} fill="#929AA6" fontSize="7" fontFamily="monospace" textAnchor="middle">
                      {e.label}
                    </text>
                  </g>
                );
              })}

              {/* Nodes */}
              {canvasNodes.map((cn) => {
                const color = getCategoryColor(cn.category);
                const isSelected = selectedNode?.id === cn.refId || selectedNode?.relative_path.includes(cn.refId);

                return (
                  <g
                    key={cn.id}
                    transform={`translate(${cn.x}, ${cn.y})`}
                    onClick={() => handleSelectNodeRef(cn.refId)}
                    className="cursor-pointer"
                  >
                    <rect
                      x="-85"
                      y="-22"
                      width="170"
                      height="44"
                      rx="10"
                      fill="#171A21"
                      stroke={isSelected ? "#F2B544" : "#252B35"}
                      strokeWidth={isSelected ? "2" : "1"}
                    />
                    <circle cx="-68" cy="0" r="4.5" fill={color.fill} />
                    <text x="-58" y="-3" fill="#FFFFFF" fontSize="9" fontWeight="bold">
                      {cn.title.length > 20 ? cn.title.slice(0, 18) + "..." : cn.title}
                    </text>
                    <text x="-58" y="11" fill={color.fill} fontSize="7" fontFamily="monospace">
                      {color.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="absolute bottom-3 left-4 text-[10px] font-mono text-[#647082]">
              NetworkX In-Memory Directed Topology • Click any node to inspect physical YAML frontmatter.
            </div>
          </div>
        </div>

        {/* Right Node Details Inspector (4 cols) */}
        <div className="lg:col-span-4 card-industrial p-6 space-y-5">
          {selectedNode ? (
            <>
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F2B544]/15 text-[#F2B544] border border-[#F2B544]/30 uppercase">
                  {selectedNode.category}
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight mt-2">{selectedNode.title}</h3>
                <div className="mt-1 text-xs font-mono text-[#F2B544] bg-[#101318] p-2 rounded-lg border border-[#252B35] truncate">
                  Path: {selectedNode.relative_path}
                </div>
                <p className="mt-3 text-xs text-[#929AA6] leading-relaxed">
                  {selectedNode.description}
                </p>
              </div>

              {selectedNode.part_numbers && selectedNode.part_numbers.length > 0 && (
                <div className="pt-3 border-t border-[#252B35]">
                  <span className="text-[10px] font-mono text-[#647082] uppercase font-bold block mb-1">
                    Part Numbers:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedNode.part_numbers.map((pn) => (
                      <span key={pn} className="px-2 py-0.5 rounded bg-[#101318] border border-[#252B35] text-xs font-mono text-white">
                        {pn}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-[#252B35]">
                <span className="text-[10px] font-mono text-[#647082] uppercase font-bold block mb-1">
                  Semantic Tags:
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedNode.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-[#101318] text-[10px] font-mono text-[#929AA6] border border-[#252B35]">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#252B35]">
                <button
                  onClick={() => {
                    navigate(`/diagnose`);
                    showToast(`Loaded ${selectedNode.title} into diagnostic workbench`);
                  }}
                  className="w-full btn-amber-primary py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Diagnose with this Component</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-xs font-mono text-[#647082]">
              Select a node on the left to inspect physical relationships.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

