import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Network, 
  CheckCircle2, 
  Search, 
  Filter, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  GitBranch, 
  ArrowRight, 
  Wrench, 
  ShieldAlert, 
  FileText, 
  Cpu, 
  Layers,
  ChevronRight,
  ExternalLink,
  Code2,
  Eye
} from "lucide-react";
import { OKFNodeSummary, GraphStats } from "../types/diagnostic";
import { ApiService } from "../services/api";

export const KnowledgeGraphPreview: React.FC = () => {
  const navigate = useNavigate();

  const [nodes, setNodes] = useState<OKFNodeSummary[]>([]);
  const [stats, setStats] = useState<GraphStats | null>(null);
  const [selectedNode, setSelectedNode] = useState<OKFNodeSummary | null>(null);
  const [activeTab, setActiveTab] = useState<"canvas" | "catalog" | "mermaid">("canvas");
  const [mermaidCode, setMermaidCode] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const load = async () => {
      const [nList, st, mm] = await Promise.all([
        ApiService.getGraphNodes(),
        ApiService.getGraphStats(),
        ApiService.getGraphMermaid(),
      ]);
      setNodes(nList);
      setStats(st);
      setMermaidCode(mm);
      if (nList.length > 0) {
        setSelectedNode(nList[0]);
      }
    };
    load();
  }, []);

  const getCategoryTheme = (category: string) => {
    switch (category.toLowerCase()) {
      case "safety":
        return {
          bg: "bg-amber-500/15",
          text: "text-amber-400",
          border: "border-amber-500/40",
          glow: "rgba(245, 158, 11, 0.4)",
          stroke: "#F59E0B",
          fill: "#0B1427",
          label: "SAFETY"
        };
      case "components":
        return {
          bg: "bg-[#1769C2]/20",
          text: "text-[#3995F6]",
          border: "border-[#3995F6]/40",
          glow: "rgba(57, 149, 246, 0.4)",
          stroke: "#3995F6",
          fill: "#0B1427",
          label: "COMPONENT"
        };
      case "procedures":
        return {
          bg: "bg-emerald-500/15",
          text: "text-emerald-400",
          border: "border-emerald-500/40",
          glow: "rgba(16, 185, 129, 0.4)",
          stroke: "#10B981",
          fill: "#0B1427",
          label: "PROCEDURE"
        };
      case "tools":
        return {
          bg: "bg-cyan-500/15",
          text: "text-cyan-300",
          border: "border-cyan-500/40",
          glow: "rgba(6, 182, 212, 0.4)",
          stroke: "#06B6D4",
          fill: "#0B1427",
          label: "TOOL"
        };
      default:
        return {
          bg: "bg-purple-500/15",
          text: "text-purple-300",
          border: "border-purple-500/40",
          glow: "rgba(168, 85, 247, 0.4)",
          stroke: "#A855F7",
          fill: "#0B1427",
          label: "FAULT CODE"
        };
    }
  };

  const filteredNodes = nodes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      n.relative_path.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (n.part_numbers && n.part_numbers.some((pn) => pn.toLowerCase().includes(searchFilter.toLowerCase())));
    const matchesCategory =
      categoryFilter === "all" || n.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Canvas visual nodes layout positions
  const canvasNodes = [
    {
      id: "node_codee302pressuredrop",
      title: "Fault Code E-302",
      category: "fault_codes",
      x: 120,
      y: 180,
      refId: "code_e302_pressure_drop"
    },
    {
      id: "node_proportionalreliefvalvev2",
      title: "Proportional Relief Valve V2",
      category: "components",
      x: 380,
      y: 180,
      refId: "proportional_relief_valve_v2"
    },
    {
      id: "node_lockouttagouthydraulics",
      title: "Hydraulic LOTO Protocol",
      category: "safety",
      x: 640,
      y: 70,
      refId: "lockout_tagout_hydraulics"
    },
    {
      id: "node_calibratedtorquewrench",
      title: "Calibrated Torque Wrench (10-100 Nm)",
      category: "tools",
      x: 640,
      y: 200,
      refId: "calibrated_torque_wrench"
    },
    {
      id: "node_valvesealreplacement",
      title: "Valve Seal Replacement",
      category: "procedures",
      x: 640,
      y: 330,
      refId: "valve_seal_replacement"
    },
    {
      id: "node_pcbpitchcontrollerv1",
      title: "Pitch Controller PCB",
      category: "components",
      x: 200,
      y: 350,
      refId: "pcb_pitch_controller_v1"
    },
    {
      id: "node_arcflashppelevel2",
      title: "Arc Flash PPE Protocol",
      category: "safety",
      x: 440,
      y: 430,
      refId: "arc_flash_ppe_level2"
    }
  ];

  // Directed edges connecting nodes
  const canvasEdges = [
    { from: "node_codee302pressuredrop", to: "node_proportionalreliefvalvev2", label: "points to" },
    { from: "node_proportionalreliefvalvev2", to: "node_lockouttagouthydraulics", label: "requires LOTO" },
    { from: "node_proportionalreliefvalvev2", to: "node_calibratedtorquewrench", label: "tooling" },
    { from: "node_proportionalreliefvalvev2", to: "node_valvesealreplacement", label: "procedure" },
    { from: "node_pcbpitchcontrollerv1", to: "node_arcflashppelevel2", label: "requires PPE" }
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleNodeClick = (refId: string) => {
    const matched = nodes.find((n) => n.id === refId || n.relative_path.includes(refId));
    if (matched) {
      setSelectedNode(matched);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Workspace Bar: Filter Tabs & Stats */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0B1427] border border-[#1D3150]">
        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#060B18] border border-[#1D3150] self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("canvas")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "canvas"
                ? "bg-[#1769C2]/25 text-[#3995F6] border border-[#3995F6]/40 shadow-sm"
                : "text-[#9AAAC3] hover:text-[#F5F7FC]"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Interactive Topology</span>
          </button>

          <button
            onClick={() => setActiveTab("catalog")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "catalog"
                ? "bg-[#1769C2]/25 text-[#3995F6] border border-[#3995F6]/40 shadow-sm"
                : "text-[#9AAAC3] hover:text-[#F5F7FC]"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Node Matrix ({nodes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("mermaid")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "mermaid"
                ? "bg-[#1769C2]/25 text-[#3995F6] border border-[#3995F6]/40 shadow-sm"
                : "text-[#9AAAC3] hover:text-[#F5F7FC]"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Mermaid Spec</span>
          </button>
        </div>

        {/* Global Topology Stats */}
        {stats && (
          <div className="flex items-center gap-4 text-xs font-mono text-[#6F809A]">
            <span>
              Total Nodes: <strong className="text-[#F5F7FC]">{stats.total_nodes}</strong>
            </span>
            <span className="text-[#1D3150]">•</span>
            <span>
              Directed Edges: <strong className="text-[#F5F7FC]">{stats.total_edges}</strong>
            </span>
            <span className="text-[#1D3150]">•</span>
            <span className="text-[#10B981] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              In-Memory RAM
            </span>
          </div>
        )}
      </div>

      {/* Main Graph Grid (Left Canvas/Matrix 8 cols, Right Inspector 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Interactive View (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* 1. VISUAL INTERACTIVE SVG CANVAS VIEW */}
          {activeTab === "canvas" && (
            <div className="card-tech p-1 rounded-2xl overflow-hidden relative shadow-2xl">
              {/* Floating Canvas Controls */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-[#060B18]/90 border border-[#1D3150] backdrop-blur-md shadow-lg">
                <button
                  onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.8))}
                  className="p-1.5 rounded-lg text-[#9AAAC3] hover:text-white hover:bg-[#101D35] transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.6))}
                  className="p-1.5 rounded-lg text-[#9AAAC3] hover:text-white hover:bg-[#101D35] transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setZoomLevel(1);
                    setPanOffset({ x: 0, y: 0 });
                  }}
                  className="p-1.5 rounded-lg text-[#9AAAC3] hover:text-white hover:bg-[#101D35] transition-colors cursor-pointer"
                  title="Reset Viewport"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Canvas Header Legend */}
              <div className="absolute top-4 left-4 z-20 hidden sm:flex items-center gap-2 p-1.5 rounded-xl bg-[#060B18]/90 border border-[#1D3150] backdrop-blur-md text-[10px] font-mono">
                <span className="flex items-center gap-1 text-[#3995F6]">
                  <span className="w-2 h-2 rounded-full bg-[#3995F6]" /> Component
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Safety
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Procedure
                </span>
                <span className="flex items-center gap-1 text-cyan-300">
                  <span className="w-2 h-2 rounded-full bg-cyan-300" /> Tool
                </span>
              </div>

              {/* Dark Interactive Canvas Area */}
              <div
                className="w-full h-[520px] bg-[#060B18] cursor-grab active:cursor-grabbing relative overflow-hidden select-none bg-grid-pattern"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <svg
                  className="w-full h-full pointer-events-auto"
                  viewBox="0 0 920 540"
                  style={{
                    transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                    transformOrigin: "center center",
                    transition: isDragging ? "none" : "transform 0.15s ease-out",
                  }}
                >
                  {/* Glowing Edge Defs */}
                  <defs>
                    <linearGradient id="blueEdge" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1769C2" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#3995F6" stopOpacity="0.8" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Render Edges with Subtle Glow and Arrows */}
                  {canvasEdges.map((edge, idx) => {
                    const fromNode = canvasNodes.find((n) => n.id === edge.from);
                    const toNode = canvasNodes.find((n) => n.id === edge.to);
                    if (!fromNode || !toNode) return null;

                    const midX = (fromNode.x + toNode.x) / 2;
                    const midY = (fromNode.y + toNode.y) / 2;

                    return (
                      <g key={idx}>
                        {/* Glow halo line */}
                        <line
                          x1={fromNode.x}
                          y1={fromNode.y}
                          x2={toNode.x}
                          y2={toNode.y}
                          stroke="#1769C2"
                          strokeWidth="3"
                          opacity="0.3"
                          filter="url(#glow)"
                        />
                        {/* Core line */}
                        <line
                          x1={fromNode.x}
                          y1={fromNode.y}
                          x2={toNode.x}
                          y2={toNode.y}
                          stroke="#3995F6"
                          strokeWidth="1.5"
                          strokeDasharray="4 2"
                        />
                        {/* Edge Label pill */}
                        <rect
                          x={midX - 35}
                          y={midY - 9}
                          width="70"
                          height="18"
                          rx="9"
                          fill="#091329"
                          stroke="#1D3150"
                        />
                        <text
                          x={midX}
                          y={midY + 3}
                          fill="#9AAAC3"
                          fontSize="8"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          {edge.label}
                        </text>
                      </g>
                    );
                  })}

                  {/* Render Nodes */}
                  {canvasNodes.map((cn) => {
                    const theme = getCategoryTheme(cn.category);
                    const isSelected =
                      selectedNode?.id === cn.refId || selectedNode?.relative_path.includes(cn.refId);

                    return (
                      <g
                        key={cn.id}
                        transform={`translate(${cn.x}, ${cn.y})`}
                        onClick={() => handleNodeClick(cn.refId)}
                        className="cursor-pointer group"
                      >
                        {/* Pulse selection glow */}
                        {isSelected && (
                          <circle
                            r="34"
                            fill="none"
                            stroke={theme.stroke}
                            strokeWidth="2"
                            opacity="0.5"
                            className="animate-ping"
                          />
                        )}

                        {/* Node Card / Circle */}
                        <rect
                          x="-80"
                          y="-24"
                          width="160"
                          height="48"
                          rx="12"
                          fill="#0B1427"
                          stroke={isSelected ? theme.stroke : "#1D3150"}
                          strokeWidth={isSelected ? "2" : "1"}
                          className="transition-all hover:stroke-[#3995F6]"
                        />

                        {/* Category Indicator Dot */}
                        <circle cx="-62" cy="0" r="5" fill={theme.stroke} />

                        {/* Title text */}
                        <text
                          x="-50"
                          y="-4"
                          fill="#F5F7FC"
                          fontSize="10"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          {cn.title.length > 18 ? cn.title.slice(0, 16) + "..." : cn.title}
                        </text>

                        {/* Category badge text */}
                        <text
                          x="-50"
                          y="12"
                          fill={theme.stroke}
                          fontSize="8"
                          fontFamily="monospace"
                        >
                          {theme.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                <div className="absolute bottom-3 left-4 text-[10px] font-mono text-[#6F809A]">
                  Click any node to inspect physical Markdown frontmatter and YAML links.
                </div>
              </div>
            </div>
          )}

          {/* 2. CATALOG MATRIX VIEW */}
          {activeTab === "catalog" && (
            <div className="space-y-4">
              {/* Search & Category Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-[#6F809A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search nodes by part number, title, or relative path..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B1427] border border-[#1D3150] text-xs font-mono text-[#F5F7FC] placeholder-[#6F809A] focus:outline-none focus:border-[#3995F6]"
                  />
                </div>

                <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto pb-1 sm:pb-0">
                  {["all", "components", "safety", "procedures", "tools"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-mono uppercase transition-colors cursor-pointer border ${
                        categoryFilter === cat
                          ? "bg-[#1769C2]/20 border-[#3995F6] text-[#3995F6] font-bold"
                          : "bg-[#0B1427] border-[#1D3150] text-[#9AAAC3] hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Nodes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[480px] overflow-y-auto pr-1">
                {filteredNodes.map((node) => {
                  const theme = getCategoryTheme(node.category);
                  const isSelected = selectedNode?.id === node.id;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`card-tech p-4 text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#3995F6] bg-[#101D35] ring-1 ring-[#3995F6]/40"
                          : "hover:border-[#3995F6]/40"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${theme.bg} ${theme.text} border ${theme.border}`}>
                          {theme.label}
                        </span>
                        <span className="text-[10px] font-mono text-[#6F809A] truncate max-w-[140px]">
                          {node.relative_path}
                        </span>
                      </div>
                      <h4 className="font-bold text-[#F5F7FC] text-sm line-clamp-1">{node.title}</h4>
                      <p className="mt-1 text-xs text-[#9AAAC3] line-clamp-2 leading-relaxed">
                        {node.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {node.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-md bg-[#060B18] text-[9px] font-mono text-[#6F809A] border border-[#1D3150]"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. MERMAID FLOWCHART SPEC VIEW */}
          {activeTab === "mermaid" && (
            <div className="card-tech p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#3995F6] tracking-wider font-semibold">
                  Live Mermaid Directed Topology Specification
                </span>
                <span className="text-xs font-mono text-[#6F809A]">NetworkX AST Render</span>
              </div>
              <pre className="p-4 rounded-xl bg-[#060B18] border border-[#1D3150] text-xs font-mono text-[#9AAAC3] overflow-x-auto leading-relaxed whitespace-pre-wrap">
                {mermaidCode}
              </pre>
            </div>
          )}
        </div>

        {/* Right Node Details Inspector (4 cols) */}
        <div className="lg:col-span-4 card-tech p-6 space-y-5">
          {selectedNode ? (
            <>
              <div>
                <div className="flex items-center justify-between mb-3">
                  {(() => {
                    const theme = getCategoryTheme(selectedNode.category);
                    return (
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${theme.bg} ${theme.text} border ${theme.border}`}>
                        {theme.label}
                      </span>
                    );
                  })()}
                  <span className="text-xs font-mono text-[#10B981] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Node Synced
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#F5F7FC] tracking-tight">{selectedNode.title}</h3>
                <div className="mt-2 text-xs font-mono text-[#3995F6] bg-[#101D35] px-3 py-1 rounded-lg border border-[#1D3150] inline-block truncate max-w-full">
                  Path: {selectedNode.relative_path}
                </div>
                <p className="mt-4 text-xs sm:text-sm text-[#9AAAC3] leading-relaxed">
                  {selectedNode.description}
                </p>
              </div>

              {selectedNode.part_numbers && selectedNode.part_numbers.length > 0 && (
                <div className="pt-4 border-t border-[#1D3150]">
                  <span className="text-[11px] font-mono text-[#6F809A] uppercase tracking-wider block mb-2">
                    Verified Part Numbers:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.part_numbers.map((pn) => (
                      <span
                        key={pn}
                        className="px-2.5 py-0.5 rounded-md bg-[#060B18] text-xs font-mono font-bold text-[#F5F7FC] border border-[#1D3150]"
                      >
                        {pn}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-[#1D3150]">
                <span className="text-[11px] font-mono text-[#6F809A] uppercase tracking-wider block mb-2">
                  Semantic Node Tags:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-[#060B18] text-[#9AAAC3] border border-[#1D3150]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action: Jump to diagnosis with this node */}
              <div className="pt-4 border-t border-[#1D3150]">
                <button
                  onClick={() => {
                    navigate("/diagnose", {
                      state: {
                        initialQuery: `Inspect failure mode and repair protocol for ${selectedNode.title} (${selectedNode.relative_path})`
                      }
                    });
                  }}
                  className="w-full btn-primary-blue flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Diagnose with This Component</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-xs font-mono text-[#6F809A]">
              Select any graph node on the left to inspect physical YAML frontmatter and deterministic links.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
