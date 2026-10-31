import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, Wrench, CheckCircle2, Bookmark, ArrowUpRight } from "lucide-react";

export const ProductMockupBand: React.FC = () => {
  return (
    <section className="relative px-6 -mt-4 pb-20">
      <div className="max-w-5xl mx-auto">
        {/* Framed Mockup Container */}
        <div className="rounded-2xl border border-[#2A2A2E] bg-[#121316] p-2.5 sm:p-4 shadow-2xl">
          {/* Mockup Window Chrome */}
          <div className="rounded-xl border border-[#2A2A2E] bg-[#0B0B0E] overflow-hidden">
            {/* Top Window Bar */}
            <div className="px-4 py-3 border-b border-[#2A2A2E] bg-[#121316] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2A2A2E]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#2A2A2E]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#2A2A2E]" />
                <span className="text-[11px] font-mono text-[#9CA3AF] ml-2">
                  GemmaOps / Diagnostic Session: #DIAG-PRV-992-B
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#10B981]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                <span>Zero Hallucination Verified</span>
              </div>
            </div>

            {/* Mockup Inner Body */}
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Column: Visual Ingestion Image */}
              <div className="lg:col-span-5 relative rounded-xl overflow-hidden border border-[#2A2A2E] aspect-video sm:aspect-square bg-[#121316]">
                <img
                  src="/samples/sample_valve_leak.webp"
                  alt="Proportional Valve Weepage"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#0B0B0E]/85 border border-[#2A2A2E] text-[10px] font-mono text-[#FF6B35]">
                  Visual Defect: Viton Seal Extrusion
                </div>
              </div>

              {/* Right Column: Reasoning & Safety Gate */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF6B35]/15 text-[#FF6B35] border border-[#FF6B35]/30">
                    DETECTED COMPONENT
                  </span>
                  <span className="text-xs font-mono text-[#9CA3AF]">
                    Confidence: <strong className="text-white">96%</strong>
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white tracking-tight">
                  Proportional Pressure Relief Valve V2 (PRV-992-B)
                </h3>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  Subsystem: Nacelle Yaw Hydraulics. Observed radial fluid weeping around collar caused by high pulse
                  pressure spikes.
                </p>

                {/* Safety Interlock Pill */}
                <div className="p-3.5 rounded-xl bg-[#121316] border border-[#2A2A2E] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-[#9CA3AF]">
                    <ShieldCheck className="w-4 h-4 text-[#FF6B35]" />
                    <span>OSHA 1910.147 LOTO Verification</span>
                  </div>
                  <span className="text-[#10B981] font-semibold">Zero-Energy Confirmed</span>
                </div>

                {/* Torque Spec Badge */}
                <div className="p-3.5 rounded-xl bg-[#16171B] border border-[#2A2A2E] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#9CA3AF] block font-mono text-[11px]">Exact Fastener Rating:</span>
                    <strong className="text-white font-mono text-sm">35 Nm (M10 Class 10.9)</strong>
                  </div>
                  <div className="px-2.5 py-1 rounded bg-[#0B0B0E] border border-[#2A2A2E] text-[10px] font-mono text-[#FF6B35] flex items-center gap-1">
                    <Bookmark className="w-3 h-3" />
                    <span>proportional_relief_valve_v2.md</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Link
                    to="/diagnose"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[#FF6B35] hover:text-[#F97316] font-semibold"
                  >
                    <span>Test Full Diagnostic Engine</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
