'use client';

import { useEffect, useState } from 'react';
import { Sparkles, RefreshCw, DollarSign, Target, Users, TrendingUp } from 'lucide-react';
import StatCard from '@/components/shared/stat-card';
import PageHeader from '@/components/shared/page-header';
import { getDeals, getActivities } from '@/lib/store';
import { formatZAR, formatRelativeTime } from '@/lib/utils';
import { getStageColor, getStageLabel } from '@/lib/constants';
import { generateMessage, SYSTEM_PROMPTS } from '@/lib/claude';
import { Deal, Activity } from '@/lib/types';

export default function DashboardPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [aiInsight, setAiInsight] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [displayedInsight, setDisplayedInsight] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setDeals(getDeals());
    setActivities(getActivities());
    loadInsights();
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!aiInsight) return;
    let i = 0;
    setDisplayedInsight('');
    const interval = setInterval(() => {
      if (i < aiInsight.length) {
        setDisplayedInsight(prev => prev + aiInsight[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [aiInsight]);

  async function loadInsights() {
    setAiLoading(true);
    setAiInsight('');
    setDisplayedInsight('');
    const summary = deals.length > 0
      ? `Pipeline: ${deals.length} deals. Stages: ${deals.map(d => `${d.property} (${d.stage}, ${formatZAR(d.yourCut)})`).join('; ')}. Total pipeline value: ${formatZAR(deals.reduce((s, d) => s + d.yourCut, 0))}.`
      : 'New pipeline with seed data loaded. 8 deals across various stages.';
    const result = await generateMessage(summary, SYSTEM_PROMPTS.dashboardInsights);
    setAiInsight(result);
    setAiLoading(false);
  }

  const activeDeals = deals.filter(d => d.stage !== 'paid');
  const soldDeals = deals.filter(d => d.stage === 'sold' || d.stage === 'paid');
  const qualifiedCount = deals.filter(d => d.stage === 'qualified').length;
  const pipelineValue = activeDeals.reduce((s, d) => s + d.yourCut, 0);
  const thisMonthRevenue = soldDeals.reduce((s, d) => s + d.yourCut, 0);
  const winRate = deals.length > 0 ? Math.round((soldDeals.length / deals.length) * 100) : 0;

  const activityColors: Record<string, string> = {
    revenue: '#34C759',
    outreach: '#007AFF',
    ai: '#AF52DE',
    assignment: '#FF9500',
  };

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Revenue overview and pipeline insights" />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="This Month" value={formatZAR(thisMonthRevenue)} trend={{ value: '+39%', positive: true }} color="#34C759" icon={<DollarSign size={18} />} />
        <StatCard label="Pipeline Value" value={formatZAR(pipelineValue)} color="#007AFF" icon={<Target size={18} />} />
        <StatCard label="Qualified Leads" value={qualifiedCount.toString()} color="#AF52DE" icon={<Users size={18} />} />
        <StatCard label="Win Rate" value={`${winRate}%`} trend={{ value: '+5%', positive: true }} color="#FF9500" icon={<TrendingUp size={18} />} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* AI Insights */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-card p-5 shadow-card mb-4 border border-accent-purple/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-accent-purple" />
                <span className="text-[15px] font-semibold text-text-primary">AI Insights</span>
              </div>
              <button onClick={loadInsights} disabled={aiLoading} className="p-1.5 rounded-lg hover:bg-white/50 transition-colors">
                <RefreshCw size={16} className={`text-accent-purple ${aiLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="text-[14px] text-text-secondary leading-relaxed min-h-[60px]">
              {aiLoading ? (
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-accent-purple rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-accent-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-accent-purple rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : (
                displayedInsight || 'Loading insights...'
              )}
            </div>
          </div>

          {/* Active Deals */}
          <div className="bg-white rounded-card shadow-card">
            <div className="px-5 py-4 border-b border-black/[0.04]">
              <span className="text-[15px] font-semibold text-text-primary">Active Deals</span>
            </div>
            <div className="divide-y divide-black/[0.04]">
              {activeDeals.sort((a, b) => b.yourCut - a.yourCut).map(deal => (
                <div key={deal.id} className="flex items-center gap-3 px-5 py-3 hover:bg-bg-hover transition-colors">
                  <div className="w-1 h-8 rounded-full" style={{ backgroundColor: getStageColor(deal.stage) }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[14px] font-semibold text-text-primary truncate">{deal.property}</span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-badge" style={{ backgroundColor: getStageColor(deal.stage) + '15', color: getStageColor(deal.stage) }}>
                        {getStageLabel(deal.stage)}
                      </span>
                    </div>
                    <p className="text-[12px] text-text-secondary truncate">{deal.seller} · {deal.suburb} · {deal.agentName || 'Unassigned'}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-mono text-[14px] font-bold text-text-primary">{formatZAR(deal.value)}</div>
                    <div className="font-mono text-[12px] font-semibold text-accent-green">{formatZAR(deal.yourCut)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-card shadow-card h-fit">
          <div className="px-5 py-4 border-b border-black/[0.04]">
            <span className="text-[15px] font-semibold text-text-primary">Recent Activity</span>
          </div>
          <div className="divide-y divide-black/[0.04] max-h-[400px] overflow-y-auto">
            {activities.length === 0 ? (
              <div className="px-5 py-8 text-center text-[13px] text-text-tertiary">No activity yet</div>
            ) : (
              activities.slice(0, 15).map(a => (
                <div key={a.id} className="flex items-start gap-3 px-5 py-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: activityColors[a.type] || '#6E6E73' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-text-primary">{a.message}</p>
                    <p className="text-[11px] text-text-tertiary mt-0.5">{formatRelativeTime(a.timestamp)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
