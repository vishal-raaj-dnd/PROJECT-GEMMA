import pytest
from pathlib import Path
from app.services.graph_engine import OKFGraphEngine
from app.services.citation_auditor import CitationAuditor


@pytest.fixture
def auditor():
    data_dir = Path(__file__).parent.parent / "data" / "okf_bundle"
    engine = OKFGraphEngine(root_dir=str(data_dir))
    return CitationAuditor(graph_engine=engine)


def test_audit_valid_citation(auditor: CitationAuditor):
    text = (
        "Torque the 4x M10 bolts to 35 Nm upon reassembly "
        "[^components/proportional_relief_valve_v2.md#specifications] "
        "and isolate energy [^safety/lockout_tagout_hydraulics.md#isolation-procedure]."
    )
    verifications, all_verified = auditor.audit_text(text)

    assert len(verifications) == 2
    assert all_verified is True

    v1 = verifications[0]
    assert v1.verification_status == "verified"
    assert "components/proportional_relief_valve_v2.md" in v1.node_path
    assert "Fastener Torque: 35 Nm" in v1.exact_source_text

    v2 = verifications[1]
    assert v2.verification_status == "verified"
    assert "safety/lockout_tagout_hydraulics.md" in v2.node_path
    assert "De-energize main hydraulic pump" in v2.exact_source_text


def test_audit_hallucinated_citation_detected(auditor: CitationAuditor):
    text = "Follow instruction [^manuals/unreal_aircraft_manual_vol99.md#fire-drill]."
    verifications, all_verified = auditor.audit_text(text)

    assert len(verifications) == 1
    assert all_verified is False
    assert verifications[0].verification_status == "unverified_node"
    assert "Citation Failed" in verifications[0].exact_source_text


def test_audit_hallucinated_heading_in_valid_node(auditor: CitationAuditor):
    text = "Inspect component [^components/proportional_relief_valve_v2.md#nonexistent_rocket_engine_subsystem]."
    verifications, all_verified = auditor.audit_text(text)

    assert len(verifications) == 1
    assert all_verified is False
    assert verifications[0].verification_status == "unverified_section"
