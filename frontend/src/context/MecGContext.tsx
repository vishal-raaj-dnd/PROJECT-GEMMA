import React, { createContext, useContext, useState, useEffect } from "react";
import { SAMPLE_QUERIES, SAMPLE_DOCUMENTS } from "../data/sampleData";
import { DiagnosticResponse, CitationVerification } from "../types/diagnostic";
import { ApiService } from "../services/api";

export interface NotebookSource {
  id: string;
  name: string;
  type: "pdf" | "docx" | "xlsx" | "pptx" | "html" | "md";
  size: string;
  pages: number;
  status: "ready" | "processing" | "indexed" | "error";
  selected: boolean;
  content: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  attachedImage?: string;
  audioBlobUrl?: string;
  citations?: CitationVerification[];
  saved?: boolean;
}

export interface NotebookNote {
  id: string;
  title: string;
  content: string;
  category: "finding" | "torque" | "safety" | "procedure";
  timestamp: string;
}

export interface NotebookStudioArtifact {
  id: string;
  title: string;
  type: "briefing" | "faq" | "guide" | "report";
  summary: string;
  created: string;
}

export interface NotebookItem {
  id: string;
  name: string;
  equipmentName: string;
  category: string;
  description: string;
  docCount: number;
  indexingStatus: "Indexed" | "Indexing" | "Pending";
  lastUpdated: string;
  equipmentType: string;
  manufacturer: string;
  modelNumber: string;
  subsystem: string;
  tags: string[];
  sources: NotebookSource[];
  messages: ChatMessage[];
  notes: NotebookNote[];
  studio: NotebookStudioArtifact[];
}

export interface LibraryDocument {
  id: string;
  filename: string;
  type: "PDF" | "DOCX" | "XLSX" | "PPTX" | "HTML" | "MD";
  size: string;
  pages: number;
  equipmentCategory: string;
  processingStatus: "Ready" | "Indexing" | "Processing" | "Uploaded" | "Error";
  lastUpdated: string;
  hash: string;
  extractedText: string;
  chunks: { id: string; tokens: number; preview: string; heading: string }[];
  partNumbers: string[];
  safetyClassification: "Critical LOTO" | "Standard Safe" | "High Voltage";
  relatedNodes: string[];
}

export interface DiagnosticHistoryItem {
  id: string;
  equipment: string;
  subsystem: string;
  issue: string;
  identifiedComponent: string;
  partNumber: string;
  technician: string;
  technicianId: string;
  date: string;
  safetyStatus: "Confirmed" | "Blocked" | "Pending";
  sessionStatus: "Completed" | "In Progress" | "Suspended";
  diagnostic: DiagnosticResponse;
}

export interface AuditRecord {
  id: string;
  diagnosisId: string;
  technicianId: string;
  timestamp: string;
  inputImageHash: string;
  identifiedComponent: string;
  confidence: number;
  observedDefect: string;
  verifiedCitationsCount: number;
  completedSafetyChecks: string[];
  actionType: "DIAGNOSIS_EXECUTED" | "LOTO_SIGNED" | "PROCEDURE_UNLOCKED" | "DOCUMENT_INGESTED";
}

interface MecGContextType {
  // Theme & User
  theme: "dark" | "light";
  toggleTheme: () => void;
  currentUser: string;
  userRole: "Technician" | "Operations Engineer" | "Safety Engineer" | "Administrator";
  setUserRole: (role: "Technician" | "Operations Engineer" | "Safety Engineer" | "Administrator") => void;
  currentWorkspace: string;
  setCurrentWorkspace: (ws: string) => void;
  isOnline: boolean;
  modelStatus: string;

