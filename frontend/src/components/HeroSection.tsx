import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, ShieldCheck, Zap } from "lucide-react";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-24 pb-16 overflow-hidden bg-[#0B0B0E] text-center radial-warm-hero">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16171B] border border-[#2A2A2E] text-[#9CA3AF] text-xs font-mono font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
          <span>Google Gemma 4 Multimodal + OmniOKF Knowledge Graph</span>
        </div>

        {/* Large Two-Line Display Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.03em] text-[#F5F5F7] leading-[1.08] max-w-4xl mx-auto">
          Offline hardware diagnostics <br className="hidden sm:inline" />
          for industrial field operations.
        </h1>

        {/* Muted Subcopy */}
        <p className="mt-6 text-base sm:text-lg text-[#9CA3AF] max-w-2xl mx-auto leading-relaxed font-normal">
          Empowering technicians servicing wind turbines, aircraft engines, and industrial machinery with multimodal
          visual identification, deterministic OKF graph traversal, and zero-hallucination safety protocols.
        </p>

        {/* Pair of CTAs: Primary filled warm accent + Secondary ghost */}
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            to="/diagnose"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#FF6B35] hover:bg-[#F97316] text-white font-medium text-sm transition-all shadow-md shadow-[#FF6B35]/20"
          >
            <span>Launch Live Diagnostic</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/graph"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-[#2A2A2E] bg-[#121316] hover:bg-[#16171B] text-white font-medium text-sm transition-all"
          >
            <span>Explore Knowledge Graph</span>
          </Link>
        </div>

        {/* Quiet Trust Line */}
        <div className="mt-8 flex items-center justify-center gap-3 text-xs font-mono text-[#9CA3AF]/70">
          <span>100% Offline Edge Capable</span>
          <span>•</span>
          <span>Zero Cloud Vector DB</span>
          <span>•</span>
          <span>OSHA 1910.147 Enforced</span>
        </div>
      </div>
    </section>
  );
};
