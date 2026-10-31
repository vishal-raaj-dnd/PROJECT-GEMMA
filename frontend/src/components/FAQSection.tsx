import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "How does Gemma 4 identify components and defect codes completely offline?",
      answer:
        "Gemma 4 runs locally using 4-bit INT4 quantization on your field laptop or rugged tablet. Its native multimodal vision encoder reads part numbers, detects physical damage (such as extruded O-rings or burnt capacitors), and decodes error blink codes directly on-device with zero internet connectivity.",
    },
    {
      question: "Why does the engine use an OKF knowledge graph instead of traditional vector search?",
      answer:
        "In aviation and high-pressure hydraulics, vector search is dangerous because it retrieves isolated text chunks that often miss critical prerequisite safety steps. The Open Knowledge Format (OKF) stores knowledge as an interconnected Markdown graph, programmatically enforcing Lockout/Tagout prerequisites before any repair steps are shown.",
    },
    {
      question: "How does the system guarantee zero-hallucination citations in repair procedures?",
      answer:
        "Every repair step must cite its exact source using the format [^path/to/node.md#heading]. The backend CitationAuditor parses these citations and mathematically verifies that each file and section exists in the active local graph before presenting it in the Evidence Drawer.",
    },
    {
      question: "How does the OSHA 1910.147 Lockout/Tagout (LOTO) safety gate operate?",
      answer:
        "The software enforces an electronic interlock. Even if the part is identified, the mechanical repair sequence remains locked until the technician explicitly reviews and signs off on the zero-energy isolation checklist with their technician badge ID.",
    },
    {
      question: "Can we ingest our existing OEM PDF, Word, and Excel technical manuals?",
      answer:
        "Yes. The integrated OmniOKF compiler uses Microsoft MarkItDown and PyMuPDF to parse complex document layouts, split sections at header boundaries, and automatically generate YAML frontmatter and relative Markdown cross-links.",
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-[#111114] hairline-b">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column (~40%): Eyebrow, Two-line headline, Contact line */}
          <div className="lg:col-span-5">
            <span className="text-xs font-mono uppercase tracking-widest text-[#6C4CF1] font-semibold">
              FAQ
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Common questions.
              <span className="block text-[#9A9AA2] font-normal mt-1">
                Everything you need to know.
              </span>
            </h2>
            <p className="mt-8 text-sm text-[#9A9AA2]">
              Anything else? Write to{" "}
              <a
                href="mailto:fieldops@gemma-engine.dev"
                className="text-white underline underline-offset-4 hover:text-[#6C4CF1] transition-colors"
              >
                fieldops@gemma-engine.dev
              </a>
            </p>
          </div>

          {/* Right Column (~60%): 5 Accordion questions separated by 1px hairlines */}
          <div className="lg:col-span-7 divide-y divide-white/[0.08]">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="py-6 first:pt-0 last:pb-0">
                  <div
                    onClick={() => toggle(idx)}
                    className="flex items-center justify-between gap-4 cursor-pointer select-none group"
                  >
                    <h3 className="text-lg font-medium text-white group-hover:text-slate-200 transition-colors pr-2">
                      {faq.question}
                    </h3>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isOpen
                          ? "bg-[#6C4CF1] text-white shadow-md shadow-[#6C4CF1]/30"
                          : "bg-white/[0.06] text-[#9A9AA2] group-hover:bg-white/[0.12] group-hover:text-white"
                      }`}
                    >
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="mt-4 text-sm text-[#9A9AA2] leading-relaxed pr-10 animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
