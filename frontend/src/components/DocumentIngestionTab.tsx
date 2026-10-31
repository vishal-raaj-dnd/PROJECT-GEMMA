import React, { useState } from "react";
import { FileText, Upload, Sparkles, CheckCircle2, ArrowRight, BookOpen, Layers, Clock } from "lucide-react";
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
    <section id="documents" className="py-20 border-b border-slate-800/60 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-medium mb-3">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>OmniOKF Document Compiler</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Convert Messy Manuals to Linked Knowledge Graphs
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Upload OEM PDFs, schematics, or Word documents. The compiler parses hierarchical headers, enriches nodes with
            Gemma frontmatter metadata, and computes deterministic relative links.
          </p>
        </div>

        {/* 2-Column Ingestion Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sample Manual Picker & Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
              Select Sample Document to Ingest:
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
                    ? "bg-slate-900 border-cyan-500/70 ring-1 ring-cyan-500/30"
                    : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-800 text-cyan-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{doc.title}</h4>
                    <span className="text-[11px] font-mono text-slate-400">{doc.type} • {doc.size}</span>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={handleCompile}
              disabled={isCompiling}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              {isCompiling ? "Compiling into OKF Bundle..." : "Compile Selected Document into OKF"}
            </button>
          </div>

          {/* Right Column: Document Source Viewer & Compiler Output */}
          <div className="lg:col-span-7 space-y-6">
            {/* Raw Document Viewer */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                  Raw Document Source: <strong className="text-white">{selectedDoc.filename}</strong>
                </span>
                <span className="text-xs font-mono text-cyan-400">{selectedDoc.size}</span>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 max-h-[280px] overflow-y-auto leading-relaxed whitespace-pre-wrap">
                {selectedDoc.content}
              </pre>
            </div>

            {/* Compilation Results Card */}
            {compilationResult && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">OKF Bundle Compilation Completed</h4>
                    <span className="text-xs font-mono text-slate-400">
                      Processed in {compilationResult.time_taken_seconds} seconds
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center mb-4">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-lg font-bold font-mono text-amber-400">
                      {compilationResult.concepts_created}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">Concepts Split</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-lg font-bold font-mono text-cyan-400">
                      {compilationResult.links_generated}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">Relative Links</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-lg font-bold font-mono text-emerald-400">
                      100%
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">MD5 Cached</div>
                  </div>
                </div>

                <div className="text-xs font-mono text-slate-400">
                  Bundle Path: <code className="text-amber-300">{compilationResult.output_directory}</code>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
