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
    <div className="rounded-xl border border-[#10B981]/40 bg-[#121316] p-6 sm:p-8 shadow-xl relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#2A2A2E]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 uppercase">
              Safety Verified & Unlocked
            </span>
            <span className="text-xs font-mono text-[#9CA3AF]">OSHA 1910.147 Compliant</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#F5F5F7] tracking-tight">{plan.title}</h3>
        </div>

        {plan.estimated_duration_minutes && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0B0B0E] border border-[#2A2A2E] text-xs font-mono text-[#9CA3AF]">
            <Clock className="w-3.5 h-3.5 text-[#FF6B35]" />
            <span>Est. Duration: <strong className="text-white">{plan.estimated_duration_minutes} mins</strong></span>
          </div>
        )}
      </div>

      {/* Required Tools */}
      {plan.required_tools.length > 0 && (
        <div className="mt-6">
          <div className="text-xs font-mono uppercase text-[#9CA3AF] tracking-wider mb-2 flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-[#FF6B35]" />
            <span>Required Calibrated Tools & Materials:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {plan.required_tools.map((t, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-[#0B0B0E] border border-[#2A2A2E] flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-white block">{t.name}</span>
                  {t.spec && <span className="text-[11px] font-mono text-[#9CA3AF]">{t.spec}</span>}
                </div>
                {t.citation && (
                  <button
                    onClick={() => {
                      const c = findCitation(t.citation!);
                      if (c) onSelectCitation(c);
                    }}
                    className="p-1.5 rounded-md bg-[#16171B] hover:bg-[#FF6B35]/20 text-[#FF6B35] transition-colors cursor-pointer border border-[#2A2A2E]"
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
        <div className="text-xs font-mono uppercase text-[#9CA3AF] tracking-wider">
          Step-by-Step Remediation Sequence:
        </div>

        {plan.steps.map((step) => {
          const matchedCitation = findCitation(step.citation);
          return (
            <div
              key={step.step_number}
              className="p-5 rounded-lg bg-[#0B0B0E] border border-[#2A2A2E] hover:border-[#FF6B35]/30 transition-all flex flex-col sm:flex-row items-start gap-4"
            >
              <div className="w-7 h-7 rounded-md bg-[#FF6B35]/15 text-[#FF6B35] font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-[#FF6B35]/30">
                {step.step_number}
              </div>

              <div className="flex-1 space-y-2">
                <p className="text-sm text-[#F5F5F7] leading-relaxed font-normal">{step.instruction}</p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {step.torque_spec && (
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#FF6B35]/20 text-[#FF6B35] border border-[#FF6B35]/40">
                      TORQUE: {step.torque_spec}
                    </span>
                  )}

                  {step.tool_required && (
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-[#16171B] text-[#9CA3AF] border border-[#2A2A2E]">
                      Tool: {step.tool_required}
                    </span>
                  )}

                  {step.hazard_warning && (
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-red-950/40 text-red-300 border border-red-500/30 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />
                      {step.hazard_warning}
                    </span>
                  )}

                  {matchedCitation && (
                    <button
                      onClick={() => onSelectCitation(matchedCitation)}
                      className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono font-semibold bg-[#16171B] text-[#FF6B35] border border-[#FF6B35]/30 hover:border-[#FF6B35] transition-all cursor-pointer"
                    >
                      <Bookmark className="w-3 h-3 text-[#FF6B35]" />
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
        <div className="mt-8 pt-6 border-t border-[#2A2A2E]">
          <div className="text-xs font-mono uppercase text-[#9CA3AF] tracking-wider mb-3">
            Post-Maintenance Functional Sign-Off:
          </div>
          <div className="space-y-2">
            {plan.post_maintenance_verification.map((v, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs text-[#9CA3AF]">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
