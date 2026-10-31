# Contributing to MECH-G

Thank you for your interest in contributing to MECH-G! We welcome community contributions in domain knowledge bundles, industrial integrations, multimodal fault diagnostics, and engineering safety tooling.

---

## Code of Conduct

MECH-G is committed to providing a friendly, safe, and welcoming environment for everyone, regardless of background or experience. Please treat all contributors and users with respect.

---

## Development Setup

### Prerequisites
- **Python 3.10+** (recommended 3.11)
- **Node.js 20+** and npm
- **Docker & Docker Compose** (optional, for containerized development)

### Quick Start with Docker
```bash
# 1. Clone repository
git clone https://github.com/vishal-raaj-dnd/PROJECT-GEMMA.git
cd PROJECT-GEMMA

# 2. Configure environment
cp backend/.env.example backend/.env

# 3. Launch full stack
docker compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`

### Manual Setup

#### Backend (FastAPI + NetworkX)
```bash
cd backend
python -m venv .venv
# Linux/macOS:
source .venv/bin/activate
# Windows:
.\.venv\Scripts\activate

pip install -r requirements.txt
python run_backend.py
```

#### Frontend (React 19 + Vite)
```bash
cd frontend
npm install
npm run dev
```

---

## Pull Request Guidelines

1. **Keep it minimal & focused**: Solve one problem per PR. Avoid broad refactorings of unrelated files.
2. **Ensure tests pass**:
   ```bash
   # Run backend test suite
   pytest backend/tests -v

   # Run frontend build verification
   cd frontend && npm run build
   ```
3. **Format & lint**: Match existing project style, typescript conventions, and python PEP 8 guidelines.
4. **Preserve safety interlocks**: Any changes to `/api/safety` or LOTO workflows must guarantee zero-energy state verification.

---

## Authoring Open Knowledge Format (OKF) Bundles

MECH-G uses the Open Knowledge Format (OKF) to represent equipment knowledge, schematics, and procedures.

### Anatomy of an OKF Node
Each node is a Markdown file with YAML frontmatter:
```markdown
---
id: hydraulic_accumulator_bladders
type: component
title: Hydraulic Accumulator Bladders
subsystem: Hydraulic Power Unit (HPU)
part_numbers:
  - ACC-BLAD-992-B
  - ACC-SEAL-441-A
safety_prerequisites:
  - safety/lockout_tagout_hydraulics.md
required_tools:
  - tools/calibrated_torque_wrench.md
tags:
  - hydraulic
  - accumulator
  - pressure
---

## Overview
Detailed technical specifications and maintenance guidance...

## Replacement Procedure
1. Verify pressure is 0 bar using gauge PG-101.
2. Follow LOTO protocol [^safety/lockout_tagout_hydraulics.md#depressurization].
```

---

## Questions or Issues?

Open an issue on GitHub or join our community discussions. We are glad to have you aboard!

