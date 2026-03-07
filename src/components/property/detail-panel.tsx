"use client";

import { Property } from "@/lib/types";
import { fmt, scoreColor } from "@/lib/utils";
import Btn from "@/components/shared/btn";

interface DetailPanelProps {
  property: Property;
  onClose: () => void;
  onCompose: (channel: string) => void;
}

export default function DetailPanel({ property: p, onClose, onCompose }: DetailPanelProps) {
  const c = scoreColor(p.score);
  const equity = p.value - p.bond;
  const bondRatio = p.bond > 0 ? Math.round((p.bond / p.value) * 100) : 0;
  const growth = Math.round(((p.value - p.lastSale) / p.lastSale) * 100);

  return (
    <div className="fixed top-0 right-0 bottom-0 w-full md:w-[400px] bg-bg-card border-l border-border z-[100] overflow-y-auto animate-slide-in shadow-[-20px_0_60px_rgba(0,0,0,0.5)]">
      {/* Header */}
      <div className="p-4 border-b border-border flex justify-between items-start">
        <div>
          <div className="text-text-primary text-base font-bold">{p.address}</div>
          <div className="text-text-muted text-xs mt-0.5">
            Score: <span style={{ color: c }} className="font-extrabold">{p.score}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="bg-[#1a2332] border-none text-text-muted w-[30px] h-[30px] rounded-lg text-base cursor-pointer hover:text-text-primary"
        >
          ×
        </button>
      </div>

      {/* Actions */}
      <div className="p-4 flex gap-2 border-b border-border">
        <Btn color="#0ea5e9" variant="ghost" onClick={() => onCompose("email")} style={{ flex: 1, fontSize: 11 }}>
          ✉ Email
        </Btn>
        <Btn color="#25D366" onClick={() => onCompose("whatsapp")} style={{ flex: 1, fontSize: 11 }}>
          💬 WhatsApp
        </Btn>
      </div>

      {/* Owner */}
      <div className="p-4 border-b border-border">
        <div className="text-text-muted text-[10px] font-bold tracking-wider uppercase mb-2">Owner</div>
        <div className="text-text-primary text-sm font-semibold">{p.owner}</div>
        <div className="text-text-secondary text-xs font-mono mt-0.5">{p.phone}</div>
        <div className="text-text-secondary text-xs font-mono">{p.email}</div>
      </div>

      {/* Signals */}
      <div className="p-4 border-b border-border">
        <div className="text-text-muted text-[10px] font-bold tracking-wider uppercase mb-2">Signals</div>
        {p.signals.map((s) => (
          <div key={s} className="flex items-center gap-1.5 mb-1">
            <div
              className="w-[5px] h-[5px] rounded-full"
              style={{ background: c, boxShadow: `0 0 6px ${c}80` }}
            />
            <span className="text-text-primary text-xs">{s}</span>
          </div>
        ))}
      </div>

      {/* Property Data */}
      <div className="p-4 border-b border-border">
        <div className="text-text-muted text-[10px] font-bold tracking-wider uppercase mb-2">Property Data</div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { l: "Current Value", v: fmt(p.value), s: `+${growth}% since purchase` },
            { l: "Last Sale", v: fmt(p.lastSale) },
            { l: "Bond", v: p.bond > 0 ? fmt(p.bond) : "Clear", s: bondRatio > 0 ? `${bondRatio}% LTV` : "" },
            { l: "Equity", v: fmt(equity) },
            { l: "Ownership", v: `${p.yearsOwned} years` },
            { l: "Size", v: `${p.size}m²` },
          ].map((m) => (
            <div key={m.l} className="bg-bg-input rounded-md p-2">
              <div className="text-text-muted text-[9px]">{m.l}</div>
              <div className="text-text-primary text-[13px] font-bold font-mono">{m.v}</div>
              {m.s && <div className="text-text-dim text-[9px]">{m.s}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Specs */}
      <div className="p-4">
        <div className="flex gap-2.5">
          {[
            { l: "Beds", v: p.beds },
            { l: "Baths", v: p.baths },
            ...(p.erf > 0 ? [{ l: "Erf", v: `${p.erf}m²` }] : []),
          ].map((x) => (
            <div key={x.l} className="text-center">
              <div className="text-text-primary text-[15px] font-bold font-mono">{x.v}</div>
              <div className="text-text-muted text-[10px]">{x.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
