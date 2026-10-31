---
id: evaluation-methodology-and-performance-targets
type: specification
title: Evaluation Methodology and Performance Targets
description: Defines the design of field trials and establishes specific performance
  metrics and minimum acceptable thresholds for system evaluation.
tags:
- performance-metrics
- field-trial-design
- evaluation-targets
- system-benchmarks
timestamp: null
---

## 16. Evaluation Methodology

No field trial has been completed. Every performance figure here is a design target from development-set evaluation, component benchmarks or analytical modelling, and this section defines in advance how each will be tested.

**Design.** Matched-pair intersection crossover over 24 weeks with staggered rollout. Pairs are matched on approach count, baseline volume, pedestrian activity and incident history. One junction per pair is instrumented for the first eight weeks while its match stays on the incumbent plan, then treatment crosses over, controlling for seasonal and citywide effects. Shadow-mode logging yields a paired counterfactual for every executed decision. Ground truth comes from independent review of authority-held footage (stratified random sample plus all flagged events).

| Metric | Target | Minimum acceptable |
| :-- | :-- | :-- |
| Collision to alert | under 3 s | under 10 s |
| Collision detection recall | 94.6% | 88% or more |
| False alerts to dispatch | under 1 per node per week | under 3 |
| Emergency mean transit time | -40% | -15% |
| Mean intersection delay, peak | -30% | -10% |
| Cross-corridor externality | no increase | under +5% |
| Control-function uptime | 99.5% | 99.0% or more |
| Autonomous-mode efficiency | 85-90% | 80% or more |
| Pothole detection precision | 91% | 80% or more |
| Plate read accuracy, Indian conditions | over 90% | 85% (proposed) |
| Trajectory stitch precision / recall | 95% / 90% (proposed) | 85% / 80% |
| Cloned-plate false positives | under 1 per 10,000 plates (proposed) | under 1 per 1,000 |
| Intercept ETA error | within 20% (proposed) | within 35% |
| Clock drift across nodes | under 50 ms (proposed) | under 200 ms |

The externality endpoint is the one most likely to fail and is kept on purpose: improving a corridor by pushing delay onto side streets is not an improvement.

---