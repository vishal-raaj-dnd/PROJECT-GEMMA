import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Sparkles, CheckCircle2, BookOpen, Upload, ArrowRight, GitBranch, Layers } from "lucide-react";
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

  const handleCustomFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setIsCompiling(true);
      try {
        const res = await ApiService.uploadAndCompileDocuments(files);
        setCompilationResult(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsCompiling(false);
      }
    }
  };

  return (
    <div id="documents" className="space-y-8">
      {/* 2-Column Ingestion Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Sample Manual Picker & Uploader (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="card-tech p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#3995F6] uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>OEM Technical Manuals</span>
              </span>
              <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#060B18] hover:bg-[#101D35] text-[11px] font-mono text-[#F5F7FC] transition-colors cursor-pointer border border-[#1D3150] hover:border-[#3995F6]/50">
                <Upload className="w-3 h-3 text-[#3995F6]" />
                <span>Upload PDF</span>
                <input 
                  type="file" 
                  accept=".pdf,.md,.txt,.docx" 
                  multiple 
                  onChange={handleCustomFileUpload} 
                  className="hidden" 
                />
              </label>
            </div>

            <div className="space-y-2.5">
              {SAMPLE_DOCUMENTS.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    setSelectedDoc(doc);
                    setCompilationResult(null);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedDoc.id === doc.id
                      ? "bg-[#101D35] border-[#3995F6] shadow-sm shadow-[#1769C2]/20"
                      : "bg-[#060B18] border-[#1D3150] hover:border-[#3995F6]/40 hover:bg-[#0B1427]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#091329] text-[#3995F6] border border-[#1D3150] flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-[#F5F7FC] text-xs truncate">{doc.title}</h4>
                      <span className="text-[10px] font-mono text-[#6F809A] block mt-0.5">
                        {doc.type} • {doc.size}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleCompile}
              disabled={isCompiling}
              className="w-full btn-primary-blue mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-xs tracking-tight shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isCompiling ? "Compiling into OKF Knowledge Graph..." : "Compile Selected Document into OKF"}
              </span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#091329] border border-[#1D3150] text-xs font-mono text-[#6F809A] leading-relaxed">
            <strong className="text-white block mb-1">OmniOKF Partitioning Pipeline:</strong>
            Extracts layout blocks, detects ISO/OSHA hazard headers, isolates torque specifications, and emits Markdown nodes with atomic relative links.
          </div>
        </div>

        {/* Right Column: Document Source Viewer & Output (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="card-tech p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1D3150] pb-3">
              <span className="text-xs font-mono uppercase text-[#9AAAC3] tracking-wider">
                Document Preview: <strong className="text-white">{selectedDoc.filename}</strong>
              </span>
              <span className="text-xs font-mono text-[#3995F6]">{selectedDoc.size}</span>
            </div>
            <pre className="p-4 rounded-xl bg-[#060B18] border border-[#1D3150] text-xs font-mono text-[#9AAAC3] max-h-[300px] overflow-y-auto leading-relaxed whitespace-pre-wrap selection:bg-[#1769C2]/40">
              {selectedDoc.content}
            </pre>
          </div>

          {compilationResult && (
            <div className="card-tech p-6 border-[#3995F6]/40 shadow-xl space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#F5F7FC] tracking-tight">
                    OKF Bundle Compilation Completed
                  </h4>
                  <span className="text-xs font-mono text-[#6F809A]">
                    Executed in {compilationResult.time_taken_seconds} seconds with zero chunk fragmentation
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-4 rounded-xl bg-[#060B18] border border-[#1D3150]">
                  <div className="text-xl font-bold font-mono text-[#3995F6]">
                    {compilationResult.concepts_created}
                  </div>
                  <div className="text-[10px] font-mono text-[#6F809A] uppercase mt-1">Concepts Partitioned</div>
                </div>
                <div className="p-4 rounded-xl bg-[#060B18] border border-[#1D3150]">
                  <div className="text-xl font-bold font-mono text-white">
                    {compilationResult.links_generated}
                  </div>
                  <div className="text-[10px] font-mono text-[#6F809A] uppercase mt-1">Relative Links</div>
                </div>
                <div className="p-4 rounded-xl bg-[#060B18] border border-[#1D3150]">
                  <div className="text-xl font-bold font-mono text-[#10B981]">100%</div>
                  <div className="text-[10px] font-mono text-[#6F809A] uppercase mt-1">Deterministic AST</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#060B18] border border-[#1D3150] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono text-[#9AAAC3]">
                <div>
                  <span>Bundle Output: </span>
                  <code className="text-[#3995F6]">{compilationResult.output_directory}</code>
                </div>
                <Link
                  to="/graph"
                  className="text-xs text-[#3995F6] hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>View in Graph</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
