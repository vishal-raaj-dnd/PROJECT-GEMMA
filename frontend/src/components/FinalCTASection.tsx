import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Cpu, ShieldCheck } from "lucide-react";

export const FinalCTASection: React.FC = () => {
  return (
    <section className="py-28 bg-[#0B0B0E] relative overflow-hidden text-center">
      {/* Centered Warm Glow Echoing Hero */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#FF6B35]/12 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16171B] border border-[#2A2A2E] text-xs font-mono text-[#9CA3AF] mb-6">
          <Cpu className="w-3.5 h-3.5 text-[#FF6B35]" />
          <span>Local In-Memory Edge Deployment</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F5F5F7] leading-tight">
          Eliminate field guesswork. <br />
          Diagnose with deterministic truth.
        </h2>

        <p className="mt-5 text-base sm:text-lg text-[#9CA3AF] max-w-2xl mx-auto font-normal leading-relaxed">
          Compile thousands of pages of unstructured OEM service manuals into an offline OKF knowledge graph. Run multimodal vision diagnostics with zero cloud connectivity.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/diagnose"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-[#FF6B35] hover:bg-[#F97316] text-white font-medium text-sm transition-all shadow-lg shadow-[#FF6B35]/25"
          >
            <span>Launch Live Diagnostic Workbench</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/ingest"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg border border-[#2A2A2E] bg-[#121316] hover:bg-[#16171B] text-white font-medium text-sm transition-all"
          >
            <span>Upload OEM Manuals</span>
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs font-mono text-[#9CA3AF]/60">
          <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
          <span>Closed-world citation audit active • OSHA 1910.147 certified</span>
        </div>
      </div>
    </section>
  );
};

