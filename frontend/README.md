# Enclaveia

Enclaveia is an AI-powered decision intelligence platform that turns structured datasets into dashboard-ready business understanding.

Upload a CSV or Excel file, preview data quality, generate KPIs and charts, then open business insights and statistical summaries. The project is designed for non-technical users who need fast, presentation-ready answers without building BI dashboards manually.

## Why Enclaveia

Businesses often have data, but not clarity. Enclaveia helps users understand:

- Which KPIs matter most
- Which segments are leading or lagging
- Where data quality issues exist
- What trends, outliers, and patterns need attention
- How to explain the dashboard in business language

## AI And Privacy

Enclaveia uses local Gemma support through Ollama for privacy-friendly insight generation. This keeps sensitive company data closer to the user's environment and reduces dependence on external AI APIs for core explanation workflows.

## Key Features

- CSV, XLS, and XLSX upload
- Data preview with rows, columns, file size, and missing values
- Smart KPI selection that avoids serial numbers, IDs, and weak metrics
- Business-friendly chart titles and slicer labels
- Auto-generated dashboard title and subtitle based on the uploaded dataset
- ECharts-powered visualizations
- Interactive slicers
- Business insights panel
- Statistical summary with mean, median, mode, standard deviation, variance, min, and max
- Export and share actions
- Premium pink and burgundy UI theme

## Tech Stack

### Frontend

- Next.js
- React
- Tailwind CSS
- ShadCN-style components
- Zustand
- Apache ECharts

### Backend

- FastAPI
- Pandas
- NumPy
- Gemma via Ollama

## Project Structure

```txt
Enclaveia G4/
  backend/
    main.py
    utils/
      chart_advisor.py
      gemma_client.py
      kpi_calculator.py
      profiler.py

  frontend/
    app/
      page.tsx
      about/page.tsx
      upload/page.tsx
      preview/page.tsx
      dashboard/page.tsx
      globals.css

    components/
      dashboard/
      upload/
      ui/
      site-header.tsx
      site-footer.tsx
      scroll-reveal.tsx

    lib/
      data-utils.ts
      file-parser.ts
      sample-data.ts
      types.ts

    store/
      use-dataset-store.ts

    public/
      enclaveia-logo.png
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Production Build

```bash
cd frontend
npm run build
```

## Backend Setup

From the project root:

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

## Ollama And Gemma

Install Ollama, then pull and run Gemma locally:

```bash
ollama pull gemma
ollama run gemma
```

Use the backend Gemma utility to generate explanations from detected patterns while keeping the workflow local-first.

## GitHub Push Steps

If your repo is already created on GitHub:

```bash
git init
git add .
git commit -m "Update Enclaveia dashboard UI and AI logic"
git branch -M main
git remote add origin https://github.com/truptibhalekarr/YOUR_REPO_NAME.git
git push -u origin main
```

If remote already exists:

```bash
git remote set-url origin https://github.com/truptibhalekarr/YOUR_REPO_NAME.git
git add .
git commit -m "Update Enclaveia dashboard UI and AI logic"
git push
```
