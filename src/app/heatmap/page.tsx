'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import PageHeader from '@/components/shared/page-header';
import SegmentedControl from '@/components/shared/segmented-control';
import { suburbs } from '@/data/suburbs';
import { formatZAR, scoreColor } from '@/lib/utils';

const HeatmapMap = dynamic(() => import('@/components/farm/suburb-map'), {
  ssr: false,
  loading: () => <div className="h-[250px] bg-bg-hover rounded-card animate-pulse" />,
});

type Metric = 'Score' | 'Growth' | 'Velocity';

export default function HeatmapPage() {
  const [metric, setMetric] = useState<Metric>('Score');

  function getValue(sub: typeof suburbs[0]): number {
    if (metric === 'Score') return sub.score;
    if (metric === 'Growth') return sub.growth;
    return sub.velocity;
  }

  function getColor(val: number): string {
    if (metric === 'Score') return scoreColor(val);
    if (metric === 'Growth') return val > 8 ? '#34C759' : val > 5 ? '#FF9500' : '#FF3B30';
    return val > 20 ? '#34C759' : val > 12 ? '#FF9500' : '#FF3B30';
  }

  function getLabel(val: number): string {
    if (metric === 'Score') return val.toString();
    if (metric === 'Growth') return `${val}%`;
    return `${val}/mo`;
  }

  const sorted = [...suburbs].sort((a, b) => getValue(b) - getValue(a));
  const maxVal = Math.max(...sorted.map(s => getValue(s)));

  return (
    <div>
      <PageHeader title="Heatmap" subtitle="Neighbourhood performance comparison">
        <SegmentedControl options={['Score', 'Growth', 'Velocity']} value={metric} onChange={v => setMetric(v as Metric)} />
      </PageHeader>

      <div className="space-y-2 mb-6">
        {sorted.map(sub => {
          const val = getValue(sub);
          const width = Math.max(10, (val / maxVal) * 100);
          const color = getColor(val);
          return (
            <div key={sub.id} className="flex items-center gap-3">
              <span className="w-28 text-right text-[13px] text-text-secondary font-medium flex-shrink-0 truncate">{sub.name}</span>
              <div className="flex-1">
                <div className="h-9 rounded-lg flex items-center px-3 transition-all duration-700 ease-out" style={{ width: `${width}%`, backgroundColor: `${color}20`, borderLeft: `3px solid ${color}` }}>
                  <span className="font-mono text-[13px] font-bold" style={{ color }}>{getLabel(val)}</span>
                </div>
              </div>
              <span className="font-mono text-[12px] text-text-tertiary w-20 text-right flex-shrink-0">
                {formatZAR(sub.avgPrice)}
              </span>
            </div>
          );
        })}
      </div>

      <HeatmapMap suburbs={suburbs} farmedIds={suburbs.map(s => s.id)} onSelectSuburb={() => {}} />
    </div>
  );
}
