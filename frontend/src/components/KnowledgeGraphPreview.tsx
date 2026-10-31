import React, { useState, useEffect } from "react";
import { Layers, Network, Tag, ExternalLink, Shield, Wrench, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";
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
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/20">SAFETY</span>;
      case "components":
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">COMPONENT</span>;
      case "procedures":
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">PROCEDURE</span>;
      case "tools":
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">TOOL</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">FAULT CODE</span>;
    }
  };

  return (
    <section className="py-20 border-b border-slate-800/60 bg-slate-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
              Local OKF Knowledge Base
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-white tracking-tight">
              In-Memory Knowledge Graph & Nodes
            </p>
            <p className="mt-1 text-slate-400 text-sm">
              Obsidian-compatible Markdown files linked with deterministic YAML frontmatter and relative paths.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMermaid(!showMermaid)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono transition-colors cursor-pointer"
            >
              <Network className="w-4 h-4 text-cyan-400" />
              {showMermaid ? "Hide Mermaid Diagram" : "View Mermaid Flowchart"}
            </button>
          </div>
        </div>

        {/* Mermaid Drawer if toggled */}
        {showMermaid && (
          <div className="mt-6 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-x-auto">
            <div className="text-xs font-mono text-cyan-400 mb-2 font-bold uppercase tracking-wider">
              Live Mermaid Knowledge Graph Topology:
            </div>
            <pre className="text-xs font-mono text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto leading-relaxed">
              {mermaidCode}
            </pre>
          </div>
        )}

        {/* Nodes Grid & Inspector */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Node Catalog List */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-2">
            {nodes.map((node) => (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                  selectedNode?.id === node.id
                    ? "bg-slate-900 border-amber-500/70 ring-1 ring-amber-500/30"
                    : "bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  {getCategoryBadge(node.category)}
                  <span className="text-[10px] font-mono text-slate-500 truncate max-w-[140px]">
                    {node.relative_path}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm line-clamp-1">{node.title}</h4>
                <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">{node.description}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {node.tags.slice(0, 3).map((t) => (
                    <span key={t} className="px-1.5 py-0.5 rounded bg-slate-800/80 text-[10px] font-mono text-slate-400">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Selected Node Details */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
            {selectedNode ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  {getCategoryBadge(selectedNode.category)}
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Node Loaded
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{selectedNode.title}</h3>
                <div className="mt-2 text-xs font-mono text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20 inline-block">
                  Path: {selectedNode.relative_path}
                </div>
                <p className="mt-3 text-xs text-slate-300 leading-relaxed">{selectedNode.description}</p>

                {selectedNode.part_numbers && selectedNode.part_numbers.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-800">
                    <span className="text-[11px] font-mono text-slate-400 uppercase">Part Numbers:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedNode.part_numbers.map((pn) => (
                        <span key={pn} className="px-2 py-0.5 rounded bg-slate-800 text-xs font-mono font-bold text-amber-300">
                          {pn}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">Tags & Taxonomies:</span>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {selectedNode.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-500 text-center py-10">Select a node to inspect OKF attributes.</div>
            )}

            {stats && (
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
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
