import React, { useState } from "react";
import { ShieldAlert, CheckSquare, Square, Lock, Unlock, UserCheck, AlertTriangle } from "lucide-react";
import { SafetyInterlocks } from "../types/diagnostic";

interface SafetyGateProps {
  safety: SafetyInterlocks;
  onAcknowledge: (technicianId: string, confirmedItems: string[]) => void;
  isLoading?: boolean;
}

export const SafetyGateModal: React.FC<SafetyGateProps> = ({ safety, onAcknowledge, isLoading }) => {
  const [technicianId, setTechnicianId] = useState("TECH-ALEX-409");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const allChecklistItems = safety.prerequisites.flatMap((p) =>
    p.checklist.map((item, idx) => ({ id: `${p.id}_${idx}`, text: item, prereqTitle: p.title }))
  );

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isAllChecked =
    allChecklistItems.length > 0 && allChecklistItems.every((item) => checkedItems[item.id]);

  const handleSignOff = () => {
    if (!isAllChecked || !technicianId.trim()) return;
    onAcknowledge(technicianId.trim(), Object.keys(checkedItems).filter((k) => checkedItems[k]));
  };

  // Determine current status state
  const statusState = safety.acknowledged 
    ? "CONFIRMED" 
    : isAllChecked 
      ? "PENDING SIGNOFF" 
      : "BLOCKED / REQUIRED";

  return (
    <div className="card-tech p-6 sm:p-7 relative overflow-hidden border-amber-500/50 shadow-2xl">
      {/* Top Warning Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-[#3995F6] to-amber-500" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase">
                OSHA 1910.147 Mandatory Gate
              </span>
              <span className="text-xs font-mono text-[#6F809A]">Zero-Energy Isolation</span>
            </div>
            <h3 className="text-lg font-bold text-[#F5F7FC] mt-1">Lockout/Tagout (LOTO) Interlock Active</h3>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold flex items-center gap-2 ${
          statusState === "CONFIRMED"
            ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
            : statusState === "PENDING SIGNOFF"
              ? "bg-blue-500/10 border-blue-500/40 text-[#3995F6]"
              : "bg-amber-500/10 border-amber-500/40 text-amber-400"
        }`}>
          <Lock className="w-3.5 h-3.5" />
          <span>STATUS: {statusState}</span>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-[#9AAAC3] leading-relaxed mb-6">
        Under high-pressure fluid and electrical isolation regulations, mechanical procedures are electronically
        blocked until you confirm each prerequisite step:
      </p>

      {/* Checklist items */}
      <div className="space-y-3 mb-6">
        {allChecklistItems.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleCheck(item.id)}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
              checkedItems[item.id]
                ? "bg-[#101D35] border-[#3995F6]/60 text-[#F5F7FC]"
                : "bg-[#060B18] border-[#1D3150] text-[#9AAAC3] hover:border-amber-500/40"
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {checkedItems[item.id] ? (
                <CheckSquare className="w-4 h-4 text-[#3995F6]" />
              ) : (
                <Square className="w-4 h-4 text-[#6F809A]" />
              )}
            </div>
            <div className="text-xs sm:text-sm leading-relaxed">
              <span className="font-semibold text-[#F5F7FC] block">{item.text}</span>
              <span className="text-[11px] font-mono text-[#6F809A] mt-0.5 block">
                Protocol: {item.prereqTitle}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Technician Badge ID & Signoff CTA */}
      <div className="p-4 rounded-xl bg-[#060B18] border border-[#1D3150] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <UserCheck className="w-4 h-4 text-[#9AAAC3] shrink-0" />
          <span className="text-xs font-mono text-[#9AAAC3] whitespace-nowrap">Badge ID:</span>
          <input
            type="text"
            value={technicianId}
            onChange={(e) => setTechnicianId(e.target.value)}
            placeholder="e.g. TECH-ALEX-409"
            className="px-3 py-1.5 rounded-lg bg-[#0B1427] border border-[#1D3150] text-xs font-mono text-[#F5F7FC] focus:outline-none focus:border-[#3995F6] w-full sm:w-44 transition-colors"
          />
        </div>

        <button
          onClick={handleSignOff}
          disabled={!isAllChecked || !technicianId.trim() || isLoading}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isAllChecked && technicianId.trim()
              ? "btn-primary-blue shadow-lg cursor-pointer"
              : "bg-[#101D35] text-[#6F809A] border border-[#1D3150] cursor-not-allowed opacity-60"
          }`}
        >
          <Unlock className="w-3.5 h-3.5" />
          <span>
            {isLoading
              ? "Verifying Zero-Energy State..."
              : isAllChecked
                ? "Sign & Unlock Repair Steps"
                : "Check All LOTO Items to Unlock"}
          </span>
        </button>
      </div>
    </div>
  );
};
