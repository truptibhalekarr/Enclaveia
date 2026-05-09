"use client";

import { ChangeEvent, DragEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { FileSpreadsheet, Loader2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseDatasetFile } from "@/lib/file-parser";
import { useDatasetStore } from "@/store/use-dataset-store";

export function Dropzone() {
  const router = useRouter();
  const setDataset = useDatasetStore((state) => state.setDataset);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file?: File) {
    if (!file) return;
    setError("");
    setIsLoading(true);

    try {
      const dataset = await parseDatasetFile(file);
      setDataset(dataset);
      router.push("/preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not parse dataset.");
    } finally {
      setIsLoading(false);
    }
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    void handleFile(event.dataTransfer.files[0]);
  }

  function onInput(event: ChangeEvent<HTMLInputElement>) {
    void handleFile(event.target.files?.[0]);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <label
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`focus-ring flex min-h-[360px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition ${
          isDragging ? "border-wine-500 bg-blush-50" : "border-wine-700/22 bg-cream/70 hover:bg-blush-50"
        }`}
      >
        <input className="sr-only" type="file" accept=".csv,.xlsx,.xls" onChange={onInput} />
        <div className="grid h-20 w-20 place-items-center rounded-md bg-wine-500 text-white">
          {isLoading ? <Loader2 className="h-9 w-9 animate-spin" aria-hidden /> : <UploadCloud className="h-9 w-9" aria-hidden />}
        </div>
        <h2 className="mt-7 font-display text-4xl font-bold text-ink">Upload your dataset</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-wine-700/76">
          Drag and drop a CSV, XLS, or XLSX file. Enclaveia will profile rows, columns, file size, missing values, and preview records before dashboard generation.
        </p>
        <Button type="button" className="mt-7" disabled={isLoading}>
          <FileSpreadsheet className="h-4 w-4" aria-hidden />
          Choose File
        </Button>
      </label>

      {error ? (
        <p className="mt-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}
    </div>
  );
}
