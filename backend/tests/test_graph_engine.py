import pytest
from pathlib import Path
from app.services.graph_engine import OKFGraphEngine
from app.models.okf_models import OKFNodeType


@pytest.fixture
def graph_engine():
    data_dir = Path(__file__).parent.parent / "data" / "okf_bundle"
    return OKFGraphEngine(root_dir=str(data_dir))


def test_graph_initialization(graph_engine: OKFGraphEngine):
    stats = graph_engine.get_stats()
    assert stats.total_nodes >= 6
    assert stats.total_edges >= 4
    assert stats.is_indexed is True
    assert "components" in stats.category_counts
    assert "safety" in stats.category_counts


def test_resolve_by_exact_part_number(graph_engine: OKFGraphEngine):
    node = graph_engine.resolve_entry_node("PRV-992-B")
    assert node is not None
    assert "proportional_relief_valve_v2" in node.relative_path
    assert node.frontmatter.title == "Proportional Pressure Relief Valve V2"


def test_resolve_by_fuzzy_query(graph_engine: OKFGraphEngine):
    node = graph_engine.resolve_entry_node("pitch controller board")
    assert node is not None
    assert "pcb_pitch_controller_v1" in node.relative_path


def test_upstream_safety_traversal(graph_engine: OKFGraphEngine):
    entry_path = "components/proportional_relief_valve_v2.md"
    safety_prereqs = graph_engine.get_upstream_safety_prerequisites(entry_path)

    assert len(safety_prereqs) >= 1
    safety_paths = [s.relative_path for s in safety_prereqs]
    assert any("lockout_tagout_hydraulics" in p for p in safety_paths)


def test_subgraph_traversal_depth(graph_engine: OKFGraphEngine):
    entry_path = "components/proportional_relief_valve_v2.md"
    subgraph = graph_engine.get_connected_subgraph_nodes(entry_path, max_depth=2)

    paths = [n.relative_path for n in subgraph]
    assert entry_path in paths
    assert any("valve_seal_replacement" in p for p in paths)
    assert any("calibrated_torque_wrench" in p for p in paths)
