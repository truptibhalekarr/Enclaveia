<div align="center">
  <img src="frontend/public/github-banner.svg" alt="Enclaveia Banner" width="100%"/>
  
  ![Powered by Gemma](https://img.shields.io/badge/Powered%20by-Gemma%204-purple?style=for-the-badge)
  ![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%20%2B%20FastAPI-black?style=for-the-badge)
  ![Hackathon Submission](https://img.shields.io/badge/Submission-Gemma%204%20Good%20Hackathon-blue?style=for-the-badge)
</div>

<br>

## 🛡️ The "Privacy-First" Problem & Solution
**The Problem:** Today, businesses and teams hesitate to upload sensitive financial, healthcare, or proprietary datasets to cloud-based AI tools. Data privacy risks, compliance issues, and API costs block them from leveraging the power of modern LLMs for data analytics.

**The Solution:** Enclaveia provides a **100% local, on-premise AI decision intelligence dashboard**. By running Google's powerful Gemma 4 model entirely on your local machine via Ollama, Enclaveia guarantees zero data leakage. It instantly converts raw datasets into KPI-led dashboards and executive summaries without your data ever leaving your laptop.

---

## ⚙️ Clear Tech Stack & Architecture
Enclaveia is built with a thoughtfully designed local-first architecture:

1. **Frontend (Next.js / React & Tailwind CSS):** A premium, glassmorphism-themed interactive UI that runs locally. It handles CSV/XLSX uploads and renders beautiful ECharts without external servers. *(Note: We chose Next.js over Streamlit for a much richer, faster, and highly customized premium user experience!)*
2. **Backend (Python / FastAPI):** Acts as the orchestrator. It processes the uploaded data using Pandas, calculates statistical summaries, and prepares optimized prompts for the AI.
3. **AI Engine (Ollama + Gemma 4):** The core intelligence. The FastAPI backend sends the anonymized statistical profiles to the locally running Gemma model to generate business insights, tone-aware summaries, and data interpretations.

---

## 🚀 Foolproof Local Setup Instructions

Follow these exact steps to run Enclaveia on your machine. No cloud API keys required!

### Prerequisites:
1. Install [Node.js](https://nodejs.org/) (v18+)
2. Install [Python 3.10+](https://www.python.org/)
3. Install [Ollama](https://ollama.ai/)

### Step 1: Start Ollama & Pull Gemma
Open a terminal and run the local AI engine:
```bash
ollama run gemma:4
# Wait for the model to download and start running. 
# Keep this terminal open or running in the background.
```

### Step 2: Start the Backend (FastAPI)
Open a new terminal and navigate to the project root directory:
```bash
# Create a virtual environment
python -m venv venv

# Activate it (Windows)
venv\Scripts\activate
# Or (Mac/Linux): source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Run the FastAPI server
cd backend
uvicorn main:app --reload --port 8000
```

### Step 3: Start the Frontend (Next.js)
Open a third terminal and navigate to the frontend directory:
```bash
cd frontend

# Install Node dependencies
npm install

# Start the Next.js frontend
npm run dev
```

**That's it!** Open your browser and go to `http://localhost:3000` to experience Enclaveia!

---

## 📸 Full Product Walkthrough

### 1. Landing & Seamless Upload Experience
<img src="frontend/public/01_home.png" width="100%" alt="Home">
<br>
<img src="frontend/public/02_upload.png" width="100%" alt="Upload">

### 2. Smart Data Profiling & Health Check
<img src="frontend/public/03_data_preview.png" width="100%" alt="Data Preview">

### 3. Interactive Executive Dashboard
<img src="frontend/public/04_dashboard_overview.png" width="100%" alt="Dashboard Overview">
<br>
<img src="frontend/public/05_dashboard_charts.png" width="100%" alt="Dashboard Charts">

### 4. AI-Generated Business Insights
<img src="frontend/public/06_insights.png" width="100%" alt="AI Insights">

### 5. Deep Statistical Summary
<img src="frontend/public/07_statistical_summary.png" width="100%" alt="Statistical Summary">

### 6. Export & Sharing
<img src="frontend/public/08_export.png" width="100%" alt="Export">
<br>
<img src="frontend/public/09_share.png" width="100%" alt="Share">
<br>
<img src="frontend/public/10_extra.png" width="100%" alt="Additional Features">

---

## 📜 Open Source License Statement
Licensed under the [MIT License](LICENSE) for the **Gemma 4 Good Hackathon**.
