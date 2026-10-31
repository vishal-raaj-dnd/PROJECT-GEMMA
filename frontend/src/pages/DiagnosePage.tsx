import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Upload,
  Mic,
  MicOff,
  Video,
  Play,
  Pause,
  Trash2,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Wrench,
  Clock,
  Bookmark,
  Printer,
  FileText,
  AlertTriangle,
  Lock,
  Unlock,
  Check,
  ArrowRight,
  RotateCcw,
  UserCheck,
  Info
} from "lucide-react";
import { useMecG } from "../context/MecGContext";
import { SAMPLE_QUERIES } from "../data/sampleData";
import { DiagnosticResponse, CitationVerification } from "../types/diagnostic";

export const DiagnosePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeDiagnosis,
    setActiveDiagnosis,
    runDiagnosticExecution,
    signSafetyInterlock,
    currentUser,
    showToast
  } = useMecG();

  // Input states
  const [selectedImage, setSelectedImage] = useState<string | null>(SAMPLE_QUERIES[0].imagePath);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [queryText, setQueryText] = useState(SAMPLE_QUERIES[0].queryText);
  const [partNumber, setPartNumber] = useState("PRV-992-B");
  const [serialNumber, setSerialNumber] = useState("SN-YAW-98441");
  const [operatingMeasurement, setOperatingMeasurement] = useState("Yaw Holding Pressure: 142 bar (Target: 190 bar)");

  // Equipment Specs
  const [equipmentCategory, setEquipmentCategory] = useState("Wind Turbine Hydraulics");
  const [equipmentName, setEquipmentName] = useState("Vestas V112 3.3MW Turbine");
  const [manufacturer, setManufacturer] = useState("Vestas Wind Systems");
  const [modelNumber, setModelNumber] = useState("V112-3.3MW");
  const [subsystem, setSubsystem] = useState("Nacelle Yaw Circuit");

  // Audio Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [hasAudioClip, setHasAudioClip] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioTimerRef = useRef<any>(null);

  // Video State (Experimental)
  const [hasVideo, setHasVideo] = useState(false);

  // Execution Progress Stages
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeStage, setActiveStage] = useState(0);

  // Safety Gate states
  const [technicianBadge, setTechnicianBadge] = useState("TECH-ALEX-409");
  const [safetyChecked, setSafetyChecked] = useState<Record<string, boolean>>({});

  // Inspection modal
  const [inspectedCitation, setInspectedCitation] = useState<CitationVerification | null>(null);

  const stages = [
    "Analysing hardware visual & acoustic inputs...",
    "Identifying component P/N & serial metadata...",
    "Searching local in-memory OKF graph...",
    "Retrieving grounded manufacturer service manuals...",
    "Evaluating OSHA 1910.147 Lockout/Tagout prerequisites...",
    "Synthesizing zero-hallucination repair plan..."
  ];

  // Audio recording handlers
  const startRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    setRecordingDuration(0);
    audioTimerRef.current = setInterval(() => {
      setRecordingDuration((d) => d + 1);
    }, 1000);
  };

  const pauseRecording = () => {
    setIsPaused(!isPaused);
    if (!isPaused) {
      clearInterval(audioTimerRef.current);
    } else {
      audioTimerRef.current = setInterval(() => {
        setRecordingDuration((d) => d + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    clearInterval(audioTimerRef.current);
    setHasAudioClip(true);
    setQueryText((prev) =>
      prev
        ? `${prev}\n[Acoustic Note: Fluid cavitation hiss accompanied by 15% pressure decay]`
        : "Fluid cavitation hiss accompanied by 15% pressure decay around PRV collar."
    );
    showToast("Technician audio recording captured");
  };

  const deleteRecording = () => {
    setHasAudioClip(false);
    setRecordingDuration(0);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setImageFile(f);
      setSelectedImage(URL.createObjectURL(f));
      showToast("Uploaded equipment photograph");
    }
  };

  const canRun = Boolean(selectedImage || queryText.trim() || hasAudioClip);

  const handleRunDiagnosis = async () => {
    if (!canRun) return;
    setIsExecuting(true);
    setActiveStage(0);

    // Animate stages
    for (let i = 0; i < stages.length; i++) {
      setActiveStage(i);
      await new Promise((r) => setTimeout(r, 350));
    }

    try {
      const res = await runDiagnosticExecution({
        imageFile,
        queryText: queryText.trim() || "Visual fault identification",
        equipmentInfo: { name: equipmentName, subsystem }
      });
      setActiveDiagnosis(res);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSafetyConfirm = async () => {
    if (!activeDiagnosis) return;
    const confirmedItems = Object.keys(safetyChecked).filter((k) => safetyChecked[k]);
    await signSafetyInterlock(activeDiagnosis.diagnostic_id, technicianBadge, confirmedItems);
  };

  // Checklist helper
  const allPrereqs = activeDiagnosis?.safety_interlocks.prerequisites || [];
  const checklistItems = allPrereqs.flatMap((p) =>
    p.checklist.map((item, idx) => ({ id: `${p.id}_${idx}`, text: item, title: p.title }))
  );
  const isAllChecked =
    checklistItems.length > 0 && checklistItems.every((item) => safetyChecked[item.id]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#252B35]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F2B544]/15 text-[#F2B544] border border-[#F2B544]/30 font-bold uppercase">
              MULTIMODAL DIAGNOSTIC WORKSTATION
            </span>
            <span className="text-xs font-mono text-[#929AA6]">MEC-G Core Operational Module</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            New Equipment Diagnosis
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#929AA6] max-w-2xl">
            Describe the problem or provide visual evidence to investigate a fault. Supported by local multimodal vision, audio acoustics, and deterministic graph traversal.
          </p>
        </div>

        {activeDiagnosis && (
          <button
            onClick={() => setActiveDiagnosis(null)}
            className="btn-slate-secondary flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>Reset Diagnostic Inputs</span>
          </button>
        )}
      </div>

      {/* 4 INPUT METHODS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card A: Image Input */}
        <div className="card-industrial p-5 space-y-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#F2B544] uppercase font-bold flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                <span>A. Image Input</span>
              </span>
              <span className="text-[9px] font-mono text-[#647082]">JPEG/PNG/WEBP</span>
            </div>

            {selectedImage ? (
              <div className="mt-3 relative rounded-xl overflow-hidden aspect-video border border-[#252B35] bg-[#101318]">
                <img src={selectedImage} alt="Hardware Subject" className="w-full h-full object-cover" />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 p-1 rounded-md bg-black/80 text-white hover:text-red-400 cursor-pointer text-xs"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="mt-3 p-6 rounded-xl border border-dashed border-[#252B35] text-center bg-[#101318]">
                <Camera className="w-6 h-6 text-[#647082] mx-auto mb-1.5" />
                <p className="text-[10px] font-mono text-[#929AA6]">No photo loaded</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <label className="flex-1 btn-slate-secondary py-1.5 text-center rounded-lg text-xs font-mono cursor-pointer flex items-center justify-center gap-1">
              <Upload className="w-3 h-3 text-[#F2B544]" />
              <span>Upload Photo</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            <button
              onClick={() => {
                setSelectedImage(SAMPLE_QUERIES[0].imagePath);
                showToast("Loaded sample valve photograph");
              }}
              className="px-2.5 py-1.5 rounded-lg bg-[#101318] hover:bg-[#252B35] border border-[#252B35] text-[10px] font-mono text-[#F2B544] cursor-pointer"
              title="Load Pre-loaded Sample"
            >
              Sample
            </button>
          </div>
        </div>

        {/* Card B: Audio Input (with waveform) */}
        <div className="card-industrial p-5 space-y-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#F2B544] uppercase font-bold flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5" />
                <span>B. Audio Input</span>
              </span>
              <span className="text-[9px] font-mono text-[#647082]">WAV/MP3/WebM</span>
            </div>

            <div className="mt-3 p-4 rounded-xl bg-[#101318] border border-[#252B35] text-center space-y-2">
              {isRecording ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-1 h-8">
                    {[30, 70, 45, 90, 60, 100, 40, 85, 55, 95].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 bg-[#F2B544] rounded-full animate-pulse"
                        style={{ height: `${h}%`, animationDelay: `${i * 80}ms` }}
                      />
                    ))}
                  </div>
                  <div className="text-xs font-mono text-red-400 font-bold">
                    Recording: {recordingDuration}s
                  </div>
                </div>
              ) : hasAudioClip ? (
                <div className="space-y-1.5">
                  <div className="text-xs font-mono text-[#279C70] flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Audio Clip Attached ({recordingDuration || 14}s)</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="p-1.5 rounded-md bg-[#252B35] text-white hover:text-[#F2B544] cursor-pointer"
                    >
                      {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={deleteRecording}
                      className="p-1.5 rounded-md bg-[#252B35] text-red-400 hover:bg-red-500/20 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-2">
                  <Mic className="w-6 h-6 text-[#647082] mx-auto mb-1 opacity-70" />
                  <span className="text-[10px] font-mono text-[#929AA6]">Microphone Standby</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="w-full btn-slate-secondary py-1.5 rounded-lg text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5 text-[#F2B544]" />
                <span>Start Recording</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <button
                  onClick={pauseRecording}
                  className="flex-1 px-2 py-1.5 rounded-lg bg-[#252B35] text-xs font-mono text-white"
                >
                  {isPaused ? "Resume" : "Pause"}
                </button>
                <button
                  onClick={stopRecording}
                  className="flex-1 px-2 py-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500 text-xs font-mono font-bold"
                >
                  Stop
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Card C: Text Description Input */}
        <div className="card-industrial p-5 space-y-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#F2B544] uppercase font-bold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>C. Text Description</span>
              </span>
              <span className="text-[9px] font-mono text-[#647082]">Required</span>
            </div>

            <textarea
              rows={4}
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder="Describe the equipment problem, observed symptoms, measurements or error code..."
              className="mt-3 w-full p-2.5 rounded-xl bg-[#101318] border border-[#252B35] text-xs font-mono text-white placeholder-[#647082] focus:outline-none focus:border-[#F2B544] leading-relaxed resize-none"
            />
          </div>

          <div className="text-[10px] font-mono text-[#647082]">
            Character Count: {queryText.length}
          </div>
        </div>

        {/* Card D: Video Input (Feature Flagged) */}
        <div className="card-industrial p-5 space-y-3.5 flex flex-col justify-between opacity-80 border-dashed">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#929AA6] uppercase font-bold flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" />
                <span>D. Video Input</span>
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#252B35] text-[#F2B544]">
                EXPERIMENTAL
              </span>
            </div>

            <div className="mt-3 p-6 rounded-xl bg-[#101318] border border-[#252B35] text-center space-y-2">
              <Video className="w-7 h-7 text-[#647082] mx-auto opacity-50" />
              <p className="text-[10px] font-mono text-[#929AA6] leading-snug">
                Frame-by-frame extraction in active development.
              </p>
            </div>
          </div>

          <button
            onClick={() => showToast("Video input is feature-flagged until frame extractor pipeline is finalized")}
            className="w-full p-2 rounded-lg bg-[#101318] border border-[#252B35] text-xs font-mono text-[#647082] cursor-not-allowed"
          >
            Upload Video (Disabled)
          </button>
        </div>
      </div>

      {/* EQUIPMENT METADATA PANEL */}
      <div className="card-industrial p-6 space-y-4">
        <div className="text-xs font-mono text-[#F2B544] uppercase tracking-wider font-bold">
          Equipment Information & Operational Parameters
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-mono text-[#929AA6] uppercase mb-1">Equipment Name</label>
            <input
              type="text"
              value={equipmentName}
              onChange={(e) => setEquipmentName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#101318] border border-[#252B35] text-xs font-mono text-white focus:outline-none focus:border-[#F2B544]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono text-[#929AA6] uppercase mb-1">Subsystem / Circuit</label>
            <input
              type="text"
              value={subsystem}
              onChange={(e) => setSubsystem(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#101318] border border-[#252B35] text-xs font-mono text-white focus:outline-none focus:border-[#F2B544]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono text-[#929AA6] uppercase mb-1">Part Number (Optional)</label>
            <input
              type="text"
              value={partNumber}
              onChange={(e) => setPartNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#101318] border border-[#252B35] text-xs font-mono text-white focus:outline-none focus:border-[#F2B544]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono text-[#929AA6] uppercase mb-1">Serial Number</label>
            <input
              type="text"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#101318] border border-[#252B35] text-xs font-mono text-white focus:outline-none focus:border-[#F2B544]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-[#929AA6] uppercase mb-1">Observed Operational Measurements</label>
          <input
            type="text"
            value={operatingMeasurement}
            onChange={(e) => setOperatingMeasurement(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#101318] border border-[#252B35] text-xs font-mono text-white focus:outline-none focus:border-[#F2B544]"
          />
        </div>

        {/* PROMINENT AMBER RUN DIAGNOSIS BUTTON */}
        <div className="pt-2">
          <button
            onClick={handleRunDiagnosis}
            disabled={!canRun || isExecuting}
            className="w-full btn-amber-primary py-3.5 px-6 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-40"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isExecuting ? "Executing Edge Diagnostic Engine..." : "Run Diagnosis"}</span>
          </button>
        </div>
      </div>

      {/* ANIMATED PROCESSING STAGES */}
      {isExecuting && (
        <div className="card-industrial p-6 space-y-4 border-[#F2B544]/60 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#F2B544] font-bold">DIAGNOSTIC PIPELINE ACTIVE</span>
            <span className="text-white">Stage {activeStage + 1} of {stages.length}</span>
          </div>

          <div className="w-full h-2 rounded-full bg-[#101318] overflow-hidden">
            <div
              className="h-full bg-[#F2B544] transition-all duration-300"
              style={{ width: `${((activeStage + 1) / stages.length) * 100}%` }}
            />
          </div>

          <div className="text-xs font-mono text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F2B544] animate-ping" />
            <span>{stages[activeStage]}</span>
          </div>
        </div>
      )}

      {/* STRUCTURED DIAGNOSIS RESULTS (Section 9) */}
      {activeDiagnosis && !isExecuting && (
        <div className="space-y-6">
          {/* Result Header */}
          <div className="card-industrial p-6 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#252B35]">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F2B544]/15 text-[#F2B544] border border-[#F2B544]/30 uppercase">
                    DIAGNOSIS #{activeDiagnosis.diagnostic_id}
                  </span>
                  <span className="text-xs font-mono text-[#929AA6]">{activeDiagnosis.timestamp}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {activeDiagnosis.detected_component.name}
                </h2>
                <div className="text-xs font-mono text-[#F2B544] mt-0.5">
                  Part Number: {activeDiagnosis.detected_component.part_number || "PRV-992-B"}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-[#101318] border border-[#252B35] text-xs font-mono">
                  <span className="text-[#647082]">Model Confidence: </span>
                  <strong className="text-[#279C70]">
                    {Math.round(activeDiagnosis.detected_component.confidence * 100)}%
                  </strong>
                </div>
              </div>
            </div>

            {/* Defect Analysis & Optical Findings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#101318] border border-[#252B35] space-y-2">
                <span className="text-[10px] font-mono text-[#F2B544] uppercase font-bold">Observed Defect:</span>
                <p className="text-xs text-[#F3F4F6] leading-relaxed">
                  {activeDiagnosis.detected_component.observed_defect}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#101318] border border-[#252B35] space-y-2">
                <span className="text-[10px] font-mono text-[#279C70] uppercase font-bold">Verified Micro-Indicators:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeDiagnosis.detected_component.visual_indicators.map((vi, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-[#171A21] border border-[#252B35] text-[11px] font-mono text-white flex items-center gap-1"
                    >
                      <Check className="w-3 h-3 text-[#279C70]" />
                      <span>{vi}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Evidence Section: CitationAuditor references */}
            <div className="pt-2 space-y-2.5">
              <div className="text-xs font-mono uppercase text-[#929AA6] font-bold">
                CitationAuditor Grounded Sources:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeDiagnosis.citations.map((c, idx) => (
                  <div
                    key={idx}
                    onClick={() => setInspectedCitation(c)}
                    className="p-3 rounded-xl bg-[#101318] border border-[#252B35] hover:border-[#F2B544] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="text-[#F2B544] font-semibold truncate">{c.node_path.split("/").pop()}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#279C70]/15 text-[#279C70]">VERIFIED</span>
                    </div>
                    <p className="text-[11px] font-mono text-[#929AA6] truncate">"{c.exact_source_text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MANDATORY SAFETY REQUIREMENTS PANEL (Section 9) */}
          <div className="card-industrial p-6 sm:p-7 border-[#D99A29]/60 relative overflow-hidden space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#252B35]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase">
                      OSHA 1910.147 Mandatory Gate
                    </span>
                    <span className="text-xs font-mono text-[#647082]">Zero-Energy Isolation</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    Lockout/Tagout (LOTO) Interlock
                  </h3>
                </div>
              </div>

              <div className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold flex items-center gap-2 ${
                activeDiagnosis.safety_interlocks.acknowledged
                  ? "bg-[#279C70]/15 border-[#279C70]/40 text-[#279C70]"
                  : "bg-amber-500/15 border-amber-500/40 text-amber-400"
              }`}>
                {activeDiagnosis.safety_interlocks.acknowledged ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>
                  {activeDiagnosis.safety_interlocks.acknowledged ? "GATE CONFIRMED & UNLOCKED" : "REPAIR INSTRUCTIONS LOCKED"}
                </span>
              </div>
            </div>

            {!activeDiagnosis.safety_interlocks.acknowledged && (
              <>
                <p className="text-xs sm:text-sm text-[#929AA6] leading-relaxed">
                  Under high-pressure fluid and electrical isolation regulations, mechanical procedures are electronically blocked until you confirm each prerequisite step:
                </p>

                <div className="space-y-2.5">
                  {checklistItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() =>
                        setSafetyChecked((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                      }
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        safetyChecked[item.id]
                          ? "bg-[#252B35] border-[#F2B544] text-white"
                          : "bg-[#101318] border-[#252B35] text-[#929AA6] hover:border-amber-500/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(safetyChecked[item.id])}
                        onChange={() => {}}
                        className="mt-0.5 accent-[#F2B544] rounded"
                      />
                      <div className="text-xs sm:text-sm leading-relaxed">
                        <span className="font-semibold text-white block">{item.text}</span>
                        <span className="text-[10px] font-mono text-[#647082] mt-0.5 block">
                          Protocol: {item.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Technician ID & Signoff CTA */}
                <div className="p-4 rounded-xl bg-[#101318] border border-[#252B35] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <UserCheck className="w-4 h-4 text-[#929AA6] shrink-0" />
                    <span className="text-xs font-mono text-[#929AA6]">Technician Badge:</span>
                    <input
                      type="text"
                      value={technicianBadge}
                      onChange={(e) => setTechnicianBadge(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-[#171A21] border border-[#252B35] text-xs font-mono text-white focus:outline-none focus:border-[#F2B544]"
                    />
                  </div>

                  <button
                    onClick={handleSafetyConfirm}
                    disabled={!isAllChecked || !technicianBadge.trim()}
                    className="w-full sm:w-auto btn-amber-primary px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Confirm Zero-Energy State & Unlock Repair</span>
                  </button>
                </div>
              </>
            )}

            {activeDiagnosis.safety_interlocks.acknowledged && (
              <div className="p-3.5 rounded-xl bg-[#279C70]/10 border border-[#279C70]/30 text-xs font-mono text-[#279C70] flex items-center justify-between">
                <span>Signed by: {activeDiagnosis.safety_interlocks.acknowledged_by || currentUser}</span>
                <span>Timestamp: {activeDiagnosis.safety_interlocks.acknowledged_at || "Verified"}</span>
              </div>
            )}
          </div>

          {/* REPAIR PLAN (Unlocked after Safety Signoff) */}
          {activeDiagnosis.safety_interlocks.acknowledged && activeDiagnosis.remediation_plan && (
            <div className="card-industrial p-6 sm:p-7 border-[#279C70]/40 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#252B35]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#279C70]/15 text-[#279C70] border border-[#279C70]/30 uppercase">
                      UNLOCKED REPAIR PROCEDURE
                    </span>
                    <span className="text-xs font-mono text-[#929AA6]">Manufacturer Directives</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {activeDiagnosis.remediation_plan.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#101318] border border-[#252B35] text-xs font-mono text-[#929AA6]">
                  <Clock className="w-3.5 h-3.5 text-[#F2B544]" />
                  <span>Est: {activeDiagnosis.remediation_plan.estimated_duration_minutes} mins</span>
                </div>
              </div>

              {/* Required Calibrated Tools */}
              <div>
                <div className="text-xs font-mono uppercase text-[#929AA6] font-bold mb-2">
                  Required Calibrated Tooling:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeDiagnosis.remediation_plan.required_tools.map((t, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[#101318] border border-[#252B35] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white block">{t.name}</span>
                        {t.spec && <span className="text-[11px] font-mono text-[#929AA6]">{t.spec}</span>}
                      </div>
                      <Wrench className="w-3.5 h-3.5 text-[#F2B544]" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Step by Step Remediation Sequence */}
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase text-[#929AA6] font-bold">
                  Step-by-Step Remediation Sequence:
                </div>
                {activeDiagnosis.remediation_plan.steps.map((st) => (
                  <div
                    key={st.step_number}
                    className="p-4 rounded-xl bg-[#101318] border border-[#252B35] flex items-start gap-4"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#252B35] text-[#F2B544] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {st.step_number}
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-xs sm:text-sm text-white leading-relaxed">{st.instruction}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        {st.torque_spec && (
                          <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#F2B544]/20 text-[#F2B544] border border-[#F2B544]/40">
                            TORQUE: {st.torque_spec}
                          </span>
                        )}
                        {st.hazard_warning && (
                          <span className="px-2.5 py-0.5 rounded text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-400" />
                            {st.hazard_warning}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Result Actions Bar */}
              <div className="pt-4 border-t border-[#252B35] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigate(`/notebooks`);
                      showToast("Session saved to research notebook");
                    }}
                    className="btn-amber-primary px-4 py-2 rounded-xl text-xs font-bold"
                  >
                    Save to Notebook
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="btn-slate-secondary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Report</span>
                  </button>
                </div>

                <button
                  onClick={() => setActiveDiagnosis(null)}
                  className="text-xs font-mono text-[#929AA6] hover:text-white"
                >
                  End Session
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Citation Inspector Modal */}
      {inspectedCitation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101318]/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-[#171A21] border border-[#252B35] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#252B35] pb-3">
              <span className="text-xs font-mono text-[#F2B544] font-bold">CitationAuditor Source Inspector</span>
              <button onClick={() => setInspectedCitation(null)} className="text-white hover:text-red-400">×</button>
            </div>
            <div className="text-xs font-mono text-[#929AA6]">
              File: <strong className="text-white">{inspectedCitation.node_path}</strong>
            </div>
            <div className="p-4 rounded-xl bg-[#101318] border border-[#252B35] text-xs font-mono text-white leading-relaxed">
              "{inspectedCitation.exact_source_text}"
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setInspectedCitation(null)}
                className="btn-amber-primary px-4 py-2 rounded-xl text-xs font-bold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

