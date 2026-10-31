import React from "react";
import { Wrench, Clock, AlertTriangle, CheckCircle2, Bookmark, ArrowRight, ShieldCheck } from "lucide-react";
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
    <div className="card-tech p-6 sm:p-7 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#1D3150]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
              Safety Verified & Unlocked
            </span>
            <span className="text-xs font-mono text-[#6F809A]">OSHA 1910.147 Compliant</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#F5F7FC] tracking-tight">{plan.title}</h3>
        </div>

        {plan.estimated_duration_minutes && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#060B18] border border-[#1D3150] text-xs font-mono text-[#9AAAC3]">
            <Clock className="w-3.5 h-3.5 text-[#3995F6]" />
            <span>Est. Duration: <strong className="text-white">{plan.estimated_duration_minutes} mins</strong></span>
          </div>
        )}
      </div>

      {/* Required Tools */}
      {plan.required_tools.length > 0 && (
        <div>
          <div className="text-xs font-mono uppercase text-[#9AAAC3] tracking-wider mb-2.5 flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-[#3995F6]" />
            <span>Required Calibrated Tools & Materials:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {plan.required_tools.map((t, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#060B18] border border-[#1D3150] flex items-center justify-between text-xs hover:border-[#3995F6]/40 transition-colors"
              >
                <div>
                  <span className="font-semibold text-[#F5F7FC] block">{t.name}</span>
                  {t.spec && <span className="text-[11px] font-mono text-[#6F809A]">{t.spec}</span>}
                </div>
                {t.citation && (
                  <button
                    onClick={() => {
                      const c = findCitation(t.citation!);
                      if (c) onSelectCitation(c);
                    }}
                    className="p-1.5 rounded-lg bg-[#101D35] hover:bg-[#1769C2]/30 text-[#3995F6] transition-colors cursor-pointer border border-[#1D3150]"
                    title="Inspect Source Citation"
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
      <div className="space-y-3.5">
        <div className="text-xs font-mono uppercase text-[#9AAAC3] tracking-wider">
          Step-by-Step Remediation Sequence:
        </div>

        {plan.steps.map((step) => {
          const matchedCitation = findCitation(step.citation);
          return (
            <div
              key={step.step_number}
              className="p-4 sm:p-5 rounded-xl bg-[#060B18] border border-[#1D3150] hover:border-[#3995F6]/40 transition-all flex flex-col sm:flex-row items-start gap-4 group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#101D35] text-[#3995F6] font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-[#1D3150] group-hover:border-[#3995F6]/60">
                {step.step_number}
              </div>

              <div className="flex-1 space-y-2">
                <p className="text-sm text-[#F5F7FC] leading-relaxed font-normal">{step.instruction}</p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {step.torque_spec && (
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#1769C2]/20 text-[#3995F6] border border-[#3995F6]/30">
                      TORQUE: {step.torque_spec}
                    </span>
                  )}

                  {step.tool_required && (
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono text-[#9AAAC3] bg-[#0B1427] border border-[#1D3150] flex items-center gap-1">
                      <Wrench className="w-3 h-3 text-[#3995F6]" />
                      {step.tool_required}
                    </span>
                  )}

                  {step.hazard_warning && (
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-400" />
                      {step.hazard_warning}
                    </span>
                  )}
                </div>
              </div>

              {matchedCitation && (
                <button
                  onClick={() => onSelectCitation(matchedCitation)}
                  className="px-2.5 py-1 rounded-lg bg-[#0B1427] hover:bg-[#101D35] text-[#3995F6] border border-[#1D3150] hover:border-[#3995F6]/50 text-[11px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 self-end sm:self-center"
                  title="View Verified Source Node"
                >
                  <Bookmark className="w-3 h-3" />
                  <span>Inspect Citation</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Post Maintenance Verification */}
      {plan.post_maintenance_verification && plan.post_maintenance_verification.length > 0 && (
        <div className="pt-4 border-t border-[#1D3150]">
          <div className="text-xs font-mono uppercase text-[#9AAAC3] tracking-wider mb-2.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Post-Maintenance Verification Protocols:</span>
          </div>
          <div className="space-y-2">
            {plan.post_maintenance_verification.map((pm, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-[#060B18] border border-[#1D3150] text-xs font-mono text-[#9AAAC3] flex items-center gap-2.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0" />
                <span className="text-[#F5F7FC]">{pm}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
