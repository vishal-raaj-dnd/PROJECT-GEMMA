---
id: privacy-security-governance-framework
type: component
title: Privacy, Security and Governance Framework
description: A framework outlining data privacy, security protocols, and governance
  structures for industrial signal and video processing systems.
tags:
- privacy
- security
- governance
- data-protection
- compliance
timestamp: null
---

## 14. Privacy, Security and Governance

Privacy is a property of the topology, not a policy document. There is no code path from the circular video buffer to the uplink; the claim is falsifiable by inspection.

| Rule | Lane A (Operations) | Lane B (Identity) |
| :-- | :-- | :-- |
| Default state | ON | OFF |
| Plates | never read | read at edge, hashed, salted per epoch |
| Leaves the node | counts, classes, events | hotlist hits in clear, other reads as hashes with TTL |
| Cross-node linking | none | only for authorised queries |
| Access | role-based operations staff | named officers, case ID and legal authority required |
| Retention | configurable per jurisdiction | short by default (proposal: 30 days), purge on case close |
| Audit | full decision logs | every query logged, tamper-evident |

**Always true:** no facial recognition or biometric extraction at any tier; snapshot cadence limits what is observed independently of what is retained; the authority keeps full custody of raw footage through the parallel video output, and metadata can be audited against it.

**Security.** TLS 1.3 with AES-256 and mutual certificate authentication, per-node identity and revocation; data encrypted at rest; signed over-the-air packages with downgrade rejection; authenticated, bounded override channel so a compromised cloud cannot command an unsafe signal state; on-premises private cloud for domestic-only processing.

| Requirement | Implementation |
| :-- | :-- |
| Data localisation | Raw video never leaves the intersection; on-premises cloud option |
| Purpose limitation | Only traffic-relevant metadata generated or transmitted |
| DPDP Act 2023 | Minimisation and purpose-limitation by design |
| Auditability | Decision logs with inputs; correlation against authority-held footage |
| Access control | Role-based permissions across all functions |
| ISA/IEC 62443 | Industrial control security for the signal interface |
| ISO/IEC 27001 | Information security management for cloud operations |

**Governance gaps stated openly.** A detector at every junction is one configuration change from a tracking system, so technical safeguards need contractual and legal ones (purpose clauses, independent audit, case-bound access). Automation bias is real: operators who trust detection may under-verify. Proposed countermeasure: seeded drills in which the console injects known false alerts and scores operator response.

---