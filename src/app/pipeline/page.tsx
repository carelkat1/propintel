'use client';

import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import PageHeader from '@/components/shared/page-header';
import SegmentedControl from '@/components/shared/segmented-control';
import { getDeals, setDeals as saveDeals, addActivity } from '@/lib/store';
import { formatZAR } from '@/lib/utils';
import { PIPELINE_STAGES, getStageColor, getStageLabel } from '@/lib/constants';
import { Deal, PipelineStage } from '@/lib/types';

export default function PipelinePage() {
  const [view, setView] = useState('Board');
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => { setDeals(getDeals()); }, []);

  function advanceDeal(dealId: string) {
    const stageOrder: PipelineStage[] = ['scored', 'contacted', 'qualified', 'assigned', 'mandate', 'listed', 'sold', 'paid'];
    const updated = deals.map(d => {
      if (d.id !== dealId) return d;
      const idx = stageOrder.indexOf(d.stage);
      if (idx >= stageOrder.length - 1) return d;
      const nextStage = stageOrder[idx + 1];
      const newDeal = { ...d, stage: nextStage, timestamps: { ...d.timestamps, [nextStage]: new Date().toISOString() } };
      addActivity({ type: 'assignment', message: `${d.property} advanced to ${getStageLabel(nextStage)}` });
      return newDeal;
    });
    setDeals(updated);
    saveDeals(updated);
  }

  return (
    <div>
      <PageHeader title="Pipeline" subtitle={`${deals.length} deals in pipeline`}>
        <SegmentedControl options={['Board', 'List', 'Funnel']} value={view} onChange={setView} />
      </PageHeader>

      {view === 'Board' && (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map(stage => {
            const stageDeals = deals.filter(d => d.stage === stage.key);
            const stageValue = stageDeals.reduce((s, d) => s + d.yourCut, 0);
            return (
              <div key={stage.key} className="min-w-[240px] flex-shrink-0">
                <div className="mb-2 px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                    <span className="text-[13px] font-semibold text-text-primary">{stage.label}</span>
                    <span className="text-[12px] text-text-tertiary font-mono">{stageDeals.length}</span>
                  </div>
                  <p className="text-[11px] text-text-tertiary font-mono mt-0.5">{formatZAR(stageValue)}</p>
                </div>
                <div className="space-y-2">
                  {stageDeals.map(deal => (
                    <div key={deal.id} className="bg-white rounded-card p-3 shadow-card border-t-2" style={{ borderTopColor: stage.color }}>
                      <p className="text-[13px] font-semibold text-text-primary truncate">{deal.property}</p>
                      <p className="text-[11px] text-text-secondary">{deal.seller}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-mono text-[12px] font-bold text-accent-green">{formatZAR(deal.yourCut)}</span>
                        {deal.agentName && <span className="text-[10px] text-text-tertiary">{deal.agentName.split(' ')[0]}</span>}
                      </div>
                      {stage.key !== 'paid' && (
                        <button onClick={() => advanceDeal(deal.id)} className="mt-2 w-full flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] font-medium text-accent-blue bg-accent-blue/10 rounded-button hover:bg-accent-blue/20 transition-colors">
                          Advance <ChevronRight size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === 'List' && (
        <div className="bg-white rounded-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/[0.06]">
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Property</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Seller</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Agent</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Stage</th>
                  <th className="text-right px-4 py-3 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Your Cut</th>
                  <th className="text-right px-4 py-3 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Days</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                {deals.sort((a, b) => b.yourCut - a.yourCut).map(deal => (
                  <tr key={deal.id} className="hover:bg-bg-hover transition-colors">
                    <td className="px-4 py-3 text-[13px] font-semibold text-text-primary">{deal.property}</td>
                    <td className="px-4 py-3 text-[13px] text-text-secondary">{deal.seller}</td>
                    <td className="px-4 py-3 text-[13px] text-text-secondary">{deal.agentName || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-badge" style={{ backgroundColor: getStageColor(deal.stage) + '15', color: getStageColor(deal.stage) }}>{getStageLabel(deal.stage)}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[13px] font-bold text-accent-green">{formatZAR(deal.yourCut)}</td>
                    <td className="px-4 py-3 text-right font-mono text-[13px] text-text-secondary">{deal.daysInPipeline}d</td>
                    <td className="px-4 py-3">
                      {deal.stage !== 'paid' && (
                        <button onClick={() => advanceDeal(deal.id)} className="text-[11px] text-accent-blue font-medium hover:underline">Advance</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'Funnel' && (
        <div className="space-y-2">
          {PIPELINE_STAGES.map((stage, i) => {
            const count = deals.filter(d => d.stage === stage.key).length;
            const value = deals.filter(d => d.stage === stage.key).reduce((s, d) => s + d.yourCut, 0);
            const maxCount = Math.max(...PIPELINE_STAGES.map(s => deals.filter(d => d.stage === s.key).length), 1);
            const width = Math.max(15, (count / maxCount) * 100);
            const nextCount = i < PIPELINE_STAGES.length - 1 ? deals.filter(d => d.stage === PIPELINE_STAGES[i + 1].key).length : 0;
            const convRate = count > 0 && i < PIPELINE_STAGES.length - 1 ? Math.round((nextCount / count) * 100) : null;
            return (
              <div key={stage.key} className="flex items-center gap-4">
                <span className="w-20 text-right text-[12px] text-text-secondary font-medium flex-shrink-0">{stage.label}</span>
                <div className="flex-1">
                  <div className="h-10 rounded-lg flex items-center px-3 gap-2 transition-all duration-500" style={{ width: `${width}%`, backgroundColor: stage.color + '20', borderLeft: `3px solid ${stage.color}` }}>
                    <span className="font-mono text-[14px] font-bold" style={{ color: stage.color }}>{count}</span>
                    <span className="font-mono text-[11px] text-text-tertiary">{formatZAR(value)}</span>
                  </div>
                </div>
                {convRate !== null && (
                  <span className="text-[11px] font-mono text-text-tertiary w-12 text-right flex-shrink-0">{convRate}% ↓</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
