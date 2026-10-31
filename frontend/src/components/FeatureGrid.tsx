import React from "react";
import { Camera, GitFork, ShieldCheck, FileCheck, Layers, Cpu } from "lucide-react";

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: <Camera className="w-5 h-5 text-[#FF6B35]" />,
      title: "Native Multimodal Vision",
      description:
        "Gemma 4 inspects burnt capacitors, weeping hydraulic valve collars, and analog pressure gauges directly on-device without cloud connectivity.",
    },
    {
      icon: <GitFork className="w-5 h-5 text-[#FF6B35]" />,
      title: "Deterministic OKF Knowledge Graph",
      description:
        "Avoids generic vector search chunk fragmentation. Maps visual findings to structured Markdown concept nodes with explicit relative links.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#FF6B35]" />,
      title: "OSHA 1910.147 Safety Gate",
      description:
        "Mechanically locks procedural repair instructions behind an interactive zero-energy Lockout/Tagout signoff checklist.",
    },
    {
      icon: <FileCheck className="w-5 h-5 text-[#FF6B35]" />,
      title: "Verifiable Citation Auditor",
      description:
        "Mathematically checks every emitted citation against physical Markdown files in local memory, eliminating hallucinated manual references.",
    },
    {
      icon: <Layers className="w-5 h-5 text-[#FF6B35]" />,
      title: "Universal OmniOKF Ingestion",
      description:
        "Converts messy enterprise PDFs, Word files, Excel tables, and schematics into structured, cross-linked OKF bundles using MarkItDown.",
    },
    {
      icon: <Cpu className="w-5 h-5 text-[#FF6B35]" />,
      title: "100% Offline Edge Runtime",
      description:
        "Engineered for field laptops and rugged tablets. Quantized INT4 inference ensures full functionality in subterranean and remote offshore environments.",
    },
  ];

  return (
    <section className="py-24 bg-[#0B0B0E]">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Heading */}
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FF6B35] font-semibold">
            Core Architecture
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F5F5F7]">
            Built specifically for zero-connectivity industrial operations.
          </h2>
          <p className="mt-4 text-base text-[#9CA3AF]">
            Eliminate the risk of hallucinated manuals and dangerous missed isolation protocols with an
            offline-first, deterministic intelligence system.
          </p>
        </div>

        {/* 3x2 Outlined Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-[#2A2A2E] bg-[#121316] hover:border-[#3F3F46] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-[#16171B] border border-[#2A2A2E] flex items-center justify-center mb-5">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">{f.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

