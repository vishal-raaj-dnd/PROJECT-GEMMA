import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Cpu, ShieldCheck, ArrowRight } from "lucide-react";
import { ApiService } from "../services/api";

export const Navbar: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const check = async () => {
      const res = await ApiService.checkHealth();
      setIsOnline(res.online);
    };
    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { name: "Diagnostic Engine", path: "/diagnose" },
    { name: "Knowledge Graph", path: "/graph" },
    { name: "Manuals & Compiler", path: "/ingest" },
    { name: "Safety & OSHA", path: "/safety" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0B0B0E]/90 backdrop-blur-md hairline-b">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: Wordmark */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#E0531D] flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-[#FF6B35]/30">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold tracking-tight text-lg group-hover:text-[#F5F5F7]">
            Gemma<span className="text-[#FF6B35]">Ops</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono text-[#9CA3AF] bg-[#16171B] border border-[#2A2A2E] ml-2">
            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-[#10B981]" : "bg-amber-400"} animate-pulse`} />
            {isOnline ? "EDGE ONLINE" : "OFFLINE READY"}
          </span>
        </Link>

        {/* Center: 4-5 Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-colors text-xs font-mono tracking-wider uppercase ${
                location.pathname === link.path
                  ? "text-[#FF6B35] font-semibold"
                  : "text-[#9CA3AF] hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right: High-contrast CTA button */}
        <div className="flex items-center gap-4">
          <Link
            to="/diagnose"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FF6B35] hover:bg-[#F97316] text-white text-xs font-semibold tracking-tight transition-all shadow-sm shadow-[#FF6B35]/25"
          >
            <span>Launch Engine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
};
