import React from "react";
import { AlertOctagon, CheckCircle2, ShieldAlert, Cpu, FileSearch, Link2, BookX, ArrowRight } from "lucide-react";

export const ProblemSolution: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-[#060B18] border-b border-[#1D3150]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#3995F6] font-semibold">
            FRONTLINE OPERATIONS
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F5F7FC] leading-tight">
            Why Generic RAG Fails in Industrial Fields
          </h2>
          <p className="mt-4 text-base text-[#9AAAC3]">
            Heavy machinery repair requires deterministic safety. How Multimodal Vision and the Open Knowledge
            Format (OKF) eliminate hallucinations in disconnected environments.
          </p>
        </div>

        {/* 2-Column Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* The Problem Column */}
          <div className="p-8 rounded-2xl bg-[#0B1427] border border-[#1D3150] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">The Frontline Bottleneck</h3>
                  <p className="text-xs font-mono text-[#6F809A]">10,000 pages of manuals • Zero internet</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-[#9AAAC3]">
                <div className="p-4 rounded-xl bg-[#060B18] border border-[#1D3150] flex items-start gap-3">
                  <BookX className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Manual Lookup Friction:</strong>
                    Inside a wind turbine nacelle 100 meters above ground, searching through 3,000-page PDF schematics with greasy gloves is slow, hazardous, and costly ($25,000/hr downtime).
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#060B18] border border-[#1D3150] flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Catastrophic Safety Risks:</strong>
                    Missing an upstream Lockout/Tagout (LOTO) step or depressurization procedure causes arc flashes, toxic leaks, or high-pressure hydraulic injection injuries.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#060B18] border border-[#1D3150] flex items-start gap-3">
                  <FileSearch className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Vector RAG Chunk Fragmentation:</strong>
                    Standard vector embeddings split sentences arbitrarily, discarding strict procedural prerequisites and causing AI hallucinations.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* The Solution Column */}
          <div className="p-8 rounded-2xl bg-[#0B1427] border border-[#1769C2]/50 shadow-xl shadow-[#1769C2]/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#1769C2]/20 text-[#3995F6] border border-[#3995F6]/40 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">The Deterministic Engine</h3>
                  <p className="text-xs font-mono text-[#3995F6]">Multimodal Vision + OKF RAM Graph</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-[#9AAAC3]">
                <div className="p-4 rounded-xl bg-[#060B18] border border-[#1D3150] flex items-start gap-3">
                  <Cpu className="w-5 h-5 text-[#3995F6] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Native Multimodal Edge Vision:</strong>
                    Point a camera at a leaking valve or burnt PCB. The on-device engine identifies part numbers and visual defect indicators in milliseconds.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#060B18] border border-[#1D3150] flex items-start gap-3">
                  <Link2 className="w-5 h-5 text-[#3995F6] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Explicit OKF Graph Traversal:</strong>
                    Concept nodes maintain explicit parent-child links. The engine traverses upstream safety nodes before mechanical repair instructions are surfaced.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#060B18] border border-[#1D3150] flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Zero-Hallucination Citations:</strong>
                    Every repair torque rating cites an exact physical Markdown node and section verified by CitationAuditor regex.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
