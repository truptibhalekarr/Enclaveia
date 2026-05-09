export type CellValue = string | number | null;

export type DataRow = Record<string, CellValue>;

export type ColumnType = "number" | "date" | "category" | "text";

export type NumericStats = {
  count: number;
  sum: number;
  mean: number;
  median: number;
  min: number;
  max: number;
  stdDev: number;
};

export type ColumnProfile = {
  name: string;
  type: ColumnType;
  missingCount: number;
  missingRate: number;
  uniqueCount: number;
  sampleValues: string[];
  numericStats?: NumericStats;
};

export type DatasetProfile = {
  fileName: string;
  fileSize: number;
  rowCount: number;
  columnCount: number;
  missingCells: number;
  missingRate: number;
  columns: ColumnProfile[];
};

export type UploadedDataset = {
  fileName: string;
  fileSize: number;
  rows: DataRow[];
  columns: string[];
  profile: DatasetProfile;
};

export type Kpi = {
  label: string;
  value: string;
  change: string;
  helper: string;
  intent: "revenue" | "profit" | "margin" | "volume" | "average" | "segment";
};

export type DashboardChart = {
  id: string;
  title: string;
  description: string;
  option: Record<string, unknown>;
};

export type BusinessInsight = {
  title: string;
  description: string;
  evidence: string;
  tone: "positive" | "warning" | "neutral";
};

export type StatisticalRow = {
  column: string;
  type: ColumnType;
  count: string;
  mean?: string;
  median?: string;
  mode?: string;
  stdDev?: string;
  variance?: string;
  min?: string;
  max?: string;
  summary: string;
  missing: string;
  unique: number;
};

export type DashboardData = {
  title: string;
  subtitle: string;
  kpis: Kpi[];
  charts: DashboardChart[];
  insights: BusinessInsight[];
  stats: StatisticalRow[];
};
