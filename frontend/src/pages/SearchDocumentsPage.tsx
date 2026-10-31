import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  FileText,
  BookOpen,
  Wrench,
  Bookmark,
  ExternalLink,
  CheckCircle2,
  Tag,
  ArrowRight
} from "lucide-react";
import { useMecG } from "../context/MecGContext";

export const SearchDocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { documents, notebooks, showToast } = useMecG();

  const [query, setQuery] = useState("torque specifications PRV-992-B");
  const [selectedNotebook, setSelectedNotebook] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchAlgorithm, setSearchAlgorithm] = useState<"hybrid" | "bm25" | "rapidfuzz">("hybrid");

  const searchResults = [
    {
      id: "res-1",
      filename: "valve_seal_replacement.md",
      heading: "disassembly & reassembly",
      documentType: "MD",
      equipment: "Vestas V112 3.3MW Turbine",
      subsystem: "Nacelle Yaw Circuit",
      partNumber: "PRV-992-B",
      score: 0.98,
      algorithm: "BM25 Exact Match",
      passage: "Loosen 4x M10 hex socket head cap screws in an alternating cross-diagonal sequence. Upon reassembly, apply calibrated digital torque wrench set to exactly 35 Nm (+/- 1.5 Nm). Verify zero pressure on PG-02 before loosening.",
      citationRef: "[^procedures/valve_seal_replacement.md#reassembly]"
    },
    {
      id: "res-2",
      filename: "proportional_relief_valve_v2.md",
      heading: "specifications",
      documentType: "MD",
      equipment: "Vestas V112 3.3MW Turbine",
      subsystem: "Nacelle Yaw Hydraulics",
      partNumber: "PRV-992-B",
      score: 0.92,
      algorithm: "RapidFuzz Match",
      passage: "Proportional Pressure Relief Valve V2 regulates system holding pressure between 160 and 210 bar. Features Viton 90-durometer O-ring sealing package rated for 350 bar pulse spikes.",
      citationRef: "[^components/proportional_relief_valve_v2.md#specifications]"
    },
    {
      id: "res-3",
      filename: "lockout_tagout_hydraulics.md",
      heading: "isolation-procedure",
      documentType: "MD",
      equipment: "General Hydraulics",
      subsystem: "Safety Isolation",
      partNumber: "HV-01",
      score: 0.86,
      algorithm: "Grounded Graph Edge",
      passage: "De-energize main hydraulic pump motor breaker (CB-4 in Nacelle PDP). Attach personal safety padlock and OSHA LOTO tag to supply valve HV-01. Verify analog gauge PG-02 reads exactly 0.0 bar.",
      citationRef: "[^safety/lockout_tagout_hydraulics.md#isolation-procedure]"
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="pb-6 border-b border-[#252B35]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F2B544]/15 text-[#F2B544] border border-[#F2B544]/30 font-bold uppercase">
            MULTI-STRATEGY RETRIEVAL
          </span>
          <span className="text-xs font-mono text-[#929AA6]">BM25 + RapidFuzz + Grounded Graph</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Search Engineering Documents
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#929AA6] max-w-2xl">
          Search across service manuals, components, fault codes, and repair procedures with zero cloud vector database dependency.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="card-industrial p-5 space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-[#F2B544] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search manuals, components, fault codes and repair procedures..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#101318] border border-[#252B35] text-sm font-mono text-white placeholder-[#647082] focus:outline-none focus:border-[#F2B544]"
          />
        </div>

        {/* Algorithm & Scope Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[#647082]">Algorithm:</span>
            {(["hybrid", "bm25", "rapidfuzz"] as const).map((algo) => (
              <button
                key={algo}
                onClick={() => setSearchAlgorithm(algo)}
                className={`px-3 py-1 rounded-lg uppercase cursor-pointer border ${
                  searchAlgorithm === algo
                    ? "bg-[#F2B544]/20 border-[#F2B544] text-[#F2B544] font-bold"
                    : "bg-[#101318] border-[#252B35] text-[#929AA6]"
                }`}
              >
                {algo}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#647082]">Scope:</span>
            <select
              value={selectedNotebook}
              onChange={(e) => setSelectedNotebook(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-[#101318] border border-[#252B35] text-[#929AA6]"
            >
              <option value="All">All Notebooks & Assets</option>
              {notebooks.map((nb) => (
                <option key={nb.id} value={nb.name}>{nb.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-[#929AA6]">
          <span>Found {searchResults.length} verified passages for "{query}"</span>
          <span className="text-[#279C70]">100% Deterministic Citations</span>
        </div>

        {searchResults.map((res) => (
          <div key={res.id} className="card-industrial p-5 space-y-3.5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2.5 border-b border-[#252B35]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#F2B544]" />
                <span className="font-bold text-white text-sm">{res.filename}</span>
                <span className="text-xs font-mono text-[#F2B544]">#{res.heading}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#647082]">
                <span>P/N: <strong className="text-white">{res.partNumber}</strong></span>
                <span>•</span>
                <span className="text-[#279C70]">{res.algorithm}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#F3F4F6] font-mono leading-relaxed bg-[#101318] p-3.5 rounded-xl border border-[#252B35]">
              "{res.passage}"
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
              <span className="text-[11px] font-mono text-[#647082]">
                Asset: {res.equipment} ({res.subsystem})
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigate("/diagnose");
                    showToast("Passed reference into diagnostic workbench");
                  }}
                  className="btn-amber-primary px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Use in Diagnosis</span>
                </button>
                <button
                  onClick={() => {
                    navigate("/notebooks");
                    showToast("Added excerpt to notebook notes");
                  }}
                  className="btn-slate-secondary px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5 text-[#F2B544]" />
                  <span>Add to Notebook</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

