# 🌍 EarthSight: AI-Powered Semantic Satellite Image Retrieval & Multi-Temporal Change Analysis Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.13](https://img.shields.io/badge/Python-3.13-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/Frontend-React%2019-61DAFB.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Bundler-Vite%208-646CFF.svg)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg)](https://tailwindcss.com)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAmal-05%2FEarthSight)
[![Deploy to Render](https://render.com/images/deploy-to-render.svg)](https://render.com/deploy?repo=https://github.com/Amal-05/EarthSight)

**EarthSight** is an end-to-end full-stack AI/GIS platform for multi-temporal satellite land-use semantic segmentation, change detection, geospatial statistics quantification, natural language query parsing, and automated AI summary report generation.

---

## ☁️ One-Click Cloud Hosting (Vercel & Render)

### Option A: Deploying to Vercel
1. Import `https://github.com/Amal-05/EarthSight` into [Vercel](https://vercel.com).
2. Vercel will automatically detect `vercel.json` and build both the Vite React frontend and the Python serverless API backend.
3. Click **Deploy**.

### Option B: Deploying to Render
1. Go to [Render Blueprints](https://dashboard.render.com/blueprints).
2. Connect your GitHub repository `https://github.com/Amal-05/EarthSight`.
3. Render will auto-detect `render.yaml` and provision both:
   - `earthsight-backend` (FastAPI Python Web Service)
   - `earthsight-frontend` (Static Web Site)
4. Click **Apply**.

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

## ⚡ Local Quickstart Guide

### 1. Clone Repository
```bash
git clone https://github.com/Amal-05/EarthSight.git
cd EarthSight
```

### 2. Backend Setup
```bash
pip install -r backend/requirements.txt
set PYTHONPATH=backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
*Backend API documentation available at `http://127.0.0.1:8000/docs`*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend dashboard opens at `http://localhost:5173/`*

---

## 🐳 Docker Deployment

```bash
docker-compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`

---

## 📄 License
MIT License. Created for AI/GIS Hackathon and College Demonstration Prototype.
