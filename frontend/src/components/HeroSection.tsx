import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  Search, 
  Camera, 
  Mic, 
  Upload, 
  Cpu, 
  GitBranch, 
  ShieldCheck, 
  FileCheck, 
  Layers, 
  Sparkles,
  CheckCircle2,
  HardDrive
} from "lucide-react";
import { SAMPLE_QUERIES } from "../data/sampleData";

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/diagnose", { 
      state: { 
        initialQuery: searchQuery || SAMPLE_QUERIES[0].queryText,
        sampleId: searchQuery ? undefined : SAMPLE_QUERIES[0].id
      } 
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFileName(file.name);
      navigate("/diagnose", {
        state: {
          uploadedFile: file,
          initialQuery: searchQuery || "Visual fault identification on uploaded component photograph"
        }
      });
    }
  };

  const handleMicToggle = () => {
    if (!isListening) {
      setIsListening(true);
      setTimeout(() => {
        setSearchQuery("High pressure decay on yaw circuit with radial fluid weeping around PRV-992-B hex collar.");
        setIsListening(false);
      }, 1500);
    } else {
      setIsListening(false);
    }
  };

  const featureCards = [
    {
      icon: <HardDrive className="w-5 h-5 text-[#3995F6]" />,
      title: "Offline-First Intelligence",
      description: "Operates 100% on-device on rugged tablets or field laptops using quantized INT4 execution with zero cloud connectivity dependency.",
      badge: "Edge Ready"
    },
    {
      icon: <Cpu className="w-5 h-5 text-[#3995F6]" />,
      title: "Multimodal Diagnostics",
      description: "Analyzes component photographs, burnt electronics, weeping hydraulic manifolds, and acoustic audio notes natively.",
      badge: "Vision + Audio"
    },
    {
      icon: <FileCheck className="w-5 h-5 text-[#3995F6]" />,
      title: "Verifiable Engineering Knowledge",
      description: "Replaces ungrounded semantic search with deterministic relative links, verified by AST CitationAuditor against physical files.",
      badge: "Zero Hallucination"
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#3995F6]" />,
      title: "Safety-First Repair Guidance",
      description: "Enforces mandatory OSHA 1910.147 Lockout/Tagout zero-energy verification before revealing mechanical repair steps.",
      badge: "OSHA 1910.147"
    },
  ];

  return (
    <section className="relative pt-20 pb-20 overflow-hidden bg-[#060B18] text-center radial-blue-hero">
      {/* Background Dotted Network Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Ambient Blue Glow Accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[780px] h-[340px] bg-[#1769C2]/15 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1427] border border-[#1D3150] text-[#9AAAC3] text-xs font-mono font-medium mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#3995F6] animate-pulse" />
          <span className="text-[#F5F7FC] tracking-wider uppercase font-semibold">
            OFFLINE-FIRST INDUSTRIAL INTELLIGENCE
          </span>
        </div>

        {/* Large Centered Headline with Strong Hierarchy */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.03em] text-[#F5F7FC] leading-[1.08] max-w-4xl mx-auto">
          Diagnose Critical Equipment. <br />
          <span className="bg-gradient-to-r from-[#F5F7FC] via-[#D1E2FF] to-[#3995F6] bg-clip-text text-transparent">
            Even Without Connectivity.
          </span>
        </h1>

        {/* Supporting Paragraph */}
        <p className="mt-6 text-base sm:text-lg text-[#9AAAC3] max-w-3xl mx-auto leading-relaxed font-normal">
          Transform engineering documentation into actionable diagnostic intelligence through multimodal AI, interconnected knowledge graphs, verifiable citations, and safety-first repair guidance.
        </p>

        {/* Action Pair CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/diagnose"
            className="w-full sm:w-auto btn-primary-blue flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all cursor-pointer"
          >
            <span>Start Diagnosis</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/graph"
            className="w-full sm:w-auto btn-secondary-blue flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all cursor-pointer"
          >
            <GitBranch className="w-4 h-4 text-[#3995F6]" />
            <span>Explore Knowledge Graph</span>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono text-[#6F809A]">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
            100% Offline Edge Capable
          </span>
          <span className="text-[#1D3150] hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#3995F6]" />
            Zero Cloud Vector DB
          </span>
          <span className="text-[#1D3150] hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
            OSHA 1910.147 Enforced
          </span>
        </div>

        {/* Diagnostic Input / Search Section */}
        <div className="mt-14 max-w-3xl mx-auto">
          <div className="p-2 sm:p-2.5 rounded-2xl bg-[#0B1427]/90 border border-[#1D3150] shadow-2xl backdrop-blur-md">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full flex items-center">
                <Search className="w-4 h-4 text-[#6F809A] absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search equipment, fault codes, components, or engineering manuals..."
                  className="w-full pl-10 pr-24 py-3 rounded-xl bg-[#060B18] border border-[#1D3150] text-xs font-mono text-[#F5F7FC] placeholder-[#6F809A] focus:outline-none focus:border-[#3995F6] transition-colors"
                />

                {/* Voice Input Button */}
                <div className="absolute right-2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleMicToggle}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      isListening
                        ? "bg-red-500/20 border-red-500 text-red-400 animate-pulse"
                        : "bg-[#101D35] border-[#1D3150] text-[#9AAAC3] hover:text-[#3995F6]"
                    }`}
                    title={isListening ? "Listening..." : "Dictate Fault Description"}
                  >
                    <Mic className="w-3.5 h-3.5" />
                  </button>

                  {/* Photo Upload Trigger */}
                  <label 
                    className="p-1.5 rounded-lg bg-[#101D35] border border-[#1D3150] text-[#9AAAC3] hover:text-[#3995F6] transition-all cursor-pointer"
                    title="Upload Equipment Photograph"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              {/* Submit Diagnosis Button */}
              <button
                type="submit"
                className="w-full sm:w-auto btn-primary-blue flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Diagnose</span>
              </button>
            </form>

            {/* Quick Suggestions / Sample queries */}
            <div className="mt-3 pt-2.5 border-t border-[#1D3150]/60 flex flex-wrap items-center justify-between gap-2 px-2 text-[11px] font-mono text-[#6F809A]">
              <span className="text-[#9AAAC3]">Quick Scenarios:</span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_QUERIES.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => {
                      setSearchQuery(sample.queryText);
                      navigate("/diagnose", { state: { sampleId: sample.id } });
                    }}
                    className="px-2.5 py-1 rounded-md bg-[#091329] border border-[#1D3150] text-[#9AAAC3] hover:text-[#3995F6] hover:border-[#3995F6]/40 transition-colors cursor-pointer text-[10px]"
                  >
                    {sample.subsystem}: {sample.diagnostic.detected_component?.part_number || sample.title.slice(0, 24)}...
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Refined Feature Cards Representing Main Differentiators */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
          {featureCards.map((feat, idx) => (
            <div
              key={idx}
              className="card-tech p-6 flex flex-col justify-between group cursor-default"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#101D35] border border-[#1D3150] flex items-center justify-center group-hover:border-[#3995F6]/50 group-hover:scale-105 transition-all">
                    {feat.icon}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#091329] text-[#3995F6] border border-[#1D3150]">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#F5F7FC] tracking-tight group-hover:text-white transition-colors">
                  {feat.title}
                </h3>
                <p className="mt-2 text-xs text-[#9AAAC3] leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1D3150]/60 flex items-center gap-1 text-[11px] font-mono text-[#3995F6] opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Deterministic Edge Engine</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
