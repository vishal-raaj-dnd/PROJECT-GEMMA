import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  BookOpen,
  FileText,
  Wrench,
  GitBranch,
  ShieldCheck,
  Command,
  ArrowRight,
  X
} from "lucide-react";
import { useMecG } from "../../context/MecGContext";

export const GlobalSearchModal: React.FC = () => {
  const navigate = useNavigate();
  const { isSearchOpen, setIsSearchOpen, notebooks, documents } = useMecG();
  const [query, setQuery] = useState("");

  if (!isSearchOpen) return null;

  const filteredNotebooks = notebooks.filter(
    (n) =>
      n.name.toLowerCase().includes(query.toLowerCase()) ||
      n.equipmentName.toLowerCase().includes(query.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredDocs = documents.filter(
    (d) =>
      d.filename.toLowerCase().includes(query.toLowerCase()) ||
      d.equipmentCategory.toLowerCase().includes(query.toLowerCase()) ||
      d.partNumbers.some((pn) => pn.toLowerCase().includes(query.toLowerCase()))
  );

  const handleSelect = (path: string) => {
    setIsSearchOpen(false);
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-[#101318]/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#171A21] border border-[#252B35] rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#252B35] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#F2B544] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search manuals, components, fault codes, notebooks, or procedures..."
            className="w-full bg-transparent border-none text-sm font-mono text-white placeholder-[#647082] focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-md text-[#929AA6] hover:text-white hover:bg-[#252B35]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Results List */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-4">
          {/* Quick Actions */}
          {!query && (
            <div>
              <div className="text-[10px] font-mono text-[#647082] uppercase px-3 py-1 font-bold">
                Quick Navigation
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => handleSelect("/diagnose")}
                  className="p-2.5 rounded-xl bg-[#101318] hover:bg-[#252B35] border border-[#252B35] text-left flex items-center gap-2.5 text-xs text-white transition-colors cursor-pointer"
                >
                  <Wrench className="w-4 h-4 text-[#F2B544]" />
                  <span>Start New Diagnosis</span>
                </button>
                <button
                  onClick={() => handleSelect("/graph")}
                  className="p-2.5 rounded-xl bg-[#101318] hover:bg-[#252B35] border border-[#252B35] text-left flex items-center gap-2.5 text-xs text-white transition-colors cursor-pointer"
                >
                  <GitBranch className="w-4 h-4 text-[#F2B544]" />
                  <span>Knowledge Graph Map</span>
                </button>
                <button
                  onClick={() => handleSelect("/library")}
                  className="p-2.5 rounded-xl bg-[#101318] hover:bg-[#252B35] border border-[#252B35] text-left flex items-center gap-2.5 text-xs text-white transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#F2B544]" />
                  <span>Document Library</span>
                </button>
                <button
                  onClick={() => handleSelect("/safety")}
                  className="p-2.5 rounded-xl bg-[#101318] hover:bg-[#252B35] border border-[#252B35] text-left flex items-center gap-2.5 text-xs text-white transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#279C70]" />
                  <span>OSHA LOTO Compliance</span>
                </button>
              </div>
            </div>
          )}

          {/* Notebooks matches */}
          {filteredNotebooks.length > 0 && (
            <div>
              <div className="text-[10px] font-mono text-[#647082] uppercase px-3 py-1 font-bold">
                Engineering Notebooks ({filteredNotebooks.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredNotebooks.slice(0, 4).map((nb) => (
                  <button
                    key={nb.id}
                    onClick={() => handleSelect(`/notebooks/${nb.id}`)}
                    className="w-full p-2.5 rounded-xl hover:bg-[#252B35] text-left flex items-center justify-between text-xs text-white transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <BookOpen className="w-4 h-4 text-[#F2B544] shrink-0" />
                      <div className="min-w-0 truncate">
                        <span className="font-bold block truncate">{nb.name}</span>
                        <span className="text-[10px] font-mono text-[#929AA6]">
                          {nb.equipmentName} • {nb.docCount} sources
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#647082] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Documents matches */}
          {filteredDocs.length > 0 && (
            <div>
              <div className="text-[10px] font-mono text-[#647082] uppercase px-3 py-1 font-bold">
                Technical Documents ({filteredDocs.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredDocs.slice(0, 4).map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => handleSelect(`/library`)}
                    className="w-full p-2.5 rounded-xl hover:bg-[#252B35] text-left flex items-center justify-between text-xs text-white transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-[#929AA6] shrink-0" />
                      <div className="min-w-0 truncate">
                        <span className="font-semibold block truncate">{doc.filename}</span>
                        <span className="text-[10px] font-mono text-[#647082]">
                          {doc.equipmentCategory} • {doc.pages} pages • {doc.size}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-[#101318] text-[#F2B544] border border-[#252B35]">
                      {doc.type}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredNotebooks.length === 0 && filteredDocs.length === 0 && query && (
            <div className="p-8 text-center text-xs font-mono text-[#929AA6]">
              No notebooks or documents matching "{query}" found in local graph.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-[#252B35] bg-[#101318] flex items-center justify-between text-[11px] font-mono text-[#647082]">
          <span>Tip: Use keyboard arrow keys to navigate</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};

