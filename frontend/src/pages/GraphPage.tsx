import React from "react";
import { KnowledgeGraphPreview } from "../components/KnowledgeGraphPreview";
import { GitBranch, Layers, ShieldCheck, Cpu } from "lucide-react";

export const GraphPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0B0E] py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Page Header */}
        <div className="mb-10 pb-8 border-b border-[#2A2A2E]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16171B] border border-[#2A2A2E] text-xs font-mono text-[#9CA3AF] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
                <span>IN-MEMORY NETWORKX DIRECTED GRAPH</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F5F5F7]">
                OKF Knowledge Graph Explorer
              </h1>
              <p className="mt-2 text-sm text-[#9CA3AF] max-w-2xl font-normal leading-relaxed">
                Explore the deterministic topology of components, safety checklists, repair procedures, and calibrated tools. All connections are maintained as in-memory graph edges.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#121316] border border-[#2A2A2E] text-left">
                <div className="text-[10px] font-mono text-[#9CA3AF] uppercase">Graph Engine</div>
                <div className="text-xs font-mono font-semibold text-[#10B981] flex items-center gap-1.5 mt-0.5">
                  <GitBranch className="w-3.5 h-3.5 text-[#10B981]" />
                  Zero Vector DB
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#121316] border border-[#2A2A2E] text-left">
                <div className="text-[10px] font-mono text-[#9CA3AF] uppercase">Traversal Mode</div>
                <div className="text-xs font-mono font-semibold text-[#FF6B35] flex items-center gap-1.5 mt-0.5">
                  <Layers className="w-3.5 h-3.5 text-[#FF6B35]" />
                  2-Hop Constrained
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Knowledge Graph Component */}
        <KnowledgeGraphPreview />
      </div>
    </div>
  );
};
