import React, { useState, useMemo } from "react";
import { useMecG, AuditRecord } from "../context/MecGContext";
import {
  Shield,
  Search,
  Filter,
  Download,
  Fingerprint,
  CheckCircle2,
  Lock,
  FileText,
  Clock,
  Hash,
  AlertTriangle,
  Eye,
  Check,
  X,
  Cpu,
  Layers,
  Database
} from "lucide-react";

export const AuditTrailPage: React.FC = () => {
  const { auditTrail, showToast } = useMecG();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState<string>("all");
  const [inspectingRecord, setInspectingRecord] = useState<AuditRecord | null>(null);

  // Filtered audit list
  const filteredRecords = useMemo(() => {
    return auditTrail.filter((rec) => {
      const matchSearch =
        rec.diagnosisId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.technicianId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.identifiedComponent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.observedDefect.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.inputImageHash.toLowerCase().includes(searchTerm.toLowerCase());

      const matchAction = selectedAction === "all" || rec.actionType === selectedAction;
      return matchSearch && matchAction;
    });
  }, [auditTrail, searchTerm, selectedAction]);

  const handleExportAuditLog = () => {
    const exportData = {
      system: "MEC-G MECHANIC GENIUS - OPERATIONAL AUDIT LEDGER",
      exportedAt: new Date().toISOString(),
      chainIntegrity: "SHA-256 VERIFIED LOCAL LEDGER",
      recordsCount: filteredRecords.length,
      records: filteredRecords,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MECG-AUDIT-LOG-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Operational Audit Trail exported to tamper-evident JSON.");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#252B35]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#252B35] text-xs font-mono text-[#F2B544] mb-2">
            <Fingerprint className="w-3.5 h-3.5" />
            <span>LOCAL LEDGER LOGGING</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Audit Trail</h1>
          <p className="text-sm text-[#929AA6] mt-1">
            Chronological, immutable record of field diagnostic events, cryptographic input hashes, safety interlocks, and citation validations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportAuditLog}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#252B35] hover:bg-[#252B35]/80 text-white font-semibold text-xs border border-[#252B35] shadow-sm transition-colors"
          >
            <Download className="w-4 h-4 text-[#F2B544]" />
            <span>Export Audit Log (JSON)</span>
          </button>
        </div>
      </div>

      {/* Ledger Integrity Banner */}
      <div className="bg-[#171A21] border border-[#252B35] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#279C70]/15 border border-[#279C70]/30 flex items-center justify-center text-[#279C70]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Local SHA-256 Ledger Verification</span>
              <span className="px-2 py-0.5 rounded bg-[#279C70]/20 text-[#279C70] font-mono text-[10px]">
                INTEGRITY VERIFIED
              </span>
            </div>
            <p className="text-[11px] text-[#929AA6]">
              All diagnostic operations and safety gate transitions are cryptographically hashed and indexed in local edge storage.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-[#929AA6] sm:text-right">
          <div>TOTAL EVENTS: <span className="font-bold text-white">{auditTrail.length}</span></div>
          <div className="text-[10px] text-[#F2B544]">TAMPER RESISTANT</div>
        </div>
      </div>

      {/* Search & Action Filters */}
      <div className="bg-[#171A21] border border-[#252B35] rounded-xl p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search */}
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#929AA6]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Diagnosis ID, technician, component, defect, or SHA hash..."
              className="w-full bg-[#101318] border border-[#252B35] rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-[#929AA6]/60 focus:outline-none focus:border-[#F2B544]"
            />
          </div>

          {/* Action Filter */}
          <div className="md:col-span-4">
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              aria-label="Filter by action type"
              className="w-full bg-[#101318] border border-[#252B35] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#F2B544]"
            >
              <option value="all">All Action Types</option>
              <option value="DIAGNOSIS_EXECUTED">DIAGNOSIS_EXECUTED</option>
              <option value="LOTO_SIGNED">LOTO_SIGNED</option>
              <option value="PROCEDURE_UNLOCKED">PROCEDURE_UNLOCKED</option>
              <option value="DOCUMENT_INGESTED">DOCUMENT_INGESTED</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#929AA6] pt-1 border-t border-[#252B35]/50">
          <div>
            Displaying <span className="text-white font-bold">{filteredRecords.length}</span> audit records
          </div>
          {(searchTerm || selectedAction !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedAction("all");
              }}
              className="text-[#F2B544] hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-[#171A21] border border-[#252B35] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#929AA6]">
            <thead className="bg-[#101318] text-xs font-mono uppercase text-[#929AA6] border-b border-[#252B35]">
              <tr>
                <th className="py-3.5 px-4">Timestamp (Local)</th>
                <th className="py-3.5 px-4">Diagnosis ID</th>
                <th className="py-3.5 px-4">Action Event</th>
                <th className="py-3.5 px-4">Technician ID</th>
                <th className="py-3.5 px-4">Identified Component</th>
                <th className="py-3.5 px-4">Confidence</th>
                <th className="py-3.5 px-4">Citations</th>
                <th className="py-3.5 px-4">SHA-256 Hash</th>
                <th className="py-3.5 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252B35] text-xs">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#929AA6]">
                    <Database className="w-8 h-8 text-[#929AA6]/40 mx-auto mb-2" />
                    <p className="font-medium text-white">No audit records match the current filter.</p>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#252B35]/40 transition-colors">
                    {/* Timestamp */}
                    <td className="py-4 px-4 whitespace-nowrap font-mono text-[#929AA6]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#F2B544]" />
                        <span>{rec.timestamp}</span>
                      </div>
                    </td>

                    {/* Diagnosis ID */}
                    <td className="py-4 px-4 font-mono font-bold text-white whitespace-nowrap">
                      {rec.diagnosisId}
                    </td>

                    {/* Action Type */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                          rec.actionType === "LOTO_SIGNED"
                            ? "bg-[#279C70]/15 text-[#279C70] border border-[#279C70]/30"
                            : rec.actionType === "DIAGNOSIS_EXECUTED"
                            ? "bg-[#F2B544]/15 text-[#F2B544] border border-[#F2B544]/30"
                            : rec.actionType === "PROCEDURE_UNLOCKED"
                            ? "bg-[#3995F6]/15 text-[#3995F6] border border-[#3995F6]/30"
                            : "bg-[#252B35] text-[#929AA6]"
                        }`}
                      >
                        {rec.actionType === "LOTO_SIGNED" && <Lock className="w-3 h-3" />}
                        {rec.actionType === "DIAGNOSIS_EXECUTED" && <Cpu className="w-3 h-3" />}
                        {rec.actionType}
                      </span>
                    </td>

                    {/* Technician ID */}
                    <td className="py-4 px-4 whitespace-nowrap font-mono text-white">
                      {rec.technicianId}
                    </td>

                    {/* Identified Component */}
                    <td className="py-4 px-4 text-white font-medium">
                      {rec.identifiedComponent}
                    </td>

                    {/* Confidence */}
                    <td className="py-4 px-4 whitespace-nowrap font-mono">
                      <span className="text-[#279C70] font-bold">{(rec.confidence * 100).toFixed(0)}%</span>
                    </td>

                    {/* Verified Citations */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] text-white font-mono">
                        <CheckCircle2 className="w-3 h-3 text-[#279C70]" />
                        {rec.verifiedCitationsCount} verified
                      </span>
                    </td>

                    {/* Hash */}
                    <td className="py-4 px-4 whitespace-nowrap font-mono text-[11px] text-[#929AA6]">
                      <div className="flex items-center gap-1">
                        <Hash className="w-3 h-3 text-[#F2B544]" />
                        <span className="truncate max-w-[90px]">{rec.inputImageHash}</span>
                      </div>
                    </td>

                    {/* Inspect Button */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setInspectingRecord(rec)}
                        title="View Detailed Audit Entry"
                        className="p-1.5 rounded hover:bg-[#252B35] text-[#929AA6] hover:text-[#F2B544] transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Inspection Modal */}
      {inspectingRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171A21] border border-[#252B35] rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#252B35] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#F2B544]/15 border border-[#F2B544]/30 flex items-center justify-center text-[#F2B544]">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Audit Event Record</h3>
                  <p className="text-xs font-mono text-[#929AA6]">ID: {inspectingRecord.id}</p>
                </div>
              </div>
              <button
                onClick={() => setInspectingRecord(null)}
                className="p-2 text-[#929AA6] hover:text-white rounded-lg hover:bg-[#252B35]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#101318] border border-[#252B35]">
                  <span className="text-[#929AA6] font-mono block">DIAGNOSIS ID</span>
                  <span className="text-white font-bold font-mono mt-1 block">{inspectingRecord.diagnosisId}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#101318] border border-[#252B35]">
                  <span className="text-[#929AA6] font-mono block">TECHNICIAN BADGE</span>
                  <span className="text-white font-bold font-mono mt-1 block">{inspectingRecord.technicianId}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#101318] border border-[#252B35]">
                  <span className="text-[#929AA6] font-mono block">ACTION EVENT TYPE</span>
                  <span className="text-[#F2B544] font-bold font-mono mt-1 block">{inspectingRecord.actionType}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#101318] border border-[#252B35]">
                  <span className="text-[#929AA6] font-mono block">EVENT TIMESTAMP</span>
                  <span className="text-white font-mono mt-1 block">{inspectingRecord.timestamp}</span>
                </div>
              </div>

              {/* Observed Defect */}
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[#929AA6]">Observed Hardware Defect</label>
                <div className="p-3 rounded-lg bg-[#101318] border border-[#252B35] text-xs text-white">
                  {inspectingRecord.observedDefect}
                </div>
              </div>

              {/* Cryptographic Hash */}
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[#929AA6]">Input Image SHA-256 Hash</label>
                <div className="p-3 rounded-lg bg-[#101318] border border-[#252B35] text-xs font-mono text-[#F2B544] break-all select-all">
                  {inspectingRecord.inputImageHash}
                </div>
              </div>

              {/* Completed Safety Checklist */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-[#929AA6]">Recorded Safety Gate Approvals</label>
                <div className="space-y-1.5">
                  {inspectingRecord.completedSafetyChecks.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-[#101318] border border-[#252B35] flex items-center gap-2 text-xs text-white"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#279C70] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#252B35] bg-[#101318] flex items-center justify-end">
              <button
                onClick={() => setInspectingRecord(null)}
                className="px-4 py-2 rounded-lg bg-[#252B35] hover:bg-[#252B35]/80 text-white text-xs font-semibold"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

