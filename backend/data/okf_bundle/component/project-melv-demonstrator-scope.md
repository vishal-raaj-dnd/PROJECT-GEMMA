---
id: project-melv-demonstrator-scope
type: component
title: Project MELV Demonstrator Scope and Reference Code
description: A technical overview of the Project MELV demonstrator scope, including
  repository access, feature priorities, demo script, and core algorithmic implementation
  for corridor planning.
tags:
- project-melv
- demonstrator-scope
- corridor-planner
- fastapi-endpoints
- algorithm-implementation
timestamp: null
---

## 22. Demonstrator Scope and Reference Code

Repository: github.com/narain-karti/Project-MELV

```bash
git clone https://github.com/narain-karti/Project-MELV.git
cd Project-MELV/frontend && npm install && npm run dev      # command centre
cd ../backend && python -m venv venv && source venv/bin/activate   # venv\Scripts\activate on Windows
pip install -r requirements.txt && python app.py            # live ingestion sandbox
```

**Features and priorities**

| # | Feature | What it shows | Tab | Effort | Priority |
| :-- | :-- | :-- | :-- | :-- | :-- |
| 1 | Incident injection ("Trigger collision") | Tier-1 flag, Tier-2 verification on buffered frames, peer corroboration, fusion score, severity | 2 | 1-2 d | P0 |
| 2 | Latency waterfall with real timestamps | Collision to first signal change, stage by stage against the 3 s budget; label values \[M\] only if measured | 5 | 1 d | P0 |
| 3 | Emergency corridor on the map | Ambulance, RESERVE/ACK/GRANT log, signals green ahead and released behind, shortest vs fastest-under-clearance, ETA saved | 1, 5 | 3-4 d | P0 |
| 4 | Cloud-kill switch | OPTIMAL, DEGRADED, AUTONOMOUS transitions, override expiry, nodes keep working | 6 | 1 d | P0 |
| 5 | Privacy boundary inspector | Raw frame beside the exact bytes that cross the boundary (S, E, V packets), Lane A vs B toggle | 6 | 1 d | P0 |
| 6 | Real model hooks | Sandbox runs real images; report measured latency and OCR accuracy on a labelled sample | 2 | 2 d | P0 |
| 7 | Signal simulator (5-9 junctions) | Fixed timer vs adaptive vs RL stub; delay, queue and externality KPIs | 7 | 3-5 d | P1 |
| 8 | Defects tab | Pothole and waterlogging detections, severity, growth trend, auto work order | 8 | 2 d | P1 |
| 9 | Evaluation dashboard | Section 16 endpoints with target, minimum and measured columns | 9 | 1 d | P1 |
| 10 | Economics calculator | Editable bandwidth formula, cost per junction, payback | 10 | 1 d | P1 |
| 11 | Role switch (EMS, traffic, police, commissioner) | Same data, different consoles; Identity Lane visible only to police | header | 1-2 d | P1 |
| 12 | Governance panel | Case ID required for Lane B queries, live audit log | 3 | 1 d | P1 |
| 13 | Twin export | Metadata to scene replay with injected edge cases | 1 | 2-3 d | P2 |

Build order: items 4 and 5 first (cheapest and most distinctive), then 1, 2 and 6, then 3 (hardest, most impressive), then 7 to 12.

**Five-minute demo script.** (1) City map with normal flow, a hotlisted vehicle's trajectory and a cloned-plate alert, 60 s. (2) Switch role to EMS, trigger a collision, show the detection waterfall, 60 s. (3) Ambulance corridor: signals clear ahead, side-street externality stays inside the bound, minutes saved, 90 s. (4) Kill the cloud and show everything keeps working, 30 s. (5) Privacy inspector: what crosses the boundary, Lane A vs B, 30 s. (6) Economics and evaluation panels with honest \[T\] and \[M\] labels, 30 s.

**Backend endpoints to add (FastAPI):** `POST /sim/incident` (inject collision at a node) · `GET /sim/corridor?src=&dst=` (plan with kappa) · `POST /sim/cloud` with `{"up": false}` · `GET /nodes/{id}/mode` · `GET /privacy/packet?lane=A|B` (exact bytes) · `GET /eval/endpoints` · `GET /economics?cameras=&cadence=&payload=`.

### 22.1 Corridor planner with clearance coefficient

```python
import heapq

def dijkstra(tau, delta, src, dst, kappa):
    """tau[u][v]=segment seconds, delta[v]=signal delay at v, kappa[v] in [0,1]"""
    pq, seen = [(0.0, src, [src])], set()
    while pq:
        t, u, p = heapq.heappop(pq)
        if u == dst:
            return p, t
        if u in seen:
            continue
        seen.add(u)
        for v, tv in tau.get(u, {}).items():
            heapq.heappush(pq, (t + tv + delta[v] * (1 - kappa.get(v, 0.0)), v, p + [v]))
    return None, float("inf")

def plan_corridor(tau, delta, hold, src, dst, c_max):
    """Fastest path under full clearance, then relax kappa until
    cross-traffic cost sum(hold[v]*kappa[v]) <= c_max."""
    kappa = {v: 1.0 for v in delta}
    path, eta = dijkstra(tau, delta, src, dst, kappa)
    while path and sum(hold[v] * kappa[v] for v in path[1:]) > c_max:
        v = max((n for n in path[1:] if kappa[n] > 0),
                key=lambda n: hold[n] / max(delta[n], 1e-6))
        kappa[v] = max(0.0, kappa[v] - 0.25)
        path, eta = dijkstra(tau, delta, src, dst, kappa)
    return path, eta, {v: kappa[v] for v in (path or [])[1:]}