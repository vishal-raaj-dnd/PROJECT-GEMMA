import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import mermaid from "mermaid";
import {
  ArrowUp,
  Square,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Copy,
  Check,
  GitBranch,
  Code2,
  SlidersHorizontal,
  ExternalLink
} from "lucide-react";
import { ChatMessage, Citation, SourceDocument } from "../../types/workspace";

// Initialize mermaid with strict suppression of injected error divs
mermaid.initialize({
  startOnLoad: false,
  suppressErrorRendering: true,
  theme: "dark",
  securityLevel: "loose",
  themeVariables: {
    darkMode: true,
    background: "#0E1118",
    primaryColor: "#3B82F6",
    primaryTextColor: "#F5F7FF",
    primaryBorderColor: "#2B2D35",
    lineColor: "#22D3EE",
    secondaryColor: "#18181A",
    tertiaryColor: "#1E2026",
  },
});

function sanitizeMermaid(raw: string): string {
  let cleaned = raw
    .replace(/^```(?:mermaid)?\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();

  // If missing diagram header, default to graph TD
  const validStarts = [
    "graph ",
    "flowchart ",
    "sequenceDiagram",
    "stateDiagram",
    "classDiagram",
    "erDiagram",
    "gantt",
    "pie",
    "gitGraph"
  ];
  const hasValidStart = validStarts.some((kw) => cleaned.startsWith(kw));
  if (!hasValidStart) {
    cleaned = `graph TD\n${cleaned}`;
  }

  const nodeMap = new Map<string, string>();
  let idCounter = 1;

  const getNodeStr = (part: string): string => {
    const s = part.trim();
    // If already has brackets like A["Label"] or A[Label]
    if (s.includes("[") && s.includes("]")) {
      return s.replace(/&/g, "and");
    }

    // If wrapped in quotes: "something"
    if (s.startsWith('"') && s.endsWith('"') && s.length >= 2) {
      const content = s.slice(1, -1).trim();
      if (!nodeMap.has(content)) {
        const slug = content.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12) || `node${idCounter}`;
        nodeMap.set(content, `n_${idCounter}_${slug}`);
        idCounter++;
      }
      const nid = nodeMap.get(content);
      const safeContent = content.replace(/"/g, "'").replace(/&/g, "and");
      return `${nid}["${safeContent}"]`;
    }

    return s;
  };

  const lines = cleaned.split("\n");
  // Arrow pattern matching standard Mermaid connectors
  const arrowRegex = /(\s*(?:-->|---|==>|-\.->|--\s*.*?\s*-->)\s*)/;

  const transformedLines = lines.map((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("graph ") || trimmed.startsWith("flowchart ")) {
      return line;
    }

    // Split line by connectors while keeping separators
    const parts = line.split(arrowRegex);
    if (parts.length >= 3) {
      return parts
        .map((p, idx) => {
          if (idx % 2 === 1) {
            // Arrow connector
            return p;
          }
          const leadingWs = p.match(/^\s*/)?.[0] || "";
          const trailingWs = p.match(/\s*$/)?.[0] || "";
          const formatted = getNodeStr(p);
          return leadingWs + formatted + trailingWs;
        })
        .join("");
    }

    return line.replace(/&/g, "and");
  });

  return transformedLines.join("\n");
}

interface MermaidRendererProps {
  code: string;
  isStreaming?: boolean;
}

const MermaidRenderer: React.FC<MermaidRendererProps> = ({ code, isStreaming = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const [hasError, setHasError] = useState(false);

  const cleanCode = sanitizeMermaid(code);

  useEffect(() => {
    let isMounted = true;

    // Do not attempt to parse incomplete streaming mermaid blocks
    if (isStreaming) {
      return;
    }

    if (containerRef.current) {
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      mermaid
        .render(id, cleanCode)
        .then(({ svg }) => {
          if (isMounted && containerRef.current) {
            containerRef.current.innerHTML = svg;
            setHasError(false);
          }
        })
        .catch((err) => {
          // Remove any stray error elements injected by Mermaid into document body
          const errEl = document.querySelectorAll(`[id^="d${id}"], [id^="dmermaid"]`);
          errEl.forEach((el) => el.remove());

          if (isMounted) {
            setHasError(true);
            if (containerRef.current) {
              containerRef.current.innerHTML = "";
            }
          }
        });
    }

    return () => {
      isMounted = false;
      const errEl = document.querySelectorAll(`[id^="dmermaid"]`);
      errEl.forEach((el) => el.remove());
    };
  }, [cleanCode, isStreaming]);

  return (
    <div className="my-4 rounded-[20px] border border-[#2B2D35] bg-[#141519] overflow-hidden shadow-2xl">
      {/* Visual Block Header */}
      <div className="px-4 py-2.5 bg-[#1A1B20] border-b border-[#2B2D35] flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-[#3B82F6]/20 text-[#60A5FA]">
            <GitBranch className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-white tracking-wide uppercase font-mono">
            Process & Workflow Flowchart
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#22D3EE]/10 text-[#22D3EE] font-mono border border-[#22D3EE]/20">
            MECH-G Visual
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowRaw(!showRaw)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-normal flex items-center gap-1 border transition-colors ${
              showRaw
                ? "bg-[#2563EB] text-white border-[#2563EB]"
                : "bg-[#232326] text-[#9CA3AF] hover:text-white border-[#2E2E33]"
            }`}
            title="Toggle raw code"
          >
            <Code2 className="w-3 h-3" />
            <span>{showRaw ? "Visual View" : "View Code"}</span>
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(cleanCode);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="p-1.5 rounded-full bg-[#232326] hover:bg-[#2A2A2F] text-[#9CA3AF] hover:text-white border border-[#2E2E33] transition-colors"
            title="Copy diagram source"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Visual Block Body */}
      <div className="p-5 bg-[#0E0F12]">
        {isStreaming ? (
          <div className="flex items-center justify-center py-8 text-[#9CA3AF] text-xs gap-2">
            <div className="w-4 h-4 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
            <span>Generating workflow diagram...</span>
          </div>
        ) : showRaw || hasError ? (
          <div>
            {hasError && (
              <div className="mb-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Rendered as structured flowchart syntax:</span>
              </div>
            )}
            <pre className="p-3.5 rounded-xl bg-[#141519] border border-[#27272A] text-xs font-mono text-[#22D3EE] overflow-x-auto">
              <code>{cleanCode}</code>
            </pre>
          </div>
        ) : (
          <div ref={containerRef} className="flex justify-center overflow-x-auto min-h-[120px] items-center" />
        )}
      </div>
    </div>
  );
};

