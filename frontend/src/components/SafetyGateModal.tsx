import React, { useState } from "react";
import { ShieldAlert, CheckSquare, Square, Lock, Unlock, AlertTriangle, UserCheck } from "lucide-react";
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
    <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-b from-amber-950/30 to-slate-900/90 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Hazard Stripes Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
            <ShieldAlert className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                OSHA 1910.147 Enforced
              </span>
              <span className="text-xs font-mono text-slate-400">Zero-Energy Isolation Gate</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              Lockout/Tagout (LOTO) Safety Gate Active
            </h3>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-400" />
          <span>REPAIR STEPS LOCKED</span>
        </div>
      </div>

      <p className="text-slate-300 text-sm leading-relaxed mb-6">
        In accordance with high-pressure fluid and electrical safety interlocks, physical repair instructions are
        electronically withheld until you confirm the following isolation checkpoints:
      </p>

      {/* Checklist items */}
      <div className="space-y-3 mb-6">
        {allChecklistItems.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleCheck(item.id)}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
              checkedItems[item.id]
                ? "bg-amber-500/10 border-amber-500/50 text-amber-100"
                : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
            }`}
          >
            <div className="mt-0.5 text-amber-400 shrink-0">
              {checkedItems[item.id] ? (
                <CheckSquare className="w-5 h-5 text-amber-400" />
              ) : (
                <Square className="w-5 h-5 text-slate-500" />
              )}
            </div>
            <div className="text-xs sm:text-sm leading-relaxed">
              <span className="font-semibold text-white block">{item.text}</span>
              <span className="text-[11px] font-mono text-slate-400 mt-0.5 block">
                Protocol: {item.prereqTitle}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Technician ID & Signoff CTA */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <UserCheck className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-mono text-slate-400 whitespace-nowrap">Technician Badge:</span>
          <input
            type="text"
            value={technicianId}
            onChange={(e) => setTechnicianId(e.target.value)}
            className="w-full sm:w-44 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
            placeholder="e.g. TECH-409"
          />
        </div>

        <button
          onClick={handleSignOff}
          disabled={!isAllChecked || isLoading}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
            isAllChecked && !isLoading
              ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30"
              : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50"
          }`}
        >
          <Unlock className="w-4 h-4" />
          {isLoading ? "Verifying Interlocks..." : "Confirm Zero Energy & Unlock Repair"}
        </button>
      </div>
    </div>
  );
};
