import React from "react";

export const MetricsHighlightBand: React.FC = () => {
  const metrics = [
    {
      value: "84%",
      label: "MTTR Reduction",
      detail: "Eliminates manual manual flipping in nacelles and engine rooms",
    },
    {
      value: "100%",
      label: "Deterministic Citations",
      detail: "Every repair instruction mathematically tied to a local node",
    },
    {
      value: "OSHA 1910",
      label: "Safety Gate Compliance",
      detail: "Zero energy isolation signoff required before mechanical repair",
    },
    {
      value: "< 500ms",
      label: "Graph Traversal Latency",
      detail: "In-memory NetworkX directed graph; zero external network lag",
    },
  ];

  return (
    <section className="py-16 bg-[#121316] hairline-t hairline-b">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-[#0B0B0E] border border-[#2A2A2E] text-left">
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#F5F5F7] tracking-tight">
                {m.value}
              </div>
              <div className="mt-2 text-xs font-mono font-bold uppercase tracking-wider text-[#FF6B35]">
                {m.label}
              </div>
              <p className="mt-1.5 text-xs text-[#9CA3AF] leading-relaxed">
                {m.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
