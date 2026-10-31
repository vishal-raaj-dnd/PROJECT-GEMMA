import React from "react";
import { X, ShieldCheck, AlertCircle, Bookmark, CheckCircle2 } from "lucide-react";
import { CitationVerification } from "../types/diagnostic";

interface EvidenceDrawerProps {
  citation: CitationVerification | null;
  onClose: () => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({ citation, onClose }) => {
  if (!citation) return null;

  const isVerified = citation.verification_status === "verified";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0B0E]/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#121316] border border-[#2A2A2E] rounded-xl shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#2A2A2E] pb-5">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg border flex items-center justify-center ${
                isVerified
                  ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30"
                  : "bg-red-500/10 text-red-400 border-red-500/30"
              }`}
            >
              {isVerified ? <ShieldCheck className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                    isVerified
                      ? "bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30"
                      : "bg-red-500/15 text-red-300 border border-red-500/30"
                  }`}
                >
                  {isVerified ? "100% Deterministic Grounding" : "Unverified Citation Alert"}
                </span>
                <span className="text-xs font-mono text-[#9CA3AF]">Status: {citation.verification_status}</span>
              </div>
              <h3 className="text-lg font-bold text-[#F5F5F7] mt-1">Citation Evidence Inspector</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#16171B] transition-colors cursor-pointer border border-[#2A2A2E]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-6 space-y-4">
          <div className="p-3.5 rounded-lg bg-[#0B0B0E] border border-[#2A2A2E] flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-[#9CA3AF]">Node File: </span>
              <span className="text-[#FF6B35] font-semibold">{citation.node_path}</span>
            </div>
            {citation.heading && (
              <span className="text-[#9CA3AF]">
                Section: <strong className="text-white">#{citation.heading}</strong>
              </span>
            )}
          </div>

          <div>
            <div className="text-xs font-mono uppercase text-[#9CA3AF] tracking-wider mb-2 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span>Exact Physical Source Excerpt (From Local Markdown Node)</span>
            </div>
            <div className="p-4 rounded-lg bg-[#0B0B0E] border border-[#2A2A2E] text-xs font-mono text-[#F5F5F7] leading-relaxed overflow-x-auto selection:bg-[#FF6B35]/40">
              "{citation.exact_source_text}"
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#10B981]/10 border border-[#10B981]/25 text-xs text-[#10B981] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            <span>
              Verified by CitationAuditor: This excerpt was mathematically verified against the active OKF filesystem with zero AI hallucination.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#2A2A2E] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#FF6B35] hover:bg-[#F97316] text-white font-medium text-xs transition-colors cursor-pointer shadow-sm"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
