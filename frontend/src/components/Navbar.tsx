import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Activity, 
  ShieldCheck, 
  Bell, 
  Menu, 
  X, 
  Wrench, 
  Layers, 
  FileText, 
  Network, 
  User, 
  ChevronRight,
  HardDriveDownload,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { ApiService } from "../services/api";

export const Navbar: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [statusMessage, setStatusMessage] = useState("FastAPI Edge Engine");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = async () => {
      const res = await ApiService.checkHealth();
      setIsOnline(res.online);
      setStatusMessage(res.message);
    };
    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, []);

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Overview", path: "/", icon: <Activity className="w-3.5 h-3.5" /> },
    { name: "Diagnostics", path: "/diagnose", icon: <Wrench className="w-3.5 h-3.5" /> },
    { name: "Knowledge Base", path: "/ingest", icon: <FileText className="w-3.5 h-3.5" /> },
    { name: "Knowledge Graph", path: "/graph", icon: <Network className="w-3.5 h-3.5" /> },
    { name: "Safety & LOTO", path: "/safety", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  ];

  const recentNotifications = [
    {
      id: "notif-1",
      title: "Local Graph Sync Verified",
      time: "2m ago",
      type: "success",
      desc: "5 OKF bundles validated into local RAM. Deterministic relative links active.",
    },
    {
      id: "notif-2",
      title: "OSHA 1910.147 Guardrail Armed",
      time: "14m ago",
      type: "info",
      desc: "Zero-energy mechanical lockout required for all hydraulic/electrical nodes.",
    },
    {
      id: "notif-3",
      title: "Offline INT4 Model Cache",
      time: "1h ago",
      type: "info",
      desc: "Gemma 4 Multimodal quantized weights verified for disconnected field use.",
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#060B18]/90 backdrop-blur-xl border-b border-[#1D3150]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Branding & Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#1769C2] to-[#0A3D78] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[#1769C2]/30 border border-[#3995F6]/40 transition-transform group-hover:scale-105">
            <Activity className="w-4 h-4 text-[#F5F7FC]" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#3995F6] ring-2 ring-[#060B18]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[#F5F7FC] font-extrabold tracking-tight text-base group-hover:text-white transition-colors">
                FIELD<span className="text-[#3995F6]">ENGINE</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#101D35] text-[#3995F6] border border-[#1D3150]">
                DIAGNOSTIC
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#6F809A] -mt-0.5 hidden sm:block">
              Industrial Hardware Intelligence
            </span>
          </div>
        </Link>

        {/* Center: Desktop Minimal Horizontal Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[#091329]/90 p-1 rounded-full border border-[#1D3150]/90 shadow-inner">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#1769C2]/25 text-[#3995F6] border border-[#3995F6]/45 font-semibold shadow-sm shadow-[#1769C2]/20"
                    : "text-[#9AAAC3] hover:text-[#F5F7FC] hover:bg-[#101D35]/50 border border-transparent"
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Operational Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status Badge */}
          <div 
            className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#0B1427] border border-[#1D3150] text-[11px] font-mono"
            title={statusMessage}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-[#10B981]" : "bg-[#F59E0B]"} animate-pulse`} />
            <span className="hidden sm:inline font-semibold text-[#F5F7FC]">
              {isOnline ? "EDGE ONLINE" : "OFFLINE READY"}
            </span>
            <span className="sm:hidden font-semibold text-[#F5F7FC]">
              {isOnline ? "LIVE" : "OFFLINE"}
            </span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className={`p-2 rounded-lg border transition-all cursor-pointer relative ${
                notificationsOpen
                  ? "bg-[#101D35] border-[#3995F6] text-[#3995F6]"
                  : "bg-[#0B1427] border-[#1D3150] text-[#9AAAC3] hover:text-[#F5F7FC] hover:border-[#3995F6]/50"
              }`}
              title="System Audit & Offline Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#3995F6]" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0B1427] border border-[#1D3150] rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-[#1D3150]">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#3995F6]" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5F7FC]">
                      System Audit Log
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#101D35] text-[#3995F6] border border-[#1D3150]">
                    3 Active
                  </span>
                </div>

                <div className="divide-y divide-[#1D3150]/60 mt-2 max-h-64 overflow-y-auto">
                  {recentNotifications.map((notif) => (
                    <div key={notif.id} className="py-2.5 first:pt-1 last:pb-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#F5F7FC]">
                        <span className="flex items-center gap-1.5">
                          {notif.type === "success" ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                          ) : (
                            <HardDriveDownload className="w-3.5 h-3.5 text-[#3995F6] shrink-0" />
                          )}
                          {notif.title}
                        </span>
                        <span className="text-[10px] font-mono text-[#6F809A]">{notif.time}</span>
                      </div>
                      <p className="text-[11px] text-[#9AAAC3] mt-1 leading-relaxed">
                        {notif.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#1D3150] flex items-center justify-between text-[11px] font-mono text-[#6F809A]">
                  <span>Zero-Hallucination Guardrail: Active</span>
                  <Link 
                    to="/safety" 
                    onClick={() => setNotificationsOpen(false)}
                    className="text-[#3995F6] hover:underline"
                  >
                    OSHA LOTO
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill (Alex Carter) */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0B1427] border border-[#1D3150] text-xs">
            <div className="w-6 h-6 rounded-md bg-[#101D35] border border-[#1D3150] flex items-center justify-center text-[#3995F6] font-mono text-xs font-bold">
              AC
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[#F5F7FC] font-medium leading-tight text-[11px]">A. Carter</span>
              <span className="text-[9px] font-mono text-[#6F809A] leading-tight">TECH-402</span>
            </div>
          </div>

          {/* Primary CTA Button */}
          <Link
            to="/diagnose"
            className="btn-primary-blue flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-semibold tracking-tight shrink-0"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Start Diagnosis</span>
            <span className="sm:hidden">Diagnose</span>
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-[#0B1427] border border-[#1D3150] text-[#9AAAC3] hover:text-[#F5F7FC]"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#1D3150] bg-[#060B18]/98 backdrop-blur-2xl px-6 py-4 animate-in fade-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#1769C2]/20 text-[#3995F6] border border-[#3995F6]/40"
                      : "text-[#9AAAC3] hover:text-[#F5F7FC] hover:bg-[#0B1427]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {link.icon}
                    <span>{link.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#6F809A]" />
                </Link>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-[#1D3150] flex items-center justify-between text-xs font-mono text-[#9AAAC3]">
            <span>Field Operator: Alex Carter (TK-402)</span>
            <span className="px-2 py-0.5 rounded bg-[#0B1427] text-[#10B981] border border-[#1D3150]">
              {isOnline ? "ONLINE" : "STANDBY"}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
