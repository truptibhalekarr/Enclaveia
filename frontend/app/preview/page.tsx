"use client";

import Link from "next/link";
import { ArrowRight, Database, FileText, Table2, TriangleAlert } from "lucide-react";
import { DataPreviewTable } from "@/components/upload/data-preview-table";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatFileSize, formatPercent } from "@/lib/data-utils";
import { useDatasetStore } from "@/store/use-dataset-store";

export default function PreviewPage() {
  const dataset = useDatasetStore((state) => state.dataset);

  if (!dataset) {
    return (
      <main className="min-h-screen">
        <SiteHeader />
        <section className="px-5 py-20 text-center sm:px-8">
          <h1 className="font-display text-5xl font-bold text-ink">No dataset uploaded yet</h1>
          <p className="mx-auto mt-4 max-w-xl text-wine-700/78">
            Upload a CSV or Excel file first, then Enclaveia will show the preview and validation summary.
          </p>
          <Button asChild className="mt-8">
            <Link href="/upload">Upload Dataset</Link>
          </Button>
        </section>
      </main>
    );
  }

  const missingColumns = dataset.profile.columns.filter((column) => column.missingCount > 0);

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase text-wine-500">Data Preview</p>
              <h1 className="mt-3 font-display text-5xl font-bold text-ink">{dataset.fileName}</h1>
              <p className="mt-3 text-wine-700/78">
                Profile summary before generating the AI dashboard.
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/dashboard">
                Generate Dashboard
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
            </Button>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-4 p-5">
                <Table2 className="h-8 w-8 text-wine-500" aria-hidden />
                <div>
                  <p className="text-sm text-wine-700/64">Rows</p>
                  <p className="font-display text-3xl font-bold text-ink">{dataset.profile.rowCount}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-5">
                <Database className="h-8 w-8 text-wine-500" aria-hidden />
                <div>
                  <p className="text-sm text-wine-700/64">Columns</p>
                  <p className="font-display text-3xl font-bold text-ink">{dataset.profile.columnCount}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-5">
                <FileText className="h-8 w-8 text-wine-500" aria-hidden />
                <div>
                  <p className="text-sm text-wine-700/64">File Size</p>
                  <p className="font-display text-3xl font-bold text-ink">{formatFileSize(dataset.profile.fileSize)}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-5">
                <TriangleAlert className="h-8 w-8 text-wine-500" aria-hidden />
                <div>
                  <p className="text-sm text-wine-700/64">Missing Values</p>
                  <p className="font-display text-3xl font-bold text-ink">{dataset.profile.missingCells}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid min-w-0 gap-8 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="min-w-0">
              <h2 className="mb-4 font-display text-3xl font-bold text-ink">Data Table Preview</h2>
              <DataPreviewTable rows={dataset.rows} columns={dataset.columns} />
            </div>
            <div className="min-w-0">
              <h2 className="mb-4 font-display text-3xl font-bold text-ink">Missing Value Check</h2>
              <Card>
                <CardContent className="p-5">
                  <div className="mb-5 rounded-md bg-blush-50 p-4">
                    <p className="text-sm text-wine-700/68">Overall missing rate</p>
                    <p className="font-display text-4xl font-bold text-wine-700">
                      {formatPercent(dataset.profile.missingRate)}
                    </p>
                  </div>
                  <div className="grid gap-3">
                    {missingColumns.length ? (
                      missingColumns.slice(0, 7).map((column) => (
                        <div key={column.name} className="flex items-center justify-between border-b border-wine-700/10 pb-3 text-sm last:border-0">
                          <span className="font-semibold text-ink">{column.name}</span>
                          <span className="text-wine-700/74">
                            {column.missingCount} missing ({formatPercent(column.missingRate)})
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm leading-6 text-wine-700/76">
                        No missing values detected. This dataset is ready for dashboard generation.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            <Button asChild size="lg">
              <Link href="/dashboard">
                Generate Dashboard
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
