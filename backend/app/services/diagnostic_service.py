import uuid
import logging
from datetime import datetime
from typing import Optional, List, Dict
from pathlib import Path

from app.config import settings
from app.models.diagnostic_models import (
    DiagnosticResponse,
    DetectedComponent,
    SafetyInterlocks,
    SafetyPrerequisite,
    RemediationPlan,
    RemediationStep,
    RequiredTool,
    SafetyAckRequest,
    SafetyAckResponse,
)
from app.services.graph_engine import OKFGraphEngine
from app.services.citation_auditor import CitationAuditor
from app.services.gemma_client import GemmaClient

logger = logging.getLogger(__name__)


class DiagnosticService:
    """Orchestrates end-to-end industrial hardware diagnostics."""

    def __init__(self, graph_engine: OKFGraphEngine, gemma_client: GemmaClient):
        self.graph_engine = graph_engine
        self.gemma_client = gemma_client
        self.citation_auditor = CitationAuditor(graph_engine)
        self.active_sessions: Dict[str, DiagnosticResponse] = {}

    async def run_diagnostic(
        self,
        image_bytes: Optional[bytes] = None,
        image_mime: str = "image/jpeg",
        query_text: Optional[str] = None
    ) -> DiagnosticResponse:
        diag_id = f"diag_{uuid.uuid4().hex[:10]}"
        timestamp = datetime.utcnow().isoformat() + "Z"

        # 1. Visual Feature Extraction via Gemma
        visual_findings = await self.gemma_client.analyze_visual_fault(
            image_bytes=image_bytes,
            image_mime=image_mime,
            query_text=query_text
        )

        # 2. Resolve Entry Node in Local OKF Graph
        lookup_query = visual_findings.part_number or visual_findings.identified_component or (query_text or "")
        entry_node = self.graph_engine.resolve_entry_node(lookup_query)

        entry_path = entry_node.relative_path if entry_node else "components/general_hardware.md"
        entry_title = entry_node.frontmatter.title if entry_node else visual_findings.identified_component

        # 3. Graph Traversal: Prerequisite Safety Nodes & Subgraph Context
        safety_nodes = self.graph_engine.get_upstream_safety_prerequisites(entry_path) if entry_node else []
        subgraph_nodes = self.graph_engine.get_connected_subgraph_nodes(entry_path, max_depth=2) if entry_node else []

        active_subgraph_paths = [n.relative_path for n in subgraph_nodes]

        # 4. Assemble Grounded Context for Gemma
        context_parts = []
        for n in subgraph_nodes:
            context_parts.append(
                f"<!-- REF_START: {n.relative_path} -->\n"
                f"# {n.frontmatter.title}\n"
                f"Category: {n.frontmatter.type.value if hasattr(n.frontmatter.type, 'value') else n.frontmatter.type}\n"
                f"{n.content}\n"
                f"<!-- REF_END: {n.relative_path} -->"
            )
        subgraph_context_str = "\n\n".join(context_parts)

        # 5. Synthesize Grounded Remediation Protocol
        synth_remediation = await self.gemma_client.synthesize_grounded_remediation(
            component_name=entry_title,
            defect=visual_findings.observed_defect,
            subgraph_context=subgraph_context_str
        )

        # 6. Audit Emitted Citations
        raw_output_text = " ".join([step.instruction + " " + step.citation for step in synth_remediation.steps])
        citations, all_verified = self.citation_auditor.audit_text(
            raw_text=raw_output_text,
            active_subgraph_paths=active_subgraph_paths
        )

        # 7. Safety Interlocks Construction
        prereqs: List[SafetyPrerequisite] = []
        for sn in safety_nodes:
            # Extract checklist lines or bullet items from safety markdown
            bullets = [
                line.strip().lstrip("-* ").strip()
                for line in sn.content.splitlines()
                if line.strip().startswith(("-", "*", "1.", "2.", "3."))
            ]
            if not bullets:
                bullets = [f"Complete standard zero-energy isolation for {sn.frontmatter.title}"]

            prereqs.append(SafetyPrerequisite(
                id=sn.frontmatter.id or Path(sn.relative_path).stem,
                title=sn.frontmatter.title,
                node_path=sn.relative_path,
                checklist=bullets[:5],
                citation=f"[^{sn.relative_path}]"
            ))

        has_safety = len(prereqs) > 0 or settings.strict_safety_gate
        safety_interlocks = SafetyInterlocks(
            required=has_safety,
            acknowledged=False,
            prerequisites=prereqs
        )

        # Format remediation steps
        remediation_steps = [
            RemediationStep(
                step_number=s.step_number,
                instruction=s.instruction,
                torque_spec=s.torque_spec,
                tool_required=s.tool_required,
                hazard_warning=s.hazard_warning,
                citation=s.citation
            )
            for s in synth_remediation.steps
        ]

        remediation_plan = RemediationPlan(
            title=synth_remediation.title,
            estimated_duration_minutes=synth_remediation.estimated_duration_minutes,
            steps=remediation_steps,
            post_maintenance_verification=synth_remediation.post_maintenance_verification
        )

        response = DiagnosticResponse(
            diagnostic_id=diag_id,
            timestamp=timestamp,
            query_summary=query_text or f"Visual inspection of {entry_title}",
            detected_component=DetectedComponent(
                name=entry_title,
                part_number=visual_findings.part_number,
                node_path=entry_path,
                confidence=visual_findings.confidence,
                observed_defect=visual_findings.observed_defect,
                visual_indicators=visual_findings.visual_indicators
            ),
            safety_interlocks=safety_interlocks,
            remediation_plan=remediation_plan,
            citations=citations,
            active_subgraph_nodes=active_subgraph_paths
        )

        self.active_sessions[diag_id] = response
        return response

    def acknowledge_safety(self, req: SafetyAckRequest) -> SafetyAckResponse:
        session = self.active_sessions.get(req.diagnostic_id)
        if not session:
            raise KeyError(f"Diagnostic session {req.diagnostic_id} not found")

        timestamp = datetime.utcnow().isoformat() + "Z"
        session.safety_interlocks.acknowledged = True
        session.safety_interlocks.acknowledged_by = req.technician_id
        session.safety_interlocks.acknowledged_at = timestamp

        return SafetyAckResponse(
            diagnostic_id=req.diagnostic_id,
            acknowledged=True,
            acknowledged_by=req.technician_id,
            acknowledged_at=timestamp,
            message="Safety prerequisites verified. Mechanical procedure unlocked."
        )

