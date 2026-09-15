# 🌍 EarthSight: AI-Powered Semantic Satellite Image Retrieval & Multi-Temporal Change Analysis Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.13](https://img.shields.io/badge/Python-3.13-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/Frontend-React%2019-61DAFB.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Bundler-Vite%208-646CFF.svg)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg)](https://tailwindcss.com)

**EarthSight** is an end-to-end full-stack AI/GIS platform for multi-temporal satellite land-use semantic segmentation, change detection, geospatial statistics quantification, natural language query parsing, and automated AI summary report generation.

---

## 🚀 Core Features

- **📍 Interactive AOI Selection**: Search locations, pan/zoom, and define custom Areas of Interest (AOI).
- **📅 Multi-Temporal Historical Snapshots**: Select and compare satellite imagery across date windows (e.g. 2018 ➔ 2025).
- **🤖 6-Class Semantic Land-Cover Feature Extraction**:
  - 🏢 **Buildings** (Built-up urban expansion)
  - 🌳 **Vegetation** (Forest canopy & greenery)
  - 🛣️ **Roads** (Infrastructure network)
  - 💧 **Water Bodies** (Lakes, reservoirs, rivers)
  - 🌾 **Agriculture** (Cropland & farmland)
  - ⛰️ **Barren Soil** (Uncultivated soil & rock)
- **🎨 Color-Coded Spatial Change Overlays**:
  - 🟢 **Green**: Feature Increase (+)
  - 🔴 **Red**: Feature Decrease (-)
  - 🟡 **Yellow**: Significant Overall Transition
- **📊 Geospatially Calibrated Change Metrics**: Calculates real area in $km^2$, net delta, and percentage changes.
- **💬 Natural Language Query Parsing**: Translates human prompts (e.g., *"Show vegetation loss between 2018 and 2025"*) into structured parameters.
- **🎛️ Interactive Swipe Comparison Slider**: Interactively split and compare T1 vs T2 satellite scenes and segmentation masks.
- **📈 Recharts Analytics**: Bar chart comparison, land cover distribution donut chart, and multi-year time-series trend lines (2018–2025).
- **📝 Automated AI Narrative Summary Report**: Strictly statistical report generation with one-click `.MD` export.
- **🔄 Dual Operation Modes**:
  - **DEMO MODE**: High-resolution multi-temporal satellite datasets that run instantly without external API keys.
  - **LIVE SATELLITE MODE**: STAC API integration for Microsoft Planetary Computer / Sentinel-2 data.

---

## 🏗️ System Architecture

```text
EarthSight/
├── backend/
│   ├── app/
│   │   ├── api/                  # REST Endpoints (/health, /search, /semantic-query, etc.)
│   │   ├── satellite/            # Demo & Planetary Computer Sentinel-2 STAC Providers
│   │   ├── preprocessing/        # Image Aligner, Crop, & Normalizer
│   │   ├── segmentation/         # 6-Class Feature Segmenter Engine
│   │   ├── change_detection/     # Spatial Change Matrix & RGBA Overlay Generator
│   │   ├── statistics/           # Geospatial Area & Percentage Calculator (km²)
│   │   ├── semantic_search/      # Natural Language Query Parser
│   │   ├── reporting/            # AI Narrative Summary Generator
│   │   └── database/             # SQLite & PostGIS Session Persistence
│   ├── tests/                    # Pytest Suite
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, MapView, ImageSlider, ControlPanel, Charts, etc.
│   │   ├── services/             # Axios API Client
│   │   ├── App.jsx               # Main Layout Orchestrator
│   │   └── index.css             # Glassmorphic Theme & Leaflet Overlays
│   └── package.json
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
└── README.md
```

---

## ⚡ Quickstart Guide

### Prerequisites
- Python 3.10+
- Node.js v18+

### 1. Clone Repository
```bash
git clone https://github.com/Amal-05/EarthSight.git
cd EarthSight
```

### 2. Backend Setup
```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# Run backend development server
set PYTHONPATH=backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
*Backend API documentation available at `http://127.0.0.1:8000/docs`*

### 3. Frontend Setup
```bash
# In a new terminal tab
cd frontend
npm install
npm run dev
```
*Frontend dashboard opens at `http://localhost:5173/`*

---

## 🐳 Docker Deployment

To run the entire stack with Docker Compose:

```bash
docker-compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`

---

## 🧪 Running Unit Tests

```bash
set PYTHONPATH=backend
python -m pytest backend/tests/test_pipeline.py
```

---

## 📄 License
MIT License. Created for AI/GIS Hackathon and College Demonstration Prototype.
