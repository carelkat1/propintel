'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/shared/page-header';
import ScoreRing from '@/components/shared/score-ring';
import { suburbs } from '@/data/suburbs';
import { getProperties, getFarmedSuburbs, setFarmedSuburbs } from '@/lib/store';
import { formatZAR } from '@/lib/utils';
import { Property, Suburb } from '@/lib/types';

const SuburbMap = dynamic(() => import('@/components/farm/suburb-map'), {
  ssr: false,
  loading: () => <div className="h-[350px] bg-bg-hover rounded-card animate-pulse" />,
});

export default function FarmPage() {
  const [selectedSuburb, setSelectedSuburb] = useState<Suburb | null>(null);
  const [properties, setPropertiesState] = useState<Property[]>([]);
  const [farmed, setFarmed] = useState<string[]>([]);
  const [filter, setFilter] = useState('All');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    setPropertiesState(getProperties());
    setFarmed(getFarmedSuburbs());
  }, []);

  const farmedSuburbs = useMemo(() => suburbs.filter(s => farmed.includes(s.id)), [farmed]);
  const totalHot = farmedSuburbs.reduce((s, sub) => s + sub.hotLeads, 0);
  const totalProperties = farmedSuburbs.reduce((s, sub) => s + sub.stock, 0);

  const suburbProperties = useMemo(() => {
    if (!selectedSuburb) return [];
    let props = properties.filter(p => p.suburbId === selectedSuburb.id);
    if (filter === 'Hot') props = props.filter(p => p.score >= 75);
    else if (filter === 'Warm') props = props.filter(p => p.score >= 50 && p.score < 75);
    else if (filter === 'Watch') props = props.filter(p => p.score < 50);
    return props.sort((a, b) => b.score - a.score);
  }, [selectedSuburb, properties, filter]);

  function toggleFarm(suburbId: string) {
    const updated = farmed.includes(suburbId) ? farmed.filter(id => id !== suburbId) : [...farmed, suburbId];
    setFarmed(updated);
    setFarmedSuburbs(updated);
  }

  if (selectedProperty) {
    return (
      <div>
        <button onClick={() => setSelectedProperty(null)} className="flex items-center gap-2 text-accent-blue text-[15px] font-medium mb-4 hover:opacity-80">
          <ArrowLeft size={18} /> Back to {selectedSuburb?.name}
        </button>
        <div className="bg-white rounded-card shadow-card p-6">
          <div className="flex items-start gap-6">
            <ScoreRing score={selectedProperty.score} size="lg" />
            <div className="flex-1">
              <h2 className="text-[22px] font-bold text-text-primary">{selectedProperty.address}</h2>
              <p className="text-[15px] text-text-secondary">{selectedProperty.suburb}</p>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div><p className="text-[11px] text-text-tertiary">Owner</p><p className="text-[14px] font-semibold text-text-primary">{selectedProperty.owner}</p></div>
                <div><p className="text-[11px] text-text-tertiary">Value</p><p className="text-[14px] font-mono font-bold text-text-primary">{formatZAR(selectedProperty.value)}</p></div>
                <div><p className="text-[11px] text-text-tertiary">Equity</p><p className="text-[14px] font-mono font-bold text-accent-green">{formatZAR(selectedProperty.value - selectedProperty.bondBalance)}</p></div>
                <div><p className="text-[11px] text-text-tertiary">Years Owned</p><p className="text-[14px] font-semibold text-text-primary">{selectedProperty.yearsOwned}</p></div>
                <div><p className="text-[11px] text-text-tertiary">Bond Balance</p><p className="text-[14px] font-mono text-text-primary">{formatZAR(selectedProperty.bondBalance)}</p></div>
                <div><p className="text-[11px] text-text-tertiary">Municipal Value</p><p className="text-[14px] font-mono text-text-primary">{formatZAR(selectedProperty.municipalValue)}</p></div>
                <div><p className="text-[11px] text-text-tertiary">Size</p><p className="text-[14px] text-text-primary">{selectedProperty.beds} bed · {selectedProperty.baths} bath · {selectedProperty.size}m²</p></div>
                <div><p className="text-[11px] text-text-tertiary">Erf</p><p className="text-[14px] text-text-primary">{selectedProperty.erf > 0 ? `${selectedProperty.erf}m²` : 'Sectional'}</p></div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {selectedProperty.signals.map(sig => (
                  <span key={sig} className="text-[11px] font-medium px-2.5 py-1 rounded-badge bg-accent-red/10 text-accent-red">{sig}</span>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <a href={`tel:${selectedProperty.phone}`} className="px-3 py-2 bg-accent-blue text-white text-[13px] font-medium rounded-button hover:opacity-90">Call {selectedProperty.owner.split(' ')[0]}</a>
                <a href={`mailto:${selectedProperty.email}`} className="px-3 py-2 bg-accent-teal/10 text-accent-teal text-[13px] font-medium rounded-button hover:bg-accent-teal/20">Email</a>
                <button className="px-3 py-2 bg-whatsapp/10 text-whatsapp text-[13px] font-medium rounded-button hover:bg-whatsapp/20">WhatsApp</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedSuburb) {
    return (
      <div>
        <button onClick={() => { setSelectedSuburb(null); setFilter('All'); }} className="flex items-center gap-2 text-accent-blue text-[15px] font-medium mb-4 hover:opacity-80">
          <ArrowLeft size={18} /> Back to Farm Areas
        </button>
        <PageHeader title={selectedSuburb.name} subtitle={`${suburbProperties.length} properties · ${suburbProperties.filter(p => p.score >= 75).length} hot`} />

        <div className="flex gap-2 mb-4">
          {['All', 'Hot', 'Warm', 'Watch'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-[13px] font-medium rounded-full transition-colors ${filter === f ? 'bg-accent-blue text-white' : 'bg-white text-text-secondary shadow-sm hover:bg-bg-hover'}`}>
              {f} {f === 'Hot' ? '≥75' : f === 'Warm' ? '50-74' : f === 'Watch' ? '<50' : ''}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {suburbProperties.map(prop => (
            <div key={prop.id} onClick={() => setSelectedProperty(prop)} className="bg-white rounded-card shadow-card p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
              <ScoreRing score={prop.score} size="sm" showLabel={false} />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-text-primary truncate">{prop.address}</p>
                <p className="text-[13px] text-text-secondary">{prop.owner} · {prop.yearsOwned}yr · {prop.beds}bd/{prop.baths}ba · {prop.size}m²</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {prop.signals.slice(0, 2).map(s => (
                    <span key={s} className="text-[10px] font-medium px-2 py-0.5 rounded-badge bg-accent-orange/10 text-accent-orange">{s}</span>
                  ))}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-mono text-[14px] font-bold text-text-primary">{formatZAR(prop.value)}</p>
                {prop.pipelineStage && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-badge bg-accent-blue/10 text-accent-blue">{prop.pipelineStage}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Farm Areas" subtitle={`${farmedSuburbs.length} areas farmed · ${totalProperties} properties · ${totalHot} hot leads`} />

      <div className="grid lg:grid-cols-2 gap-4">
        <SuburbMap suburbs={suburbs} farmedIds={farmed} onSelectSuburb={setSelectedSuburb} />
        <div className="space-y-2">
          {suburbs.map(sub => (
            <div key={sub.id} onClick={() => farmed.includes(sub.id) ? setSelectedSuburb(sub) : null} className={`bg-white rounded-card shadow-card p-4 flex items-center gap-4 transition-shadow ${farmed.includes(sub.id) ? 'cursor-pointer hover:shadow-md' : 'opacity-60'}`}>
              <ScoreRing score={sub.score} size="sm" showLabel={false} />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-text-primary">{sub.name}</p>
                <p className="text-[13px] text-text-secondary">Avg {formatZAR(sub.avgPrice)} · {sub.growth}% growth · {sub.hotLeads} hot</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); toggleFarm(sub.id); }} className={`px-3 py-1.5 text-[12px] font-medium rounded-button transition-colors ${farmed.includes(sub.id) ? 'bg-accent-green/10 text-accent-green' : 'bg-bg-hover text-text-secondary'}`}>
                {farmed.includes(sub.id) ? 'Farmed' : 'Farm'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
