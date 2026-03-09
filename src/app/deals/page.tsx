'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Target, TrendingUp, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import PageHeader from '@/components/shared/page-header';
import StatCard from '@/components/shared/stat-card';
import { getDeals } from '@/lib/store';
import { formatZAR, formatDate } from '@/lib/utils';
import { getStageColor, getStageLabel, PIPELINE_STAGES } from '@/lib/constants';
import { Deal } from '@/lib/types';

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { setDeals(getDeals()); }, []);

  const completedDeals = deals.filter(d => d.stage === 'sold' || d.stage === 'paid');
  const activeDeals = deals.filter(d => !['sold', 'paid'].includes(d.stage));
  const totalEarned = completedDeals.reduce((s, d) => s + d.yourCut, 0);
  const pipelineValue = activeDeals.reduce((s, d) => s + d.yourCut, 0);
  const avgPerDeal = completedDeals.length > 0 ? totalEarned / completedDeals.length : 0;

  return (
    <div>
      <PageHeader title="Deals" subtitle="Commission tracking and revenue" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Earned (YTD)" value={formatZAR(totalEarned)} color="#34C759" icon={<DollarSign size={18} />} />
        <StatCard label="Pipeline Value" value={formatZAR(pipelineValue)} color="#007AFF" icon={<Target size={18} />} />
        <StatCard label="Avg Per Deal" value={formatZAR(avgPerDeal)} color="#5AC8FA" icon={<TrendingUp size={18} />} />
        <StatCard label="Deals This Month" value={deals.length.toString()} color="#FF9500" icon={<Calendar size={18} />} />
      </div>

      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/[0.06]">
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Property</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider hidden md:table-cell">Agent</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Sale Price</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider hidden lg:table-cell">Commission</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Your Cut</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Stage</th>
                <th className="px-4 py-3 w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {deals.sort((a, b) => b.yourCut - a.yourCut).map(deal => (
                <>
                  <tr key={deal.id} className="hover:bg-bg-hover transition-colors cursor-pointer" onClick={() => setExpanded(expanded === deal.id ? null : deal.id)}>
                    <td className="px-4 py-3">
                      <p className="text-[13px] font-semibold text-text-primary">{deal.property}</p>
                      <p className="text-[11px] text-text-tertiary">{deal.suburb} · {deal.seller}</p>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-text-secondary hidden md:table-cell">{deal.agentName || '—'}</td>
                    <td className="px-4 py-3 text-right font-mono text-[13px] text-text-primary">{formatZAR(deal.value)}</td>
                    <td className="px-4 py-3 text-right font-mono text-[13px] text-text-secondary hidden lg:table-cell">{formatZAR(deal.commission)}</td>
                    <td className="px-4 py-3 text-right font-mono text-[13px] font-bold text-accent-green">{formatZAR(deal.yourCut)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-badge" style={{ backgroundColor: getStageColor(deal.stage) + '15', color: getStageColor(deal.stage) }}>
                        {getStageLabel(deal.stage)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {expanded === deal.id ? <ChevronUp size={14} className="text-text-tertiary" /> : <ChevronDown size={14} className="text-text-tertiary" />}
                    </td>
                  </tr>
                  {expanded === deal.id && (
                    <tr key={`${deal.id}-detail`}>
                      <td colSpan={7} className="px-4 py-3 bg-bg-primary">
                        <div className="flex flex-wrap gap-4">
                          {PIPELINE_STAGES.map(stage => {
                            const ts = deal.timestamps[stage.key];
                            const isCurrent = deal.stage === stage.key;
                            return (
                              <div key={stage.key} className={`flex items-center gap-2 ${!ts && !isCurrent ? 'opacity-30' : ''}`}>
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ts ? stage.color : '#E5E5EA' }} />
                                <div>
                                  <p className="text-[11px] font-medium text-text-primary">{stage.label}</p>
                                  <p className="text-[10px] text-text-tertiary">{ts ? formatDate(ts) : '—'}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
