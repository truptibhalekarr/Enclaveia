"use client";
import Link from "next/link";
import { ArrowRight, BarChart3, BrainCircuit, FileUp, Filter, LayoutDashboard, LineChart, ShieldCheck, Sparkles } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SectionHeading } from "@/components/section-heading";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const features = [
  {
    icon: BarChart3,
    title: "Smart KPI Detection",
    text: "Finds the most relevant value, volume, margin, and trend metrics from your dataset."
  },
  {
    icon: BrainCircuit,
    title: "AI Business Insights",
    text: "Explains patterns in plain business language so the dashboard tells a story."
  },
  {
    icon: Filter,
    title: "Interactive Filters",
    text: "Creates slicers from useful fields such as date, region, category, status, or segment."
  },
  {
    icon: ShieldCheck,
    title: "Local Gemma Intelligence",
    text: "Uses Gemma through Ollama for privacy-friendly insight generation, keeping sensitive data closer to your system."
  }
];

const steps = [
  "Upload a CSV or Excel dataset",
  "Review rows, columns, file size, and missing values",
  "Generate a presentation-ready dashboard with KPIs, charts, filters, insights, and statistics"
];

export default function LandingPage() {
  return (
    <main>
      <SiteHeader />

      {/* ── DEMO MODE BANNER ── */}
      <div className="relative z-50 w-full bg-amber-950/90 backdrop-blur-sm border-b border-amber-800/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-3 sm:flex-row sm:px-8">
          <div className="flex items-center gap-3">
            {/* Pulsing live dot */}
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-400" />
            </span>
            <p className="text-center text-[13px] leading-snug text-amber-100 sm:text-left">
              <span className="font-semibold text-amber-300">Cloud Demo Mode</span>
              {" — "}
              AI inference is intentionally disabled here. No data ever leaves this browser.
              For the full{" "}
              <span className="font-semibold text-white">100% Private, Local Gemma 2(2B)</span>
              {" "}experience, run it on your machine.
            </p>
          </div>
          <a
            href="https://github.com/truptibhalekarr/Enclaveia"
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-2 rounded-lg border border-amber-600/60 bg-amber-800/50 px-4 py-1.5 text-[13px] font-semibold text-amber-100 transition-all hover:bg-amber-700/60 hover:text-white"
          >
            Run Locally →
          </a>
        </div>
      </div>
      {/* ── END DEMO MODE BANNER ── */}

      <section className="dashboard-grid-bg relative overflow-hidden px-5 pt-8 sm:px-8">
        <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-8 pb-12 lg:grid-cols-[1fr_0.9fr]">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Badge className="mb-6 bg-white/38 text-[13px] text-wine-700 shadow-none backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                AI-powered analytics with local Gemma support
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="font-display text-5xl font-bold leading-[1.05] text-ink sm:text-6xl lg:text-[4.5rem]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              Turn Data Into Decisions
            </motion.h1>
            
            <motion.p 
              className="mt-6 max-w-xl text-lg leading-8 text-black"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
            >
              Upload any dataset. Get instant dashboards, business KPIs, executive insights, and statistical summaries while keeping sensitive data privacy-ready with Gemma via Ollama.
            </motion.p>
            
            <motion.div 
              className="mt-8 flex flex-col gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
            >
              <Button asChild size="lg" className="group h-12 bg-wine-600 px-6 text-[15px] transition-all hover:bg-wine-700 hover:shadow-lg hover:shadow-wine-500/25">
                <Link href="/upload">
                  <FileUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1" aria-hidden />
                  Upload Dataset
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="group h-12 bg-white/50 px-6 text-[15px] backdrop-blur-md transition-all hover:bg-white/80 hover:shadow-md">
                <Link href="/dashboard">
                  Try Demo
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                </Link>
              </Button>
            </motion.div>
          </div>

          <ScrollReveal className="relative w-full" delay={120} direction="left">
            <div className="hero-glass premium-float mt-8 flex w-full flex-col rounded-xl p-5 lg:mt-0">
              <div className="flex items-center justify-between border-b border-white/62 pb-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-wine-700">AI Generated Dashboard</p>
                  <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">Decision Overview</h2>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-wine-500/10">
                  <LayoutDashboard className="h-5 w-5 text-wine-600" aria-hidden />
                </div>
              </div>

              <div className="mt-4 grid flex-1 gap-3 lg:grid-cols-[0.3fr_0.7fr]">
                <div className="flex flex-col rounded-lg border border-white/60 bg-white/40 p-3 shadow-sm backdrop-blur-md">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-wine-700">Slicers</p>
                  {["Region", "Segment", "Quarter"].map((item, index) => (
                    <motion.div 
                      key={item} 
                      className="mb-2.5"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (index * 0.1) }}
                    >
                      <p className="mb-1 text-[10px] font-medium text-ink">{item}</p>
                      <div className="h-7 w-full rounded-md border border-white/50 bg-white/60 shadow-inner" />
                    </motion.div>
                  ))}
                </div>

                <div className="grid gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    {["Revenue", "Profit", "Margin", "Orders"].map((item, index) => (
                      <motion.div 
                        key={item} 
                        className="rounded-lg border border-white/60 bg-white/40 p-3 shadow-sm backdrop-blur-md"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + (index * 0.1) }}
                      >
                        <p className="text-[10px] font-medium uppercase tracking-wider text-wine-700/80">{item}</p>
                        <p className="mt-0.5 font-display text-xl font-bold text-wine-700 sm:text-2xl">
                          {index === 2 ? "28.4%" : index === 3 ? "12.8K" : `₹${[48.2, 11.2][index] ?? 7}L`}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <motion.div 
                      className="rounded-lg border border-white/60 bg-white/40 p-3 shadow-sm backdrop-blur-md"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-wine-700">Trend</p>
                        <LineChart className="h-3.5 w-3.5 text-wine-500" aria-hidden />
                      </div>
                      <div className="grid h-24 grid-cols-10 items-end gap-1.5">
                        {[44, 58, 52, 68, 74, 63, 82, 78, 90, 86].map((height, index) => (
                          <motion.div
                            key={index}
                            className="w-full rounded-t-sm bg-wine-500/80 shadow-sm"
                            initial={{ height: "10%" }}
                            animate={{ height: `${height}%` }}
                            transition={{ duration: 1, delay: 0.8 + (index * 0.05), ease: "easeOut" }}
                          />
                        ))}
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex flex-col justify-center rounded-lg border border-white/60 bg-white/40 p-4 shadow-sm backdrop-blur-md"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-wine-700">Insights</p>
                      <div className="grid gap-2.5">
                        <motion.div className="h-2.5 w-full rounded-full bg-wine-500/20" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1, duration: 0.8 }} style={{ originX: 0 }} />
                        <motion.div className="h-2.5 w-5/6 rounded-full bg-wine-500/20" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.2, duration: 0.8 }} style={{ originX: 0 }} />
                        <motion.div className="h-2.5 w-2/3 rounded-full bg-wine-500/20" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.4, duration: 0.8 }} style={{ originX: 0 }} />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-blush-50 px-5 py-20 sm:px-8" id="why-us">
        <ScrollReveal>
          <SectionHeading
            eyebrow="Why Us?"
            title="More than charts. Decision-ready intelligence."
            description="Enclaveia is built for founders, students, analysts, and small teams who need clear answers from data without spending hours inside BI tools."
          />
        </ScrollReveal>
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <ScrollReveal key={feature.title} className="h-full" delay={index * 120}>
              <Card className="group relative h-full overflow-hidden border-white/60 bg-white/40 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-wine-500/10">
                <div className="absolute inset-0 bg-gradient-to-br from-wine-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <CardHeader className="relative z-10">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-wine-500/10 transition-colors duration-500 group-hover:bg-wine-500/20">
                    <feature.icon className="h-6 w-6 text-wine-600 transition-transform duration-500 group-hover:scale-110 group-hover:text-wine-700" aria-hidden />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-sm leading-relaxed text-wine-700/80">{feature.text}</p>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8" id="what-we-do">
        <ScrollReveal>
          <SectionHeading
            eyebrow="What We Do"
            title="Upload data, get decisions"
            description="Enclaveia profiles your dataset, detects the right metrics, builds a dashboard, and turns patterns into insights you can present with confidence."
          />
        </ScrollReveal>
        <div className="mx-auto grid max-w-4xl gap-5">
          {steps.map((step, index) => (
            <ScrollReveal key={step} delay={index * 110} direction="right">
              <div className="group flex items-center gap-6 rounded-2xl border border-white/60 bg-white/40 p-6 shadow-sm backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-wine-500/30 hover:bg-white/80 hover:shadow-xl hover:shadow-wine-500/5">
                <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-wine-500 to-wine-600 font-display text-xl font-bold text-white shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  {index + 1}
                </span>
                <p className="text-lg font-medium tracking-tight text-ink md:text-xl">{step}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="bg-wine-700 px-5 py-16 text-center text-white sm:px-8">
        <ScrollReveal>
          <h2 className="font-display text-5xl font-bold">Stop analyzing. Start understanding.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-blush-100">
            Convert raw datasets into KPI-led dashboards, local AI insights, and decision summaries.
          </p>
          <Button asChild size="lg" className="mt-8 bg-white text-wine-700 hover:bg-blush-50">
            <Link href="/upload">
              Upload Dataset
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
          </Button>
        </ScrollReveal>
      </section>

      <SiteFooter />
    </main>
  );
}
