import React, { useState, useEffect } from "react";
import { Cpu, ShieldCheck, Wifi, WifiOff, FileText, Activity, BookOpen, Layers } from "lucide-react";
import { ApiService } from "../services/api";

interface NavbarProps {
  activeTab: "workbench" | "knowledge";
  setActiveTab: (tab: "workbench" | "knowledge") => void;
  onScrollToWorkbench: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onScrollToWorkbench }) => {
  const [backendStatus, setBackendStatus] = useState<{ online: boolean; message: string }>({
    online: false,
    message: "Checking...",
  });

  useEffect(() => {
    const check = async () => {
      const res = await ApiService.checkHealth();
      setBackendStatus(res);
    };
    check();
    const timer = setInterval(check, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg shadow-amber-500/20 text-slate-950 font-bold">
            <Cpu className="w-6 h-6 text-slate-950" />
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-lg text-white">GEMMA<span className="text-amber-400">OPS</span></span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/20">
                100% OFFLINE EDGE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">Field Engineering & Hardware Diagnostic Engine</p>
          </div>
        </div>

        {/* Navigation Anchors */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-300">
          <a href="#overview" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors">
            Overview
          </a>
          <a href="#how-it-works" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors">
            How Image + OKF Works
          </a>
          <a href="#architecture" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors">
            Architecture
          </a>
          <button
            onClick={onScrollToWorkbench}
            className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all cursor-pointer font-semibold"
          >
            <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
            Try Diagnostic Engine
          </button>
        </nav>

        {/* Status Badge */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium border ${
              backendStatus.online
                ? "bg-emerald-950/40 text-emerald-300 border-emerald-500/30"
                : "bg-slate-900 text-slate-400 border-slate-700"
            }`}
          >
            {backendStatus.online ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span className="hidden sm:inline">{backendStatus.message}</span>
            <span className="sm:hidden">{backendStatus.online ? "Online" : "Edge"}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
