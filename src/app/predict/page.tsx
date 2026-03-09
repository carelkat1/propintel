'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Sparkles, RefreshCw } from 'lucide-react';
import PageHeader from '@/components/shared/page-header';
import { predictions } from '@/data/predictions';
import { generateMessage, SYSTEM_PROMPTS } from '@/lib/claude';

const suburbOptions = [
  { id: 'sandhurst', name: 'Sandhurst' },
  { id: 'sandton-central', name: 'Sandton Central' },
  { id: 'bryanston', name: 'Bryanston' },
  { id: 'lonehill', name: 'Lonehill' },
  { id: 'hyde-park', name: 'Hyde Park' },
];

export default function PredictPage() {
  const [selected, setSelected] = useState('sandhurst');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const data = predictions[selected] || [];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadAnalysis(); }, [selected]);

  async function loadAnalysis() {
    setAiLoading(true);
    const suburb = suburbOptions.find(s => s.id === selected)?.name || selected;
    const lastActual = data.find(d => d.actual !== null && data.indexOf(d) === data.filter(d => d.actual !== null).length - 1);
    const prompt = `Suburb: ${suburb}. Current price/m²: R${lastActual?.actual || 'N/A'}. Provide a 2-sentence market outlook for sellers.`;
    const result = await generateMessage(prompt, SYSTEM_PROMPTS.predictAnalysis);
    setAiAnalysis(result);
    setAiLoading(false);
  }

  const todayIndex = data.findIndex(d => d.predicted !== null);
  const todayMonth = todayIndex > 0 ? data[todayIndex - 1].month : '';

  return (
    <div>
      <PageHeader title="Price Predictor" subtitle="Suburb price trends and AI forecasts" />

      {/* Suburb selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {suburbOptions.map(s => (
          <button key={s.id} onClick={() => setSelected(s.id)} className={`px-4 py-2 text-[13px] font-medium rounded-full whitespace-nowrap transition-colors ${selected === s.id ? 'bg-accent-blue text-white' : 'bg-white text-text-secondary shadow-sm hover:bg-bg-hover'}`}>
            {s.name}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-card shadow-card p-5 mb-4">
        <h3 className="text-[15px] font-semibold text-text-primary mb-4">Price per m² — {suburbOptions.find(s => s.id === selected)?.name}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#AEAEB2' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#AEAEB2' }} axisLine={false} tickLine={false} tickFormatter={v => `R${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => [`R ${v.toLocaleString()}`, '']} labelStyle={{ color: '#1D1D1F', fontWeight: 600 }} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            {todayMonth && <ReferenceLine x={todayMonth} stroke="#AEAEB2" strokeDasharray="4 4" label={{ value: 'Today', position: 'top', fontSize: 11, fill: '#AEAEB2' }} />}
            <Area type="monotone" dataKey="upper" stackId="band" stroke="none" fill="#34C75920" />
            <Area type="monotone" dataKey="lower" stackId="band" stroke="none" fill="#FFFFFF" />
            <Area type="monotone" dataKey="actual" stroke="#007AFF" fill="#007AFF20" strokeWidth={2} dot={false} connectNulls={false} />
            <Area type="monotone" dataKey="predicted" stroke="#34C759" fill="none" strokeWidth={2} strokeDasharray="6 3" dot={false} connectNulls={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-3 text-[11px] text-text-tertiary">
          <div className="flex items-center gap-1.5"><div className="w-4 h-0.5 bg-accent-blue rounded" /> Actual</div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-0.5 bg-accent-green rounded" style={{ borderTop: '2px dashed #34C759' }} /> Predicted</div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-2 bg-accent-green/10 rounded" /> Confidence</div>
        </div>
      </div>

      {/* AI Analysis */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-card p-5 shadow-card border border-accent-purple/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-accent-purple" />
            <span className="text-[14px] font-semibold text-text-primary">AI Market Analysis</span>
          </div>
          <button onClick={loadAnalysis} disabled={aiLoading} className="p-1 rounded-lg hover:bg-white/50">
            <RefreshCw size={14} className={`text-accent-purple ${aiLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <p className="text-[13px] text-text-secondary leading-relaxed">
          {aiLoading ? 'Analysing market data...' : aiAnalysis || 'Loading analysis...'}
        </p>
      </div>
    </div>
  );
}
