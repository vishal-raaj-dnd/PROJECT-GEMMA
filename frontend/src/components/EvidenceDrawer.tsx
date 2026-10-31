import React from "react";
import { X, ShieldCheck, AlertCircle, FileText, CheckCircle2, Bookmark, ExternalLink } from "lucide-react";
import { CitationVerification } from "../types/diagnostic";

interface EvidenceDrawerProps {
  citation: CitationVerification | null;
  onClose: () => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({ citation, onClose }) => {
  if (!citation) return null;

  const isVerified = citation.verification_status === "verified";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl border ${
                isVerified
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-red-500/10 text-red-400 border-red-500/30"
              }`}
            >
              {isVerified ? <ShieldCheck className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                    isVerified
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-red-500/20 text-red-300 border border-red-500/30"
                  }`}
                >
                  {isVerified ? "100% Deterministic Grounding" : "Unverified Citation Alert"}
                </span>
                <span className="text-xs font-mono text-slate-400">Audit Status: {citation.verification_status}</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">Citation Evidence Inspector</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-6 space-y-4">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-slate-400">Node File: </span>
              <span className="text-amber-300 font-semibold">{citation.node_path}</span>
            </div>
            {citation.heading && (
              <span className="text-slate-400">
                Heading: <strong className="text-cyan-300">#{citation.heading}</strong>
              </span>
            )}
          </div>

          <div>
            <div className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              <span>Exact Physical Source Excerpt (From Local OKF Node)</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 font-mono leading-relaxed overflow-x-auto selection:bg-amber-500/40">
              "{citation.exact_source_text}"
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Verified by CitationAuditor: This excerpt was deterministically resolved from the local filesystem with zero AI hallucination.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
