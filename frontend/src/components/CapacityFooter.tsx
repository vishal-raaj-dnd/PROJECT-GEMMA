import React from "react";
import { Link } from "react-router-dom";
import { Cpu, ShieldCheck, Terminal, GitBranch } from "lucide-react";

export const CapacityFooter: React.FC = () => {
  return (
    <footer className="bg-[#0B0B0E] border-t border-[#2A2A2E] pt-16 pb-12 text-[#9CA3AF]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Multi-column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-12 border-b border-[#2A2A2E]/60">
          {/* Brand Column (Col span 2) */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#E0531D] flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-[#FF6B35]/25">
                <Cpu className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-white font-bold tracking-tight text-base">
                Gemma<span className="text-[#FF6B35]">Ops</span>
              </span>
            </Link>
            <p className="text-xs text-[#9CA3AF] max-w-sm leading-relaxed font-normal">
              Autonomous offline hardware diagnostic engine for mission-critical industrial assets. Powered by Google Gemma 4 multimodal reasoning and Open Knowledge Files (OKF) graph traversal.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#121316] border border-[#2A2A2E] text-[10px] font-mono text-[#9CA3AF]">
                <ShieldCheck className="w-3 h-3 text-[#10B981]" />
                Zero Hallucination
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#121316] border border-[#2A2A2E] text-[10px] font-mono text-[#9CA3AF]">
                <Terminal className="w-3 h-3 text-[#FF6B35]" />
                Edge In-Memory
              </span>
            </div>
          </div>

          {/* Column 1: Engine Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#F5F5F7] font-semibold">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/diagnose" className="hover:text-white transition-colors">
                  Diagnostic Workbench
                </Link>
              </li>
              <li>
                <Link to="/graph" className="hover:text-white transition-colors">
                  OKF Graph Visualizer
                </Link>
              </li>
              <li>
                <Link to="/ingest" className="hover:text-white transition-colors">
                  OmniOKF Compiler
                </Link>
              </li>
              <li>
                <Link to="/safety" className="hover:text-white transition-colors">
                  Safety Gate Interlock
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Architectures */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#F5F5F7] font-semibold">
              Specifications
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-[#6B7280]">Gemma 4 Multimodal</span>
              </li>
              <li>
                <span className="text-[#6B7280]">NetworkX Knowledge Graph</span>
              </li>
              <li>
                <span className="text-[#6B7280]">Closed-World Citation Engine</span>
              </li>
              <li>
                <span className="text-[#6B7280]">Sub-second Edge Inference</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Standards & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#F5F5F7] font-semibold">
              Standards
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/safety" className="hover:text-white transition-colors">
                  OSHA 1910.147 (LOTO)
                </Link>
              </li>
              <li>
                <span className="text-[#6B7280]">ISO 13849 Safety Integrity</span>
              </li>
              <li>
                <span className="text-[#6B7280]">MIL-STD 810H Maintenance</span>
              </li>
              <li>
                <a
                  href="https://github.com/vishal-raaj-dnd/PROJECT-GEMMA"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <GitBranch className="w-3 h-3 text-[#FF6B35]" />
                  <span>GitHub Repository</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#6B7280]">
          <div>
            © 2026 GemmaOps Diagnostic Engine. Built with Google Gemma 4 & OKF.
          </div>
          <div className="flex items-center gap-6">
            <span>Deterministic Grounding</span>
            <span>•</span>
            <span>Zero-Knowledge Latency</span>
            <span>•</span>
            <span>Air-Gapped Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
