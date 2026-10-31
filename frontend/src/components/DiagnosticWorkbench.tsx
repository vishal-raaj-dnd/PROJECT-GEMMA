import React, { useState } from "react";
import { Camera, Upload, Mic, Play, Sparkles, CheckCircle, AlertTriangle, Layers, RotateCcw } from "lucide-react";
import { DiagnosticResponse, CitationVerification } from "../types/diagnostic";
import { SAMPLE_QUERIES, SampleQueryItem } from "../data/sampleData";
import { ApiService } from "../services/api";
import { SafetyGateModal } from "./SafetyGateModal";
import { RemediationView } from "./RemediationView";
import { EvidenceDrawer } from "./EvidenceDrawer";

export const DiagnosticWorkbench: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(SAMPLE_QUERIES[0].imagePath);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [queryText, setQueryText] = useState<string>(SAMPLE_QUERIES[0].queryText);
  const [activeSampleId, setActiveSampleId] = useState<string>(SAMPLE_QUERIES[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticResponse | null>(null);
  const [selectedCitation, setSelectedCitation] = useState<CitationVerification | null>(null);

  const handleSelectSample = (sample: SampleQueryItem) => {
    setActiveSampleId(sample.id);
    setSelectedImage(sample.imagePath);
    setImageFile(null);
    setQueryText(sample.queryText);
    setResult(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setSelectedImage(URL.createObjectURL(file));
      setActiveSampleId("");
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

  return (
    <section id="workbench" className="py-20 border-b border-slate-800/60 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-mono font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Diagnostic Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Try the Model & Experience the Fix
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Upload hardware photos, select pre-loaded sample equipment, or input custom technician queries. Watch Gemma
            4 diagnose the fault and enforce safety gates before providing exact torque and tool steps.
          </p>
        </div>

        {/* Quick Sample Selector Bar */}
        <div className="mb-8 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Choose Pre-loaded Industrial Sample or Upload Your Own:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SAMPLE_QUERIES.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectSample(s)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  activeSampleId === s.id
                    ? "bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/30"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950"
                }`}
              >
                <img
                  src={s.imagePath}
                  alt={s.title}
                  className="w-14 h-14 rounded-lg object-cover border border-slate-700 shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-[11px] font-mono font-semibold text-amber-400 truncate">{s.subsystem}</div>
                  <div className="text-xs font-bold text-white truncate">{s.title}</div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">{s.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Workbench Split View (Inputs on Left, Results on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Visual & Query Ingestion */}
          <div className="lg:col-span-5 space-y-6">
            {/* Image Preview & Dropzone */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                  Visual Hardware Input:
                </span>
                <label className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 transition-colors cursor-pointer border border-slate-700">
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Upload Image</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              {selectedImage ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-700/80 aspect-video bg-slate-950">
                  <img src={selectedImage} alt="Hardware Fault" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 px-2 py-1 rounded bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-amber-300 border border-amber-500/30">
                    Live Input
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed border-slate-800 p-8 text-center bg-slate-950">
                  <Camera className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-mono">No image loaded. Drop a photo or pick a sample above.</p>
                </div>
              )}
            </div>

            {/* Query Notes & Trigger */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 tracking-wider mb-2">
                  Technician Query / Voice Note:
                </label>
                <textarea
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-amber-500/60 font-sans leading-relaxed resize-none"
                  placeholder="Describe observed symptoms, error codes, or part numbers..."
                />
              </div>

              <button
                onClick={handleRunDiagnostic}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                {isLoading ? "Gemma 4 Multimodal Reasoning..." : "Run Diagnostic Engine (Image + OKF)"}
              </button>
            </div>
          </div>

          {/* Right Column: Dynamic Diagnosis & Execution */}
          <div className="lg:col-span-7 space-y-6">
            {result ? (
              <>
                {/* Detected Component Banner */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          DETECTED COMPONENT
                        </span>
                        {result.detected_component.part_number && (
                          <span className="text-xs font-mono font-bold text-slate-300">
                            P/N: {result.detected_component.part_number}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-white mt-1">
                        {result.detected_component.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
                      <span className="text-slate-400">Confidence:</span>
                      <strong className="text-emerald-400">
                        {Math.round(result.detected_component.confidence * 100)}%
                      </strong>
                    </div>
                  </div>

                  <div className="mt-4 text-xs sm:text-sm text-slate-300">
                    <strong className="text-white block mb-1">Visual Defect Analysis:</strong>
                    {result.detected_component.observed_defect}
                  </div>

                  {result.detected_component.visual_indicators.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {result.detected_component.visual_indicators.map((vi, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-950 text-[11px] font-mono text-amber-300/90 border border-slate-800">
                          {vi}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Safety Interlock Gate: If required and not acknowledged */}
                {result.safety_interlocks.required && !result.safety_interlocks.acknowledged && (
                  <SafetyGateModal
                    safety={result.safety_interlocks}
                    onAcknowledge={handleSafetyAcknowledge}
                    isLoading={isLoading}
                  />
                )}

                {/* Remediation Plan: Once safety is confirmed (or not required) */}
                {(!result.safety_interlocks.required || result.safety_interlocks.acknowledged) &&
                  result.remediation_plan && (
                    <RemediationView
                      plan={result.remediation_plan}
                      citations={result.citations}
                      onSelectCitation={(c) => setSelectedCitation(c)}
                    />
                  )}
              </>
            ) : (
              <div className="p-12 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center">
                <Sparkles className="w-10 h-10 text-amber-400/40 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white">Diagnostic Engine Standby</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
                  Click <strong>"Run Diagnostic Engine"</strong> on the left to trigger multimodal Gemma vision,
                  resolve the local OKF knowledge graph, and enforce Lockout/Tagout safety gates.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slide-out Evidence Drawer Modal */}
      <EvidenceDrawer citation={selectedCitation} onClose={() => setSelectedCitation(null)} />
    </section>
  );
};
