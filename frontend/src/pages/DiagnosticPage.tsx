import React from "react";
import { DiagnosticWorkbench } from "../components/DiagnosticWorkbench";
import { Cpu, ShieldCheck, Wrench, Eye } from "lucide-react";

export const DiagnosticPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0B0E] py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Page Header */}
        <div className="mb-10 pb-8 border-b border-[#2A2A2E]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16171B] border border-[#2A2A2E] text-xs font-mono text-[#9CA3AF] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
                <span>MULTIMODAL HARDWARE DIAGNOSTIC INTERFACE</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F5F5F7]">
                Field Diagnostic Workbench
              </h1>
              <p className="mt-2 text-sm text-[#9CA3AF] max-w-2xl font-normal leading-relaxed">
                Capture or upload physical component photos, hydraulic error displays, or burnt PCBs. Gemma 4 identifies part numbers and traverses local OKF nodes with zero cloud connectivity.
              </p>
            </div>

            {/* Status Pill Cards */}
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#121316] border border-[#2A2A2E] text-left">
                <div className="text-[10px] font-mono text-[#9CA3AF] uppercase">Engine Status</div>
                <div className="text-xs font-mono font-semibold text-[#10B981] flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  Gemma 4 INT4 Ready
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#121316] border border-[#2A2A2E] text-left">
                <div className="text-[10px] font-mono text-[#9CA3AF] uppercase">Safety Interlock</div>
                <div className="text-xs font-mono font-semibold text-[#FF6B35] flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FF6B35]" />
                  OSHA 1910.147 Enforced
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workbench Core */}
        <DiagnosticWorkbench />
      </div>
    </div>
  );
};
