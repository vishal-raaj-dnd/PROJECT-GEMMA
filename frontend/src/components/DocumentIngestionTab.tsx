import React, { useState } from "react";
import { FileText, Sparkles, CheckCircle2, BookOpen } from "lucide-react";
import { SAMPLE_DOCUMENTS, SampleDocumentItem } from "../data/sampleData";
import { ApiService } from "../services/api";

export const DocumentIngestionTab: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<SampleDocumentItem>(SAMPLE_DOCUMENTS[0]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilationResult, setCompilationResult] = useState<any | null>(null);

  const handleCompile = async () => {
    setIsCompiling(true);
    try {
      const blob = new Blob([selectedDoc.content], { type: "text/markdown" });
      const file = new File([blob], selectedDoc.filename, { type: "text/markdown" });
      const res = await ApiService.uploadAndCompileDocuments([file]);
      setCompilationResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <section id="documents" className="py-24 bg-[#0A0A0C] hairline-b">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#6C4CF1] font-semibold">
            OmniOKF Ingestion Compiler
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Ingest & Verify Sample Manuals
          </h2>
          <p className="mt-4 text-base text-[#9A9AA2]">
            Test the compiler directly. Select sample service manuals or upload PDFs. The engine parses layout headers,
            extracts metadata via Gemma, and generates relative Markdown cross-links.
          </p>
        </div>

        {/* 2-Column Ingestion Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sample Manual Picker */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-mono text-[#9A9AA2] uppercase tracking-wider mb-2">
              Select Sample Manual to Ingest:
            </div>

            {SAMPLE_DOCUMENTS.map((doc) => (
              <div
                key={doc.id}
                onClick={() => {
                  setSelectedDoc(doc);
                  setCompilationResult(null);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedDoc.id === doc.id
                    ? "bg-[#111114] border-[#6C4CF1] shadow-lg shadow-[#6C4CF1]/10 ring-1 ring-[#6C4CF1]/30"
                    : "bg-[#111114]/50 border-white/[0.06] hover:border-white/[0.14] hover:bg-[#111114]"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#0A0A0C] text-[#C9B8FF] border border-white/[0.08] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-white text-sm truncate">{doc.title}</h4>
                    <span className="text-[11px] font-mono text-[#9A9AA2] block mt-0.5">
                      {doc.type} • {doc.size}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={handleCompile}
              disabled={isCompiling}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-white hover:bg-slate-200 text-[#0A0A0C] font-bold text-sm tracking-tight shadow-xl transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-[#6C4CF1]" />
              {isCompiling ? "Compiling into OKF Knowledge Graph..." : "Compile Selected Document into OKF"}
            </button>
          </div>

          {/* Right Column: Document Source Viewer & Output */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#111114] border border-white/[0.08] shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase text-[#9A9AA2] tracking-wider">
                  Document Preview: <strong className="text-white">{selectedDoc.filename}</strong>
                </span>
                <span className="text-xs font-mono text-[#C9B8FF]">{selectedDoc.size}</span>
              </div>
              <pre className="p-4 rounded-2xl bg-[#0A0A0C] border border-white/[0.06] text-xs font-mono text-slate-300 max-h-[280px] overflow-y-auto leading-relaxed whitespace-pre-wrap">
                {selectedDoc.content}
              </pre>
            </div>

            {compilationResult && (
              <div className="p-6 sm:p-8 rounded-3xl bg-[#111114] border border-[#6C4CF1]/40 shadow-2xl animate-fade-in">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white tracking-tight">OKF Bundle Compilation Completed</h4>
                    <span className="text-xs font-mono text-[#9A9AA2]">
                      Processed in {compilationResult.time_taken_seconds} seconds
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center mb-5">
                  <div className="p-4 rounded-2xl bg-[#0A0A0C] border border-white/[0.06]">
                    <div className="text-xl font-bold font-mono text-[#C9B8FF]">
                      {compilationResult.concepts_created}
                    </div>
                    <div className="text-[10px] font-mono text-[#9A9AA2] uppercase mt-1">Concepts Partitioned</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#0A0A0C] border border-white/[0.06]">
                    <div className="text-xl font-bold font-mono text-[#6C4CF1]">
                      {compilationResult.links_generated}
                    </div>
                    <div className="text-[10px] font-mono text-[#9A9AA2] uppercase mt-1">Relative Links</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#0A0A0C] border border-white/[0.06]">
                    <div className="text-xl font-bold font-mono text-[#34D399]">100%</div>
                    <div className="text-[10px] font-mono text-[#9A9AA2] uppercase mt-1">MD5 Cached</div>
                  </div>
                </div>

                <div className="text-xs font-mono text-[#9A9AA2]">
                  Bundle Output: <code className="text-[#C9B8FF]">{compilationResult.output_directory}</code>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
