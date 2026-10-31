import React from "react";
import { ArrowRight, ShieldCheck, Zap, Database, Camera, AlertTriangle, Layers, Wrench } from "lucide-react";

interface HeroSectionProps {
  onExploreClick: () => void;
  onSampleClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick, onSampleClick }) => {
  return (
    <section id="overview" className="relative pt-12 pb-20 overflow-hidden border-b border-slate-800/60">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow Pill */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium shadow-inner shadow-amber-500/10">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Google Gemma 4 Multimodal + OmniOKF Knowledge Graph</span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center mt-6 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
            Frontline Hardware Diagnostics for{" "}
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
              Zero-Connectivity
            </span>{" "}
            Industrial Fields
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Technicians fixing wind turbines, aircraft engines, or subterranean pumps operate under high-risk conditions
            with thousands of pages of manuals. Snap a photo of a faulty part—Gemma 4 maps findings directly to your
            local <span className="font-semibold text-amber-300">Open Knowledge Format (OKF)</span> graph and enforces OSHA Lockout/Tagout safety gates with verified citations.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-base shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Camera className="w-5 h-5 text-slate-950" />
            Launch Live Diagnostic Workbench
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onSampleClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-base transition-all cursor-pointer"
          >
            <Layers className="w-5 h-5 text-amber-400" />
            Try Pre-loaded Industrial Samples
          </button>
        </div>

        {/* Key Operational Metric Badges */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400">0%</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Cloud API Reliance</div>
            <div className="text-[11px] text-slate-500 mt-0.5">100% Edge Offline Capable</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">100%</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Deterministic Citations</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Zero Fake Manual Links</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-400">OSHA 1910</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Safety Gate Enforcement</div>
            <div className="text-[11px] text-slate-500 mt-0.5">LOTO Zero Energy Mandatory</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-400">&lt; 500ms</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Graph Traversal</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Zero Cloud Vector DB</div>
          </div>
        </div>
      </div>
    </section>
  );
};
