import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import MobileNav from "@/components/layout/mobile-nav";

export const metadata: Metadata = {
  title: "PropScout — Predictive Real Estate Lead Generation",
  description: "AI-powered property prospecting for South African real estate agents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600;700;800&family=Azeret+Mono:wght@400;500;600;700;800&family=Outfit:wght@300;400;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
      </head>
      <body className="font-sans antialiased min-h-screen bg-bg text-text-primary">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 overflow-y-auto relative pb-16 md:pb-0">
            <Topbar />
            <div className="p-4 md:p-6 max-w-[960px]">
              {children}
            </div>
          </main>
        </div>
        <MobileNav />
      </body>
    </html>
  );
}
