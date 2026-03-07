"use client";

import { useState } from "react";
import { PLATFORMS } from "@/data/otp";
import SectionTitle from "@/components/shared/section-title";
import CardDark from "@/components/shared/card-dark";
import Btn from "@/components/shared/btn";

export default function SyndicatePage() {
  const [on, setOn] = useState<Record<string, boolean>>({ p24: true, pp: true, fb: true, ag: true, iol: false, gt: false });

  return (
    <div>
      <SectionTitle sub="One-click publish to multiple SA property portals.">
        📡 Listing Syndication
      </SectionTitle>

      <CardDark className="p-5 mb-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {PLATFORMS.map((p) => (
            <div
              key={p.k}
              onClick={() => setOn((o) => ({ ...o, [p.k]: !o[p.k] }))}
              className="rounded-lg p-3 cursor-pointer flex justify-between items-center"
              style={{
                background: on[p.k] ? `${p.c}08` : "#0a0f1a",
                border: on[p.k] ? `1px solid ${p.c}35` : "1px solid #1e293b",
              }}
            >
              <span className="text-text-primary text-xs font-semibold">{p.n}</span>
              <div
                className="w-4 h-4 rounded-sm flex items-center justify-center text-[9px]"
                style={{
                  background: on[p.k] ? `${p.c}30` : "#1e293b",
                  border: `1px solid ${on[p.k] ? p.c : "#334155"}`,
                  color: p.c,
                }}
              >
                {on[p.k] && "✓"}
              </div>
            </div>
          ))}
        </div>
      </CardDark>

      <CardDark className="p-5">
        <div className="text-text-primary text-sm font-bold mb-1">Preview — 22 West St, Bryanston</div>
        <div className="text-text-muted text-[11px] mb-3">
          Published to {Object.values(on).filter(Boolean).length} platforms
        </div>
        <div className="grid grid-cols-4 gap-1.5 mb-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[60px] rounded-md bg-gradient-to-br from-border to-bg flex items-center justify-center text-border-hover text-base">
              📷
            </div>
          ))}
        </div>
        <div className="text-brand text-xl font-extrabold font-mono mb-2.5">R 7,100,000</div>
        <div className="flex gap-1.5">
          <Btn color="#10b981">✦ AI Write Description</Btn>
          <Btn color="#0ea5e9" variant="ghost">Publish</Btn>
        </div>
      </CardDark>
    </div>
  );
}
