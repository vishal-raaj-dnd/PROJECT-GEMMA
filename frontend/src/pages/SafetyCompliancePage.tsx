import React, { useState } from "react";
import { TopToolbar } from "../components/workspace/TopToolbar";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  FileCheck2,
  HardHat,
  Glasses,
  ZapOff,
  Flame,
  Check,
  X,
  Printer,
  ChevronRight,
  ExternalLink,
  Layers,
  Sparkles,
  Search,
  CheckSquare,
  Square
} from "lucide-react";

interface IsolationPermit {
  id: string;
  asset: string;
  technician: string;
  badgeId: string;
  energyType: string;
  issuedAt: string;
  status: "ACTIVE" | "DE-ISOLATED";
}

export const SafetyCompliancePage: React.FC = () => {
  // Active Tab for Right Island
  const [activeTab, setActiveTab] = useState<"interlocks" | "bulletins" | "permits">("interlocks");

  // Selected Equipment Asset
  const [selectedAsset, setSelectedAsset] = useState("Vestas V112 Nacelle Pitch System");

  // Energy Category
  const [energyType, setEnergyType] = useState<"electrical" | "hydraulic" | "mechanical">("hydraulic");

  // Interactive Live LOTO Simulator Steps
  const [lotoSteps, setLotoSteps] = useState([
    { id: "1", title: "Notify Affected Personnel", desc: "Inform control room operator of pitch actuator service outage.", checked: true },
    { id: "2", title: "Emergency Stop Engaged", desc: "Verify turbine e-stop button engaged in base and nacelle.", checked: true },
    { id: "3", title: "Energy Isolation (480V ACB Opened)", desc: "Open main circuit breaker CB-480 and discharge bus capacitors.", checked: true },
    { id: "4", title: "Lockout & Tagout Applied", desc: "Fit Master Lock Series 410 red padlock and Danger tag with Badge ID.", checked: true },
    { id: "5", title: "Zero-Energy Depressurization Verified", desc: "Bleed hydraulic accumulator manifold to < 5 PSI via bleed valve V-02.", checked: false },
    { id: "6", title: "Test Zero Mechanical State", desc: "Attempt manual actuation test to confirm zero mechanical/electrical response.", checked: false },
  ]);

  // PPE Checklist
  const [ppeItems, setPpeItems] = useState([
    { id: "hard_hat", name: "EN 397 Industrial Safety Helmet", checked: true },
    { id: "safety_glasses", name: "ANSI Z87.1 Safety Eyewear (Impact Rated)", checked: true },
    { id: "arc_flash", name: "NFPA 70E Arc Flash Face Shield (Category 2)", checked: true },
    { id: "electrical_gloves", name: "ASTM D120 Class 0 (1000V) Insulated Gloves", checked: false },
    { id: "steel_toe", name: "ASTM F2413 Steel Toe Work Boots (EH Rated)", checked: true },
  ]);

  // Active Permits Registry
  const [permits, setPermits] = useState<IsolationPermit[]>([
    {
      id: "PERMIT-8842-A",
      asset: "Vestas V112 Nacelle Pitch System",
      technician: "Alex Carter",
      badgeId: "TECH-8842-OFFSHORE",
      energyType: "Hydraulic 210 bar",
      issuedAt: "2026-10-31 08:30 UTC",
      status: "ACTIVE",
    },
    {
      id: "PERMIT-7104-E",
      asset: "Siemens SGT-400 Gas Turbine",
      technician: "Elena Vance",
      badgeId: "TECH-3109-ROTATING",
      energyType: "Electrical 480V",
      issuedAt: "2026-10-30 14:15 UTC",
      status: "ACTIVE",
    },
  ]);

  // Modals
  const [showPermitModal, setShowPermitModal] = useState(false);
  const [selectedPermitForView, setSelectedPermitForView] = useState<IsolationPermit | null>(null);

  // New Permit Form Inputs
  const [newTechnicianName, setNewTechnicianName] = useState("Alex Carter");
  const [newBadgeId, setNewBadgeId] = useState("TECH-8842-OFFSHORE");
  const [newPadlockSerial, setNewPadlockSerial] = useState("ML-410-RED-992");

  // Search Filter
  const [searchQuery, setSearchQuery] = useState("");

  const toggleLotoStep = (id: string) => {
    setLotoSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s))
    );
  };

  const togglePpeItem = (id: string) => {
    setPpeItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, checked: !p.checked } : p))
    );
  };

  const completedLotoCount = lotoSteps.filter((s) => s.checked).length;
  const isZeroEnergyCertified = completedLotoCount === lotoSteps.length;

  const handleIssuePermit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPermit: IsolationPermit = {
      id: `PERMIT-${Math.floor(1000 + Math.random() * 9000)}-${energyType.toUpperCase().slice(0, 3)}`,
      asset: selectedAsset,
      technician: newTechnicianName,
      badgeId: newBadgeId,
      energyType: energyType === "electrical" ? "Electrical 480V" : energyType === "hydraulic" ? "Hydraulic 210 bar" : "Mechanical",
      issuedAt: new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC",
      status: "ACTIVE",
    };
    setPermits([newPermit, ...permits]);
    setShowPermitModal(false);
  };

  return (
    <div className="h-screen flex flex-col bg-[#0B0B0C] text-[#F5F7FF] overflow-hidden select-none">
      {/* Persistent Navigation Toolbar */}
      <TopToolbar activeModule="safety" title="Safety Compliance & LOTO Interlocks" />

      {/* Floating Island Layout */}
      <main className="flex-1 p-3 pt-1 flex flex-col gap-3 min-h-0 overflow-hidden">
        {/* Top KPI Metrics Bar */}
        <section className="bg-[#18181A] rounded-[24px] border border-[#27272A] px-5 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-[#9CA3AF] uppercase">Compliance Standard</div>
                <div className="text-xs font-bold text-white">OSHA 29 CFR 1910.147 (LOTO)</div>
              </div>
            </div>

            <div className="h-7 w-[1px] bg-[#27272A] hidden sm:block" />

            <div className="hidden sm:block">
              <div className="text-[10px] font-mono text-[#9CA3AF] uppercase">Active Isolations</div>
              <div className="text-xs font-bold text-cyan-300 font-mono">
                {permits.filter((p) => p.status === "ACTIVE").length} Active Permits
              </div>
            </div>

            <div className="h-7 w-[1px] bg-[#27272A] hidden md:block" />

            <div className="hidden md:block">
              <div className="text-[10px] font-mono text-[#9CA3AF] uppercase">Zero-Energy Status</div>
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Interlock Enforcement</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowPermitModal(true)}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Issue Isolation Permit</span>
          </button>
        </section>

        {/* 2-Column Workstation Islands */}
        <div className="flex-1 flex gap-3 min-h-0 overflow-hidden">
          {/* Left Island: Hazardous Energy Isolation Simulator */}
          <section className="w-[450px] lg:w-[490px] flex-shrink-0 bg-[#18181A] rounded-[24px] border border-[#27272A] p-4 flex flex-col justify-between overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              {/* Header */}
              <div className="pb-3 border-b border-[#27272A] flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>LOTO Procedure Simulator</span>
                  </h2>
                  <p className="text-[10px] text-[#9CA3AF]">Zero-Energy Verification Protocol</p>
                </div>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  {completedLotoCount}/6 Verified
                </span>
              </div>

              {/* Asset Selector */}
              <div>
                <label className="block text-[11px] font-medium text-[#9CA3AF] mb-1.5">Target Equipment Asset</label>
                <select
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  className="w-full bg-[#141518] border border-[#27272A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#22D3EE] transition-colors"
                >
                  <option value="Vestas V112 Nacelle Pitch System">Vestas V112 Nacelle Pitch System</option>
                  <option value="Hydraulic HPU-350 Primary Loop">Hydraulic HPU-350 Primary Loop</option>
                  <option value="Siemens SGT-400 Gas Turbine">Siemens SGT-400 Gas Turbine</option>
                </select>
              </div>

              {/* Energy Hazard Tabs */}
              <div>
                <label className="block text-[11px] font-medium text-[#9CA3AF] mb-1.5">Hazardous Energy Source</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setEnergyType("hydraulic")}
                    className={`py-1.5 px-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer text-center ${
                      energyType === "hydraulic"
                        ? "bg-[#24252B] border-[#22D3EE] text-white"
                        : "bg-[#141518] border-[#27272A] text-[#9CA3AF] hover:text-white"
                    }`}
                  >
                    Hydraulic (210 bar)
                  </button>
                  <button
                    onClick={() => setEnergyType("electrical")}
                    className={`py-1.5 px-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer text-center ${
                      energyType === "electrical"
                        ? "bg-[#24252B] border-[#FBBF24] text-white"
                        : "bg-[#141518] border-[#27272A] text-[#9CA3AF] hover:text-white"
                    }`}
                  >
                    Electrical (480V)
                  </button>
                  <button
                    onClick={() => setEnergyType("mechanical")}
                    className={`py-1.5 px-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer text-center ${
                      energyType === "mechanical"
                        ? "bg-[#24252B] border-[#8B5CF6] text-white"
                        : "bg-[#141518] border-[#27272A] text-[#9CA3AF] hover:text-white"
                    }`}
                  >
                    Mechanical
                  </button>
                </div>
              </div>

              {/* Interactive LOTO Checklist */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-medium text-[#9CA3AF]">
                  <span>Mandatory Isolation Sequence</span>
                  <span className="text-[10px] font-mono text-amber-400">Strict Order</span>
                </div>

                {lotoSteps.map((step) => (
                  <div
                    key={step.id}
                    onClick={() => toggleLotoStep(step.id)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      step.checked
                        ? "bg-emerald-950/15 border-emerald-500/30 text-white"
                        : "bg-[#141518] border-[#27272A] text-[#9CA3AF] hover:border-[#3A3B43]"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 text-xs ${
                          step.checked ? "bg-emerald-500 text-black font-bold" : "border border-[#27272A] text-[#9CA3AF]"
                        }`}
                      >
                        {step.checked ? <Check className="w-3 h-3" /> : step.id}
                      </div>
                      <div className="text-xs">
                        <div className={`font-semibold ${step.checked ? "text-white" : "text-[#D1D5DB]"}`}>
                          {step.title}
                        </div>
                        <div className="text-[11px] text-[#6B7280] mt-0.5 leading-snug">
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* PPE Mandatory Equipment */}
              <div className="bg-[#141518] border border-[#27272A] rounded-xl p-3 space-y-2">
                <span className="text-[11px] font-medium text-[#9CA3AF] block mb-1">
                  Mandatory PPE Checklist (OSHA 1910 Subpart I)
                </span>
                <div className="space-y-1.5">
                  {ppeItems.map((item) => (
                    <label key={item.id} className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => togglePpeItem(item.id)}
                        className="w-3.5 h-3.5 rounded bg-[#18181A] border-[#27272A] accent-[#22D3EE]"
                      />
                      <span className={item.checked ? "text-white" : "text-[#6B7280]"}>{item.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Zero-Energy Status Pill */}
            <div className="pt-3 border-t border-[#27272A]">
              <div
                className={`p-3 rounded-xl border flex items-center justify-between text-xs font-semibold ${
                  isZeroEnergyCertified
                    ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400"
                    : "bg-amber-950/20 border-amber-500/30 text-amber-400"
                }`}
              >
                <div className="flex items-center gap-2">
                  {isZeroEnergyCertified ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                  <span>{isZeroEnergyCertified ? "Zero-Energy Verified (Ready for Servicing)" : "Zero-Energy Pending Verification"}</span>
                </div>
                <span className="text-[10px] font-mono">{isZeroEnergyCertified ? "PASS" : "INTERLOCKED"}</span>
              </div>
            </div>
          </section>

          {/* Right Island: Interlock Registry, OEM Bulletins, and Permits */}
          <section className="flex-1 bg-[#18181A] rounded-[24px] border border-[#27272A] p-5 flex flex-col overflow-hidden">
            {/* Header Tabs */}
            <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
              <div className="flex items-center gap-2 bg-[#141518] p-1 rounded-xl border border-[#27272A]">
                <button
                  onClick={() => setActiveTab("interlocks")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === "interlocks" ? "bg-[#24252B] text-white shadow-sm" : "text-[#9CA3AF] hover:text-white"
                  }`}
                >
                  Interlock Registry
                </button>
                <button
                  onClick={() => setActiveTab("permits")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === "permits" ? "bg-[#24252B] text-white shadow-sm" : "text-[#9CA3AF] hover:text-white"
                  }`}
                >
                  Active Permits ({permits.length})
                </button>
                <button
                  onClick={() => setActiveTab("bulletins")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === "bulletins" ? "bg-[#24252B] text-white shadow-sm" : "text-[#9CA3AF] hover:text-white"
                  }`}
                >
                  OEM Bulletins
                </button>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#6B7280]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search safety records..."
                  className="bg-[#141518] border border-[#27272A] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#22D3EE] transition-colors"
                />
              </div>
            </div>

            {/* Content Based on Active Tab */}
            <div className="flex-1 overflow-y-auto custom-scrollbar mt-3 space-y-3">
              {activeTab === "interlocks" && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-[#141518] border border-[#27272A]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono font-bold">
                        CRITICAL SAFETY INTERLOCK #INT-480-ACB
                      </span>
                      <span className="text-[10px] font-mono text-[#9CA3AF]">OKF: lockout_tagout_hydraulics.md</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Main Nacelle 480V ACB Energy Isolation Gate</h4>
                    <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed">
                      Requires padlocking main air circuit breaker in open position before opening proportional valve manifold housing. Interlocked via deterministic AST rule.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#141518] border border-[#27272A]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-mono font-bold">
                        HYDRAULIC PRESSURE BLEED #INT-HYD-02
                      </span>
                      <span className="text-[10px] font-mono text-[#9CA3AF]">OKF: proportional_relief_valve_v2.md</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Proportional Relief Valve Accumulator Depressurization</h4>
                    <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed">
                      Accumulator pressure must drop below 5 PSI on manifold gauge G-01 before loosening collar bolts. Calibrated torque wrench required upon reassembly (45 Nm).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#141518] border border-[#27272A]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-mono font-bold">
                        ARC FLASH GATE #INT-ARC-LVL2
                      </span>
                      <span className="text-[10px] font-mono text-[#9CA3AF]">OKF: arc_flash_ppe_level2.md</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Pitch Control PCB Bus Capacitor Isolation</h4>
                    <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed">
                      Capacitors retain lethal 600V DC charge for 10 minutes following main breaker trip. Mandatory 10-minute wait and multimeter zero-voltage check before panel access.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "permits" && (
                <div className="space-y-2.5">
                  {permits.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPermitForView(p)}
                      className="p-3.5 rounded-2xl bg-[#141518] hover:bg-[#1E1F24] border border-[#27272A] hover:border-[#3A3B43] transition-all cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-cyan-400">{p.id}</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[9px]">
                            {p.status}
                          </span>
                        </div>
                        <div className="text-white font-semibold">{p.asset}</div>
                        <div className="text-[10px] font-mono text-[#9CA3AF]">
                          Technician: {p.technician} ({p.badgeId}) • {p.energyType}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono text-[#6B7280] block">{p.issuedAt}</span>
                        <span className="text-xs text-[#22D3EE] font-medium hover:underline inline-flex items-center gap-1 mt-1">
                          View Details <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "bulletins" && (
                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-2xl bg-[#141518] border border-[#27272A]">
                    <div className="flex justify-between items-center text-[10px] font-mono text-[#9CA3AF] mb-1">
                      <span>VESTAS WIND SYSTEMS A/S</span>
                      <span className="text-emerald-400 font-bold">COMPLIANT (REV 4.2)</span>
                    </div>
                    <h4 className="font-bold text-white text-sm">V112 Nacelle Pitch Hydraulics Maintenance Standard</h4>
                    <p className="text-[#9CA3AF] mt-1 text-[11px]">
                      Mandates dual mechanical lock on pitch cylinder during hub entry. Validated by H. Bauer, Certified Safety Professional.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#141518] border border-[#27272A]">
                    <div className="flex justify-between items-center text-[10px] font-mono text-[#9CA3AF] mb-1">
                      <span>PARKER HANNIFIN</span>
                      <span className="text-emerald-400 font-bold">COMPLIANT (TECHBUL-2026A)</span>
                    </div>
                    <h4 className="font-bold text-white text-sm">D1FP Proportional Valve Torquing & Seal Integrity Bulletin</h4>
                    <p className="text-[#9CA3AF] mt-1 text-[11px]">
                      Hex collar torque specification calibrated at 45 Nm with Viton fluoroelastomer O-rings only.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Issue Digital LOTO Permit Modal */}
      {showPermitModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#18181A] border border-[#27272A] rounded-[24px] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272A] mb-4">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Issue Digital LOTO Isolation Permit</h3>
              </div>
              <button
                onClick={() => setShowPermitModal(false)}
                className="text-[#9CA3AF] hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleIssuePermit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#9CA3AF] mb-1 font-medium">Equipment Asset</label>
                <input
                  type="text"
                  value={selectedAsset}
                  disabled
                  className="w-full bg-[#141518] border border-[#27272A] rounded-xl px-3 py-2 text-white font-medium opacity-80"
                />
              </div>

              <div>
                <label className="block text-[#9CA3AF] mb-1 font-medium">Technician Name</label>
                <input
                  type="text"
                  value={newTechnicianName}
                  onChange={(e) => setNewTechnicianName(e.target.value)}
                  required
                  className="w-full bg-[#141518] border border-[#27272A] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#22D3EE]"
                />
              </div>

              <div>
                <label className="block text-[#9CA3AF] mb-1 font-medium">Technician Safety Badge ID</label>
                <input
                  type="text"
                  value={newBadgeId}
                  onChange={(e) => setNewBadgeId(e.target.value)}
                  required
                  className="w-full bg-[#141518] border border-[#27272A] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#22D3EE]"
                />
              </div>

              <div>
                <label className="block text-[#9CA3AF] mb-1 font-medium">Master Lock Padlock Serial #</label>
                <input
                  type="text"
                  value={newPadlockSerial}
                  onChange={(e) => setNewPadlockSerial(e.target.value)}
                  required
                  className="w-full bg-[#141518] border border-[#27272A] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#22D3EE]"
                />
              </div>

              <div className="p-3 bg-[#141518] rounded-xl border border-[#27272A] text-[#9CA3AF] text-[11px]">
                By issuing this digital permit, you certify that all hazardous energy sources have been mechanically isolated and depressurized in accordance with OSHA 1910.147.
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-[#27272A]">
                <button
                  type="button"
                  onClick={() => setShowPermitModal(false)}
                  className="px-4 py-2 rounded-full bg-[#1E1F24] hover:bg-[#25262E] text-white text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authorize & Issue Permit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Permit Modal */}
      {selectedPermitForView && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#18181A] border border-[#27272A] rounded-[24px] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272A] mb-4">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Digital LOTO Permit Record</h3>
              </div>
              <button
                onClick={() => setSelectedPermitForView(null)}
                className="text-[#9CA3AF] hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs bg-[#141518] p-4 rounded-2xl border border-[#27272A]">
              <div className="flex justify-between border-b border-[#27272A] pb-2">
                <span className="text-[#9CA3AF]">PERMIT ID:</span>
                <span className="text-cyan-400 font-bold">{selectedPermitForView.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">ASSET:</span>
                <span className="text-white">{selectedPermitForView.asset}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">TECHNICIAN:</span>
                <span className="text-white">{selectedPermitForView.technician} ({selectedPermitForView.badgeId})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">ENERGY SOURCE:</span>
                <span className="text-amber-400">{selectedPermitForView.energyType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">TIMESTAMP:</span>
                <span className="text-white">{selectedPermitForView.issuedAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">INTERLOCK STATUS:</span>
                <span className="text-emerald-400 font-bold">{selectedPermitForView.status}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedPermitForView(null)}
                className="px-4 py-2 rounded-full bg-[#1E1F24] hover:bg-[#25262E] text-white text-xs font-medium cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-full bg-[#22D3EE] hover:bg-[#06B6D4] text-black text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Permit Placard</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
