from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class DetectedComponent(BaseModel):
    name: str = Field(description="Identified component name")
    part_number: Optional[str] = Field(default=None, description="Extracted or matched part/serial number")
    node_path: str = Field(description="Relative path of the resolved OKF node")
    confidence: float = Field(ge=0.0, le=1.0, description="Visual/inference confidence score")
    observed_defect: str = Field(description="Description of anomaly, damage, or wear detected")
    visual_indicators: List[str] = Field(default_factory=list, description="Visual markers observed (burn marks, leaks, LEDs)")


class SafetyPrerequisite(BaseModel):
    id: str = Field(description="Unique safety node identifier")
    title: str = Field(description="Safety protocol title (e.g., LOTO Hydraulics)")
    node_path: str = Field(description="Relative path to safety markdown file")
    checklist: List[str] = Field(description="Individual mandatory sign-off items")
    citation: str = Field(description="Verifiable citation key")


class SafetyInterlocks(BaseModel):
    required: bool = Field(description="True if any upstream safety procedure must be performed")
    acknowledged: bool = Field(default=False, description="True once field technician signs off")
    acknowledged_by: Optional[str] = Field(default=None, description="Technician badge or ID")
    acknowledged_at: Optional[str] = Field(default=None, description="ISO timestamp of signoff")
    prerequisites: List[SafetyPrerequisite] = Field(default_factory=list)


class RequiredTool(BaseModel):
    name: str = Field(description="Tool name (e.g. Calibrated Torque Wrench)")
    node_path: Optional[str] = Field(default=None, description="Link to tool specification node")
    spec: Optional[str] = Field(default=None, description="Required specification or calibration range")
    citation: Optional[str] = Field(default=None)


class RemediationStep(BaseModel):
    step_number: int = Field(ge=1)
    instruction: str = Field(description="Detailed physical action to perform")
    torque_spec: Optional[str] = Field(default=None, description="Fastener torque rating if applicable")
    tool_required: Optional[str] = Field(default=None, description="Specific tool required for this step")
    hazard_warning: Optional[str] = Field(default=None, description="Specific local hazard to watch for")
    citation: str = Field(description="Verifiable node citation")


class RemediationPlan(BaseModel):
    title: str = Field(description="Title of the repair protocol")
    estimated_duration_minutes: Optional[int] = Field(default=None)
    required_tools: List[RequiredTool] = Field(default_factory=list)
    steps: List[RemediationStep] = Field(default_factory=list)
    post_maintenance_verification: List[str] = Field(default_factory=list)


class CitationVerification(BaseModel):
    citation_id: str
    raw_citation: str
    node_path: str
    heading: Optional[str] = None
    exact_source_text: str
    verification_status: str  # "verified", "unverified_node", "unverified_section"


class DiagnosticResponse(BaseModel):
    diagnostic_id: str
    timestamp: str
    query_summary: str
    detected_component: DetectedComponent
    safety_interlocks: SafetyInterlocks
    remediation_plan: Optional[RemediationPlan] = None
    citations: List[CitationVerification] = Field(default_factory=list)
    active_subgraph_nodes: List[str] = Field(default_factory=list)


class SafetyAckRequest(BaseModel):
    diagnostic_id: str
    technician_id: str
    confirmed_items: List[str]


class SafetyAckResponse(BaseModel):
    diagnostic_id: str
    acknowledged: bool
    acknowledged_by: str
    acknowledged_at: str
    message: str
