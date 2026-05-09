import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { BusinessInsight } from "@/lib/types";

type InsightsPanelProps = {
  insights: BusinessInsight[];
};

const iconMap = {
  positive: CheckCircle2,
  warning: AlertTriangle,
  neutral: Info
};

export function InsightsPanel({ insights }: InsightsPanelProps) {
  return (
    <section className="grid gap-4">
      {insights.map((insight) => {
        const Icon = iconMap[insight.tone];
        return (
          <Card key={insight.title}>
            <CardContent className="grid gap-3 p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-wine-500 text-white">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-2xl font-bold text-ink">{insight.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-wine-700/78">{insight.description}</p>
                </div>
              </div>
              <p className="rounded-md bg-blush-50 px-4 py-3 text-sm font-semibold text-wine-700">{insight.evidence}</p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
