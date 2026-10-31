---
id: 7-trajectory-anomaly-and-intercept-engines
type: safety
title: 7. Trajectory, Anomaly and Intercept Engines
description: '**Trajectory reconstruction.** For plate P seen at camera C\_A at t\_A
  and C\_B at t\_B: dt = t\_B - t\_A, d\_AB is the road-network distance along the
  snapped polyline, and averag...'
tags:
- safety
- fieldops
timestamp: null
---

## 7. Trajectory, Anomaly and Intercept Engines

**Trajectory reconstruction.** For plate P seen at camera C\_A at t\_A and C\_B at t\_B: dt = t\_B - t\_A, d\_AB is the road-network distance along the snapped polyline, and average speed is (d\_AB / dt) x 3.6 km/h. Trajectories are drawn as road-snapped polylines that follow real road curves, not straight lines, and are rendered with synchronised time-code progression. Distances and expected travel times come from the live road graph (Section 8.1).

**Anomaly engine**

1. **Hotlist match** at the edge for blacklisted or stolen vehicles.
2. **Cloned-plate and ghost-identity detection.** If one plate appears at C\_A and C\_C with implied speed Distance(C\_A, C\_C) / |t\_C - t\_A| above the physical maximum (for example 140 km/h in city traffic), raise a critical alert. Straight-line distance is a lower bound on road distance, so the check never over-reports. Better still, compare against the live minimum travel time on the path.
3. **Next-camera intercept.** Given origin, destination, heading and speed, predict C\_next = argmax over neighbours of P(C\_i | C\_A, C\_B, hour) and ETA t\_B + d(C\_B, C\_next) / v, using predicted edge travel times where available. The console marks the node and ETA so dispatchers can alert the nearest patrol unit without a high-speed pursuit.

**Evidence dossier.** One-click PDF with timestamped crops, plate extraction, confidence scores and route history, produced only inside the case workflow (Section 14).

---