import React from "react";
import { Link } from "react-router-dom";
import { Activity, ShieldCheck, Terminal, GitBranch, Lock, Cpu, ArrowUpRight } from "lucide-react";

export const CapacityFooter: React.FC = () => {
  return (
    <footer className="bg-[#060B18] border-t border-[#1D3150] pt-16 pb-12 text-[#9AAAC3]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Multi-column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-12 border-b border-[#1D3150]/70">
          {/* Brand Column (Col span 2) */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1769C2] to-[#0A3D78] flex items-center justify-center text-white font-bold text-xs shadow-md shadow-[#1769C2]/30 border border-[#3995F6]/40">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="text-[#F5F7FC] font-extrabold tracking-tight text-lg">
                FIELD<span className="text-[#3995F6]">ENGINE</span>
              </span>
            </Link>
            <p className="text-xs text-[#9AAAC3] max-w-sm leading-relaxed font-normal">
              Autonomous offline hardware diagnostic engine for mission-critical industrial assets. Powered by Multimodal Gemma edge reasoning, deterministic NetworkX knowledge graph traversal, and zero-hallucination citation verification.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0B1427] border border-[#1D3150] text-[10px] font-mono text-[#9AAAC3]">
                <ShieldCheck className="w-3 h-3 text-[#10B981]" />
                Zero Hallucination
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0B1427] border border-[#1D3150] text-[10px] font-mono text-[#9AAAC3]">
                <Terminal className="w-3 h-3 text-[#3995F6]" />
                Edge In-Memory
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0B1427] border border-[#1D3150] text-[10px] font-mono text-[#9AAAC3]">
                <Lock className="w-3 h-3 text-[#F59E0B]" />
                OSHA 1910.147 LOTO
              </span>
            </div>
          </div>

          {/* Column 1: Core Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#F5F7FC] font-semibold">
              Operational Engine
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/diagnose" className="text-[#9AAAC3] hover:text-[#3995F6] transition-colors flex items-center gap-1">
                  <span>Diagnostic Workbench</span>
                </Link>
              </li>
              <li>
                <Link to="/graph" className="text-[#9AAAC3] hover:text-[#3995F6] transition-colors flex items-center gap-1">
                  <span>OKF Knowledge Graph</span>
                </Link>
              </li>
              <li>
                <Link to="/ingest" className="text-[#9AAAC3] hover:text-[#3995F6] transition-colors flex items-center gap-1">
                  <span>Manual Ingestion Compiler</span>
                </Link>
              </li>
              <li>
                <Link to="/safety" className="text-[#9AAAC3] hover:text-[#3995F6] transition-colors flex items-center gap-1">
                  <span>OSHA Safety Compliance</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Architectures */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#F5F7FC] font-semibold">
              Specifications
            </h4>
            <ul className="space-y-2.5 text-xs text-[#6F809A]">
              <li className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#3995F6]" />
                <span>Multimodal Gemma Edge</span>
              </li>
              <li className="flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-[#3995F6]" />
                <span>NetworkX RAM Graph</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                <span>CitationAuditor AST</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#3995F6]" />
                <span>Quantized INT4 Execution</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Standards & Safety */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#F5F7FC] font-semibold">
              Industrial Standards
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/safety" className="text-[#9AAAC3] hover:text-[#3995F6] transition-colors">
                  OSHA 1910.147 LOTO
                </Link>
              </li>
              <li>
                <span className="text-[#6F809A]">ISO 13849 Safety Integrity</span>
              </li>
              <li>
                <span className="text-[#6F809A]">IEC 61508 Functional Safety</span>
              </li>
              <li>
                <span className="text-[#6F809A]">ATA 100 Aviation Structure</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#6F809A]">
          <div>
            © {new Date().getFullYear()} Field Engineering Diagnostic Engine. All deterministic citations verified.
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-[#10B981]">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              Offline Operational Ready
            </span>
            <span>Local Node: v1.0.4-edge</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

