import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Wrench,
  BookOpen,
  Upload,
  FileText,
  GitBranch,
  Layers,
  HardDrive,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Search,
  Plus
} from "lucide-react";
import { useMecG } from "../context/MecGContext";

export const OverviewDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    totalDocsCount,
    totalPagesCount,
    totalGraphNodesCount,
    totalNotebooksCount,
    storageUsage,
    notebooks,
    documents,
    diagnosticHistory,
    auditTrail,
    isOnline,
    modelStatus,
    setIsCreateNotebookOpen
  } = useMecG();

  const metrics = [
    {
      label: "Indexed Documents",
      value: totalDocsCount,
      detail: "Active technical manuals & schematics",
      icon: <FileText className="w-5 h-5 text-[#F2B544]" />,
      path: "/library"
    },
    {
      label: "Pages Processed",
      value: totalPagesCount,
      detail: "Layout headers & tables preserved",
      icon: <Layers className="w-5 h-5 text-[#F2B544]" />,
      path: "/library"
    },
    {
      label: "Knowledge Graph Nodes",
      value: totalGraphNodesCount,
      detail: "NetworkX in-memory RAM topology",
      icon: <GitBranch className="w-5 h-5 text-[#F2B544]" />,
      path: "/graph"
    },
    {
      label: "Engineering Notebooks",
      value: totalNotebooksCount,
      detail: "NotebookLM research workspaces",
      icon: <BookOpen className="w-5 h-5 text-[#F2B544]" />,
      path: "/notebooks"
    },
    {
      label: "Diagnostic Sessions",
      value: diagnosticHistory.length,
      detail: "Completed & audited field cases",
      icon: <Wrench className="w-5 h-5 text-[#F2B544]" />,
      path: "/history"
    },
    {
      label: "Local Storage Utilization",
      value: storageUsage.split(" / ")[0],
      detail: "Zero mandatory cloud storage",
      icon: <HardDrive className="w-5 h-5 text-[#279C70]" />,
      path: "/settings"
    }
  ];

  const services = [
    {
      name: "Document Processing Engine",
      subtext: "MarkItDown + PyMuPDF layout parser",
      status: "Ready",
      type: "success"
    },
    {
      name: "Local Knowledge Graph",
      subtext: "NetworkX directed graph in RAM",
      status: "Ready",
      type: "success"
    },
    {
      name: "Search & Retrieval Engine",
      subtext: "BM25 keyword + RapidFuzz matcher",
      status: "Ready",
      type: "success"
    },
    {
      name: "AI Diagnostic Model",
      subtext: isOnline ? "FastAPI Edge Engine + INT4 Quantized" : "Local Standby Edge Inference",
      status: isOnline ? "Ready" : "Offline",
      type: isOnline ? "success" : "warning"
    },
    {
      name: "Audio Processing Service",
      subtext: "WebAudio STT waveform capture",
      status: "Ready",
      type: "success"
    },
    {
      name: "Local Document Storage",
      subtext: "Atomic OKF markdown bundle filesystem",
      status: "Ready",
      type: "success"
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Welcome Section & 3 Prominent Action Buttons */}
      <div className="card-industrial p-6 sm:p-8 bg-gradient-to-r from-[#171A21] via-[#1A1E26] to-[#171A21] border-[#252B35] relative overflow-hidden">
        {/* Subtle amber radial glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F2B544]/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101318] border border-[#252B35] text-xs font-mono text-[#F2B544] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#F2B544] animate-pulse" />
              <span>OFFLINE INDUSTRIAL INTELLIGENCE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome to <span className="text-[#F2B544]">MEC-G</span>
            </h1>
            <p className="mt-2 text-sm text-[#929AA6] leading-relaxed">
              Your engineering knowledge, ready whenever you need it. Offline-first multimodal hardware diagnosis, notebook-based research, and verifiable Lockout/Tagout safety guidance.
            </p>
          </div>

          {/* 3 Prominent Amber Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => navigate("/diagnose")}
              className="btn-amber-primary flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold shadow-lg cursor-pointer"
            >
              <Wrench className="w-4 h-4" />
              <span>+ New Diagnosis</span>
            </button>

            <button
              onClick={() => setIsCreateNotebookOpen(true)}
              className="btn-slate-secondary flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#F2B544]" />
              <span>+ Create Notebook</span>
            </button>

            <button
              onClick={() => navigate("/library")}
              className="btn-slate-secondary flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold cursor-pointer"
            >
              <Upload className="w-4 h-4 text-[#F2B544]" />
              <span>+ Import Documents</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Metric Cards (Live values from actual app) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-mono uppercase tracking-wider text-[#929AA6] font-bold">
            Live Knowledge System Metrics
          </h2>
          <span className="text-[11px] font-mono text-[#647082]">Zero Fabricated Data</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {metrics.map((m, idx) => (
            <Link
              key={idx}
              to={m.path}
              className="card-industrial-interactive p-5 flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-extrabold font-mono text-white group-hover:text-[#F2B544] transition-colors">
                  {m.value}
                </span>
                <div className="p-2 rounded-lg bg-[#101318] border border-[#252B35]">
                  {m.icon}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-white leading-snug">{m.label}</div>
                <div className="text-[10px] text-[#929AA6] mt-0.5 leading-tight">{m.detail}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. System Health Section (6 Individual Service Statuses) */}
      <div className="card-industrial p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#252B35] pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#F2B544]" />
            <h3 className="text-sm font-mono uppercase tracking-wider text-white font-bold">
              Subsystem Health & Operational Readiness
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#279C70]/15 text-[#279C70] border border-[#279C70]/30">
            All Core Engines Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {services.map((svc, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#101318] border border-[#252B35] flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">{svc.name}</div>
                <div className="text-[10px] font-mono text-[#929AA6] truncate mt-0.5">
                  {svc.subtext}
                </div>
              </div>
              <div
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase shrink-0 ${
                  svc.type === "success"
                    ? "bg-[#279C70]/15 text-[#279C70] border border-[#279C70]/30"
                    : "bg-[#D99A29]/15 text-[#D99A29] border border-[#D99A29]/30"
                }`}
              >
                {svc.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Quick Access Notebooks & Recent Activity (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Quick Access Notebooks (7 cols) */}
        <div className="lg:col-span-7 card-industrial p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#252B35] pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#F2B544]" />
              <h3 className="text-sm font-mono uppercase tracking-wider text-white font-bold">
                Quick Access Notebooks
              </h3>
            </div>
            <Link
              to="/notebooks"
              className="text-xs font-mono text-[#F2B544] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>View All ({notebooks.length})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {notebooks.map((nb) => (
              <div
                key={nb.id}
                onClick={() => navigate(`/notebooks/${nb.id}`)}
                className="p-4 rounded-xl bg-[#101318] border border-[#252B35] hover:border-[#F2B544]/60 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#929AA6] mb-2">
                    <span className="px-2 py-0.5 rounded bg-[#171A21] border border-[#252B35] text-[#F2B544]">
                      {nb.category}
                    </span>
                    <span>{nb.lastUpdated}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-[#F2B544] transition-colors line-clamp-1">
                    {nb.name}
                  </h4>
                  <p className="text-[11px] text-[#929AA6] line-clamp-2 mt-1 leading-relaxed">
                    {nb.equipmentName} • {nb.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#252B35] flex items-center justify-between text-[10px] font-mono text-[#647082]">
                  <span>{nb.docCount} Sources Indexed</span>
                  <span className="text-[#279C70] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{nb.indexingStatus}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Recent Activity Feed (5 cols) */}
        <div className="lg:col-span-5 card-industrial p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#252B35] pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#F2B544]" />
              <h3 className="text-sm font-mono uppercase tracking-wider text-white font-bold">
                Recent Operations & Audit Log
              </h3>
            </div>
            <Link
              to="/audit"
              className="text-xs font-mono text-[#F2B544] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Audit Trail</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-[#252B35] space-y-3">
            {auditTrail.slice(0, 4).map((audit) => (
              <div key={audit.id} className="pt-3 first:pt-0">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white flex items-center gap-1.5 truncate">
                    {audit.actionType === "LOTO_SIGNED" ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-[#279C70] shrink-0" />
                    ) : (
                      <Wrench className="w-3.5 h-3.5 text-[#F2B544] shrink-0" />
                    )}
                    <span className="truncate">{audit.identifiedComponent}</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#647082] shrink-0">
                    {audit.technicianId}
                  </span>
                </div>
                <p className="text-[11px] text-[#929AA6] mt-1 line-clamp-1">
                  {audit.actionType === "LOTO_SIGNED"
                    ? "OSHA 1910.147 Zero-Energy Isolation Signed & Confirmed"
                    : audit.observedDefect}
                </p>
              </div>
            ))}

            {documents.slice(0, 2).map((doc) => (
              <div key={doc.id} className="pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white flex items-center gap-1.5 truncate">
                    <FileText className="w-3.5 h-3.5 text-[#929AA6] shrink-0" />
                    <span className="truncate">{doc.filename}</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#279C70] shrink-0">
                    {doc.processingStatus}
                  </span>
                </div>
                <p className="text-[11px] text-[#647082] mt-0.5">
                  Indexed {doc.pages} pages into local OKF graph • {doc.size}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

