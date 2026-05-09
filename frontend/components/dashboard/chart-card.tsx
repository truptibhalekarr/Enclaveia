"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { DashboardChart } from "@/lib/types";

const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
  loading: () => <div className="grid h-[300px] place-items-center text-sm text-wine-700/66">Loading chart...</div>
});

type ChartCardProps = {
  chart: DashboardChart;
  height?: number;
};

export function ChartCard({ chart, height = 220 }: ChartCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-1">
        <CardTitle className="text-xl">{chart.title}</CardTitle>
        <CardDescription>{chart.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <ReactECharts option={chart.option} style={{ height, width: "100%" }} notMerge lazyUpdate />
      </CardContent>
    </Card>
  );
}
