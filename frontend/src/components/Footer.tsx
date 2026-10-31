import React from "react";
import { Cpu, Github, BookOpen, ShieldCheck, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-12 text-slate-400 text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Cpu className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-white font-sans">
              GEMMA<span className="text-amber-400">OPS</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Field Engineering & Hardware Diagnostic Engine
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-300">
          <div className="flex items-center gap-1.5 text-amber-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Target: Gemma 4 12B / Gemma 4 E4B</span>
          </div>
          <a
            href="https://github.com/vishal-raaj-dnd/PROJECT-GEMMA"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>GitHub Repository</span>
          </a>
        </div>

        <div className="text-slate-500 text-center sm:text-right">
          <div>Built with OmniOKF & Multimodal Gemma</div>
          <div className="text-[10px] text-slate-600 mt-0.5">OSHA 1910.147 LOTO Verification Guaranteed</div>
        </div>
      </div>
    </footer>
  );
};
