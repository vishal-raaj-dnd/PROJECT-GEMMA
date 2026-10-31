import React, { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  BookOpen,
  Plus,
  Upload,
  Search,
  CheckCircle2,
  FileText,
  Trash2,
  Send,
  Camera,
  Mic,
  MicOff,
  Video,
  Copy,
  RefreshCw,
  Bookmark,
  Share2,
  ChevronRight,
  ExternalLink,
  Layers,
  Wrench,
  ShieldCheck,
  Sparkles,
  Info,
  Check,
  FileCode,
  AlertTriangle
} from "lucide-react";
import { useMecG } from "../context/MecGContext";
import { CitationVerification } from "../types/diagnostic";

export const NotebookWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    notebooks,
    addChatMessage,
    addNotebookSource,
    toggleNotebookSource,
    addNotebookNote,
    deleteNotebookNote,
    showToast
  } = useMecG();

  const currentNotebook = notebooks.find((nb) => nb.id === id) || notebooks[0];

  // Composer states
  const [inputText, setInputText] = useState("");
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedImageFile, setAttachedImageFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sourceSearch, setSourceSearch] = useState("");
  const [rightPanelTab, setRightPanelTab] = useState<"sources" | "citations" | "notes" | "knowledge" | "studio">("sources");
  const [selectedCitationDetail, setSelectedCitationDetail] = useState<CitationVerification | null>(null);

  // New Note Modal / Inline input
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingTimerRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentNotebook.messages, isGenerating]);

  // Audio recording simulation
  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } else {
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
      setInputText((prev) =>
        prev
          ? `${prev} [Technician voice note transcribed: Inspecting relief valve collar for hydraulic weepage]`
          : "Inspecting relief valve collar for hydraulic weepage and verifying torque ratings under manual section 4."
      );
      showToast("Voice note transcribed & attached");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setAttachedImageFile(f);
      setAttachedImage(URL.createObjectURL(f));
      showToast("Attached hardware photograph to message");
    }
  };

  const handleSourceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      addNotebookSource(currentNotebook.id, e.target.files[0]);
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim() && !attachedImage) return;

    const userText = inputText.trim();
    const imgPreview = attachedImage;

    // Add user message
    addChatMessage(currentNotebook.id, {
      sender: "user",
      text: userText || "Analyzing uploaded component image",
      attachedImage: imgPreview || undefined
    });

    setInputText("");
    setAttachedImage(null);
    setAttachedImageFile(null);
    setIsGenerating(true);

    // Simulate grounded assistant reasoning
    setTimeout(() => {
      let reply = `Based on the attached service manuals for **${currentNotebook.equipmentName}**, `;
      if (userText.toLowerCase().includes("torque") || userText.toLowerCase().includes("prv")) {
        reply += `the calibrated fastener torque for the M10 hex socket head cap screws is exactly **35 Nm (+/- 1.5 Nm)**. Tighten alternating cross-diagonally with a calibrated 1/2" drive torque wrench.\n\n*Prerequisite:* Bleed accumulator return NV-03 to 0.0 bar before loosening.`;
      } else if (userText.toLowerCase().includes("loto") || userText.toLowerCase().includes("safety")) {
        reply += `OSHA 1910.147 requires de-energizing main pump breaker CB-4, padlocking supply valve HV-01, and manual gauge PG-02 inspection showing 0.0 bar zero-energy isolation state.`;
      } else {
        reply += `the system identifies ${currentNotebook.subsystem} as the operational node. Recommended procedure is to inspect Viton 90-durometer seals and verify return line backpressure does not exceed 10 bar.`;
      }

      addChatMessage(currentNotebook.id, {
        sender: "assistant",
        text: reply,
        citations: [
          {
            citation_id: "cite-grounded-1",
            raw_citation: "[^procedures/valve_seal_replacement.md#reassembly]",
            node_path: "procedures/valve_seal_replacement.md",
            heading: "disassembly",
            exact_source_text: "Tighten 4x M10 hex socket head cap screws to 35 Nm in an alternating cross-diagonal sequence.",
            verification_status: "verified"
          }
        ]
      });
      setIsGenerating(false);
    }, 1200);
  };

  const handleSaveNote = () => {
    if (!noteTitle.trim()) return;
    addNotebookNote(currentNotebook.id, {
      title: noteTitle.trim(),
      content: noteContent.trim() || "No additional content recorded.",
      category: "finding"
    });
    setNoteTitle("");
    setNoteContent("");
    setIsAddingNote(false);
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col space-y-3">
      {/* Top Workspace Breadcrumb & Header */}
      <div className="flex items-center justify-between px-2 pb-2 border-b border-[#252B35] shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to="/notebooks"
            className="text-xs font-mono text-[#929AA6] hover:text-white flex items-center gap-1"
          >
            <span>Notebooks</span>
            <ChevronRight className="w-3 h-3 text-[#647082]" />
          </Link>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white tracking-tight">{currentNotebook.name}</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#171A21] border border-[#252B35] text-[#F2B544]">
              {currentNotebook.category}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#647082]">
          <span>Asset: {currentNotebook.equipmentName}</span>
          <span>•</span>
          <span className="text-[#279C70] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Local Graph Linked</span>
          </span>
        </div>
      </div>

      {/* Three-Panel Industrial Notebook Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">
        
        {/* ========================================================
            LEFT PANEL: SOURCES (3 cols)
            - Add Sources button
            - Upload documents
            - Source list & icons
            - Status indicators
            - Search & selection
           ======================================================== */}
        <div className="lg:col-span-3 card-industrial p-4 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 flex flex-col min-h-0">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#252B35]">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-white">
                <FileText className="w-4 h-4 text-[#F2B544]" />
                <span>Sources ({currentNotebook.sources.length})</span>
              </div>

              <label className="p-1 rounded-lg bg-[#101318] hover:bg-[#252B35] border border-[#252B35] text-[#F2B544] cursor-pointer" title="Add Source Document">
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <input type="file" onChange={handleSourceFileUpload} className="hidden" />
              </label>
            </div>

            {/* Source Search Bar */}
            <div className="py-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#647082] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={sourceSearch}
                  onChange={(e) => setSourceSearch(e.target.value)}
                  placeholder="Search sources..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#101318] border border-[#252B35] text-[11px] font-mono text-white placeholder-[#647082] focus:outline-none focus:border-[#F2B544]"
                />
              </div>
            </div>

            {/* Source Items List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {currentNotebook.sources
                .filter((s) => s.name.toLowerCase().includes(sourceSearch.toLowerCase()))
                .map((src) => (
                  <div
                    key={src.id}
                    onClick={() => toggleNotebookSource(currentNotebook.id, src.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                      src.selected
                        ? "bg-[#101318] border-[#F2B544]/60 shadow-sm"
                        : "bg-[#101318]/50 border-[#252B35] opacity-60 hover:opacity-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={src.selected}
                      onChange={() => {}}
                      className="mt-0.5 accent-[#F2B544] rounded"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-white truncate">{src.name}</div>
                      <div className="text-[10px] font-mono text-[#929AA6] flex items-center justify-between mt-1">
                        <span>{src.size} • {src.pages}p</span>
                        <span className="text-[#279C70] flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Indexed</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

              {currentNotebook.sources.length === 0 && (
                <div className="p-8 text-center text-xs font-mono text-[#647082]">
                  No sources attached. Click + to add OEM technical documents.
                </div>
              )}
            </div>
          </div>

          {/* Add Source CTA Bar */}
          <div className="pt-3 border-t border-[#252B35]">
            <label className="w-full btn-slate-secondary flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-[#F2B544]" />
              <span>Upload Document</span>
              <input type="file" onChange={handleSourceFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* ========================================================
            CENTER PANEL: AI ASSISTANT CHAT (6 cols)
            - Conversation history
            - Grounded answer cards with citation chips
            - Rich composer (Image, audio recording/waveform, text)
            - Copy, retry, save answer actions
           ======================================================== */}
        <div className="lg:col-span-6 card-industrial p-4 flex flex-col justify-between overflow-hidden">
          {/* Chat Messages Stream */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {currentNotebook.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div className="text-[10px] font-mono text-[#647082] mb-1 px-1">
                  {msg.sender === "user" ? "Field Technician" : "MEC-G Diagnostic Engine"} • {msg.timestamp}
                </div>

                <div
                  className={`p-4 rounded-2xl max-w-xl text-xs leading-relaxed space-y-3 ${
                    msg.sender === "user"
                      ? "bg-[#F2B544]/15 border border-[#F2B544]/30 text-white"
                      : "bg-[#101318] border border-[#252B35] text-[#F3F4F6]"
                  }`}
                >
                  {msg.attachedImage && (
                    <div className="rounded-lg overflow-hidden border border-[#252B35] max-w-xs aspect-video">
                      <img src={msg.attachedImage} alt="Hardware Target" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Grounded Citation Chips */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="pt-2 border-t border-[#252B35] space-y-1.5">
                      <div className="text-[10px] font-mono text-[#F2B544] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Bookmark className="w-3 h-3" />
                        <span>Grounded Source Citations:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.citations.map((c, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setSelectedCitationDetail(c);
                              setRightPanelTab("citations");
                            }}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#171A21] border border-[#252B35] hover:border-[#F2B544] text-[#F2B544] flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>{c.node_path.split("/").pop()}</span>
                            <span className="text-[9px] text-[#279C70]">✓</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions row for Assistant messages */}
                  {msg.sender === "assistant" && (
                    <div className="pt-2 flex items-center gap-3 text-[10px] font-mono text-[#647082]">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(msg.text);
                          showToast("Copied answer to clipboard");
                        }}
                        className="hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                      <button
                        onClick={() => {
                          addNotebookNote(currentNotebook.id, {
                            title: `Saved: ${msg.text.slice(0, 30)}...`,
                            content: msg.text,
                            category: "finding"
                          });
                        }}
                        className="hover:text-[#F2B544] flex items-center gap-1 cursor-pointer"
                      >
                        <Bookmark className="w-3 h-3" />
                        <span>Save to Notes</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isGenerating && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#101318] border border-[#252B35] text-xs font-mono text-[#F2B544] max-w-xs animate-pulse">
                <Sparkles className="w-4 h-4" />
                <span>Interrogating local OKF graph & manuals...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Large Question Composer */}
          <div className="pt-3 border-t border-[#252B35] space-y-2">
            {/* Attached Image Preview Pill */}
            {attachedImage && (
              <div className="flex items-center gap-2 p-1.5 px-3 rounded-lg bg-[#101318] border border-[#F2B544]/40 max-w-xs text-xs font-mono">
                <img src={attachedImage} alt="Attachment" className="w-6 h-6 rounded object-cover" />
                <span className="text-white truncate">Hardware photograph attached</span>
                <button onClick={() => setAttachedImage(null)} className="text-red-400 hover:text-red-300 ml-auto cursor-pointer">
                  ×
                </button>
              </div>
            )}

            {/* Textarea Input */}
            <div className="p-2 rounded-xl bg-[#101318] border border-[#252B35] focus-within:border-[#F2B544] transition-colors">
              <textarea
                rows={2}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask MEC-G anything about your equipment, manuals or technical documents..."
                className="w-full bg-transparent border-none text-xs font-mono text-white placeholder-[#647082] focus:outline-none resize-none leading-relaxed"
              />

              {/* Composer Controls Bar */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  {/* Photo Attachment */}
                  <label className="p-1.5 rounded-lg text-[#929AA6] hover:text-[#F2B544] hover:bg-[#252B35] cursor-pointer" title="Attach Hardware Photograph">
                    <Camera className="w-4 h-4" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>

                  {/* Audio Recording / Transcribe */}
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      isRecording ? "bg-red-500/20 text-red-400 animate-pulse" : "text-[#929AA6] hover:text-[#F2B544] hover:bg-[#252B35]"
                    }`}
                    title={isRecording ? `Recording (${recordingSeconds}s)... Click to stop & transcribe` : "Record Hands-free Technician Note"}
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  {/* Video Input (Feature Flagged) */}
                  <button
                    type="button"
                    onClick={() => showToast("Video input is feature-flagged (experimental frame-extractor in development)")}
                    className="p-1.5 rounded-lg text-[#647082] hover:text-[#929AA6] hover:bg-[#252B35] cursor-pointer"
                    title="Video Input (Experimental)"
                  >
                    <Video className="w-4 h-4" />
                  </button>

                  {isRecording && (
                    <span className="text-[10px] font-mono text-red-400 font-bold animate-pulse">
                      Recording: {recordingSeconds}s (waveform active)
                    </span>
                  )}
                </div>

                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() && !attachedImage}
                  className="btn-amber-primary px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            RIGHT PANEL: KNOWLEDGE AND EVIDENCE (3 cols)
            Tabs:
            1. Sources: relevant source excerpts
            2. Citations: verified references
            3. Notes: saved technical findings
            4. Knowledge: related components & graph connections
            5. Studio: saved summaries and reports
           ======================================================== */}
        <div className="lg:col-span-3 card-industrial p-4 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 flex flex-col min-h-0">
            {/* Tabs Header */}
            <div className="flex items-center gap-1 pb-2 border-b border-[#252B35] overflow-x-auto text-[11px] font-mono">
              {(["sources", "citations", "notes", "knowledge", "studio"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setRightPanelTab(tab)}
                  className={`px-2.5 py-1 rounded-md capitalize transition-colors cursor-pointer ${
                    rightPanelTab === tab
                      ? "bg-[#F2B544]/20 text-[#F2B544] font-bold"
                      : "text-[#929AA6] hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto mt-3 space-y-3 pr-1">
              {/* Tab 1: Sources */}
              {rightPanelTab === "sources" && (
                <div className="space-y-2.5">
                  <div className="text-[10px] font-mono text-[#647082] uppercase font-bold">
                    Active Grounded Context
                  </div>
                  {currentNotebook.sources.map((s) => (
                    <div key={s.id} className="p-3 rounded-xl bg-[#101318] border border-[#252B35] space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-white">
                        <span className="truncate">{s.name}</span>
                        <span className="text-[10px] font-mono text-[#279C70]">Active</span>
                      </div>
                      <p className="text-[11px] text-[#929AA6] line-clamp-2">{s.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: Citations */}
              {rightPanelTab === "citations" && (
                <div className="space-y-2.5">
                  <div className="text-[10px] font-mono text-[#647082] uppercase font-bold">
                    Verified Technical Citations
                  </div>
                  <div className="p-3 rounded-xl bg-[#101318] border border-[#252B35] space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#F2B544]">
                      <span>valve_seal_replacement.md</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#279C70]/15 text-[#279C70]">100% VERIFIED</span>
                    </div>
                    <div className="text-[10px] font-mono text-[#647082]">Section: #disassembly</div>
                    <p className="text-[11px] font-mono text-[#F3F4F6] bg-[#171A21] p-2 rounded-lg border border-[#252B35]">
                      "Tighten 4x M10 hex socket head cap screws to 35 Nm in an alternating cross-diagonal sequence."
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 3: Notes */}
              {rightPanelTab === "notes" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#647082] uppercase font-bold">
                      Saved Findings ({currentNotebook.notes.length})
                    </span>
                    <button
                      onClick={() => setIsAddingNote(!isAddingNote)}
                      className="text-xs font-mono text-[#F2B544] hover:underline"
                    >
                      {isAddingNote ? "Cancel" : "+ Add Note"}
                    </button>
                  </div>

                  {isAddingNote && (
                    <div className="p-3 rounded-xl bg-[#101318] border border-[#F2B544]/60 space-y-2">
                      <input
                        type="text"
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        placeholder="Note Title (e.g. Torque rating)"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#171A21] border border-[#252B35] text-xs font-mono text-white placeholder-[#647082] focus:outline-none focus:border-[#F2B544]"
                      />
                      <textarea
                        rows={2}
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        placeholder="Technical note details..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#171A21] border border-[#252B35] text-xs font-mono text-white placeholder-[#647082] focus:outline-none focus:border-[#F2B544] resize-none"
                      />
                      <button
                        onClick={handleSaveNote}
                        className="w-full btn-amber-primary py-1.5 rounded-lg text-xs font-bold"
                      >
                        Save Note
                      </button>
                    </div>
                  )}

                  {currentNotebook.notes.map((n) => (
                    <div key={n.id} className="p-3 rounded-xl bg-[#101318] border border-[#252B35] space-y-1 relative group">
                      <div className="flex items-center justify-between text-xs font-bold text-white">
                        <span>{n.title}</span>
                        <button
                          onClick={() => deleteNotebookNote(currentNotebook.id, n.id)}
                          className="text-[#647082] hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[11px] text-[#929AA6]">{n.content}</p>
                      <span className="text-[9px] font-mono text-[#647082] block pt-1">{n.timestamp}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: Knowledge Graph Connections */}
              {rightPanelTab === "knowledge" && (
                <div className="space-y-2.5 text-xs font-mono">
                  <div className="text-[10px] text-[#647082] uppercase font-bold">
                    Connected Graph Entities
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#101318] border border-[#252B35] flex items-center justify-between">
                    <span className="text-[#F2B544]">components/proportional_relief_valve_v2.md</span>
                    <span className="text-[9px] text-[#279C70]">Node</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#101318] border border-[#252B35] flex items-center justify-between">
                    <span className="text-[#D99A29]">↳ safety/lockout_tagout_hydraulics.md</span>
                    <span className="text-[9px] text-[#D99A29]">Prereq</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#101318] border border-[#252B35] flex items-center justify-between">
                    <span className="text-[#279C70]">↳ procedures/valve_seal_replacement.md</span>
                    <span className="text-[9px] text-[#279C70]">Procedure</span>
                  </div>
                </div>
              )}

              {/* Tab 5: Studio */}
              {rightPanelTab === "studio" && (
                <div className="space-y-3">
                  <div className="text-[10px] font-mono text-[#647082] uppercase font-bold">
                    NotebookLM Studio Generators
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => showToast("Generated Audio Briefing summary for field briefing")}
                      className="p-2.5 rounded-xl bg-[#101318] border border-[#252B35] hover:border-[#F2B544] text-left text-xs transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#F2B544] mb-1" />
                      <div className="font-bold text-white text-[11px]">Audio Briefing</div>
                      <div className="text-[9px] text-[#929AA6]">5-min voice summary</div>
                    </button>
                    <button
                      onClick={() => showToast("Compiled Technical Study Guide")}
                      className="p-2.5 rounded-xl bg-[#101318] border border-[#252B35] hover:border-[#F2B544] text-left text-xs transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#F2B544] mb-1" />
                      <div className="font-bold text-white text-[11px]">Study Guide</div>
                      <div className="text-[9px] text-[#929AA6]">Key specs & torque</div>
                    </button>
                  </div>
                  {currentNotebook.studio.map((st) => (
                    <div key={st.id} className="p-3 rounded-xl bg-[#101318] border border-[#252B35] space-y-1">
                      <div className="text-xs font-bold text-white">{st.title}</div>
                      <p className="text-[11px] text-[#929AA6]">{st.summary}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

