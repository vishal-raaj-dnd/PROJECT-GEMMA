import React from "react";
import { DiagnosticWorkbench } from "../components/DiagnosticWorkbench";
import { Cpu, ShieldCheck, Wrench, HardDrive, Terminal } from "lucide-react";

export const DiagnosticPage: React.FC = () => {
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
                  MULTIMODAL HARDWARE DIAGNOSTIC INTERFACE
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#F5F7FC]">
                Field Diagnostic Workstation
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-[#9AAAC3] max-w-3xl font-normal leading-relaxed">
                Capture physical component photos, acoustic frequency notes, or error displays. The edge engine identifies part numbers, evaluates defect severity, traverses deterministic OKF graph nodes, and enforces strict Lockout/Tagout safety gates.
              </p>
            </div>

            {/* Status Pill Cards */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="p-3 rounded-xl bg-[#0B1427] border border-[#1D3150] text-left">
                <div className="text-[10px] font-mono text-[#6F809A] uppercase tracking-wider">Engine Status</div>
                <div className="text-xs font-mono font-semibold text-[#10B981] flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  Multimodal INT4 Active
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#0B1427] border border-[#1D3150] text-left">
                <div className="text-[10px] font-mono text-[#6F809A] uppercase tracking-wider">Safety Gate</div>
                <div className="text-xs font-mono font-semibold text-[#F59E0B] flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
                  OSHA 1910.147 Enforced
                </div>
              </div>
              <div className="hidden lg:block p-3 rounded-xl bg-[#0B1427] border border-[#1D3150] text-left">
                <div className="text-[10px] font-mono text-[#6F809A] uppercase tracking-wider">Citation Guardrail</div>
                <div className="text-xs font-mono font-semibold text-[#3995F6] flex items-center gap-1.5 mt-0.5">
                  <Terminal className="w-3.5 h-3.5 text-[#3995F6]" />
                  Closed-World AST
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

