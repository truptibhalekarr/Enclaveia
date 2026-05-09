"use client";

import { buildDatasetProfile, normalizeRows } from "@/lib/data-utils";
import type { UploadedDataset } from "@/lib/types";

function parseCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  cells.push(current);
  return cells;
}

function parseCsv(text: string) {
  const lines = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .filter((line) => line.trim().length > 0);

  if (!lines.length) {
    throw new Error("Uploaded CSV is empty.");
  }

  const headers = parseCsvLine(lines[0]);
  const rows = lines.slice(1).map(parseCsvLine);
  return { headers, rows };
}

export async function parseDatasetFile(file: File): Promise<UploadedDataset> {
  const extension = file.name.split(".").pop()?.toLowerCase();
  let headers: string[] = [];
  let rawRows: unknown[][] = [];

  if (extension === "csv") {
    const text = await file.text();
    const parsed = parseCsv(text);
    headers = parsed.headers;
    rawRows = parsed.rows;
  } else if (extension === "xlsx" || extension === "xls") {
    const XLSX = await import("xlsx");
    const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const sheetRows = XLSX.utils.sheet_to_json<unknown[]>(firstSheet, { header: 1, raw: false });

    if (!sheetRows.length) {
      throw new Error("Uploaded Excel file is empty.");
    }

    headers = sheetRows[0].map((cell) => String(cell));
    rawRows = sheetRows.slice(1);
  } else {
    throw new Error("Please upload a CSV, XLS, or XLSX dataset.");
  }

  const rows = normalizeRows(headers, rawRows).slice(0, 5000);
  const columns = Object.keys(rows[0] ?? {});
  const profile = buildDatasetProfile(rows, file.name, file.size);

  return {
    fileName: file.name,
    fileSize: file.size,
    rows,
    columns,
    profile
  };
}
