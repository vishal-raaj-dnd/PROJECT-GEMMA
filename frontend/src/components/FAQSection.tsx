import React, { useState } from "react";
import { Plus, Minus, HelpCircle, Mail } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "How does the engine identify components and defect codes completely offline?",
      answer:
        "The system runs locally using 4-bit INT4 quantization on your field laptop or rugged tablet. Its native multimodal vision encoder reads part numbers, detects physical damage (such as extruded O-rings or burnt capacitors), and decodes error blink codes directly on-device with zero internet connectivity.",
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
    <section id="faq" className="py-24 bg-[#091329]/50 border-b border-[#1D3150]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column */}
          <div className="lg:col-span-5 text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-[#3995F6] font-semibold">
              SPECIFICATIONS & FAQ
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F5F7FC] leading-tight">
              Frequently asked questions.
              <span className="block text-[#9AAAC3] font-normal mt-1 text-2xl sm:text-3xl">
                Field engineering specifications.
              </span>
            </h2>
            <p className="mt-6 text-sm text-[#9AAAC3] leading-relaxed">
              Have technical questions regarding our deterministic graph architecture or custom OEM document compilation pipelines?
            </p>
            <div className="mt-8 p-4 rounded-xl bg-[#0B1427] border border-[#1D3150] flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#3995F6] shrink-0" />
              <div className="text-xs">
                <span className="text-[#6F809A] block">Technical Engineering Support:</span>
                <span className="text-[#F5F7FC] font-mono font-medium">engineering@fieldengine-diagnostics.internal</span>
              </div>
            </div>
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:col-span-7 divide-y divide-[#1D3150]">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="py-5 first:pt-0 last:pb-0">
                  <div
                    onClick={() => toggle(idx)}
                    className="flex items-center justify-between gap-4 cursor-pointer select-none group text-left"
                  >
                    <h3 className="text-base sm:text-lg font-semibold text-[#F5F7FC] group-hover:text-[#3995F6] transition-colors pr-2">
                      {faq.question}
                    </h3>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isOpen
                          ? "bg-[#1769C2] text-white shadow-md shadow-[#1769C2]/40"
                          : "bg-[#0B1427] text-[#9AAAC3] border border-[#1D3150] group-hover:border-[#3995F6]/50 group-hover:text-white"
                      }`}
                    >
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="mt-3 text-sm text-[#9AAAC3] leading-relaxed pr-6 animate-in fade-in duration-200">
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
