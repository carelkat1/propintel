'use client';

import { useState, useEffect } from 'react';
import { FolderOpen, FileText, ChevronDown, ChevronRight, Upload, Package, CheckCircle, Clock } from 'lucide-react';
import PageHeader from '@/components/shared/page-header';
import EmptyState from '@/components/shared/empty-state';
import { getDeals } from '@/lib/store';
import { getStageLabel, getStageColor } from '@/lib/constants';
import { Deal } from '@/lib/types';

const docTypes = [
  { name: 'Referral Agreement', icon: FileText, status: 'signed' },
  { name: 'CMA Report', icon: FileText, status: 'generated' },
  { name: 'Property Disclosure', icon: FileText, status: 'pending' },
  { name: 'Mandate Agreement', icon: FileText, status: 'pending' },
];

export default function DocumentsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => { setDeals(getDeals()); }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  return (
    <div>
      <PageHeader title="Documents" subtitle="Deal documents and packages">
        <button onClick={() => showToast('Document upload coming in Phase 2')} className="flex items-center gap-1.5 px-4 py-2 bg-bg-hover text-text-secondary text-[14px] font-medium rounded-button hover:bg-bg-active">
          <Upload size={16} /> Upload
        </button>
      </PageHeader>

      {deals.length === 0 ? (
        <EmptyState icon={FolderOpen} title="No documents yet" description="Documents will appear here as you progress deals through the pipeline." />
      ) : (
        <div className="space-y-2">
          {deals.map(deal => (
            <div key={deal.id} className="bg-white rounded-card shadow-card overflow-hidden">
              <button onClick={() => setExpanded(expanded === deal.id ? null : deal.id)} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-bg-hover transition-colors">
                {expanded === deal.id ? <ChevronDown size={16} className="text-text-tertiary" /> : <ChevronRight size={16} className="text-text-tertiary" />}
                <FolderOpen size={18} className="text-accent-blue" />
                <div className="flex-1 text-left">
                  <p className="text-[14px] font-semibold text-text-primary">{deal.property}</p>
                  <p className="text-[12px] text-text-tertiary">{deal.seller} · {deal.suburb}</p>
                </div>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-badge" style={{ backgroundColor: getStageColor(deal.stage) + '15', color: getStageColor(deal.stage) }}>
                  {getStageLabel(deal.stage)}
                </span>
                <span className="text-[12px] text-text-tertiary">{docTypes.length} docs</span>
              </button>
              {expanded === deal.id && (
                <div className="px-5 pb-4 space-y-1.5 border-t border-black/[0.04] pt-3">
                  {docTypes.map(doc => (
                    <div key={doc.name} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-bg-hover transition-colors">
                      <doc.icon size={16} className="text-text-tertiary" />
                      <span className="flex-1 text-[13px] text-text-primary">{doc.name}</span>
                      <div className="flex items-center gap-1">
                        {doc.status === 'signed' ? (
                          <><CheckCircle size={14} className="text-accent-green" /><span className="text-[11px] text-accent-green font-medium">Signed</span></>
                        ) : doc.status === 'generated' ? (
                          <><CheckCircle size={14} className="text-accent-blue" /><span className="text-[11px] text-accent-blue font-medium">Generated</span></>
                        ) : (
                          <><Clock size={14} className="text-text-tertiary" /><span className="text-[11px] text-text-tertiary font-medium">Pending</span></>
                        )}
                      </div>
                    </div>
                  ))}
                  {['assigned', 'mandate'].includes(deal.stage) && (
                    <button onClick={() => showToast('Handoff package generation coming soon')} className="mt-2 flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-accent-purple bg-accent-purple/10 rounded-button hover:bg-accent-purple/20 transition-colors">
                      <Package size={14} /> Generate Handoff Package
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-text-primary text-white text-[14px] font-medium px-5 py-3 rounded-xl shadow-elevated animate-fade-in-up">
          {toast}
        </div>
      )}
    </div>
  );
}
