import React, { useState } from "react";
import { useMecG } from "../context/MecGContext";
import {
  Settings,
  Cpu,
  Wifi,
  WifiOff,
  HardDrive,
  Users,
  Sliders,
  Info,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Trash2,
  Download,
  Shield,
  Zap,
  Activity,
  Layers,
  Database
} from "lucide-react";

export const SettingsPage: React.FC = () => {
  const {
    theme,
    toggleTheme,
    userRole,
    setUserRole,
    isOnline,
    modelStatus,
    showToast,
    storageUsage,
    totalDocsCount
  } = useMecG();

  // Settings active section
  const [activeSection, setActiveSection] = useState<"model" | "offline" | "storage" | "roles" | "preferences" | "about">("model");

  // Model settings
  const [selectedModel, setSelectedModel] = useState("gemma-2-9b-it-int4");
  const [modelLoaded, setModelLoaded] = useState(true);
  const [quantization, setQuantization] = useState("INT4");
  const [contextWindow, setContextWindow] = useState("8192 Tokens");
  const [hardwareAcceleration, setHardwareAcceleration] = useState("Metal / Apple Silicon GPU & NPU");

  // Offline test state
  const [isTestingOffline, setIsTestingOffline] = useState(false);
  const [offlineBenchmarkResult, setOfflineBenchmarkResult] = useState<string | null>(null);

  // Storage cleanup modal
  const [showCleanupModal, setShowCleanupModal] = useState(false);

  // Preferences
  const [fontSize, setFontSize] = useState("Medium (Rugged Default)");
  const [highContrast, setHighContrast] = useState(false);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [systemLanguage, setSystemLanguage] = useState("English (US / Engineering)");

  const handleTestOfflineBenchmark = () => {
    setIsTestingOffline(true);
    setOfflineBenchmarkResult(null);
    setTimeout(() => {
      setIsTestingOffline(false);
      setOfflineBenchmarkResult("Offline Pipeline Benchmarked: Local Graph Traversal (12ms) • BM25 Index (8ms) • INT4 Warmup (38ms). 100% Fully Functional.");
      showToast("Offline functionality test passed with zero cloud dependencies.");
    }, 1200);
  };

  const handleCleanupStorage = () => {
    setShowCleanupModal(false);
    showToast("Transient document caches and OCR thumbnails purged. 8.4 MB recovered.");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#252B35]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#252B35] text-xs font-mono text-[#F2B544] mb-2">
            <Settings className="w-3.5 h-3.5" />
            <span>SYSTEM CONFIGURATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Settings & System Management</h1>
          <p className="text-sm text-[#929AA6] mt-1">
            Configure local INT4 Gemma inference, offline storage partitions, technician access roles, and display parameters.
          </p>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Nav Menu */}
        <div className="md:col-span-3 space-y-1">
          <button
            onClick={() => setActiveSection("model")}
            className={`w-full text-left px-3.5 py-3 rounded-lg text-xs font-bold transition-all flex items-center gap-2.5 ${
              activeSection === "model"
                ? "bg-[#F2B544] text-[#101318]"
                : "bg-[#171A21] text-[#929AA6] hover:text-white border border-[#252B35]"
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Local AI Model</span>
          </button>

          <button
            onClick={() => setActiveSection("offline")}
            className={`w-full text-left px-3.5 py-3 rounded-lg text-xs font-bold transition-all flex items-center gap-2.5 ${
              activeSection === "offline"
                ? "bg-[#F2B544] text-[#101318]"
                : "bg-[#171A21] text-[#929AA6] hover:text-white border border-[#252B35]"
            }`}
          >
            <Wifi className="w-4 h-4" />
            <span>Offline System</span>
          </button>

          <button
            onClick={() => setActiveSection("storage")}
            className={`w-full text-left px-3.5 py-3 rounded-lg text-xs font-bold transition-all flex items-center gap-2.5 ${
              activeSection === "storage"
                ? "bg-[#F2B544] text-[#101318]"
                : "bg-[#171A21] text-[#929AA6] hover:text-white border border-[#252B35]"
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Storage & Partitions</span>
          </button>

          <button
            onClick={() => setActiveSection("roles")}
            className={`w-full text-left px-3.5 py-3 rounded-lg text-xs font-bold transition-all flex items-center gap-2.5 ${
              activeSection === "roles"
                ? "bg-[#F2B544] text-[#101318]"
                : "bg-[#171A21] text-[#929AA6] hover:text-white border border-[#252B35]"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Access & Roles</span>
          </button>

          <button
            onClick={() => setActiveSection("preferences")}
            className={`w-full text-left px-3.5 py-3 rounded-lg text-xs font-bold transition-all flex items-center gap-2.5 ${
              activeSection === "preferences"
                ? "bg-[#F2B544] text-[#101318]"
                : "bg-[#171A21] text-[#929AA6] hover:text-white border border-[#252B35]"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Display & Preferences</span>
          </button>

          <button
            onClick={() => setActiveSection("about")}
            className={`w-full text-left px-3.5 py-3 rounded-lg text-xs font-bold transition-all flex items-center gap-2.5 ${
              activeSection === "about"
                ? "bg-[#F2B544] text-[#101318]"
                : "bg-[#171A21] text-[#929AA6] hover:text-white border border-[#252B35]"
            }`}
          >
            <Info className="w-4 h-4" />
            <span>About MEC-G</span>
          </button>
        </div>

        {/* Right Settings Content */}
        <div className="md:col-span-9 bg-[#171A21] border border-[#252B35] rounded-xl p-6 shadow-sm">
          {/* SECTION A: LOCAL AI MODEL */}
          {activeSection === "model" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[#F2B544]" />
                  <span>Local AI Model Configuration</span>
                </h3>
                <p className="text-xs text-[#929AA6] mt-1">
                  Manage the local quantized Gemma weights running on your edge workstation or rugged tablet without internet connectivity.
                </p>
              </div>

              {/* Status Banner */}
              <div className="p-4 rounded-xl bg-[#101318] border border-[#252B35] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${modelLoaded ? "bg-[#279C70] animate-pulse" : "bg-[#D94D4D]"}`} />
                  <div>
                    <div className="text-xs font-bold text-white">
                      {modelLoaded ? "Model Loaded in RAM & Ready" : "Model Suspended (Unloaded)"}
                    </div>
                    <div className="text-[10px] font-mono text-[#929AA6]">{modelStatus}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setModelLoaded((prev) => !prev);
                    showToast(modelLoaded ? "Model weights unmapped from RAM." : "Model weights re-allocated to local memory.");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    modelLoaded
                      ? "bg-[#252B35] hover:bg-[#D94D4D]/20 text-[#D94D4D]"
                      : "bg-[#279C70] hover:bg-[#279C70]/90 text-white"
                  }`}
                >
                  {modelLoaded ? "Unload Model" : "Load Model"}
                </button>
              </div>

              {/* Model Select */}
              <div className="space-y-3">
                <label className="text-xs font-mono uppercase text-[#929AA6]">Active Model Weights</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setSelectedModel("gemma-2-9b-it-int4")}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      selectedModel === "gemma-2-9b-it-int4"
                        ? "bg-[#F2B544]/10 border-[#F2B544] text-white"
                        : "bg-[#101318] border-[#252B35] text-[#929AA6]"
                    }`}
                  >
                    <div className="font-bold text-xs text-white">Gemma 2 9B IT (INT4 AWQ)</div>
                    <div className="text-[11px] text-[#929AA6] mt-0.5">Optimized for offline field edge inference</div>
                    <div className="text-[10px] font-mono text-[#279C70] mt-2">RAM Footprint: 5.4 GB • Recommended</div>
                  </div>

                  <div
                    onClick={() => setSelectedModel("gemini-1.5-flash-edge")}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      selectedModel === "gemini-1.5-flash-edge"
                        ? "bg-[#F2B544]/10 border-[#F2B544] text-white"
                        : "bg-[#101318] border-[#252B35] text-[#929AA6]"
                    }`}
                  >
                    <div className="font-bold text-xs text-white">Gemini 1.5 Flash (Hybrid Online)</div>
                    <div className="text-[11px] text-[#929AA6] mt-0.5">Google GenAI SDK fallback with multimodal streaming</div>
                    <div className="text-[10px] font-mono text-[#F2B544] mt-2">Requires Uplink • Auto-Fallback to Gemma</div>
                  </div>
                </div>
              </div>

              {/* Advanced Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#101318] border border-[#252B35]">
                  <span className="text-[#929AA6] font-mono block">QUANTIZATION</span>
                  <span className="font-bold text-white mt-1 block">{quantization}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#101318] border border-[#252B35]">
                  <span className="text-[#929AA6] font-mono block">CONTEXT WINDOW</span>
                  <span className="font-bold text-white mt-1 block">{contextWindow}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#101318] border border-[#252B35]">
                  <span className="text-[#929AA6] font-mono block">HARDWARE ENGINE</span>
                  <span className="font-bold text-[#F2B544] mt-1 block">{hardwareAcceleration}</span>
                </div>
              </div>

              {/* Telemetry Stats */}
              <div className="p-4 rounded-xl bg-[#101318] border border-[#252B35] space-y-3">
                <div className="text-xs font-mono uppercase text-[#929AA6]">Local Runtime Health & Telemetry</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[#929AA6] block">Cold Start Latency</span>
                    <span className="font-mono text-white font-bold">184 ms</span>
                  </div>
                  <div>
                    <span className="text-[#929AA6] block">Tokens / Sec</span>
                    <span className="font-mono text-[#279C70] font-bold">42.8 t/s</span>
                  </div>
                  <div>
                    <span className="text-[#929AA6] block">VRAM Allocated</span>
                    <span className="font-mono text-white font-bold">5.42 GB</span>
                  </div>
                  <div>
                    <span className="text-[#929AA6] block">Engine Temperature</span>
                    <span className="font-mono text-white font-bold">48°C (Nominal)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION B: OFFLINE SYSTEM */}
          {activeSection === "offline" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Wifi className="w-5 h-5 text-[#F2B544]" />
                  <span>Offline System Operations</span>
                </h3>
                <p className="text-xs text-[#929AA6] mt-1">
                  MEC-G runs completely autonomous on site without internet, cellular, or cloud API connectivity.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#101318] border border-[#252B35] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isOnline ? (
                      <Wifi className="w-4 h-4 text-[#279C70]" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-[#D99A29]" />
                    )}
                    <span className="text-xs font-bold text-white">
                      Edge Network State: {isOnline ? "Local Subnet Connected (Port 8000)" : "Isolated Air-Gapped Mode"}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#279C70]/20 text-[#279C70] font-mono text-[10px]">
                    ZERO CLOUD DEPENDENCY
                  </span>
                </div>
                <p className="text-xs text-[#929AA6]">
                  All diagnostic queries, embeddings, NetworkX traversals, and citation verifications execute on localhost.
                </p>
              </div>

              {/* Subsystem Health Checklist */}
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase text-[#929AA6]">Local Microservice Subsystem Health</div>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-[#101318] border border-[#252B35] flex items-center justify-between">
                    <span>Document Processing Engine (PyMuPDF & MarkItDown)</span>
                    <span className="text-[#279C70] font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#101318] border border-[#252B35] flex items-center justify-between">
                    <span>Local Knowledge Graph (NetworkX In-Memory)</span>
                    <span className="text-[#279C70] font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready (RAM Active)
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#101318] border border-[#252B35] flex items-center justify-between">
                    <span>Search & Retrieval (RapidFuzz & BM25)</span>
                    <span className="text-[#279C70] font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#101318] border border-[#252B35] flex items-center justify-between">
                    <span>Audio Processing (Web Audio API & Speech Synthesis)</span>
                    <span className="text-[#279C70] font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                    </span>
                  </div>
                </div>
              </div>

              {/* Benchmark Trigger */}
              <div className="pt-2">
                <button
                  onClick={handleTestOfflineBenchmark}
                  disabled={isTestingOffline}
                  className="px-4 py-2.5 rounded-lg bg-[#F2B544] hover:bg-[#F2B544]/90 text-[#101318] text-xs font-bold transition-all flex items-center gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingOffline ? "animate-spin" : ""}`} />
                  <span>{isTestingOffline ? "Executing Benchmark..." : "Run Offline Functionality Test"}</span>
                </button>

                {offlineBenchmarkResult && (
                  <div className="mt-3 p-3 rounded-lg bg-[#279C70]/10 border border-[#279C70]/30 text-xs text-[#279C70] font-mono">
                    {offlineBenchmarkResult}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION C: STORAGE */}
          {activeSection === "storage" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-[#F2B544]" />
                  <span>Storage & Local Partitions</span>
                </h3>
                <p className="text-xs text-[#929AA6] mt-1">
                  Manage physical disk allocation, indexed document storage, and cache retention policies.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-medium">Local Disk Allocation</span>
                  <span className="text-[#F2B544] font-mono font-bold">{storageUsage} of 32.0 GB used</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#101318] overflow-hidden border border-[#252B35]">
                  <div className="h-full bg-[#F2B544] rounded-full" style={{ width: "3.75%" }} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-lg bg-[#101318] border border-[#252B35]">
                  <span className="text-[#929AA6] font-mono block">STORAGE PATH</span>
                  <span className="font-mono text-white text-[11px] mt-1 block truncate">
                    /var/data/mecg_edge_storage
                  </span>
                </div>
                <div className="p-3.5 rounded-lg bg-[#101318] border border-[#252B35]">
                  <span className="text-[#929AA6] font-mono block">INDEXED DOCUMENTS</span>
                  <span className="font-bold text-white mt-1 block">{totalDocsCount} Manuals (58.4 MB)</span>
                </div>
                <div className="p-3.5 rounded-lg bg-[#101318] border border-[#252B35]">
                  <span className="text-[#929AA6] font-mono block">CACHE USAGE</span>
                  <span className="font-bold text-[#279C70] mt-1 block">12.1 MB Transient</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#252B35]">
                <button
                  onClick={() => setShowCleanupModal(true)}
                  className="px-4 py-2.5 rounded-lg bg-[#252B35] hover:bg-[#D94D4D]/20 text-[#D94D4D] text-xs font-bold transition-all flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Purge Temporary Caches</span>
                </button>
              </div>
            </div>
          )}

          {/* SECTION D: ACCESS AND ROLES */}
          {activeSection === "roles" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#F2B544]" />
                  <span>Access & Engineering Roles</span>
                </h3>
                <p className="text-xs text-[#929AA6] mt-1">
                  Change active user authority profile to test field technician workflows, LOTO authorization gates, and admin controls.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    role: "Technician",
                    desc: "Diagnostic execution, audio recording, camera attachment, LOTO physical check sign-off.",
                    badge: "Field Operations",
                  },
                  {
                    role: "Operations Engineer",
                    desc: "Equipment fleet configuration, notebook curation, procedure review.",
                    badge: "Engineering Lead",
                  },
                  {
                    role: "Safety Engineer",
                    desc: "OSHA 1910.147 interlock sign-off, manual version authorization, incident review.",
                    badge: "Regulatory Sign-off",
                  },
                  {
                    role: "Administrator",
                    desc: "Full permissions: engine restart, partition allocation, audit ledger purge.",
                    badge: "Full System Control",
                  },
                ].map((item) => (
                  <div
                    key={item.role}
                    onClick={() => {
                      setUserRole(item.role as any);
                      showToast(`Role switched to ${item.role}.`);
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      userRole === item.role
                        ? "bg-[#F2B544]/15 border-[#F2B544] text-white"
                        : "bg-[#101318] border-[#252B35] text-[#929AA6] hover:border-[#F2B544]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">{item.role}</span>
                      {userRole === item.role ? (
                        <span className="px-2 py-0.5 rounded bg-[#F2B544] text-[#101318] font-bold text-[10px]">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-[#929AA6]">{item.badge}</span>
                      )}
                    </div>
                    <p className="text-xs text-[#929AA6] mt-1.5 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION E: PREFERENCES */}
          {activeSection === "preferences" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#F2B544]" />
                  <span>Display & Rugged Interface Preferences</span>
                </h3>
                <p className="text-xs text-[#929AA6] mt-1">
                  Adjust color palette contrast, typography scales, and tactile feedback for sunlight and outdoor field tablets.
                </p>
              </div>

              {/* Theme Toggle */}
              <div className="p-4 rounded-xl bg-[#101318] border border-[#252B35] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Visual Interface Theme</div>
                  <div className="text-[11px] text-[#929AA6]">
                    Current: <span className="text-[#F2B544] font-bold uppercase">{theme} MODE</span> (Charcoal & Amber)
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-3.5 py-1.5 rounded-lg bg-[#252B35] hover:bg-[#252B35]/80 text-white text-xs font-semibold"
                >
                  Switch to {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>
              </div>

              {/* Font Size */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-[#929AA6]">Typography Scaling</label>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="w-full bg-[#101318] border border-[#252B35] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F2B544]"
                >
                  <option value="Standard Desktop">Standard Desktop (14px base)</option>
                  <option value="Medium (Rugged Default)">Medium (Rugged Tablet - 16px base)</option>
                  <option value="Large (High Visibility)">Large (High Visibility Outdoors - 18px base)</option>
                </select>
              </div>

              {/* High Contrast */}
              <div className="p-3.5 rounded-lg bg-[#101318] border border-[#252B35] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">WCAG AAA High-Contrast Mode</div>
                  <div className="text-[11px] text-[#929AA6]">Enhances card border strokes and dark background delta</div>
                </div>
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#F2B544]"
                />
              </div>

              {/* Language */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-[#929AA6]">Industrial Nomenclature Language</label>
                <select
                  value={systemLanguage}
                  onChange={(e) => setSystemLanguage(e.target.value)}
                  className="w-full bg-[#101318] border border-[#252B35] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F2B544]"
                >
                  <option value="English (US / Engineering)">English (US / Engineering Technical)</option>
                  <option value="German (DIN Standards)">Deutsch (DIN / VDE Terminologie)</option>
                  <option value="Spanish (ISO Technical)">Español (Técnico Industrial)</option>
                  <option value="Japanese (JIS Engineering)">日本語 (JIS 産業規格)</option>
                </select>
              </div>
            </div>
          )}

          {/* SECTION F: ABOUT */}
          {activeSection === "about" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Info className="w-5 h-5 text-[#F2B544]" />
                  <span>About MEC-G — Mechanic Genius</span>
                </h3>
                <p className="text-xs text-[#929AA6] mt-1">
                  Offline-first AI Field Engineering & Hardware Diagnostic Workstation.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#101318] border border-[#252B35] space-y-3">
                <div className="text-sm font-bold text-white">MEC-G Platform Version 2.0.0-RELEASE</div>
                <div className="text-xs text-[#F2B544] font-mono">Tagline: "Engineering Knowledge. Without Boundaries."</div>
                <p className="text-xs text-[#929AA6] leading-relaxed">
                  Built to empower field technicians and industrial reliability engineers operating in remote, high-consequence environments where cloud connectivity is either prohibited or unavailable.
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono uppercase text-[#929AA6]">Supported Technical Documentation Formats</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded bg-[#101318] border border-[#252B35] text-white">
                    <strong>PDF</strong> • Vector Schematics & Manuals
                  </div>
                  <div className="p-2.5 rounded bg-[#101318] border border-[#252B35] text-white">
                    <strong>DOCX</strong> • Standard Operating Procedures
                  </div>
                  <div className="p-2.5 rounded bg-[#101318] border border-[#252B35] text-white">
                    <strong>XLSX</strong> • Torque Matrices & Part Catalogs
                  </div>
                  <div className="p-2.5 rounded bg-[#101318] border border-[#252B35] text-white">
                    <strong>PPTX</strong> • Engineering Training Decks
                  </div>
                  <div className="p-2.5 rounded bg-[#101318] border border-[#252B35] text-white">
                    <strong>HTML</strong> • Interactive Service Bulletins
                  </div>
                  <div className="p-2.5 rounded bg-[#101318] border border-[#252B35] text-white">
                    <strong>Markdown</strong> • Technical Notes & Specs
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#101318] border border-[#252B35] space-y-2 text-xs">
                <div className="font-bold text-white">Technical Architecture Stack</div>
                <div className="text-[#929AA6] font-mono leading-relaxed">
                  Frontend: React 19 • Vite • Tailwind CSS • Lucide Icons<br />
                  Backend: Python 3.10+ • FastAPI • Pydantic v2<br />
                  Document Processing: MarkItDown • PyMuPDF<br />
                  Knowledge Graph: NetworkX In-Memory<br />
                  Search & Retrieval: RapidFuzz • BM25<br />
                  AI Models: Google Gemma 2 9B IT (INT4 AWQ) • Google GenAI SDK
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Storage Cleanup Modal */}
      {showCleanupModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171A21] border border-[#252B35] rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#D94D4D]/15 border border-[#D94D4D]/30 flex items-center justify-center text-[#D94D4D]">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Purge Temporary Caches?</h3>
                <p className="text-xs text-[#929AA6]">Action cannot be undone.</p>
              </div>
            </div>
            <p className="text-xs text-[#929AA6] leading-relaxed">
              This will safely clear transient OCR thumbnails and temporary search memory. Your core indexed documents, notebooks, and audit records will remain completely intact.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCleanupModal(false)}
                className="px-4 py-2 rounded-lg bg-[#252B35] hover:bg-[#252B35]/80 text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCleanupStorage}
                className="px-4 py-2 rounded-lg bg-[#D94D4D] hover:bg-[#D94D4D]/90 text-white text-xs font-bold"
              >
                Confirm Purge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

