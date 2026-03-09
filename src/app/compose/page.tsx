'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Copy, CheckCircle, Send, Sparkles, Settings } from 'lucide-react';
import PageHeader from '@/components/shared/page-header';
import SegmentedControl from '@/components/shared/segmented-control';
import { generateMessage, SYSTEM_PROMPTS } from '@/lib/claude';
import { getSettings } from '@/lib/store';
import Link from 'next/link';

export default function ComposePage() {
  const [channel, setChannel] = useState('Email');
  const [strategy, setStrategy] = useState('Intro');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [displayedMsg, setDisplayedMsg] = useState('');
  const [hasKey, setHasKey] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const settings = getSettings();
    setHasKey(!!settings.integrations.anthropicKey || !!process.env.NEXT_PUBLIC_HAS_API_KEY);
    generate();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    generate();
  }, [channel, strategy]);

  // Typewriter
  useEffect(() => {
    if (!message) return;
    let i = 0;
    setDisplayedMsg('');
    const interval = setInterval(() => {
      if (i < message.length) {
        setDisplayedMsg(prev => prev + message[i]);
        i++;
      } else clearInterval(interval);
    }, 12);
    return () => clearInterval(interval);
  }, [message]);

  async function generate() {
    setLoading(true);
    setMessage('');
    setDisplayedMsg('');
    const prompt = `Draft a ${strategy.toLowerCase()} ${channel.toLowerCase()} message to a property owner in Sandton, Johannesburg. The property is valued at R5.2M, owner has lived there 12 years, high equity position. ${channel === 'WhatsApp' ? 'Keep it under 60 words, casual but professional.' : 'Keep it under 150 words, professional tone.'} Strategy: ${strategy}.`;
    const result = await generateMessage(prompt, SYSTEM_PROMPTS.sellerOutreach);
    setMessage(result);
    setLoading(false);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(displayedMsg || message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!hasKey) {
    return (
      <div>
        <PageHeader title="AI Compose" subtitle="Generate personalised seller outreach" />
        <div className="bg-white rounded-card shadow-card p-8 text-center">
          <Sparkles size={40} className="text-accent-purple mx-auto mb-4" />
          <h3 className="text-[17px] font-semibold text-text-primary mb-2">Connect Claude AI</h3>
          <p className="text-[15px] text-text-secondary mb-4">AI features require an Anthropic API key to generate personalised messages.</p>
          <Link href="/settings" className="inline-flex items-center gap-2 px-4 py-2 bg-accent-purple text-white text-[14px] font-medium rounded-button hover:opacity-90">
            <Settings size={16} /> Add API Key in Settings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="AI Compose" subtitle="Generate personalised seller outreach" />

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-card shadow-card p-5">
          {/* Channel toggle */}
          <div className="flex items-center justify-between mb-4">
            <SegmentedControl options={['Email', 'WhatsApp']} value={channel} onChange={setChannel} />
            <span className="text-[12px] text-text-tertiary">{channel === 'Email' ? '~150 words' : '~60 words'}</span>
          </div>

          {/* Strategy */}
          <div className="flex gap-2 mb-4">
            {['Intro', 'Market Update', 'Equity Lead'].map(s => (
              <button key={s} onClick={() => setStrategy(s)} className={`px-3 py-1.5 text-[13px] font-medium rounded-full transition-colors ${strategy === s ? 'bg-accent-purple text-white' : 'bg-bg-hover text-text-secondary hover:bg-bg-active'}`}>
                {s}
              </button>
            ))}
          </div>

          {/* AI Message */}
          <div className="bg-gradient-to-br from-purple-50/50 to-indigo-50/50 rounded-xl p-4 min-h-[150px] mb-4 border border-accent-purple/10">
            {loading ? (
              <div className="flex items-center gap-1.5 py-4">
                <span className="w-2 h-2 bg-accent-purple rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-accent-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-accent-purple rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : (
              <p className="text-[14px] text-text-primary leading-relaxed whitespace-pre-wrap">{displayedMsg}<span className="animate-pulse">|</span></p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button onClick={generate} disabled={loading} className="flex items-center gap-1.5 px-4 py-2 bg-accent-purple/10 text-accent-purple text-[13px] font-medium rounded-button hover:bg-accent-purple/20 disabled:opacity-40">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Regenerate
            </button>
            <button onClick={copyToClipboard} className="flex items-center gap-1.5 px-4 py-2 bg-bg-hover text-text-secondary text-[13px] font-medium rounded-button hover:bg-bg-active">
              {copied ? <><CheckCircle size={14} className="text-accent-green" /> Copied</> : <><Copy size={14} /> Copy</>}
            </button>
            <button className={`flex items-center gap-1.5 px-4 py-2 text-white text-[13px] font-medium rounded-button hover:opacity-90 ${channel === 'WhatsApp' ? 'bg-whatsapp' : 'bg-accent-teal'}`}>
              <Send size={14} /> Mark as Sent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
