---
id: vehicle-intelligence-identity-module
type: component
title: Vehicle Intelligence Identity Module
description: An AI-driven module for vehicle detection, license plate localization,
  OCR, and privacy-preserving data transformation.
tags:
- vehicle-detection
- ocr
- privacy-protection
- ai-model
timestamp: null
---

## 6. Vehicle Intelligence (Identity Module)

The Identity module is licensed separately, deployed per authority, and **off by default**.

**6.1 Vehicle detection.** VehicleNet-Y26n, a YOLO-nano model from the AI for Integrated Mobility group at IISc Bengaluru, trained on the UVH-26 dataset (about 26,000 annotated frames from the Bengaluru Traffic Police Safe City project). 14 classes: hatchback, sedan, SUV, MUV, bus, truck, three-wheeler, two-wheeler, LCV, mini-bus, tempo-traveller, bicycle, van, other. About 6.2 MB; roughly 12 ms on CPU and 3.2 ms on a Jetson with TensorRT \[V\].

**6.2 Plate localisation and OCR.**

- A plate detector returns a normalised box. If height / width exceeds 0.45 (two-wheelers, auto-rickshaws, commercial carriers) the crop is split into rows at 0 to 0.52h and 0.48h to 1.0h, read independently and concatenated.
- Preprocessing: grayscale, bilateral filter (d = 9, sigma = 75, 75) to suppress mud and rain streaks, adaptive threshold, CLAHE at night.
- Recognition: PaddleOCR PP-OCRv4.
- ByteTrack keeps vehicle identity within a camera until a clear plate read is obtained.

**6.3 Indian registration grammar.** Valid formats are `^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$` and the BH series `^[0-9]{2}BH[0-9]{4}[A-Z]{1,2}$`, with the state or UT code checked against the RTO table (36 states and UTs). Because the RTO number (1-2 digits) and series (1-3 letters) vary in length, parsing is anchored from the right: last four characters are digits, then 1-3 letters, then 1-2 digits, then the two-letter state code. Look-alike swaps (0/O, 1/I, 8/B, 5/S, 2/Z) are applied per parsed field, never per fixed index. A reference implementation is in Section 22.

**6.4 Privacy transform.** At the edge the plate string becomes HMAC(plate, rotating salt). Only hotlist matches leave the node in clear form; every other read crosses the boundary as a hash with a time-to-live.

---