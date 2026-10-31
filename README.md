# 🛠️ Field Engineering & Hardware Diagnostic Engine

> **Offline-first multimodal edge diagnostic engine for high-value industrial machinery.**  
> Powered by your **OmniOKF (`gemini-okf-compiler`)** knowledge graph pipeline, multimodal **Gemma** vision, and a deterministic **Verifiable Citation Engine** that mathematically rejects hallucinated references.

---

## 🏗️ Architecture Summary

```
                      +--------------------------------------+
                      |  FRONTEND (FieldOps Web Client)      |
                      |  - Camera Capture / Image Upload     |
                      |  - Lockout/Tagout Safety Gate        |
                      |  - Step-by-Step Interactive Fix      |
                      |  - Citation Evidence Drawer          |
                      +--------------------------------------+
                                         |
                                         | REST / OpenAPI (/docs)
                                         v
+------------------------------------------------------------------------------------+
|                               FASTAPI EDGE BACKEND                                 |
|                                                                                    |
|  1. Ingestion Layer (OmniOKF Compiler)                                             |
|     - MarkItDown + PyMuPDF layout-aware parsing for PDF, DOCX, XLSX, MD            |
|     - Header boundary semantic concept splitting                                   |
|     - Gemma-powered frontmatter categorization & tagging                           |
|     - TF-IDF collision-safe relative cross-linking & Mermaid generation            |
|                                                                                    |
|  2. In-Memory Graph Engine (NetworkX)                                              |
|     - Zero cloud database: fully backed by local Markdown files & frontmatter      |
|     - Sub-millisecond part number, serial code, and fuzzy node resolution          |
|     - Upstream safety traversal (OSHA 1910.147 Lockout/Tagout interlocks)          |
|     - Downstream repair procedure and tool traversal                               |
|                                                                                    |
|  3. Multimodal Gemma Engine                                                        |
|     - Visual defect classification (burnt capacitors, fluid weepage, blink codes)  |
|     - Subgraph grounded remediation synthesis                                      |
|                                                                                    |
|  4. Deterministic Citation Auditor                                                 |
|     - Parses all `[^file.md#heading]` markers from model output                    |
|     - Validates against active in-memory OKF graph and extracts source excerpts    |
|     - Flags and strips unverified/hallucinated node references                     |
+------------------------------------------------------------------------------------+
```

---

## ⚡ Quick Start

### 1. Prerequisites & Virtual Environment
Python 3.10+ is required. The dedicated virtual environment is pre-configured in `.venv`.

To activate in PowerShell:
```powershell
.\.venv\Scripts\Activate.ps1
```

### 2. Environment Variables
Create/edit `.env` (or `backend/.env`):
```bash
cp backend/.env.example backend/.env
```
Edit `backend/.env`:
```env
# Your Google GenAI / Gemma API Key (https://aistudio.google.com/)
GEMMA_API_KEY=your_key_here

# Model to use
GEMMA_MODEL=gemini-2.5-flash

# Paths
OKF_STORAGE_DIR=./backend/data/okf_bundle
RAW_DOCS_DIR=./backend/data/raw_docs

# Server
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
STRICT_SAFETY_GATE=true
```
*(Note: If no API key is set, the system automatically uses its built-in deterministic heuristic edge classifiers so that local development and offline testing work seamlessly without errors).*

### 3. Launch Backend API Server
```powershell
.\.venv\Scripts\python.exe run_backend.py
```
Open **Swagger Interactive Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

### 4. Run Automated Test Suite
```powershell
.\.venv\Scripts\pytest backend/tests -v
```
All 15 unit and integration tests verify graph traversal, fuzzy part lookup, citation auditing, safety gates, and OKF compiler workflows.

---

## 📡 API Endpoints for Frontend Integration

### 1. Diagnostic (`/api/diagnose`)
- **`POST /api/diagnose`**
  - **Payload (multipart/form-data)**:
    - `image`: Binary image file (JPEG, PNG, WEBP)
    - `query_text`: Optional technician notes or part number string (e.g. `"PRV-992-B"`)
  - **Returns**: Full `DiagnosticResponse`:
    - `detected_component`: Name, part number, defect description, confidence score.
    - `safety_interlocks`: `required: true`, `acknowledged: false`, list of mandatory LOTO steps.
    - `remediation_plan`: Step-by-step checklist with torque values, required tools, and warnings.
    - `citations`: Verified source citations with exact text excerpts for the Evidence Drawer.
- **`POST /api/diagnose/{diagnostic_id}/safety-ack`**
  - **Payload (JSON)**: `{"diagnostic_id": "...", "technician_id": "TECH-101", "confirmed_items": [...]}`
  - Unlocks the repair sequence once the technician acknowledges all safety interlocks.
- **`GET /api/diagnose/{diagnostic_id}`**
  - Retrieves existing session state.

### 2. Knowledge Graph (`/api/graph`)
- **`GET /api/graph/stats`**: Node count, edge count, category breakdown.
- **`GET /api/graph/nodes`**: Complete list of all loaded OKF nodes.
- **`GET /api/graph/nodes/{node_path}`**: Full node detail, parsed frontmatter, and outgoing links.
- **`GET /api/graph/mermaid`**: Returns live Mermaid flowchart definition string.
- **`POST /api/graph/reload`**: Hot-reloads the knowledge graph from disk.

### 3. Ingestion & Compiler (`/api/ingest`)
- **`POST /api/ingest/upload`**: Uploads raw documents (PDF, DOCX, XLSX, MD) and compiles them into `.okf` format using your OmniOKF engine.
- **`POST /api/ingest/compile-all`**: Recompiles all manuals in the raw documents folder.
- **`GET /api/ingest/manifest`**: Returns incremental MD5 hash cache status.

