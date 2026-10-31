import React from "react";
import { Wind, Plane, Anchor, Mountain, Factory, Activity } from "lucide-react";

export const IndustryStrip: React.FC = () => {
  const industries = [
    { name: "Wind Turbine Nacelles", icon: <Wind className="w-4 h-4 text-[#3995F6]" /> },
    { name: "Commercial Aerospace", icon: <Plane className="w-4 h-4 text-[#3995F6]" /> },
    { name: "Offshore Hydro Skids", icon: <Anchor className="w-4 h-4 text-[#3995F6]" /> },
    { name: "Subterranean Mining", icon: <Mountain className="w-4 h-4 text-[#3995F6]" /> },
    { name: "Turbine Powerplants", icon: <Factory className="w-4 h-4 text-[#3995F6]" /> },
  ];

  return (
    <section className="py-12 bg-[#060B18] border-y border-[#1D3150]/80">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-xs font-mono uppercase tracking-widest text-[#6F809A] mb-6">
          Deployed Across Mission-Critical Industrial Environments
        </p>

        <div className="flex flex-wrap items-center justify-between gap-6 opacity-75 hover:opacity-100 transition-opacity">
          {industries.map((ind, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#0B1427]/50 border border-[#1D3150] text-xs font-mono font-medium text-[#9AAAC3]"
            >
              {ind.icon}
              <span className="text-[#F5F7FC]">{ind.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

