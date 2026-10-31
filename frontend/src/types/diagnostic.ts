export interface DetectedComponent {
  name: string;
  part_number: string | null;
  node_path: string;
  confidence: number;
  observed_defect: string;
  visual_indicators: string[];
}

export interface SafetyPrerequisite {
  id: string;
  title: string;
  node_path: string;
  checklist: string[];
  citation: string;
}

export interface SafetyInterlocks {
  required: boolean;
  acknowledged: boolean;
  acknowledged_by: string | null;
  acknowledged_at: string | null;
  prerequisites: SafetyPrerequisite[];
}

export interface RequiredTool {
  name: string;
  node_path?: string | null;
  spec?: string | null;
  citation?: string | null;
}

export interface RemediationStep {
  step_number: number;
  instruction: string;
  torque_spec: string | null;
  tool_required: string | null;
  hazard_warning: string | null;
  citation: string;
}

export interface RemediationPlan {
  title: string;
  estimated_duration_minutes: number | null;
  required_tools: RequiredTool[];
  steps: RemediationStep[];
  post_maintenance_verification: string[];
}

export interface CitationVerification {
  citation_id: string;
  raw_citation: string;
  node_path: string;
  heading: string | null;
  exact_source_text: string;
  verification_status: "verified" | "unverified_node" | "unverified_section";
}

export interface DiagnosticResponse {
  diagnostic_id: string;
  timestamp: string;
  query_summary: string;
  detected_component: DetectedComponent;
  safety_interlocks: SafetyInterlocks;
  remediation_plan: RemediationPlan | null;
  citations: CitationVerification[];
  active_subgraph_nodes: string[];
}

export interface OKFNodeSummary {
  id: string;
  relative_path: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  part_numbers: string[];
  outgoing_count: number;
}

export interface GraphStats {
  total_nodes: number;
  total_edges: number;
  category_counts: Record<string, number>;
  is_indexed: boolean;
}
