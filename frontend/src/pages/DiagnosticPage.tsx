import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { TopToolbar } from "../components/workspace/TopToolbar";
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Mic,
  MicOff,
  Wrench,
  ShieldAlert,
  ShieldCheck,
  FileText,
  Lock,
  Unlock,
  ChevronRight,
  ExternalLink,
  Printer,
  X,
  Gauge,
  Thermometer,
  Layers,
  Check
} from "lucide-react";
import { DiagnosticResponse, CitationVerification } from "../types/diagnostic";
import { SAMPLE_QUERIES, SampleQueryItem } from "../data/sampleData";
import { ApiService } from "../services/api";

export const DiagnosticPage: React.FC = () => {
  const location = useLocation();

  // State
  const [selectedAsset, setSelectedAsset] = useState("Vestas V112 Nacelle Pitch System");
  const [selectedImage, setSelectedImage] = useState<string | null>(SAMPLE_QUERIES[0].imagePath);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [queryText, setQueryText] = useState<string>(SAMPLE_QUERIES[0].queryText);
  const [activeSampleId, setActiveSampleId] = useState<string>(SAMPLE_QUERIES[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticResponse | null>(null);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);

  // Telemetry Sliders
  const [pressureBar, setPressureBar] = useState(210);
  const [tempCelsius, setTempCelsius] = useState(68);

  // Remediation Steps Completion
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Modals
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [showWorkOrderModal, setShowWorkOrderModal] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<CitationVerification | null>(null);

  // Safety Gate Modal Inputs
  const [badgeId, setBadgeId] = useState("TECH-8842-OFFSHORE");
  const [safetyChecklist, setSafetyChecklist] = useState<string[]>([]);

  // Pre-load initial sample image
  useEffect(() => {
    const preload = async () => {
      try {
        const res = await fetch(SAMPLE_QUERIES[0].imagePath);
        if (res.ok) {
          const blob = await res.blob();
          const file = new File([blob], "sample_valve_leak.webp", { type: blob.type || "image/webp" });
          setImageFile(file);
        }
      } catch (err) {
        console.warn("Could not preload sample image file:", err);
      }
    };
    preload();
  }, []);

  // Handle incoming navigation state
  useEffect(() => {
    if (location.state) {
      if (location.state.sampleId) {
        const found = SAMPLE_QUERIES.find((s) => s.id === location.state.sampleId);
        if (found) {
          handleSelectSample(found);
          return;
        }
      }
      if (location.state.initialQuery) {
        setQueryText(location.state.initialQuery);
      }
      if (location.state.uploadedFile) {
        const file = location.state.uploadedFile as File;
        setImageFile(file);
        setSelectedImage(URL.createObjectURL(file));
        setActiveSampleId("");
        setResult(null);
      }
    }
  }, [location.state]);

  const handleSelectSample = async (sample: SampleQueryItem) => {
    setActiveSampleId(sample.id);
    setSelectedImage(sample.imagePath);
    setQueryText(sample.queryText);
    setResult(null);
    setCompletedSteps([]);

    try {
      const res = await fetch(sample.imagePath);
      if (res.ok) {
        const blob = await res.blob();
        const filename = sample.imagePath.split("/").pop() || "sample.webp";
        const file = new File([blob], filename, { type: blob.type || "image/webp" });
        setImageFile(file);
      }
    } catch {
      setImageFile(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setSelectedImage(URL.createObjectURL(file));
      setActiveSampleId("");
      setResult(null);
      setCompletedSteps([]);
    }
  };

  const toggleAudioRecording = () => {
    if (!isRecordingAudio) {
      setIsRecordingAudio(true);
      setTimeout(() => {
        setQueryText((prev) => `${prev} Acoustic acoustic telemetry: 14.2 kHz harmonic chatter detected.`);
        setIsRecordingAudio(false);
      }, 1800);
    } else {
      setIsRecordingAudio(false);
    }
  };

  const handleRunDiagnostic = async () => {
    setIsLoading(true);
    try {
      const res = await ApiService.runDiagnostic(imageFile, queryText);
      setResult(res);
      setCompletedSteps([]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSafetyAck = async () => {
    if (!result) return;
    setIsLoading(true);
    try {
      await ApiService.acknowledgeSafety(result.diagnostic_id, badgeId, safetyChecklist);
      setResult({
        ...result,
        safety_interlocks: {
          ...result.safety_interlocks,
          acknowledged: true,
          acknowledged_by: badgeId,
          acknowledged_at: new Date().toISOString(),
        },
      });
      setShowSafetyModal(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStepCompleted = (stepNum: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNum) ? prev.filter((s) => s !== stepNum) : [...prev, stepNum]
    );
  };

  return (
    <div className="h-screen flex flex-col bg-[#0B0B0C] text-[#F5F7FF] overflow-hidden select-none">
      {/* Persistent Navigation Toolbar */}
      <TopToolbar activeModule="diagnostics" title="Field Diagnostic Workstation" />

      {/* Floating Island Layout */}
      <main className="flex-1 p-3 pt-1 flex gap-3 min-h-0 overflow-hidden">
        {/* Left Island: Multimodal Telemetry Input & Controls */}
        <section className="w-[450px] lg:w-[490px] flex-shrink-0 bg-[#18181A] rounded-[24px] border border-[#27272A] p-4 flex flex-col justify-between overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            {/* Header & Asset Selector */}
            <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FBBF24]/10 border border-[#FBBF24]/30 flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-[#FBBF24]" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider">Telemetry Input</h2>
                  <p className="text-[10px] text-[#9CA3AF]">Edge Multimodal Sensor Collector</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 text-[10px] font-mono font-medium">
                Live Sensor Hub
              </span>
            </div>

            {/* Asset Picker */}
            <div>
              <label className="block text-[11px] font-medium text-[#9CA3AF] mb-1.5">Target Equipment Asset</label>
              <select
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                className="w-full bg-[#141518] border border-[#27272A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#22D3EE] transition-colors"
              >
                <option value="Vestas V112 Nacelle Pitch System">Vestas V112 Nacelle Pitch System</option>
                <option value="Hydraulic HPU-350 Primary Loop">Hydraulic HPU-350 Primary Loop</option>
                <option value="Siemens SGT-400 Gas Turbine">Siemens SGT-400 Gas Turbine</option>
                <option value="Parker Hannifin D1FP Proportional Valve Block">Parker Hannifin D1FP Valve Block</option>
              </select>
            </div>

            {/* Quick Preset Fault Scenarios */}
            <div>
              <label className="block text-[11px] font-medium text-[#9CA3AF] mb-1.5">Preset Hardware Scenarios</label>
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_QUERIES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className={`p-2 rounded-xl text-left border transition-all text-xs cursor-pointer ${
                      activeSampleId === sample.id
                        ? "bg-[#24252B] border-[#22D3EE] text-white shadow-sm"
                        : "bg-[#141518] border-[#27272A] text-[#9CA3AF] hover:text-white hover:bg-[#1E1F24]"
                    }`}
                  >
                    <div className="font-semibold truncate">{sample.title}</div>
                    <div className="text-[10px] text-[#6B7280] truncate mt-0.5">{sample.component}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Inspection Image Upload */}
            <div>
              <label className="block text-[11px] font-medium text-[#9CA3AF] mb-1.5 flex items-center justify-between">
                <span>Hardware Component Imagery</span>
                {selectedImage && (
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setImageFile(null);
                      setActiveSampleId("");
                    }}
                    className="text-[10px] text-rose-400 hover:underline cursor-pointer"
                  >
                    Clear Image
                  </button>
                )}
              </label>

              {selectedImage ? (
                <div className="relative rounded-2xl overflow-hidden border border-[#27272A] bg-black/40 group">
                  <img
                    src={selectedImage}
                    alt="Inspection Capture"
                    className="w-full h-36 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[10px] font-mono text-white/90 bg-black/60 px-2 py-0.5 rounded-full border border-white/10">
                      High-Res Optical Capture Ready
                    </span>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#27272A] hover:border-[#22D3EE]/50 rounded-2xl cursor-pointer bg-[#141518] hover:bg-[#1A1B20] transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Camera className="w-6 h-6 text-[#9CA3AF] mb-1.5" />
                    <p className="text-xs text-[#9CA3AF]">
                      <span className="font-semibold text-white">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-[10px] text-[#6B7280] mt-0.5">PNG, JPG, WEBP up to 20MB</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              )}
            </div>

            {/* Telemetry Sliders: Pressure & Temperature */}
            <div className="bg-[#141518] border border-[#27272A] rounded-xl p-3 space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#9CA3AF] flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                    Hydraulic Manifold Pressure
                  </span>
                  <span className="font-mono font-bold text-white bg-[#24252B] px-2 py-0.5 rounded text-[11px]">
                    {pressureBar} bar
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="350"
                  value={pressureBar}
                  onChange={(e) => setPressureBar(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#27272A] rounded-lg appearance-none cursor-pointer accent-[#22D3EE]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#9CA3AF] flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                    Reservoir Fluid Temperature
                  </span>
                  <span className="font-mono font-bold text-white bg-[#24252B] px-2 py-0.5 rounded text-[11px]">
                    {tempCelsius} °C
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="120"
                  value={tempCelsius}
                  onChange={(e) => setTempCelsius(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#27272A] rounded-lg appearance-none cursor-pointer accent-[#FBBF24]"
                />
              </div>
            </div>

            {/* Query & Acoustic Telemetry */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-medium text-[#9CA3AF] mb-1.5">
                <span>Field Symptom & Fault Description</span>
                <button
                  type="button"
                  onClick={toggleAudioRecording}
                  className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border transition-colors cursor-pointer ${
                    isRecordingAudio
                      ? "bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse"
                      : "bg-[#1E1F23] text-[#9CA3AF] border-[#27272A] hover:text-white"
                  }`}
                >
                  {isRecordingAudio ? <Mic className="w-3 h-3 text-rose-400" /> : <MicOff className="w-3 h-3" />}
                  <span>{isRecordingAudio ? "Listening (Harmonic FFT)..." : "Record Audio Notes"}</span>
                </button>
              </div>
              <textarea
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                rows={3}
                placeholder="Describe fault symptoms, observed weeping, or error codes..."
                className="w-full bg-[#141518] border border-[#27272A] rounded-xl p-2.5 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#22D3EE] transition-colors resize-none"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-3 border-t border-[#27272A]">
            <button
              onClick={handleRunDiagnostic}
              disabled={isLoading}
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#3B82F6] via-[#22D3EE] to-[#8B5CF6] text-white text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Gemma Multimodal Evaluating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Hardware Diagnostic Evaluation</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Right Island: Remediation Analysis & Interactive Safety Gates */}
        <section className="flex-1 bg-[#18181A] rounded-[24px] border border-[#27272A] p-5 flex flex-col overflow-y-auto custom-scrollbar">
          {!result ? (
            /* Standby State */
            <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-[#1E1F24] border border-[#27272A] flex items-center justify-center text-[#22D3EE] mb-4 shadow-xl">
                <Wrench className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Ready for Telemetry Evaluation</h3>
              <p className="text-xs text-[#9CA3AF] mt-2 leading-relaxed">
                Configure your equipment asset, attach inspection photography or acoustic signals, and run the diagnostic. Gemma Multimodal will cross-reference the Open Knowledge Format graph and enforce OSHA 1910.147 interlocks.
              </p>

              <div className="grid grid-cols-2 gap-3 mt-6 w-full text-left">
                <div className="p-3 rounded-xl bg-[#141518] border border-[#27272A]">
                  <div className="text-[10px] font-mono text-[#6B7280] uppercase">Citation Guardrail</div>
                  <div className="text-xs font-semibold text-white mt-0.5">Strict AST Closed-World</div>
                </div>
                <div className="p-3 rounded-xl bg-[#141518] border border-[#27272A]">
                  <div className="text-[10px] font-mono text-[#6B7280] uppercase">Lockout/Tagout Gate</div>
                  <div className="text-xs font-semibold text-amber-400 mt-0.5">OSHA 1910.147 Enforced</div>
                </div>
              </div>
            </div>
          ) : (
            /* Diagnostic Result */
            <div className="space-y-5 animate-in fade-in">
              {/* Top Banner: Identified Defect */}
              <div className="p-4 rounded-2xl bg-[#141518] border border-[#27272A] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-mono font-bold">
                      FAULT DETECTED
                    </span>
                    <span className="text-xs font-mono text-[#9CA3AF]">
                      ID: {result.diagnostic_id.slice(0, 12)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {result.detected_component.name}
                  </h3>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">
                    {result.detected_component.observed_defect}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] text-[#6B7280] font-mono">CONFIDENCE</div>
                    <div className="text-sm font-mono font-bold text-emerald-400">
                      {(result.detected_component.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                  {result.detected_component.part_number && (
                    <div className="px-3 py-1.5 rounded-xl bg-[#1E1F24] border border-[#27272A] text-right">
                      <div className="text-[9px] text-[#6B7280] font-mono">OEM PART NO.</div>
                      <div className="text-xs font-mono font-bold text-cyan-300">
                        {result.detected_component.part_number}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* OSHA 1910.147 Safety Interlock Banner */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  result.safety_interlocks.acknowledged
                    ? "bg-emerald-950/20 border-emerald-500/30"
                    : "bg-amber-950/20 border-amber-500/30"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        result.safety_interlocks.acknowledged
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-amber-500/10 text-amber-400 animate-pulse"
                      }`}
                    >
                      {result.safety_interlocks.acknowledged ? (
                        <ShieldCheck className="w-5 h-5" />
                      ) : (
                        <ShieldAlert className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        OSHA 1910.147 Lockout/Tagout Gate
                        {result.safety_interlocks.acknowledged ? (
                          <span className="text-[10px] text-emerald-400 font-mono font-normal">
                            (VERIFIED BY {result.safety_interlocks.acknowledged_by})
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-400 font-mono font-normal">
                            (ACTION REQUIRED)
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                        {result.safety_interlocks.acknowledged
                          ? "Hazardous hydraulic & electrical energy verified isolated. Procedural steps unlocked."
                          : "High hazardous hydraulic pressure detected. Sign safety badge to unlock execution steps."}
                      </p>
                    </div>
                  </div>

                  {!result.safety_interlocks.acknowledged && (
                    <button
                      onClick={() => setShowSafetyModal(true)}
                      className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Sign OSHA Safety Gate</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Remediation Plan & Steps */}
              {result.remediation_plan && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-cyan-400" />
                        <span>{result.remediation_plan.title}</span>
                      </h4>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">
                        Estimated duration: {result.remediation_plan.estimated_duration_minutes || 45} minutes
                      </p>
                    </div>

                    <button
                      onClick={() => setShowWorkOrderModal(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white bg-[#1E1F24] hover:bg-[#272830] border border-[#27272A] transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Export Work Order</span>
                    </button>
                  </div>

                  {/* Required Tools Pills */}
                  {result.remediation_plan.required_tools.length > 0 && (
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-[11px] text-[#9CA3AF] font-medium mr-1">Required Calibrated Tooling:</span>
                      {result.remediation_plan.required_tools.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-[#141518] border border-[#27272A] text-[11px] text-white font-mono flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" />
                          {t.name}
                          {t.spec && <span className="text-[#9CA3AF]">({t.spec})</span>}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Steps Checklist */}
                  <div className="space-y-2.5">
                    {result.remediation_plan.steps.map((st) => {
                      const isDone = completedSteps.includes(st.step_number);
                      const isLocked = !result.safety_interlocks.acknowledged && st.step_number > 1;

                      return (
                        <div
                          key={st.step_number}
                          onClick={() => {
                            if (!isLocked) toggleStepCompleted(st.step_number);
                          }}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                            isLocked
                              ? "opacity-40 bg-[#141518]/50 border-[#27272A] cursor-not-allowed"
                              : isDone
                              ? "bg-emerald-950/15 border-emerald-500/30 text-white"
                              : "bg-[#141518] border-[#27272A] hover:border-[#3A3B43]"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold ${
                                isDone
                                  ? "bg-emerald-500 text-black"
                                  : isLocked
                                  ? "bg-[#27272A] text-[#9CA3AF]"
                                  : "bg-[#1E1F24] border border-[#27272A] text-white"
                              }`}
                            >
                              {isDone ? <Check className="w-3.5 h-3.5" /> : st.step_number}
                            </div>

                            <div className="flex-1 text-xs">
                              <p className={`font-medium ${isDone ? "line-through text-[#9CA3AF]" : "text-white"}`}>
                                {st.instruction}
                              </p>

                              <div className="flex flex-wrap gap-2 mt-2 items-center text-[10px]">
                                {st.torque_spec && (
                                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                                    TORQUE: {st.torque_spec}
                                  </span>
                                )}
                                {st.tool_required && (
                                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
                                    TOOL: {st.tool_required}
                                  </span>
                                )}
                                {st.hazard_warning && (
                                  <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-mono">
                                    WARNING: {st.hazard_warning}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Citations Footer Chips */}
              {result.citations.length > 0 && (
                <div className="pt-4 border-t border-[#27272A]">
                  <div className="text-[11px] font-medium text-[#9CA3AF] mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    <span>Verified OKF Knowledge Citations ({result.citations.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.citations.map((c, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedCitation(c)}
                        className="px-2.5 py-1 rounded-lg bg-[#141518] hover:bg-[#1E1F24] border border-[#27272A] hover:border-[#22D3EE] text-[10px] font-mono text-[#22D3EE] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>{c.raw_citation}</span>
                        <ExternalLink className="w-2.5 h-2.5 text-[#9CA3AF]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Safety Gate Sign-Off Modal */}
      {showSafetyModal && result && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#18181A] border border-[#27272A] rounded-[24px] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272A] mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">OSHA 1910.147 Safety Gate Authorization</h3>
              </div>
              <button
                onClick={() => setShowSafetyModal(false)}
                className="text-[#9CA3AF] hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-[#9CA3AF] leading-relaxed">
                Before physical maintenance begins on{" "}
                <span className="text-white font-semibold">{result.detected_component.name}</span>, verify all
                hazardous energy sources have been locked, tagged, and bled to zero-energy state.
              </p>

              <div>
                <label className="block text-[#9CA3AF] mb-1 font-medium">Technician Safety Badge ID</label>
                <input
                  type="text"
                  value={badgeId}
                  onChange={(e) => setBadgeId(e.target.value)}
                  className="w-full bg-[#141518] border border-[#27272A] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#22D3EE]"
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={safetyChecklist.includes("pressure_bleed")}
                    onChange={(e) => {
                      if (e.target.checked) setSafetyChecklist([...safetyChecklist, "pressure_bleed"]);
                      else setSafetyChecklist(safetyChecklist.filter((x) => x !== "pressure_bleed"));
                    }}
                    className="w-4 h-4 rounded bg-[#141518] border-[#27272A] accent-[#22D3EE]"
                  />
                  <span className="text-[#D1D5DB]">Verified hydraulic loop bled to 0 PSI via bleed valve V-02</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={safetyChecklist.includes("electrical_loto")}
                    onChange={(e) => {
                      if (e.target.checked) setSafetyChecklist([...safetyChecklist, "electrical_loto"]);
                      else setSafetyChecklist(safetyChecklist.filter((x) => x !== "electrical_loto"));
                    }}
                    className="w-4 h-4 rounded bg-[#141518] border-[#27272A] accent-[#22D3EE]"
                  />
                  <span className="text-[#D1D5DB]">480V ACB breaker tagged with red padlock & danger placard</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={safetyChecklist.includes("ppe_verified")}
                    onChange={(e) => {
                      if (e.target.checked) setSafetyChecklist([...safetyChecklist, "ppe_verified"]);
                      else setSafetyChecklist(safetyChecklist.filter((x) => x !== "ppe_verified"));
                    }}
                    className="w-4 h-4 rounded bg-[#141518] border-[#27272A] accent-[#22D3EE]"
                  />
                  <span className="text-[#D1D5DB]">Arc-flash Category 2 face shield & 1000V gloves donned</span>
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-[#27272A]">
              <button
                onClick={() => setShowSafetyModal(false)}
                className="px-4 py-2 rounded-full bg-[#1E1F24] hover:bg-[#272830] text-[#9CA3AF] text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSafetyAck}
                disabled={isLoading}
                className="px-5 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Confirm & Unlock Remediation Steps</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Field Work Order Export Modal */}
      {showWorkOrderModal && result && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#18181A] border border-[#27272A] rounded-[24px] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272A] mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Field Service Work Order</h3>
              </div>
              <button
                onClick={() => setShowWorkOrderModal(false)}
                className="text-[#9CA3AF] hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono bg-[#141518] p-4 rounded-2xl border border-[#27272A]">
              <div className="flex justify-between border-b border-[#27272A] pb-2">
                <span className="text-[#9CA3AF]">WORK ORDER #:</span>
                <span className="text-white font-bold">WO-2026-MECHG-891</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">ASSET:</span>
                <span className="text-white">{selectedAsset}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">FAULT COMPONENT:</span>
                <span className="text-rose-400">{result.detected_component.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">SAFETY CLEARANCE:</span>
                <span className={result.safety_interlocks.acknowledged ? "text-emerald-400" : "text-amber-400"}>
                  {result.safety_interlocks.acknowledged ? `SIGNED (${result.safety_interlocks.acknowledged_by})` : "UNVERIFIED"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">STEPS COMPLETED:</span>
                <span className="text-white">
                  {completedSteps.length} of {result.remediation_plan?.steps.length || 0}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowWorkOrderModal(false)}
                className="px-4 py-2 rounded-full bg-[#1E1F24] hover:bg-[#272830] text-white text-xs font-medium cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2 rounded-full bg-[#22D3EE] hover:bg-[#06B6D4] text-black text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Citation Detail Modal */}
      {selectedCitation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#18181A] border border-[#27272A] rounded-[24px] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272A] mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                Citation Verification Details
              </h3>
              <button
                onClick={() => setSelectedCitation(null)}
                className="text-[#9CA3AF] hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] text-[#9CA3AF] uppercase block font-mono">Citation Reference</span>
                <span className="font-mono text-[#22D3EE] font-bold">{selectedCitation.raw_citation}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#9CA3AF] uppercase block font-mono">Node Path</span>
                <span className="font-mono text-[#9CA3AF]">{selectedCitation.node_path}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#9CA3AF] uppercase block font-mono">Verified Source Excerpt</span>
                <div className="p-3 bg-[#141518] rounded-xl border border-[#27272A] text-white leading-relaxed font-sans mt-1">
                  {selectedCitation.exact_source_text}
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedCitation(null)}
                className="px-4 py-1.5 rounded-full bg-[#232326] hover:bg-[#2A2A2F] text-white text-xs font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
