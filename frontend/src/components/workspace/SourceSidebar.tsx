import React, { useState, useRef } from "react";
import {
  FileText,
  FileSpreadsheet,
  FileCode,
  FilePlus,
  Trash2,
  RefreshCw,
  Search,
  CheckSquare,
  Square,
  SlidersHorizontal,
  ChevronDown,
  Globe,
  ArrowRight,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  UploadCloud,
  Loader2,
  AlertCircle
} from "lucide-react";
import { SourceDocument } from "../../types/workspace";
import { DocumentService } from "../../services/documentService";

interface SourceSidebarProps {
  documents: SourceDocument[];
  selectedDocIds: string[];
  onToggleSelectDoc: (id: string) => void;
  onSelectAllDocs: (selectAll: boolean) => void;
  onRefreshDocs: () => Promise<void>;
  onPreviewDoc: (doc: SourceDocument) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const SourceSidebar: React.FC<SourceSidebarProps> = ({
  documents,
  selectedDocIds,
  onToggleSelectDoc,
  onSelectAllDocs,
  onRefreshDocs,
  onPreviewDoc,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredDocs = documents.filter((d) =>
    d.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allSelected =
    documents.length > 0 && selectedDocIds.length === documents.length;

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadError(null);

    try {
      const fileArray = Array.from(files);
      await DocumentService.uploadDocuments(fileArray);
      await onRefreshDocs();
      setShowUploadModal(false);
    } catch (err: any) {
      setUploadError(err.message || "Upload and OKF compilation failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (e: React.MouseEvent, docId: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to remove this source and its generated OKF nodes?")) {
      return;
    }
    try {
      await DocumentService.deleteDocument(docId);
      await onRefreshDocs();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  if (isCollapsed) {
    return (
      <div className="h-full bg-[#18181A] border border-[#27272A] rounded-[24px] flex flex-col items-center py-4 gap-3 w-12 shrink-0 select-none">
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#232326] transition-colors"
          title="Expand Sources Sidebar"
        >
          <PanelLeftOpen className="w-5 h-5" />
        </button>
        <button
          onClick={() => setShowUploadModal(true)}
          className="p-2 rounded-full bg-[#232326] text-[#E5E7EB] hover:bg-[#2A2A2F] transition-colors"
          title="Add Sources"
        >
          <Plus className="w-4 h-4" />
        </button>
        <div className="text-[10px] text-[#71717A] font-mono rotate-90 mt-10 tracking-widest uppercase">
          SOURCES ({documents.length})
        </div>
      </div>
    );
  }

  return (
    <aside className="h-full bg-[#18181A] border border-[#27272A] rounded-[24px] flex flex-col overflow-hidden select-none p-4">
      {/* Top Header: "Sources" + Collapse Icon */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-medium text-white tracking-normal">
          Sources
        </h2>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#232326] transition-colors"
          title="Collapse Sources"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* Pill Buttons: + Sources and + Note */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-full bg-[#232326] hover:bg-[#2A2A2F] text-xs font-normal text-[#E5E7EB] hover:text-white border border-[#2E2E33] transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 text-[#9CA3AF]" />
          <span>+ Sources</span>
        </button>
        <button
          onClick={() => {
            const noteName = prompt("Enter a note or procedure title:");
            if (noteName) {
              const blob = new Blob([`# ${noteName}\n\nTechnician quick notes.`], { type: "text/markdown" });
              const file = new window.File([blob], `${noteName.toLowerCase().replace(/\s+/g, "_")}.md`, { type: "text/markdown" });
              handleFileUpload([file] as any);
            }
          }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-full bg-[#232326] hover:bg-[#2A2A2F] text-xs font-normal text-[#E5E7EB] hover:text-white border border-[#2E2E33] transition-colors"
        >
          <FilePlus className="w-3.5 h-3.5 text-[#9CA3AF]" />
          <span>+ Note</span>
        </button>
      </div>

      {/* Search Bar matching NotebookLM Pill Design */}
      <div className="rounded-[20px] bg-[#1E1F23] border border-[#2E3036] p-2 mb-4 space-y-2">
        <input
          type="text"
          placeholder="Search sources or manuals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent border-none px-2 text-xs text-white placeholder-[#71717A] focus:outline-none"
        />
        <div className="flex items-center justify-between pt-1 border-t border-[#2A2B31] px-1 text-[11px] text-[#9CA3AF]">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 hover:text-white cursor-pointer">
              <Globe className="w-3 h-3 text-[#9CA3AF]" />
              <ChevronDown className="w-2.5 h-2.5 text-[#71717A]" />
            </span>
            <span className="flex items-center gap-1 hover:text-white cursor-pointer" onClick={() => onRefreshDocs()}>
              <RefreshCw className="w-3 h-3 text-[#9CA3AF]" />
              <ChevronDown className="w-2.5 h-2.5 text-[#71717A]" />
            </span>
          </div>
          <button
            onClick={() => onRefreshDocs()}
            className="w-5 h-5 rounded-full bg-[#2A2B31] hover:bg-[#34353D] flex items-center justify-center text-[#E5E7EB] transition-colors"
          >
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Filter Icon & Select All Bar */}
      <div className="flex items-center justify-between pb-2.5 mb-2 text-xs text-[#9CA3AF]">
        <button
          onClick={() => setSearchTerm("")}
          className="p-1 rounded text-[#9CA3AF] hover:text-white transition-colors"
          title="Filter / Sort"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onSelectAllDocs(!allSelected)}
          className="flex items-center gap-1.5 hover:text-white transition-colors text-xs"
        >
          <span>Select all</span>
          {allSelected ? (
            <CheckSquare className="w-3.5 h-3.5 text-white" />
          ) : (
            <Square className="w-3.5 h-3.5 text-[#71717A]" />
          )}
        </button>
      </div>

      {/* Source Cards List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        {filteredDocs.length === 0 ? (
          <div className="h-36 flex flex-col items-center justify-center text-center p-3">
            <UploadCloud className="w-7 h-7 text-[#71717A] mb-2" />
            <p className="text-xs text-[#9CA3AF]">No sources in library.</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="mt-1.5 text-xs text-[#3B82F6] hover:underline"
            >
              Upload PDF Manual
            </button>
          </div>
        ) : (
          filteredDocs.map((doc) => {
            const isSelected = selectedDocIds.includes(doc.id);
            return (
              <div
                key={doc.id}
                onClick={() => onPreviewDoc(doc)}
                className={`group flex items-center justify-between gap-2.5 p-2 rounded-xl cursor-pointer transition-colors ${
                  isSelected ? "bg-[#232326]/80 text-white" : "hover:bg-[#232326]/50 text-[#D1D5DB]"
                }`}
              >
                {/* PDF / File Icon */}
                <div className="w-6 h-6 rounded-md bg-[#2563EB]/20 border border-[#3B82F6]/30 flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-[#60A5FA] font-mono leading-none">PDF</span>
                </div>

                {/* Source Title */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-normal truncate group-hover:text-white">
                    {doc.filename}
                  </p>
                </div>

                {/* Checkbox */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSelectDoc(doc.id);
                  }}
                  className="p-1 text-[#71717A] hover:text-white shrink-0"
                >
                  {isSelected ? (
                    <CheckSquare className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-[#71717A]" />
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#18181A] border border-[#27272A] rounded-[24px] p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-[#3B82F6]" />
              Add Sources to Knowledge Base
            </h3>
            <p className="text-xs text-[#9CA3AF] mb-4">
              Upload machinery manuals, specs, or checklists. The OmniOKF compiler converts them into structured knowledge nodes.
            </p>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileUpload(e.dataTransfer.files);
              }}
              className="border-2 border-dashed border-[#2E3036] hover:border-[#3B82F6] rounded-[20px] p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-[#141416] transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.xlsx,.md,.txt"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <UploadCloud className="w-10 h-10 text-[#3B82F6] mb-3" />
              <p className="text-sm font-semibold text-white mb-1">
                Drag & drop files here, or browse
              </p>
              <p className="text-xs text-[#9CA3AF]">
                Supports PDF, DOCX, XLSX, Markdown (.md), and TXT
              </p>
            </div>

            {isUploading && (
              <div className="mt-4 flex items-center gap-2 text-xs text-[#3B82F6] bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-xl p-3">
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>Compiling OKF knowledge graph nodes...</span>
              </div>
            )}

            {uploadError && (
              <div className="mt-4 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                disabled={isUploading}
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-full bg-[#232326] hover:bg-[#2A2A2F] text-xs text-white font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
