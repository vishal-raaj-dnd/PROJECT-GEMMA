import React from "react";
import { Link } from "react-router-dom";
import { Check, ShieldCheck, ArrowRight, GitFork, Camera, Lock } from "lucide-react";

export const AlternatingFeatureRows: React.FC = () => {
  return (
    <section className="py-20 bg-[#0B0B0E] hairline-t">
      <div className="max-w-5xl mx-auto px-6 space-y-28">
        {/* Row 1: Text Left, UI Fragment Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6B35] font-semibold">
              Step 01 / Multimodal Vision
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F5F5F7] tracking-tight">
              Instant hardware defect detection from a single photograph.
            </h3>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              Frontline technicians in cramped turbine nacelles or aviation bays don't need to manually type serial
              numbers with heavy gloves. Gemma 4 reads component nameplates and detects micro-anomalies natively.
            </p>
            <ul className="space-y-2.5 text-xs font-mono text-[#9CA3AF]">
              <li className="flex items-center gap-2.5 text-white">
                <span className="w-4 h-4 rounded-full bg-[#FF6B35]/20 text-[#FF6B35] flex items-center justify-center text-[10px]">✓</span>
                Decodes laser-etched metal serial plates and part numbers
              </li>
              <li className="flex items-center gap-2.5 text-white">
                <span className="w-4 h-4 rounded-full bg-[#FF6B35]/20 text-[#FF6B35] flex items-center justify-center text-[10px]">✓</span>
                Identifies thermal capacitor scorch and radial hydraulic oil weepage
              </li>
              <li className="flex items-center gap-2.5 text-white">
                <span className="w-4 h-4 rounded-full bg-[#FF6B35]/20 text-[#FF6B35] flex items-center justify-center text-[10px]">✓</span>
                Translates LED blink code frequencies into calibrated fault codes
              </li>
            </ul>
            <div className="pt-2">
              <Link to="/diagnose" className="inline-flex items-center gap-1.5 text-xs font-mono text-[#FF6B35] hover:text-[#F97316] font-semibold">
                <span>Try Visual Diagnostic</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 rounded-2xl border border-[#2A2A2E] bg-[#121316]">
            <div className="p-4 rounded-xl bg-[#0B0B0E] border border-[#2A2A2E] space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#9CA3AF]">Visual Feature Extractor</span>
                <span className="text-[#10B981] font-semibold">96% Match</span>
              </div>
              <div className="aspect-video rounded-lg overflow-hidden border border-[#2A2A2E] relative bg-[#121316]">
                <img src="/samples/sample_valve_leak.webp" alt="Valve Leak" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                  Identified: PRV-992-B Solenoid Collar
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#16171B] border border-[#2A2A2E] text-xs font-mono text-[#9CA3AF]">
                <strong className="text-white">Anomaly:</strong> Extruded Viton 90-durometer O-ring seal under pulse pressure.
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: UI Fragment Left, Text Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1 p-6 rounded-2xl border border-[#2A2A2E] bg-[#121316]">
            <div className="p-4 rounded-xl bg-[#0B0B0E] border border-[#2A2A2E] space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#FF6B35]">OKF Graph Traversal</span>
                <span className="text-[#9CA3AF]">4 Linked Nodes</span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-[#16171B] border border-[#2A2A2E] text-[#9CA3AF] flex items-center justify-between">
                  <span className="text-white font-semibold">components/proportional_relief_valve_v2.md</span>
                  <span className="text-[10px] text-[#FF6B35]">Entry Node</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#16171B] border border-[#2A2A2E] text-[#9CA3AF] flex items-center justify-between">
                  <span>↳ safety/lockout_tagout_hydraulics.md</span>
                  <span className="text-[10px] text-red-400">Prerequisite</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#16171B] border border-[#2A2A2E] text-[#9CA3AF] flex items-center justify-between">
                  <span>↳ procedures/valve_seal_replacement.md</span>
                  <span className="text-[10px] text-[#10B981]">Procedure</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#16171B] border border-[#2A2A2E] text-[#9CA3AF] flex items-center justify-between">
                  <span>↳ tools/calibrated_torque_wrench.md</span>
                  <span className="text-[10px] text-cyan-400">35 Nm Rating</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6B35] font-semibold">
              Step 02 / Zero Vector Chunking
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F5F5F7] tracking-tight">
              Deterministic graph links replace fragile semantic searches.
            </h3>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              Standard vector search retrieves disconnected chunks, often dropping life-critical safety notices.
              The Open Knowledge Format organizes procedures as interconnected Markdown nodes that preserve upstream
              safety prerequisites.
            </p>
            <ul className="space-y-2.5 text-xs font-mono text-[#9CA3AF]">
              <li className="flex items-center gap-2.5 text-white">
                <span className="w-4 h-4 rounded-full bg-[#FF6B35]/20 text-[#FF6B35] flex items-center justify-center text-[10px]">✓</span>
                Obsidian-compatible Markdown format with native frontmatter
              </li>
              <li className="flex items-center gap-2.5 text-white">
                <span className="w-4 h-4 rounded-full bg-[#FF6B35]/20 text-[#FF6B35] flex items-center justify-center text-[10px]">✓</span>
                In-memory NetworkX directed graph traversed in under 500ms
              </li>
              <li className="flex items-center gap-2.5 text-white">
                <span className="w-4 h-4 rounded-full bg-[#FF6B35]/20 text-[#FF6B35] flex items-center justify-center text-[10px]">✓</span>
                Zero cloud vector databases or remote embeddings needed
              </li>
            </ul>
            <div className="pt-2">
              <Link to="/graph" className="inline-flex items-center gap-1.5 text-xs font-mono text-[#FF6B35] hover:text-[#F97316] font-semibold">
                <span>Inspect Graph Topology</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

