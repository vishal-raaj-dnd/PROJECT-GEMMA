import React, { useState } from "react";
import { Camera, Cpu, GitFork, ShieldCheck, CheckCircle2, FileCode } from "lucide-react";

interface WorkflowStep {
  number: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  detail: string;
  technicalSpec: string;
}

export const ArchitectureWorkflow: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState(0);

  const steps: WorkflowStep[] = [
    {
      number: "01",
      title: "Field Visual & Voice Ingestion",
      subtitle: "Photos, hands-free audio notes, analog gauge readings",
      icon: <Camera className="w-5 h-5 text-[#6C4CF1]" />,
      detail:
        "The technician snaps a photo of a leaking valve collar or burnt capacitor and provides an audio note. Operates 100% offline with zero cloud dependency.",
      technicalSpec: "Native JPEG, PNG, WEBP and audio waveform buffers edge pre-processed in-memory.",
    },
    {
      number: "02",
      title: "Gemma 4 Multimodal Reasoning",
      subtitle: "Part identification, defect diagnosis, OCR serial extraction",
      icon: <Cpu className="w-5 h-5 text-[#C9B8FF]" />,
      detail:
        "Gemma 4 natively extracts the part identifier (e.g. PRV-992-B), defect diagnosis (extruded Viton seal with high-pressure oil weepage), and visual confidence score.",
      technicalSpec: "Structured JSON schema validation on quantized Gemma 4 12B or Gemma 4 E4B.",
    },
    {
      number: "03",
      title: "Deterministic OKF Graph Traversal",
      subtitle: "Upstream LOTO safety interlocks & downstream repair procedures",
      icon: <GitFork className="w-5 h-5 text-[#6C4CF1]" />,
      detail:
        "Instead of ungrounded vector search, the in-memory graph engine resolves the entry node and traverses upstream safety prerequisites (OSHA 1910.147 LOTO) before mechanical steps.",
      technicalSpec: "NetworkX directed graph in RAM (< 500ms traversal latency, zero cloud vector DB).",
    },
    {
      number: "04",
      title: "Safety Gating & Verifiable Execution",
      subtitle: "LOTO sign-off, exact torque specs, verified citations",
      icon: <ShieldCheck className="w-5 h-5 text-[#34D399]" />,
      detail:
        "The technician confirms zero-energy isolation before wrenching steps unlock. Every instruction cites verifiable local Markdown nodes in the Evidence Drawer.",
      technicalSpec: "100% citation audit against local filesystem. Zero hallucinated references permitted.",
    },
  ];

  return (
    <section id="architecture" className="py-24 bg-[#0A0A0C] hairline-b">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#6C4CF1] font-semibold">
            System Pipeline
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            How Image + OKF Resolves Frontline Queries
          </h2>
          <p className="mt-4 text-base text-[#9A9AA2]">
            From the camera shutter click to the final calibrated torque wrench click, every step is grounded in
            deterministic engineering knowledge.
          </p>
        </div>

        {/* 4 Step Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, idx) => (
            <button
              key={s.number}
              onClick={() => setSelectedStep(idx)}
              className={`p-6 rounded-3xl border text-left transition-all cursor-pointer ${
                selectedStep === idx
                  ? "bg-[#111114] border-[#6C4CF1] shadow-xl shadow-[#6C4CF1]/10 ring-1 ring-[#6C4CF1]/40"
                  : "bg-[#111114]/50 border-white/[0.08] hover:border-white/[0.16] hover:bg-[#111114]"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold text-[#9A9AA2]">STEP {s.number}</span>
                <div className="w-9 h-9 rounded-2xl bg-[#0A0A0C] border border-white/[0.08] flex items-center justify-center">
                  {s.icon}
                </div>
              </div>
              <h3 className="font-bold text-white text-base leading-snug">{s.title}</h3>
              <p className="mt-1.5 text-xs text-[#9A9AA2] line-clamp-2 leading-relaxed">{s.subtitle}</p>
            </button>
          ))}
        </div>

        {/* Detailed Active Step Panel */}
        <div className="mt-8 p-8 rounded-3xl bg-[#111114] border border-white/[0.08] shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-3xl space-y-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#6C4CF1]/10 text-[#C9B8FF] border border-[#6C4CF1]/30 text-xs font-mono font-medium">
                Active Node: Step {steps[selectedStep].number}
              </span>
              <h4 className="text-2xl font-bold text-white tracking-tight">{steps[selectedStep].title}</h4>
              <p className="text-[#9A9AA2] text-sm leading-relaxed">{steps[selectedStep].detail}</p>
              <div className="p-3.5 rounded-2xl bg-[#0A0A0C] border border-white/[0.06] text-xs font-mono text-[#C9B8FF] flex items-center gap-2.5">
                <FileCode className="w-4 h-4 text-[#6C4CF1] shrink-0" />
                <span><strong>Engine Spec:</strong> {steps[selectedStep].technicalSpec}</span>
              </div>
            </div>

            <div className="shrink-0 p-5 rounded-2xl bg-[#0A0A0C] border border-white/[0.08] min-w-[240px]">
              <div className="text-xs font-mono text-[#9A9AA2] uppercase tracking-wider mb-2">Traversal Status</div>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#34D399]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Deterministic Link Verified</span>
              </div>
              <div className="mt-2 text-xs text-[#9A9AA2]">
                OKF Relative Link: <code className="text-[#C9B8FF] font-mono">[[components/spec.md]]</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
