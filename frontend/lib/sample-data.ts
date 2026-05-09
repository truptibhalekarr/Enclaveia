import type { DataRow } from "@/lib/types";

const months = [
  "2025-01-01",
  "2025-02-01",
  "2025-03-01",
  "2025-04-01",
  "2025-05-01",
  "2025-06-01",
  "2025-07-01",
  "2025-08-01",
  "2025-09-01",
  "2025-10-01",
  "2025-11-01",
  "2025-12-01"
];

const regions = ["North", "South", "West", "East"];
const categories = ["Subscription", "Services", "Enterprise", "Training"];
const baseRevenue = [42000, 47000, 53000, 51000, 58000, 64000, 62000, 59000, 56000, 69000, 76000, 84000];

export const sampleRows: DataRow[] = months.flatMap((month, monthIndex) =>
  regions.map((region, regionIndex) => {
    const category = categories[(monthIndex + regionIndex) % categories.length];
    const revenue = baseRevenue[monthIndex] + regionIndex * 7600 + (monthIndex % 3) * 4200;
    const profitRate = 0.19 + regionIndex * 0.018 + (monthIndex > 8 ? 0.025 : 0);
    const orders = Math.round(revenue / (620 + regionIndex * 48));

    return {
      Month: month,
      Region: region,
      Category: category,
      Revenue: revenue,
      Profit: Math.round(revenue * profitRate),
      Orders: orders,
      Customers: Math.round(orders * (0.72 + regionIndex * 0.04))
    };
  })
);
