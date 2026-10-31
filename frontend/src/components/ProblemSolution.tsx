import React from "react";
import { AlertOctagon, CheckCircle2, ShieldAlert, Cpu, FileSearch, ArrowRight, BookX, Link2 } from "lucide-react";

export const ProblemSolution: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 border-b border-slate-800/60 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
            Frontline Field Operations
          </h2>
          <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why Standard Search & Generic RAG Fail in the Field
          </p>
          <p className="mt-4 text-slate-400 text-base">
            Heavy machinery repair requires deterministic safety interlocks. Here is how Gemma 4 Multimodal and the
            Open Knowledge Format (OKF) solve the industrial bottleneck.
          </p>
        </div>

        {/* Bento Grid Comparison */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* The Problem Card */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-red-950/20 to-slate-900/60 border border-red-500/20 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">The Frontline Problem</h3>
                <p className="text-xs font-mono text-red-300">Disconnected nacelles & thousands of manual pages</p>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-slate-300 text-sm">
              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <BookX className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Manual Lookup Friction:</strong> 100 meters above ground inside a wind
                  turbine, flipping through 3,000 pages of PDF schematics with greasy gloves is slow and error-prone.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Catastrophic Safety Risks:</strong> Missing a prerequisite Lockout/Tagout
                  (LOTO) step or depressurization procedure causes arc flashes or high-pressure hydraulic injection injuries.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <FileSearch className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">The Vector RAG Trap:</strong> Standard vector chunking retrieves isolated text
                  fragments out of context, often dropping critical safety warnings or hallucinating non-existent manual sections.
                </div>
              </div>
            </div>
          </div>

          {/* The OKF + Gemma 4 Solution Card */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-amber-950/20 to-slate-900/60 border border-amber-500/20 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">The Image + OKF Engine</h3>
                <p className="text-xs font-mono text-amber-300">Native multimodal vision + deterministic graph links</p>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-slate-300 text-sm">
              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <Cpu className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Instant Visual Ingestion:</strong> The technician snaps a picture of a
                  leaking valve, burnt PCB, or error LED code. Gemma 4 reads serial plates and defect markers natively.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <Link2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Deterministic Graph Traversal:</strong> Maps findings directly to local
                  Markdown nodes (`[component_spec.md]`), upstream safety protocols (`[[safety_loto.md]]`), and torque specs.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Verifiable Citations:</strong> Procedural steps cite exact local markdown
                  files and headings (`[^path#section]`). All citations are cryptographically audited before execution.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