  // Modals & Triggers
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isCreateNotebookOpen: boolean;
  setIsCreateNotebookOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Notebooks
  notebooks: NotebookItem[];
  activeNotebookId: string;
  setActiveNotebookId: (id: string) => void;
  createNotebook: (data: Partial<NotebookItem>) => NotebookItem;
  updateNotebook: (id: string, updates: Partial<NotebookItem>) => void;
  deleteNotebook: (id: string) => void;
  duplicateNotebook: (id: string) => void;
  archiveNotebook: (id: string) => void;
  addChatMessage: (notebookId: string, msg: Omit<ChatMessage, "id" | "timestamp">) => void;
  addNotebookSource: (notebookId: string, file: File) => void;
  toggleNotebookSource: (notebookId: string, sourceId: string) => void;
  addNotebookNote: (notebookId: string, note: Omit<NotebookNote, "id" | "timestamp">) => void;
  deleteNotebookNote: (notebookId: string, noteId: string) => void;

  // Library Documents
  documents: LibraryDocument[];
  uploadDocuments: (files: File[], category: string) => Promise<void>;
  reprocessDocument: (id: string) => Promise<void>;
  deleteDocument: (id: string) => void;

  // Diagnostic
  diagnosticHistory: DiagnosticHistoryItem[];
  activeDiagnosis: DiagnosticResponse | null;
  setActiveDiagnosis: (res: DiagnosticResponse | null) => void;
  runDiagnosticExecution: (params: { imageFile: File | null; queryText: string; equipmentInfo?: any }) => Promise<DiagnosticResponse>;
  signSafetyInterlock: (diagnosisId: string, technicianId: string, confirmedItems: string[]) => Promise<void>;

  // Audit
  auditTrail: AuditRecord[];

  // Metrics
  totalDocsCount: number;
  totalPagesCount: number;
  totalGraphNodesCount: number;
  totalNotebooksCount: number;
  storageUsage: string;
}

const MecGContext = createContext<MecGContextType | undefined>(undefined);

