import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HelpCircle,
  BookOpen,
  Keyboard,
  ShieldAlert,
  WifiOff,
  Cpu,
  ChevronRight,
  ExternalLink,
  PhoneCall,
  CheckCircle2,
  Play,
  Terminal,
  FileText
} from "lucide-react";

export const HelpSupportPage: React.FC = () => {
  const [activeWorkflow, setActiveWorkflow] = useState<number>(0);

  const workflows = [
    {
      title: "1. Diagnosing Failed Hardware",
      subtitle: "Multimodal Diagnostic Engine (Image, Audio, Text)",
      desc: "Capture a field image of a broken valve, seal, or gearbox. Record acoustic abnormal whining with the live microphone. The local Gemma INT4 model identifies the component, fault code, and torque specifications grounded in manuals.",
      steps: [
        "Navigate to 'Diagnose Equipment' in the left sidebar.",
        "Upload or capture an image of the affected component, or record an acoustic audio sample.",
        "Enter equipment context (e.g. Turbine Model, Subsystem) or select from sample presets.",
        "Click 'Execute Field Diagnosis' to trigger the 6-stage offline pipeline.",
        "Review identified component, confidence score, and verified source citations.",
        "Sign the OSHA 1910.147 LOTO safety gate to unlock torque specs and repair procedures.",
      ],
      link: "/diagnose",
      cta: "Open Diagnostic Engine",
    },
    {
      title: "2. Researching with Engineering Notebooks",
      subtitle: "NotebookLM-Inspired Field Knowledge Workspace",
      desc: "Create an equipment-specific research notebook, select relevant technical sources, and ask complex engineering questions with 100% grounded citations.",
      steps: [
        "Go to 'My Notebooks' or click '+ New Notebook'.",
        "Add PDF, DOCX, XLSX, or Markdown manuals into the left Sources panel.",
        "Ask targeted questions in the central chat (e.g. 'What is the bolt torque sequence for flange B?').",
        "View highlighted source citations in the right panel and pin critical findings to your Notes.",
        "Generate Studio artifacts like executive briefings or quick field guides.",
      ],
      link: "/notebooks",
      cta: "Explore Notebooks",
    },
    {
      title: "3. Importing & Indexing Technical Libraries",
      subtitle: "OmniOKF Document Compiler",
      desc: "Ingest entire service libraries across PDF, Word, Excel, PowerPoint, and Markdown formats. The pipeline parses, extracts tokens, structures 200-500 token chunks, and links nodes to the knowledge graph.",
      steps: [
        "Navigate to 'Knowledge Library' from the sidebar.",
        "Drag and drop documents or click 'Select Engineering Documents'.",
        "Watch the 8-stage visual pipeline track token extraction and chunk generation in real time.",
        "Inspect individual chunk boundaries and part numbers via the Chunk Inspector modal.",
      ],
      link: "/library",
      cta: "Open Knowledge Library",
    },
    {
      title: "4. Traversing the Equipment Knowledge Graph",
      subtitle: "NetworkX Relational Subsystem Mapping",
      desc: "Explore physical and procedural connections between turbine models, pitch subsystems, fault codes, required tools, and regulatory safety procedures.",
      steps: [
        "Select 'Knowledge Graph' in the left sidebar.",
        "Use the interactive SVG canvas to pan, zoom, and select nodes.",
        "Filter nodes by category (Machines, Subsystems, Components, Fault Codes, Safety).",
        "Click any node to view upstream relationships, connected edges, and repair manual links.",
      ],
      link: "/graph",
      cta: "Inspect Knowledge Graph",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#252B35]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#252B35] text-xs font-mono text-[#F2B544] mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FIELD OPERATIONS HANDBOOK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Help & Technical Support</h1>
          <p className="text-sm text-[#929AA6] mt-1">
            Operational reference guide, guided diagnostic workflows, keyboard shortcuts, and emergency protocols.
          </p>
        </div>
      </div>

      {/* Guided Workflows Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Workflow Selector */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-mono uppercase text-[#929AA6] mb-1">Standard Operating Procedures</div>
          {workflows.map((wf, idx) => (
            <div
              key={idx}
              onClick={() => setActiveWorkflow(idx)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                activeWorkflow === idx
                  ? "bg-[#F2B544]/15 border-[#F2B544] text-white"
                  : "bg-[#171A21] border-[#252B35] text-[#929AA6] hover:border-[#F2B544]/50"
              }`}
            >
              <div className="font-bold text-xs text-white">{wf.title}</div>
              <div className="text-[11px] text-[#929AA6] mt-1">{wf.subtitle}</div>
            </div>
          ))}
        </div>

        {/* Right Active Workflow Details */}
        <div className="lg:col-span-8 bg-[#171A21] border border-[#252B35] rounded-xl p-6 space-y-5">
          <div>
            <h3 className="text-lg font-bold text-white">{workflows[activeWorkflow].title}</h3>
            <p className="text-xs font-mono text-[#F2B544] mt-0.5">{workflows[activeWorkflow].subtitle}</p>
            <p className="text-xs text-[#929AA6] mt-2 leading-relaxed">{workflows[activeWorkflow].desc}</p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="text-xs font-mono uppercase text-[#929AA6]">Sequential Operational Steps</div>
            <div className="space-y-2">
              {workflows[activeWorkflow].steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-[#101318] border border-[#252B35] flex items-start gap-3 text-xs text-white"
                >
                  <span className="w-5 h-5 rounded bg-[#252B35] text-[#F2B544] font-mono text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Link
              to={workflows[activeWorkflow].link}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#F2B544] hover:bg-[#F2B544]/90 text-[#101318] text-xs font-bold transition-all shadow-md"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{workflows[activeWorkflow].cta}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2-Column: Keyboard Shortcuts & Emergency Field Protocols */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Keyboard Shortcuts */}
        <div className="bg-[#171A21] border border-[#252B35] rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Keyboard className="w-4 h-4 text-[#F2B544]" />
            <span>Keyboard Shortcuts Cheat Sheet</span>
          </div>
          <p className="text-xs text-[#929AA6]">
            Fast navigation shortcuts built for rapid field technician operation on rugged keyboards.
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-[#101318] border border-[#252B35] flex items-center justify-between">
              <span className="text-white font-medium">Open Global Command Palette / Search</span>
              <kbd className="px-2 py-1 rounded bg-[#252B35] text-[#F2B544] font-mono text-xs">Ctrl + K</kbd>
            </div>
            <div className="p-2.5 rounded-lg bg-[#101318] border border-[#252B35] flex items-center justify-between">
              <span className="text-white font-medium">Submit Chat Prompt / Query</span>
              <kbd className="px-2 py-1 rounded bg-[#252B35] text-white font-mono text-xs">Enter</kbd>
            </div>
            <div className="p-2.5 rounded-lg bg-[#101318] border border-[#252B35] flex items-center justify-between">
              <span className="text-white font-medium">Insert New Line in Query Composer</span>
              <kbd className="px-2 py-1 rounded bg-[#252B35] text-white font-mono text-xs">Shift + Enter</kbd>
            </div>
            <div className="p-2.5 rounded-lg bg-[#101318] border border-[#252B35] flex items-center justify-between">
              <span className="text-white font-medium">Dismiss Active Dialog / Modal Inspector</span>
              <kbd className="px-2 py-1 rounded bg-[#252B35] text-white font-mono text-xs">Esc</kbd>
            </div>
          </div>
        </div>

        {/* Industrial Field Emergency Checklist */}
        <div className="bg-[#171A21] border border-[#252B35] rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-[#D94D4D] font-bold text-sm">
            <ShieldAlert className="w-4 h-4" />
            <span>Emergency Field Procedure Protocols</span>
          </div>
          <p className="text-xs text-[#929AA6]">
            In the event of an uncontrolled energy release, arc flash, or mechanical failure on site:
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-[#101318] border border-[#D94D4D]/30 flex items-start gap-2.5">
              <span className="font-mono text-[#D94D4D] font-bold">01.</span>
              <span className="text-white">Depress equipment Emergency Stop (E-Stop) pushbutton immediately.</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#101318] border border-[#D94D4D]/30 flex items-start gap-2.5">
              <span className="font-mono text-[#D94D4D] font-bold">02.</span>
              <span className="text-white">Evacuate immediate rotational arc / high-pressure hydraulic spray radius.</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#101318] border border-[#D94D4D]/30 flex items-start gap-2.5">
              <span className="font-mono text-[#D94D4D] font-bold">03.</span>
              <span className="text-white">Radio site supervisor on VHF Channel 16 / UHF Emergency Band.</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#101318] border border-[#D94D4D]/30 flex items-start gap-2.5">
              <span className="font-mono text-[#D94D4D] font-bold">04.</span>
              <span className="text-white">Log incident event in MEC-G Audit Trail under your Technician Badge ID.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

