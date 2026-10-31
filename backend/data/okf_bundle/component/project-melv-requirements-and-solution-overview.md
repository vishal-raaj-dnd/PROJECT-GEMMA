---
id: project-melv-requirements-and-solution-overview
type: component
title: Project-MELV Requirements and Solution Overview
description: A high-level overview of the system requirements and the proposed technical
  solutions for ANPR, trajectory tracking, and traffic analytics within the Project-MELV
  framework.
tags:
- traffic-management
- anpr
- system-architecture
- project-melv
- vehicle-detection
timestamp: null
---

## 3. Requirements and Solution Overview

| Pillar | Requirement | Typical approach today | Project-MELV |
| :-- | :-- | :-- | :-- |
| ANPR and OCR | Over 90% accuracy in real conditions (light, weather, angle, blur, dirty plates) | Western COCO detectors plus generic OCR; fails on Indian two-row plates and auto-rickshaws | VehicleNet-Y26n (14 Indian vehicle classes), plate detector, PaddleOCR PP-OCRv4, two-row splitter, RTO grammar parser |
| Trajectory tracking | Chronological path of any plate across the city with timestamps and direction on a GIS map | Manual review of many CCTV archives | Spatiotemporal graph engine with road-snapped trajectories and transit speed |
| Macro traffic analytics | Density, origin-destination flows, bottlenecks, speed trends | Manual surveys, inductive loops | Hourly volume curves, OD matrix, modal split, hotspot diagnosis |
| Real-time alerts | Blacklisted vehicles and suspicious route anomalies | Static lookup without velocity context | Hotlist match, cloned-plate velocity check, next-camera intercept predictor |
| Scalability | Enterprise-grade, city-wide | Central video ingestion, fails beyond \~100 cameras | Edge-to-cloud mesh with metadata-only uplink (over 99% reduction) |
| Emergency response (extension) | Not specified | Fixed timers, witness reports | Machine detection in under 3 s, bounded corridor clearance, graceful degradation |

**Design principles**

1. **Authority at the edge.** The component that must act within 200 ms is the one that decides. The cloud advises.
2. **Coordination at the centre.** Patterns across fifty junctions are invisible to any one of them.
3. **Graceful degradation, not failover.** Loss of the cloud is a defined operating mode.
4. **Data minimisation at the boundary.** The edge-cloud interface carries interpretations, never imagery.
5. **Retrofit over replacement.** The system consumes existing camera and signal-controller interfaces.
6. **Built for Indian traffic.** Auto-rickshaws, two-wheelers, mixed-mode lanes, damaged plates, monsoon.

---