import React, { useState } from "react";
import { Camera, Upload, Sparkles, CheckCircle2, Layers, RefreshCw, AlertCircle } from "lucide-react";
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
      setResult(null);
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
    <section id="workbench" className="py-24 bg-[#0A0A0C] hairline-b">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#6C4CF1] font-semibold">
            Live Diagnostic Engine
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Try the Model & Check Results
          </h2>
          <p className="mt-4 text-base text-[#9A9AA2]">
            Test the multimodal model live. Select pre-loaded sample equipment images or upload your own physical
            photos. Gemma 4 diagnoses the component and enforces OSHA Lockout/Tagout gates.
          </p>
        </div>

        {/* Sample Equipment Selector */}
        <div className="mb-10 p-5 rounded-3xl bg-[#111114] border border-white/[0.08]">
          <div className="text-xs font-mono text-[#9A9AA2] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#6C4CF1]" />
            <span>Select Pre-Loaded Industrial Sample Image & Query:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SAMPLE_QUERIES.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectSample(s)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-4 ${
                  activeSampleId === s.id
                    ? "bg-[#0A0A0C] border-[#6C4CF1] shadow-lg shadow-[#6C4CF1]/10 ring-1 ring-[#6C4CF1]/40"
                    : "bg-[#0A0A0C]/60 border-white/[0.06] hover:border-white/[0.14] hover:bg-[#0A0A0C]"
                }`}
              >
                <img
                  src={s.imagePath}
                  alt={s.title}
                  className="w-16 h-16 rounded-xl object-cover border border-white/[0.1] shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-[11px] font-mono font-bold text-[#C9B8FF] truncate">{s.subsystem}</div>
                  <div className="text-sm font-bold text-white truncate">{s.title}</div>
                  <div className="text-xs text-[#9A9AA2] truncate mt-0.5">{s.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Workbench Split Ingestion & Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image & Query Input */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-[#111114] border border-white/[0.08] shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase text-[#9A9AA2] tracking-wider">
                  Hardware Visual Input
                </span>
                <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0A0A0C] hover:bg-white/[0.08] text-xs font-mono text-white transition-colors cursor-pointer border border-white/[0.12]">
                  <Upload className="w-3.5 h-3.5 text-[#6C4CF1]" />
                  <span>Upload Image</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              {selectedImage ? (
                <div className="relative rounded-2xl overflow-hidden border border-white/[0.1] aspect-video bg-[#0A0A0C]">
                  <img src={selectedImage} alt="Faulty Component" className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#0A0A0C]/80 backdrop-blur-md text-[10px] font-mono text-[#C9B8FF] border border-white/[0.12]">
                    Active Input
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/[0.1] p-10 text-center bg-[#0A0A0C]">
                  <Camera className="w-8 h-8 text-[#9A9AA2] mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-[#9A9AA2] font-mono">No image loaded. Pick a sample above or drop a file.</p>
                </div>
              )}
            </div>

            <div className="p-6 rounded-3xl bg-[#111114] border border-white/[0.08] shadow-2xl space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#9A9AA2] tracking-wider mb-2">
                  Technician Query / Voice Note:
                </label>
                <textarea
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  rows={3}
                  className="w-full p-4 rounded-2xl bg-[#0A0A0C] border border-white/[0.1] text-sm text-white focus:outline-none focus:border-[#6C4CF1] font-sans leading-relaxed resize-none transition-colors"
                  placeholder="Describe observed symptoms, error codes, or part numbers..."
                />
              </div>

              <button
                onClick={handleRunDiagnostic}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-white hover:bg-slate-200 text-[#0A0A0C] font-bold text-sm tracking-tight shadow-xl transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-[#6C4CF1]" />
                {isLoading ? "Gemma 4 Multimodal Reasoning..." : "Run Diagnostic Engine (Image + OKF)"}
              </button>
            </div>
          </div>

          {/* Right Column: Results & Safety Interlocks */}
          <div className="lg:col-span-7 space-y-6">
            {result ? (
              <>
                {/* Detected Component Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-[#111114] border border-white/[0.08] shadow-2xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#6C4CF1]/20 text-[#C9B8FF] border border-[#6C4CF1]/30">
                          DETECTED COMPONENT
                        </span>
                        {result.detected_component.part_number && (
                          <span className="text-xs font-mono font-bold text-white">
                            P/N: {result.detected_component.part_number}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mt-1.5">
                        {result.detected_component.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A0A0C] border border-white/[0.08] text-xs font-mono">
                      <span className="text-[#9A9AA2]">Confidence:</span>
                      <strong className="text-[#34D399]">
                        {Math.round(result.detected_component.confidence * 100)}%
                      </strong>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-[#9A9AA2] leading-relaxed">
                    <strong className="text-white block mb-1">Visual Defect Diagnosis:</strong>
                    {result.detected_component.observed_defect}
                  </div>

                  {result.detected_component.visual_indicators.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {result.detected_component.visual_indicators.map((vi, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-full bg-[#0A0A0C] text-[11px] font-mono text-[#C9B8FF] border border-white/[0.08]"
                        >
                          {vi}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Safety Gate Modal: Blocks repair steps until LOTO confirmed */}
                {result.safety_interlocks.required && !result.safety_interlocks.acknowledged && (
                  <SafetyGateModal
                    safety={result.safety_interlocks}
                    onAcknowledge={handleSafetyAcknowledge}
                    isLoading={isLoading}
                  />
                )}

                {/* Remediation Plan: Appears once LOTO signed off */}
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
              <div className="p-16 rounded-3xl bg-[#111114]/50 border border-dashed border-white/[0.08] text-center">
                <Sparkles className="w-10 h-10 text-[#6C4CF1] mx-auto mb-3 opacity-60" />
                <h3 className="text-lg font-bold text-white">Diagnostic Engine Standby</h3>
                <p className="text-xs text-[#9A9AA2] max-w-sm mx-auto mt-2 leading-relaxed">
                  Click <strong>"Run Diagnostic Engine"</strong> on the left to trigger Gemma 4 multimodal inspection,
                  traverse the in-memory OKF graph, and enforce Lockout/Tagout safety gates.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <EvidenceDrawer citation={selectedCitation} onClose={() => setSelectedCitation(null)} />
    </section>
  );
};
