import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Wrench,
  Library,
  GitBranch,
  Search,
  History,
  ShieldCheck,
  FileCheck2,
  Settings,
  HelpCircle,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  HardDrive,
  Cpu,
  User,
  Zap,
  Activity,
  Layers,
  CircleDot
} from "lucide-react";
import { useMecG } from "../../context/MecGContext";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    currentWorkspace,
    setCurrentWorkspace,
    isOnline,
    modelStatus,
    storageUsage,
    currentUser,
    userRole,
    setIsCreateNotebookOpen,
    totalNotebooksCount,
    totalDocsCount
  } = useMecG();

  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);

  const workspaces = [
    "Turbine Plant Skid A (Vestas & Siemens)",
    "Subterranean Hydro Skids (Sulzer MSD)",
    "Commercial Aviation Bay 4 (APU Systems)",
    "Mining Heavy Excavator Skids"
  ];

  const navGroups = [
    {
      group: "WORKSPACE",
      items: [
        { label: "Overview", path: "/", icon: <LayoutDashboard className="w-4 h-4" /> },
        { 
          label: "My Notebooks", 
          path: "/notebooks", 
          icon: <BookOpen className="w-4 h-4" />,
          badge: totalNotebooksCount
        },
        { label: "Diagnose Equipment", path: "/diagnose", icon: <Wrench className="w-4 h-4" /> }
      ]
    },
    {
      group: "KNOWLEDGE",
      items: [
        { 
          label: "Knowledge Library", 
          path: "/library", 
          icon: <Library className="w-4 h-4" />,
          badge: totalDocsCount
        },
        { label: "Knowledge Graph", path: "/graph", icon: <GitBranch className="w-4 h-4" /> },
        { label: "Search Documents", path: "/search", icon: <Search className="w-4 h-4" /> }
      ]
    },
    {
      group: "OPERATIONS",
      items: [
        { label: "Diagnostic History", path: "/history", icon: <History className="w-4 h-4" /> },
        { label: "Safety & Compliance", path: "/safety", icon: <ShieldCheck className="w-4 h-4" /> },
        { label: "Audit Trail", path: "/audit", icon: <FileCheck2 className="w-4 h-4" /> }
      ]
    },
    {
      group: "SYSTEM",
      items: [
        { label: "Settings", path: "/settings", icon: <Settings className="w-4 h-4" /> },
        { label: "Help & Support", path: "/help", icon: <HelpCircle className="w-4 h-4" /> }
      ]
    }
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 bg-[#171A21] border-r border-[#252B35] flex flex-col justify-between transition-all duration-300 select-none ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Top Brand & Workspace Header */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#252B35]">
          {!collapsed ? (
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#F2B544] flex items-center justify-center text-[#101318] font-black text-sm shadow-md shadow-[#F2B544]/25">
                <Zap className="w-4 h-4 fill-current text-[#101318]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold tracking-tight text-white text-base leading-none">
                  MEC<span className="text-[#F2B544]">-G</span>
                </span>
                <span className="text-[9px] font-mono uppercase tracking-wider text-[#929AA6] mt-0.5">
                  Mechanic Genius
                </span>
              </div>
            </Link>
          ) : (
            <Link to="/" className="w-8 h-8 rounded-lg bg-[#F2B544] flex items-center justify-center text-[#101318] font-black text-sm mx-auto shadow-md shadow-[#F2B544]/25">
              <Zap className="w-4 h-4 fill-current text-[#101318]" />
            </Link>
          )}

          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md text-[#929AA6] hover:text-white hover:bg-[#252B35] transition-colors cursor-pointer"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Workspace Selector Dropdown (when not collapsed) */}
        {!collapsed && (
          <div className="p-3 border-b border-[#252B35]">
            <div className="relative">
              <button
                onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
                className="w-full p-2.5 rounded-lg bg-[#101318] border border-[#252B35] hover:border-[#353E4C] text-left flex items-center justify-between gap-2 transition-colors cursor-pointer"
              >
                <div className="min-w-0 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#F2B544] shrink-0" />
                  <span className="text-xs font-semibold text-white truncate block">
                    {currentWorkspace}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#929AA6] shrink-0" />
              </button>

              {workspaceMenuOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#101318] border border-[#252B35] rounded-lg shadow-2xl p-1 z-50">
                  <div className="text-[10px] font-mono text-[#929AA6] px-2.5 py-1.5 uppercase font-bold">
                    Select Industrial Facility
                  </div>
                  {workspaces.map((ws) => (
                    <button
                      key={ws}
                      onClick={() => {
                        setCurrentWorkspace(ws);
                        setWorkspaceMenuOpen(false);
                      }}
                      className={`w-full px-2.5 py-2 rounded-md text-left text-xs transition-colors cursor-pointer flex items-center gap-2 ${
                        currentWorkspace === ws
                          ? "bg-[#F2B544]/15 text-[#F2B544] font-semibold"
                          : "text-[#929AA6] hover:text-white hover:bg-[#252B35]"
                      }`}
                    >
                      <CircleDot className="w-3 h-3 shrink-0" />
                      <span className="truncate">{ws}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* + New Notebook Button */}
            <button
              onClick={() => setIsCreateNotebookOpen(true)}
              className="w-full mt-2 btn-amber-primary flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold tracking-tight cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+ New Notebook</span>
            </button>
          </div>
        )}

        {/* Collapsed quick create notebook button */}
        {collapsed && (
          <div className="p-2 border-b border-[#252B35] flex justify-center">
            <button
              onClick={() => setIsCreateNotebookOpen(true)}
              className="w-10 h-10 rounded-lg bg-[#F2B544] text-[#101318] flex items-center justify-center shadow-sm cursor-pointer hover:bg-[#E5A835] transition-colors"
              title="Create New Notebook"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        )}

        {/* Navigation List */}
        <div className="p-2 space-y-4 max-h-[calc(100vh-270px)] overflow-y-auto">
          {navGroups.map((grp) => (
            <div key={grp.group} className="space-y-1">
              {!collapsed && (
                <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-[#929AA6]/70 font-bold">
                  {grp.group}
                </div>
              )}

              {grp.items.map((item) => {
                const isActive =
                  item.path === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? "bg-[#F2B544]/15 text-[#F2B544] font-semibold border-l-2 border-[#F2B544]"
                        : "text-[#929AA6] hover:text-white hover:bg-[#252B35]"
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className={isActive ? "text-[#F2B544]" : "text-[#929AA6]"}>
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}
                    {!collapsed && item.badge !== undefined && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#252B35] text-[#929AA6]">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Status & Profile Bar */}
      <div className="p-3 border-t border-[#252B35] bg-[#101318]/60 space-y-2.5">
        {!collapsed ? (
          <>
            {/* Status pills */}
            <div className="space-y-1.5 text-[10px] font-mono">
              <div className="flex items-center justify-between text-[#929AA6]">
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-[#279C70]" : "bg-[#D99A29]"} animate-pulse`} />
                  <span>{isOnline ? "EDGE ONLINE" : "OFFLINE READY"}</span>
                </span>
                <span className="text-white font-semibold">100% Local</span>
              </div>
              <div className="flex items-center justify-between text-[#929AA6]">
                <span className="truncate">Gemma INT4</span>
                <span className="text-[#279C70] font-semibold">Loaded</span>
              </div>
              <div className="flex items-center justify-between text-[#929AA6]">
                <span>Storage</span>
                <span className="truncate">{storageUsage}</span>
              </div>
            </div>

            {/* User Profile Pill */}
            <div className="pt-2 border-t border-[#252B35] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-[#252B35] border border-[#353E4C] flex items-center justify-center text-[#F2B544] font-mono text-xs font-bold">
                  AC
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white leading-tight">{currentUser}</span>
                  <span className="text-[10px] font-mono text-[#F2B544] leading-tight">{userRole}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            <span
              className={`w-2.5 h-2.5 rounded-full ${isOnline ? "bg-[#279C70]" : "bg-[#D99A29]"}`}
              title={isOnline ? "Edge Online" : "Offline Ready"}
            />
            <div className="w-7 h-7 rounded-md bg-[#252B35] flex items-center justify-center text-[#F2B544] text-[10px] font-bold">
              AC
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

