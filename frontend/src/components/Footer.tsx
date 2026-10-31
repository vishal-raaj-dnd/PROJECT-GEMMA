import React from "react";

interface FooterProps {
  onScrollToTop: () => void;
  onScrollToWorkbench: () => void;
  onScrollToFAQ: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToTop, onScrollToWorkbench, onScrollToFAQ }) => {
  return (
    <footer className="relative bg-[#0A0A0C] pt-20 overflow-hidden hairline-t">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Top Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 pb-12 border-b border-white/[0.08]">
          {/* Left: Logo mark + Wordmark + Tagline */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <img
                src="/brand/mascot-icon.webp"
                alt="GemmaOps"
                className="w-7 h-7 rounded-lg object-cover"
              />
              <span className="text-white font-bold tracking-tight text-lg">GemmaOps</span>
            </div>
            <p className="text-xs text-[#9A9AA2] max-w-sm leading-relaxed">
              Frontline hardware diagnostic engine for field technicians. Powered by Google Gemma 4 and OmniOKF linked knowledge graphs.
            </p>
          </div>

          {/* Right: Three Text Links */}
          <div className="flex items-center gap-8 text-sm">
            <button
              onClick={onScrollToWorkbench}
              className="text-[#9A9AA2] hover:text-white transition-colors cursor-pointer text-xs font-mono"
            >
              Join the waitlist
            </button>
            <button
              onClick={onScrollToFAQ}
              className="text-[#9A9AA2] hover:text-white transition-colors cursor-pointer text-xs font-mono"
            >
              FAQ
            </button>
            <a
              href="mailto:contact@gemma-engine.dev"
              className="text-[#9A9AA2] hover:text-white transition-colors cursor-pointer text-xs font-mono"
            >
              Contact
            </a>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="py-8 flex items-center justify-between text-xs font-mono text-[#9A9AA2]">
          <div>© 2026 GemmaOps Engine</div>
          <button className="hover:text-white transition-colors cursor-pointer">
            Cookie settings
          </button>
        </div>
      </div>

      {/* Signature Close: Giant Wordmark Cropped by the Bottom Edge */}
      <div className="relative w-full overflow-hidden flex justify-center items-end select-none pointer-events-none mt-8 -mb-10 sm:-mb-14">
        {/* Purple Radial Glow rising from the bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[350px] bg-[#6C4CF1]/25 blur-[140px] rounded-full pointer-events-none" />

        {/* Giant All-Caps Name ~20vw */}
        <div
          className="text-[19vw] font-black tracking-[-0.05em] uppercase leading-none bg-gradient-to-b from-[#C9B8FF] via-[#A892F8]/70 to-transparent bg-clip-text text-transparent transform translate-y-[38%] text-center opacity-90 drop-shadow-sm"
        >
          GEMMAOPS
        </div>
      </div>
    </footer>
  );
};
