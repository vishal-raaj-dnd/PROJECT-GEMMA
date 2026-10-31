---
id: future-work-and-conclusion
type: guide
title: Future Work and Conclusion
description: A summary of proposed research directions and project conclusions regarding
  predictive incident prevention, V2X integration, and formal verification.
tags:
- research-directions
- future-work
- project-melv
- system-design
timestamp: null
---

## 24. Future Work and Conclusion

- **Pilot execution** with results published whether or not they support the targets.
- **Predictive incident prevention:** identify conflict precursors in trajectory data and intervene through signal timing before a collision. Highest value, hardest to validate.
- **V2X integration** to replace inference with direct messaging for equipped vehicles and tighten corridor timing.
- **Federated learning across cities** so models improve without centralising even metadata.
- **Formal verification** of the safety envelope: machine-checked proof that no reachable state of the override and action-masking logic produces an unsafe signal configuration.
- **Twin fidelity validation:** measure sim-to-real transfer, currently asserted rather than measured.
- **Operator-vigilance protocol** to counter automation bias.

**Conclusion.** The sensing infrastructure is already paid for; the interpretive layer is missing. Project-MELV places authority where milliseconds matter, optimisation where a city-wide view exists, and a deliberately weak coupling between them whose failure subtracts performance, not function. Edge inference makes rare-event accuracy affordable at scale, multi-agent control makes corridor clearance coherent rather than locally selfish, and the metadata boundary makes privacy structural. The design targets are defensible as engineering estimates and are not yet results; the evaluation protocol in Section 16 exists to convert one into the other.