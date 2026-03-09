'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Map, GitBranch, Users, Sparkles,
  DollarSign, Bell, BarChart3, TrendingUp, FolderOpen, Settings
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Map, label: 'Farm Areas', href: '/farm', badge: 'hot' },
  { icon: GitBranch, label: 'Pipeline', href: '/pipeline', badge: 'qualified' },
  { icon: Users, label: 'Agents', href: '/agents' },
  { icon: Sparkles, label: 'AI Compose', href: '/compose' },
  { icon: DollarSign, label: 'Deals', href: '/deals' },
  { icon: Bell, label: 'Alerts', href: '/alerts' },
  { icon: BarChart3, label: 'Heatmap', href: '/heatmap' },
  { icon: TrendingUp, label: 'Predict', href: '/predict' },
  { icon: FolderOpen, label: 'Documents', href: '/documents' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden xl:flex flex-col w-60 h-screen sticky top-0 frosted-glass border-r border-black/[0.06] z-40">
        <div className="px-5 py-6">
          <h1 className="text-[22px] font-bold tracking-tight text-text-primary">
            Prop<span className="text-accent-blue">Scout</span>
          </h1>
          <p className="text-[10px] font-mono text-text-tertiary mt-0.5 uppercase tracking-widest">Referral Agency</p>
        </div>
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[15px] transition-all duration-150 ${
                  isActive
                    ? 'bg-accent-blue/10 text-accent-blue font-semibold'
                    : 'text-text-secondary hover:bg-bg-hover'
                }`}
              >
                <item.icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Tablet sidebar (icons only) */}
      <aside className="hidden md:flex xl:hidden flex-col w-16 h-screen sticky top-0 frosted-glass border-r border-black/[0.06] z-40 items-center">
        <div className="py-5">
          <div className="w-8 h-8 rounded-lg bg-accent-blue flex items-center justify-center">
            <span className="text-white text-sm font-bold">P</span>
          </div>
        </div>
        <nav className="flex-1 flex flex-col items-center gap-1 px-2 overflow-y-auto">
          {navItems.map(item => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-center w-10 h-10 rounded-[10px] transition-all duration-150 ${
                  isActive
                    ? 'bg-accent-blue/10 text-accent-blue'
                    : 'text-text-secondary hover:bg-bg-hover'
                }`}
                title={item.label}
              >
                <item.icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
