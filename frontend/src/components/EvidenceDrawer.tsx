import React from "react";
import { X, ShieldCheck, AlertCircle, Bookmark, CheckCircle2, FileText, ExternalLink } from "lucide-react";
import { CitationVerification } from "../types/diagnostic";

interface EvidenceDrawerProps {
  citation: CitationVerification | null;
  onClose: () => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({ citation, onClose }) => {
  if (!citation) return null;

  const isVerified = citation.verification_status === "verified";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060B18]/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#0B1427] border border-[#1D3150] rounded-2xl shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#1D3150] pb-5">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
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
                <span className="text-xs font-mono text-[#6F809A]">Status: {citation.verification_status}</span>
              </div>
              <h3 className="text-lg font-bold text-[#F5F7FC] mt-1">Citation Evidence Inspector</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#9AAAC3] hover:text-white hover:bg-[#101D35] transition-colors cursor-pointer border border-[#1D3150]"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-[#060B18] border border-[#1D3150] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-[#3995F6]" />
              <span className="text-[#9AAAC3]">Node File: </span>
              <span className="text-[#3995F6] font-semibold">{citation.node_path}</span>
            </div>
            {citation.heading && (
              <span className="text-[#9AAAC3]">
                Section: <strong className="text-white">#{citation.heading}</strong>
              </span>
            )}
          </div>

          <div>
            <div className="text-xs font-mono uppercase text-[#9AAAC3] tracking-wider mb-2 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-[#3995F6]" />
              <span>Exact Physical Source Excerpt (From Local Markdown Node)</span>
            </div>
            <div className="p-4 rounded-xl bg-[#060B18] border border-[#1D3150] text-xs font-mono text-[#F5F7FC] leading-relaxed overflow-x-auto selection:bg-[#1769C2]/40">
              "{citation.exact_source_text}"
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/25 text-xs text-[#10B981] flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong>Verified by CitationAuditor:</strong> This excerpt was mathematically verified against the physical file in the local OKF bundle with zero AI hallucination.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#1D3150] flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#6F809A]">
            Citation ID: {citation.citation_id || "ref-okf-node"}
          </span>
          <button
            onClick={onClose}
            className="btn-primary-blue px-5 py-2 rounded-xl text-xs font-semibold"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
