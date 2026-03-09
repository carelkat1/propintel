import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/layout/sidebar';
import Topbar from '@/components/layout/topbar';
import MobileNav from '@/components/layout/mobile-nav';
import { ClientInit } from '@/components/shared/client-init';

export const metadata: Metadata = {
  title: 'PropScout — Referral Agency Platform',
  description: 'AI-powered property referral agency for South Africa',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg-primary font-body antialiased">
        <ClientInit />
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 min-w-0">
            <Topbar />
            <div className="p-4 md:p-6 pb-20 md:pb-6">
              {children}
            </div>
          </main>
        </div>
        <MobileNav />
      </body>
    </html>
  );
}
