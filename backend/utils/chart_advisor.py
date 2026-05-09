# backend/utils/chart_advisor.py

import pandas as pd
from typing import List, Dict, Any


def _get_column_categories(df: pd.DataFrame):
    """Classify all columns by their role."""
    numeric = df.select_dtypes(include='number').columns.tolist()

    categorical = [
        c for c in df.select_dtypes(include=['object', 'category']).columns
        if 2 <= df[c].nunique() <= 40
    ]

    date_cols = []
    for c in df.columns:
        if any(kw in c.lower() for kw in ['date', 'time', 'month', 'quarter', 'week', 'day']):
            try:
                pd.to_datetime(df[c], errors='raise')
                date_cols.append(c)
            except Exception:
                pass
        elif 'year' in c.lower() and df[c].dtype in ['int64', 'float64'] and df[c].nunique() <= 30:
            date_cols.append(c)

    return numeric, categorical, date_cols


def _find_priority_col(cols: List[str], keywords: List[str]) -> str | None:
    """Find the most business-relevant column from a list of keywords."""
    for kw in keywords:
        for c in cols:
            if kw in c.lower():
                return c
    return cols[0] if cols else None


def recommend_charts(df: pd.DataFrame) -> List[Dict[str, Any]]:
    """
    AI-style chart recommendation engine.
    Analyses column types and relationships to suggest the best,
    non-duplicate chart types — inspired by Power BI's smart visuals.
    """
    numeric, categorical, date_cols = _get_column_categories(df)
    charts: List[Dict[str, Any]] = []
    used_types: set = set()

    REVENUE_KW = ['revenue', 'sales', 'income', 'turnover', 'amount', 'total', 'value', 'price']
    SECOND_KW  = ['profit', 'cost', 'expense', 'discount', 'quantity', 'units', 'margin']
    FUNNEL_KW  = ['stage', 'status', 'phase', 'step', 'pipeline', 'funnel', 'level', 'tier']
    PROFIT_KW  = ['profit', 'net', 'earnings', 'margin']

    main_num   = _find_priority_col(numeric, REVENUE_KW)
    second_num = _find_priority_col([c for c in numeric if c != main_num], SECOND_KW)

    def add(cfg: Dict[str, Any]):
        if cfg['type'] not in used_types:
            charts.append(cfg)
            used_types.add(cfg['type'])

    # ── 1. LINE CHART — trend over time ──────────────────────────────────
    if date_cols and main_num:
        add({
            "type": "line",
            "title": f"{main_num} Trend Over Time",
            "x": date_cols[0],
            "y": main_num,
        })

    # ── 2. HORIZONTAL BAR — top N by category ────────────────────────────
    if categorical and main_num:
        add({
            "type": "horizontal_bar",
            "title": f"Top {categorical[0]} by {main_num}",
            "x": categorical[0],
            "y": main_num,
        })

    # ── 3. DONUT — share / composition ───────────────────────────────────
    if categorical and main_num:
        cat_for_donut = categorical[1] if len(categorical) > 1 else categorical[0]
        add({
            "type": "donut",
            "title": f"{main_num} Share by {cat_for_donut}",
            "x": cat_for_donut,
            "y": main_num,
        })

    # ── 4. SCATTER — correlation between two KPIs ────────────────────────
    if len(numeric) >= 2 and main_num and second_num:
        color_col = categorical[0] if categorical else None
        add({
            "type": "scatter",
            "title": f"{main_num} vs {second_num}",
            "x": second_num,
            "y": main_num,
            "color": color_col,
        })

    # ── 5. AREA CHART — cumulative / secondary metric trend ──────────────
    if date_cols and second_num and second_num != main_num:
        add({
            "type": "area",
            "title": f"{second_num} Trend (Cumulative View)",
            "x": date_cols[0],
            "y": second_num,
        })

    # ── 6. TREEMAP — hierarchical breakdown ──────────────────────────────
    if categorical and main_num and len(categorical) >= 1:
        add({
            "type": "treemap",
            "title": f"{main_num} Breakdown — {categorical[0]}",
            "x": categorical[0],
            "y": main_num,
        })

    # ── 7. HEATMAP — correlation matrix (if 4+ numeric cols) ─────────────
    if len(numeric) >= 4:
        add({
            "type": "heatmap",
            "title": "Metric Correlation Matrix",
            "x": None,
            "y": None,
        })

    # ── 8. FUNNEL — pipeline / stage analysis ────────────────────────────
    funnel_col = next(
        (c for c in categorical if any(kw in c.lower() for kw in FUNNEL_KW)), None
    )
    if funnel_col and main_num:
        add({
            "type": "funnel",
            "title": f"Pipeline Analysis by {funnel_col}",
            "x": funnel_col,
            "y": main_num,
        })

    # ── 9. BOX PLOT — distribution + outliers ────────────────────────────
    if categorical and main_num:
        add({
            "type": "box",
            "title": f"{main_num} Distribution by {categorical[0]}",
            "x": categorical[0],
            "y": main_num,
        })

    # ── 10. WATERFALL — profit/loss decomposition ─────────────────────────
    profit_col = _find_priority_col(numeric, PROFIT_KW)
    if categorical and profit_col and profit_col != main_num:
        add({
            "type": "waterfall",
            "title": f"{profit_col} Waterfall by {categorical[0]}",
            "x": categorical[0],
            "y": profit_col,
        })

    # ── 11. BUBBLE CHART — 3-metric comparison ───────────────────────────
    if len(numeric) >= 3:
        third_num = [c for c in numeric if c not in [main_num, second_num]]
        if third_num:
            add({
                "type": "bubble",
                "title": f"Multi-Metric Bubble: {main_num} / {second_num} / {third_num[0]}",
                "x": second_num,
                "y": main_num,
                "z": third_num[0],
                "color": categorical[0] if categorical else None,
            })

    # ── 12. HISTOGRAM — single numeric distribution ───────────────────────
    if numeric:
        add({
            "type": "histogram",
            "title": f"Distribution of {main_num or numeric[0]}",
            "x": main_num or numeric[0],
            "y": None,
        })

    # Return max 5 diverse charts
    return charts[:5]


def get_slicer_columns(df: pd.DataFrame) -> List[str]:
    """Return the best 3–4 columns to use as interactive slicers."""
    _, categorical, date_cols = _get_column_categories(df)

    # Prefer low-to-medium cardinality categoricals
    good = sorted(categorical, key=lambda c: df[c].nunique())

    # Year columns also make good slicers
    year_cols = [c for c in df.columns if 'year' in c.lower() and df[c].nunique() <= 25]

    combined = list(dict.fromkeys(good + year_cols))
    return combined[:4]