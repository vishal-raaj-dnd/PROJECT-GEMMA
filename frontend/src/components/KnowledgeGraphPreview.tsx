import React, { useState, useEffect } from "react";
import { Network, CheckCircle2 } from "lucide-react";
import { OKFNodeSummary, GraphStats } from "../types/diagnostic";
import { ApiService } from "../services/api";

export const KnowledgeGraphPreview: React.FC = () => {
  const [nodes, setNodes] = useState<OKFNodeSummary[]>([]);
  const [stats, setStats] = useState<GraphStats | null>(null);
  const [selectedNode, setSelectedNode] = useState<OKFNodeSummary | null>(null);
  const [showMermaid, setShowMermaid] = useState(false);
  const [mermaidCode, setMermaidCode] = useState<string>("");

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

  const getCategoryBadge = (category: string) => {
    switch (category.toLowerCase()) {
      case "safety":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500/15 text-red-400 border border-red-500/20">SAFETY</span>;
      case "components":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#6C4CF1]/20 text-[#C9B8FF] border border-[#6C4CF1]/30">COMPONENT</span>;
      case "procedures":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/20">PROCEDURE</span>;
      case "tools":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/20">TOOL</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/20">FAULT CODE</span>;
    }
  };

  return (
    <section className="py-24 bg-[#0A0A0C] hairline-b">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#6C4CF1] font-semibold">
              In-Memory Knowledge Graph
            </span>
            <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Local OKF Graph Nodes
            </h2>
            <p className="mt-2 text-base text-[#9A9AA2]">
              Obsidian-compatible Markdown files linked with deterministic YAML frontmatter and relative paths.
            </p>
          </div>

          <button
            onClick={() => setShowMermaid(!showMermaid)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#111114] hover:bg-white/[0.08] text-white border border-white/[0.1] text-xs font-mono transition-colors cursor-pointer shrink-0"
          >
            <Network className="w-3.5 h-3.5 text-[#6C4CF1]" />
            <span>{showMermaid ? "Hide Mermaid Diagram" : "View Mermaid Flowchart"}</span>
          </button>
        </div>

        {/* Mermaid Graph View if toggled */}
        {showMermaid && (
          <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-[#111114] border border-white/[0.08] shadow-2xl">
            <div className="text-xs font-mono text-[#C9B8FF] mb-3 font-bold uppercase tracking-wider">
              Live Mermaid Knowledge Graph Topology:
            </div>
            <pre className="text-xs font-mono text-slate-300 bg-[#0A0A0C] p-5 rounded-2xl border border-white/[0.06] overflow-x-auto leading-relaxed">
              {mermaidCode}
            </pre>
          </div>
        )}

        {/* 2-Column Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Node Catalog List */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto pr-2">
            {nodes.map((node) => (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer text-left ${
                  selectedNode?.id === node.id
                    ? "bg-[#111114] border-[#6C4CF1] shadow-lg shadow-[#6C4CF1]/10 ring-1 ring-[#6C4CF1]/30"
                    : "bg-[#111114]/50 border-white/[0.06] hover:bg-[#111114] hover:border-white/[0.14]"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  {getCategoryBadge(node.category)}
                  <span className="text-[10px] font-mono text-[#9A9AA2] truncate max-w-[120px]">
                    {node.relative_path}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm line-clamp-1">{node.title}</h4>
                <p className="mt-1 text-xs text-[#9A9AA2] line-clamp-2 leading-relaxed">{node.description}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {node.tags.slice(0, 3).map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-full bg-[#0A0A0C] text-[10px] font-mono text-[#9A9AA2] border border-white/[0.06]">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Selected Node Details */}
          <div className="lg:col-span-5 p-8 rounded-3xl bg-[#111114] border border-white/[0.08] shadow-2xl flex flex-col justify-between">
            {selectedNode ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  {getCategoryBadge(selectedNode.category)}
                  <span className="text-xs font-mono text-[#34D399] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Node Loaded
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">{selectedNode.title}</h3>
                <div className="mt-2 text-xs font-mono text-[#C9B8FF] bg-[#6C4CF1]/10 px-3 py-1 rounded-full border border-[#6C4CF1]/20 inline-block">
                  Path: {selectedNode.relative_path}
                </div>
                <p className="mt-4 text-xs sm:text-sm text-[#9A9AA2] leading-relaxed">{selectedNode.description}</p>

                {selectedNode.part_numbers && selectedNode.part_numbers.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-white/[0.08]">
                    <span className="text-[11px] font-mono text-[#9A9AA2] uppercase tracking-wider">Part Numbers:</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {selectedNode.part_numbers.map((pn) => (
                        <span key={pn} className="px-2.5 py-0.5 rounded-full bg-[#0A0A0C] text-xs font-mono font-bold text-white border border-white/[0.08]">
                          {pn}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-white/[0.08]">
                  <span className="text-[11px] font-mono text-[#9A9AA2] uppercase tracking-wider">Tags:</span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedNode.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#0A0A0C] text-[#9A9AA2] border border-white/[0.06]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-[#9A9AA2] text-center py-12">Select a node to inspect attributes.</div>
            )}

            {stats && (
              <div className="mt-8 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-[#9A9AA2]">
                <span>Total Nodes: <strong className="text-white">{stats.total_nodes}</strong></span>
                <span>Active Edges: <strong className="text-white">{stats.total_edges}</strong></span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
