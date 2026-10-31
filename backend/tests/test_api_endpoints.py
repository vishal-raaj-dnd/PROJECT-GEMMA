import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client


def test_health_and_root(client: TestClient):
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["status"] == "operational"

    health = client.get("/health")
    assert health.status_code == 200
    assert health.json()["status"] == "healthy"


def test_graph_endpoints(client: TestClient):
    stats = client.get("/api/graph/stats")
    assert stats.status_code == 200
    data = stats.json()
    assert data["total_nodes"] >= 6
    assert data["is_indexed"] is True

    nodes = client.get("/api/graph/nodes")
    assert nodes.status_code == 200
    assert isinstance(nodes.json(), list)
    assert len(nodes.json()) >= 6

    mermaid = client.get("/api/graph/mermaid")
    assert mermaid.status_code == 200
    assert "mermaid" in mermaid.json()
    assert "graph TD" in mermaid.json()["mermaid"]


def test_diagnostic_and_safety_gate_flow(client: TestClient):
    # 1. Run diagnostic with text query for PRV-992-B
    diag_res = client.post(
        "/api/diagnose",
        data={"query_text": "Pressure drop observed on valve PRV-992-B with oil leaking"}
    )
    assert diag_res.status_code == 200
    diag_data = diag_res.json()

    assert "diagnostic_id" in diag_data
    diag_id = diag_data["diagnostic_id"]
    assert "PRV-992-B" in diag_data["detected_component"]["part_number"]
    assert diag_data["safety_interlocks"]["required"] is True
    assert diag_data["safety_interlocks"]["acknowledged"] is False

    # Check that citations are present and verified
    assert len(diag_data["citations"]) > 0

    # 2. Acknowledge safety gate
    ack_res = client.post(
        f"/api/diagnose/{diag_id}/safety-ack",
        json={
            "diagnostic_id": diag_id,
            "technician_id": "TECH-ALEX-409",
            "confirmed_items": ["item1", "item2"]
        }
    )
    assert ack_res.status_code == 200
    ack_data = ack_res.json()
    assert ack_data["acknowledged"] is True
    assert ack_data["acknowledged_by"] == "TECH-ALEX-409"

    # 3. Retrieve session again and verify safety acknowledged state persisted
    session_res = client.get(f"/api/diagnose/{diag_id}")
    assert session_res.status_code == 200
    assert session_res.json()["safety_interlocks"]["acknowledged"] is True
