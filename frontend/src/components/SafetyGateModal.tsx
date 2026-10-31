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
    <div className="rounded-xl border border-amber-500/40 bg-[#121316] p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Top Warning Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-[#FF6B35] to-amber-500" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase">
                OSHA 1910.147 Mandatory Gate
              </span>
              <span className="text-xs font-mono text-[#9CA3AF]">Zero-Energy Isolation</span>
            </div>
            <h3 className="text-lg font-bold text-[#F5F5F7] mt-1">Lockout/Tagout (LOTO) Interlock Active</h3>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-[#0B0B0E] border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>REPAIR STEPS LOCKED</span>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed mb-6">
        Under high-pressure fluid and electrical isolation regulations, mechanical procedures are electronically
        blocked until you confirm each prerequisite step:
      </p>

      {/* Checklist items */}
      <div className="space-y-3 mb-6">
        {allChecklistItems.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleCheck(item.id)}
            className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-start gap-3.5 ${
              checkedItems[item.id]
                ? "bg-amber-500/10 border-amber-500/40 text-amber-100"
                : "bg-[#0B0B0E] border-[#2A2A2E] text-[#9CA3AF] hover:border-amber-500/30"
            }`}
          >
            <div className="mt-0.5 text-amber-400 shrink-0">
              {checkedItems[item.id] ? (
                <CheckSquare className="w-4 h-4 text-amber-400" />
              ) : (
                <Square className="w-4 h-4 text-[#9CA3AF]" />
              )}
            </div>
            <div className="text-xs sm:text-sm leading-relaxed">
              <span className="font-semibold text-white block">{item.text}</span>
              <span className="text-[11px] font-mono text-[#9CA3AF] mt-0.5 block">
                Protocol: {item.prereqTitle}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Technician ID & Signoff CTA */}
      <div className="p-4 rounded-lg bg-[#0B0B0E] border border-[#2A2A2E] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <UserCheck className="w-4 h-4 text-[#9CA3AF] shrink-0" />
          <span className="text-xs font-mono text-[#9CA3AF] whitespace-nowrap">Badge ID:</span>
          <input
            type="text"
            value={technicianId}
            onChange={(e) => setTechnicianId(e.target.value)}
            className="w-full sm:w-44 px-3 py-1.5 rounded-lg bg-[#121316] border border-[#2A2A2E] text-white font-mono text-xs focus:outline-none focus:border-[#FF6B35]"
            placeholder="e.g. TECH-409"
          />
        </div>

        <button
          onClick={handleSignOff}
          disabled={!isAllChecked || isLoading}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium text-xs tracking-tight transition-all cursor-pointer ${
            isAllChecked && !isLoading
              ? "bg-[#FF6B35] hover:bg-[#F97316] text-white shadow-md shadow-[#FF6B35]/25"
              : "bg-[#16171B] text-[#9CA3AF] cursor-not-allowed border border-[#2A2A2E]"
          }`}
        >
          <Unlock className="w-3.5 h-3.5" />
          {isLoading ? "Verifying Interlocks..." : "Confirm Zero Energy & Unlock Repair"}
        </button>
      </div>
    </div>
  );
};
