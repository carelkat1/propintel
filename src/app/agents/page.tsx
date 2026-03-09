'use client';

import { useState, useEffect } from 'react';
import { Plus, MoreVertical, X, Star } from 'lucide-react';
import PageHeader from '@/components/shared/page-header';
import EmptyState from '@/components/shared/empty-state';
import { getAgents, setAgents as saveAgents, addActivity } from '@/lib/store';
import { formatZAR, getInitials, agentGradient, generateId } from '@/lib/utils';
import { Agent } from '@/lib/types';
import { Users } from 'lucide-react';

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editAgent, setEditAgent] = useState<Agent | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  useEffect(() => { setAgents(getAgents().filter(a => a.status === 'active')); }, []);

  const [form, setForm] = useState({ name: '', phone: '+27 ', email: '', agency: '', area: '', split: 30, ffc: '', notes: '' });

  function openAdd() {
    setForm({ name: '', phone: '+27 ', email: '', agency: '', area: '', split: 30, ffc: '', notes: '' });
    setEditAgent(null);
    setShowForm(true);
  }

  function openEdit(agent: Agent) {
    setForm({ name: agent.name, phone: agent.phone, email: agent.email, agency: agent.agency, area: agent.area, split: agent.split, ffc: agent.ffc, notes: agent.notes });
    setEditAgent(agent);
    setShowForm(true);
    setMenuOpen(null);
  }

  function saveAgent() {
    if (!form.name || !form.phone || form.phone.length < 10) return;
    let updated: Agent[];
    if (editAgent) {
      updated = agents.map(a => a.id === editAgent.id ? { ...a, ...form } : a);
      addActivity({ type: 'assignment', message: `Updated agent ${form.name}` });
    } else {
      const newAgent: Agent = { ...form, id: generateId(), rating: 0, deals: 0, avgDays: 0, earned: 0, activeLeads: 0, status: 'active', createdAt: new Date().toISOString() };
      updated = [newAgent, ...agents];
      addActivity({ type: 'assignment', message: `Added new agent ${form.name}` });
    }
    setAgents(updated);
    saveAgents(updated);
    setShowForm(false);
  }

  function removeAgent(id: string) {
    const updated = agents.map(a => a.id === id ? { ...a, status: 'inactive' as const } : a);
    saveAgents(updated);
    setAgents(updated.filter(a => a.status === 'active'));
    setMenuOpen(null);
    addActivity({ type: 'assignment', message: `Removed agent from active network` });
  }

  const sampleComm = form.split ? Math.round(5000000 * 0.06 * (form.split / 100)) : 0;

  return (
    <div>
      <PageHeader title="Agents" subtitle={`${agents.length} active agents in your network`}>
        <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2 bg-accent-blue text-white text-[14px] font-medium rounded-button hover:opacity-90 transition-opacity">
          <Plus size={16} /> Add Agent
        </button>
      </PageHeader>

      {agents.length === 0 ? (
        <EmptyState icon={Users} title="No agents yet" description="Add partner agents to your network to start assigning leads." action={{ label: 'Add Agent', onClick: openAdd }} />
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {agents.map(agent => (
            <div key={agent.id} className="bg-white rounded-card shadow-card p-4 hover:shadow-md transition-shadow relative">
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${agentGradient(agent.name)} flex items-center justify-center text-white text-[14px] font-bold flex-shrink-0`}>
                  {getInitials(agent.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[15px] font-semibold text-text-primary truncate">{agent.name}</p>
                    <div className="flex items-center gap-0.5 text-[12px] text-accent-orange font-medium">
                      <Star size={12} fill="#FF9500" /> {agent.rating}
                    </div>
                  </div>
                  <p className="text-[13px] text-text-secondary">{agent.agency}</p>
                  <p className="text-[12px] text-text-tertiary">{agent.area}</p>
                </div>
                <div className="relative">
                  <button onClick={() => setMenuOpen(menuOpen === agent.id ? null : agent.id)} className="p-1 rounded-lg hover:bg-bg-hover">
                    <MoreVertical size={16} className="text-text-tertiary" />
                  </button>
                  {menuOpen === agent.id && (
                    <div className="absolute right-0 top-8 bg-white rounded-xl shadow-elevated border border-black/[0.06] py-1 z-10 min-w-[140px]">
                      <button onClick={() => openEdit(agent)} className="w-full text-left px-4 py-2 text-[13px] text-text-primary hover:bg-bg-hover">Edit</button>
                      <button onClick={() => removeAgent(agent.id)} className="w-full text-left px-4 py-2 text-[13px] text-accent-red hover:bg-bg-hover">Remove</button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-black/[0.04]">
                <div className="text-center flex-1"><p className="font-mono text-[14px] font-bold text-text-primary">{agent.deals}</p><p className="text-[10px] text-text-tertiary">Deals</p></div>
                <div className="text-center flex-1"><p className="font-mono text-[14px] font-bold text-text-primary">{agent.avgDays}d</p><p className="text-[10px] text-text-tertiary">Avg Close</p></div>
                <div className="text-center flex-1"><p className="font-mono text-[14px] font-bold text-accent-orange">{agent.split}%</p><p className="text-[10px] text-text-tertiary">Split</p></div>
                <div className="text-center flex-1"><p className="font-mono text-[14px] font-bold text-accent-green">{formatZAR(agent.earned)}</p><p className="text-[10px] text-text-tertiary">Earned</p></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-modal shadow-elevated w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[20px] font-bold text-text-primary">{editAgent ? 'Edit Agent' : 'Add Agent'}</h3>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-bg-hover"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[13px] font-medium text-text-secondary block mb-1">Full Name *</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2.5 bg-bg-input rounded-input text-[15px] text-text-primary border border-black/[0.06] focus:border-accent-blue focus:outline-none" placeholder="e.g. John Smith" />
              </div>
              <div>
                <label className="text-[13px] font-medium text-text-secondary block mb-1">Phone *</label>
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-3 py-2.5 bg-bg-input rounded-input text-[15px] text-text-primary font-mono border border-black/[0.06] focus:border-accent-blue focus:outline-none" placeholder="+27 XX XXX XXXX" />
              </div>
              <div>
                <label className="text-[13px] font-medium text-text-secondary block mb-1">Email</label>
                <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} type="email" className="w-full px-3 py-2.5 bg-bg-input rounded-input text-[15px] text-text-primary border border-black/[0.06] focus:border-accent-blue focus:outline-none" placeholder="agent@agency.co.za" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[13px] font-medium text-text-secondary block mb-1">Agency</label>
                  <input value={form.agency} onChange={e => setForm({...form, agency: e.target.value})} className="w-full px-3 py-2.5 bg-bg-input rounded-input text-[15px] text-text-primary border border-black/[0.06] focus:border-accent-blue focus:outline-none" placeholder="e.g. RE/MAX" />
                </div>
                <div>
                  <label className="text-[13px] font-medium text-text-secondary block mb-1">Area</label>
                  <input value={form.area} onChange={e => setForm({...form, area: e.target.value})} className="w-full px-3 py-2.5 bg-bg-input rounded-input text-[15px] text-text-primary border border-black/[0.06] focus:border-accent-blue focus:outline-none" placeholder="e.g. Sandton" />
                </div>
              </div>
              <div>
                <label className="text-[13px] font-medium text-text-secondary block mb-1">Referral Split: {form.split}%</label>
                <input type="range" min={20} max={40} value={form.split} onChange={e => setForm({...form, split: parseInt(e.target.value)})} className="w-full accent-accent-blue" />
                <p className="text-[12px] text-text-tertiary mt-1">On a R5M sale at 6%, you&apos;d earn <span className="font-mono font-semibold text-accent-green">{formatZAR(sampleComm)}</span></p>
              </div>
              <div>
                <label className="text-[13px] font-medium text-text-secondary block mb-1">FFC Number</label>
                <input value={form.ffc} onChange={e => setForm({...form, ffc: e.target.value})} className="w-full px-3 py-2.5 bg-bg-input rounded-input text-[15px] text-text-primary border border-black/[0.06] focus:border-accent-blue focus:outline-none" placeholder="Optional" />
              </div>
              <div>
                <label className="text-[13px] font-medium text-text-secondary block mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3} className="w-full px-3 py-2.5 bg-bg-input rounded-input text-[15px] text-text-primary border border-black/[0.06] focus:border-accent-blue focus:outline-none resize-none" placeholder="Optional notes..." />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 bg-bg-hover text-text-secondary text-[15px] font-medium rounded-button hover:bg-bg-active">Cancel</button>
              <button onClick={saveAgent} disabled={!form.name || !form.phone || form.phone.length < 10} className="flex-1 px-4 py-2.5 bg-accent-blue text-white text-[15px] font-medium rounded-button hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed">
                {editAgent ? 'Save Changes' : 'Add Agent'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
