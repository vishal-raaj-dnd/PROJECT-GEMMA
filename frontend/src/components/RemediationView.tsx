import React from "react";
import { Wrench, Clock, AlertTriangle, ShieldCheck, CheckCircle2, Bookmark, ExternalLink } from "lucide-react";
import { RemediationPlan, CitationVerification } from "../types/diagnostic";

interface RemediationViewProps {
  plan: RemediationPlan;
  citations: CitationVerification[];
  onSelectCitation: (citation: CitationVerification) => void;
}

export const RemediationView: React.FC<RemediationViewProps> = ({ plan, citations, onSelectCitation }) => {
  const findCitation = (rawCite: string) => {
    return citations.find((c) => c.raw_citation === rawCite || rawCite.includes(c.node_path));
  };

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/90 p-6 sm:p-8 shadow-2xl relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
              Safety Verified & Unlocked
            </span>
            <span className="text-xs font-mono text-slate-400">OSHA 1910.147 Compliant</span>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">{plan.title}</h3>
        </div>

        {plan.estimated_duration_minutes && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Est. Duration: <strong>{plan.estimated_duration_minutes} mins</strong></span>
          </div>
        )}
      </div>

      {/* Required Tools */}
      {plan.required_tools.length > 0 && (
        <div className="mt-6">
          <div className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            <span>Required Calibrated Tools & Materials:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {plan.required_tools.map((t, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-white block">{t.name}</span>
                  {t.spec && <span className="text-[11px] font-mono text-slate-400">{t.spec}</span>}
                </div>
                {t.citation && (
                  <button
                    onClick={() => {
                      const c = findCitation(t.citation!);
                      if (c) onSelectCitation(c);
                    }}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors cursor-pointer"
                    title="View Citation Source"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step-by-Step Sequence */}
      <div className="mt-8 space-y-4">
        <div className="text-xs font-mono uppercase text-slate-400 tracking-wider">
          Step-by-Step Execution Sequence:
        </div>

        {plan.steps.map((step) => {
          const matchedCitation = findCitation(step.citation);
          return (
            <div
              key={step.step_number}
              className="p-5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start gap-4"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 font-mono font-bold text-sm shrink-0 border border-amber-500/20">
                {step.step_number}
              </div>

              <div className="flex-1 space-y-2">
                <p className="text-sm text-slate-200 leading-relaxed font-medium">{step.instruction}</p>

                {/* Highlights Bar */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {step.torque_spec && (
                    <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      TORQUE: {step.torque_spec}
                    </span>
                  )}

                  {step.tool_required && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300">
                      Tool: {step.tool_required}
                    </span>
                  )}

                  {step.hazard_warning && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-red-950/40 text-red-300 border border-red-500/30 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />
                      {step.hazard_warning}
                    </span>
                  )}

                  {matchedCitation && (
                    <button
                      onClick={() => onSelectCitation(matchedCitation)}
                      className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono font-semibold bg-slate-800/90 text-cyan-300 border border-cyan-500/30 hover:bg-slate-800 hover:border-cyan-400 transition-all cursor-pointer"
                    >
                      <Bookmark className="w-3 h-3 text-cyan-400" />
                      <span>{matchedCitation.node_path.split("/").pop()}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Post-Maintenance Verification */}
      {plan.post_maintenance_verification.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-3">
            Post-Maintenance Sign-Off Checklist:
          </div>
          <div className="space-y-2">
            {plan.post_maintenance_verification.map((v, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
