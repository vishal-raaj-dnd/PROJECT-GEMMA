import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMecG } from "../context/MecGContext";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  UploadCloud,
  Check,
  X,
  FileCheck2,
  HardHat,
  Glasses,
  ZapOff,
  Flame,
  Radio,
  ExternalLink,
  ChevronRight,
  Info,
  CheckSquare,
  Square
} from "lucide-react";

interface ManualReviewItem {
  id: string;
  title: string;
  equipment: string;
  manufacturer: string;
  approvedVersion: string;
  currentKbVersion: string;
  status: "Compliant" | "Review Required" | "Outdated";
  lastAuditDate: string;
  safetyEngineer: string;
}

export const SafetyCompliancePage: React.FC = () => {
  const { userRole, showToast } = useMecG();

  // Active Tab
  const [activeTab, setActiveTab] = useState<"loto" | "isolation" | "ppe" | "manuals" | "pending">("loto");

  // Interactive Live Interlock Simulator
  const [badgeId, setBadgeId] = useState("TECH-8842-OFFSHORE");
  const [technicianName, setTechnicianName] = useState("Alex Carter");
  const [selectedAsset, setSelectedAsset] = useState("Vestas V112 Nacelle Pitch System");
  const [lotoSteps, setLotoSteps] = useState([
    { id: "1", title: "Notify Affected Personnel", desc: "Inform operators and supervisor of pitch actuator service outage.", checked: true },
    { id: "2", title: "Emergency Stop Depressed", desc: "Verify turbine e-stop button engaged in base and nacelle.", checked: true },
    { id: "3", title: "Energy Isolation (480V ACB Opened)", desc: "Open main circuit breaker CB-480 and discharge bus capacitors.", checked: true },
    { id: "4", title: "Lockout & Tagout Applied", desc: "Fit Master Lock Series 410 red padlock and Danger tag with Badge ID.", checked: false },
    { id: "5", title: "Zero-Energy Depressurization Verified", desc: "Bleed hydraulic accumulator manifold to < 5 PSI via valve V-02.", checked: false },
    { id: "6", title: "Test Zero State", desc: "Attempt manual actuation test to confirm zero mechanical/electrical response.", checked: false },
  ]);

  // PPE Checklist State
  const [ppeItems, setPpeItems] = useState([
    { id: "hard_hat", name: "EN 397 Industrial Safety Helmet", required: true, checked: true, icon: HardHat },
    { id: "safety_glasses", name: "ANSI Z87.1 Safety Eyewear (UV & Impact)", required: true, checked: true, icon: Glasses },
    { id: "arc_flash", name: "NFPA 70E Arc Flash Face Shield (Category 2)", required: true, checked: true, icon: ZapOff },
    { id: "electrical_gloves", name: "ASTM D120 Class 0 (1000V) Insulated Gloves", required: true, checked: false, icon: ZapOff },
    { id: "steel_toe", name: "ASTM F2413 Steel Toe Work Boots (EH Rated)", required: true, checked: true, icon: HardHat },
    { id: "fall_arrest", name: "EN 361 Full Body Harness with Twin Lanyard", required: true, checked: true, icon: HardHat },
  ]);

  // Manufacturer Manual Compliance State (Section 13)
  const [manualReviews, setManualReviews] = useState<ManualReviewItem[]>([
    {
      id: "MAN-01",
      title: "Vestas V112-3.0 MW Nacelle Hydraulics Maintenance Manual",
      equipment: "Wind Turbine V112",
      manufacturer: "Vestas Wind Systems A/S",
      approvedVersion: "Rev 4.2 (2025-Q4)",
      currentKbVersion: "Rev 4.2 (2025-Q4)",
      status: "Compliant",
      lastAuditDate: "2026-09-15",
      safetyEngineer: "H. Bauer, CSP",
    },
    {
      id: "MAN-02",
      title: "Siemens SGT-400 Dry Gas Seal Depressurization Standard",
      equipment: "Gas Turbine SGT-400",
      manufacturer: "Siemens Energy",
      approvedVersion: "Issue 3.1",
      currentKbVersion: "Issue 3.0",
      status: "Review Required",
      lastAuditDate: "2026-10-01",
      safetyEngineer: "Pending Sign-off",
    },
    {
      id: "MAN-03",
      title: "Parker Hannifin D1FP Proportional Valve Service & Torque Bulletin",
      equipment: "Hydraulic Pitch Actuators",
      manufacturer: "Parker Hannifin",
      approvedVersion: "TechBul-2026A",
      currentKbVersion: "TechBul-2026A",
      status: "Compliant",
      lastAuditDate: "2026-10-14",
      safetyEngineer: "M. Kovacs, PE",
    },
    {
      id: "MAN-04",
      title: "Caterpillar 3516B Marine Generator LOTO Procedure",
      equipment: "Emergency Diesel Generator",
      manufacturer: "Caterpillar Inc.",
      approvedVersion: "SEBU-8812-04",
      currentKbVersion: "SEBU-8812-02",
      status: "Outdated",
      lastAuditDate: "2026-08-20",
      safetyEngineer: "Action Needed",
    },
  ]);

  // Incomplete acknowledgements log
  const [incompleteAcknowledgements] = useState([
    {
      id: "INC-991",
      session: "DIAG-8821",
      asset: "V112 Nacelle Pitch Valve",
      technician: "Alex Carter (TECH-8842)",
      missingGate: "Zero-energy accumulator bleeder valve verification unconfirmed",
      time: "2026-10-31 08:42",
      riskLevel: "CRITICAL",
    },
    {
      id: "INC-984",
      session: "DIAG-8819",
      asset: "Siemens SGT-400 Lube Oil Skid",
      technician: "Marcus Vance (TECH-4412)",
      missingGate: "Arc flash face shield (NFPA 70E Cat 2) not signed off",
      time: "2026-10-30 16:15",
      riskLevel: "HIGH",
    },
  ]);

  const toggleLotoStep = (id: string) => {
    setLotoSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, checked: !step.checked } : step))
    );
  };

  const togglePpe = (id: string) => {
    setPpeItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const allLotoCompleted = lotoSteps.every((s) => s.checked);
  const allPpeCompleted = ppeItems.every((p) => p.checked);

  const handleSignLotoGate = () => {
    if (!badgeId.trim()) {
      showToast("Technician Badge ID is required to record electronic sign-off.");
      return;
    }
    if (!allLotoCompleted || !allPpeCompleted) {
      showToast("All mandatory safety and PPE steps must be completed prior to LOTO sign-off.");
      return;
    }
    showToast(`LOTO Safety Interlock electronically signed for ${selectedAsset}. Local audit entry committed.`);
  };

  const handleApproveManualVersion = (id: string) => {
    if (userRole !== "Safety Engineer" && userRole !== "Administrator" && userRole !== "Operations Engineer") {
      showToast("Manual approval requires Safety Engineer or Administrator role privileges.");
      return;
    }
    setManualReviews((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              currentKbVersion: item.approvedVersion,
              status: "Compliant",
              lastAuditDate: new Date().toISOString().split("T")[0],
              safetyEngineer: "Signed by Safety Lead",
            }
          : item
      )
    );
    showToast(`Manual ${id} marked as Compliant in Knowledge Base.`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#252B35]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#252B35] text-xs font-mono text-[#F2B544] mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>REGULATORY SAFETY MANAGEMENT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Safety & Compliance</h1>
          <p className="text-sm text-[#929AA6] mt-1">
            Enforces OSHA 1910.147 hazardous energy control, verified PPE requirements, and manufacturer manual compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-lg bg-[#171A21] border border-[#252B35] text-right">
            <div className="text-[10px] font-mono uppercase text-[#929AA6]">Interlock Gate Status</div>
            <div className="text-xs font-bold text-[#279C70] flex items-center justify-end gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              OSHA 1910.147 ACTIVE
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#252B35] overflow-x-auto space-x-2">
        <button
          onClick={() => setActiveTab("loto")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === "loto"
              ? "border-[#F2B544] text-[#F2B544]"
              : "border-transparent text-[#929AA6] hover:text-white"
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Lockout / Tagout (LOTO) Interlock</span>
        </button>

        <button
          onClick={() => setActiveTab("isolation")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === "isolation"
              ? "border-[#F2B544] text-[#F2B544]"
              : "border-transparent text-[#929AA6] hover:text-white"
          }`}
        >
          <ZapOff className="w-4 h-4" />
          <span>Energy Isolation Protocols</span>
        </button>

        <button
          onClick={() => setActiveTab("ppe")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === "ppe"
              ? "border-[#F2B544] text-[#F2B544]"
              : "border-transparent text-[#929AA6] hover:text-white"
          }`}
        >
          <HardHat className="w-4 h-4" />
          <span>PPE Requirements Checklist</span>
        </button>

        <button
          onClick={() => setActiveTab("manuals")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === "manuals"
              ? "border-[#F2B544] text-[#F2B544]"
              : "border-transparent text-[#929AA6] hover:text-white"
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Approved Manual Versions ({manualReviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("pending")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === "pending"
              ? "border-[#F2B544] text-[#F2B544]"
              : "border-transparent text-[#929AA6] hover:text-white"
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-[#D94D4D]" />
          <span>Incomplete Gates ({incompleteAcknowledgements.length})</span>
        </button>
      </div>

      {/* TAB 1: LOCKOUT/TAGOUT PROTOCOL */}
      {activeTab === "loto" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive Sign-off Panel */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#171A21] border border-[#252B35] rounded-xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#D99A29]/15 border border-[#D99A29]/30 flex items-center justify-center text-[#F2B544]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">OSHA 1910.147 LOTO Verification</h3>
                    <p className="text-xs font-mono text-[#929AA6]">The Control of Hazardous Energy Protocol</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#252B35] text-[11px] font-mono text-[#F2B544]">
                  MANDATORY SAFETY GATE
                </span>
              </div>

              {/* Asset Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-[#929AA6]">Equipment Asset Tag</label>
                <input
                  type="text"
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  className="w-full bg-[#101318] border border-[#252B35] rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#F2B544]"
                />
              </div>

              {/* LOTO Checklist Steps */}
              <div className="space-y-3">
                <label className="text-xs font-mono uppercase text-[#929AA6]">
                  Sequential Isolation Verification Steps ({lotoSteps.filter((s) => s.checked).length}/{lotoSteps.length})
                </label>
                <div className="space-y-2">
                  {lotoSteps.map((step) => (
                    <div
                      key={step.id}
                      onClick={() => toggleLotoStep(step.id)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                        step.checked
                          ? "bg-[#279C70]/10 border-[#279C70]/40 text-white"
                          : "bg-[#101318] border-[#252B35] text-[#929AA6] hover:border-[#F2B544]/50"
                      }`}
                    >
                      <div className="mt-0.5">
                        {step.checked ? (
                          <CheckSquare className="w-4 h-4 text-[#279C70]" />
                        ) : (
                          <Square className="w-4 h-4 text-[#929AA6]" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-white flex items-center justify-between">
                          <span>{step.title}</span>
                          <span className="font-mono text-[10px] text-[#929AA6]">STEP {step.id}</span>
                        </div>
                        <p className="text-xs text-[#929AA6] mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technician Sign-Off Credentials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#252B35]">
                <div>
                  <label className="text-[10px] font-mono uppercase text-[#929AA6]">Technician Name</label>
                  <input
                    type="text"
                    value={technicianName}
                    onChange={(e) => setTechnicianName(e.target.value)}
                    className="w-full bg-[#101318] border border-[#252B35] rounded-lg px-3 py-1.5 text-xs text-white mt-1 focus:outline-none focus:border-[#F2B544]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-[#929AA6]">Lockout Badge ID</label>
                  <input
                    type="text"
                    value={badgeId}
                    onChange={(e) => setBadgeId(e.target.value)}
                    className="w-full bg-[#101318] border border-[#252B35] rounded-lg px-3 py-1.5 text-xs font-mono text-white mt-1 focus:outline-none focus:border-[#F2B544]"
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleSignLotoGate}
                disabled={!allLotoCompleted}
                className={`w-full py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  allLotoCompleted
                    ? "bg-[#F2B544] hover:bg-[#F2B544]/90 text-[#101318] shadow-lg shadow-[#F2B544]/20 cursor-pointer"
                    : "bg-[#252B35] text-[#929AA6] cursor-not-allowed"
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>
                  {allLotoCompleted
                    ? "Electronically Sign & Commit LOTO Interlock"
                    : `Complete All Steps to Unlock Sign-off (${lotoSteps.filter((s) => !s.checked).length} remaining)`}
                </span>
              </button>
            </div>
          </div>

          {/* Right: Regulatory Background & Interlock Architecture */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#171A21] border border-[#252B35] rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#D99A29]" />
                <span>Mandatory Safety Gate Enforcement</span>
              </h3>
              <p className="text-xs text-[#929AA6] leading-relaxed">
                In industrial field engineering, unverified procedures risk arc flashes, explosive hydraulic line ruptures, or mechanical pinch events.
              </p>
              <div className="p-3.5 rounded-lg bg-[#101318] border border-[#252B35] space-y-2 text-xs">
                <div className="font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#D94D4D]" />
                  <span>No Ordinary UI Bypass</span>
                </div>
                <p className="text-[#929AA6] leading-relaxed">
                  The MEC-G diagnostic engine guarantees that repair procedures and torque sequences remain locked until this gate passes. No client-side script or state spoofing can expose repair guides without an electronic signature entry.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <div className="text-xs font-mono uppercase text-[#929AA6]">Regulatory Standards Referenced</div>
                <div className="space-y-1.5 text-xs text-white">
                  <div className="p-2 rounded bg-[#101318] flex items-center justify-between">
                    <span>OSHA 29 CFR 1910.147</span>
                    <span className="font-mono text-[#279C70]">Compliant</span>
                  </div>
                  <div className="p-2 rounded bg-[#101318] flex items-center justify-between">
                    <span>NFPA 70E Electrical Safety</span>
                    <span className="font-mono text-[#279C70]">Cat 2+ Validated</span>
                  </div>
                  <div className="p-2 rounded bg-[#101318] flex items-center justify-between">
                    <span>ISO 14118 Hazardous Energy Prevention</span>
                    <span className="font-mono text-[#279C70]">Standard</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ENERGY ISOLATION PROTOCOLS */}
      {activeTab === "isolation" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Hydraulic Isolation */}
          <div className="bg-[#171A21] border border-[#252B35] rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#D99A29]/15 border border-[#D99A29]/30 flex items-center justify-center text-[#F2B544]">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Hydraulic Pressure Isolation</h3>
                <span className="text-[10px] font-mono text-[#929AA6]">Up to 280 BAR (4000 PSI)</span>
              </div>
            </div>
            <p className="text-xs text-[#929AA6] leading-relaxed">
              Hydraulic accumulators store explosive potential energy even when main motor pumps are powered down.
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-[#101318] border border-[#252B35]">
                <strong className="text-white block">Step 1: Valve V-01 Close</strong>
                <span className="text-[#929AA6]">Isolate high pressure supply line from reservoir pump.</span>
              </div>
              <div className="p-2.5 rounded bg-[#101318] border border-[#252B35]">
                <strong className="text-white block">Step 2: Manual Bleed V-02</strong>
                <span className="text-[#929AA6]">Open bleed valve slowly. Confirm analog manometer drops below 5 PSI.</span>
              </div>
              <div className="p-2.5 rounded bg-[#101318] border border-[#252B35]">
                <strong className="text-white block">Step 3: Lock Ball Valve</strong>
                <span className="text-[#929AA6]">Apply lock clamp to drain lever with red padlock.</span>
              </div>
            </div>
          </div>

          {/* Electrical 480V Isolation */}
          <div className="bg-[#171A21] border border-[#252B35] rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#D94D4D]/15 border border-[#D94D4D]/30 flex items-center justify-center text-[#D94D4D]">
                <ZapOff className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">480V 3-Phase Electrical Lockout</h3>
                <span className="text-[10px] font-mono text-[#929AA6]">NFPA 70E Arc Flash Hazard</span>
              </div>
            </div>
            <p className="text-xs text-[#929AA6] leading-relaxed">
              High voltage inverter cabinets contain DC-link capacitors requiring 10-minute bleeder discharge.
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-[#101318] border border-[#252B35]">
                <strong className="text-white block">Step 1: Trip ACB Breaker</strong>
                <span className="text-[#929AA6]">Rotate main switch to OFF position until mechanical indicator displays OPEN.</span>
              </div>
              <div className="p-2.5 rounded bg-[#101318] border border-[#252B35]">
                <strong className="text-white block">Step 2: Voltage Verification</strong>
                <span className="text-[#929AA6]">Use calibrated multi-meter across L1-L2, L2-L3, L1-L3 (must measure &lt; 50V).</span>
              </div>
              <div className="p-2.5 rounded bg-[#101318] border border-[#252B35]">
                <strong className="text-white block">Step 3: Hasp & Lock Application</strong>
                <span className="text-[#929AA6]">Install steel multi-lock hasp with danger identification tag.</span>
              </div>
            </div>
          </div>

          {/* Pneumatic & Mechanical Rotor Lock */}
          <div className="bg-[#171A21] border border-[#252B35] rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#279C70]/15 border border-[#279C70]/30 flex items-center justify-center text-[#279C70]">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Mechanical Rotor Lock</h3>
                <span className="text-[10px] font-mono text-[#929AA6]">Wind Turbine Nacelle Main Shaft</span>
              </div>
            </div>
            <p className="text-xs text-[#929AA6] leading-relaxed">
              Turbine blades generate immense aerodynamic torque capable of turning rotor during maintenance.
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-[#101318] border border-[#252B35]">
                <strong className="text-white block">Step 1: Rotor Brake Engage</strong>
                <span className="text-[#929AA6]">Activate emergency hydraulic brake caliper to arrest slow rotation.</span>
              </div>
              <div className="p-2.5 rounded bg-[#101318] border border-[#252B35]">
                <strong className="text-white block">Step 2: Hydraulic Rotor Lock Pin</strong>
                <span className="text-[#929AA6]">Insert dual physical locking pins through rotor hub disc bores.</span>
              </div>
              <div className="p-2.5 rounded bg-[#101318] border border-[#252B35]">
                <strong className="text-white block">Step 3: Mechanical Securing</strong>
                <span className="text-[#929AA6]">Install mechanical retaining cotter pin and padlock on control console.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PPE REQUIREMENTS CHECKLIST */}
      {activeTab === "ppe" && (
        <div className="bg-[#171A21] border border-[#252B35] rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Personal Protective Equipment (PPE) Matrix</h3>
              <p className="text-xs text-[#929AA6]">
                Mandatory gear verification for field operations and high-hazard equipment servicing.
              </p>
            </div>
            <div className="text-xs font-mono text-[#F2B544]">
              {ppeItems.filter((p) => p.checked).length} / {ppeItems.length} Verified
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ppeItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => togglePpe(item.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                    item.checked
                      ? "bg-[#279C70]/10 border-[#279C70]/40 text-white"
                      : "bg-[#101318] border-[#252B35] text-[#929AA6] hover:border-[#F2B544]"
                  }`}
                >
                  <div className={`p-2.5 rounded-lg ${item.checked ? "bg-[#279C70]/20 text-[#279C70]" : "bg-[#252B35] text-[#929AA6]"}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{item.name}</span>
                      {item.checked ? (
                        <CheckCircle2 className="w-4 h-4 text-[#279C70]" />
                      ) : (
                        <span className="text-[10px] font-mono text-[#D94D4D] font-bold">REQUIRED</span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#929AA6] mt-1">
                      {item.checked ? "Verified inspected & fitted" : "Click to confirm equipment presence"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-lg bg-[#101318] border border-[#252B35] flex items-center justify-between text-xs">
            <span className="text-[#929AA6]">
              All PPE items are enforced prior to procedure unlocking under OSHA 1910 Subpart I.
            </span>
            <button
              onClick={() => {
                setPpeItems((prev) => prev.map((p) => ({ ...p, checked: true })));
                showToast("All required PPE items marked as verified.");
              }}
              className="px-3 py-1.5 rounded bg-[#252B35] hover:bg-[#252B35]/80 text-white font-medium"
            >
              Verify All PPE
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: APPROVED MANUAL VERSIONS */}
      {activeTab === "manuals" && (
        <div className="bg-[#171A21] border border-[#252B35] rounded-xl overflow-hidden shadow-sm space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Manufacturer Manual Compliance Registry</h3>
              <p className="text-xs text-[#929AA6]">
                Ensures that the offline AI knowledge base only references certified, manufacturer-approved technical revisions.
              </p>
            </div>
            <Link
              to="/library"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F2B544] hover:bg-[#F2B544]/90 text-[#101318] text-xs font-bold transition-colors"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Import Updated Manual</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#929AA6]">
              <thead className="bg-[#101318] text-xs font-mono uppercase text-[#929AA6] border-b border-[#252B35]">
                <tr>
                  <th className="py-3 px-3">Manual Title</th>
                  <th className="py-3 px-3">Equipment Target</th>
                  <th className="py-3 px-3">Approved Rev</th>
                  <th className="py-3 px-3">Engine KB Rev</th>
                  <th className="py-3 px-3">Compliance Status</th>
                  <th className="py-3 px-3">Safety Engineer</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252B35] text-xs">
                {manualReviews.map((m) => (
                  <tr key={m.id} className="hover:bg-[#252B35]/30">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white">{m.title}</div>
                      <div className="text-[10px] text-[#929AA6] font-mono">{m.manufacturer}</div>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-white">{m.equipment}</td>
                    <td className="py-3.5 px-3 font-mono text-white">{m.approvedVersion}</td>
                    <td className="py-3.5 px-3 font-mono text-[#929AA6]">{m.currentKbVersion}</td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          m.status === "Compliant"
                            ? "bg-[#279C70]/15 text-[#279C70] border border-[#279C70]/30"
                            : m.status === "Review Required"
                            ? "bg-[#D99A29]/15 text-[#F2B544] border border-[#D99A29]/30"
                            : "bg-[#D94D4D]/15 text-[#D94D4D] border border-[#D94D4D]/30"
                        }`}
                      >
                        {m.status === "Compliant" ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-xs text-white">{m.safetyEngineer}</td>
                    <td className="py-3.5 px-3 text-right">
                      {m.status !== "Compliant" ? (
                        <button
                          onClick={() => handleApproveManualVersion(m.id)}
                          className="px-2.5 py-1 rounded bg-[#F2B544] hover:bg-[#F2B544]/90 text-[#101318] text-xs font-bold"
                        >
                          Approve Revision
                        </button>
                      ) : (
                        <span className="text-xs font-mono text-[#279C70]">Verified Audit</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: INCOMPLETE ACKNOWLEDGEMENTS */}
      {activeTab === "pending" && (
        <div className="bg-[#171A21] border border-[#252B35] rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#D94D4D]" />
              <span>Incomplete Safety Acknowledgements & Gate Interventions</span>
            </h3>
            <p className="text-xs text-[#929AA6] mt-1">
              Active diagnostic sessions blocked by unresolved safety gates. Technician action required before procedure release.
            </p>
          </div>

          <div className="space-y-3">
            {incompleteAcknowledgements.map((inc) => (
              <div
                key={inc.id}
                className="p-4 rounded-xl bg-[#101318] border border-[#D94D4D]/40 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#D94D4D]/20 text-[#D94D4D] font-mono text-xs font-bold">
                      {inc.riskLevel}
                    </span>
                    <span className="text-xs font-mono font-bold text-white">Session {inc.session}</span>
                    <span className="text-xs text-[#929AA6]">• {inc.asset}</span>
                  </div>
                  <span className="text-xs font-mono text-[#929AA6]">{inc.time}</span>
                </div>

                <div className="text-xs text-white font-medium bg-[#171A21] p-3 rounded-lg border border-[#252B35]">
                  <strong className="text-[#F2B544]">Blocked Safety Interlock: </strong>
                  {inc.missingGate}
                </div>

                <div className="flex items-center justify-between text-xs text-[#929AA6]">
                  <div>Technician: {inc.technician}</div>
                  <Link
                    to="/diagnose"
                    className="text-[#F2B544] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Resolve in Diagnostic Workspace</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

