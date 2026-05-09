import { BadgeCheck, DollarSign, Gauge, PieChart, ShoppingCart, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Kpi } from "@/lib/types";

type KpiCardProps = {
  kpi: Kpi;
};

const icons = {
  revenue: DollarSign,
  profit: TrendingUp,
  margin: PieChart,
  volume: ShoppingCart,
  average: Gauge,
  segment: BadgeCheck
};

export function KpiCard({ kpi }: KpiCardProps) {
  const Icon = icons[kpi.intent];

  return (
    <Card className="overflow-hidden">
      <CardContent className="relative min-h-[118px] p-4 pr-14">
        <div className="grid min-w-0 gap-2">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-wine-700/68">{kpi.label}</p>
            <p
              className="mt-1 max-w-full truncate font-display text-[clamp(1.45rem,1.8vw,2rem)] font-bold leading-tight text-ink"
              title={kpi.value}
            >
              {kpi.value}
            </p>
          </div>
          <p className="line-clamp-1 text-xs font-semibold text-sage">{kpi.change}</p>
          <p className="line-clamp-2 text-[11px] leading-4 text-wine-700/64">{kpi.helper}</p>
        </div>
        <span className="absolute right-4 top-4 grid h-9 w-9 shrink-0 place-items-center rounded-md bg-wine-500 text-white shadow-[0_0_22px_rgba(122,23,57,0.28)]">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </CardContent>
    </Card>
  );
}
