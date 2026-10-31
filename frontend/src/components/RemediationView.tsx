import React from "react";
import { Wrench, Clock, AlertTriangle, CheckCircle2, Bookmark } from "lucide-react";
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
    <div className="rounded-3xl border border-[#34D399]/30 bg-[#111114] p-6 sm:p-8 shadow-2xl relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30 uppercase">
              Safety Verified & Unlocked
            </span>
            <span className="text-xs font-mono text-[#9A9AA2]">OSHA 1910.147 Compliant</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{plan.title}</h3>
        </div>

        {plan.estimated_duration_minutes && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A0A0C] border border-white/[0.08] text-xs font-mono text-[#9A9AA2]">
            <Clock className="w-3.5 h-3.5 text-[#C9B8FF]" />
            <span>Est. Duration: <strong className="text-white">{plan.estimated_duration_minutes} mins</strong></span>
          </div>
        )}
      </div>

      {/* Required Tools */}
      {plan.required_tools.length > 0 && (
        <div className="mt-6">
          <div className="text-xs font-mono uppercase text-[#9A9AA2] tracking-wider mb-2 flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-[#6C4CF1]" />
            <span>Required Calibrated Tools & Materials:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {plan.required_tools.map((t, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#0A0A0C] border border-white/[0.06] flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-white block">{t.name}</span>
                  {t.spec && <span className="text-[11px] font-mono text-[#9A9AA2]">{t.spec}</span>}
                </div>
                {t.citation && (
                  <button
                    onClick={() => {
                      const c = findCitation(t.citation!);
                      if (c) onSelectCitation(c);
                    }}
                    className="p-1.5 rounded-lg bg-[#111114] hover:bg-[#6C4CF1]/20 text-[#C9B8FF] transition-colors cursor-pointer border border-white/[0.08]"
                    title="View Verified Citation"
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
        <div className="text-xs font-mono uppercase text-[#9A9AA2] tracking-wider">
          Step-by-Step Remediation Sequence:
        </div>

        {plan.steps.map((step) => {
          const matchedCitation = findCitation(step.citation);
          return (
            <div
              key={step.step_number}
              className="p-5 rounded-2xl bg-[#0A0A0C] border border-white/[0.06] hover:border-white/[0.14] transition-all flex flex-col sm:flex-row items-start gap-4"
            >
              <div className="w-8 h-8 rounded-full bg-[#6C4CF1]/15 text-[#C9B8FF] font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-[#6C4CF1]/30">
                {step.step_number}
              </div>

              <div className="flex-1 space-y-2">
                <p className="text-sm text-slate-200 leading-relaxed font-medium">{step.instruction}</p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {step.torque_spec && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#6C4CF1]/20 text-[#C9B8FF] border border-[#6C4CF1]/40">
                      TORQUE: {step.torque_spec}
                    </span>
                  )}

                  {step.tool_required && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#111114] text-[#9A9AA2] border border-white/[0.06]">
                      Tool: {step.tool_required}
                    </span>
                  )}

                  {step.hazard_warning && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-red-950/30 text-red-300 border border-red-500/20 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />
                      {step.hazard_warning}
                    </span>
                  )}

                  {matchedCitation && (
                    <button
                      onClick={() => onSelectCitation(matchedCitation)}
                      className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-[#111114] text-[#C9B8FF] border border-[#6C4CF1]/30 hover:border-[#6C4CF1] transition-all cursor-pointer"
                    >
                      <Bookmark className="w-3 h-3 text-[#6C4CF1]" />
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
        <div className="mt-8 pt-6 border-t border-white/[0.08]">
          <div className="text-xs font-mono uppercase text-[#9A9AA2] tracking-wider mb-3">
            Post-Maintenance Functional Sign-Off:
          </div>
          <div className="space-y-2">
            {plan.post_maintenance_verification.map((v, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-[#9A9AA2]">
                <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0" />
                <span>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
