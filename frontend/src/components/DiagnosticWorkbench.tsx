import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
  Camera, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  RefreshCw, 
  AlertCircle, 
  Mic, 
  MicOff,
  Wrench, 
  ShieldAlert, 
  ShieldCheck, 
  Bookmark, 
  FileText, 
  GitBranch, 
  ArrowRight, 
  Activity, 
  Terminal, 
  HardDrive,
  Info,
  Check,
  Zap,
  Lock,
  Unlock
} from "lucide-react";
import { DiagnosticResponse, CitationVerification } from "../types/diagnostic";
import { SAMPLE_QUERIES, SampleQueryItem } from "../data/sampleData";
import { ApiService } from "../services/api";
import { SafetyGateModal } from "./SafetyGateModal";
import { RemediationView } from "./RemediationView";
import { EvidenceDrawer } from "./EvidenceDrawer";

export const DiagnosticWorkbench: React.FC = () => {
  const location = useLocation();

  const [selectedImage, setSelectedImage] = useState<string | null>(SAMPLE_QUERIES[0].imagePath);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [queryText, setQueryText] = useState<string>(SAMPLE_QUERIES[0].queryText);
  const [activeSampleId, setActiveSampleId] = useState<string>(SAMPLE_QUERIES[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticResponse | null>(null);
  const [selectedCitation, setSelectedCitation] = useState<CitationVerification | null>(null);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);

  // Handle incoming navigation state from Landing Page search
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

  // Pre-load initial sample image as File object so it transmits real bytes to backend
  React.useEffect(() => {
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

  const handleSelectSample = async (sample: SampleQueryItem) => {
    setActiveSampleId(sample.id);
    setSelectedImage(sample.imagePath);
    setQueryText(sample.queryText);
    setResult(null);

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
    }
  };

  const toggleAudioRecording = () => {
    if (!isRecordingAudio) {
      setIsRecordingAudio(true);
      setTimeout(() => {
        setQueryText("High pressure decay on yaw circuit with radial fluid weeping around PRV-992-B hex collar.");
        setIsRecordingAudio(false);
      }, 1600);
    } else {
      setIsRecordingAudio(false);
    }
  };

  const handleRunDiagnostic = async () => {
    setIsLoading(true);
    try {
      const res = await ApiService.runDiagnostic(imageFile, queryText);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSafetyAcknowledge = async (technicianId: string, confirmedItems: string[]) => {
    if (!result) return;
    setIsLoading(true);
    try {
      await ApiService.acknowledgeSafety(result.diagnostic_id, technicianId, confirmedItems);
      setResult({
        ...result,
        safety_interlocks: {
          ...result.safety_interlocks,
          acknowledged: true,
          acknowledged_by: technicianId,
          acknowledged_at: new Date().toISOString(),
        },
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const activeSample = SAMPLE_QUERIES.find((s) => s.id === activeSampleId);

  return (
    <div id="workbench" className="space-y-6">
      {/* Three-Panel Industrial Diagnostic Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================
            LEFT / INPUT PANEL (cols: 12 -> 4 -> 3)
            - Equipment photograph upload
            - Audio / Voice input
            - Text fault description
            - Component / subsystem selector
            - Diagnostic submission
           ======================================================== */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-5">
          {/* Hardware Scenario Selector */}
          <div className="card-tech p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-[#3995F6] tracking-wider font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Diagnostic Scenarios</span>
              </span>
              <span className="text-[10px] font-mono text-[#6F809A]">Offline Samples</span>
            </div>

            <div className="space-y-2.5">
              {SAMPLE_QUERIES.map((s) => {
                const isSelected = activeSampleId === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleSelectSample(s)}
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? "bg-[#101D35] border-[#3995F6] shadow-sm shadow-[#1769C2]/20"
                        : "bg-[#060B18] border-[#1D3150] hover:border-[#3995F6]/40 hover:bg-[#0B1427]"
                    }`}
                  >
                    <img
                      src={s.imagePath}
                      alt={s.title}
                      className="w-12 h-12 rounded-lg object-cover border border-[#1D3150] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-mono font-bold text-[#3995F6] truncate">
                        {s.subsystem}
                      </div>
                      <div className="text-xs font-semibold text-[#F5F7FC] truncate">
                        {s.diagnostic.detected_component?.part_number || s.title}
                      </div>
                      <div className="text-[10px] text-[#6F809A] truncate mt-0.5">
                        {s.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hardware Visual Input Panel */}
          <div className="card-tech p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-[#9AAAC3] tracking-wider font-semibold flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#3995F6]" />
                <span>Visual Input</span>
              </span>
              
              <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#060B18] hover:bg-[#101D35] text-[11px] font-mono text-[#F5F7FC] transition-colors cursor-pointer border border-[#1D3150] hover:border-[#3995F6]/50">
                <Upload className="w-3 h-3 text-[#3995F6]" />
                <span>Upload</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            {selectedImage ? (
              <div className="relative rounded-xl overflow-hidden border border-[#1D3150] aspect-video bg-[#060B18] group">
                <img src={selectedImage} alt="Hardware Target" className="w-full h-full object-cover" />
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#060B18]/90 text-[10px] font-mono text-[#3995F6] border border-[#1D3150] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3995F6] animate-pulse" />
                  <span>Target Loaded</span>
                </div>
                {activeSample && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#060B18] via-[#060B18]/80 to-transparent p-2.5 text-[10px] font-mono text-[#9AAAC3]">
                    <span className="text-white font-semibold">{activeSample.subsystem}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#1D3150] p-8 text-center bg-[#060B18]">
                <Camera className="w-7 h-7 text-[#6F809A] mx-auto mb-2 opacity-60" />
                <p className="text-xs text-[#9AAAC3] font-mono">Select a scenario or upload a physical photograph.</p>
              </div>
            )}
          </div>

          {/* Fault Description & Voice Input */}
          <div className="card-tech p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono uppercase text-[#9AAAC3] tracking-wider font-semibold">
                Symptom / Voice Note
              </label>
              
              <button
                type="button"
                onClick={toggleAudioRecording}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono transition-all cursor-pointer border ${
                  isRecordingAudio
                    ? "bg-red-500/20 border-red-500 text-red-400 animate-pulse"
                    : "bg-[#060B18] border-[#1D3150] text-[#9AAAC3] hover:text-[#3995F6]"
                }`}
                title={isRecordingAudio ? "Recording voice note..." : "Record hands-free technician voice note"}
              >
                {isRecordingAudio ? <MicOff className="w-3 h-3 text-red-400" /> : <Mic className="w-3 h-3 text-[#3995F6]" />}
                <span>{isRecordingAudio ? "Listening..." : "Dictate"}</span>
              </button>
            </div>

            <textarea
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl bg-[#060B18] border border-[#1D3150] text-xs font-mono text-[#F5F7FC] placeholder-[#6F809A] focus:outline-none focus:border-[#3995F6] leading-relaxed resize-none transition-colors"
              placeholder="Describe observed hydraulic leaks, thermal scorch, or blink codes..."
            />

            {/* Diagnostic Submission Action */}
            <button
              onClick={handleRunDiagnostic}
              disabled={isLoading}
              className="w-full btn-primary-blue flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isLoading ? "Traversing OKF Graph & Gemma Engine..." : "Run Diagnostic Engine"}
              </span>
            </button>
          </div>
        </div>

        {/* ========================================================
            CENTER / MAIN WORKSPACE (cols: 12 -> 8 -> 6)
            - Equipment image & defect inspection
            - Identified component info & visual indicators
            - Diagnostic findings
            - Remediation sequence & torque ratings
            - Relevant knowledge graph preview snippet
           ======================================================== */}
        <div className="lg:col-span-8 xl:col-span-6 space-y-6">
          {result ? (
            <>
              {/* Detected Component Card */}
              <div className="card-tech p-6 space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1D3150]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1769C2]/20 text-[#3995F6] border border-[#3995F6]/40 uppercase">
                        DETECTED HARDWARE
                      </span>
                      {result.detected_component.part_number && (
                        <span className="text-xs font-mono font-bold text-white bg-[#101D35] px-2 py-0.5 rounded border border-[#1D3150]">
                          P/N: {result.detected_component.part_number}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-[#F5F7FC] mt-1.5 tracking-tight">
                      {result.detected_component.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#060B18] border border-[#1D3150] text-xs font-mono">
                    <span className="text-[#6F809A]">Match:</span>
                    <strong className="text-[#10B981] font-bold">
                      {Math.round(result.detected_component.confidence * 100)}%
                    </strong>
                  </div>
                </div>

                {/* Defect Analysis */}
                <div className="p-4 rounded-xl bg-[#060B18] border border-[#1D3150] space-y-2">
                  <div className="text-[11px] font-mono uppercase text-[#3995F6] font-semibold flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Visual Defect Diagnosis:</span>
                  </div>
                  <p className="text-xs font-mono text-[#9AAAC3] leading-relaxed">
                    {result.detected_component.observed_defect}
                  </p>
                </div>

                {/* Micro Visual Indicators */}
                {result.detected_component.visual_indicators.length > 0 && (
                  <div>
                    <div className="text-[10px] font-mono text-[#6F809A] uppercase tracking-wider mb-2">
                      Verified Optical Indicators:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.detected_component.visual_indicators.map((vi, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-[#101D35] text-[11px] font-mono text-[#F5F7FC] border border-[#1D3150] flex items-center gap-1.5"
                        >
                          <Check className="w-3 h-3 text-[#10B981]" />
                          <span>{vi}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Safety Gate or Remediation Plan */}
              {result.safety_interlocks.required && !result.safety_interlocks.acknowledged ? (
                <SafetyGateModal
                  safety={result.safety_interlocks}
                  onAcknowledge={handleSafetyAcknowledge}
                  isLoading={isLoading}
                />
              ) : (
                result.remediation_plan && (
                  <RemediationView
                    plan={result.remediation_plan}
                    citations={result.citations}
                    onSelectCitation={(c) => setSelectedCitation(c)}
                  />
                )
              )}

              {/* Relevant Knowledge Graph Visual Topology Snippet */}
              <div className="card-tech p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-[#3995F6]" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5F7FC]">
                      Traversed Subgraph Topology
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#6F809A]">
                    {result.active_subgraph_nodes.length} Nodes in RAM
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#060B18] border border-[#1D3150] space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="px-2.5 py-1 rounded-md bg-[#101D35] border border-[#1D3150] text-[#3995F6] font-semibold">
                      {result.detected_component.node_path}
                    </span>
                    <span className="text-[#6F809A]">↳ requires</span>
                    <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300">
                      safety/lockout_tagout_hydraulics.md
                    </span>
                    <span className="text-[#6F809A]">↳ leads to</span>
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      procedures/valve_seal_replacement.md
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-[#6F809A] pt-1">
                    Deterministic relative links prevent missing critical parent isolation requirements.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="card-tech p-16 text-center space-y-4 border-dashed border-[#1D3150]">
              <div className="w-14 h-14 rounded-2xl bg-[#101D35] border border-[#1D3150] flex items-center justify-center text-[#3995F6] mx-auto shadow-md">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-[#F5F7FC]">
                Diagnostic Workstation Standby
              </h3>
              <p className="text-xs sm:text-sm text-[#9AAAC3] max-w-md mx-auto leading-relaxed">
                Click <strong className="text-white">"Run Diagnostic Engine"</strong> in the left panel to execute multimodal component identification, traverse the local OKF graph, and enforce safety gates.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={handleRunDiagnostic}
                  className="btn-primary-blue px-5 py-2.5 rounded-xl text-xs font-semibold"
                >
                  Run Scenario Diagnosis
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            RIGHT / EVIDENCE PANEL (cols: 12 -> 12 -> 3)
            - Source documents & OKF nodes
            - Verified citation references list
            - Safety status & OSHA isolation
            - Downstream repair relationships
           ======================================================== */}
        <div className="lg:col-span-12 xl:col-span-3 space-y-5">
          {/* Safety & Interlock Status Box */}
          <div className="card-tech p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-[#9AAAC3] tracking-wider font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3995F6]" />
                <span>Safety Compliance</span>
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                result?.safety_interlocks.acknowledged
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : result
                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                    : "bg-[#101D35] text-[#6F809A] border border-[#1D3150]"
              }`}>
                {result?.safety_interlocks.acknowledged
                  ? "CONFIRMED"
                  : result
                    ? "BLOCKED"
                    : "STANDBY"}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-[#060B18] border border-[#1D3150] flex items-center justify-between">
                <span className="text-[#9AAAC3]">OSHA 1910.147 LOTO:</span>
                <span className={result?.safety_interlocks.acknowledged ? "text-[#10B981] font-bold" : "text-amber-400"}>
                  {result?.safety_interlocks.acknowledged ? "Verified" : "Enforced"}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#060B18] border border-[#1D3150] flex items-center justify-between">
                <span className="text-[#9AAAC3]">Zero-Energy Isolation:</span>
                <span className={result?.safety_interlocks.acknowledged ? "text-[#10B981]" : "text-[#6F809A]"}>
                  {result?.safety_interlocks.acknowledged ? "0.0 Bar Checked" : "Required"}
                </span>
              </div>
            </div>
          </div>

          {/* CitationAuditor Evidence Box */}
          <div className="card-tech p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-[#3995F6] tracking-wider font-semibold flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5" />
                <span>Citation References</span>
              </span>
              <span className="text-[10px] font-mono text-[#10B981]">
                {result ? `${result.citations.length} Verified` : "0 Grounded"}
              </span>
            </div>

            {result ? (
              <div className="space-y-2.5">
                {result.citations.map((cite, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedCitation(cite)}
                    className="p-3 rounded-xl bg-[#060B18] border border-[#1D3150] hover:border-[#3995F6]/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="text-[#3995F6] font-semibold truncate max-w-[170px]">
                        {cite.node_path.split("/").pop()}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-[#10B981] border border-emerald-500/30">
                        VERIFIED
                      </span>
                    </div>
                    {cite.heading && (
                      <div className="text-[10px] font-mono text-[#6F809A] truncate">
                        Section: #{cite.heading}
                      </div>
                    )}
                    <div className="text-[11px] text-[#9AAAC3] truncate mt-1">
                      "{cite.exact_source_text}"
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#060B18] border border-[#1D3150] text-center text-xs font-mono text-[#6F809A]">
                Citations will populate upon diagnostic analysis.
              </div>
            )}
          </div>

          {/* Source Documents in Active Bundle */}
          <div className="card-tech p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-[#9AAAC3] tracking-wider font-semibold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#3995F6]" />
                <span>Active Knowledge Nodes</span>
              </span>
              <span className="text-[10px] font-mono text-[#6F809A]">5 Loaded</span>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="p-2 rounded-lg bg-[#060B18] border border-[#1D3150] text-[#9AAAC3] truncate">
                📄 components/proportional_relief_valve_v2.md
              </div>
              <div className="p-2 rounded-lg bg-[#060B18] border border-[#1D3150] text-[#9AAAC3] truncate">
                🛡️ safety/lockout_tagout_hydraulics.md
              </div>
              <div className="p-2 rounded-lg bg-[#060B18] border border-[#1D3150] text-[#9AAAC3] truncate">
                🔧 procedures/valve_seal_replacement.md
              </div>
              <div className="p-2 rounded-lg bg-[#060B18] border border-[#1D3150] text-[#9AAAC3] truncate">
                📐 tools/calibrated_torque_wrench.md
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Inspector for Grounded Citations */}
      <EvidenceDrawer citation={selectedCitation} onClose={() => setSelectedCitation(null)} />
    </div>
  );
};
