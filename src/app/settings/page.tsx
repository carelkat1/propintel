'use client';

import { useState, useEffect } from 'react';
import { Check, AlertTriangle, RotateCcw, Download, Eye, EyeOff } from 'lucide-react';
import PageHeader from '@/components/shared/page-header';
import { getSettings, setSettings as saveSettings, resetAllData } from '@/lib/store';
import { Settings } from '@/lib/types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [showKey, setShowKey] = useState(false);
  const [showLSKey, setShowLSKey] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setSettings(getSettings()); }, []);

  function update(path: string, value: string | number | boolean) {
    if (!settings) return;
    const keys = path.split('.');
    const updated = JSON.parse(JSON.stringify(settings));
    let obj = updated;
    for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
    obj[keys[keys.length - 1]] = value;
    setSettings(updated);
    saveSettings(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function testClaudeKey() {
    setTestStatus('testing');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system: 'Reply with just "OK"', messages: [{ role: 'user', content: 'Test' }] }),
      });
      setTestStatus(res.ok ? 'success' : 'error');
    } catch { setTestStatus('error'); }
    setTimeout(() => setTestStatus('idle'), 3000);
  }

  function handleReset() {
    resetAllData();
    setSettings(getSettings());
    setShowConfirmReset(false);
  }

  function exportData() {
    const data = { settings, agents: localStorage.getItem('propscout_agents'), deals: localStorage.getItem('propscout_deals'), properties: localStorage.getItem('propscout_properties') };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'propscout-export.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!settings) return null;

  return (
    <div>
      <PageHeader title="Settings" subtitle="Profile, integrations, and preferences" />

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <section className="bg-white rounded-card shadow-card p-5">
          <h3 className="text-[17px] font-semibold text-text-primary mb-4">Profile</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: 'Name', path: 'profile.name', value: settings.profile.name },
              { label: 'Email', path: 'profile.email', value: settings.profile.email },
              { label: 'Phone', path: 'profile.phone', value: settings.profile.phone },
              { label: 'PPRA FFC #', path: 'profile.ffc', value: settings.profile.ffc },
              { label: 'Company', path: 'profile.company', value: settings.profile.company },
            ].map(field => (
              <div key={field.path}>
                <label className="text-[13px] font-medium text-text-secondary block mb-1">{field.label}</label>
                <input value={field.value} onChange={e => update(field.path, e.target.value)} className="w-full px-3 py-2.5 bg-bg-input rounded-input text-[15px] text-text-primary border border-black/[0.06] focus:border-accent-blue focus:outline-none" />
              </div>
            ))}
          </div>
        </section>

        {/* Integrations */}
        <section className="bg-white rounded-card shadow-card p-5">
          <h3 className="text-[17px] font-semibold text-text-primary mb-4">Integrations</h3>

          {/* Claude */}
          <div className="mb-4">
            <label className="text-[13px] font-medium text-text-secondary block mb-1">Anthropic Claude API Key</label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={settings.integrations.anthropicKey}
                  onChange={e => update('integrations.anthropicKey', e.target.value)}
                  className="w-full px-3 py-2.5 pr-10 bg-bg-input rounded-input text-[15px] text-text-primary font-mono border border-black/[0.06] focus:border-accent-blue focus:outline-none"
                  placeholder="sk-ant-..."
                />
                <button onClick={() => setShowKey(!showKey)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1">
                  {showKey ? <EyeOff size={16} className="text-text-tertiary" /> : <Eye size={16} className="text-text-tertiary" />}
                </button>
              </div>
              <button onClick={testClaudeKey} disabled={testStatus === 'testing'} className={`px-4 py-2.5 text-[13px] font-medium rounded-button transition-colors ${testStatus === 'success' ? 'bg-accent-green/10 text-accent-green' : testStatus === 'error' ? 'bg-accent-red/10 text-accent-red' : 'bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20'}`}>
                {testStatus === 'testing' ? 'Testing...' : testStatus === 'success' ? '✓ Connected' : testStatus === 'error' ? '✗ Failed' : 'Test'}
              </button>
            </div>
          </div>

          {/* Lightstone */}
          <div className="mb-4">
            <label className="text-[13px] font-medium text-text-secondary block mb-1">Lightstone API Key (Primary)</label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type={showLSKey ? 'text' : 'password'}
                  value={settings.integrations.lightstoneKey}
                  onChange={e => update('integrations.lightstoneKey', e.target.value)}
                  className="w-full px-3 py-2.5 pr-10 bg-bg-input rounded-input text-[15px] text-text-primary font-mono border border-black/[0.06] focus:border-accent-blue focus:outline-none"
                  placeholder="Primary key..."
                />
                <button onClick={() => setShowLSKey(!showLSKey)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1">
                  {showLSKey ? <EyeOff size={16} className="text-text-tertiary" /> : <Eye size={16} className="text-text-tertiary" />}
                </button>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-[13px] font-medium text-text-secondary block mb-1">Lightstone Secondary Key</label>
            <input
              type="password"
              value={settings.integrations.lightstoneSecondaryKey}
              onChange={e => update('integrations.lightstoneSecondaryKey', e.target.value)}
              className="w-full px-3 py-2.5 bg-bg-input rounded-input text-[15px] text-text-primary font-mono border border-black/[0.06] focus:border-accent-blue focus:outline-none"
              placeholder="Secondary key..."
            />
          </div>

          <div className="opacity-50">
            <label className="text-[13px] font-medium text-text-secondary block mb-1">WhatsApp Business ID <span className="text-accent-orange">Phase 2</span></label>
            <input disabled className="w-full px-3 py-2.5 bg-bg-input rounded-input text-[15px] text-text-placeholder border border-black/[0.06]" placeholder="Coming in Phase 2" />
          </div>
        </section>

        {/* Defaults */}
        <section className="bg-white rounded-card shadow-card p-5">
          <h3 className="text-[17px] font-semibold text-text-primary mb-4">Defaults</h3>
          <div className="space-y-4">
            <div>
              <label className="text-[13px] font-medium text-text-secondary block mb-1">Commission %: {settings.defaults.commissionPercent}%</label>
              <input type="range" min={3} max={8} step={0.5} value={settings.defaults.commissionPercent} onChange={e => update('defaults.commissionPercent', parseFloat(e.target.value))} className="w-full accent-accent-blue" />
            </div>
            <div>
              <label className="text-[13px] font-medium text-text-secondary block mb-1">Default Split %: {settings.defaults.splitPercent}%</label>
              <input type="range" min={20} max={40} value={settings.defaults.splitPercent} onChange={e => update('defaults.splitPercent', parseInt(e.target.value))} className="w-full accent-accent-blue" />
            </div>
            <div>
              <label className="text-[13px] font-medium text-text-secondary block mb-1">Preferred Channel</label>
              <div className="flex gap-2">
                {['email', 'whatsapp'].map(ch => (
                  <button key={ch} onClick={() => update('defaults.preferredChannel', ch)} className={`px-4 py-2 text-[13px] font-medium rounded-button transition-colors ${settings.defaults.preferredChannel === ch ? 'bg-accent-blue text-white' : 'bg-bg-hover text-text-secondary'}`}>
                    {ch === 'email' ? '✉ Email' : '💬 WhatsApp'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Data Management */}
        <section className="bg-white rounded-card shadow-card p-5">
          <h3 className="text-[17px] font-semibold text-text-primary mb-4">Data Management</h3>
          <div className="flex gap-3">
            <button onClick={() => setShowConfirmReset(true)} className="flex items-center gap-1.5 px-4 py-2 bg-accent-red/10 text-accent-red text-[13px] font-medium rounded-button hover:bg-accent-red/20">
              <RotateCcw size={14} /> Reset All Data
            </button>
            <button onClick={exportData} className="flex items-center gap-1.5 px-4 py-2 bg-bg-hover text-text-secondary text-[13px] font-medium rounded-button hover:bg-bg-active">
              <Download size={14} /> Export JSON
            </button>
          </div>
        </section>
      </div>

      {/* Saved toast */}
      {saved && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-accent-green text-white text-[14px] font-medium px-5 py-3 rounded-xl shadow-elevated flex items-center gap-2 animate-fade-in-up">
          <Check size={16} /> Settings saved
        </div>
      )}

      {/* Reset confirmation */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20" onClick={() => setShowConfirmReset(false)} />
          <div className="relative bg-white rounded-modal shadow-elevated p-6 max-w-sm">
            <AlertTriangle size={32} className="text-accent-red mx-auto mb-3" />
            <h3 className="text-[17px] font-bold text-text-primary text-center mb-2">Reset All Data?</h3>
            <p className="text-[14px] text-text-secondary text-center mb-4">This will clear all agents, deals, and settings and reload seed data. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirmReset(false)} className="flex-1 px-4 py-2.5 bg-bg-hover text-text-secondary text-[14px] font-medium rounded-button">Cancel</button>
              <button onClick={handleReset} className="flex-1 px-4 py-2.5 bg-accent-red text-white text-[14px] font-medium rounded-button">Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
