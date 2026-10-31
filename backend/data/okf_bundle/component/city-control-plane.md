---
id: city-control-plane
type: component
title: City Control Plane
description: A distributed graph-based control architecture for urban traffic management,
  utilizing multi-agent reinforcement learning and bounded dynamic overrides to manage
  signalized intersections.
tags:
- traffic-control
- multi-agent-reinforcement-learning
- graph-theory
- urban-infrastructure
timestamp: null
---

## 8. City Control Plane

### 8.1 Graph formulation

The road network is a directed graph G = (V, E): each signalised intersection is a vertex hosting one Node Box, each directed segment an edge, with time-varying weight

```latex
w_{uv}(t) = \tau_{uv}(t) + \delta_v(t)\,\big(1 - \kappa_v(t)\big)
```

where tau is predicted segment traversal time, delta is expected signal delay at the downstream vertex and kappa in \[0, 1\] is the clearance coefficient, the fraction of that delay the system commits to eliminate. Ordinary routing uses kappa = 0. Emergency routing may *set* kappa:

```latex
P^{*} = \arg\min_{P \in \mathcal{P}(s,d)} \sum_{(u,v)\in P} w_{uv}(t) \quad \text{s.t.} \quad \sum_{v \in P} C_v(\kappa_v) \le C_{max}
```

C\_v is the cross-traffic cost of holding competing approaches and C\_max bounds it so that clearing a corridor cannot starve the surrounding network. Kappa is a network variable, not a local one, which is why no single intersection can create a green wave.

### 8.2 Plane 3: bounded dynamic override

- **Bounded:** a node rejects any value outside its safe envelope, including minimum-green and pedestrian-clearance floors.
- **Expiring:** every override carries a validity horizon; on expiry the node reverts to local policy, so no stale command can persist.
- **Ignorable:** if the channel fails the node is already running a complete local policy.

### 8.3 Operating modes

| Mode | Condition | Efficiency | Lost capability |
| :-- | :-- | :-- | :-- |
| OPTIMAL | cloud healthy, overrides live | 100% | none |
| DEGRADED | cloud reachable, latency high | about 95% | some corridor precision |
| AUTONOMOUS | cloud unreachable | 85-90% \[T\] | corridor planning, cross-zone coordination, OTA refresh |

Transitions are automatic: two missed heartbeats, override expiry, heartbeat restored then state resync. In every mode the node keeps local inference, adaptive timing, emergency preemption, defect logging and 72 hours of cached traffic patterns, and keeps exchanging messages with neighbouring nodes.

### 8.4 Multi-agent reinforcement learning

- **Zones:** 30-80 intersections aligned to natural basins (rivers, rail lines, ring roads), one agent per zone, each a POMDP. A single city-wide policy is intractable and brittle.
- **State:** per-approach queue and density, phase and elapsed time, time of day, weather, emergency-vehicle proximity and heading, summary of neighbouring zones.
- **Action:** green duration (30-120 s), phase order, offset. Actions that violate minimum green or pedestrian clearance are masked out, never penalised: safety is not a learned behaviour.
- **Reward:** negative mean wait, negative squared queue length, plus throughput, emergency-vehicle progress, minus a boundary-externality term charging an agent for queues it pushes into neighbouring zones. Without that term each agent's rational move is to export congestion.
- **Messages:** INTENT (advance notice of a change), CONTEXT (periodic boundary summary), RESERVE (hold vertices for an emergency corridor with priority, ETA window, validity), RELEASE (surrender a reservation early).
- **Training pipeline:** SUMO/VISSIM simulation, historical fit to the city's real counts, transfer from a similar zone, then supervised online adaptation in shadow mode (the policy proposes, the incumbent plan executes, divergence is logged) with operator sign-off before authority transfers. Asynchronous policy-gradient methods refine on-policy.

---