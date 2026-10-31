import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  MoreVertical,
  CheckCircle2,
  Clock,
  Trash2,
  Copy,
  Archive,
  Edit2,
  Layers,
  ArrowRight
} from "lucide-react";
import { useMecG } from "../context/MecGContext";

export const NotebooksPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    notebooks,
    setIsCreateNotebookOpen,
    deleteNotebook,
    duplicateNotebook,
    archiveNotebook,
    showToast
  } = useMecG();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"updated" | "name" | "docs">("updated");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const categories = ["All", "Hydraulics", "Power Electronics", "Turbomachinery", "Avionics"];

  const filtered = notebooks
    .filter((nb) => {
      const matchSearch =
        nb.name.toLowerCase().includes(search.toLowerCase()) ||
        nb.equipmentName.toLowerCase().includes(search.toLowerCase()) ||
        nb.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchCat = selectedCategory === "All" || nb.category === selectedCategory;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "docs") return b.docCount - a.docCount;
      return 0; // default recently updated
    });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#252B35]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F2B544]/15 text-[#F2B544] border border-[#F2B544]/30 font-bold uppercase">
              RESEARCH WORKSPACES
            </span>
            <span className="text-xs font-mono text-[#929AA6]">NotebookLM Industrial Mode</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Engineering Notebooks
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#929AA6] max-w-2xl">
            Notebook-based engineering workspaces. Attach technical manuals, schematics, and service bulletins to interrogate equipment with multimodal AI.
          </p>
        </div>

        <button
          onClick={() => setIsCreateNotebookOpen(true)}
          className="btn-amber-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ New Notebook</span>
        </button>
      </div>

      {/* Filter and Control Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl bg-[#171A21] border border-[#252B35]">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#647082] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notebooks by equipment, category, tags..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#101318] border border-[#252B35] text-xs font-mono text-white placeholder-[#647082] focus:outline-none focus:border-[#F2B544]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-colors cursor-pointer border ${
                selectedCategory === cat
                  ? "bg-[#F2B544]/15 border-[#F2B544] text-[#F2B544] font-bold"
                  : "bg-[#101318] border-[#252B35] text-[#929AA6] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort & Grid/List toggles */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg bg-[#101318] border border-[#252B35] text-xs font-mono text-[#929AA6] focus:outline-none focus:border-[#F2B544] cursor-pointer"
          >
            <option value="updated">Recently Updated</option>
            <option value="name">Sort by Name</option>
            <option value="docs">Document Count</option>
          </select>

          <div className="flex items-center p-1 rounded-lg bg-[#101318] border border-[#252B35]">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === "grid" ? "bg-[#252B35] text-[#F2B544]" : "text-[#929AA6] hover:text-white"
              }`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === "list" ? "bg-[#252B35] text-[#F2B544]" : "text-[#929AA6] hover:text-white"
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Notebook Cards (Grid View) */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((nb) => (
            <div
              key={nb.id}
              className="card-industrial-interactive p-6 flex flex-col justify-between group relative"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#101318] border border-[#252B35] text-[10px] font-mono font-bold text-[#F2B544]">
                    {nb.category}
                  </span>

                  {/* 3-Dot Actions Menu */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === nb.id ? null : nb.id);
                      }}
                      className="p-1 rounded-md text-[#929AA6] hover:text-white hover:bg-[#252B35] cursor-pointer"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenuId === nb.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 mt-1 w-44 bg-[#101318] border border-[#252B35] rounded-xl shadow-2xl p-1 z-30 animate-in fade-in duration-100"
                      >
                        <button
                          onClick={() => {
                            showToast(`Renaming "${nb.name}"`);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-[#929AA6] hover:text-white hover:bg-[#252B35] flex items-center gap-2"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Rename</span>
                        </button>
                        <button
                          onClick={() => {
                            duplicateNotebook(nb.id);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-[#929AA6] hover:text-white hover:bg-[#252B35] flex items-center gap-2"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Duplicate</span>
                        </button>
                        <button
                          onClick={() => {
                            archiveNotebook(nb.id);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-[#929AA6] hover:text-white hover:bg-[#252B35] flex items-center gap-2"
                        >
                          <Archive className="w-3.5 h-3.5" />
                          <span>Archive</span>
                        </button>
                        <div className="my-1 border-t border-[#252B35]" />
                        <button
                          onClick={() => {
                            deleteNotebook(nb.id);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div onClick={() => navigate(`/notebooks/${nb.id}`)} className="cursor-pointer">
                  <h3 className="text-base font-bold text-white group-hover:text-[#F2B544] transition-colors leading-snug">
                    {nb.name}
                  </h3>
                  <div className="text-xs font-mono text-[#F2B544] mt-1">
                    Asset: {nb.equipmentName}
                  </div>
                  <p className="mt-2 text-xs text-[#929AA6] line-clamp-2 leading-relaxed">
                    {nb.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {nb.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded bg-[#101318] text-[10px] font-mono text-[#647082] border border-[#252B35]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div
                onClick={() => navigate(`/notebooks/${nb.id}`)}
                className="mt-5 pt-3.5 border-t border-[#252B35] flex items-center justify-between text-xs font-mono text-[#647082] cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#F2B544]" />
                  <span>{nb.docCount} Documents</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#279C70]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{nb.indexingStatus}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="card-industrial overflow-hidden divide-y divide-[#252B35]">
          {filtered.map((nb) => (
            <div
              key={nb.id}
              onClick={() => navigate(`/notebooks/${nb.id}`)}
              className="p-4 sm:p-5 hover:bg-[#101318] transition-colors cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-4 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#101318] border border-[#252B35] text-[#F2B544] flex items-center justify-center shrink-0 mt-0.5">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white text-sm group-hover:text-[#F2B544] transition-colors truncate">
                      {nb.name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#252B35] text-[#F2B544]">
                      {nb.category}
                    </span>
                  </div>
                  <div className="text-xs text-[#929AA6] truncate">
                    {nb.equipmentName} • {nb.description}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0 self-end sm:self-center text-xs font-mono text-[#647082]">
                <span>{nb.docCount} docs</span>
                <span className="text-[#279C70] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {nb.indexingStatus}
                </span>
                <span>{nb.lastUpdated}</span>
                <ArrowRight className="w-4 h-4 text-[#F2B544]" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

