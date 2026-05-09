import { Database, Lightbulb, ShieldCheck, Zap } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const principles = [
  {
    icon: Database,
    title: "Structured Data First",
    text: "CSV and Excel files are checked for rows, columns, missing values, data types, dates, categories, and numeric metrics before a dashboard is generated."
  },
  {
    icon: Lightbulb,
    title: "Decision Intelligence",
    text: "Every KPI, chart, and insight is selected to answer a business question, not just to make the page look busy."
  },
  {
    icon: Zap,
    title: "Guided Dashboard Creation",
    text: "Users move through a simple flow: upload data, review quality, generate the dashboard, then open insights and statistical summaries."
  },
  {
    icon: ShieldCheck,
    title: "Local Gemma Intelligence",
    text: "Gemma runs through Ollama for privacy-friendly insight generation, reducing the risk of sensitive company data leaving the user's environment."
  }
];

export default function AboutPage() {
  return (
    <main>
      <SiteHeader />
      <section className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase text-wine-500">About Enclaveia</p>
          <h1 className="mt-4 font-display text-6xl font-bold leading-tight text-ink">
            Your AI data analyst for business-ready dashboards.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-wine-700/78">
            Enclaveia helps users move from raw spreadsheets to clear decisions. It profiles uploaded datasets, detects useful KPIs, maps meaningful charts, and explains what matters in plain business language.
          </p>
        </div>
      </section>

      <section className="bg-cream px-5 py-16 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
          {principles.map((principle) => (
            <Card key={principle.title}>
              <CardHeader>
                <principle.icon className="h-8 w-8 text-wine-500" aria-hidden />
                <CardTitle>{principle.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-wine-700/74">{principle.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
