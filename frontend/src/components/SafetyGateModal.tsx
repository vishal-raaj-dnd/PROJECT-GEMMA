import React, { useState } from "react";
import { ShieldAlert, CheckSquare, Square, Lock, Unlock, UserCheck } from "lucide-react";
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

  return (
    <div className="rounded-3xl border border-amber-500/30 bg-[#111114] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Top Warning Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-[#6C4CF1] to-amber-500" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase">
                OSHA 1910.147 Mandatory Gate
              </span>
              <span className="text-xs font-mono text-[#9A9AA2]">Zero-Energy Isolation</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">Lockout/Tagout (LOTO) Interlock Active</h3>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-[#0A0A0C] border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>REPAIR STEPS LOCKED</span>
        </div>
      </div>

      <p className="text-sm text-[#9A9AA2] leading-relaxed mb-6">
        Under high-pressure fluid and electrical isolation regulations, mechanical procedures are electronically
        blocked until you confirm each prerequisite step:
      </p>

      {/* Checklist items */}
      <div className="space-y-3 mb-6">
        {allChecklistItems.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleCheck(item.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
              checkedItems[item.id]
                ? "bg-amber-500/10 border-amber-500/40 text-amber-100"
                : "bg-[#0A0A0C] border-white/[0.06] text-[#9A9AA2] hover:border-white/[0.14]"
            }`}
          >
            <div className="mt-0.5 text-amber-400 shrink-0">
              {checkedItems[item.id] ? (
                <CheckSquare className="w-5 h-5 text-amber-400" />
              ) : (
                <Square className="w-5 h-5 text-slate-600" />
              )}
            </div>
            <div className="text-xs sm:text-sm leading-relaxed">
              <span className="font-semibold text-white block">{item.text}</span>
              <span className="text-[11px] font-mono text-[#9A9AA2] mt-0.5 block">
                Protocol: {item.prereqTitle}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Technician ID & Signoff CTA */}
      <div className="p-4 rounded-2xl bg-[#0A0A0C] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <UserCheck className="w-4 h-4 text-[#9A9AA2] shrink-0" />
          <span className="text-xs font-mono text-[#9A9AA2] whitespace-nowrap">Badge ID:</span>
          <input
            type="text"
            value={technicianId}
            onChange={(e) => setTechnicianId(e.target.value)}
            className="w-full sm:w-44 px-3 py-1.5 rounded-full bg-[#111114] border border-white/[0.12] text-white font-mono text-xs focus:outline-none focus:border-[#6C4CF1]"
            placeholder="e.g. TECH-409"
          />
        </div>

        <button
          onClick={handleSignOff}
          disabled={!isAllChecked || isLoading}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm tracking-tight transition-all cursor-pointer ${
            isAllChecked && !isLoading
              ? "bg-white hover:bg-slate-200 text-[#0A0A0C] shadow-lg shadow-white/10"
              : "bg-slate-800 text-slate-500 cursor-not-allowed border border-white/[0.06]"
          }`}
        >
          <Unlock className="w-4 h-4" />
          {isLoading ? "Verifying Interlocks..." : "Confirm Zero Energy & Unlock Repair"}
        </button>
      </div>
    </div>
  );
};
