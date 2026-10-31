---
id: risks-and-limitations-analysis
type: safety
title: Risks and Limitations Analysis
description: A comprehensive table of identified operational, legal, and technical
  risks along with their corresponding mitigation strategies for the system deployment.
tags:
- risk-mitigation
- operational-risks
- compliance
- deployment-strategy
timestamp: null
---

## 17. Risks and Limitations

| ID | Risk | Mitigation |
| :-- | :-- | :-- |
| R1 | Field accuracy below development-set targets | Sequence capability by confidence (collisions first, defects after proof); thresholds with minimums; retrain on field data |
| R2 | Cloud outage | Architectural: autonomous mode is a normal operating mode |
| R3 | Connectivity gaps in Tier-3 cities | Autonomous by default, three connectivity paths, store-and-forward |
| R4 | Procurement exceeding 18 months | Lead with emergency services and insurance data; use pilot results to compress approvals |
| R5 | Incumbent response | Long contracts, a dataset that cannot be acquired retrospectively |
| R6 | Key-person loss | Documentation as a deliverable, vesting, redundancy from year two |
| R7 | Political reversal of fine-share revenue | Treat as upside, not base case |
| R8 | Pilot city underperforms or withdraws | Feasibility study, backup city, pre-registered endpoints |
| R9 | Regulation of camera analytics | Privacy-by-topology positioning |
| R10 | Legal or public backlash against ANPR | Identity Lane off by default, legal gating, audit, separate licence |
| R11 | Software and dataset licensing (YOLOv8/v11 is AGPL-3.0) | Enterprise licence or an Apache/MIT detector; verify model and dataset licences \[V\] |
| R12 | Field OCR accuracy | Night and rain test sets, CLAHE, confidence thresholds, human review queue |
| R13 | Clock drift breaking speed checks | NTP/PTP, drift telemetry, reject stale pairs |

**Limitations.** No field validation exists, and development-set accuracy on curated footage systematically overstates field performance. The 40% and 30% improvements are modelled from assumed elasticities, not measured. Improvement may be redistribution: the most likely way this system fails while appearing to succeed is by speeding one corridor at the expense of intersecting streets. The lives-saved model assumes full national coverage, and its elasticities are borrowed from trauma literature in other health systems. Enforcement revenue is politically contingent. Automation bias and function creep need governance beyond technology.

---