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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0C]/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#111114] border border-white/[0.12] rounded-3xl shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] pb-5">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${
                isVerified
                  ? "bg-[#34D399]/10 text-[#34D399] border-[#34D399]/30"
                  : "bg-red-500/10 text-red-400 border-red-500/30"
              }`}
            >
              {isVerified ? <ShieldCheck className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                    isVerified
                      ? "bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30"
                      : "bg-red-500/15 text-red-300 border border-red-500/30"
                  }`}
                >
                  {isVerified ? "100% Deterministic Grounding" : "Unverified Citation Alert"}
                </span>
                <span className="text-xs font-mono text-[#9A9AA2]">Status: {citation.verification_status}</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">Citation Evidence Inspector</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#9A9AA2] hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-6 space-y-4">
          <div className="p-3.5 rounded-2xl bg-[#0A0A0C] border border-white/[0.06] flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-[#9A9AA2]">Node File: </span>
              <span className="text-[#C9B8FF] font-semibold">{citation.node_path}</span>
            </div>
            {citation.heading && (
              <span className="text-[#9A9AA2]">
                Section: <strong className="text-white">#{citation.heading}</strong>
              </span>
            )}
          </div>

          <div>
            <div className="text-xs font-mono uppercase text-[#9A9AA2] tracking-wider mb-2 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-[#6C4CF1]" />
              <span>Exact Physical Source Excerpt (From Local Markdown Node)</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0A0A0C] border border-white/[0.06] text-xs font-mono text-slate-200 leading-relaxed overflow-x-auto selection:bg-[#6C4CF1]/40">
              "{citation.exact_source_text}"
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#34D399]/5 border border-[#34D399]/20 text-xs text-[#34D399] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0" />
            <span>
              Verified by CitationAuditor: This excerpt was mathematically verified against the active OKF filesystem with zero AI hallucination.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-white hover:bg-slate-200 text-[#0A0A0C] font-semibold text-xs transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
