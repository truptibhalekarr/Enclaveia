import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-wine-700/10 bg-wine-700 text-blush-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="mb-5 inline-flex items-center rounded-2xl bg-white/95 px-5 py-4 shadow-md backdrop-blur">
            <img
              src="/enclaveia-logo.png"
              alt="Enclaveia"
              className="h-16 w-auto object-contain object-left drop-shadow-sm md:h-20"
            />
          </div>
          <p className="max-w-md text-sm leading-6 text-blush-100">
            AI Decision Intelligence Platform for teams who want dashboards, KPIs, insights, and summaries without manual BI setup.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase">Product</h4>
          <div className="grid gap-2 text-sm text-blush-100">
            <Link href="/upload">Upload Dataset</Link>
            <Link href="/preview">Data Preview</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase">Privacy</h4>
          <p className="text-sm leading-6 text-blush-100">
            Designed for private analysis with local Gemma support, so teams can explore sensitive datasets with more control.
          </p>
        </div>
      </div>
    </footer>
  );
}
