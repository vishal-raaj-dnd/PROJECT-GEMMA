import React, { useState } from "react";
import { ArrowDown, Cpu, Sparkles, Database, ShieldCheck, Zap } from "lucide-react";

interface HeroSectionProps {
  onScrollToWorkbench: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToWorkbench }) => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
      setTimeout(() => onScrollToWorkbench(), 400);
    } else {
      onScrollToWorkbench();
    }
  };

  return (
    <section id="overview" className="relative pt-16 pb-0 overflow-hidden bg-[#0A0A0C] text-center">
      <div className="max-w-4xl mx-auto px-6">
        {/* Massive Display Headline with Inline App Icon */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-[-0.04em] text-white flex items-center justify-center flex-wrap gap-x-4 gap-y-2 leading-none">
          <span>Meet</span>
          <span className="inline-block relative top-0 sm:top-1">
            <img
              src="/brand/mascot-icon.webp"
              alt="GemmaOps Mascot"
              className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl object-cover shadow-xl shadow-[#6C4CF1]/30 inline-block align-middle transform hover:scale-105 transition-transform"
            />
          </span>
          <span className="text-white">GemmaOps</span>
        </h1>

        {/* 2-3 Line Muted Subheadline */}
        <p className="mt-6 text-base sm:text-lg text-[#9A9AA2] leading-relaxed max-w-2xl mx-auto font-normal">
          An offline-first multimodal AI diagnostic engine for field technicians. It identifies broken components
          from photos, traverses local OKF knowledge graphs, and guarantees OSHA safety protocols.
        </p>

        {/* Pill-Shaped Primary Conversion Unit */}
        <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto">
          <div className="p-1.5 pl-5 rounded-full bg-[#111114] border border-white/[0.12] flex items-center justify-between shadow-2xl focus-within:border-[#6C4CF1]/60 transition-colors">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="technician@worksite.com"
              className="bg-transparent text-sm text-white placeholder-[#9A9AA2]/60 focus:outline-none w-full font-sans pr-2"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-white hover:bg-slate-200 text-[#0A0A0C] font-semibold text-xs sm:text-sm tracking-tight transition-all shrink-0 cursor-pointer shadow-md hover:shadow-lg"
            >
              {isSubmitted ? "Opening Engine..." : "Try the Model ↓"}
            </button>
          </div>
        </form>

        {/* Trust Row */}
        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#9A9AA2] font-normal flex-wrap">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34D399]"></span>
          </span>
          <span>
            <strong className="text-[#6C4CF1] font-semibold">3,936</strong> industrial technicians waiting
          </span>
          <span className="text-slate-600">•</span>
          <span>Zero cloud dependencies, 100% offline edge</span>
        </div>

        {/* Third-Party Style White Badge Card */}
        <div className="mt-6 inline-flex">
          <div className="px-4 py-2 rounded-xl bg-white text-[#0A0A0C] shadow-lg flex items-center gap-2.5 border border-slate-200">
            <div className="w-5 h-5 rounded-md bg-[#6C4CF1] text-white flex items-center justify-center font-bold text-[10px]">
              G
            </div>
            <div className="text-left leading-tight">
              <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold font-mono">
                BUILT ON
              </div>
              <div className="text-xs font-extrabold text-slate-900 tracking-tight">
                Google Gemma 4
              </div>
            </div>
            <div className="ml-3 pl-3 border-l border-slate-200 text-xs font-mono font-bold text-slate-700 flex items-center gap-1">
              <span className="text-[10px] text-[#6C4CF1]">▲</span> 12B
            </div>
          </div>
        </div>

        {/* Mascot Visual with 4 Orbiting Pill Badges */}
        <div className="relative mt-8 sm:mt-12 flex justify-center items-end">
          {/* Subtle purple radial glow rising behind mascot */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[550px] h-[260px] bg-[#6C4CF1]/20 blur-[110px] rounded-full pointer-events-none -z-0" />

          {/* Floating Pill Badges in an Arc */}
          {/* Badge 1: Top-Left */}
          <div className="absolute left-2 sm:left-12 top-10 sm:top-14 z-20 px-3.5 py-1.5 rounded-full bg-[#111114]/90 backdrop-blur-md border border-white/[0.12] text-xs text-slate-200 flex items-center gap-2 shadow-xl animate-pulse">
            <Database className="w-3.5 h-3.5 text-[#6C4CF1]" />
            <span className="font-medium text-[11px] sm:text-xs">Persistent OKF Graph</span>
          </div>

          {/* Badge 2: Bottom-Left */}
          <div className="absolute left-0 sm:left-4 bottom-14 sm:bottom-20 z-20 px-3.5 py-1.5 rounded-full bg-[#111114]/90 backdrop-blur-md border border-white/[0.12] text-xs text-slate-200 flex items-center gap-2 shadow-xl">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium text-[11px] sm:text-xs">Focused Automation</span>
          </div>

          {/* Badge 3: Top-Right */}
          <div className="absolute right-2 sm:right-12 top-10 sm:top-14 z-20 px-3.5 py-1.5 rounded-full bg-[#111114]/90 backdrop-blur-md border border-white/[0.12] text-xs text-slate-200 flex items-center gap-2 shadow-xl">
            <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
            <span className="font-medium text-[11px] sm:text-xs">OSHA LOTO Safety Gate</span>
          </div>

          {/* Badge 4: Bottom-Right */}
          <div className="absolute right-0 sm:right-4 bottom-14 sm:bottom-20 z-20 px-3.5 py-1.5 rounded-full bg-[#111114]/90 backdrop-blur-md border border-white/[0.12] text-xs text-slate-200 flex items-center gap-2 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-[#34D399]" />
            <span className="font-medium text-[11px] sm:text-xs">100% Offline Edge</span>
          </div>

          {/* Mascot Image cropped by the fold */}
          <div className="relative z-10 overflow-hidden pt-4 -mb-2">
            <img
              src="/brand/mascot-hero.webp"
              alt="GemmaOps Mascot"
              className="w-[500px] sm:w-[620px] max-w-full mx-auto object-contain block drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
