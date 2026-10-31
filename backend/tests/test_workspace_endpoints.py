import pytest
from fastapi.testclient import TestClient
from pathlib import Path

from app.main import app
from app.config import settings

client = TestClient(app)


def test_documents_endpoint():
    response = client.get("/api/documents")
    assert response.status_code == 200
    docs = response.json()
    assert isinstance(docs, list)
    # The seeded document should be present
    if docs:
        assert "filename" in docs[0]
        assert "status" in docs[0]


def test_react_flow_graph_endpoint():
    response = client.get("/api/graph/react-flow")
    assert response.status_code == 200
    data = response.json()
    assert "nodes" in data
    assert "edges" in data
    assert "stats" in data
    assert len(data["nodes"]) > 0

    first_node = data["nodes"][0]
    assert "id" in first_node
    assert first_node["type"] == "conceptNode"
    assert "position" in first_node
    assert "data" in first_node
    assert "title" in first_node["data"]
    assert "category" in first_node["data"]


def test_graph_search_and_neighborhood():
    # Search
    search_res = client.get("/api/graph/search?q=valve")
    assert search_res.status_code == 200
    results = search_res.json()
    assert isinstance(results, list)

    # Neighborhood
    nodes_res = client.get("/api/graph/nodes")
    assert nodes_res.status_code == 200
    all_nodes = nodes_res.json()
    if all_nodes:
        first_path = all_nodes[0]["relative_path"]
        neigh_res = client.get(f"/api/graph/neighborhood/{first_path}?depth=2")
        assert neigh_res.status_code == 200
        neigh_data = neigh_res.json()
        assert "nodes" in neigh_data
        assert "edges" in neigh_data


def test_conversations_and_chat_streaming():
    # 1. Create conversation
    create_res = client.post("/api/chat/conversations", json={"title": "Test Hydraulic Consultation"})
    assert create_res.status_code == 200
    conv = create_res.json()
    conv_id = conv["id"]
    assert conv["title"] == "Test Hydraulic Consultation"

    # 2. Get conversation
    get_res = client.get(f"/api/chat/conversations/{conv_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == conv_id

    # 3. Test chat streaming endpoint
    stream_res = client.post(
        f"/api/chat/conversations/{conv_id}/stream",
        json={"message": "What is the procedure for replacing the PRV-992-B valve seal?"}
    )
    assert stream_res.status_code == 200
    content = stream_res.text
    assert "event: status" in content
    assert "event: token" in content
    assert "event: done" in content

    # 4. Check that message was persisted
    msgs_res = client.get(f"/api/chat/conversations/{conv_id}/messages")
    assert msgs_res.status_code == 200
    msgs = msgs_res.json()
    assert len(msgs) >= 2  # user + assistant
    assert msgs[0]["role"] == "user"
    assert msgs[1]["role"] == "assistant"

    # 5. Clean up conversation
    del_res = client.delete(f"/api/chat/conversations/{conv_id}")
    assert del_res.status_code == 200

