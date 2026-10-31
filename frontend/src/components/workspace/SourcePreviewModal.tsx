import React, { useState, useEffect } from "react";
import { X, FileText, Layers, ExternalLink, Calendar, CheckCircle, FileCode } from "lucide-react";
import { SourceDocument } from "../../types/workspace";
import { GraphService } from "../../services/graphService";

interface SourcePreviewModalProps {
  document: SourceDocument | null;
  onClose: () => void;
  onSelectGraphNode?: (nodePath: string) => void;
}

export const SourcePreviewModal: React.FC<SourcePreviewModalProps> = ({
  document,
  onClose,
  onSelectGraphNode,
}) => {
  const [selectedNodePath, setSelectedNodePath] = useState<string | null>(null);
  const [nodeDetails, setNodeDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (document && document.node_paths && document.node_paths.length > 0) {
      setSelectedNodePath(document.node_paths[0]);
    } else {
      setSelectedNodePath(null);
      setNodeDetails(null);
    }
  }, [document]);

  useEffect(() => {
    if (!selectedNodePath) return;
    setLoading(true);
    GraphService.getNodeDetails(selectedNodePath)
      .then((data) => setNodeDetails(data))
      .catch((err) => console.error("Could not fetch node details:", err))
      .finally(() => setLoading(false));
  }, [selectedNodePath]);

  if (!document) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[80vh] bg-[#141720] border border-[#202637] rounded-xl flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#202637] flex items-center justify-between bg-[#0E1118]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#8B5CF6]/20 text-[#A78BFA]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{document.filename}</h3>
              <div className="flex items-center gap-3 text-xs text-[#9AA4B8] mt-0.5">
                <span>{document.status}</span>
                <span>•</span>
                <span>{document.concepts_count} generated OKF nodes</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {new Date(document.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9AA4B8] hover:text-white hover:bg-[#1A1F2B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left Nodes List | Right Node Markdown Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Generated Nodes Column */}
          <div className="w-64 border-r border-[#202637] bg-[#141720] flex flex-col overflow-y-auto p-2 space-y-1">
            <p className="text-[11px] font-semibold text-[#9AA4B8] px-2 py-1 uppercase tracking-wider">
              Generated OKF Nodes
            </p>
            {document.node_paths.length === 0 ? (
              <p className="text-xs text-[#9AA4B8] p-2">No individual concept nodes mapped.</p>
            ) : (
              document.node_paths.map((path) => (
                <button
                  key={path}
                  onClick={() => setSelectedNodePath(path)}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-all flex items-center gap-2 ${
                    selectedNodePath === path
                      ? "bg-[#8B5CF6]/20 text-[#A78BFA] font-medium border border-[#8B5CF6]/30"
                      : "text-[#9AA4B8] hover:text-white hover:bg-[#1A1F2B]"
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{path}</span>
                </button>
              ))
            )}
          </div>

          {/* Node Content Column */}
          <div className="flex-1 bg-[#0E1118] overflow-y-auto p-6">
            {loading ? (
              <div className="h-full flex items-center justify-center text-xs text-[#9AA4B8]">
                Loading concept node details...
              </div>
            ) : nodeDetails ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4 border-b border-[#202637] pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#1A1F2B] text-[#22D3EE] border border-[#202637]">
                      {nodeDetails.category}
                    </span>
                    <h2 className="text-base font-bold text-white mt-2">
                      {nodeDetails.frontmatter?.title || nodeDetails.id}
                    </h2>
                    <p className="text-xs text-[#9AA4B8] mt-1">
                      {nodeDetails.frontmatter?.description}
                    </p>
                  </div>

                  {onSelectGraphNode && (
                    <button
                      onClick={() => {
                        onSelectGraphNode(nodeDetails.relative_path);
                        onClose();
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs font-medium text-white transition-colors shrink-0"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>View in Graph</span>
                    </button>
                  )}
                </div>

                {/* Markdown content */}
                <div className="prose prose-invert prose-xs max-w-none text-xs text-[#D1D5DB] whitespace-pre-wrap font-sans leading-relaxed">
                  {nodeDetails.content}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-[#9AA4B8]">
                <Layers className="w-8 h-8 opacity-40 mb-2" />
                <p className="text-xs">Select a generated node to inspect its content and frontmatter.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

