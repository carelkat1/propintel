import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "PropIntel — Predictive Property Intelligence",
  description:
    "AI-powered property intelligence platform. Predict which owners are likely to sell before they list.",
  keywords: ["proptech", "real estate", "CRM", "Lightstone", "property intelligence"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-surface">
        <Sidebar />
        <main className="flex-1 min-w-0 flex flex-col min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
