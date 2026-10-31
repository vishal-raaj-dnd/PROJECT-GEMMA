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
    <section id="workbench" className="py-8 bg-[#0B0B0E]">
      <div className="max-w-7xl mx-auto px-0">
        {/* Sample Equipment Selector */}
        <div className="mb-8 p-5 rounded-xl bg-[#121316] border border-[#2A2A2E]">
          <div className="text-xs font-mono text-[#9CA3AF] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#FF6B35]" />
            <span>Select Pre-Loaded Industrial Sample Image & Query:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SAMPLE_QUERIES.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectSample(s)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-4 ${
                  activeSampleId === s.id
                    ? "bg-[#0B0B0E] border-[#FF6B35] shadow-lg shadow-[#FF6B35]/10 ring-1 ring-[#FF6B35]/40"
                    : "bg-[#0B0B0E]/60 border-[#2A2A2E] hover:border-[#FF6B35]/40 hover:bg-[#0B0B0E]"
                }`}
              >
                <img
                  src={s.imagePath}
                  alt={s.title}
                  className="w-16 h-16 rounded-lg object-cover border border-[#2A2A2E] shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-[11px] font-mono font-bold text-[#FF6B35] truncate">{s.subsystem}</div>
                  <div className="text-sm font-bold text-[#F5F5F7] truncate">{s.title}</div>
                  <div className="text-xs text-[#9CA3AF] truncate mt-0.5">{s.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Workbench Split Ingestion & Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image & Query Input */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-xl bg-[#121316] border border-[#2A2A2E] shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase text-[#9CA3AF] tracking-wider">
                  Hardware Visual Input
                </span>
                <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B0B0E] hover:bg-[#16171B] text-xs font-mono text-white transition-colors cursor-pointer border border-[#2A2A2E]">
                  <Upload className="w-3.5 h-3.5 text-[#FF6B35]" />
                  <span>Upload Image</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              {selectedImage ? (
                <div className="relative rounded-lg overflow-hidden border border-[#2A2A2E] aspect-video bg-[#0B0B0E]">
                  <img src={selectedImage} alt="Faulty Component" className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[#0B0B0E]/90 text-[10px] font-mono text-[#FF6B35] border border-[#2A2A2E]">
                    Active Input
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-[#2A2A2E] p-10 text-center bg-[#0B0B0E]">
                  <Camera className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-[#9CA3AF] font-mono">No image loaded. Pick a sample above or drop a file.</p>
                </div>
              )}
            </div>

            <div className="p-6 rounded-xl bg-[#121316] border border-[#2A2A2E] shadow-xl space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#9CA3AF] tracking-wider mb-2">
                  Technician Query / Voice Note:
                </label>
                <textarea
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  rows={3}
                  className="w-full p-3.5 rounded-lg bg-[#0B0B0E] border border-[#2A2A2E] text-xs font-mono text-[#F5F5F7] focus:outline-none focus:border-[#FF6B35] leading-relaxed resize-none transition-colors"
                  placeholder="Describe observed symptoms, error codes, or part numbers..."
                />
              </div>

              <button
                onClick={handleRunDiagnostic}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-[#FF6B35] hover:bg-[#F97316] text-white font-medium text-xs tracking-tight shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-white" />
                {isLoading ? "Gemma 4 Multimodal Reasoning..." : "Run Diagnostic Engine (Image + OKF)"}
              </button>
            </div>
          </div>

          {/* Right Column: Results & Safety Interlocks */}
          <div className="lg:col-span-7 space-y-6">
            {result ? (
              <>
                {/* Detected Component Card */}
                <div className="p-6 rounded-xl bg-[#121316] border border-[#2A2A2E] shadow-xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#2A2A2E]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF6B35]/20 text-[#FF6B35] border border-[#FF6B35]/30">
                          DETECTED COMPONENT
                        </span>
                        {result.detected_component.part_number && (
                          <span className="text-xs font-mono font-bold text-white">
                            P/N: {result.detected_component.part_number}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-[#F5F5F7] mt-1.5">
                        {result.detected_component.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-[#0B0B0E] border border-[#2A2A2E] text-xs font-mono">
                      <span className="text-[#9CA3AF]">Confidence:</span>
                      <strong className="text-[#10B981]">
                        {Math.round(result.detected_component.confidence * 100)}%
                      </strong>
                    </div>
                  </div>

                  <div className="mt-4 text-xs font-mono text-[#9CA3AF] leading-relaxed">
                    <strong className="text-white block mb-1">Visual Defect Diagnosis:</strong>
                    {result.detected_component.observed_defect}
                  </div>

                  {result.detected_component.visual_indicators.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {result.detected_component.visual_indicators.map((vi, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md bg-[#0B0B0E] text-[10px] font-mono text-[#FF6B35] border border-[#2A2A2E]"
                        >
                          {vi}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Safety Gate Modal */}
                {result.safety_interlocks.required && !result.safety_interlocks.acknowledged && (
                  <SafetyGateModal
                    safety={result.safety_interlocks}
                    onAcknowledge={handleSafetyAcknowledge}
                    isLoading={isLoading}
                  />
                )}

                {/* Remediation Plan */}
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
              <div className="p-14 rounded-xl bg-[#121316]/50 border border-dashed border-[#2A2A2E] text-center">
                <Sparkles className="w-8 h-8 text-[#FF6B35] mx-auto mb-3 opacity-70" />
                <h3 className="text-base font-semibold text-[#F5F5F7]">Diagnostic Engine Standby</h3>
                <p className="text-xs text-[#9CA3AF] max-w-sm mx-auto mt-2 leading-relaxed font-mono">
                  Click <strong className="text-white">"Run Diagnostic Engine"</strong> on the left to trigger Gemma 4 multimodal inspection,
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
