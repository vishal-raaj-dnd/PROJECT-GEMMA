import React from "react";
import { AlertOctagon, CheckCircle2, ShieldAlert, Cpu, FileSearch, Link2, BookX, ArrowRight } from "lucide-react";

export const ProblemSolution: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-[#0A0A0C] hairline-b">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#6C4CF1] font-semibold">
            Frontline Operations
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Why Generic RAG Fails in Industrial Fields
          </h2>
          <p className="mt-4 text-base text-[#9A9AA2]">
            Heavy machinery repair requires deterministic safety. How Gemma 4 Multimodal and the Open Knowledge
            Format (OKF) eliminate hallucinations in disconnected environments.
          </p>
        </div>

        {/* 2-Column Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* The Problem Column */}
          <div className="p-8 rounded-3xl bg-[#111114] border border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">The Frontline Bottleneck</h3>
                  <p className="text-xs font-mono text-[#9A9AA2]">10,000 pages of manuals • Zero internet</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-[#9A9AA2]">
                <div className="p-4 rounded-2xl bg-[#0A0A0C] border border-white/[0.06] flex items-start gap-3">
                  <BookX className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Manual Lookup Friction:</strong>
                    Inside a wind turbine nacelle 100 meters above ground, searching through 3,000-page PDF schematics with greasy gloves is slow, hazardous, and costly ($25,000/hr downtime).
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0A0A0C] border border-white/[0.06] flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Catastrophic Safety Risks:</strong>
                    Missing an upstream Lockout/Tagout (LOTO) step or depressurization procedure causes arc flashes, toxic leaks, or high-pressure hydraulic injection injuries.
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0A0A0C] border border-white/[0.06] flex items-start gap-3">
                  <FileSearch className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">The Vector RAG Trap:</strong>
                    Standard vector chunking treats documents as isolated text chunks, dropping prerequisite safety warnings and fabricating non-existent manual chapters.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* The Solution Column */}
          <div className="p-8 rounded-3xl bg-[#111114] border border-[#6C4CF1]/30 shadow-xl shadow-[#6C4CF1]/5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-[#6C4CF1]/15 text-[#C9B8FF] border border-[#6C4CF1]/30 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-[#6C4CF1]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">The Image + OKF Engine</h3>
                  <p className="text-xs font-mono text-[#C9B8FF]">Multimodal vision • Deterministic graph traversal</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-[#9A9AA2]">
                <div className="p-4 rounded-2xl bg-[#0A0A0C] border border-white/[0.06] flex items-start gap-3">
                  <Cpu className="w-5 h-5 text-[#6C4CF1] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Native Multimodal Ingestion:</strong>
                    Technicians snap a photo of a burnt PCB or leaking relief valve. Gemma 4 reads component markings and defect wear directly on-device.
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0A0A0C] border border-white/[0.06] flex items-start gap-3">
                  <Link2 className="w-5 h-5 text-[#6C4CF1] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Deterministic Graph Traversal:</strong>
                    Maps findings directly to local OKF Markdown nodes (`[component_spec.md]`), upstream safety protocols (`[[safety_loto.md]]`), and exact torque ratings.
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0A0A0C] border border-white/[0.06] flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#34D399] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Verifiable Closed-World Citations:</strong>
                    Every repair step is audited against the local filesystem. Zero fake citations or invented procedures are permitted to execute.
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
