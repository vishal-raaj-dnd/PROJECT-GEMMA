---
id: COMP-PCB-PITCH-01
type: component
title: Pitch Controller Power Board
description: Main switching power supply and gate driver PCB for turbine pitch servo actuators.
subsystem: Rotor Pitch System
part_numbers:
  - PCB-PITCH-CTRL-V1
tags:
  - electronics
  - pcb
  - pitch-system
safety_prerequisites:
  - ../safety/arc_flash_ppe_level2.md
timestamp: '2026-10-31T11:00:00Z'
---

# Pitch Controller Power Board

## Specifications
- Input Voltage: 48V DC +/- 5%.
- Output Bus: Dual regulated 24V DC / 15A and 5V DC / 3A logic rail.
- Fuse Rating: 20A fast-acting ceramic cartridge fuse (F1).
- Filter Capacitors: Low-ESR 470uF 63V aluminum electrolytic capacitors (C14, C15).

## Visual Identification & Failure Analysis
- Double-sided green solder mask PCB mounted in aluminum RF shield bay.
- Common failure: Thermal stress from yaw brake regeneration causes bulging or electrolyte rupture on capacitor C14, leaving brownish scorched flux residue across the 24V plane.
