import React, { useState } from "react";
import { Camera, Cpu, GitFork, ShieldCheck, Wrench, CheckCircle, FileCode } from "lucide-react";

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
      subtitle: "Photos, hands-free voice notes, analog gauge readings",
      icon: <Camera className="w-6 h-6 text-amber-400" />,
      detail:
        "The technician snaps a photo of a leaking valve collar or burnt capacitor and provides a short voice note. No manual typing or internet connection required.",
      technicalSpec: "Accepts JPEG, PNG, WEBP, and raw voice audio waveforms. Edge pre-processed locally.",
    },
    {
      number: "02",
      title: "Gemma 4 Multimodal Reasoning",
      subtitle: "Component recognition, defect analysis, OCR serial extraction",
      icon: <Cpu className="w-6 h-6 text-cyan-400" />,
      detail:
        "Gemma 4 natively extracts the part identifier (e.g. PRV-992-B), defect diagnosis (extruded Viton seal with high-pressure oil weepage), and visual confidence score.",
      technicalSpec: "Structured JSON schema validation. Runs on quantized Gemma 4 12B or Gemma 4 E4B.",
    },
    {
      number: "03",
      title: "Deterministic OKF Graph Traversal",
      subtitle: "Upstream LOTO safety interlocks & downstream repair procedures",
      icon: <GitFork className="w-6 h-6 text-purple-400" />,
      detail:
        "Instead of ungrounded vector search, the in-memory graph engine resolves the entry node and traverses upstream safety prerequisites (OSHA 1910.147 LOTO) before mechanical steps.",
      technicalSpec: "Zero cloud DB. NetworkX directed graph in RAM (< 500ms traversal latency).",
    },
    {
      number: "04",
      title: "Safety Gating & Verifiable Execution",
      subtitle: "LOTO sign-off, exact torque specs, verified citations",
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      detail:
        "The technician confirms zero-energy isolation before wrenching steps unlock. Every instruction cites verifiable local Markdown nodes in the Evidence Drawer.",
      technicalSpec: "100% citation audit against local filesystem. Zero hallucinated references permitted.",
    },
  ];

  return (
    <section id="architecture" className="py-20 border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">System Pipeline</h2>
          <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How Image + OKF Resolves Frontline Queries
          </p>
          <p className="mt-4 text-slate-400 text-base">
            From the moment the camera shutter clicks to the final calibrated torque wrench click, every step is
            grounded in deterministic engineering knowledge.
          </p>
        </div>

        {/* Step Buttons */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, idx) => (
            <button
              key={s.number}
              onClick={() => setSelectedStep(idx)}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedStep === idx
                  ? "bg-slate-900 border-amber-500/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40"
                  : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold text-slate-500">STEP {s.number}</span>
                <div className="p-2 rounded-xl bg-slate-800/80">{s.icon}</div>
              </div>
              <h3 className="font-bold text-white text-base leading-snug">{s.title}</h3>
              <p className="mt-1 text-xs text-slate-400 line-clamp-2">{s.subtitle}</p>
            </button>
          ))}
        </div>

        {/* Detailed Active Step Card */}
        <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-slate-800 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-mono font-medium">
                Active Architecture Node: Step {steps[selectedStep].number}
              </div>
              <h4 className="mt-3 text-2xl font-bold text-white">{steps[selectedStep].title}</h4>
              <p className="mt-2 text-slate-300 text-sm leading-relaxed">{steps[selectedStep].detail}</p>
              <div className="mt-4 p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs font-mono text-cyan-300 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
                <span><strong>Engine Spec:</strong> {steps[selectedStep].technicalSpec}</span>
              </div>
            </div>

            <div className="shrink-0 p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 min-w-[240px]">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Traversal Status</div>
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
                <CheckCircle className="w-4 h-4" />
                <span>Deterministic Link Verified</span>
              </div>
              <div className="mt-3 text-xs text-slate-400">
                OKF Relative Link: <code className="text-amber-300 font-mono">[[components/spec.md]]</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
