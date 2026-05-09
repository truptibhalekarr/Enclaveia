import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { SiteHeader } from "@/components/site-header";

export default function DashboardPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <DashboardClient />
    </main>
  );
}
