import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMecG } from "../context/MecGContext";
import {
  History,
  Search,
  Filter,
  Download,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  Cpu,
  Layers,
  Sparkles,
  Calendar,
  X,
  Play
} from "lucide-react";
import { DiagnosticResponse } from "../types/diagnostic";

export const DiagnosticHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { diagnosticHistory, setActiveDiagnosis, showToast } = useMecG();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("all");
  const [selectedSafetyStatus, setSelectedSafetyStatus] = useState("all");
  const [selectedSessionStatus, setSelectedSessionStatus] = useState("all");
  const [inspectingSession, setInspectingSession] = useState<DiagnosticResponse | null>(null);

  // Extract unique equipment for filter
  const equipmentOptions = useMemo(() => {
    const set = new Set<string>();
    diagnosticHistory.forEach((item) => set.add(item.equipment));
    return Array.from(set);
  }, [diagnosticHistory]);

  // Filtered list
  const filteredHistory = useMemo(() => {
    return diagnosticHistory.filter((item) => {
      const matchSearch =
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.identifiedComponent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.technician.toLowerCase().includes(searchTerm.toLowerCase());

      const matchEquipment = selectedEquipment === "all" || item.equipment === selectedEquipment;
      const matchSafety = selectedSafetyStatus === "all" || item.safetyStatus === selectedSafetyStatus;
      const matchSession = selectedSessionStatus === "all" || item.sessionStatus === selectedSessionStatus;

      return matchSearch && matchEquipment && matchSafety && matchSession;
    });
  }, [diagnosticHistory, searchTerm, selectedEquipment, selectedSafetyStatus, selectedSessionStatus]);

  const handleExportReport = (item: typeof diagnosticHistory[0]) => {
    const reportData = {
      title: `MEC-G Field Diagnostic Report - ${item.id}`,
      generatedAt: new Date().toISOString(),
      session: item,
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MECG-REPORT-${item.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Diagnostic Report for ${item.id} exported successfully.`);
  };

  const handleResumeSession = (item: typeof diagnosticHistory[0]) => {
    setActiveDiagnosis(item.diagnostic);
    navigate("/diagnose");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#252B35]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#252B35] text-xs font-mono text-[#F2B544] mb-2">
            <History className="w-3.5 h-3.5" />
            <span>OPERATIONAL AUDIT ARCHIVE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Diagnostic History</h1>
          <p className="text-sm text-[#929AA6] mt-1">
            Complete traceability of field diagnostic sessions, detected components, LOTO compliance, and verified repair records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/diagnose"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#F2B544] hover:bg-[#F2B544]/90 text-[#101318] font-bold text-sm shadow-md transition-colors"
          >
            <Play className="w-4 h-4" />
            <span>+ New Diagnosis</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#171A21] border border-[#252B35] rounded-xl p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#929AA6]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, equipment, defect, component, technician..."
              className="w-full bg-[#101318] border border-[#252B35] rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-[#929AA6]/60 focus:outline-none focus:border-[#F2B544]"
            />
          </div>

          {/* Equipment Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              aria-label="Filter by equipment"
              className="w-full bg-[#101318] border border-[#252B35] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#F2B544]"
            >
              <option value="all">All Equipment Units</option>
              {equipmentOptions.map((eq) => (
                <option key={eq} value={eq}>
                  {eq}
                </option>
              ))}
            </select>
          </div>

          {/* Safety Status Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedSafetyStatus}
              onChange={(e) => setSelectedSafetyStatus(e.target.value)}
              aria-label="Filter by safety status"
              className="w-full bg-[#101318] border border-[#252B35] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#F2B544]"
            >
              <option value="all">All Safety Status</option>
              <option value="Confirmed">Confirmed (LOTO)</option>
              <option value="Blocked">Blocked</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Session Status Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedSessionStatus}
              onChange={(e) => setSelectedSessionStatus(e.target.value)}
              aria-label="Filter by session status"
              className="w-full bg-[#101318] border border-[#252B35] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#F2B544]"
            >
              <option value="all">All Sessions</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Active Filter Metrics */}
        <div className="flex items-center justify-between text-xs text-[#929AA6] pt-1 border-t border-[#252B35]/50">
          <div>
            Showing <span className="font-bold text-white">{filteredHistory.length}</span> of{" "}
            <span className="font-bold text-white">{diagnosticHistory.length}</span> recorded diagnostic sessions
          </div>
          {(searchTerm || selectedEquipment !== "all" || selectedSafetyStatus !== "all" || selectedSessionStatus !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedEquipment("all");
                setSelectedSafetyStatus("all");
                setSelectedSessionStatus("all");
              }}
              className="text-[#F2B544] hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Diagnostic Sessions Table */}
      <div className="bg-[#171A21] border border-[#252B35] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#929AA6]">
            <thead className="bg-[#101318] text-xs font-mono uppercase text-[#929AA6] border-b border-[#252B35]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Diagnosis ID</th>
                <th className="py-3.5 px-4 font-semibold">Equipment & Subsystem</th>
                <th className="py-3.5 px-4 font-semibold">Observed Defect</th>
                <th className="py-3.5 px-4 font-semibold">Identified Component</th>
                <th className="py-3.5 px-4 font-semibold">Technician</th>
                <th className="py-3.5 px-4 font-semibold">Date & Time</th>
                <th className="py-3.5 px-4 font-semibold">Safety Gate</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252B35]">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-sm text-[#929AA6]">
                    <History className="w-8 h-8 text-[#929AA6]/40 mx-auto mb-2" />
                    <p className="font-medium text-white">No diagnostic sessions match your filter criteria.</p>
                    <p className="text-xs text-[#929AA6] mt-1">Try adjusting your search terms or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-[#252B35]/40 transition-colors">
                    {/* Diagnosis ID */}
                    <td className="py-4 px-4 font-mono text-xs font-bold text-white whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#F2B544]">#</span>
                        {item.id}
                      </div>
                    </td>

                    {/* Equipment & Subsystem */}
                    <td className="py-4 px-4">
                      <div className="font-medium text-white">{item.equipment}</div>
                      <div className="text-xs text-[#929AA6] font-mono">{item.subsystem}</div>
                    </td>

                    {/* Observed Defect */}
                    <td className="py-4 px-4 max-w-xs">
                      <p className="text-xs text-white line-clamp-2">{item.issue}</p>
                    </td>

                    {/* Identified Component */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-[#F2B544] shrink-0" />
                        <span className="text-xs font-bold text-white">{item.identifiedComponent}</span>
                      </div>
                      <div className="text-[10px] font-mono text-[#929AA6] mt-0.5">P/N: {item.partNumber}</div>
                    </td>

                    {/* Technician */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-[#252B35] flex items-center justify-center text-xs font-bold text-[#F2B544]">
                          {item.technician.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-medium text-white">{item.technician}</div>
                          <div className="text-[10px] font-mono text-[#929AA6]">{item.technicianId}</div>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 whitespace-nowrap text-xs text-[#929AA6] font-mono">
                      {item.date}
                    </td>

                    {/* Safety Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {item.safetyStatus === "Confirmed" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#279C70]/10 border border-[#279C70]/30 text-xs font-semibold text-[#279C70]">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          LOTO Confirmed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D94D4D]/10 border border-[#D94D4D]/30 text-xs font-semibold text-[#D94D4D]">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          Gate Blocked
                        </span>
                      )}
                    </td>

                    {/* Session Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                          item.sessionStatus === "Completed"
                            ? "bg-[#252B35] text-white"
                            : item.sessionStatus === "In Progress"
                            ? "bg-[#F2B544]/15 text-[#F2B544]"
                            : "bg-[#929AA6]/15 text-[#929AA6]"
                        }`}
                      >
                        {item.sessionStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setInspectingSession(item.diagnostic)}
                          title="View Diagnostic Details"
                          className="p-1.5 rounded hover:bg-[#252B35] text-[#929AA6] hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleResumeSession(item)}
                          title="Resume in Workspace"
                          className="p-1.5 rounded hover:bg-[#252B35] text-[#F2B544] hover:text-[#F2B544]/80 transition-colors"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleExportReport(item)}
                          title="Export JSON Report"
                          className="p-1.5 rounded hover:bg-[#252B35] text-[#929AA6] hover:text-white transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Session Details Modal Inspector */}
      {inspectingSession && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171A21] border border-[#252B35] rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#252B35] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#F2B544]/10 border border-[#F2B544]/30 flex items-center justify-center text-[#F2B544]">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Diagnostic Record Inspector</h3>
                  <p className="text-xs font-mono text-[#929AA6]">
                    Diagnosis ID: <span className="text-[#F2B544]">{inspectingSession.diagnostic_id}</span> • Component:{" "}
                    <span className="text-white">{inspectingSession.detected_component.name}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectingSession(null)}
                className="p-2 text-[#929AA6] hover:text-white rounded-lg hover:bg-[#252B35] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-[#101318] border border-[#252B35]">
                  <div className="text-[10px] font-mono text-[#929AA6]">CONFIDENCE</div>
                  <div className="text-lg font-bold text-[#279C70]">
                    {(inspectingSession.detected_component.confidence * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#101318] border border-[#252B35]">
                  <div className="text-[10px] font-mono text-[#929AA6]">PART NUMBER</div>
                  <div className="text-xs font-mono font-bold text-white mt-1">
                    {inspectingSession.detected_component.part_number || "OEM-V112-HYD"}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#101318] border border-[#252B35]">
                  <div className="text-[10px] font-mono text-[#929AA6]">ESTIMATED TIME</div>
                  <div className="text-xs font-bold text-white mt-1">
                    {inspectingSession.remediation_plan?.estimated_duration_minutes
                      ? `${(inspectingSession.remediation_plan.estimated_duration_minutes / 60).toFixed(1)} hours`
                      : "1.5 hours"}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#101318] border border-[#252B35]">
                  <div className="text-[10px] font-mono text-[#929AA6]">TORQUE SPEC</div>
                  <div className="text-xs font-mono font-bold text-[#F2B544] mt-1">
                    {inspectingSession.remediation_plan?.steps.find((s) => s.torque_spec)?.torque_spec || "45 Nm ± 2 Nm"}
                  </div>
                </div>
              </div>

              {/* Observed Defect */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase text-[#929AA6]">Observed Defect</h4>
                <div className="p-3.5 rounded-lg bg-[#101318] border border-[#252B35] text-sm text-white">
                  {inspectingSession.detected_component.observed_defect}
                </div>
              </div>

              {/* Safety Warning */}
              <div className="p-4 rounded-lg bg-[#D99A29]/10 border border-[#D99A29]/30 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#F2B544]">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Mandatory Safety Isolation Warning</span>
                </div>
                <p className="text-xs text-[#929AA6]">
                  {inspectingSession.safety_interlocks.prerequisites.length > 0
                    ? inspectingSession.safety_interlocks.prerequisites.map((p) => p.title).join(" • ")
                    : "OSHA 1910.147 hazardous energy control isolation required before panel removal."}
                </p>
              </div>

              {/* Repair Steps */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase text-[#929AA6]">Approved Repair Procedure Steps</h4>
                <div className="space-y-2">
                  {inspectingSession.remediation_plan?.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[#101318] border border-[#252B35] flex items-start gap-3"
                    >
                      <span className="w-5 h-5 rounded bg-[#252B35] text-[#F2B544] font-mono text-xs flex items-center justify-center shrink-0">
                        {step.step_number || idx + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-xs text-white leading-relaxed">{step.instruction}</p>
                        {step.torque_spec && (
                          <span className="inline-block mt-1 font-mono text-[10px] text-[#F2B544] bg-[#F2B544]/10 px-2 py-0.5 rounded">
                            Torque: {step.torque_spec}
                          </span>
                        )}
                      </div>
                    </div>
                  )) || (
                    <div className="text-xs text-[#929AA6] italic p-3 bg-[#101318] rounded-lg">
                      No repair steps unlocked. Complete safety interlock sign-off.
                    </div>
                  )}
                </div>
              </div>

              {/* Source Document Citations */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase text-[#929AA6]">Verified Source Citations</h4>
                <div className="space-y-2">
                  {inspectingSession.citations.map((c, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-[#101318] border border-[#252B35] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#F2B544]" />
                        <div>
                          <div className="text-xs font-bold text-white">
                            {c.raw_citation} <span className="text-[#929AA6]">({c.node_path})</span>
                          </div>
                          <div className="text-[10px] text-[#929AA6] font-mono italic">"{c.exact_source_text}"</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-[#279C70] font-bold">100% Grounded</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#252B35] bg-[#101318] flex items-center justify-between">
              <span className="text-xs text-[#929AA6] font-mono">Traceability ID: MECG-REC-{Date.now().toString(36)}</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setInspectingSession(null)}
                  className="px-4 py-2 rounded-lg bg-[#252B35] hover:bg-[#252B35]/80 text-white text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setActiveDiagnosis(inspectingSession);
                    setInspectingSession(null);
                    navigate("/diagnose");
                  }}
                  className="px-4 py-2 rounded-lg bg-[#F2B544] hover:bg-[#F2B544]/90 text-[#101318] text-xs font-bold flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Resume in Diagnostic Engine</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
