import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Share2,
  Settings as SettingsIcon,
  Plus,
  ChevronDown,
  Layers,
  Wrench,
  ShieldAlert,
  UploadCloud,
  Sparkles,
  Check
} from "lucide-react";

interface TopToolbarProps {
  title?: string;
  sourceCount?: number;
  onNewChat?: () => void;
  activeModule?: "workspace" | "diagnostics" | "graph" | "safety" | "ingest";
}

export const TopToolbar: React.FC<TopToolbarProps> = ({
  title = "MECH-G Master Documentation",
  onNewChat,
  activeModule: propActiveModule,
}) => {
  const location = useLocation();
  const [showNavMenu, setShowNavMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Automatically detect active module if not explicitly provided
  const activeModule =
    propActiveModule ||
    (location.pathname.startsWith("/diagnostic")
      ? "diagnostics"
      : location.pathname.startsWith("/graph")
      ? "graph"
      : location.pathname.startsWith("/safety")
      ? "safety"
      : location.pathname.startsWith("/ingest")
      ? "ingest"
      : "workspace");

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <header className="h-[52px] bg-[#0B0B0C] px-4 flex items-center justify-between z-20 select-none border-b border-[#18181A]">
      {/* Left: Brand Icon & Master Documentation Title */}
      <div className="flex items-center gap-3">
        <Link to="/workspace" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#3B82F6] via-[#22D3EE] to-[#8B5CF6] p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <div className="w-full h-full bg-[#0B0B0C] rounded-full flex items-center justify-center group-hover:bg-[#141720] transition-colors">
              <span className="text-[11px] font-black tracking-tighter text-[#22D3EE]">M</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-[14px] font-semibold text-white tracking-tight hover:text-[#22D3EE] transition-colors">
              {title}
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/20 text-[10px] font-mono font-medium">
              MECH-G
            </span>
          </div>
        </Link>
      </div>

      {/* Center: Module Navigation Pills */}
      <nav className="hidden md:flex items-center gap-1 bg-[#141518] p-1 rounded-full border border-[#27272A]/80 shadow-inner">
        <Link
          to="/workspace"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            activeModule === "workspace"
              ? "bg-[#24252B] text-white shadow-sm border border-[#3A3B43]"
              : "text-[#9CA3AF] hover:text-white hover:bg-[#1E1F24]"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
          <span>Workspace</span>
        </Link>
        <Link
          to="/diagnostics"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            activeModule === "diagnostics"
              ? "bg-[#24252B] text-white shadow-sm border border-[#3A3B43]"
              : "text-[#9CA3AF] hover:text-white hover:bg-[#1E1F24]"
          }`}
        >
          <Wrench className="w-3.5 h-3.5 text-[#FBBF24]" />
          <span>Diagnostics</span>
        </Link>
        <Link
          to="/graph"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            activeModule === "graph"
              ? "bg-[#24252B] text-white shadow-sm border border-[#3A3B43]"
              : "text-[#9CA3AF] hover:text-white hover:bg-[#1E1F24]"
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span>Graph</span>
        </Link>
        <Link
          to="/safety"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            activeModule === "safety"
              ? "bg-[#24252B] text-white shadow-sm border border-[#3A3B43]"
              : "text-[#9CA3AF] hover:text-white hover:bg-[#1E1F24]"
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-[#FB7185]" />
          <span>Safety</span>
        </Link>
        <Link
          to="/ingest"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            activeModule === "ingest"
              ? "bg-[#24252B] text-white shadow-sm border border-[#3A3B43]"
              : "text-[#9CA3AF] hover:text-white hover:bg-[#1E1F24]"
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5 text-[#34D399]" />
          <span>Ingest</span>
        </Link>
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Switch Views Dropdown for Mobile / Compact Screens */}
        <div className="relative md:hidden">
          <button
            onClick={() => setShowNavMenu(!showNavMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-[#9CA3AF] hover:text-white hover:bg-[#1E1F24] transition-colors border border-[#27272A]"
          >
            <span>Modules</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {showNavMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-[#18181A] border border-[#27272A] rounded-2xl p-1.5 shadow-2xl z-50 animate-in fade-in">
              <Link
                to="/workspace"
                onClick={() => setShowNavMenu(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors ${
                  activeModule === "workspace" ? "bg-[#24252B] text-white" : "text-[#9CA3AF] hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
                <span>Knowledge Workspace</span>
              </Link>
              <Link
                to="/diagnostics"
                onClick={() => setShowNavMenu(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors ${
                  activeModule === "diagnostics" ? "bg-[#24252B] text-white" : "text-[#9CA3AF] hover:text-white"
                }`}
              >
                <Wrench className="w-3.5 h-3.5 text-[#FBBF24]" />
                <span>Field Diagnostics</span>
              </Link>
              <Link
                to="/graph"
                onClick={() => setShowNavMenu(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors ${
                  activeModule === "graph" ? "bg-[#24252B] text-white" : "text-[#9CA3AF] hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>Graph Explorer</span>
              </Link>
              <Link
                to="/safety"
                onClick={() => setShowNavMenu(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors ${
                  activeModule === "safety" ? "bg-[#24252B] text-white" : "text-[#9CA3AF] hover:text-white"
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#FB7185]" />
                <span>Safety Compliance</span>
              </Link>
              <Link
                to="/ingest"
                onClick={() => setShowNavMenu(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors ${
                  activeModule === "ingest" ? "bg-[#24252B] text-white" : "text-[#9CA3AF] hover:text-white"
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5 text-[#34D399]" />
                <span>Ingest Manuals</span>
              </Link>
            </div>
          )}
        </div>

        {/* + New Session */}
        <button
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-normal text-[#E5E7EB] hover:text-white hover:bg-[#1E1F24] border border-[#27272A] transition-colors shadow-sm"
          title="Start fresh conversation"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Session</span>
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-normal text-[#E5E7EB] hover:text-white hover:bg-[#1E1F24] border border-[#27272A] transition-colors"
          title="Copy link to clipboard"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{copiedLink ? "Copied" : "Share"}</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-full text-[#9CA3AF] hover:text-white hover:bg-[#1E1F24] transition-colors border border-transparent hover:border-[#27272A]"
          title="MECH-G System Settings"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>

        {/* MECH-G Avatar */}
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-xs font-bold text-white shadow-sm ml-1">
          M
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#18181A] border border-[#27272A] rounded-[24px] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#22D3EE]" />
                MECH-G Workspace Configuration
              </h3>
              <span className="text-[10px] font-mono text-[#9CA3AF] bg-[#232326] px-2 py-0.5 rounded">
                v2.4
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#9CA3AF] mb-1 font-medium">Active Multimodal Model</label>
                <div className="text-white font-mono bg-[#1E1F23] border border-[#2E3036] rounded-xl px-3 py-2">
                  gemma-4-26b-a4b-it (Official Google Gemma 4 Multimodal)
                </div>
              </div>
              <div>
                <label className="block text-[#9CA3AF] mb-1 font-medium">Knowledge Graph Engine</label>
                <div className="text-white font-mono bg-[#1E1F23] border border-[#2E3036] rounded-xl px-3 py-2">
                  NetworkX Directed Graph + SQLite Provenance
                </div>
              </div>
              <div>
                <label className="block text-[#9CA3AF] mb-1 font-medium">Safety Interlock Standards</label>
                <div className="text-white font-mono bg-[#1E1F23] border border-[#2E3036] rounded-xl px-3 py-2">
                  OSHA 1910.147 LOTO + Zero-Energy Verification Gate
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-1.5 rounded-full bg-[#232326] hover:bg-[#2A2A2F] text-white text-xs font-medium border border-[#2E2E33] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
