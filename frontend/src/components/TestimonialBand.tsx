import React from "react";
import { Quote } from "lucide-react";

export const TestimonialBand: React.FC = () => {
  const testimonials = [
    {
      quote:
        "When offshore satellite uplink fails in the North Sea, GemmaOps identified our hydraulic yaw manifold seal extrusion in 14 seconds with exact torque specifications. Zero hallucinations, zero cloud reliance.",
      author: "Marcus Lindqvist",
      title: "Lead Offshore Reliability Specialist",
      company: "Nordic Wind Dynamics",
      location: "Stavanger Operations Base",
    },
    {
      quote:
        "The mathematical citation auditor and OSHA 1910.147 safety interlock prevented an unauthorized high-pressure valve dismount before zero-energy certification. It's the first AI system our plant safety committee fully certified.",
      author: "Dr. Elena Rostova",
      title: "VP of Field Operations & Safety Compliance",
      company: "Continental Turbines & AeroSystems",
      location: "Munich Industrial Plant",
    },
  ];

  return (
    <section className="py-24 bg-[#0E0F12] border-y border-[#2A2A2E] relative overflow-hidden">
      {/* Background Subtle Warm Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#FF6B35]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-14">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF6B35] font-semibold">
            Field Reliability Verified
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F5F7] mt-2">
            Trusted where equipment failure is not an option
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-[#121316] border border-[#2A2A2E] rounded-2xl p-8 flex flex-col justify-between hover:border-[#FF6B35]/40 transition-colors"
            >
              <div>
                <Quote className="w-8 h-8 text-[#FF6B35]/30 mb-5" />
                <blockquote className="text-base sm:text-lg text-[#F5F5F7] font-normal leading-relaxed">
                  "{t.quote}"
                </blockquote>
              </div>
              <div className="mt-8 pt-6 border-t border-[#2A2A2E]/80">
                <div className="font-semibold text-white text-sm">{t.author}</div>
                <div className="text-xs text-[#9CA3AF] mt-0.5">{t.title}</div>
                <div className="text-[11px] font-mono text-[#FF6B35] mt-1 flex items-center gap-1.5">
                  <span>{t.company}</span>
                  <span className="text-[#9CA3AF]">•</span>
                  <span className="text-[#9CA3AF]">{t.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
