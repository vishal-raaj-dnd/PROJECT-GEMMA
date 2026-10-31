---
id: FAULT-E302
type: fault_code
title: "Fault Code E-302: Hydraulic Circuit Delta Pressure Loss"
description: Main turbine controller alarm triggered when yaw system pressure drops below 160 bar during brake hold.
tags:
  - fault-code
  - alarm
  - yaw-system
timestamp: '2026-10-31T11:00:00Z'
---

# Fault Code E-302: Hydraulic Circuit Delta Pressure Loss

## Symptom and Threshold
- Trigger: Pressure sensor PT-01 detects continuous pressure decay exceeding 5 bar/sec while yaw brake is commanded LOCKED.
- Annunciation: Amber warning beacon on nacelle beacon tower; SCADA event code `E-302-YAW-PRV-PRESS-DROP`.

## Root Causes
1. Extruded or torn O-ring seal on [Proportional Pressure Relief Valve V2](../components/proportional_relief_valve_v2.md).
2. Internal fluid bypass past worn valve spool.
3. Leaking quick-disconnect fitting on test port TP-01.