interface ChatWorkspaceProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  streamingStatus?: string;
  onSendMessage: (message: string) => void;
  onStopStreaming?: () => void;
  onNewChat: () => void;
  selectedSources: SourceDocument[];
  onCitationClick: (citation: Citation) => void;
  workspaceTitle?: string;
}

export const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({
  messages,
  isStreaming,
  streamingStatus,
  onSendMessage,
  onStopStreaming,
  selectedSources,
  onCitationClick,
  workspaceTitle = "MECH-G Master Documentation",
}) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isStreaming) {
        onSendMessage(input.trim());
        setInput("");
      }
    }
  };

  const samplePrompts = [
    "What is the step-by-step procedure for PRV-992-B valve seal replacement?",
    "What are the topics covered in the CAT 2 exam syllabus for probability and statistics?",
    "What are the mandatory OSHA 1910.147 Lockout/Tagout prerequisites for hydraulic servicing?",
    "Explain the Pitch Controller Power Board (PCB-PITCH-CTRL-V1) capacitor discharge safety steps.",
  ];

  return (
    <main className="h-full flex-1 flex flex-col bg-[#0B0B0C] overflow-hidden select-text relative px-4 lg:px-8">
      {/* Scrollable Center Content */}
      <div className="flex-1 overflow-y-auto pt-6 pb-28 space-y-6 max-w-3xl w-full mx-auto pr-1">
        {messages.length === 0 ? (
          /* Empty State: Clean typography on dark canvas */
          <div className="space-y-6 pt-2">
            <div>
              <h1 className="text-[28px] lg:text-[32px] font-normal text-white tracking-tight leading-tight">
                {workspaceTitle}
              </h1>
              <p className="text-xs text-[#8E8E93] mt-2 font-normal">
                {selectedSources.length} {selectedSources.length === 1 ? "source" : "sources"} · MECH-G Knowledge Base
              </p>
            </div>

            <div className="text-[13px] leading-[1.7] text-[#D1D5DB] space-y-4 font-normal">
              <p>
                Welcome to <strong>MECH-G</strong>, an industrial-grade multimodal AI knowledge workspace powered by
                the Open Knowledge Format (OKF) knowledge graph and Google Gemma intelligence.
              </p>
              <p>
                By indexing engineering specifications, uploaded curriculum guides, torque values, and OSHA 1910.147
                safety protocols into local graph nodes, MECH-G provides verifiable answers with deterministic citations.
              </p>
            </div>

            {/* Quick suggested prompt pills */}
            <div className="pt-2 border-t border-[#232328]">
              <p className="text-[11px] font-medium text-[#8E8E93] mb-3 uppercase tracking-wider">
                Suggested Inquiries
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(p)}
                    className="p-3 rounded-2xl bg-[#141519] hover:bg-[#1C1D23] border border-[#232328] hover:border-[#383C48] text-left text-xs text-[#E5E7EB] transition-all flex items-start gap-2.5 group"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#3B82F6] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{p}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-[#2563EB]/20 border border-[#3B82F6]/30 flex items-center justify-center shrink-0 mt-1">
                    <Cpu className="w-3.5 h-3.5 text-[#60A5FA]" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? "bg-[#2563EB] text-white shadow-md"
                      : "bg-[#18181A] border border-[#27272A] text-[#F4F4F5] shadow-lg"
                  }`}
                >
                  {/* Markdown Renderer with Diagram Separation & DOM Nesting Protection */}
                  <div className="prose prose-invert prose-xs max-w-none space-y-2">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        // Protect against <p> cannot contain <pre> nesting warnings
                        p({ children }) {
                          return <div className="mb-2 leading-relaxed">{children}</div>;
                        },
                        pre({ children }) {
                          return <div className="my-2">{children}</div>;
                        },
                        code({ node, inline, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || "");
                          const lang = match ? match[1].toLowerCase() : "";
                          const codeString = String(children).replace(/\n$/, "");

                          const isMermaid =
                            lang === "mermaid" ||
                            lang === "graph" ||
                            (!inline && (
                              codeString.trim().startsWith("graph ") ||
                              codeString.trim().startsWith("flowchart ") ||
                              codeString.trim().startsWith("sequenceDiagram") ||
                              codeString.trim().startsWith("stateDiagram") ||
                              codeString.trim().startsWith("classDiagram")
                            ));

                          if (isMermaid) {
                            return <MermaidRenderer code={codeString} isStreaming={isStreaming} />;
                          }

                          return !inline ? (
                            <pre className="p-3 rounded-xl bg-[#141519] border border-[#27272A] overflow-x-auto my-2 text-xs font-mono text-[#22D3EE]">
                              <code>{codeString}</code>
                            </pre>
                          ) : (
                            <code className="bg-[#232326] px-1.5 py-0.5 rounded text-[11px] font-mono text-[#A78BFA]" {...props}>
                              {children}
                            </code>
                          );
                        },
                        table({ children }) {
                          return (
                            <div className="overflow-x-auto my-3 border border-[#27272A] rounded-xl">
                              <table className="w-full text-left text-xs border-collapse">{children}</table>
                            </div>
                          );
                        },
                        th({ children }) {
                          return <th className="bg-[#1E1F23] p-2 font-bold text-white border-b border-[#27272A]">{children}</th>;
                        },
                        td({ children }) {
                          return <td className="p-2 border-b border-[#27272A]/50 text-[#D1D5DB]">{children}</td>;
                        },
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>

                  {/* Verified Citations Pill Bar */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3.5 pt-2.5 border-t border-[#27272A] flex flex-wrap gap-1.5 items-center">
                      <span className="text-[10px] font-medium text-[#8E8E93] mr-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#34D399]" />
                        Citations:
                      </span>
                      {msg.citations.map((cite, idx) => (
                        <button
                          key={cite.citation_id || idx}
                          onClick={() => onCitationClick(cite)}
                          className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#232326] hover:bg-[#2A2A2F] border border-[#2E2E33] text-[11px] text-[#22D3EE] transition-all"
                          title={`${cite.source_name}\nExcerpt: ${cite.excerpt}`}
                        >
                          <span className="font-mono text-[9px] bg-[#22D3EE]/20 px-1 rounded text-[#22D3EE]">
                            {idx + 1}
                          </span>
                          <span className="truncate max-w-[140px] text-white">
                            {cite.source_name}
                          </span>
                          <ExternalLink className="w-2.5 h-2.5 text-[#9CA3AF]" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Streaming Status Indicator */}
        {isStreaming && (
          <div className="flex items-center gap-2 text-xs text-[#8E8E93] animate-pulse pl-2">
            <div className="w-2 h-2 rounded-full bg-[#22D3EE]" />
            <span>{streamingStatus || "MECH-G is synthesizing response..."}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Bottom Composer Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
        <div className="max-w-3xl mx-auto pointer-events-auto">
          {/* Pill Composer */}
          <div className="notebooklm-composer px-4 py-2 flex items-center gap-3">
            <button
              onClick={() => alert("MECH-G Reasoning Mode: Industrial Grounding Active")}
              className="p-1 rounded-full text-[#8E8E93] hover:text-white transition-colors"
              title="Tune parameters"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Ask MECH-G a question or create something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none text-[13px] text-white placeholder-[#8E8E93] focus:outline-none resize-none max-h-32 py-1"
            />

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#8E8E93] font-normal hidden sm:inline whitespace-nowrap">
                {selectedSources.length} {selectedSources.length === 1 ? "source" : "sources"}
              </span>

              {isStreaming ? (
                <button
                  onClick={onStopStreaming}
                  className="w-7 h-7 rounded-full bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 flex items-center justify-center transition-colors"
                  title="Stop generation"
                >
                  <Square className="w-3 h-3" />
                </button>
              ) : (
                <button
                  disabled={!input.trim()}
                  onClick={() => {
                    if (input.trim()) {
                      onSendMessage(input.trim());
                      setInput("");
                    }
                  }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    input.trim()
                      ? "bg-white text-black hover:bg-[#E5E7EB]"
                      : "bg-[#2A2B31] text-[#71717A] cursor-not-allowed"
                  }`}
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <p className="text-[10px] text-center text-[#71717A] mt-2 select-none">
            MECH-G Knowledge Engine can make mistakes, so verify critical safety and engineering steps.
          </p>
        </div>
      </div>
    </main>
  );
};
