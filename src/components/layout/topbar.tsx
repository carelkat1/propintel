'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Settings } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/farm': 'Farm Areas',
  '/pipeline': 'Pipeline',
  '/agents': 'Agents',
  '/compose': 'AI Compose',
  '/deals': 'Deals',
  '/alerts': 'Alerts',
  '/heatmap': 'Heatmap',
  '/predict': 'Predict',
  '/documents': 'Documents',
  '/settings': 'Settings',
};

export default function Topbar() {
  const pathname = usePathname();
  const title = pageTitles[pathname || ''] || 'PropScout';

  return (
    <header className="sticky top-0 z-30 h-14 frosted-glass border-b border-black/[0.06] flex items-center justify-between px-6">
      <h2 className="text-[17px] font-semibold text-text-primary">{title}</h2>
      <Link
        href="/settings"
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-bg-hover transition-colors"
      >
        <Settings size={18} className="text-text-secondary" />
      </Link>
    </header>
  );
}
