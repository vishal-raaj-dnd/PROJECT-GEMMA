---
id: node-link-state-machine-and-registration-plate-grammar-parser
type: component
title: Node Link State Machine and Registration-plate Grammar Parser
description: A software component comprising a node link state machine for connectivity-driven
  mode switching and a regex-based registration-plate normalization parser.
tags:
- software-component
- state-machine
- regex-parser
- data-normalization
timestamp: null
---

# demo baseline: same call with kappa all 0 (shortest path under current signals)
```

### 22.2 Node link state machine (bounded, expiring, ignorable)

```python
class NodeLink:
    OPTIMAL, DEGRADED, AUTONOMOUS = "OPTIMAL", "DEGRADED", "AUTONOMOUS"

    def __init__(self, hb_s=5.0):
        self.mode, self.hb_s = self.AUTONOMOUS, hb_s
        self.last_hb, self.green, self.override_until = 0.0, None, 0.0

    def on_heartbeat(self, now, rtt_ms):
        self.last_hb = now
        self.mode = self.DEGRADED if rtt_ms > 800 else self.OPTIMAL

    def accept_override(self, now, green_s, ttl_s, lo=30, hi=120):
        if not lo <= green_s <= hi:      # bounded: node rejects unsafe values
            return False
        self.green, self.override_until = green_s, now + ttl_s   # expiring
        return True

    def tick(self, now):
        if now - self.last_hb > 2 * self.hb_s:   # two missed heartbeats
            self.mode = self.AUTONOMOUS
        if now > self.override_until:            # ignorable: revert to local policy
            self.green = None
        return self.mode
```

### 22.3 Registration-plate grammar parser (right-anchored)

```python
import re
DIG2LET = {"0": "O", "1": "I", "8": "B", "5": "S", "2": "Z"}
LET2DIG = {v: k for k, v in DIG2LET.items()} | {"D": "0", "L": "1"}
PAT = re.compile(r"^([A-Z0-9]{2})([A-Z0-9]{1,2})([A-Z0-9]{1,3})([A-Z0-9]{4})$")

def normalise(raw: str):
    s = re.sub(r"[^A-Z0-9]", "", raw.upper())
    m = PAT.match(s)
    if not m:
        return None
    st, rto, ser, num = m.groups()
    st  = "".join(DIG2LET.get(c, c) for c in st)    # state code: letters
    rto = "".join(LET2DIG.get(c, c) for c in rto)   # RTO: digits
    ser = "".join(DIG2LET.get(c, c) for c in ser)   # series: letters
    num = "".join(LET2DIG.get(c, c) for c in num)   # number: digits
    out = st + rto + ser + num
    return out if re.fullmatch(r"[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}", out) else None
```

The regex groups are ambiguous when RTO or series length varies. Validate against the RTO code table and prefer the parse with the highest OCR confidence.

---