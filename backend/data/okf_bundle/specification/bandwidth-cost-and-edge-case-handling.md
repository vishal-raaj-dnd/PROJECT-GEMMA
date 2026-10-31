---
id: bandwidth-cost-and-edge-case-handling
type: specification
title: Bandwidth, Cost and Edge-Case Handling
description: Technical specifications for data bandwidth calculations, transport cost
  reductions, and mitigation strategies for edge-case scenarios in edge computing
  deployments.
tags:
- bandwidth
- cost-analysis
- edge-cases
- data-transport
- mitigation
timestamp: null
---

## 15. Bandwidth, Cost and Edge-Case Handling

**Bandwidth.** Monthly uplink V = N x s x 30 x b, where N is nodes, s is records per node per day (2,880 at a 30-second cadence) and b is payload size.

| Scenario | Basis | Volume | Reduction |
| :-- | :-- | :-- | :-- |
| Camera level, 1,000 cameras | 4 Mbps continuous 1080p video | 4 Gbps sustained | baseline |
| Camera level, vehicle telemetry | 0.5 vehicles/s x 200 B x 1,000 | 100 KB/s (about 0.8 Mbps) | 99.98% |
| City level, 10,000 nodes | 8 MB frame every 30 s | 6,912 TB per month | baseline |
| City level, enriched events | 50 KB records | 43.2 TB per month | 99.4% |
| City level, steady state | 5 KB records | 4.32 TB per month | 99.94% |

Transport cost falls from the order of Rs. 1-2 crore per city per month to a few lakh. Because the cloud receives interpretations rather than pixels, load grows sub-linearly with node count. Centralised GPU capacity is replaced by an edge unit costing about Rs. 10,000 at component level (Rs. 20,000-25,000 delivered).

| Edge case | Risk | Mitigation |
| :-- | :-- | :-- |
| Two-row plates | High in India | Aspect-ratio splitter, per-row OCR |
| Non-standard fonts | Medium | Positional grammar plus RTO dictionary correction |
| Occlusion in dense traffic | Medium | Temporal tracking until a clear read |
| Rain, night, glare | Medium | CLAHE, bilateral filtering, confidence thresholds |
| Network disconnection | Low | Local SQLite buffer and burst on reconnect; autonomous mode |
| Venue GPU or WebGL failure | Low | One-click 2D fallback |

---