"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UploadedDataset } from "@/lib/types";

type DatasetStore = {
  dataset: UploadedDataset | null;
  setDataset: (dataset: UploadedDataset) => void;
  clearDataset: () => void;
};

export const useDatasetStore = create<DatasetStore>()(
  persist(
    (set) => ({
      dataset: null,
      setDataset: (dataset) => set({ dataset }),
      clearDataset: () => set({ dataset: null })
    }),
    {
      name: "insight-iq-dataset"
    }
  )
);
