---
id: data-contract-edge-cloud
type: specification
title: Data Contract for Edge-Cloud Communication
description: Defines the three payload classes (Snapshot, Event, and Vehicle) used
  for data transmission across the edge-cloud boundary, including their respective
  lanes, sizes, and content structures.
tags:
- data-contract
- payload-classes
- edge-cloud
- communication-protocol
- data-transmission
timestamp: null
---

## 13. Data Contract

Three payload classes cross the edge-cloud boundary.

| Class | Lane | Typical size | Cadence | Content |
| :-- | :-- | :-- | :-- | :-- |
| **S** snapshot | A | 2-5 KB | every 30-60 s | counts, density, queue, phase, decisions |
| **E** event | A | up to 50 KB | on incident | event class, severity, confidence, GPS, timestamps, no imagery |
| **V** vehicle | B | about 200 B | per vehicle, gated | plate hash, class, colour, direction, confidence |

```json
{
  "v": 1, "node_id": "CBE-014", "ts": "2026-10-08T10:15:03.120Z",
  "lane": "A", "type": "snapshot",
  "counts": {"two_wheeler": 41, "car": 22, "three_wheeler": 9, "bus": 2, "truck": 3},
  "density": 0.62, "queue_m": {"N": 38, "S": 12, "E": 55, "W": 20},
  "phase": {"id": 2, "elapsed_s": 17}, "mode": "OPTIMAL", "clock_drift_ms": 4
}
{
  "v": 1, "node_id": "CBE-014", "ts": "2026-10-08T10:15:04.482Z",
  "lane": "B", "type": "vehicle", "plate_hash": "9f2c1a...", "salt_epoch": 118,
  "class": "three_wheeler", "dir": "E", "conf": 0.93, "hotlist_hit": false
}
```

If the uplink drops, a node buffers packets in a local SQLite store and bursts them on reconnection.

---