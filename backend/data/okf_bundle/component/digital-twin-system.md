---
id: digital-twin-system
type: component
title: Digital Twin System
description: A software replica of physical city infrastructure that utilizes sensor
  telemetry to provide real-time mobility mapping and 3D operational training scenarios
  for autonomous vehicles.
tags:
- digital-twin
- mobility-mapping
- av-training
- simulation
- telemetry
timestamp: null
---

## 11. Digital Twin

A digital twin is a software replica of the physical city that updates from sensor telemetry. In Project-MELV every road corridor is a dynamic graph edge with live velocity, count and congestion state, and every tracked vehicle (Identity Lane only) is a persistent entity with class, colour, trajectory history and velocity vector. Authorities can replay journeys, run what-if simulations and dispatch proactively. It serves both the micro view (police following one vehicle) and the macro view (a commissioner watching citywide bottlenecks) from one data source.

**Mobility twin (live map).** Dual-mode renderer behind a one-click toggle:

- **3D mode:** MapLibre GL JS with Deck.gl TripsLayer. 45 degree pitch, bearing -17.6 degrees, zoom 15.5, extruded building footprints, pulsing 3D beacons at camera nodes, neon trajectory ribbons with a 1.8 s fading trail (acid lime #D4FF32 for normal, crimson #FF3B30 for blacklisted), driven by the surveillance video master clock.
- **2D tactical mode:** Leaflet with CartoDB DarkMatter tiles, zero external dependencies, the fail-safe fallback if a venue laptop drops its WebGL context.

**Operations twin (AV training).** Operational metadata becomes 3D training scenarios through five stages: metadata stream (classes, positions, velocities, timestamps, no imagery), scene reconstruction by multi-view triangulation, procedural asset synthesis, behaviour modelling from trajectory statistics, and a twin environment with time of day, weather and season injected so parallel AV instances can run. Edge cases are injected at **observed** frequencies, so the training distribution matches deployment:

| Edge case | Why Western datasets miss it |
| :-- | :-- |
| Animal intrusion | cattle and dogs move unlike any pedestrian model |
| Wrong-way travel | routine on undivided roads; out-of-distribution for most stacks |
| Mixed-mode lane sharing | two-, three-, four-wheelers and pedestrians share lane width |
| Unsignalised complex junctions | right of way negotiated socially |
| Monsoon extremes | visibility and traction beyond sensor validation envelopes |
| Infrastructure variability | potholes, unpaved shoulders, missing lane markings |

Because the twin is built from metadata, it contains what happened, not who it happened to.

---