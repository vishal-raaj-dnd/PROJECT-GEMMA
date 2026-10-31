import React from "react";
import { Wind, Plane, Anchor, Mountain, Factory, Activity } from "lucide-react";

export const IndustryStrip: React.FC = () => {
  const industries = [
    { name: "Wind Turbine Nacelles", icon: <Wind className="w-4 h-4" /> },
    { name: "Commercial Aerospace", icon: <Plane className="w-4 h-4" /> },
    { name: "Offshore Hydro Skids", icon: <Anchor className="w-4 h-4" /> },
    { name: "Subterranean Mining", icon: <Mountain className="w-4 h-4" /> },
    { name: "Turbine Powerplants", icon: <Factory className="w-4 h-4" /> },
  ];

  return (
    <section className="py-12 bg-[#0B0B0E] hairline-t hairline-b">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-center text-xs font-mono uppercase tracking-widest text-[#9CA3AF]/60 mb-6">
          Architected for High-Value Frontline Operations
        </p>

        <div className="flex flex-wrap items-center justify-between gap-8 opacity-65 grayscale hover:grayscale-0 transition-all duration-300">
          {industries.map((ind, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs font-mono font-medium text-[#9CA3AF]">
              {ind.icon}
              <span>{ind.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
