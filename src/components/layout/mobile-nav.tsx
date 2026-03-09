'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Map, GitBranch, Users, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Sparkles, DollarSign, Bell, BarChart3, TrendingUp, FolderOpen, Settings } from 'lucide-react';

const mainItems = [
  { icon: LayoutDashboard, label: 'Home', href: '/dashboard' },
  { icon: Map, label: 'Farm', href: '/farm' },
  { icon: GitBranch, label: 'Pipeline', href: '/pipeline' },
  { icon: Users, label: 'Agents', href: '/agents' },
];

const moreItems = [
  { icon: Sparkles, label: 'AI Compose', href: '/compose' },
  { icon: DollarSign, label: 'Deals', href: '/deals' },
  { icon: Bell, label: 'Alerts', href: '/alerts' },
  { icon: BarChart3, label: 'Heatmap', href: '/heatmap' },
  { icon: TrendingUp, label: 'Predict', href: '/predict' },
  { icon: FolderOpen, label: 'Documents', href: '/documents' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      {/* More menu overlay */}
      {showMore && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setShowMore(false)}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-16 left-0 right-0 mx-4 mb-2 bg-white rounded-2xl shadow-elevated p-2 space-y-0.5">
            {moreItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setShowMore(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] ${
                  pathname === item.href ? 'bg-accent-blue/10 text-accent-blue font-semibold' : 'text-text-primary'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden frosted-glass-heavy border-t border-black/[0.06] pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-16">
          {mainItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-0.5 ${
                  isActive ? 'text-accent-blue' : 'text-text-tertiary'
                }`}
              >
                <item.icon size={22} strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setShowMore(!showMore)}
            className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-0.5 ${
              showMore ? 'text-accent-blue' : 'text-text-tertiary'
            }`}
          >
            <MoreHorizontal size={22} />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
