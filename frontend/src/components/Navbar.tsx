import React, { useState, useEffect } from "react";
import { ApiService } from "../services/api";

interface NavbarProps {
  onScrollToWorkbench: () => void;
  onScrollToDocs: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onScrollToWorkbench, onScrollToDocs }) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    const check = async () => {
      const res = await ApiService.checkHealth();
      setIsOnline(res.online);
    };
    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0C]/90 backdrop-blur-md hairline-b">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo and Wordmark */}
        <div className="flex items-center gap-2.5">
          <img
            src="/brand/mascot-icon.webp"
            alt="GemmaOps"
            className="w-7 h-7 rounded-lg object-cover shadow-sm shadow-[#6C4CF1]/40"
          />
          <span className="text-white font-bold tracking-tight text-base">GemmaOps</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#111114] text-[#9A9AA2] border border-white/[0.08] ml-2">
            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-[#34D399]" : "bg-amber-400"} animate-pulse`} />
            {isOnline ? "FASTAPI LOCAL ONLINE" : "OFFLINE EDGE READY"}
          </span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-6 text-sm">
          <button
            onClick={onScrollToWorkbench}
            className="text-[#9A9AA2] hover:text-white transition-colors cursor-pointer text-xs font-mono"
          >
            Try Model
          </button>
          <button
            onClick={onScrollToDocs}
            className="text-[#9A9AA2] hover:text-white transition-colors cursor-pointer text-xs font-mono"
          >
            Sample Manuals
          </button>
          <a
            href="mailto:contact@gemma-engine.dev"
            className="text-[#9A9AA2] hover:text-white transition-colors cursor-pointer text-xs font-mono"
          >
            Contact
          </a>
        </div>
      </div>
    </header>
  );
};