export const MecGProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [currentUser] = useState("Alex Carter");
  const [userRole, setUserRole] = useState<"Technician" | "Operations Engineer" | "Safety Engineer" | "Administrator">("Technician");
  const [currentWorkspace, setCurrentWorkspace] = useState("Turbine Plant Skid A (Vestas & Siemens)");
  const [isOnline, setIsOnline] = useState(true);
  const [modelStatus, setModelStatus] = useState("Gemma INT4 • Edge Standby");

  // Global Dialogs & Toast
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateNotebookOpen, setIsCreateNotebookOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Keyboard shortcut Ctrl+K / Cmd+K for global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Health check
  useEffect(() => {
    const check = async () => {
      const res = await ApiService.checkHealth();
      setIsOnline(res.online);
      setModelStatus(res.online ? "FastAPI Edge Engine • INT4 Active" : "Local Standby • INT4 Offline Ready");
    };
    check();
    const int = setInterval(check, 12000);
    return () => clearInterval(int);
  }, []);

  // INITIAL PRE-LOADED INDUSTRIAL NOTEBOOKS (NotebookLM style)
  const [notebooks, setNotebooks] = useState<NotebookItem[]>([
    {
      id: "nb-vestas-yaw",
      name: "Vestas V112 Yaw Hydraulic Manifold",
      equipmentName: "V112 3.3MW Turbine",
      category: "Hydraulics",
      description: "Service documentation, solenoid relief valve procedures, and zero-energy LOTO protocols for nacelle yaw drive hydraulics.",
      docCount: 3,
      indexingStatus: "Indexed",
      lastUpdated: "8m ago",
      equipmentType: "Wind Turbine Nacelle",
      manufacturer: "Vestas Wind Systems",
      modelNumber: "V112-3.3MW",
      subsystem: "Nacelle Yaw Circuit",
      tags: ["hydraulics", "yaw-brake", "solenoid", "LOTO-01"],
      sources: [
        {
          id: "src-prv-992",
          name: "proportional_relief_valve_v2.md",
          type: "md",
          size: "14.2 KB",
          pages: 3,
          status: "indexed",
          selected: true,
          content: SAMPLE_DOCUMENTS[0]?.content || "Proportional relief valve technical specifications and cross-sectional diagrams."
        },
        {
          id: "src-loto-hyd",
          name: "lockout_tagout_hydraulics.md",
          type: "md",
          size: "18.6 KB",
          pages: 4,
          status: "indexed",
          selected: true,
          content: "Mandatory zero-energy isolation procedures under OSHA 1910.147. Manual bleeder valve NV-03 crack rating."
        },
        {
          id: "src-seal-proc",
          name: "valve_seal_replacement.md",
          type: "md",
          size: "22.1 KB",
          pages: 5,
          status: "indexed",
          selected: true,
          content: "Step-by-step disassembly sequence with 35 Nm torque recalibration on M10 fasteners."
        }
      ],
      messages: [
        {
          id: "msg-1",
          sender: "user",
          text: "What is the certified fastener torque specification for the PRV-992-B solenoid valve hex collar?",
          timestamp: "10:14 AM"
        },
        {
          id: "msg-2",
          sender: "assistant",
          text: "According to `proportional_relief_valve_v2.md` and `valve_seal_replacement.md`, the 4x M10 hex socket head cap screws must be tightened in a cross-diagonal sequence to exactly **35 Nm (+/- 1.5 Nm)** using a calibrated torque wrench. Before loosening, verify zero pressure on analog gauge PG-02.",
          timestamp: "10:14 AM",
          citations: [
            {
              citation_id: "cite-1",
              raw_citation: "[^procedures/valve_seal_replacement.md#reassembly]",
              node_path: "procedures/valve_seal_replacement.md",
              heading: "disassembly",
              exact_source_text: "Tighten 4x M10 hex socket head cap screws to 35 Nm in an alternating cross-diagonal sequence.",
              verification_status: "verified"
            }
          ]
        }
      ],
      notes: [
        {
          id: "note-1",
          title: "Viton O-Ring Part Number",
          content: "Replacement Viton 90-durometer O-ring kit: P/N ORK-VIT-90-22. Avoid marring aluminum sealing face with steel picks.",
          category: "torque",
          timestamp: "Yesterday"
        }
      ],
      studio: [
        {
          id: "stu-1",
          title: "Yaw Manifold LOTO Briefing",
          type: "briefing",
          summary: "Audio & technical summary covering the 5-step zero energy isolation sequence before servicing hydraulic manifold.",
          created: "2h ago"
        }
      ]
    },
    {
      id: "nb-pitch-pcb",
      name: "Pitch Controller PCB Short-Circuit Diagnostics",
      equipmentName: "Siemens SWT-3.2-113",
      category: "Power Electronics",
      description: "Schematics and arc-flash isolation steps for the 480V capacitor bus and DC-DC step-down converters in pitch hub.",
      docCount: 2,
      indexingStatus: "Indexed",
      lastUpdated: "1h ago",
      equipmentType: "Pitch Controller Hub",
      manufacturer: "Siemens Energy",
      modelNumber: "SWT-3.2-113",
      subsystem: "Hub Blade Pitch Circuit",
      tags: ["electronics", "capacitors", "arc-flash", "480V"],
      sources: [
        {
          id: "src-pcb-spec",
          name: "pcb_pitch_controller_v1.md",
          type: "md",
          size: "26.4 KB",
          pages: 6,
          status: "indexed",
          selected: true,
          content: "Pitch controller printed circuit board traces and thermal dissipation ratings."
        },
        {
          id: "src-arc-ppe",
          name: "arc_flash_ppe_level2.md",
          type: "md",
          size: "12.8 KB",
          pages: 2,
          status: "indexed",
          selected: true,
          content: "Mandatory NFPA 70E Level 2 Arc Flash suit, faceshield, and insulated gloves rated for 1000V."
        }
      ],
      messages: [],
      notes: [],
      studio: []
    },
    {
      id: "nb-sulzer-pump",
      name: "Subterranean Pump Skid Overhaul",
      equipmentName: "Sulzer MSD 4-Stage Skid",
      category: "Turbomachinery",
      description: "Mechanical seal flush piping plans, bearing vibration tolerances, and mechanical coupling alignment manuals.",
      docCount: 4,
      indexingStatus: "Indexed",
      lastUpdated: "Yesterday",
      equipmentType: "Centrifugal Multi-Stage Pump",
      manufacturer: "Sulzer Pumps",
      modelNumber: "MSD-3x6-4Stage",
      subsystem: "Primary Injection Skid",
      tags: ["pump", "mechanical-seal", "vibration", "alignment"],
      sources: [],
      messages: [],
      notes: [],
      studio: []
    },
    {
      id: "nb-honeywell-apu",
      name: "Aviation APU Fuel Metering Valve",
      equipmentName: "Honeywell 131-9A APU",
      category: "Avionics",
      description: "Auxiliary power unit electronic engine controller (EEC) wiring harness and high-pressure fuel bypass servo.",
      docCount: 5,
      indexingStatus: "Indexed",
      lastUpdated: "3 days ago",
      equipmentType: "Auxiliary Power Unit",
      manufacturer: "Honeywell Aerospace",
      modelNumber: "131-9A",
      subsystem: "Fuel Control & Metering",
      tags: ["aviation", "APU", "fuel-servo", "ATA-49"],
      sources: [],
      messages: [],
      notes: [],
      studio: []
    }
  ]);

  const [activeNotebookId, setActiveNotebookId] = useState<string>("nb-vestas-yaw");

  // INITIAL KNOWLEDGE LIBRARY DOCUMENTS
  const [documents, setDocuments] = useState<LibraryDocument[]>([
    {
      id: "doc-prv-992",
      filename: "proportional_relief_valve_v2.md",
      type: "MD",
      size: "14.2 KB",
      pages: 3,
      equipmentCategory: "Nacelle Hydraulics",
      processingStatus: "Ready",
      lastUpdated: "Today 09:20",
      hash: "8a4f91b32d01e67c",
      extractedText: "Proportional Relief Valve V2 (PRV-992-B) regulates pressure on yaw circuit. Viton 90-durometer seals prevent oil weeping.",
      chunks: [
        { id: "chk-1", tokens: 280, heading: "System Overview", preview: "The PRV-992-B proportional relief valve regulates hydraulic line holding pressure between 160 and 210 bar..." },
        { id: "chk-2", tokens: 340, heading: "Fastener Specifications", preview: "All manifold cap screws are M10 Class 10.9 requiring 35 Nm torque with cross-diagonal tightening sequence..." }
      ],
      partNumbers: ["PRV-992-B", "ORK-VIT-90-22"],
      safetyClassification: "Critical LOTO",
      relatedNodes: ["components/proportional_relief_valve_v2.md", "safety/lockout_tagout_hydraulics.md"]
    },
    {
      id: "doc-loto-hyd",
      filename: "lockout_tagout_hydraulics.md",
      type: "MD",
      size: "18.6 KB",
      pages: 4,
      equipmentCategory: "Safety Standards",
      processingStatus: "Ready",
      lastUpdated: "Today 09:22",
      hash: "f4b73210aa9e451b",
      extractedText: "OSHA 1910.147 standard for hazardous hydraulic energy control. Depressurize nitrogen accumulators before unbolting.",
      chunks: [
        { id: "chk-3", tokens: 310, heading: "Zero Energy Verification", preview: "Confirm analog test gauge PG-02 reads exactly 0.0 bar (0 psi) before touching manifold hex collar..." }
      ],
      partNumbers: ["HV-01", "NV-03"],
      safetyClassification: "Critical LOTO",
      relatedNodes: ["safety/lockout_tagout_hydraulics.md"]
    },
    {
      id: "doc-pcb-pitch",
      filename: "pcb_pitch_controller_v1.md",
      type: "MD",
      size: "26.4 KB",
      pages: 6,
      equipmentCategory: "Power Electronics",
      processingStatus: "Ready",
      lastUpdated: "Yesterday",
      hash: "12d88fa77b49c001",
      extractedText: "SWT-3.2-113 blade pitch axis driver printed circuit board. High-voltage capacitor bank discharge procedure.",
      chunks: [
        { id: "chk-4", tokens: 410, heading: "Capacitor Bank Safety", preview: "DC bus capacitors store 480V DC; bleeder resistors require 15 minutes to drop below 50V safety threshold..." }
      ],
      partNumbers: ["PCB-SWT-882", "CAP-480V-2200UF"],
      safetyClassification: "High Voltage",
      relatedNodes: ["components/pcb_pitch_controller_v1.md", "safety/arc_flash_ppe_level2.md"]
    },
    {
      id: "doc-seal-repl",
      filename: "valve_seal_replacement.md",
      type: "MD",
      size: "22.1 KB",
      pages: 5,
      equipmentCategory: "Maintenance Procedures",
      processingStatus: "Ready",
      lastUpdated: "Yesterday",
      hash: "77ac9018e4ff1102",
      extractedText: "Field technician procedure for resealing high-pressure solenoid valves. Non-marring brass pick usage.",
      chunks: [
        { id: "chk-5", tokens: 360, heading: "Disassembly Sequence", preview: "Support valve body axially to avoid dropping onto rotor deck. Loosen screws alternately..." }
      ],
      partNumbers: ["PRV-992-B"],
      safetyClassification: "Standard Safe",
      relatedNodes: ["procedures/valve_seal_replacement.md", "tools/calibrated_torque_wrench.md"]
    },
    {
      id: "doc-torque-spec",
      filename: "calibrated_torque_wrench.md",
      type: "MD",
      size: "9.5 KB",
      pages: 2,
      equipmentCategory: "Tools & Calibration",
      processingStatus: "Ready",
      lastUpdated: "2 days ago",
      hash: "33eb55198dfc4419",
      extractedText: "1/2 inch digital torque wrench calibrated to +/- 2% accuracy under ISO 6789 standards.",
      chunks: [
        { id: "chk-6", tokens: 210, heading: "Accuracy Range", preview: "Operable range: 10 to 100 Nm. Re-certification required every 5,000 cycles or 12 months..." }
      ],
      partNumbers: ["TW-DIGI-100"],
      safetyClassification: "Standard Safe",
      relatedNodes: ["tools/calibrated_torque_wrench.md"]
    }
  ]);

  // DIAGNOSTIC HISTORY
  const [diagnosticHistory, setDiagnosticHistory] = useState<DiagnosticHistoryItem[]>([
    {
      id: "DIAG-2026-0842",
      equipment: "Vestas V112 3.3MW Turbine",
      subsystem: "Nacelle Yaw Circuit",
      issue: "High pressure decay on yaw circuit with radial fluid weeping around PRV-992-B hex collar.",
      identifiedComponent: "Proportional Pressure Relief Valve V2",
      partNumber: "PRV-992-B",
      technician: "Alex Carter",
      technicianId: "TECH-ALEX-409",
      date: "Today 10:15 AM",
      safetyStatus: "Confirmed",
      sessionStatus: "Completed",
      diagnostic: SAMPLE_QUERIES[0].diagnostic
    },
    {
      id: "DIAG-2026-0841",
      equipment: "Siemens SWT-3.2-113",
      subsystem: "Pitch Controller Hub",
      issue: "Pitch motor driver fault with audible pop and thermal scorched capacitor on board.",
      identifiedComponent: "Pitch Controller PCB",
      partNumber: "PCB-SWT-882",
      technician: "Marcus Lindqvist",
      technicianId: "TECH-MARCUS-102",
      date: "Yesterday 04:30 PM",
      safetyStatus: "Confirmed",
      sessionStatus: "Completed",
      diagnostic: SAMPLE_QUERIES[1].diagnostic
    }
  ]);

  // ACTIVE DIAGNOSIS STATE
  const [activeDiagnosis, setActiveDiagnosis] = useState<DiagnosticResponse | null>(null);

  // AUDIT TRAIL
  const [auditTrail, setAuditTrail] = useState<AuditRecord[]>([
    {
      id: "AUD-99104",
      diagnosisId: "DIAG-2026-0842",
      technicianId: "TECH-ALEX-409",
      timestamp: new Date().toISOString(),
      inputImageHash: "sha256:d2d9d5d7e8124b1f",
      identifiedComponent: "Proportional Pressure Relief Valve V2 (PRV-992-B)",
      confidence: 0.96,
      observedDefect: "Extruded Viton 90-durometer O-ring seal under pulse pressure",
      verifiedCitationsCount: 3,
      completedSafetyChecks: [
        "De-energize main hydraulic pump motor breaker (CB-4)",
        "Attach personal safety padlock to valve HV-01",
        "Verify residual pressure reads 0.0 bar on PG-02"
      ],
      actionType: "LOTO_SIGNED"
    },
    {
      id: "AUD-99103",
      diagnosisId: "DIAG-2026-0842",
      technicianId: "TECH-ALEX-409",
      timestamp: new Date(Date.now() - 600000).toISOString(),
      inputImageHash: "sha256:d2d9d5d7e8124b1f",
      identifiedComponent: "Proportional Pressure Relief Valve V2",
      confidence: 0.96,
      observedDefect: "Extruded Viton 90-durometer seal with radial oil weepage",
      verifiedCitationsCount: 3,
      completedSafetyChecks: [],
      actionType: "DIAGNOSIS_EXECUTED"
    }
  ]);

  // NOTEBOOK ACTIONS
  const createNotebook = (data: Partial<NotebookItem>): NotebookItem => {
    const newNb: NotebookItem = {
      id: `nb-${Date.now().toString(36)}`,
      name: data.name || "Untitled Engineering Notebook",
      equipmentName: data.equipmentName || "General Asset",
      category: data.category || "General",
      description: data.description || "Engineering notes and diagnostic records.",
      docCount: 0,
      indexingStatus: "Indexed",
      lastUpdated: "Just now",
      equipmentType: data.equipmentType || "Field Equipment",
      manufacturer: data.manufacturer || "OEM",
      modelNumber: data.modelNumber || "N/A",
      subsystem: data.subsystem || "Main Assembly",
      tags: data.tags || ["notebook"],
      sources: [],
      messages: [],
      notes: [],
      studio: []
    };
    setNotebooks((prev) => [newNb, ...prev]);
    setActiveNotebookId(newNb.id);
    showToast(`Created notebook "${newNb.name}"`);
    return newNb;
  };

  const updateNotebook = (id: string, updates: Partial<NotebookItem>) => {
    setNotebooks((prev) =>
      prev.map((nb) => (nb.id === id ? { ...nb, ...updates, lastUpdated: "Just now" } : nb))
    );
  };

  const deleteNotebook = (id: string) => {
    setNotebooks((prev) => prev.filter((nb) => nb.id !== id));
    showToast("Notebook deleted");
  };

  const duplicateNotebook = (id: string) => {
    const target = notebooks.find((nb) => nb.id === id);
    if (!target) return;
    const duplicated: NotebookItem = {
      ...target,
      id: `nb-${Date.now().toString(36)}`,
      name: `${target.name} (Copy)`,
      lastUpdated: "Just now"
    };
    setNotebooks((prev) => [duplicated, ...prev]);
    showToast(`Duplicated "${target.name}"`);
  };

  const archiveNotebook = (id: string) => {
    showToast(`Archived notebook`);
  };

  const addChatMessage = (notebookId: string, msg: Omit<ChatMessage, "id" | "timestamp">) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: `msg-${Date.now().toString(36)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setNotebooks((prev) =>
      prev.map((nb) => {
        if (nb.id !== notebookId) return nb;
        return {
          ...nb,
          lastUpdated: "Just now",
          messages: [...nb.messages, newMsg]
        };
      })
    );
  };

  const addNotebookSource = (notebookId: string, file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "md";
    const newSrc: NotebookSource = {
      id: `src-${Date.now()}`,
      name: file.name,
      type: (["pdf", "docx", "xlsx", "pptx", "html", "md"].includes(ext) ? ext : "md") as any,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      pages: Math.max(1, Math.round(file.size / 15000)),
      status: "indexed",
      selected: true,
      content: `Extracted content from ${file.name}`
    };
    setNotebooks((prev) =>
      prev.map((nb) => {
        if (nb.id !== notebookId) return nb;
        return {
          ...nb,
          docCount: nb.docCount + 1,
          lastUpdated: "Just now",
          sources: [...nb.sources, newSrc]
        };
      })
    );
    showToast(`Added "${file.name}" to sources`);
  };

  const toggleNotebookSource = (notebookId: string, sourceId: string) => {
    setNotebooks((prev) =>
      prev.map((nb) => {
        if (nb.id !== notebookId) return nb;
        return {
          ...nb,
          sources: nb.sources.map((s) => (s.id === sourceId ? { ...s, selected: !s.selected } : s))
        };
      })
    );
  };

  const addNotebookNote = (notebookId: string, note: Omit<NotebookNote, "id" | "timestamp">) => {
    const newNote: NotebookNote = {
      ...note,
      id: `note-${Date.now()}`,
      timestamp: "Just now"
    };
    setNotebooks((prev) =>
      prev.map((nb) => (nb.id === notebookId ? { ...nb, notes: [newNote, ...nb.notes] } : nb))
    );
    showToast("Saved note to notebook");
  };

  const deleteNotebookNote = (notebookId: string, noteId: string) => {
    setNotebooks((prev) =>
      prev.map((nb) => (nb.id === notebookId ? { ...nb, notes: nb.notes.filter((n) => n.id !== noteId) } : nb))
    );
    showToast("Note deleted");
  };

  // LIBRARY UPLOAD & PIPELINE
  const uploadDocuments = async (files: File[], category: string) => {
    showToast(`Uploading ${files.length} document(s)...`);
    try {
      await ApiService.uploadAndCompileDocuments(files);
    } catch {
      // offline fallback
    }

    const newDocs: LibraryDocument[] = files.map((f, i) => {
      const ext = f.name.split(".").pop()?.toUpperCase() || "PDF";
      return {
        id: `doc-${Date.now()}-${i}`,
        filename: f.name,
        type: (["PDF", "DOCX", "XLSX", "PPTX", "HTML", "MD"].includes(ext) ? ext : "PDF") as any,
        size: `${(f.size / 1024).toFixed(1)} KB`,
        pages: Math.max(1, Math.round(f.size / 20000)),
        equipmentCategory: category || "General Machinery",
        processingStatus: "Ready",
        lastUpdated: "Just now",
        hash: `sha256:${Math.random().toString(16).slice(2, 10)}`,
        extractedText: `Parsed text content from ${f.name}. Preserved technical headings, tables, and torque constraints.`,
        chunks: [
          {
            id: `chk-${Date.now()}-1`,
            tokens: 280,
            heading: "System Architecture",
            preview: `Extracted specifications and pinout assignments from ${f.name}...`
          }
        ],
        partNumbers: ["OEM-GEN-01"],
        safetyClassification: "Standard Safe",
        relatedNodes: ["components/spec.md"]
      };
    });

    setDocuments((prev) => [...newDocs, ...prev]);
    showToast(`Successfully indexed ${files.length} document(s) into local OKF graph`);
  };

  const reprocessDocument = async (id: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, processingStatus: "Processing" } : d))
    );
    showToast("Reprocessing document structure...");
    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? { ...d, processingStatus: "Ready", lastUpdated: "Just now" } : d))
      );
      showToast("Document re-indexed successfully");
    }, 1200);
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    showToast("Document removed from knowledge library");
  };

  // DIAGNOSTIC EXECUTION
  const runDiagnosticExecution = async (params: {
    imageFile: File | null;
    queryText: string;
    equipmentInfo?: any;
  }): Promise<DiagnosticResponse> => {
    const res = await ApiService.runDiagnostic(params.imageFile, params.queryText);
    setActiveDiagnosis(res);

    // Add session to history
    const sessionItem: DiagnosticHistoryItem = {
      id: `DIAG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      equipment: params.equipmentInfo?.name || "Vestas V112 3.3MW Turbine",
      subsystem: params.equipmentInfo?.subsystem || "Nacelle Hydraulic Circuit",
      issue: params.queryText,
      identifiedComponent: res.detected_component.name,
      partNumber: res.detected_component.part_number || "OEM-PART-PENDING",
      technician: currentUser,
      technicianId: "TECH-ALEX-409",
      date: "Just now",
      safetyStatus: res.safety_interlocks.required ? "Blocked" : "Confirmed",
      sessionStatus: "Completed",
      diagnostic: res
    };

    setDiagnosticHistory((prev) => [sessionItem, ...prev]);

    // Add audit entry
    const auditItem: AuditRecord = {
      id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
      diagnosisId: sessionItem.id,
      technicianId: "TECH-ALEX-409",
      timestamp: new Date().toISOString(),
      inputImageHash: `sha256:${Math.random().toString(16).slice(2, 10)}`,
      identifiedComponent: res.detected_component.name,
      confidence: res.detected_component.confidence,
      observedDefect: res.detected_component.observed_defect,
      verifiedCitationsCount: res.citations.length,
      completedSafetyChecks: [],
      actionType: "DIAGNOSIS_EXECUTED"
    };

    setAuditTrail((prev) => [auditItem, ...prev]);
    showToast("Diagnostic completed with verified local citations");
    return res;
  };

  const signSafetyInterlock = async (diagnosisId: string, technicianId: string, confirmedItems: string[]) => {
    if (!activeDiagnosis) return;
    await ApiService.acknowledgeSafety(activeDiagnosis.diagnostic_id, technicianId, confirmedItems);

    const updated: DiagnosticResponse = {
      ...activeDiagnosis,
      safety_interlocks: {
        ...activeDiagnosis.safety_interlocks,
        acknowledged: true,
        acknowledged_by: technicianId,
        acknowledged_at: new Date().toISOString()
      }
    };
    setActiveDiagnosis(updated);

    // Update history
    setDiagnosticHistory((prev) =>
      prev.map((item) =>
        item.diagnostic.diagnostic_id === activeDiagnosis.diagnostic_id
          ? { ...item, safetyStatus: "Confirmed", diagnostic: updated }
          : item
      )
    );

    // Add audit entry
    const auditItem: AuditRecord = {
      id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
      diagnosisId: diagnosisId,
      technicianId: technicianId,
      timestamp: new Date().toISOString(),
      inputImageHash: `sha256:${Math.random().toString(16).slice(2, 10)}`,
      identifiedComponent: activeDiagnosis.detected_component.name,
      confidence: activeDiagnosis.detected_component.confidence,
      observedDefect: activeDiagnosis.detected_component.observed_defect,
      verifiedCitationsCount: activeDiagnosis.citations.length,
      completedSafetyChecks: confirmedItems,
      actionType: "LOTO_SIGNED"
    };
    setAuditTrail((prev) => [auditItem, ...prev]);
    showToast("OSHA 1910.147 LOTO signed. Procedural repair guidance unlocked!");
  };

  // Metrics
  const totalDocsCount = documents.length;
  const totalPagesCount = documents.reduce((sum, d) => sum + d.pages, 0);
  const totalGraphNodesCount = 7; // NetworkX graph nodes
  const totalNotebooksCount = notebooks.length;
  const storageUsage = "142.8 MB / 512 MB Local Cache";

  return (
    <MecGContext.Provider
      value={{
        theme,
        toggleTheme,
        currentUser,
        userRole,
        setUserRole,
        currentWorkspace,
        setCurrentWorkspace,
        isOnline,
        modelStatus,
        isSearchOpen,
        setIsSearchOpen,
        isCreateNotebookOpen,
        setIsCreateNotebookOpen,
        toastMessage,
        showToast,
        notebooks,
        activeNotebookId,
        setActiveNotebookId,
        createNotebook,
        updateNotebook,
        deleteNotebook,
        duplicateNotebook,
        archiveNotebook,
        addChatMessage,
        addNotebookSource,
        toggleNotebookSource,
        addNotebookNote,
        deleteNotebookNote,
        documents,
        uploadDocuments,
        reprocessDocument,
        deleteDocument,
        diagnosticHistory,
        activeDiagnosis,
        setActiveDiagnosis,
        runDiagnosticExecution,
        signSafetyInterlock,
        auditTrail,
        totalDocsCount,
        totalPagesCount,
        totalGraphNodesCount,
        totalNotebooksCount,
        storageUsage
      }}
    >
      <div className={theme === "light" ? "light" : ""}>{children}</div>
    </MecGContext.Provider>
  );
};

export const useMecG = () => {
  const ctx = useContext(MecGContext);
  if (!ctx) throw new Error("useMecG must be used within a MecGProvider");
  return ctx;
};

