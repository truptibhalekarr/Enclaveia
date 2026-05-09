# backend/utils/kpi_calculator.py

import pandas as pd
from typing import List, Dict, Any


def _fmt_currency(n: float) -> str:
    try:
        n = float(n)
        if abs(n) >= 1_000_000_000: return f"${n/1_000_000_000:.2f}B"
        if abs(n) >= 1_000_000:     return f"${n/1_000_000:.1f}M"
        if abs(n) >= 1_000:         return f"${n/1_000:.1f}K"
        return f"${n:,.0f}"
    except Exception:
        return "N/A"


def _fmt_pct(n: float) -> str:
    try: return f"{float(n):.1f}%"
    except Exception: return "N/A"


def _fmt_count(n: float) -> str:
    try: return f"{int(n):,}"
    except Exception: return str(n)


def _find(cols: List[str], keywords: List[str]) -> str | None:
    for kw in keywords:
        for c in cols:
            if kw in c.lower():
                return c
    return None


def calculate_kpis(df: pd.DataFrame) -> List[Dict[str, Any]]:
    """
    Detect and calculate business-oriented KPIs from any DataFrame.
    Always returns 4 KPI dicts: {label, value, sub, trend}.
    """
    numeric = df.select_dtypes(include='number').columns.tolist()
    kpis: List[Dict[str, Any]] = []
    used_cols: set = set()

    def add_kpi(label: str, value: str, sub: str, col: str | None = None):
        kpis.append({"label": label, "value": value, "sub": sub})
        if col:
            used_cols.add(col)

    # Identify key columns
    rev_col    = _find(numeric, ['revenue', 'sales', 'income', 'turnover', 'receipts', 'amount'])
    profit_col = _find(numeric, ['profit', 'net_income', 'net_profit', 'earnings', 'margin_amt'])
    cost_col   = _find(numeric, ['cost', 'expense', 'expenditure', 'cogs', 'spending', 'opex'])
    qty_col    = _find(numeric, ['quantity', 'qty', 'units', 'volume', 'orders', 'count', 'sold'])

    # ── KPI 1: Total Revenue ─────────────────────────────────────────────
    if rev_col:
        total = df[rev_col].sum()
        add_kpi("Total Revenue", _fmt_currency(total), f"Σ {rev_col}", rev_col)
    elif numeric:
        c = numeric[0]
        add_kpi(f"Total {c}", _fmt_currency(df[c].sum()), f"Σ {c}", c)

    # ── KPI 2: Net Profit / Gross Profit ─────────────────────────────────
    if profit_col:
        total = df[profit_col].sum()
        add_kpi("Net Profit", _fmt_currency(total), f"Σ {profit_col}", profit_col)
    elif rev_col and cost_col:
        gross = (df[rev_col] - df[cost_col]).sum()
        add_kpi("Gross Profit", _fmt_currency(gross), "Revenue − Cost")
    elif len(numeric) >= 2:
        c = next((x for x in numeric if x not in used_cols), None)
        if c:
            add_kpi(f"Total {c}", _fmt_currency(df[c].sum()), f"Σ {c}", c)

    # ── KPI 3: Profit Margin ─────────────────────────────────────────────
    if rev_col and profit_col and df[rev_col].sum() != 0:
        margin = df[profit_col].sum() / df[rev_col].sum() * 100
        add_kpi("Profit Margin", _fmt_pct(margin), "Net / Revenue")
    elif rev_col and cost_col and df[rev_col].sum() != 0:
        gross = (df[rev_col] - df[cost_col]).sum()
        margin = gross / df[rev_col].sum() * 100
        add_kpi("Gross Margin", _fmt_pct(margin), "Gross / Revenue")
    elif rev_col:
        avg = df[rev_col].mean()
        add_kpi("Avg Transaction", _fmt_currency(avg), f"μ {rev_col}")
    else:
        # Fallback: average of next best col
        c = next((x for x in numeric if x not in used_cols), None)
        if c:
            add_kpi(f"Avg {c}", f"{df[c].mean():,.1f}", f"μ {c}", c)

    # ── KPI 4: Volume / Customer Metric ──────────────────────────────────
    if qty_col:
        add_kpi("Total Volume", _fmt_count(df[qty_col].sum()), f"Σ {qty_col}", qty_col)
    else:
        # Look for customer / record count dimension
        cust_col = _find(df.columns.tolist(), ['customer', 'client', 'user', 'buyer', 'account', 'id'])
        if cust_col:
            uniq = df[cust_col].nunique()
            add_kpi("Unique Customers", _fmt_count(uniq), f"Distinct {cust_col}")
        else:
            # Fallback: total record count
            add_kpi("Total Records", _fmt_count(len(df)), "Rows in dataset")

    return kpis[:4]