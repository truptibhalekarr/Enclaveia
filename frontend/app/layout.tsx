import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Enclaveia",
  description: "AI-powered dashboards, KPIs, and business insights from uploaded datasets."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
