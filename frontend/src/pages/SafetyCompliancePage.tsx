import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, AlertTriangle, CheckCircle2, FileText, ArrowRight, BookOpen } from "lucide-react";

export const SafetyCompliancePage: React.FC = () => {
  const [badgeId, setBadgeId] = useState("TECH-8842-OFFSHORE");
  const [checks, setChecks] = useState({
    pressure: true,
    bleeder: true,
    padlock: true,
  });

  const toggleCheck = (k: keyof typeof checks) => {
    setChecks((prev) => ({ ...prev, [k]: !prev[k] }));
  };

  const allPassed = checks.pressure && checks.bleeder && checks.padlock;

  return (
    <div className="min-h-screen bg-[#0B0B0E] py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Page Header */}
        <div className="mb-12 pb-8 border-b border-[#2A2A2E]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16171B] border border-[#2A2A2E] text-xs font-mono text-[#9CA3AF] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
                <span>OSHA 1910.147 & CLOSED-WORLD CITATION AUDIT</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F5F5F7]">
                Safety Interlocks & Regulatory Compliance
              </h1>
              <p className="mt-2 text-sm text-[#9CA3AF] max-w-2xl font-normal leading-relaxed">
                In aviation, nuclear facilities, and offshore wind farms, AI hallucinations cause catastrophic failure. GemmaOps enforces mechanical Lockout/Tagout (LOTO) protocols and 100% verified graph citations.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#121316] border border-[#2A2A2E] text-left">
                <div className="text-[10px] font-mono text-[#9CA3AF] uppercase">Compliance Gate</div>
                <div className="text-xs font-mono font-semibold text-[#10B981] flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                  OSHA 1910.147 Validated
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#121316] border border-[#2A2A2E] text-left">
                <div className="text-[10px] font-mono text-[#9CA3AF] uppercase">Citation Audit</div>
                <div className="text-xs font-mono font-semibold text-[#FF6B35] flex items-center gap-1.5 mt-0.5">
                  <Lock className="w-3.5 h-3.5 text-[#FF6B35]" />
                  Closed-World Regex
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Left: OSHA 1910.147 Protocol Explanation */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#121316] border border-[#2A2A2E] rounded-2xl p-8 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#F5F5F7]">OSHA 1910.147 Lockout/Tagout Interlock</h3>
                  <p className="text-xs font-mono text-[#9CA3AF]">The Control of Hazardous Energy (LOTO)</p>
                </div>
              </div>

              <p className="text-sm text-[#9CA3AF] leading-relaxed">
                Before any repair procedure or torque sequence is revealed to a field technician, GemmaOps executes a deterministic graph query checking for upstream safety prerequisites. If the component contains high-pressure hydraulic, pneumatic, or 480V electrical hazards, an electronic interlock modal blocks the repair workflow until physical lockout is confirmed.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#0B0B0E] border border-[#2A2A2E]">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <div className="text-xs text-[#9CA3AF]">
                    <strong className="text-white">Zero-Energy Depressurization:</strong> Accumulator valves must be bled to &lt; 5 PSI prior to manifold disassembly.
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#0B0B0E] border border-[#2A2A2E]">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <div className="text-xs text-[#9CA3AF]">
                    <strong className="text-white">Master Padlock Hasps:</strong> Individual technician lockout tags with registered badge numbers are signed off.
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#0B0B0E] border border-[#2A2A2E]">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <div className="text-xs text-[#9CA3AF]">
                    <strong className="text-white">Audit Trail Logging:</strong> Every sign-off event generates an immutable local cryptographic record with timestamps.
                  </div>
                </div>
              </div>
            </div>

            {/* Citation Audit Specification */}
            <div className="bg-[#121316] border border-[#2A2A2E] rounded-2xl p-8 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF6B35]/15 border border-[#FF6B35]/30 flex items-center justify-center text-[#FF6B35]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#F5F5F7]">Closed-World Citation Audit Engine</h3>
                  <p className="text-xs font-mono text-[#9CA3AF]">Mathematical Verification of Technical Directives</p>
                </div>
              </div>

              <p className="text-sm text-[#9CA3AF] leading-relaxed">
                Standard LLMs frequently invent phantom manual page numbers. GemmaOps implements an automated auditor in <code className="text-[#FF6B35] font-mono text-xs">citation_auditor.py</code>:
              </p>

              <div className="p-4 rounded-xl bg-[#0B0B0E] border border-[#2A2A2E] font-mono text-xs text-[#9CA3AF] space-y-2">
                <div className="text-[#10B981]">// Regex format enforced on all Gemma 4 output:</div>
                <div className="text-white">\[\^([a-zA-Z0-9_\-\.\/]+\.md)(?:#([a-zA-Z0-9_\-]+))?\]</div>
                <div className="pt-2 text-[#9CA3AF]">
                  1. Parses every citation into target node and sub-heading.<br />
                  2. Queries the local NetworkX graph to guarantee the file exists.<br />
                  3. If a hallucinated link is detected, confidence is penalized and the link is flagged.
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Interactive Gate Simulator */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#121316] border border-[#2A2A2E] rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-mono uppercase tracking-wider text-[#F5F5F7] font-semibold">
                  Interactive LOTO Gate Simulator
                </h4>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  allPassed
                    ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                }`}>
                  {allPassed ? "GATE UNLOCKED" : "GATE INTERLOCKED"}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-[#9CA3AF] block mb-1">
                    Technician Badge Authorization ID:
                  </label>
                  <input
                    type="text"
                    value={badgeId}
                    onChange={(e) => setBadgeId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B0B0E] border border-[#2A2A2E] text-white text-xs font-mono focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>

                <div className="space-y-2.5 pt-2">
                  <label
                    onClick={() => toggleCheck("pressure")}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#0B0B0E] border border-[#2A2A2E] cursor-pointer hover:border-[#FF6B35]/40 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checks.pressure}
                      onChange={() => {}}
                      className="accent-[#FF6B35] rounded"
                    />
                    <span className="text-xs text-[#F5F5F7]">Hydraulic accumulator drained to &lt; 5 PSI</span>
                  </label>

                  <label
                    onClick={() => toggleCheck("bleeder")}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#0B0B0E] border border-[#2A2A2E] cursor-pointer hover:border-[#FF6B35]/40 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checks.bleeder}
                      onChange={() => {}}
                      className="accent-[#FF6B35] rounded"
                    />
                    <span className="text-xs text-[#F5F5F7]">Manual bleeder screw #4 cracked 1/4 turn</span>
                  </label>

                  <label
                    onClick={() => toggleCheck("padlock")}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#0B0B0E] border border-[#2A2A2E] cursor-pointer hover:border-[#FF6B35]/40 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checks.padlock}
                      onChange={() => {}}
                      className="accent-[#FF6B35] rounded"
                    />
                    <span className="text-xs text-[#F5F5F7]">Safety lockout padlock applied to breaker #3</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-[#2A2A2E]">
                  <Link
                    to="/diagnose"
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-xs font-semibold tracking-tight transition-all ${
                      allPassed
                        ? "bg-[#FF6B35] hover:bg-[#F97316] text-white shadow-md shadow-[#FF6B35]/25"
                        : "bg-[#16171B] text-[#9CA3AF] border border-[#2A2A2E] pointer-events-none opacity-50"
                    }`}
                  >
                    <span>{allPassed ? "Proceed to Diagnostic Workbench" : "Complete All Checklist Items"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Regulatory Directives Box */}
            <div className="p-6 rounded-2xl bg-[#121316] border border-[#2A2A2E] space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#F5F5F7] font-semibold">
                Industry Certifications Supported
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#9CA3AF]">
                <div className="p-2.5 rounded-lg bg-[#0B0B0E] border border-[#2A2A2E]">
                  <strong className="text-white block">OSHA 1910.147</strong>
                  Lockout/Tagout
                </div>
                <div className="p-2.5 rounded-lg bg-[#0B0B0E] border border-[#2A2A2E]">
                  <strong className="text-white block">ISO 13849-1</strong>
                  Machinery Safety
                </div>
                <div className="p-2.5 rounded-lg bg-[#0B0B0E] border border-[#2A2A2E]">
                  <strong className="text-white block">MIL-STD 810H</strong>
                  Harsh Env Field Ops
                </div>
                <div className="p-2.5 rounded-lg bg-[#0B0B0E] border border-[#2A2A2E]">
                  <strong className="text-white block">ATEX Zone 2</strong>
                  Explosion Hazard
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
