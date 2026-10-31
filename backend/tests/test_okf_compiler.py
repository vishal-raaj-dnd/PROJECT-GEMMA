import pytest
from pathlib import Path
from app.services.okf_compiler.parser import split_markdown, smart_local_classify
from app.services.okf_compiler.linker import get_link_keywords, get_relative_path, cross_link_concepts
from app.services.okf_compiler.compiler_service import OKFCompilerService


def test_split_markdown_headers():
    raw_text = (
        "# System Manual\n\nIntroduction text.\n\n"
        "## Subsystem Valve\n\nValve details and operations.\n\n"
        "## Subsystem Pump\n\nPump specifications."
    )
    chunks = split_markdown(raw_text, split_level="##")
    assert len(chunks) == 3
    assert chunks[1]["header"] == "Subsystem Valve"
    assert chunks[2]["header"] == "Subsystem Pump"


def test_smart_local_classify():
    header = "Lockout Tagout Safety Protocol"
    body = "Technicians must de-energize breaker CB-4 and wear PPE before servicing high-voltage lines."
    meta = smart_local_classify(header, body, idx=0)

    assert meta["type"] == "safety"
    assert meta["filename"] == "lockout-tagout-safety-protocol"
    assert "safety" in meta["tags"]


def test_cross_link_concepts():
    concepts = {
        "concept_1": {
            "metadata": {
                "title": "Proportional Relief Valve",
                "type": "components",
                "filename": "proportional-relief-valve"
            },
            "content": "Operates alongside the Hydraulic Main Pump in high-pressure circuits."
        },
        "concept_2": {
            "metadata": {
                "title": "Hydraulic Main Pump",
                "type": "components",
                "filename": "hydraulic-main-pump"
            },
            "content": "Supplies pressurized fluid to the Proportional Relief Valve."
        }
    }

    linked = cross_link_concepts(concepts)
    assert "concept_1" in linked
    assert "concept_2" in linked
    # concept_1 should link to Hydraulic Main Pump
    assert "[Hydraulic Main Pump](./hydraulic-main-pump.md)" in linked["concept_1"]
    # concept_2 should link to Proportional Relief Valve
    assert "[Proportional Relief Valve](./proportional-relief-valve.md)" in linked["concept_2"]


def test_compiler_service_compiles_file(tmp_path: Path):
    # Create sample raw document
    sample_doc = tmp_path / "raw_manual.md"
    sample_doc.write_text(
        "# Turbine Auxiliary Manual\n\n"
        "## Actuator Motor\nElectric servo actuator motor.\n\n"
        "## Emergency Shutdown\nMandatory safety shutdown protocol."
    )

    output_dir = tmp_path / "compiled_bundle"
    compiler = OKFCompilerService(output_dir=str(output_dir))

    res = compiler.compile_files([str(sample_doc)])
    assert res.status == "completed"
    assert res.concepts_created >= 2
    assert (output_dir / "index.md").exists()
