<div align="center">

  <img src="frontend/public/github-banner.svg" alt="Enclaveia Banner" width="100%"/>

  <br/>
  <br/>

  <a href="https://ollama.ai/"><img src="https://img.shields.io/badge/Powered%20by-Gemma%202%20(2B)-6f42c1?style=for-the-badge&logo=google&logoColor=white" alt="Powered by Gemma 2"/></a>
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
- [What's Next (Roadmap)](#-whats-next-for-enclaveia)
- [License](#-license)

---

## 🔒 The Problem

Businesses and teams today hesitate to upload sensitive financial, healthcare, or proprietary datasets to cloud-based AI tools. The reasons are clear:

- **Data privacy risks** — your data hits external servers
- **Compliance walls** — HIPAA, GDPR, and internal policies block cloud use
- **Unpredictable API costs** — token-based pricing scales poorly with large datasets

While large corporations spend millions building private AI infrastructure, rural clinics, NGOs, and small teams are left behind, completely blocked from the AI revolution.

---

## ✅ The Solution

**Enclaveia** is a fully local, on-premise AI decision intelligence dashboard. By running Google's highly efficient **Gemma 2 (2B)** model entirely on your machine via **Ollama**, Enclaveia guarantees **zero data leakage** — your data never leaves your laptop.

Upload a CSV or XLSX file and instantly get:
- KPI-led interactive dashboards
- AI-generated executive summaries and business insights
- Deep statistical profiling — all processed locally

---

## 🏛️ Architecture

Enclaveia follows a **local-first, three-layer architecture**:

```text
┌─────────────────────────────────────────────────────┐
│                 Browser (localhost:3000)            │
│         Next.js · React · Tailwind · ECharts        │
│           CSV/XLSX Upload · Dashboard UI            │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP
┌──────────────────────▼──────────────────────────────┐
│             Backend (localhost:8000)                │
│           FastAPI · Pandas · Prompt Engine          │
│     Data Processing · Statistical Profiling         │
└──────────────────────┬──────────────────────────────┘
                       │ Local API
┌──────────────────────▼──────────────────────────────┐
│                 AI Engine (Ollama)                  │
│                Gemma 2 2B (Local)                   │
│   Insight Generation · Summaries · Interpretation   │
└─────────────────────────────────────────────────────┘

> **No data ever leaves your machine.** All three layers run locally.

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js 15, React, Tailwind CSS | Premium glassmorphism UI |
| **Charts** | Apache ECharts | Interactive visualizations |
| **Backend** | Python, FastAPI | Data orchestration & API |
| **Data Processing** | Pandas | Statistical profiling |
| **AI Engine** | Ollama + Gemma 2 (2B) | Local LLM inference |
| **File Support** | CSV, XLSX | Dataset ingestion |

> We chose **Next.js** over Streamlit to deliver a richer, faster, and fully customized user experience — not a generic data app.

---

## ✨ Feature Highlights

- 🔐 **Fully Local** — Gemma 2 runs via Ollama; no API keys, no cloud calls
- 📊 **Interactive Dashboards** — ECharts-powered KPI cards and drill-down charts
- 🧠 **AI Business Insights** — Tone-aware executive summaries generated from your data
- 🩺 **Data Health Check** — Automatic missing value detection, outlier flags, and type inference
- 📈 **Statistical Profiling** — Mean, median, std deviation, correlation heatmaps, and more
- 📤 **Export & Share** — Download reports or share summaries with your team
- ⚡ **Zero Setup AI** — No OpenAI key, no billing — just Ollama running locally

---

## 📸 Product Walkthrough

*(See repository images for Landing, Dashboard, AI Insights, and Statistical Profiling previews).*

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

### Step 1 — Start Ollama & Pull Gemma 2

```bash
ollama run gemma2:2b
Wait for the model to download. Keep this terminal open.

Step 2 — Start the Backend
Bash
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
Step 3 — Start the Frontend
Bash
cd frontend
npm install
npm run dev
Done! Open http://localhost:3000 (or port 3001) in your browser.

Ollama (Gemma 2)  →  FastAPI :8000  →  Next.js UI
🚀 What's Next for Enclaveia (Product Roadmap)
This hackathon submission is just the foundation. Our vision for V2 includes:

Contextual AI Prompting: Allow users to give Gemma 2 a specific focus before analysis (e.g., "Focus on high-risk loans in the South").

Conversational BI UI: Edit charts dynamically using AI prompts (e.g., "Change this bar chart to a donut chart").

Auto-Healing Data workflows: Agentic ML workflows to automatically clean and impute missing values offline before dashboard generation.

📜 License
This project is licensed under the MIT License — open-sourced for the Gemma 4 Good Hackathon.
