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
    <section id="faq" className="py-24 bg-[#0B0B0E] border-t border-[#2A2A2E]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column (~40%): Eyebrow, Two-line headline, Contact line */}
          <div className="lg:col-span-5">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6B35] font-semibold">
              FAQ
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F5F5F7] leading-tight">
              Common questions.
              <span className="block text-[#9CA3AF] font-normal mt-1">
                Field engineering specifications.
              </span>
            </h2>
            <p className="mt-8 text-sm text-[#9CA3AF]">
              Technical inquiry or custom OEM schema? Write to{" "}
              <a
                href="mailto:fieldops@gemma-engine.dev"
                className="text-white underline underline-offset-4 hover:text-[#FF6B35] transition-colors"
              >
                fieldops@gemma-engine.dev
              </a>
            </p>
          </div>

          {/* Right Column (~60%): 5 Accordion questions separated by 1px hairlines */}
          <div className="lg:col-span-7 divide-y divide-[#2A2A2E]">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="py-6 first:pt-0 last:pb-0">
                  <div
                    onClick={() => toggle(idx)}
                    className="flex items-center justify-between gap-4 cursor-pointer select-none group"
                  >
                    <h3 className="text-base sm:text-lg font-medium text-[#F5F5F7] group-hover:text-white transition-colors pr-2">
                      {faq.question}
                    </h3>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isOpen
                          ? "bg-[#FF6B35] text-white shadow-md shadow-[#FF6B35]/30"
                          : "bg-[#16171B] text-[#9CA3AF] border border-[#2A2A2E] group-hover:border-[#FF6B35]/50 group-hover:text-white"
                      }`}
                    >
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="mt-4 text-sm text-[#9CA3AF] leading-relaxed pr-10">
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

