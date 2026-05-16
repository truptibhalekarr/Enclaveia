"use client";

import { useMemo, useState } from "react";
import { Download, Share2, Sparkles, TableProperties, Loader2 } from "lucide-react";
import { ChartCard } from "@/components/dashboard/chart-card";
import { FilterSidebar } from "@/components/dashboard/filter-sidebar";
import { InsightsPanel } from "@/components/dashboard/insights-panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { StatisticalSummary } from "@/components/dashboard/statistical-summary";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { applyDashboardFilters, buildDashboardData, buildDatasetProfile } from "@/lib/data-utils";
import { sampleRows } from "@/lib/sample-data";
import { useDatasetStore } from "@/store/use-dataset-store";
import type { BusinessInsight } from "@/lib/types";

type Panel = "none" | "insights" | "stats";

export function DashboardClient() {
  const uploaded = useDatasetStore((state) => state.dataset);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [panel, setPanel] = useState<Panel>("none");
  const [shareText, setShareText] = useState("Share");
  const [aiInsights, setAiInsights] = useState<BusinessInsight[] | null>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  const activeDataset = useMemo(() => {
    if (uploaded) return uploaded;
    const profile = buildDatasetProfile(sampleRows, "Demo business dataset", 126000);
    return {
      fileName: "Demo business dataset",
      fileSize: 126000,
      rows: sampleRows,
      columns: Object.keys(sampleRows[0] ?? {}),
      profile
    };
  }, [uploaded]);

  const filteredRows = useMemo(
    () => applyDashboardFilters(activeDataset.rows, activeDataset.profile, filters),
    [activeDataset, filters]
  );

  const filteredProfile = useMemo(
    () => buildDatasetProfile(filteredRows, activeDataset.fileName, activeDataset.fileSize),
    [filteredRows, activeDataset.fileName, activeDataset.fileSize]
  );

  const dashboard = useMemo(() => buildDashboardData(filteredRows, filteredProfile), [filteredRows, filteredProfile]);

  async function shareDashboard() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(window.location.href);
      } else {
        // Fallback for non-secure contexts (like some localhosts)
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
        document.body.prepend(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
        } catch (error) {
          console.error("Fallback copy failed", error);
        } finally {
          textArea.remove();
        }
      }
      setShareText("Copied!");
      window.setTimeout(() => setShareText("Share"), 2000);
    } catch (error) {
      console.error("Clipboard write failed", error);
      setShareText("Copy failed");
      window.setTimeout(() => setShareText("Share"), 2000);
    }
  }

  async function generateAiInsights() {
    if (panel === "insights") {
      setPanel("none");
      return;
    }
    setPanel("insights");

    if (aiInsights) return; // Already generated

    setIsGeneratingInsights(true);
    try {
      const header = activeDataset.columns.join(",");
      const csvRows = filteredRows.map((row) =>
        activeDataset.columns
          .map((col) => {
            const val = row[col];
            if (val === null || val === undefined) return "";
            return `"${String(val).replace(/"/g, '""')}"`;
          })
          .join(",")
      );
      const csvContent = [header, ...csvRows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const formData = new FormData();
      formData.append("file", blob, "dataset.csv");

      const res = await fetch("http://localhost:8000/api/insights", {
        method: "POST",
        body: formData
      });
      const data = await res.json();

      if (data.insights && Array.isArray(data.insights)) {
        const mappedInsights: BusinessInsight[] = data.insights.map((item: any) => ({
          title: item.title,
          description: item.body,
          evidence: "AI Generated",
          tone: "neutral"
        }));
        if (data.conclusion) {
          mappedInsights.push({
            title: "Executive Conclusion",
            description: data.conclusion,
            evidence: "Strategic Recommendation",
            tone: "positive"
          });
        }
        setAiInsights(mappedInsights);
      } else {
        setAiInsights(dashboard.insights);
      }
    } catch (err) {
      console.error("AI Insights Error:", err);
      setAiInsights(dashboard.insights);
    } finally {
      setIsGeneratingInsights(false);
    }
  }

  return (
    <section className="px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <Badge className="mb-4">AI Generated</Badge>
            <h1 className="font-display text-4xl font-bold leading-tight text-ink lg:text-5xl">{dashboard.title}</h1>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-wine-700/78">
              {dashboard.subtitle}
            </p>
          </div>

          <div className="no-print flex gap-3">
            <Button type="button" variant="secondary" onClick={() => window.print()}>
              <Download className="h-4 w-4" aria-hidden />
              Export
            </Button>
            <Button type="button" variant="outline" onClick={shareDashboard}>
              <Share2 className="h-4 w-4" aria-hidden />
              {shareText}
            </Button>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[230px_minmax(0,1fr)]">
          <FilterSidebar profile={activeDataset.profile} rows={activeDataset.rows} filters={filters} onChange={setFilters} />

          <div className="grid min-w-0 gap-5">
            <div className={`grid min-w-0 gap-4 md:grid-cols-2 ${dashboard.kpis.length <= 3 ? "xl:grid-cols-3" : "xl:grid-cols-4"}`}>
              {dashboard.kpis.map((kpi) => (
                <KpiCard key={kpi.label} kpi={kpi} />
              ))}
            </div>

            <div className={`grid min-w-0 gap-4 ${dashboard.charts.length <= 3 ? "xl:grid-cols-3" : "xl:grid-cols-4"}`}>
              {dashboard.charts.map((chart) => (
                <ChartCard key={chart.id} chart={chart} height={175} />
              ))}
            </div>

            <div className="no-print flex flex-col gap-3 border-t border-wine-700/12 pt-4 sm:flex-row">
              <Button type="button" onClick={generateAiInsights}>
                <Sparkles className="h-4 w-4" aria-hidden />
                Generate Insights
              </Button>
              <Button type="button" variant="secondary" onClick={() => setPanel(panel === "stats" ? "none" : "stats")}>
                <TableProperties className="h-4 w-4" aria-hidden />
                Statistical Summary
              </Button>
            </div>

            {panel === "insights" ? (
              <div>
                <h2 className="mb-4 font-display text-4xl font-bold text-ink">Business Insights</h2>
                {isGeneratingInsights ? (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-wine-700/12 bg-white/40 p-12 text-wine-600 backdrop-blur-md">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p className="mt-4 font-medium">Gemma is analyzing your data...</p>
                  </div>
                ) : (
                  <InsightsPanel insights={aiInsights || dashboard.insights} />
                )}
              </div>
            ) : null}

            {panel === "stats" ? (
              <div>
                <h2 className="mb-4 font-display text-4xl font-bold text-ink">Statistical Summary</h2>
                <StatisticalSummary stats={dashboard.stats} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
