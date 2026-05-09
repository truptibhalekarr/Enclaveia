import type {
  BusinessInsight,
  ColumnProfile,
  ColumnType,
  DashboardChart,
  DashboardData,
  DataRow,
  DatasetProfile,
  Kpi,
  NumericStats,
  StatisticalRow
} from "@/lib/types";

const revenuePatterns = ["revenue", "sales", "amount", "total", "value", "price", "gmv", "funding", "usd", "income"];
const profitPatterns = ["profit", "margin", "net income", "earnings"];
const costPatterns = ["cost", "expense", "spend"];
const volumePatterns = ["orders", "quantity", "units", "customers", "users", "transactions", "count"];
const impactPatterns = ["killed", "injured", "fatal", "victim", "casualty", "impact", "score", "rating"];
const idPatterns = ["id", "s.no", "sno", "serial", "index", "unnamed", "number", "no."];
const dateNamePatterns = ["date", "time", "month", "year", "created", "founded", "founded_at"];
const weakMetricPatterns = ["age", "year", "code", "zip", "postal", "latitude", "longitude", "lat", "lng"];

const chartPalette = ["#781a3a", "#b94f6c", "#e09fa4", "#6d806b", "#4b0b25", "#d9787d"];

export function formatFileSize(bytes: number) {
  if (!bytes) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0
  }).format(value);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatCompactNumber(value: number) {
  const absolute = Math.abs(value);

  if (absolute >= 10000000) return `${(value / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
  if (absolute >= 100000) return `${(value / 100000).toFixed(2).replace(/\.00$/, "")} L`;
  if (absolute >= 1000) return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return formatNumber(value);
}

export function formatCompactCurrency(value: number) {
  return `₹${formatCompactNumber(value)}`;
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

export function isMissing(value: unknown) {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") {
    const clean = value.trim().toLowerCase();
    return clean === "" || clean === "null" || clean === "na" || clean === "n/a" || clean === "undefined";
  }
  return false;
}

export function parseNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;
  const clean = value.replace(/[%,$\u20b9\s]/g, "").replace(/,/g, "");
  if (clean === "") return null;
  const numeric = Number(clean);
  return Number.isFinite(numeric) ? numeric : null;
}

function parseDate(value: unknown) {
  if (value instanceof Date && Number.isFinite(value.getTime())) return value;
  if (typeof value !== "string" && typeof value !== "number") return null;
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function cleanCell(value: unknown) {
  if (isMissing(value)) return null;
  if (typeof value === "number") return value;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).trim();
}

function numericStats(values: number[]): NumericStats {
  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((total, value) => total + value, 0);
  const mean = values.length ? sum / values.length : 0;
  const midpoint = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 ? sorted[midpoint] : (sorted[midpoint - 1] + sorted[midpoint]) / 2;
  const variance = values.length ? values.reduce((total, value) => total + Math.pow(value - mean, 2), 0) / values.length : 0;

  return {
    count: values.length,
    sum,
    mean,
    median,
    min: sorted[0] ?? 0,
    max: sorted[sorted.length - 1] ?? 0,
    stdDev: Math.sqrt(variance)
  };
}

function modeValue(values: unknown[]) {
  const counts = new Map<string, number>();
  values
    .filter((value) => !isMissing(value))
    .map((value) => String(value))
    .forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));

  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";
}

function normalizedName(name: string) {
  return name.toLowerCase().replace(/[_-]+/g, " ").trim();
}

function isLikelyDateColumnName(name: string) {
  const clean = normalizedName(name);
  return dateNamePatterns.some((pattern) => clean.includes(pattern));
}

function isLikelyIdColumn(column: ColumnProfile, totalRows: number) {
  const clean = normalizedName(column.name);
  const hasIdName = idPatterns.some((pattern) => clean === pattern || clean.includes(pattern));
  const mostlyUnique = totalRows > 20 && column.uniqueCount / totalRows > 0.92;
  const stats = column.numericStats;
  const looksSequential = stats ? stats.min <= 2 && stats.max >= totalRows * 0.75 && mostlyUnique : false;
  return column.type === "number" && (hasIdName || looksSequential);
}

function isWeakMetricColumn(column: ColumnProfile) {
  const clean = normalizedName(column.name);
  return weakMetricPatterns.some((pattern) => clean === pattern || clean.includes(pattern));
}

function inferColumnType(values: unknown[], columnName = ""): ColumnType {
  const present = values.filter((value) => !isMissing(value));
  if (!present.length) return "text";

  const numericCount = present.filter((value) => parseNumber(value) !== null).length;
  const dateCount = present.filter((value) => parseDate(value) !== null).length;
  const uniqueCount = new Set(present.map((value) => String(value))).size;

  if (isLikelyDateColumnName(columnName) && dateCount / present.length >= 0.45) return "date";
  if (numericCount / present.length >= 0.75) return "number";
  if (dateCount / present.length >= 0.65) return "date";
  if (uniqueCount <= Math.max(8, present.length * 0.45)) return "category";
  return "text";
}

export function buildDatasetProfile(rows: DataRow[], fileName = "Demo dataset", fileSize = 0): DatasetProfile {
  const columns = Object.keys(rows[0] ?? {});
  const totalCells = rows.length * columns.length;
  let missingCells = 0;

  const columnProfiles: ColumnProfile[] = columns.map((column) => {
    const values = rows.map((row) => row[column]);
    const missingCount = values.filter(isMissing).length;
    missingCells += missingCount;
    const presentValues = values.filter((value) => !isMissing(value));
    const type = inferColumnType(values, column);
    const numericValues = presentValues.map(parseNumber).filter((value): value is number => value !== null);

    return {
      name: column,
      type,
      missingCount,
      missingRate: rows.length ? (missingCount / rows.length) * 100 : 0,
      uniqueCount: new Set(presentValues.map((value) => String(value))).size,
      sampleValues: [...new Set(presentValues.map((value) => String(value)))].slice(0, 5),
      numericStats: type === "number" ? numericStats(numericValues) : undefined
    };
  });

  return {
    fileName,
    fileSize,
    rowCount: rows.length,
    columnCount: columns.length,
    missingCells,
    missingRate: totalCells ? (missingCells / totalCells) * 100 : 0,
    columns: columnProfiles
  };
}

export function normalizeRows(headers: string[], rawRows: unknown[][]): DataRow[] {
  const uniqueHeaders = headers.map((header, index) => {
    const clean = String(header || `Column ${index + 1}`).trim();
    return clean || `Column ${index + 1}`;
  });

  return rawRows
    .filter((row) => row.some((cell) => !isMissing(cell)))
    .map((row) => {
      return uniqueHeaders.reduce<DataRow>((record, header, index) => {
        record[header] = cleanCell(row[index]);
        return record;
      }, {});
    });
}

function metricColumns(profile: DatasetProfile, includeWeak = false) {
  return profile.columns.filter(
    (column) =>
      column.type === "number" &&
      !isLikelyIdColumn(column, profile.rowCount) &&
      (includeWeak || !isWeakMetricColumn(column))
  );
}

function findColumn(profile: DatasetProfile, patterns: string[], type: ColumnType = "number", useFallback = true) {
  const columns = type === "number" ? metricColumns(profile) : profile.columns.filter((column) => column.type === type);
  const match = columns.find((column) => patterns.some((pattern) => column.name.toLowerCase().includes(pattern)))?.name;
  return match ?? (useFallback ? columns[0]?.name : undefined);
}

function findPrimaryMetric(profile: DatasetProfile) {
  return (
    findColumn(profile, revenuePatterns, "number", false) ??
    findColumn(profile, impactPatterns, "number", false) ??
    findColumn(profile, volumePatterns, "number", false) ??
    metricColumns(profile)[0]?.name
  );
}

function getNumbers(rows: DataRow[], column?: string) {
  if (!column) return [];
  return rows.map((row) => parseNumber(row[column])).filter((value): value is number => value !== null);
}

function sumColumn(rows: DataRow[], column?: string) {
  return getNumbers(rows, column).reduce((total, value) => total + value, 0);
}

function average(values: number[]) {
  return values.length ? values.reduce((total, value) => total + value, 0) / values.length : 0;
}

function titleCase(value: string) {
  return value
    .replace(/\.[^/.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function friendlyColumnName(value?: string) {
  if (!value) return "Primary Metric";
  return titleCase(value)
    .replace(/\bUsd\b/g, "USD")
    .replace(/\bId\b/g, "ID")
    .replace(/\bS No\b/g, "Serial Number")
    .replace(/\bCountry Code\b/g, "Country")
    .replace(/\bFuel Type\b/g, "Fuel Type")
    .replace(/\bFounded At\b/g, "Founded Date")
    .replace(/\bFunding Total USD\b/g, "Funding Total");
}

function isFinancialMetric(column?: string) {
  if (!column) return false;
  const clean = normalizedName(column);
  return revenuePatterns.some((pattern) => clean.includes(pattern)) || clean.includes("funding");
}

function canEstimateProfit(column?: string) {
  if (!column) return false;
  const clean = normalizedName(column);
  return ["revenue", "sales", "gmv", "income"].some((pattern) => clean.includes(pattern));
}

function inferEntityLabel(profile: DatasetProfile) {
  const name = normalizedName(profile.fileName);
  if (name.includes("automobile") || name.includes("car") || name.includes("vehicle")) return "Vehicles";
  if (name.includes("startup") || name.includes("company")) return "Companies";
  if (name.includes("incident") || name.includes("gun") || name.includes("crime")) return "Incidents";
  if (name.includes("sales") || name.includes("order")) return "Transactions";
  return "Records";
}

function getCategoryColumns(profile: DatasetProfile) {
  return profile.columns
    .filter((column) => (column.type === "category" || column.type === "text") && column.uniqueCount > 1)
    .filter((column) => column.uniqueCount <= Math.max(50, profile.rowCount * 0.35))
    .sort((a, b) => {
      const aName = normalizedName(a.name);
      const bName = normalizedName(b.name);
      const aScore = aName.includes("country") || aName.includes("region") || aName.includes("status") || aName.includes("reason") ? -1 : 0;
      const bScore = bName.includes("country") || bName.includes("region") || bName.includes("status") || bName.includes("reason") ? -1 : 0;
      return aScore - bScore || a.uniqueCount - b.uniqueCount;
    });
}

function dashboardTitle(profile: DatasetProfile, metricColumn?: string) {
  const subject = titleCase(profile.fileName || "Business Dataset")
    .replace(/\bCsv\b/g, "")
    .replace(/\bXlsx\b/g, "")
    .replace(/\bData\b/g, "Data")
    .trim();

  const metric = friendlyColumnName(metricColumn);
  if (subject.toLowerCase().includes("automobile")) return "Automobile Pricing Intelligence";
  if (subject.toLowerCase().includes("startup")) return "Startup Funding Intelligence";
  if (subject.toLowerCase().includes("incident")) return "Incident Pattern Intelligence";
  if (metricColumn) return `${metric} Intelligence`;
  return `${subject} Intelligence`;
}

function dashboardSubtitle(profile: DatasetProfile, metricColumn?: string, categoryColumn?: string, dateColumn?: string) {
  const focusParts = [
    metricColumn ? friendlyColumnName(metricColumn) : null,
    categoryColumn ? `by ${friendlyColumnName(categoryColumn)}` : null,
    dateColumn ? `over ${friendlyColumnName(dateColumn)}` : null
  ].filter(Boolean);

  return `Generated from ${profile.fileName}. Analyzing ${formatNumber(profile.rowCount)} rows across ${profile.columnCount} columns${focusParts.length ? `, focused on ${focusParts.join(" ")}` : ""}.`;
}

function groupByCategory(rows: DataRow[], categoryColumn: string, metricColumn?: string) {
  const grouped = new Map<string, number>();

  rows.forEach((row) => {
    const category = String(row[categoryColumn] ?? "Unknown");
    const value = metricColumn ? parseNumber(row[metricColumn]) ?? 0 : 1;
    grouped.set(category, (grouped.get(category) ?? 0) + value);
  });

  return [...grouped.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function groupByDate(rows: DataRow[], dateColumn: string, metricColumn?: string) {
  const grouped = new Map<string, number>();
  const dates = rows.map((row) => parseDate(row[dateColumn])).filter((date): date is Date => Boolean(date));
  const years = new Set(dates.map((date) => date.getFullYear()));
  const groupByYear = years.size > 3 || normalizedName(dateColumn).includes("year") || normalizedName(dateColumn).includes("founded");

  rows.forEach((row) => {
    const date = parseDate(row[dateColumn]);
    if (!date) return;
    const label = groupByYear
      ? String(date.getFullYear())
      : date.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
    const value = metricColumn ? parseNumber(row[metricColumn]) ?? 0 : 1;
    grouped.set(label, (grouped.get(label) ?? 0) + value);
  });

  return [...grouped.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getQuarter(value: unknown) {
  const date = parseDate(value);
  if (!date) return null;
  return `Q${Math.floor(date.getMonth() / 3) + 1}`;
}

export function applyDashboardFilters(rows: DataRow[], profile: DatasetProfile, filters: Record<string, string>) {
  return rows.filter((row) => {
    return Object.entries(filters).every(([column, selected]) => {
      if (!selected || selected === "all") return true;
      const columnProfile = profile.columns.find((item) => item.name === column);
      if (columnProfile?.type === "date") {
        const date = parseDate(row[column]);
        if (!date) return false;
        if (/^\d{4}$/.test(selected)) return String(date.getFullYear()) === selected;
        return getQuarter(row[column]) === selected;
      }
      return String(row[column] ?? "Unknown") === selected;
    });
  });
}

function buildKpis(rows: DataRow[], profile: DatasetProfile): Kpi[] {
  const primaryMetric = findPrimaryMetric(profile);
  const profitColumn = findColumn(profile, profitPatterns, "number", false);
  const costColumn = findColumn(profile, costPatterns, "number", false);
  const categoryColumn = getCategoryColumns(profile)[0]?.name;

  const total = sumColumn(rows, primaryMetric);
  const explicitProfit = profitColumn ? sumColumn(rows, profitColumn) : null;
  const derivedProfit = explicitProfit ?? (costColumn && primaryMetric ? total - sumColumn(rows, costColumn) : total * 0.23);
  const margin = total ? (derivedProfit / total) * 100 : 0;
  const averageMetric = average(getNumbers(rows, primaryMetric));
  const topSegment = categoryColumn && primaryMetric ? groupByCategory(rows, categoryColumn, primaryMetric)[0] : undefined;
  const entityLabel = inferEntityLabel(profile);
  const financial = isFinancialMetric(primaryMetric);
  const canShowProfit = Boolean(profitColumn || costColumn || canEstimateProfit(primaryMetric));
  const primaryStats = profile.columns.find((column) => column.name === primaryMetric)?.numericStats;

  if (!primaryMetric) {
    const topCountSegment = categoryColumn ? groupByCategory(rows, categoryColumn)[0] : undefined;
    return [
      {
        label: `Total ${entityLabel}`,
        value: formatNumber(rows.length),
        change: "Dataset coverage",
        helper: "Total analyzed records",
        intent: "volume"
      },
      {
        label: topCountSegment ? `Top ${friendlyColumnName(categoryColumn)}` : "Available Fields",
        value: topCountSegment?.name ?? formatNumber(profile.columnCount),
        change: topCountSegment ? `${formatNumber(topCountSegment.value)} records` : "Profiled columns",
        helper: topCountSegment ? `Most frequent ${friendlyColumnName(categoryColumn).toLowerCase()}` : "Columns ready for analysis",
        intent: "segment"
      },
      {
        label: "Missing Data",
        value: formatPercent(profile.missingRate),
        change: profile.missingRate > 5 ? "Cleanup recommended" : "Healthy data quality",
        helper: `${formatNumber(profile.missingCells)} missing cells detected`,
        intent: "margin"
      }
    ];
  }

  const kpis: Kpi[] = [
    {
      label: `Total ${friendlyColumnName(primaryMetric)}`,
      value: financial ? formatCompactCurrency(total) : formatCompactNumber(total),
      change: total ? "Primary business metric" : "No value detected",
      helper: `Calculated from ${friendlyColumnName(primaryMetric)}`,
      intent: "revenue"
    },
    {
      label: `Average ${friendlyColumnName(primaryMetric)}`,
      value: financial ? formatCompactCurrency(averageMetric) : formatCompactNumber(averageMetric),
      change: "Typical record value",
      helper: `Mean ${friendlyColumnName(primaryMetric).toLowerCase()} across filtered data`,
      intent: "average"
    }
  ];

  if (canShowProfit && total > 0) {
    kpis.push(
      {
        label: profitColumn ? "Total Profit" : "Estimated Profit",
        value: formatCompactCurrency(derivedProfit),
        change: margin >= 20 ? "Healthy profitability" : "Margin watchlist",
        helper: profitColumn ? `Calculated from ${friendlyColumnName(profitColumn)}` : "Estimated from detected value metric",
        intent: "profit"
      },
      {
        label: "Estimated Margin",
        value: formatPercent(margin),
        change: margin >= 25 ? "Efficient performance" : "Optimization opportunity",
        helper: "Estimated profit divided by value metric",
        intent: "margin"
      }
    );
  } else if (topSegment) {
    kpis.push({
      label: `Top ${friendlyColumnName(categoryColumn)}`,
      value: topSegment.name,
      change: `${financial ? formatCompactCurrency(topSegment.value) : formatCompactNumber(topSegment.value)} contribution`,
      helper: `Largest segment by ${friendlyColumnName(primaryMetric).toLowerCase()}`,
      intent: "segment"
    });
  }

  if (kpis.length < 4 && primaryStats) {
    kpis.push({
      label: `${friendlyColumnName(primaryMetric)} Range`,
      value: `${formatCompactNumber(primaryStats.min)} - ${formatCompactNumber(primaryStats.max)}`,
      change: "Spread check",
      helper: "Useful for spotting pricing, funding, or value outliers",
      intent: "average"
    });
  }

  if (kpis.length < 4 && topSegment && !kpis.some((kpi) => kpi.label.includes(friendlyColumnName(categoryColumn)))) {
    kpis.push({
      label: `Top ${friendlyColumnName(categoryColumn)}`,
      value: topSegment.name,
      change: `${financial ? formatCompactCurrency(topSegment.value) : formatCompactNumber(topSegment.value)} contribution`,
      helper: `Largest segment by ${friendlyColumnName(primaryMetric).toLowerCase()}`,
      intent: "segment"
    });
  }

  return kpis.slice(0, 4);
}

function baseChartStyle() {
  return {
    color: chartPalette,
    textStyle: {
      color: "#381024",
      fontFamily: "Inter, sans-serif"
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "#fff8f8",
      borderColor: "rgba(75, 11, 37, 0.16)",
      textStyle: { color: "#381024" }
    },
    grid: {
      left: 8,
      right: 10,
      top: 18,
      bottom: 8,
      containLabel: true
    },
    xAxis: {
      axisLabel: {
        hideOverlap: true,
        formatter: (value: number | string) => (typeof value === "number" ? formatCompactNumber(value) : value)
      }
    },
    yAxis: {
      axisLabel: {
        hideOverlap: true,
        formatter: (value: number | string) => (typeof value === "number" ? formatCompactNumber(value) : value)
      }
    }
  };
}

function buildCharts(rows: DataRow[], profile: DatasetProfile): DashboardChart[] {
  const primaryMetric = findPrimaryMetric(profile);
  const profitColumn = findColumn(profile, profitPatterns, "number", false) ?? primaryMetric;
  const dateColumn = profile.columns.find((column) => column.type === "date")?.name;
  const categoryColumns = getCategoryColumns(profile);
  const categoryColumn = categoryColumns[0]?.name;
  const secondaryCategory = categoryColumns.find((column) => column.name !== categoryColumn)?.name;
  const numericColumn = primaryMetric;
  const metricLabel = numericColumn ? friendlyColumnName(numericColumn) : inferEntityLabel(profile);
  const charts: DashboardChart[] = [];

  if (dateColumn) {
    const series = groupByDate(rows, dateColumn, numericColumn);
    if (series.length > 1) charts.push({
      id: "trend",
      title: numericColumn ? `${metricLabel} Trend` : `${inferEntityLabel(profile)} Over Time`,
      description: numericColumn ? `How ${metricLabel.toLowerCase()} changes over time` : "Record volume by time period",
      option: {
        ...baseChartStyle(),
        xAxis: { type: "category", data: series.map((item) => item.name), boundaryGap: false },
        yAxis: { type: "value", axisLabel: { formatter: (value: number) => formatCompactNumber(value) } },
        series: [
          {
            name: numericColumn,
            type: "line",
            smooth: true,
            areaStyle: { opacity: 0.18 },
            lineStyle: { width: 3 },
            data: series.map((item) => Math.round(item.value))
          }
        ]
      }
    });
  }

  if (categoryColumn) {
    const topCategories = groupByCategory(rows, categoryColumn, numericColumn).slice(0, 7);
    charts.push({
      id: "category",
      title: `Top ${friendlyColumnName(categoryColumn)}`,
      description: numericColumn
        ? `${metricLabel} contribution by ${friendlyColumnName(categoryColumn).toLowerCase()}`
        : `${inferEntityLabel(profile)} count by ${friendlyColumnName(categoryColumn).toLowerCase()}`,
      option: {
        ...baseChartStyle(),
        xAxis: { type: "category", data: topCategories.map((item) => item.name), axisLabel: { interval: 0, rotate: topCategories.length > 4 ? 20 : 0 } },
        yAxis: { type: "value", axisLabel: { formatter: (value: number) => formatCompactNumber(value) } },
        series: [
          {
            name: numericColumn,
            type: "bar",
            barMaxWidth: 36,
            itemStyle: { borderRadius: [6, 6, 0, 0] },
            data: topCategories.map((item) => Math.round(item.value))
          }
        ]
      }
    });
  }

  // Use secondary category for the share/donut chart to avoid duplicate insights
  const donutCategory = categoryColumns[1]?.name;
  if (donutCategory) {
    const donutData = groupByCategory(rows, donutCategory, numericColumn).slice(0, 5);
    charts.push({
      id: "share",
      title: numericColumn ? `${metricLabel} Share` : `${friendlyColumnName(donutCategory)} Share`,
      description: numericColumn ? `Top ${friendlyColumnName(donutCategory).toLowerCase()} share` : "Share of records by segment",
      option: {
        ...baseChartStyle(),
        tooltip: { trigger: "item" },
        series: [
          {
            name: `${numericColumn} share`,
            type: "pie",
            radius: ["46%", "70%"],
            avoidLabelOverlap: true,
            label: { color: "#381024", formatter: "{b}" },
            data: donutData
          }
        ]
      }
    });
  }

  // Use tertiary category for the mix/horizontal bar chart
  const mixCategory = categoryColumns[2]?.name;
  if (mixCategory) {
    const values = groupByCategory(rows, mixCategory, numericColumn).slice(0, 6);
    charts.push({
      id: "secondary",
      title: `${friendlyColumnName(mixCategory)} Mix`,
      description: `Concentration by ${friendlyColumnName(mixCategory).toLowerCase()}`,
      option: {
        ...baseChartStyle(),
        xAxis: { type: "value", axisLabel: { formatter: (value: number) => formatCompactNumber(value) } },
        yAxis: { type: "category", data: values.map((item) => item.name) },
        series: [
          {
            name: numericColumn,
            type: "bar",
            barMaxWidth: 26,
            itemStyle: { borderRadius: [0, 6, 6, 0] },
            data: values.map((item) => Math.round(item.value))
          }
        ]
      }
    });
  }

  if (numericColumn && profitColumn && numericColumn !== profitColumn) {
    charts.push({
      id: "scatter",
      title: `${friendlyColumnName(numericColumn)} vs ${friendlyColumnName(profitColumn)}`,
      description: `Relationship between ${friendlyColumnName(numericColumn).toLowerCase()} and ${friendlyColumnName(profitColumn).toLowerCase()}`,
      option: {
        ...baseChartStyle(),
        xAxis: { type: "value", name: friendlyColumnName(numericColumn), axisLabel: { formatter: (value: number) => formatCompactNumber(value) } },
        yAxis: { type: "value", name: friendlyColumnName(profitColumn), axisLabel: { formatter: (value: number) => formatCompactNumber(value) } },
        series: [
          {
            type: "scatter",
            symbolSize: 11,
            data: rows
              .map((row) => [parseNumber(row[numericColumn]) ?? 0, parseNumber(row[profitColumn]) ?? 0])
              .filter(([x, y]) => x > 0 && y > 0)
          }
        ]
      }
    });
  }

  return charts.slice(0, 4);
}

function buildInsights(rows: DataRow[], profile: DatasetProfile): BusinessInsight[] {
  const revenueColumn = findPrimaryMetric(profile);
  const dateColumn = profile.columns.find((column) => column.type === "date")?.name;
  const categoryColumns = getCategoryColumns(profile);
  const categoryColumn = categoryColumns[0]?.name;
  const secondaryCategory = categoryColumns[1]?.name;
  const metricColumn = revenueColumn;
  const metricLabel = metricColumn ? friendlyColumnName(metricColumn) : inferEntityLabel(profile);

  const insights: BusinessInsight[] = [];

  if (dateColumn) {
    const quarterly = new Map<string, number>();
    rows.forEach((row) => {
      const quarter = getQuarter(row[dateColumn]);
      if (!quarter) return;
      quarterly.set(quarter, (quarterly.get(quarter) ?? 0) + (metricColumn ? parseNumber(row[metricColumn]) ?? 0 : 1));
    });
    const ordered = ["Q1", "Q2", "Q3", "Q4"].map((quarter) => ({
      quarter,
      value: quarterly.get(quarter) ?? 0
    }));
    const best = [...ordered].sort((a, b) => b.value - a.value)[0];
    const weakest = [...ordered].sort((a, b) => a.value - b.value)[0];

    if (best && weakest && best.value > 0) {
      insights.push({
        title: `${best.quarter} delivered the strongest ${metricLabel.toLowerCase()} signal`,
        description: `${best.quarter} recorded ${metricColumn && isFinancialMetric(metricColumn) ? formatCompactCurrency(best.value) : formatCompactNumber(best.value)} while ${weakest.quarter} closed at ${metricColumn && isFinancialMetric(metricColumn) ? formatCompactCurrency(weakest.value) : formatCompactNumber(weakest.value)}. This suggests the business should inspect seasonality, campaigns, or operational changes around ${best.quarter}.`,
        evidence: `${formatPercent(((best.value - weakest.value) / best.value) * 100)} gap between strongest and weakest quarter`,
        tone: "positive"
      });
    }
  }

  if (categoryColumn) {
    const categories = groupByCategory(rows, categoryColumn, metricColumn);
    const leader = categories[0];
    const runnerUp = categories[1];
    if (leader) {
      insights.push({
        title: `${leader.name} leads ${friendlyColumnName(categoryColumn).toLowerCase()} performance`,
        description: runnerUp
          ? `${leader.name} contributes ${metricColumn && isFinancialMetric(metricColumn) ? formatCompactCurrency(leader.value) : formatCompactNumber(leader.value)}, ahead of ${runnerUp.name}. This segment deserves priority attention before scaling weaker segments.`
          : `${leader.name} dominates the current data sample.`,
        evidence: `${leader.name} ranks number one by ${metricLabel}`,
        tone: "positive"
      });
    }
  }

  if (categoryColumn && metricColumn) {
    const categories = groupByCategory(rows, categoryColumn, metricColumn);
    const total = categories.reduce((sum, item) => sum + item.value, 0);
    const leader = categories[0];
    if (leader && total > 0) {
      const share = (leader.value / total) * 100;
      insights.push({
        title: `${friendlyColumnName(categoryColumn)} concentration is ${share > 45 ? "high" : "balanced"}`,
        description: `${leader.name} owns ${formatPercent(share)} of ${metricLabel.toLowerCase()}. ${share > 45 ? "The dashboard indicates concentration risk if this segment slows down." : "The contribution is spread across segments, which can reduce dependency risk."}`,
        evidence: `${formatPercent(share)} share from the top segment`,
        tone: share > 45 ? "warning" : "neutral"
      });
    }
  }

  if (secondaryCategory) {
    const values = groupByCategory(rows, secondaryCategory, metricColumn);
    const leader = values[0];
    if (leader) {
      insights.push({
        title: `${friendlyColumnName(secondaryCategory)} is a useful decision filter`,
        description: `${leader.name} is the leading ${friendlyColumnName(secondaryCategory).toLowerCase()} group. Use this slicer to compare whether the pattern holds across other segments.`,
        evidence: `${leader.name} leads this breakdown`,
        tone: "neutral"
      });
    }
  }

  const missingHeavy = profile.columns
    .filter((column) => column.missingRate > 10)
    .sort((a, b) => b.missingRate - a.missingRate)[0];

  if (missingHeavy) {
    insights.push({
      title: `${missingHeavy.name} needs data quality cleanup`,
      description: `${missingHeavy.name} has ${formatPercent(missingHeavy.missingRate)} missing values. This can reduce confidence in filters, segment analysis, and model-generated explanations.`,
      evidence: `${missingHeavy.missingCount} blank cells found`,
      tone: "warning"
    });
  }

  const numericColumns = profile.columns.filter((column) => column.type === "number" && column.numericStats);
  const volatile = numericColumns
    .map((column) => ({
      column,
      spread: column.numericStats ? column.numericStats.max - column.numericStats.min : 0
    }))
    .sort((a, b) => b.spread - a.spread)[0];

  if (volatile?.column.numericStats) {
    insights.push({
      title: `${volatile.column.name} has the widest operating range`,
      description: `The range runs from ${formatCompactNumber(volatile.column.numericStats.min)} to ${formatCompactNumber(volatile.column.numericStats.max)}. The business should inspect outliers before taking pricing, inventory, risk, or budget decisions.`,
      evidence: `${formatNumber(volatile.spread)} point spread`,
      tone: "neutral"
    });
  }

  if (profile.missingRate <= 3) {
    insights.push({
      title: "Data quality is presentation-ready",
      description: `Only ${formatPercent(profile.missingRate)} of cells are missing, so the dashboard is reliable enough for a first business review. Keep validating important columns before final decisions.`,
      evidence: `${formatNumber(profile.missingCells)} missing cells across ${formatNumber(profile.rowCount)} rows`,
      tone: "positive"
    });
  }

  return insights.slice(0, 6);
}

function buildStats(rows: DataRow[], profile: DatasetProfile): StatisticalRow[] {
  return profile.columns.map((column): StatisticalRow => {
    const values = rows.map((row) => row[column.name]).filter((value) => !isMissing(value));
    if (column.type === "number" && column.numericStats) {
      const variance = Math.pow(column.numericStats.stdDev, 2);
      return {
        column: friendlyColumnName(column.name),
        type: column.type,
        count: formatNumber(column.numericStats.count),
        mean: formatCompactNumber(column.numericStats.mean),
        median: formatCompactNumber(column.numericStats.median),
        mode: modeValue(values),
        stdDev: formatCompactNumber(column.numericStats.stdDev),
        variance: formatCompactNumber(variance),
        min: formatCompactNumber(column.numericStats.min),
        max: formatCompactNumber(column.numericStats.max),
        summary: `Range ${formatCompactNumber(column.numericStats.min)} to ${formatCompactNumber(column.numericStats.max)}`,
        missing: `${column.missingCount} (${formatPercent(column.missingRate)})`,
        unique: column.uniqueCount
      };
    }

    return {
      column: friendlyColumnName(column.name),
      type: column.type,
      count: formatNumber(profile.rowCount - column.missingCount),
      mode: modeValue(values),
      summary: column.sampleValues.length ? `Top values: ${column.sampleValues.join(", ")}` : "No populated values",
      missing: `${column.missingCount} (${formatPercent(column.missingRate)})`,
      unique: column.uniqueCount
    };
  });
}

export function buildDashboardData(rows: DataRow[], profile: DatasetProfile): DashboardData {
  const workingProfile = buildDatasetProfile(rows, profile.fileName, profile.fileSize);
  const metricColumn = findPrimaryMetric(workingProfile);
  const dateColumn = workingProfile.columns.find((column) => column.type === "date")?.name;
  const categoryColumn = workingProfile.columns.find((column) => column.type === "category" && column.uniqueCount > 1)?.name;
  return {
    title: dashboardTitle(workingProfile, metricColumn),
    subtitle: dashboardSubtitle(workingProfile, metricColumn, categoryColumn, dateColumn),
    kpis: buildKpis(rows, workingProfile),
    charts: buildCharts(rows, workingProfile),
    insights: buildInsights(rows, workingProfile),
    stats: buildStats(rows, workingProfile)
  };
}

export function getFilterColumns(profile: DatasetProfile) {
  const dateColumns = profile.columns.filter((column) => column.type === "date").slice(0, 1);
  const categoryColumns = getCategoryColumns(profile).slice(0, 4);
  return [...dateColumns, ...categoryColumns].slice(0, 4);
}
