---
id: 5-edge-node-hardware-and-inference-cascade
type: component
title: '5. Edge Node: Hardware and Inference Cascade'
description: A sealed, pole- or cabinet-mounted unit that sits electrically between
  the existing camera network and the existing signal controller. | Parameter | Standard
  | High-capability | | ...
tags:
- component
- fieldops
timestamp: null
---

## 5. Edge Node: Hardware and Inference Cascade

### 5.1 Node Box

A sealed, pole- or cabinet-mounted unit that sits electrically between the existing camera network and the existing signal controller.

| Parameter | Standard | High-capability |
| :-- | :-- | :-- |
| CPU / NPU | Cortex-A76 class, 4 TOPS | Cortex-A78 class, 8-16 TOPS |
| Memory / storage | 4 GB LPDDR5 / 64 GB | 8 GB / 64-128 GB |
| Inputs | 8 IP cameras, H.264/5 hardware decode, 30 fps | same |
| Signals | NTCIP/UTMC, 4 digital phase outputs | same |
| Connectivity | Dual GbE, 4G/5G, Wi-Fi 6 (maintenance) | same |
| Power | 24 V DC, 25 W average | 30 W average / 60 W peak |
| Environment | IP65, -20 to +60 C, conformal coating, surge protection | same |
| Delivered cost | Rs. 20,000-22,000 | Rs. 23,000-25,000 |

**Cost model.** Component bill of materials is Rs. 8,000-12,000 (SoC 2-3k, NPU 2-3k, RAM 0.5k, storage 1.5k, modem 0.8k, network 0.3k, PCB and power 0.9-2.4k). Enclosure and thermal (3-4k), surge protection and PSU (2-2.5k), assembly and certification (2-2.5k), installation (3-4k) and first-year warranty (2k) bring the delivered cost per intersection to Rs. 20,000-25,000, below the Rs. 32,500-50,000 typical of replacement smart-camera hardware. The development kit for demonstration is an NVIDIA Jetson Orin Nano or Raspberry Pi 5.

**Two details carry weight.** The circular buffer holds raw video that has no code path to the uplink, which makes the privacy claim structural rather than procedural. A parallel video output preserves the authority's own recording chain untouched, which removes the main procurement objection. Every node runs NTP/PTP time sync with drift telemetry, because cross-camera speed checks depend on it.

### 5.2 Two-tier inference cascade

The models that matter most (ambulance recognition, collision signature, severity) are also the most expensive. Provisioning every junction for peak load pays continuously for capability used a few seconds a day. The cascade separates detecting the possibility of an event from confirming it.

- **Tier 1, always on** (2-4 TOPS, about 30 W, 100 ms or less): vehicle count, density, coarse class, queue length. Tuned for recall; allowed to be imprecise.
- **Tier 2, on trigger** (8-16 TOPS, up to 60 W, 150-350 ms): re-runs the buffered frames through a specialised model, so confirmation examines the moment that triggered it rather than the one after.

| Tier | Model | Architecture | Size | Latency | Target accuracy |
| :-- | :-- | :-- | :-- | :-- | :-- |
| 1 | Vehicle detection and count | YOLO-nano, INT8 | 12 MB | 180 ms | 96% \[T\] |
| 1 | Density estimation | regression head on shared backbone | shared | under 60 ms | n/a |
| 1 | Queue length | spatial occupancy + temporal smoothing | 8 MB | 90 ms | 92% \[T\] |
| 2 | Collision detection | YOLOv11 + LSTM temporal head | 85 MB | under 200 ms | 94.6% \[T\] |
| 2 | Emergency vehicle | ResNet-50 fine-tune + siren audio fusion | 96 MB | 160 ms | 98% \[T\] |
| 2 | Severity | multi-head CNN on damage and scene cues | 54 MB | 210 ms | n/a |
| 2 | Pothole | segmentation head on road ROI | 45 MB | 150 ms | 91% precision / 87% recall \[T\] |
| 2 | Waterlogging | texture and reflectance classifier | 32 MB | 120 ms | 88% \[T\] |

All accuracy figures come from development-set evaluation and are not field validated.

**Confidence fusion.** Tier-1, Tier-2 and neighbouring-node estimates are fused per class rather than overridden:

```latex
p_{final}(c) = \sigma\big(\alpha\,\ell(p_{T1}(c)) + \beta\,\ell(p_{T2}(c)) + \gamma\,\ell(p_{peer}(c))\big), \quad \beta \gg \alpha
```

Cross-node corroboration is the main defence against false positives: a reflection or a parked delivery van that looks like a collision at one camera will not look identical at its neighbour. Dispatch requires p\_final above a per-class threshold set by the operating authority, with a deliberately asymmetric cost: a missed collision is weighted far above a false alert routed to human review.

**Duty cycle and fleet cost.** Expected node power is E\[P\] = P1(1 - rho) + P2 rho. With P1 = 30 W, P2 = 60 W and rho = 0.02 (share of cycles escalating), E\[P\] = 30.6 W, so peak capability is nearly free in energy. Because Tier-2 demand is bursty and uncorrelated across junctions, only 20-30% of intersections need the high-capability variant locally; the rest burst at reduced frame rate or share a zone micro-edge server across about ten junctions. Against provisioning every junction with replacement smart-camera-class hardware, this lowers fleet hardware cost by roughly one third to one half \[T\].

---