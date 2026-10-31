---
id: 4-system-architecture
type: fault_code
title: 4. System Architecture
description: '` FIELD (per intersection) CONSUMERS +-----------------------------------------------+
  | CCTV x4-8 (H.264/5) audio array (optional) | +-> EMS / hospital dispatch | | |
  +-> Command ...'
tags:
- fault_code
- fieldops
timestamp: null
---

## 4. System Architecture

```
 FIELD (per intersection)                                   CONSUMERS
 +-----------------------------------------------+
 | CCTV x4-8 (H.264/5)   audio array (optional)  |   +-> EMS / hospital dispatch
 |        |                                      |   +-> Command centre (10 tabs)
 |  NODE BOX  (ARM + NPU, decision authority)    |   +-> Civic maintenance work orders
 |  Tier 1  always-on YOLO-nano  (counts, queue) |   +-> Police console (Identity Lane only)
 |  Tier 2  on trigger: collision | EV | severity|   +-> Insurance / fleet APIs
 |          pothole | waterlog                    |   +-> Digital twin / AV training
 |  Identity module (OFF by default, licensed):  |
 |    VehicleNet-Y26n + plate YOLO + PaddleOCR   |
 |    -> salted hash, hotlist match AT EDGE      |
 |  Circular buffer (raw video, never uplinked)  |
 |  Signal interface NTCIP/UTMC  | Peer link     |
 +-------+-----------------------+---------------+
         | LANE A: anonymous     | LANE B: identity (gated)
         | metadata (S, E)       | hashed events (V), hotlist hits only
         v                       v
 ==================== CLOUD (city/region) ==========================
  Ingest (FastAPI + Kafka)  |  State cache (Redis)
  PLANE 2 intelligence:  zone MARL agents (30-80 junctions each)
     cascade diagnosis | green-wave planning | OTA training | analytics
  Digital Twin graph (Neo4j + PostGIS + TimescaleDB), audit trail (Mongo)
  Trajectory stitching | cloned-plate check | intercept predictor
 =====================================================================
   PLANE 3: bounded, expiring, ignorable override  (cloud -> node)
```

**Three planes.** Plane 1 is edge decision authority: every Node Box is a complete control system on its own. Plane 2 is cloud intelligence: cascade diagnosis, corridor plans spanning up to ten junctions, retrained models pushed over the air, longitudinal analytics. Plane 3 is a bounded override channel, the only coupling between them, deliberately weak so that its failure subtracts performance, not function.

**Two lanes.** Lane A (anonymous operations) is the default. Lane B (identity) is a separately licensed module with its own access rules (Section 14).

### 4.1 Why this architecture

| Dimension | Pure central cloud | Pure edge AI | Navigation platforms | **Project-MELV** |
| :-- | :-- | :-- | :-- | :-- |
| Accident detection accuracy | 85% (delayed) | 92% (local only) | not applicable | 94.6% \[T\] |
| Detection latency | 2-5 s | under 500 ms | not applicable | under 500 ms \[T\] |
| Network-wide optimisation | yes | no | no | yes, with local fallback |
| Control-function uptime | about 85% | about 95% | about 90% | 99.5% \[T\] |
| Annual cost per city | Rs. 18 cr | Rs. 2 cr | Rs. 50 L-2 cr | Rs. 15-50 L \[T\] |
| Model update cycle | 24 h | 18-36 months | 24 h | 24-48 h over the air |
| Privacy posture | raw frames leave site | local | location telemetry | metadata-only boundary |
| Emergency corridor routing | no | single junction | no | multi-junction |
| Retrofit to existing cameras | replacement needed | replacement needed | not applicable | retrofit |

A pure cloud design has a single point of failure, 2 to 5 second round trips, heavy bandwidth cost and data-sovereignty exposure. A pure edge design cannot coordinate: clearing one queue relocates it downstream, updates need field visits, and unit cost is high. Navigation platforms route drivers around congestion but have no control interface. Project-MELV takes edge authority from the first and network-wide optimisation from the second.

---