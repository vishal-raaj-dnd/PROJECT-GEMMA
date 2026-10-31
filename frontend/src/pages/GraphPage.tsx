import React from "react";
import { KnowledgeGraphPreview } from "../components/KnowledgeGraphPreview";
import { GitBranch, Layers, ShieldCheck, Cpu, HardDrive } from "lucide-react";

export const GraphPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#060B18] py-10">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 pb-6 border-b border-[#1D3150]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1427] border border-[#1D3150] text-xs font-mono text-[#9AAAC3] mb-3 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#3995F6] animate-pulse" />
                <span className="text-[#F5F7FC] font-semibold uppercase tracking-wider">
                  IN-MEMORY NETWORKX DIRECTED TOPOLOGY
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#F5F7FC]">
                Knowledge Graph Workspace
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-[#9AAAC3] max-w-3xl font-normal leading-relaxed">
                Inspect deterministic graph topology connecting components, Lockout/Tagout prerequisites, maintenance procedures, and calibrated tooling. Evaluated entirely in RAM with sub-millisecond edge latency and zero external vector databases.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="p-3 rounded-xl bg-[#0B1427] border border-[#1D3150] text-left">
                <div className="text-[10px] font-mono text-[#6F809A] uppercase tracking-wider">Graph Engine</div>
                <div className="text-xs font-mono font-semibold text-[#10B981] flex items-center gap-1.5 mt-0.5">
                  <GitBranch className="w-3.5 h-3.5 text-[#10B981]" />
                  RAM NetworkX
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#0B1427] border border-[#1D3150] text-left">
                <div className="text-[10px] font-mono text-[#6F809A] uppercase tracking-wider">Traversal Mode</div>
                <div className="text-xs font-mono font-semibold text-[#3995F6] flex items-center gap-1.5 mt-0.5">
                  <Layers className="w-3.5 h-3.5 text-[#3995F6]" />
                  Deterministic 2-Hop
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

