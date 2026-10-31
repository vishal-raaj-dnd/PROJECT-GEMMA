import React from "react";
import { ShieldCheck, HardDrive, Cpu, Zap } from "lucide-react";

export const MetricsHighlightBand: React.FC = () => {
  const specs = [
    {
      value: "100%",
      label: "Deterministic Citations",
      detail: "Every diagnostic recommendation is mathematically verified against physical local Markdown nodes",
      icon: <ShieldCheck className="w-4 h-4 text-[#10B981]" />
    },
    {
      value: "OSHA 1910",
      label: "LOTO Safety Interlock",
      detail: "Zero-energy electrical and hydraulic isolation verification enforced prior to repair disclosure",
      icon: <Zap className="w-4 h-4 text-[#F59E0B]" />
    },
    {
      value: "INT4",
      label: "Offline Edge Execution",
      detail: "Runs locally on rugged laptops and field tablets without internet or external vector DBs",
      icon: <HardDrive className="w-4 h-4 text-[#3995F6]" />
    },
    {
      value: "< 500ms",
      label: "Graph Traversal Latency",
      detail: "In-memory NetworkX directed graph topology evaluated directly in device RAM",
      icon: <Cpu className="w-4 h-4 text-[#3995F6]" />
    },
  ];

  return (
    <section className="py-16 bg-[#091329] border-y border-[#1D3150]/80">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {specs.map((m, idx) => (
            <div key={idx} className="card-tech p-6 text-left">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#F5F7FC] tracking-tight">
                  {m.value}
                </span>
                <div className="p-2 rounded-lg bg-[#101D35] border border-[#1D3150]">
                  {m.icon}
                </div>
              </div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#3995F6]">
                {m.label}
              </div>
              <p className="mt-2 text-xs text-[#9AAAC3] leading-relaxed">
                {m.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

