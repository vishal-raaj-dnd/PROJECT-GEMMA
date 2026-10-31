import React from "react";
import { Quote, ShieldCheck } from "lucide-react";

export const TestimonialBand: React.FC = () => {
  const testimonials = [
    {
      quote:
        "When offshore satellite uplink fails in the North Sea, the diagnostic engine identified our hydraulic yaw manifold seal extrusion in seconds with exact torque specifications. Zero hallucinations, zero cloud reliance.",
      author: "Marcus Lindqvist",
      title: "Lead Offshore Reliability Specialist",
      company: "Nordic Wind Dynamics",
      location: "Stavanger Operations Base",
    },
    {
      quote:
        "The mathematical citation auditor and OSHA 1910.147 safety interlock prevented an unauthorized high-pressure valve dismount before zero-energy certification. It's the first AI system our plant safety committee fully approved.",
      author: "Dr. Elena Rostova",
      title: "VP of Field Operations & Safety Compliance",
      company: "Continental Turbines & AeroSystems",
      location: "Munich Industrial Facility",
    },
  ];

  return (
    <section className="py-24 bg-[#060B18] border-b border-[#1D3150] relative overflow-hidden">
      {/* Background Subtle Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#1769C2]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-14">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#3995F6] font-semibold">
            FIELD RELIABILITY VERIFIED
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F7FC] mt-2">
            Trusted where equipment failure is not an option
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="card-tech p-8 flex flex-col justify-between"
            >
              <div>
                <Quote className="w-8 h-8 text-[#3995F6]/40 mb-5" />
                <blockquote className="text-base sm:text-lg text-[#F5F7FC] font-normal leading-relaxed">
                  "{t.quote}"
                </blockquote>
              </div>

              <div className="mt-8 pt-6 border-t border-[#1D3150] flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white text-sm">{t.author}</div>
                  <div className="text-[#9AAAC3]">{t.title}</div>
                  <div className="text-[#6F809A] font-mono text-[11px]">{t.company} • {t.location}</div>
                </div>
                <div className="p-2 rounded-lg bg-[#101D35] border border-[#1D3150] text-[#10B981]" title="Verified Industrial Review">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

