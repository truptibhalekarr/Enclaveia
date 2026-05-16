import io
import json
import time
import sys
import threading
import pandas as pd

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from utils.profiler import profile_data
from utils.gemma_client import get_insight
from utils.chart_advisor import recommend_charts, get_slicer_columns
from utils.kpi_calculator import calculate_kpis

app = FastAPI(title="Enclaveia API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Hacker Logs Animation Logic ─────────────────────────────────────────────
def print_hacker_logs(stop_event, task_name="Analyzing data"):
    """Runs a cool terminal spinner and fake progress steps while Ollama thinks"""
    steps = [
        "Initializing local Ollama engine...",
        "Allocating memory for Gemma 2 (2B)...",
        "Parsing numerical statistics and categorical distributions...",
        "Constructing prompt context window...",
        f"{task_name}...",
        "Formatting output to strictly adhere to JSON..."
    ]
    
    print("\n\033[92m[SYSTEM]\033[0m Local AI Inference Triggered")
    
    step_idx = 0
    spinner = ['|', '/', '-', '\\']
    spin_idx = 0
    loops = 0
    
    while not stop_event.is_set():
        if step_idx < len(steps):
            sys.stdout.write(f"\r\033[96m[RUNNING]\033[0m {steps[step_idx]} {spinner[spin_idx]}   ")
        else:
            sys.stdout.write(f"\r\033[96m[RUNNING]\033[0m Finalizing tokens {spinner[spin_idx]}   ")
        
        sys.stdout.flush()
        time.sleep(0.1)
        spin_idx = (spin_idx + 1) % len(spinner)
        loops += 1
        
        # Move to next step artificially to simulate progress on screen
        if loops % 35 == 0 and step_idx < len(steps):
            sys.stdout.write(f"\r\033[92m[DONE]\033[0m {steps[step_idx]}                 \n")
            step_idx += 1
            
    sys.stdout.write("\r\033[92m[SUCCESS]\033[0m Gemma 2 inference complete!                 \n")
    sys.stdout.flush()


# ─── Helper ──────────────────────────────────────────────────────────────────
def _read_df(file: UploadFile) -> pd.DataFrame:
    contents = file.file.read()
    return pd.read_csv(io.BytesIO(contents))


# ─── /api/upload  (legacy — keep working) ────────────────────────────────────
@app.post("/api/upload")
async def upload(file: UploadFile = File(...)):
    try:
        df = _read_df(file)
        profile = profile_data(df)
        insight = get_insight(str(profile))
        kpis = [f"{k['label']}: {k['value']}" for k in calculate_kpis(df)]
        return {"status": "success", "kpis": kpis, "insight": insight}
    except Exception as e:
        return {"status": "error", "message": str(e)}


# ─── /api/dashboard ──────────────────────────────────────────────────────────
@app.post("/api/dashboard")
async def dashboard(file: UploadFile = File(...)):
    try:
        df = _read_df(file)

        kpis    = calculate_kpis(df)
        charts  = recommend_charts(df)
        slicers = get_slicer_columns(df)

        # Build a smart title from column names
        cols_preview = ", ".join(df.columns[:6].tolist())
        title_prompt = (
            f"You are naming a business dashboard. "
            f"The dataset has columns: {cols_preview}. "
            f"Reply with ONLY a short (4–6 word) professional dashboard title. "
            f"No quotes, no punctuation at the end."
        )
        
        try:
            # We don't need heavy logs for a 2-second title, but let's keep it clean
            title = get_insight(title_prompt).strip().strip('"').strip("'")
        except Exception:
            title = "Business Intelligence Overview"

        return {
            "status":   "success",
            "title":    title,
            "subtitle": f"{len(df):,} records · {len(df.columns)} columns · AI-generated",
            "kpis":     kpis,
            "charts":   charts,
            "slicers":  slicers,
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


# ─── /api/insights ───────────────────────────────────────────────────────────
@app.post("/api/insights")
async def insights(file: UploadFile = File(...)):
    try:
        df = _read_df(file)

        numeric_summary    = df.describe().to_string()
        cat_summary_lines  = []
        for c in df.select_dtypes(include='object').columns[:4]:
            top = df[c].value_counts().head(5).to_dict()
            cat_summary_lines.append(f"{c}: {top}")
        cat_summary = "\n".join(cat_summary_lines)

        prompt = f"""You are a senior business analyst presenting to a C-suite executive.
Analyse this dataset and provide exactly 5 sharp, business-focused insights.

Dataset info:
- Shape: {df.shape[0]:,} rows × {df.shape[1]} columns
- Columns: {list(df.columns)}

Numeric statistics:
{numeric_summary}

Top categorical values:
{cat_summary}

RULES:
- Each insight must have a short punchy title and 2–3 sentence explanation.
- Focus on revenue, profit, growth, risk, and operational opportunities.
- Use actual numbers from the data wherever possible.
- Respond ONLY with this exact JSON (no markdown, no extra text):

{{
  "insights": [
    {{"title": "...", "body": "..."}},
    {{"title": "...", "body": "..."}},
    {{"title": "...", "body": "..."}},
    {{"title": "...", "body": "..."}},
    {{"title": "...", "body": "..."}}
  ],
  "conclusion": "2-sentence executive conclusion on what action to take next."
}}"""

        # Start the Hacker Logs animation in the background
        stop_event = threading.Event()
        log_thread = threading.Thread(target=print_hacker_logs, args=(stop_event, "Generating C-suite executive insights"))
        log_thread.start()

        try:
            raw = get_insight(prompt)
            # Print a snippet of the generated text to terminal to prove it worked
            print(f"\n\033[93m[GEMMA 2 RAW OUTPUT]\033[0m\n{raw[:250]}...\n")
        finally:
            # Stop the animation once Ollama finishes
            stop_event.set()
            log_thread.join()

        # Parse JSON safely
        try:
            clean = raw.strip()
            for fence in ["```json", "```"]:
                if fence in clean:
                    clean = clean.split(fence)[1].split("```")[0].strip()
            result = json.loads(clean)
        except Exception:
            # Graceful fallback
            result = {
                "insights": [
                    {"title": "AI Analysis",   "body": raw[:400] if raw else "Analysis generated."},
                    {"title": "Data Scale",    "body": f"Dataset spans {df.shape[0]:,} records and {df.shape[1]} dimensions."},
                    {"title": "Data Quality",  "body": f"Missing values: {df.isnull().sum().sum():,}. Clean data rate: {(1 - df.isnull().mean().mean()):.1%}."},
                    {"title": "Key Numeric Columns", "body": f"Primary metrics detected: {list(df.select_dtypes(include='number').columns[:4])}."},
                    {"title": "Next Steps",    "body": "Use the filters to isolate your top-performing segments and export the results."},
                ],
                "conclusion": "Prioritise the highest-revenue segments and investigate any outliers identified above."
            }

        return result

    except Exception as e:
        return {"status": "error", "message": str(e)}


# ─── /api/summary ────────────────────────────────────────────────────────────
@app.post("/api/summary")
async def summary(file: UploadFile = File(...)):
    try:
        df = _read_df(file)
        numeric    = df.select_dtypes(include='number')
        categorical = df.select_dtypes(include='object')

        # Column-level stats
        col_stats = []
        for c in df.columns:
            mode_val = str(df[c].mode()[0]) if not df[c].mode().empty else "—"
            col_stats.append({
                "Column":    c,
                "Type":      str(df[c].dtype),
                "Non-Null":  int(df[c].count()),
                "Null %":    f"{df[c].isnull().mean()*100:.1f}%",
                "Unique":    int(df[c].nunique()),
                "Top Value": mode_val[:40],
            })

        # Metric-level stats
        metrics = []
        for c in numeric.columns:
            metrics.append({
                "Metric":  c,
                "Sum":     f"{numeric[c].sum():,.0f}",
                "Mean":    f"{numeric[c].mean():,.2f}",
                "Median":  f"{numeric[c].median():,.2f}",
                "Std Dev": f"{numeric[c].std():,.2f}",
                "Min":     f"{numeric[c].min():,.0f}",
                "Max":     f"{numeric[c].max():,.0f}",
            })

        # AI overview paragraph
        overview_prompt = (
            f"Write a 3–4 sentence executive business summary of this dataset. "
            f"Shape: {df.shape[0]:,} rows × {df.shape[1]} columns. "
            f"Numeric columns: {list(numeric.columns)}. "
            f"Categorical columns: {list(categorical.columns)}. "
            f"Key stats: {numeric.describe().to_dict()}. "
            f"Be specific. Use real numbers. Plain text only, no markdown."
        )
        
        # Start Hacker Logs for summary generation too
        stop_event = threading.Event()
        log_thread = threading.Thread(target=print_hacker_logs, args=(stop_event, "Drafting executive summary paragraph"))
        log_thread.start()

        try:
            overview = get_insight(overview_prompt)
        except Exception:
            overview = (
                f"This dataset contains {df.shape[0]:,} records across {df.shape[1]} columns, "
                f"comprising {len(numeric.columns)} numeric and {len(categorical.columns)} categorical dimensions. "
                f"The data appears suitable for business performance analysis and trend identification."
            )
        finally:
            stop_event.set()
            log_thread.join()

        return {
            "status":      "success",
            "overview":    overview,
            "metrics":     metrics,
            "column_stats": col_stats,
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}