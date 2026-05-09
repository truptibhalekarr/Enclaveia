import type { DataRow } from "@/lib/types";

type DataPreviewTableProps = {
  rows: DataRow[];
  columns: string[];
};

export function DataPreviewTable({ rows, columns }: DataPreviewTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-wine-700/12 bg-cream">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-wine-500 text-white">
            <tr>
              {columns.map((column) => (
                <th key={column} className="whitespace-nowrap px-4 py-3 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 8).map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-wine-700/8 last:border-0">
                {columns.map((column) => (
                  <td key={column} className="max-w-[220px] truncate px-4 py-3 text-wine-700/82">
                    {row[column] === null || row[column] === "" ? "Missing" : String(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
