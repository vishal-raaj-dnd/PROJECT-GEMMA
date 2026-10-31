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
    <section id="documents" className="py-24 bg-[#0B0B0E] border-t border-[#2A2A2E]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FF6B35] font-semibold">
            OmniOKF Ingestion Compiler
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F5F5F7] leading-tight">
            Ingest & Verify OEM Manuals
          </h2>
          <p className="mt-4 text-base text-[#9CA3AF]">
            Test the compiler directly. Select sample service manuals or upload PDFs. The engine parses layout headers,
            extracts metadata, and generates deterministic Markdown graph nodes.
          </p>
        </div>

        {/* 2-Column Ingestion Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sample Manual Picker */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-mono text-[#9CA3AF] uppercase tracking-wider mb-2">
              Select Sample Manual to Ingest:
            </div>

            {SAMPLE_DOCUMENTS.map((doc) => (
              <div
                key={doc.id}
                onClick={() => {
                  setSelectedDoc(doc);
                  setCompilationResult(null);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedDoc.id === doc.id
                    ? "bg-[#121316] border-[#FF6B35] shadow-lg shadow-[#FF6B35]/10 ring-1 ring-[#FF6B35]/30"
                    : "bg-[#121316]/60 border-[#2A2A2E] hover:border-[#FF6B35]/40 hover:bg-[#121316]"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#0B0B0E] text-[#FF6B35] border border-[#2A2A2E] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-[#F5F5F7] text-sm truncate">{doc.title}</h4>
                    <span className="text-[11px] font-mono text-[#9CA3AF] block mt-0.5">
                      {doc.type} • {doc.size}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={handleCompile}
              disabled={isCompiling}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-[#FF6B35] hover:bg-[#F97316] text-white font-medium text-sm tracking-tight shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-white" />
              {isCompiling ? "Compiling into OKF Knowledge Graph..." : "Compile Selected Document into OKF"}
            </button>
          </div>

          {/* Right Column: Document Source Viewer & Output */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-xl bg-[#121316] border border-[#2A2A2E] shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase text-[#9CA3AF] tracking-wider">
                  Document Preview: <strong className="text-white">{selectedDoc.filename}</strong>
                </span>
                <span className="text-xs font-mono text-[#FF6B35]">{selectedDoc.size}</span>
              </div>
              <pre className="p-4 rounded-lg bg-[#0B0B0E] border border-[#2A2A2E] text-xs font-mono text-[#9CA3AF] max-h-[280px] overflow-y-auto leading-relaxed whitespace-pre-wrap">
                {selectedDoc.content}
              </pre>
            </div>

            {compilationResult && (
              <div className="p-6 sm:p-8 rounded-xl bg-[#121316] border border-[#FF6B35]/40 shadow-xl">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-lg bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-[#F5F5F7] tracking-tight">OKF Bundle Compilation Completed</h4>
                    <span className="text-xs font-mono text-[#9CA3AF]">
                      Processed in {compilationResult.time_taken_seconds} seconds
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center mb-5">
                  <div className="p-4 rounded-lg bg-[#0B0B0E] border border-[#2A2A2E]">
                    <div className="text-xl font-bold font-mono text-[#FF6B35]">
                      {compilationResult.concepts_created}
                    </div>
                    <div className="text-[10px] font-mono text-[#9CA3AF] uppercase mt-1">Concepts Partitioned</div>
                  </div>
                  <div className="p-4 rounded-lg bg-[#0B0B0E] border border-[#2A2A2E]">
                    <div className="text-xl font-bold font-mono text-white">
                      {compilationResult.links_generated}
                    </div>
                    <div className="text-[10px] font-mono text-[#9CA3AF] uppercase mt-1">Relative Links</div>
                  </div>
                  <div className="p-4 rounded-lg bg-[#0B0B0E] border border-[#2A2A2E]">
                    <div className="text-xl font-bold font-mono text-[#10B981]">100%</div>
                    <div className="text-[10px] font-mono text-[#9CA3AF] uppercase mt-1">MD5 Cached</div>
                  </div>
                </div>

                <div className="text-xs font-mono text-[#9CA3AF]">
                  Bundle Output: <code className="text-[#FF6B35]">{compilationResult.output_directory}</code>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
