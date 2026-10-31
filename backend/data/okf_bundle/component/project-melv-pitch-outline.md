---
id: project-melv-pitch-outline
type: component
title: Project-MELV Pitch Outline and Stakeholder Questions
description: A structured pitch outline for the Project-MELV edge-AI traffic intelligence
  system, including architectural overview, key performance metrics, and responses
  to stakeholder concerns.
tags:
- edge-ai
- traffic-intelligence
- smart-city
- project-melv
- urban-analytics
timestamp: null
---

## 23. Pitch Outline and Stakeholder Questions

| Slide | Content |
| :-- | :-- |
| 1. Title | Project-MELV: city-wide edge-AI traffic intelligence for smart cities and law enforcement |
| 2. Ground reality | 1.3 million cameras that record but do not interpret; 153,972 deaths a year; 4 Gbps to stream 1,000 feeds |
| 3. Architecture | Node Box with two-tier cascade, metadata-only uplink, over 99% bandwidth reduction |
| 4. Built for India | 14-class vehicle model, two-row plate splitter, RTO grammar parser |
| 5. Live trajectory demo | Two cameras plus 3D/2D map with real velocity |
| 6. Emergency response | Collision to green corridor in under 3 s \[T\]; graceful degradation with the cloud down |
| 7. Enforcement intelligence | Hotlist and cloned-plate alerts, next-camera intercept ETA |
| 8. Urban analytics | Peak hours, modal split, OD matrix, defect work orders |
| 9. Proof | Live sandbox: drag in an image and watch real inference |
| 10. Scale and roadmap | Rs. 20,000-25,000 per junction, pilot-to-city phases with evidence gates, privacy by design |

**Lead numbers (labelled):** 153,972 road deaths a year \[national data\]; 1.3 million cameras installed \[public data\]; under 3 s collision-to-signal budget \[T\], plus whatever the demo measures live \[M\].

| Question | Answer |
| :-- | :-- |
| Is this a surveillance system? | By default it reads no plates and links no vehicles. Identity is a separate, licensed, audited module with legal gating. |
| What if the cloud goes down? | Nothing stops. Nodes run locally at 85-90% efficiency; loss of the cloud removes optimisation, not control. |
| Why not edge-only? | A queue cleared at one junction relocates to the next. Kappa is a network variable no single node can set. |
| Why not cloud-only? | 2-5 s latency, single point of failure, bandwidth cost, data sovereignty. |
| Does it work on existing cameras? | Yes: standard H.264/5 in, NTCIP/UTMC out. Retrofit, not replacement. |
| What if models underperform in the field? | Some shortfall is expected. Thresholds have minimums, rollout is sequenced by confidence, and the pilot gives an interpretable result either way. |
| Is the 40% real? | It is a modelled target; the pilot protocol turns it into a measurement. |
| How are plates and legality handled? | Salted hashes, edge hotlist matching, case-ID gating, short retention, tamper-evident audit. |

---