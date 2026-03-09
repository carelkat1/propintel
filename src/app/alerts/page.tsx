'use client';

import { useState } from 'react';
import { AlertTriangle, TrendingUp, Home, FileText, Plane, DollarSign, Building2, Heart, LucideIcon } from 'lucide-react';
import PageHeader from '@/components/shared/page-header';
import { seedAlerts } from '@/data/alerts';
import { formatRelativeTime } from '@/lib/utils';

const typeIcons: Record<string, LucideIcon> = {
  estate: FileText,
  financial: DollarSign,
  cluster: TrendingUp,
  divorce: Heart,
  listing: Home,
  development: Building2,
  emigration: Plane,
  valuation: AlertTriangle,
};

const severityColors: Record<string, string> = {
  hot: '#FF3B30',
  warm: '#FF9500',
  info: '#007AFF',
};

export default function AlertsPage() {
  const [filter, setFilter] = useState('All');
  const alerts = filter === 'All' ? seedAlerts : seedAlerts.filter(a => a.severity === filter.toLowerCase());

  return (
    <div>
      <PageHeader title="Alerts" subtitle={`${seedAlerts.length} market alerts`} />

      <div className="flex gap-2 mb-4">
        {['All', 'Hot', 'Warm', 'Info'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-[13px] font-medium rounded-full transition-colors ${filter === f ? 'bg-accent-blue text-white' : 'bg-white text-text-secondary shadow-sm hover:bg-bg-hover'}`}>
            {f === 'Hot' ? '🔥 ' : f === 'Warm' ? '⚠ ' : f === 'Info' ? 'ℹ ' : ''}{f}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {alerts.map((alert, i) => {
          const Icon = typeIcons[alert.type] || AlertTriangle;
          const color = severityColors[alert.severity];
          return (
            <div key={alert.id} className="bg-white rounded-card shadow-card p-4 flex gap-4 animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="w-1 h-full rounded-full min-h-[40px]" style={{ backgroundColor: color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Icon size={16} style={{ color }} />
                  <span className="text-[14px] font-semibold text-text-primary">{alert.title}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] text-text-tertiary">{formatRelativeTime(alert.timestamp)}</span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-badge bg-bg-hover text-text-secondary">{alert.suburb}</span>
                </div>
                <p className="text-[13px] text-text-secondary leading-relaxed">{alert.description}</p>
                <div className="flex gap-2 mt-3">
                  {alert.propertyId && (
                    <button className="px-3 py-1.5 text-[12px] font-medium text-accent-blue bg-accent-blue/10 rounded-button hover:bg-accent-blue/20 transition-colors">
                      View Property
                    </button>
                  )}
                  <button className="px-3 py-1.5 text-[12px] font-medium text-accent-purple bg-accent-purple/10 rounded-button hover:bg-accent-purple/20 transition-colors">
                    Compose Outreach
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
