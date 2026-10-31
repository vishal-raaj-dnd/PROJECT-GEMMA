---
id: command-centre-web-application
type: component
title: Command Centre Web Application
description: A neo-brutalist cyber-industrial web application featuring role-based
  views for EMS, traffic control, and law enforcement, providing real-time trajectory
  tracking and analytics.
tags:
- web-application
- traffic-management
- real-time-monitoring
- analytics-dashboard
timestamp: null
---

## 12. Command Centre

A neo-brutalist cyber-industrial web application (React 18, Vite, Tailwind, chamfered cut-corner design system) with role-based views: EMS, traffic control, police, commissioner.

| Tab | Purpose |
| :-- | :-- |
| 1. Live trajectory tracking | Dual video feeds plus 3D/2D map, synchronised time-code, emergency corridors and signal state |
| 2. AI inspector sandbox | Drag in any image or clip; live detection, plate read and Tier-1/Tier-2 timings (about 1.5 s) |
| 3. Trajectory query and spatial graph | Historical plate search, cloned-plate check; requires a case ID (Identity Lane) |
| 4. Macro flow analytics | Recharts: hourly volume, modal split, OD matrix, hotspots |
| 5. Alerts and dispatch | Watchlist hits, collision alerts, latency waterfall, next-node intercept |
| 6. Edge topology and health | Node mesh, operating modes, bandwidth saved, clock drift, privacy boundary inspector |
| 7. Signal simulator | Fixed timer vs adaptive vs RL policy, KPIs and externality meter |
| 8. Road defects | Pothole and waterlogging map, severity, growth trend, work orders |
| 9. Evaluation dashboard | Pre-registered endpoints with target, minimum and measured columns |
| 10. Economics calculator | Bandwidth, cost per junction, payback with editable inputs |

The operator surface shows live density heatmaps, flow arrows, emergency-vehicle tracking with predicted path, incident markers with severity and confidence, signal state with phase countdown and historical playback. **Every automated decision is logged with its inputs**, so an operator can reconstruct why a phase changed. Auditability is a harder requirement than accuracy.

---