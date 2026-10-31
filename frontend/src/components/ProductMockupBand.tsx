import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, Wrench, CheckCircle2, Bookmark, ArrowUpRight, Activity } from "lucide-react";

export const ProductMockupBand: React.FC = () => {
  return (
    <section className="relative px-4 sm:px-6 -mt-6 pb-20">
      <div className="max-w-5xl mx-auto">
        {/* Framed Mockup Container */}
        <div className="rounded-2xl border border-[#1D3150] bg-[#091329] p-2.5 sm:p-4 shadow-2xl shadow-[#1769C2]/10">
          {/* Mockup Window Chrome */}
          <div className="rounded-xl border border-[#1D3150] bg-[#060B18] overflow-hidden">
            {/* Top Window Bar */}
            <div className="px-4 py-3 border-b border-[#1D3150] bg-[#0B1427] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1D3150]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#1D3150]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#1D3150]" />
                <span className="text-[11px] font-mono text-[#9AAAC3] ml-2 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#3995F6]" />
                  <span>FIELDENGINE / Session: #DIAG-PRV-992-B</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#10B981]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                <span>CitationAuditor Verified</span>
              </div>
            </div>

            {/* Mockup Inner Body */}
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Column: Visual Ingestion Image */}
              <div className="lg:col-span-5 relative rounded-xl overflow-hidden border border-[#1D3150] aspect-video sm:aspect-square bg-[#0B1427]">
                <img
                  src="/samples/sample_valve_leak.webp"
                  alt="Proportional Valve Weepage"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#060B18]/90 border border-[#1D3150] text-[10px] font-mono text-[#3995F6] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3995F6]" />
                  Defect: Viton Seal Extrusion
                </div>
              </div>

              {/* Right Column: Reasoning & Safety Gate */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1769C2]/20 text-[#3995F6] border border-[#3995F6]/30">
                    DETECTED HARDWARE
                  </span>
                  <span className="text-xs font-mono text-[#9AAAC3]">
                    Visual Match: <strong className="text-[#10B981]">96%</strong>
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#F5F7FC] tracking-tight">
                  Proportional Pressure Relief Valve V2 (PRV-992-B)
                </h3>
                <p className="text-xs text-[#9AAAC3] leading-relaxed">
                  Subsystem: Nacelle Yaw Hydraulics. Radial fluid weeping observed around solenoid hex collar due to high pulse pressure spikes.
                </p>

                {/* Safety Interlock Pill */}
                <div className="p-3.5 rounded-xl bg-[#0B1427] border border-[#1D3150] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-[#9AAAC3]">
                    <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                    <span>OSHA 1910.147 LOTO Verification</span>
                  </div>
                  <span className="text-[#10B981] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                    Zero-Energy Confirmed
                  </span>
                </div>

                {/* Torque Spec Badge */}
                <div className="p-3.5 rounded-xl bg-[#0B1427] border border-[#1D3150] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#9AAAC3] block font-mono text-[11px]">Exact Fastener Rating:</span>
                    <strong className="text-[#F5F7FC] font-mono text-sm">35 Nm (M10 Class 10.9)</strong>
                  </div>
                  <div className="px-2.5 py-1 rounded bg-[#101D35] border border-[#1D3150] text-[10px] font-mono text-[#3995F6] flex items-center gap-1">
                    <Bookmark className="w-3 h-3" />
                    <span>proportional_relief_valve_v2.md</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Link
                    to="/diagnose"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[#3995F6] hover:text-[#58A6FF] font-semibold"
                  >
                    <span>Launch Diagnostic Workbench</span>
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

