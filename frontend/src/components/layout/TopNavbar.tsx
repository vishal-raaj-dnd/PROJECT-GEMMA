import React, { useState, useRef, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Search,
  Command,
  Bell,
  Sun,
  Moon,
  ChevronRight,
  ShieldCheck,
  Cpu,
  HardDriveDownload,
  CheckCircle2,
  AlertTriangle,
  User,
  Check,
  Zap,
  Activity
} from "lucide-react";
import { useMecG } from "../../context/MecGContext";

interface TopNavbarProps {
  sidebarCollapsed: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ sidebarCollapsed }) => {
  const location = useLocation();
  const {
    isOnline,
    modelStatus,
    theme,
    toggleTheme,
    currentUser,
    userRole,
    setUserRole,
    setIsSearchOpen
  } = useMecG();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setRoleMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Generate breadcrumb path
  const getBreadcrumbs = () => {
    const segments = location.pathname.split("/").filter(Boolean);
    if (segments.length === 0) return [{ label: "Overview", path: "/" }];

    const map: Record<string, string> = {
      notebooks: "My Notebooks",
      diagnose: "Diagnose Equipment",
      library: "Knowledge Library",
      graph: "Knowledge Graph",
      search: "Search Documents",
      history: "Diagnostic History",
      safety: "Safety & Compliance",
      audit: "Audit Trail",
      settings: "Settings",
      help: "Help & Support"
    };

    return [
      { label: "MEC-G", path: "/" },
      ...segments.map((seg, idx) => ({
        label: map[seg] || seg,
        path: "/" + segments.slice(0, idx + 1).join("/")
      }))
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  const roles = ["Technician", "Operations Engineer", "Safety Engineer", "Administrator"] as const;

  const notifications = [
    {
      id: "n1",
      title: "Local Knowledge Graph Synced",
      desc: "7 concept nodes in RAM. NetworkX directed edges active.",
      time: "4m ago",
      type: "success"
    },
    {
      id: "n2",
      title: "OSHA 1910.147 Gate Armed",
      desc: "Hydraulic zero-energy signoff enforced for PRV series valves.",
      time: "18m ago",
      type: "warning"
    },
    {
      id: "n3",
      title: "Offline Speech Engine Ready",
      desc: "WebAudio STT buffer active for hands-free technician notes.",
      time: "1h ago",
      type: "info"
    }
  ];

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 bg-[#171A21]/95 border-b border-[#252B35] backdrop-blur-md flex items-center justify-between px-6 transition-all duration-300 ${
        sidebarCollapsed ? "left-16" : "left-64"
      }`}
    >
      {/* Left: Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs font-mono text-[#929AA6]">
        {breadcrumbs.map((bc, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <React.Fragment key={bc.path}>
              {idx > 0 && <ChevronRight className="w-3 h-3 text-[#647082]" />}
              {isLast ? (
                <span className="text-white font-bold">{bc.label}</span>
              ) : (
                <Link to={bc.path} className="hover:text-[#F2B544] transition-colors">
                  {bc.label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Center: Global Search Bar (Trigger) */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-[#101318] border border-[#252B35] hover:border-[#F2B544]/60 text-xs text-[#929AA6] transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-3.5 h-3.5 text-[#929AA6] group-hover:text-[#F2B544] transition-colors" />
            <span className="font-mono">Search manuals, components, fault codes...</span>
          </div>
          <kbd className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-[#647082] bg-[#171A21] border border-[#252B35] rounded-md shadow-xs">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </kbd>
        </button>
      </div>

      {/* Right: Operational Status, Roles & Notifications */}
      <div className="flex items-center gap-3">
        {/* Mobile Search Icon */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="md:hidden p-2 rounded-lg bg-[#101318] border border-[#252B35] text-[#929AA6] hover:text-white"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Offline / Online Status Pill */}
        <div
          className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#101318] border border-[#252B35] text-[11px] font-mono"
          title={isOnline ? "Backend Connected (FastAPI Edge Engine)" : "Offline Standby Mode"}
        >
          <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-[#279C70]" : "bg-[#D99A29]"} animate-pulse`} />
          <span className="font-semibold text-white">
            {isOnline ? "EDGE ONLINE" : "OFFLINE READY"}
          </span>
        </div>

        {/* AI Model Status Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#101318] border border-[#252B35] text-[11px] font-mono text-[#929AA6]">
          <Cpu className="w-3.5 h-3.5 text-[#F2B544]" />
          <span>Gemma INT4</span>
        </div>

        {/* Theme Toggle (Dark / Light) */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-[#101318] border border-[#252B35] text-[#929AA6] hover:text-[#F2B544] hover:border-[#F2B544]/50 transition-colors cursor-pointer"
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className={`p-2 rounded-lg border transition-all cursor-pointer relative ${
              notificationsOpen
                ? "bg-[#252B35] border-[#F2B544] text-[#F2B544]"
                : "bg-[#101318] border-[#252B35] text-[#929AA6] hover:text-white hover:border-[#F2B544]/50"
            }`}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#F2B544]" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#171A21] border border-[#252B35] rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#252B35]">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#F2B544]" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    Operational System Log
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#101318] text-[#F2B544] border border-[#252B35]">
                  3 Active
                </span>
              </div>

              <div className="divide-y divide-[#252B35] mt-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 first:pt-1 last:pb-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-white">
                      <span className="flex items-center gap-1.5">
                        {n.type === "success" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#279C70] shrink-0" />
                        ) : n.type === "warning" ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-[#D99A29] shrink-0" />
                        ) : (
                          <HardDriveDownload className="w-3.5 h-3.5 text-[#F2B544] shrink-0" />
                        )}
                        {n.title}
                      </span>
                      <span className="text-[10px] font-mono text-[#647082]">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[#929AA6] mt-1 leading-relaxed">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Role Switcher Pill */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-[#101318] border border-[#252B35] hover:border-[#F2B544]/60 transition-colors cursor-pointer"
            title="Switch User Role"
          >
            <div className="w-6 h-6 rounded bg-[#252B35] flex items-center justify-center text-[#F2B544] font-mono text-xs font-bold">
              AC
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-none">{currentUser}</span>
              <span className="text-[9px] font-mono text-[#F2B544] leading-tight">{userRole}</span>
            </div>
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#171A21] border border-[#252B35] rounded-xl shadow-2xl p-2 z-50">
              <div className="px-2 py-1 text-[10px] font-mono uppercase text-[#647082] font-bold">
                Switch Operational Role
              </div>
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setUserRole(r);
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    userRole === r
                      ? "bg-[#F2B544]/15 text-[#F2B544] font-semibold"
                      : "text-[#929AA6] hover:text-white hover:bg-[#252B35]"
                  }`}
                >
                  <span>{r}</span>
                  {userRole === r && <Check className="w-3.5 h-3.5 text-[#F2B544]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

