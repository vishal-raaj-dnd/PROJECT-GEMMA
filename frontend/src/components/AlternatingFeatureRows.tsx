import React from "react";
import { Link } from "react-router-dom";
import { Check, ShieldCheck, ArrowRight, GitFork, Camera, Lock, CheckCircle2 } from "lucide-react";

export const AlternatingFeatureRows: React.FC = () => {
  return (
    <section className="py-24 bg-[#091329]/60 border-t border-[#1D3150]/80">
      <div className="max-w-6xl mx-auto px-6 space-y-28">
        {/* Row 1: Text Left, UI Fragment Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5 text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-[#3995F6] font-semibold">
              STEP 01 / MULTIMODAL VISION
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FC] tracking-tight">
              Instant hardware defect detection from a single photograph.
            </h3>
            <p className="text-sm text-[#9AAAC3] leading-relaxed">
              Frontline technicians in cramped turbine nacelles or aviation bays don't need to manually type serial
              numbers with heavy gloves. Multimodal vision reads component nameplates and detects micro-anomalies natively.
            </p>
            <ul className="space-y-2.5 text-xs font-mono text-[#9AAAC3]">
              <li className="flex items-center gap-2.5 text-[#F5F7FC]">
                <span className="w-4 h-4 rounded-full bg-[#1769C2]/30 text-[#3995F6] flex items-center justify-center text-[10px]">✓</span>
                Decodes laser-etched metal serial plates and part numbers
              </li>
              <li className="flex items-center gap-2.5 text-[#F5F7FC]">
                <span className="w-4 h-4 rounded-full bg-[#1769C2]/30 text-[#3995F6] flex items-center justify-center text-[10px]">✓</span>
                Identifies thermal capacitor scorch and radial hydraulic oil weepage
              </li>
              <li className="flex items-center gap-2.5 text-[#F5F7FC]">
                <span className="w-4 h-4 rounded-full bg-[#1769C2]/30 text-[#3995F6] flex items-center justify-center text-[10px]">✓</span>
                Translates LED blink code frequencies into calibrated fault codes
              </li>
            </ul>
            <div className="pt-2">
              <Link 
                to="/diagnose" 
                className="btn-secondary-blue inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold"
              >
                <span>Try Visual Diagnostic</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#3995F6]" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 rounded-2xl border border-[#1D3150] bg-[#0B1427]">
            <div className="p-4 rounded-xl bg-[#060B18] border border-[#1D3150] space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#9AAAC3]">Visual Feature Extractor</span>
                <span className="text-[#10B981] font-semibold">96% Confidence</span>
              </div>
              <div className="aspect-video rounded-lg overflow-hidden border border-[#1D3150] relative bg-[#091329]">
                <img src="/samples/sample_valve_leak.webp" alt="Valve Leak" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-[#060B18]/90 text-[10px] font-mono text-[#3995F6] border border-[#1D3150]">
                  Identified: PRV-992-B Solenoid Collar
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#0B1427] border border-[#1D3150] text-xs font-mono text-[#9AAAC3]">
                <strong className="text-[#F5F7FC]">Observed Defect:</strong> Extruded Viton 90-durometer O-ring seal under pulse pressure.
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: UI Fragment Left, Text Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1 p-6 rounded-2xl border border-[#1D3150] bg-[#0B1427]">
            <div className="p-4 rounded-xl bg-[#060B18] border border-[#1D3150] space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#3995F6]">OKF Graph Traversal</span>
                <span className="text-[#9AAAC3]">4 Linked Nodes</span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-[#0B1427] border border-[#1D3150] text-[#9AAAC3] flex items-center justify-between">
                  <span className="text-[#F5F7FC] font-semibold">components/proportional_relief_valve_v2.md</span>
                  <span className="text-[10px] text-[#3995F6] bg-[#1769C2]/15 px-2 py-0.5 rounded">Entry Node</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0B1427] border border-[#1D3150] text-[#9AAAC3] flex items-center justify-between">
                  <span>↳ safety/lockout_tagout_hydraulics.md</span>
                  <span className="text-[10px] text-[#F59E0B] bg-amber-500/15 px-2 py-0.5 rounded">Prerequisite</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0B1427] border border-[#1D3150] text-[#9AAAC3] flex items-center justify-between">
                  <span>↳ procedures/valve_seal_replacement.md</span>
                  <span className="text-[10px] text-[#10B981] bg-emerald-500/15 px-2 py-0.5 rounded">Procedure</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0B1427] border border-[#1D3150] text-[#9AAAC3] flex items-center justify-between">
                  <span>↳ tools/calibrated_torque_wrench.md</span>
                  <span className="text-[10px] text-[#3995F6] bg-blue-500/15 px-2 py-0.5 rounded">35 Nm Rating</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-5 text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-[#3995F6] font-semibold">
              STEP 02 / DETERMINISTIC TOPOLOGY
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FC] tracking-tight">
              Deterministic graph links replace fragile semantic searches.
            </h3>
            <p className="text-sm text-[#9AAAC3] leading-relaxed">
              Standard vector search retrieves disconnected chunks, often dropping life-critical safety notices. The Open Knowledge Format maintains physical parent-child hierarchies that programmatically require Lockout/Tagout verification.
            </p>
            <div className="pt-2">
              <Link 
                to="/graph" 
                className="btn-secondary-blue inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold"
              >
                <span>Inspect Graph Topology</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#3995F6]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

