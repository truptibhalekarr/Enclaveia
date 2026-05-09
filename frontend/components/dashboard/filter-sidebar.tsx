"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { friendlyColumnName, getFilterColumns } from "@/lib/data-utils";
import type { DataRow, DatasetProfile } from "@/lib/types";

type FilterSidebarProps = {
  profile: DatasetProfile;
  rows: DataRow[];
  filters: Record<string, string>;
  onChange: (filters: Record<string, string>) => void;
};

function uniqueValues(rows: DataRow[], column: string) {
  return [...new Set(rows.map((row) => String(row[column] ?? "Unknown")))]
    .filter(Boolean)
    .slice(0, 24);
}

function dateValues(rows: DataRow[], column: string) {
  const years = [
    ...new Set(
      rows
        .map((row) => new Date(String(row[column] ?? "")).getFullYear())
        .filter((year) => Number.isFinite(year))
        .map(String)
    )
  ].sort();

  return years.length > 1 && years.length <= 20 ? years : ["Q1", "Q2", "Q3", "Q4"];
}

export function FilterSidebar({ profile, rows, filters, onChange }: FilterSidebarProps) {
  const filterColumns = getFilterColumns(profile);

  function update(column: string, value: string) {
    onChange({ ...filters, [column]: value });
  }

  return (
    <aside className="no-print lg:sticky lg:top-24 lg:self-start">
      <Card>
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="h-5 w-5 text-wine-500" aria-hidden />
            <CardTitle className="text-2xl">Slicers</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 p-4 pt-1">
          {filterColumns.map((column) => {
            const options = column.type === "date" ? dateValues(rows, column.name) : uniqueValues(rows, column.name);
            return (
              <label key={column.name} className="grid gap-2">
                <span className="truncate text-xs font-semibold text-ink">{friendlyColumnName(column.name)}</span>
                <select
                  value={filters[column.name] ?? "all"}
                  onChange={(event) => update(column.name, event.target.value)}
                  className="focus-ring h-10 rounded-md border border-wine-700/16 bg-cream px-3 text-sm text-ink"
                >
                  <option value="all">All</option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            );
          })}

          <Button type="button" variant="secondary" onClick={() => onChange({})}>
            Reset Filters
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}
