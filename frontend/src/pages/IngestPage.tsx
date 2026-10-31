import React from "react";
import { DocumentIngestionTab } from "../components/DocumentIngestionTab";
import { FileText, Cpu, CheckCircle2, Database, Layers } from "lucide-react";

export const IngestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#060B18] py-10">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 pb-6 border-b border-[#1D3150]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1427] border border-[#1D3150] text-xs font-mono text-[#9AAAC3] mb-3 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#3995F6] animate-pulse" />
                <span className="text-[#F5F7FC] font-semibold uppercase tracking-wider">
                  OMNIOKF MULTI-FORMAT DOCUMENT COMPILER
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#F5F7FC]">
                OEM Manuals & Ingestion Compiler
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-[#9AAAC3] max-w-3xl font-normal leading-relaxed">
                Transform thousands of pages of unstructured OEM PDF schematics and service bulletins into modular, linked Open Knowledge Format (OKF) markdown bundles.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="p-3 rounded-xl bg-[#0B1427] border border-[#1D3150] text-left">
                <div className="text-[10px] font-mono text-[#6F809A] uppercase tracking-wider">Compiler Mode</div>
                <div className="text-xs font-mono font-semibold text-[#10B981] flex items-center gap-1.5 mt-0.5">
                  <FileText className="w-3.5 h-3.5 text-[#10B981]" />
                  MarkItDown + PyMuPDF
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#0B1427] border border-[#1D3150] text-left">
                <div className="text-[10px] font-mono text-[#6F809A] uppercase tracking-wider">Cross-Linking</div>
                <div className="text-xs font-mono font-semibold text-[#3995F6] flex items-center gap-1.5 mt-0.5">
                  <Database className="w-3.5 h-3.5 text-[#3995F6]" />
                  Deterministic Relative
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Document Ingestion Component */}
        <DocumentIngestionTab />
      </div>
    </div>
  );
};

