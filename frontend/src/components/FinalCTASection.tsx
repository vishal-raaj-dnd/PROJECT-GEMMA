import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Cpu, ShieldCheck, Wrench, GitBranch } from "lucide-react";

export const FinalCTASection: React.FC = () => {
  return (
    <section className="py-28 bg-[#060B18] relative overflow-hidden text-center radial-blue-cta">
      {/* Background Centered Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#1769C2]/15 blur-[140px] rounded-full pointer-events-none" />

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1427] border border-[#1D3150] text-xs font-mono text-[#9AAAC3] mb-6 shadow-sm">
          <Cpu className="w-3.5 h-3.5 text-[#3995F6]" />
          <span className="text-[#F5F7FC]">LOCAL IN-MEMORY EDGE DEPLOYMENT</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F5F7FC] leading-tight">
          Eliminate field guesswork. <br />
          <span className="bg-gradient-to-r from-[#F5F7FC] via-[#D1E2FF] to-[#3995F6] bg-clip-text text-transparent">
            Diagnose with deterministic truth.
          </span>
        </h2>

        <p className="mt-5 text-base sm:text-lg text-[#9AAAC3] max-w-2xl mx-auto font-normal leading-relaxed">
          Compile thousands of pages of unstructured OEM service manuals into an offline OKF knowledge graph. Run multimodal vision diagnostics with zero cloud connectivity.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/diagnose"
            className="w-full sm:w-auto btn-primary-blue flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all shadow-lg"
          >
            <Wrench className="w-4 h-4" />
            <span>Launch Diagnostic Workbench</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/ingest"
            className="w-full sm:w-auto btn-secondary-blue flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all"
          >
            <GitBranch className="w-4 h-4 text-[#3995F6]" />
            <span>Upload OEM Manuals</span>
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs font-mono text-[#6F809A]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
          <span>Closed-world citation audit active • OSHA 1910.147 enforced</span>
        </div>
      </div>
    </section>
  );
};

