<div align="center">

  <!-- Animated Header Banner -->
  <img width="100%" src="https://capsule-render.vercel.app/api?type=venom&color=0:0f0c29,50:302b63,100:24243e&height=220&section=header&text=Enclaveia&fontSize=72&fontColor=ffffff&fontAlignY=42&desc=Local-First%20AI%20Decision%20Intelligence%20%E2%80%A2%20Zero%20Data%20Leakage&descAlignY=62&descSize=17&animation=fadeIn&stroke=6f42c1&strokeWidth=3" alt="Enclaveia Banner"/>

  <!-- Logo -->
  <img src="frontend/public/github-banner.svg" alt="Enclaveia Logo" width="220"/>

  <br/>
  <br/>

  <a href="https://ollama.ai/"><img src="https://img.shields.io/badge/Powered%20by-Gemma%204-6f42c1?style=for-the-badge&logo=google&logoColor=white" alt="Powered by Gemma 4"/></a>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Frontend-Next.js%2015-black?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/></a>
  <a href="https://fastapi.tiangolo.com/"><img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"/></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="MIT License"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Submission-Gemma%204%20Good%20Hackathon-1e90ff?style=for-the-badge&logo=google&logoColor=white" alt="Hackathon"/></a>

  <br/>
  <br/>

  <p><strong>100% Local · Zero Data Leakage · AI-Powered Decision Intelligence</strong></p>
  <p><em>Transform raw datasets into executive dashboards and AI insights — entirely on your machine.</em></p>

</div>

---

## Table of Contents

- [The Problem](#-the-problem)
- [The Solution](#-the-solution)
- [Architecture](#️-architecture)
- [Tech Stack](#-tech-stack)
- [Feature Highlights](#-feature-highlights)
- [Product Walkthrough](#-product-walkthrough)
- [Local Setup](#-local-setup)
- [License](#-license)

---

## 🔒 The Problem

Businesses and teams today hesitate to upload sensitive financial, healthcare, or proprietary datasets to cloud-based AI tools. The reasons are clear:

- **Data privacy risks** — your data hits external servers
- **Compliance walls** — HIPAA, GDPR, and internal policies block cloud use
- **Unpredictable API costs** — token-based pricing scales poorly with large datasets

These blockers prevent teams from leveraging the true power of modern LLMs for data analytics.

---

## ✅ The Solution

**Enclaveia** is a fully local, on-premise AI decision intelligence dashboard. By running Google's **Gemma 4** model entirely on your machine via **Ollama**, Enclaveia guarantees **zero data leakage** — your data never leaves your laptop.

Upload a CSV or XLSX file and instantly get:
- KPI-led interactive dashboards
- AI-generated executive summaries and business insights
- Deep statistical profiling — all processed locally

---

## 🏛️ Architecture

Enclaveia follows a **local-first, three-layer architecture**:

```
┌─────────────────────────────────────────────────────┐
│                  Browser (localhost:3000)            │
│         Next.js · React · Tailwind · ECharts        │
│           CSV/XLSX Upload · Dashboard UI            │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP
┌──────────────────────▼──────────────────────────────┐
│              Backend (localhost:8000)                │
│           FastAPI · Pandas · Prompt Engine           │
│     Data Processing · Statistical Profiling         │
└──────────────────────┬──────────────────────────────┘
                       │ Local API
┌──────────────────────▼──────────────────────────────┐
│                 AI Engine (Ollama)                   │
│                  Gemma 4 (Local)                     │
│    Insight Generation · Summaries · Interpretation  │
└─────────────────────────────────────────────────────┘
```

> **No data ever leaves your machine.** All three layers run locally.

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js 15, React, Tailwind CSS | Premium glassmorphism UI |
| **Charts** | Apache ECharts | Interactive visualizations |
| **Backend** | Python, FastAPI | Data orchestration & API |
| **Data Processing** | Pandas | Statistical profiling |
| **AI Engine** | Ollama + Gemma 4 | Local LLM inference |
| **File Support** | CSV, XLSX | Dataset ingestion |

> We chose **Next.js** over Streamlit to deliver a richer, faster, and fully customized user experience — not a generic data app.

---

## ✨ Feature Highlights

- 🔐 **Fully Local** — Gemma 4 runs via Ollama; no API keys, no cloud calls
- 📊 **Interactive Dashboards** — ECharts-powered KPI cards and drill-down charts
- 🧠 **AI Business Insights** — Tone-aware executive summaries generated from your data
- 🩺 **Data Health Check** — Automatic missing value detection, outlier flags, and type inference
- 📈 **Statistical Profiling** — Mean, median, std deviation, correlation heatmaps, and more
- 📤 **Export & Share** — Download reports or share summaries with your team
- ⚡ **Zero Setup AI** — No OpenAI key, no billing — just Ollama running locally

---

## 📸 Product Walkthrough

### 1. Landing & Upload Experience
<img src="frontend/public/01_home.png" width="100%" alt="Home Screen"/>
<br/>
<img src="frontend/public/02_upload.png" width="100%" alt="Upload Interface"/>

### 2. Data Preview & Health Check
<img src="frontend/public/03_data_preview.png" width="100%" alt="Data Profiling"/>

### 3. Executive Dashboard
<img src="frontend/public/04_dashboard_overview.png" width="100%" alt="Dashboard Overview"/>
<br/>
<img src="frontend/public/05_dashboard_charts.png" width="100%" alt="Dashboard Charts"/>

### 4. AI-Generated Insights
<img src="frontend/public/06_insights.png" width="100%" alt="AI Insights"/>

### 5. Statistical Summary
<img src="frontend/public/07_statistical_summary.png" width="100%" alt="Statistical Summary"/>

### 6. Export & Share
<img src="frontend/public/08_export.png" width="100%" alt="Export"/>
<br/>
<img src="frontend/public/09_share.png" width="100%" alt="Share"/>
<br/>
<img src="frontend/public/10_extra.png" width="100%" alt="Additional Features"/>

---

## 🚀 Local Setup

No cloud API keys required. Everything runs on your machine.

### Prerequisites

| Requirement | Version | Link |
|---|---|---|
| Node.js | v18+ | [nodejs.org](https://nodejs.org/) |
| Python | 3.10+ | [python.org](https://www.python.org/) |
| Ollama | Latest | [ollama.ai](https://ollama.ai/) |

---

### Step 1 — Start Ollama & Pull Gemma 4

```bash
ollama run gemma:4
```

> Wait for the model to download. Keep this terminal open.

---

### Step 2 — Start the Backend

```bash
# From the project root
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
cd backend
uvicorn main:app --reload --port 8000
```

---

### Step 3 — Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

---

**Done!** Open [http://localhost:3000](http://localhost:3000) in your browser.

```
Ollama (Gemma 4)  →  FastAPI :8000  →  Next.js :3000
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE) — open-sourced for the **Gemma 4 Good Hackathon**.

---

<div align="center">
  <img width="100%" src="https://capsule-render.vercel.app/api?type=venom&color=0:0f0c29,50:302b63,100:24243e&height=120&section=footer&animation=fadeIn" alt="Footer"/>
  <br/>
  <sub>Built with ❤️ by <a href="https://github.com/truptibhalekarr">truptibhalekarr</a></sub>
</div>
