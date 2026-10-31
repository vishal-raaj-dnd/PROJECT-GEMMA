import React, { useState, useEffect, useRef } from "react";
import { TopToolbar } from "../components/workspace/TopToolbar";
import { useProcessing } from "../context/ProcessingContext";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Trash2,
  RefreshCw,
  ExternalLink,
  Layers,
  Database,
  Terminal,
  X,
  FileCheck,
  Check,
  Search,
  Sparkles
} from "lucide-react";

interface DocumentItem {
  id: string;
  filename: string;
  file_size: number;
  mime_type: string;
  status: string;
  concepts_count: number;
  node_paths: string[];
  created_at: string;
  error?: string | null;
}

export const IngestPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [isCompiling, setIsCompiling] = useState(false);
  const { setProcessing } = useProcessing();

  useEffect(() => {
    setProcessing(isCompiling, "OmniOKF Compiler parsing and generating knowledge nodes...");
  }, [isCompiling, setProcessing]);
  const [searchFilter, setSearchFilter] = useState("");
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "[SYSTEM] OmniOKF Ingestion Engine initialized.",
    "[STATUS] Ready to process raw OEM manuals, schematics & service bulletins.",
  ]);

  // Modals
  const [inspectDoc, setInspectDoc] = useState<DocumentItem | null>(null);
  const [docToDelete, setDocToDelete] = useState<DocumentItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Documents
  const fetchDocuments = async () => {
    setIsLoadingDocs(true);
    try {
      const res = await fetch("/api/documents");
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (err) {
      console.warn("Could not fetch documents:", err);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const addLog = (msg: string) => {
    setConsoleLogs((prev) => [...prev.slice(-30), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setStagedFiles((prev) => [...prev, ...filesArray]);
      addLog(`Staged ${filesArray.length} file(s) for OKF compilation.`);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      setStagedFiles((prev) => [...prev, ...filesArray]);
      addLog(`Dropped ${filesArray.length} file(s) into compilation queue.`);
    }
  };

  const removeStagedFile = (idx: number) => {
    setStagedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCompileStaged = async () => {
    if (stagedFiles.length === 0) return;
    setIsCompiling(true);
    addLog(`Uploading and compiling ${stagedFiles.length} file(s)...`);

    try {
      const formData = new FormData();
      stagedFiles.forEach((file) => {
        formData.append("files", file);
      });

      const res = await fetch("/api/ingest/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const result = await res.json();
        addLog(`Compilation complete! Processed ${result.total_processed} files into ${result.total_nodes_generated} nodes.`);
        setStagedFiles([]);
        await fetchDocuments();
      } else {
        addLog(`Compilation warning: Server returned status ${res.status}`);
      }
    } catch (err: any) {
      addLog(`Compilation error: ${err.message || "Failed to reach server"}`);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleCompileAllExisting = async () => {
    setIsCompiling(true);
    addLog("Re-compiling all stored documents from raw directory...");
    try {
      const res = await fetch("/api/ingest/compile-all", { method: "POST" });
      if (res.ok) {
        const result = await res.json();
        addLog(`Re-compilation finished! ${result.total_nodes_generated} total OKF nodes generated.`);
        await fetchDocuments();
      }
    } catch (err: any) {
      addLog(`Re-compilation error: ${err.message}`);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleDeleteDocument = async () => {
    if (!docToDelete) return;
    setIsDeleting(true);
    addLog(`Deleting document ${docToDelete.filename} and associated OKF nodes...`);

    try {
      const res = await fetch(`/api/documents/${docToDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        addLog(`Document ${docToDelete.filename} deleted successfully.`);
        setDocToDelete(null);
        await fetchDocuments();
      }
    } catch (err: any) {
      addLog(`Failed to delete document: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filteredDocs = documents.filter((d) =>
    d.filename.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col bg-[#0B0B0C] text-[#F5F7FF] overflow-hidden select-none">
      {/* Persistent Navigation Toolbar */}
      <TopToolbar activeModule="ingest" title="OEM Ingestion & Compiler Studio" />

      {/* Floating Island Layout */}
      <main className="flex-1 p-3 pt-1 flex gap-3 min-h-0 overflow-hidden">
        {/* Left Island: Upload Engine & Compilation Terminal */}
        <section className="w-[420px] lg:w-[460px] flex-shrink-0 bg-[#18181A] rounded-[24px] border border-[#27272A] p-4 flex flex-col justify-between overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            {/* Header */}
            <div className="pb-3 border-b border-[#27272A] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#34D399]/10 border border-[#34D399]/30 flex items-center justify-center">
                  <UploadCloud className="w-4 h-4 text-[#34D399]" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider">OmniOKF Compiler</h2>
                  <p className="text-[10px] text-[#9CA3AF]">MarkItDown + PyMuPDF AST Parser</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/20 text-[10px] font-mono">
                Active Edge
              </span>
            </div>

            {/* Dropzone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#27272A] hover:border-[#34D399]/50 rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer bg-[#141518] hover:bg-[#1A1B20] transition-all"
            >
              <UploadCloud className="w-8 h-8 text-[#9CA3AF] mb-2" />
              <p className="text-xs text-white font-semibold">
                Click to browse or drag & drop OEM documents
              </p>
              <p className="text-[10px] text-[#6B7280] mt-1">
                Supports PDF, DOCX, XLSX, TXT, and Markdown
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                accept=".pdf,.docx,.xlsx,.txt,.md"
                onChange={handleFileSelect}
              />
            </div>

            {/* Staged Files Queue */}
            {stagedFiles.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-[11px] font-medium text-[#9CA3AF] mb-1.5">
                  <span>Compilation Staging Queue ({stagedFiles.length})</span>
                  <button
                    onClick={() => setStagedFiles([])}
                    className="text-[10px] text-rose-400 hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
                  {stagedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-[#141518] border border-[#27272A] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 truncate max-w-[300px]">
                        <FileText className="w-3.5 h-3.5 text-[#34D399] flex-shrink-0" />
                        <span className="truncate text-white text-[11px]">{file.name}</span>
                        <span className="text-[10px] font-mono text-[#6B7280]">
                          ({formatFileSize(file.size)})
                        </span>
                      </div>
                      <button
                        onClick={() => removeStagedFile(idx)}
                        className="text-[#6B7280] hover:text-rose-400 p-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleCompileStaged}
                disabled={isCompiling || stagedFiles.length === 0}
                className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#10B981] via-[#22D3EE] to-[#3B82F6] text-white text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-40 cursor-pointer"
              >
                {isCompiling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Compiling into OKF Bundles...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Compile Staged Files ({stagedFiles.length})</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCompileAllExisting}
                disabled={isCompiling}
                className="w-full py-2 rounded-full bg-[#1E1F24] hover:bg-[#25262E] text-[#9CA3AF] hover:text-white border border-[#27272A] text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-Compile All Stored Manuals</span>
              </button>
            </div>

            {/* Execution Console Terminal */}
            <div className="bg-[#101114] border border-[#27272A] rounded-2xl p-3 font-mono text-[10px] text-[#A1A1AA] space-y-1 h-36 overflow-y-auto custom-scrollbar">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold border-b border-[#27272A] pb-1 mb-1">
                <Terminal className="w-3 h-3" />
                <span>COMPILATION CONSOLE</span>
              </div>
              {consoleLogs.map((log, i) => (
                <div key={i} className="leading-tight">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Island: Ingested Knowledge Catalog Table */}
        <section className="flex-1 bg-[#18181A] rounded-[24px] border border-[#27272A] p-5 flex flex-col overflow-hidden">
          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#27272A]">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-[#34D399]" />
                <span>Ingested Source Catalog ({documents.length} Manuals)</span>
              </h3>
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                Processed into linked Open Knowledge Format markdown nodes with SQLite provenance.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#6B7280]" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter manuals..."
                  className="bg-[#141518] border border-[#27272A] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#22D3EE] transition-colors"
                />
              </div>

              <button
                onClick={fetchDocuments}
                className="p-2 rounded-xl bg-[#141518] border border-[#27272A] text-[#9CA3AF] hover:text-white hover:bg-[#1E1F24] transition-colors cursor-pointer"
                title="Refresh List"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDocs ? "animate-spin text-[#22D3EE]" : ""}`} />
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-y-auto custom-scrollbar mt-3">
            {isLoadingDocs ? (
              <div className="h-64 flex flex-col items-center justify-center text-xs text-[#9CA3AF]">
                <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-2" />
                <span>Loading Knowledge Catalog...</span>
              </div>
            ) : filteredDocs.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-[#6B7280] text-xs">
                <FileText className="w-8 h-8 mb-2 opacity-50" />
                <p>No documents found matching your filter.</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] font-mono text-[#6B7280] uppercase border-b border-[#27272A]">
                  <tr>
                    <th className="py-2.5 px-3">Document Title</th>
                    <th className="py-2.5 px-3">Format</th>
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3">Concepts</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27272A]">
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-[#141518]/60 transition-colors group">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                          <span className="truncate max-w-[280px]">{doc.filename}</span>
                        </div>
                        <div className="text-[10px] font-mono text-[#6B7280] mt-0.5">
                          ID: {doc.id}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-[#141518] border border-[#27272A] font-mono text-[10px] text-[#9CA3AF] uppercase">
                          {doc.filename.split(".").pop()}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-mono text-[#9CA3AF] text-[11px]">
                        {formatFileSize(doc.file_size)}
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono text-[10px] font-bold">
                          {doc.concepts_count} nodes
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                            doc.status === "READY"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {doc.status}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setInspectDoc(doc)}
                            className="px-2.5 py-1 rounded-lg bg-[#1E1F24] hover:bg-[#25262E] text-[#22D3EE] border border-[#27272A] hover:border-[#22D3EE] text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            Inspect Nodes
                          </button>
                          <button
                            onClick={() => setDocToDelete(doc)}
                            className="p-1 rounded-lg text-[#6B7280] hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Delete Document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>

      {/* Generated Nodes Inspector Modal */}
      {inspectDoc && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#18181A] border border-[#27272A] rounded-[24px] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272A] mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white truncate max-w-[340px]">
                  Generated OKF Nodes ({inspectDoc.filename})
                </h3>
              </div>
              <button
                onClick={() => setInspectDoc(null)}
                className="text-[#9CA3AF] hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-[#9CA3AF] leading-relaxed">
                The OmniOKF parser segmented this manual into {inspectDoc.node_paths.length || inspectDoc.concepts_count} discrete, cross-referenced Markdown concepts:
              </p>

              <div className="max-h-56 overflow-y-auto custom-scrollbar space-y-1.5 pr-1">
                {inspectDoc.node_paths && inspectDoc.node_paths.length > 0 ? (
                  inspectDoc.node_paths.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-[#141518] border border-[#27272A] font-mono text-[11px] text-[#22D3EE] flex items-center justify-between"
                    >
                      <span className="truncate">{p}</span>
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-[#141518] rounded-xl border border-[#27272A] text-[#9CA3AF] text-center">
                    Nodes generated and linked directly into in-memory NetworkX graph.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setInspectDoc(null)}
                className="px-5 py-2 rounded-full bg-[#22D3EE] hover:bg-[#06B6D4] text-black text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Document Confirmation Modal */}
      {docToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#18181A] border border-[#27272A] rounded-[24px] p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400 mb-3">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-sm font-bold text-white">Confirm Document Deletion</h3>
            </div>

            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Are you sure you want to delete <span className="text-white font-semibold">{docToDelete.filename}</span>?
              This will remove the raw document and un-index its generated OKF nodes from the active knowledge graph.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDocToDelete(null)}
                className="px-4 py-2 rounded-full bg-[#1E1F24] hover:bg-[#25262E] text-white text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteDocument}
                disabled={isDeleting}
                className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? "Deleting..." : "Delete Permanently"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
