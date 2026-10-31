import React, { useState } from "react";
import {
  Library,
  Upload,
  FolderPlus,
  RefreshCw,
  Search,
  FileText,
  CheckCircle2,
  MoreVertical,
  Layers,
  Sparkles,
  ExternalLink,
  Trash2,
  RotateCcw,
  Eye,
  Hash,
  ShieldCheck,
  Check,
  X
} from "lucide-react";
import { useMecG, LibraryDocument } from "../context/MecGContext";

export const KnowledgeLibraryPage: React.FC = () => {
  const { documents, uploadDocuments, reprocessDocument, deleteDocument, showToast } = useMecG();

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedDocDetails, setSelectedDocDetails] = useState<LibraryDocument | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressStage, setUploadProgressStage] = useState<number | null>(null);

  const pipelineStages = [
    "1. Uploaded",
    "2. Extracting content",
    "3. Preserving document structure",
    "4. Creating information chunks (200-500 tokens)",
    "5. Adding metadata & part numbers",
    "6. Connecting relationships",
    "7. Indexing into RAM graph",
    "8. Ready"
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setIsUploading(true);

      // Animate 8 pipeline stages
      for (let s = 0; s < pipelineStages.length; s++) {
        setUploadProgressStage(s);
        await new Promise((r) => setTimeout(r, 260));
      }

      await uploadDocuments(files, "Industrial Machinery");
      setIsUploading(false);
      setUploadProgressStage(null);
    }
  };

  const filteredDocs = documents.filter((d) => {
    const matchSearch =
      d.filename.toLowerCase().includes(search.toLowerCase()) ||
      d.equipmentCategory.toLowerCase().includes(search.toLowerCase()) ||
      d.partNumbers.some((pn) => pn.toLowerCase().includes(search.toLowerCase()));
    const matchType = selectedType === "All" || d.type === selectedType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#252B35]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F2B544]/15 text-[#F2B544] border border-[#F2B544]/30 font-bold uppercase">
              DOCUMENT MANAGEMENT
            </span>
            <span className="text-xs font-mono text-[#929AA6]">MarkItDown + PyMuPDF Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Knowledge Library
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#929AA6] max-w-2xl">
            Import, organize and maintain your engineering documentation. Supports PDF, DOCX, XLSX, PPTX, HTML and Markdown with atomic layout preservation.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <label className="btn-amber-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md">
            <Upload className="w-4 h-4" />
            <span>+ Upload Documents</span>
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.xlsx,.pptx,.html,.md"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <button
            onClick={() => showToast("Refreshing index across local RAM graph...")}
            className="btn-slate-secondary p-2 rounded-xl text-white cursor-pointer"
            title="Refresh Index"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 8-Stage Processing Pipeline Visualization (during upload or active indexing) */}
      {isUploading && uploadProgressStage !== null && (
        <div className="card-industrial p-6 space-y-4 border-[#F2B544]/60 bg-[#171A21] animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#F2B544] font-bold">8-STAGE INGESTION PIPELINE</span>
            <span className="text-white">
              Stage {uploadProgressStage + 1} of {pipelineStages.length}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {pipelineStages.map((stg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg text-center text-[10px] font-mono border transition-all ${
                  i < uploadProgressStage
                    ? "bg-[#279C70]/15 border-[#279C70]/40 text-[#279C70]"
                    : i === uploadProgressStage
                    ? "bg-[#F2B544]/20 border-[#F2B544] text-[#F2B544] font-bold animate-pulse"
                    : "bg-[#101318] border-[#252B35] text-[#647082]"
                }`}
              >
                {stg}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#171A21] border border-[#252B35]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#647082] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents by filename, part number, equipment category..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#101318] border border-[#252B35] text-xs font-mono text-white placeholder-[#647082] focus:outline-none focus:border-[#F2B544]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["All", "PDF", "MD", "DOCX", "XLSX"].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer border ${
                selectedType === t
                  ? "bg-[#F2B544]/15 border-[#F2B544] text-[#F2B544] font-bold"
                  : "bg-[#101318] border-[#252B35] text-[#929AA6] hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Document Table (Section 6) */}
      <div className="card-industrial overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#101318] text-[#929AA6] uppercase text-[10px] border-b border-[#252B35]">
              <tr>
                <th className="p-3.5 pl-6">File Name</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Size</th>
                <th className="p-3.5">Pages</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Hash</th>
                <th className="p-3.5 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252B35]">
              {filteredDocs.map((doc) => (
                <tr
                  key={doc.id}
                  onClick={() => setSelectedDocDetails(doc)}
                  className="hover:bg-[#101318]/60 transition-colors cursor-pointer group"
                >
                  <td className="p-3.5 pl-6 font-bold text-white flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-[#F2B544] shrink-0" />
                    <span className="truncate max-w-xs">{doc.filename}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#101318] border border-[#252B35] text-[#F2B544]">
                      {doc.type}
                    </span>
                  </td>
                  <td className="p-3.5 text-[#929AA6]">{doc.size}</td>
                  <td className="p-3.5 text-[#929AA6]">{doc.pages}p</td>
                  <td className="p-3.5 text-white">{doc.equipmentCategory}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#279C70]/15 text-[#279C70] border border-[#279C70]/30 font-bold flex items-center gap-1 w-max">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{doc.processingStatus}</span>
                    </span>
                  </td>
                  <td className="p-3.5 text-[#647082] text-[10px] truncate max-w-[100px]">
                    {doc.hash}
                  </td>
                  <td className="p-3.5 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedDocDetails(doc)}
                        className="p-1 rounded text-[#929AA6] hover:text-white"
                        title="View Document Details & Chunks"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => reprocessDocument(doc.id)}
                        className="p-1 rounded text-[#929AA6] hover:text-[#F2B544]"
                        title="Reprocess"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="p-1 rounded text-[#929AA6] hover:text-red-400"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DOCUMENT DETAILS MODAL / DRAWER (Section 6) */}
      {selectedDocDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101318]/85 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-[#171A21] border border-[#252B35] rounded-2xl p-6 sm:p-7 max-h-[85vh] overflow-y-auto space-y-5">
            <div className="flex items-start justify-between border-b border-[#252B35] pb-4">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#F2B544]/15 text-[#F2B544] uppercase font-bold">
                  {selectedDocDetails.type} • {selectedDocDetails.size}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedDocDetails.filename}</h3>
                <span className="text-xs font-mono text-[#647082]">MD5 Hash: {selectedDocDetails.hash}</span>
              </div>
              <button onClick={() => setSelectedDocDetails(null)} className="text-[#929AA6] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chunk Structure (200-500 tokens) */}
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase text-[#F2B544] font-bold">
                Partitioned Chunks (200–500 Token Architecture):
              </div>
              <div className="space-y-2">
                {selectedDocDetails.chunks.map((chk) => (
                  <div key={chk.id} className="p-3.5 rounded-xl bg-[#101318] border border-[#252B35] space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-white font-bold">#{chk.heading}</span>
                      <span className="text-[#647082]">{chk.tokens} Tokens</span>
                    </div>
                    <p className="text-[11px] font-mono text-[#929AA6] leading-relaxed">{chk.preview}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Extracted Text */}
            <div className="space-y-1.5">
              <span className="text-xs font-mono uppercase text-[#929AA6] font-bold">Extracted Text Content:</span>
              <pre className="p-3.5 rounded-xl bg-[#101318] border border-[#252B35] text-xs font-mono text-[#F3F4F6] whitespace-pre-wrap max-h-40 overflow-y-auto">
                {selectedDocDetails.extractedText}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedDocDetails(null)}
                className="btn-amber-primary px-5 py-2 rounded-xl text-xs font-bold"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

