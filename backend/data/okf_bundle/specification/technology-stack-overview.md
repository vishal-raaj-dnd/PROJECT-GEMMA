---
id: technology-stack-overview
type: specification
title: Technology Stack Overview
description: A comprehensive list of hardware, software, and infrastructure layers
  including edge computing, inference engines, orchestration, and data management.
tags:
- technology-stack
- edge-computing
- software-architecture
- infrastructure
- machine-learning
timestamp: null
---

## 21. Technology Stack

| Layer | Choice |
| :-- | :-- |
| Edge hardware | ARM Cortex-A76/A78 SoC with 4-16 TOPS NPU in the Node Box (Jetson Orin Nano or Raspberry Pi 5 for development) |
| Edge inference | TensorFlow Lite, ONNX Runtime, PyTorch Mobile, TensorRT; OpenCV, FFmpeg; Redis Edge; local SQLite buffer |
| Edge models | YOLO-nano Tier 1; collision, emergency-vehicle, severity, pothole, waterlogging Tier 2; VehicleNet-Y26n, plate detector, ByteTrack, PaddleOCR PP-OCRv4 (Identity module) |
| Ingest and API | FastAPI with Uvicorn, Apache Kafka, WebSocket |
| Orchestration | Kubernetes, Docker |
| Data | TimescaleDB or InfluxDB (time series), PostGIS and Neo4j (geo and graph), MongoDB (incidents and audit), Redis (agent state) |
| RL and simulation | SUMO and VISSIM, asynchronous policy-gradient training in PyTorch |
| Maps | MapLibre GL JS with Deck.gl TripsLayer (3D), Leaflet with CartoDB DarkMatter (2D fallback) |
| Frontend | React 18, Vite, Tailwind CSS, Lucide, Recharts; React Native for mobile |
| Alerting | Twilio, Firebase Cloud Messaging |
| Hosting | AWS or Azure, with on-premises private cloud option |

Open-source components: VehicleNet-Y26n (Hugging Face, Perception365/VehicleNet-Y26n), YOLOv8n licence-plate model (Hugging Face, keremberke/yolov8n-license-plate-detection), PaddleOCR (GitHub, PaddlePaddle/PaddleOCR), Deck.gl, MapLibre GL JS, Leaflet, Recharts. Verify each licence before commercial use \[V\].

---