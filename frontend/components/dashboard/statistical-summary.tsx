import type { StatisticalRow } from "@/lib/types";

type StatisticalSummaryProps = {
  stats: StatisticalRow[];
};

export function StatisticalSummary({ stats }: StatisticalSummaryProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-wine-700/12 bg-cream">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-wine-500 text-white">
            <tr>
              <th className="px-4 py-3">Column</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Count</th>
              <th className="px-4 py-3">Mean</th>
              <th className="px-4 py-3">Median</th>
              <th className="px-4 py-3">Mode</th>
              <th className="px-4 py-3">Std Dev</th>
              <th className="px-4 py-3">Variance</th>
              <th className="px-4 py-3">Min</th>
              <th className="px-4 py-3">Max</th>
              <th className="px-4 py-3">Missing</th>
              <th className="px-4 py-3">Unique</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((row) => (
              <tr key={row.column} className="border-b border-wine-700/8 last:border-0">
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-ink">{row.column}</td>
                <td className="px-4 py-3 capitalize text-wine-700/76">{row.type}</td>
                <td className="whitespace-nowrap px-4 py-3 text-wine-700/76">{row.count}</td>
                <td className="whitespace-nowrap px-4 py-3 text-wine-700/76">{row.mean ?? "-"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-wine-700/76">{row.median ?? "-"}</td>
                <td className="max-w-[180px] truncate px-4 py-3 text-wine-700/76" title={row.mode}>{row.mode ?? "-"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-wine-700/76">{row.stdDev ?? "-"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-wine-700/76">{row.variance ?? "-"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-wine-700/76">{row.min ?? "-"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-wine-700/76">{row.max ?? "-"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-wine-700/76">{row.missing}</td>
                <td className="px-4 py-3 text-wine-700/76">{row.unique}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
