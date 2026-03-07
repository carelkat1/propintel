"use client";

import { useState } from "react";
import { PRICE_DATA } from "@/data/price-predictions";
import SectionTitle from "@/components/shared/section-title";
import CardDark from "@/components/shared/card-dark";
import Btn from "@/components/shared/btn";

const SUBURB_LIST = ["Sandton Central", "Sandhurst", "Bryanston", "Hyde Park", "Lonehill"];

export default function PredictPage() {
  const [sub, setSub] = useState("Sandton Central");
  const data = PRICE_DATA[sub] || PRICE_DATA["Sandton Central"];

  const W = 650;
  const H = 180;
  const max = sub === "Sandhurst" ? 16 : sub === "Hyde Park" ? 13 : 7;

  const actPts = data
    .filter((d) => d.a !== undefined)
    .map((d) => `${(data.indexOf(d) / 9) * W},${H - ((d.a || 0) / max) * H}`)
    .join(" ");

  const predPts = data
    .filter((d) => d.p !== undefined)
    .map((d) => `${(data.indexOf(d) / 9) * W},${H - ((d.p || 0) / max) * H}`)
    .join(" ");

  return (
    <div>
      <SectionTitle sub="ML-powered suburb price predictions. Help sellers time the market.">
        📈 Area Price Predictor
      </SectionTitle>

      <div className="flex gap-1.5 mb-4 flex-wrap">
        {SUBURB_LIST.map((s) => (
          <Btn
            key={s}
            color={sub === s ? "#10b981" : "#475569"}
            variant={sub === s ? "filled" : "ghost"}
            onClick={() => setSub(s)}
            style={{ fontSize: 10, padding: "5px 10px" }}
          >
            {s}
          </Btn>
        ))}
      </div>

      <CardDark className="p-6">
        <div className="flex justify-between mb-4 flex-wrap gap-2">
          <div>
            <div className="text-text-primary text-base font-bold">{sub}</div>
            <div className="text-text-muted text-[11px]">Avg price/m² — actual vs predicted</div>
          </div>
          <div className="text-right">
            <div className="text-brand text-[22px] font-extrabold font-mono">+13.2%</div>
            <div className="text-text-muted text-[10px]">6-month predicted</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <svg
            width="100%"
            height={H}
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="min-w-[400px]"
          >
            {[0, 1, 2, 3].map((i) => (
              <line
                key={i}
                x1={0}
                y1={(i / 3) * H}
                x2={W}
                y2={(i / 3) * H}
                stroke="#141c2e"
              />
            ))}
            <polyline
              points={actPts}
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <polyline
              points={predPts}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              strokeLinejoin="round"
            />
            <line
              x1={(6 / 9) * W}
              y1={0}
              x2={(6 / 9) * W}
              y2={H}
              stroke="#f59e0b"
              strokeDasharray="4 3"
            />
          </svg>
        </div>

        <div className="flex justify-between mt-1.5">
          {data.map((d) => (
            <span key={d.m} className="text-text-dim text-[9px] font-mono">
              {d.m}
            </span>
          ))}
        </div>

        <div className="flex justify-center gap-5 mt-3">
          {[
            { l: "Actual", c: "#0ea5e9" },
            { l: "Predicted", c: "#10b981" },
            { l: "Today", c: "#f59e0b" },
          ].map((x) => (
            <div key={x.l} className="flex items-center gap-1.5">
              <div className="w-3.5 h-0.5" style={{ background: x.c }} />
              <span className="text-text-muted text-[10px]">{x.l}</span>
            </div>
          ))}
        </div>
      </CardDark>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
        {[
          { l: "3-Month", v: "+6.8%", s: "R5,480/m²", c: "#10b981" },
          { l: "6-Month", v: "+13.2%", s: "R5,910/m²", c: "#0ea5e9" },
          { l: "Best Sell Window", v: "Aug–Sep 26", s: "Peak seasonal + growth", c: "#f59e0b" },
        ].map((p) => (
          <CardDark key={p.l} className="p-3.5" style={{ borderTop: `2px solid ${p.c}` }}>
            <div className="text-text-muted text-[9px] uppercase tracking-wider mb-1">{p.l}</div>
            <div className="font-mono text-xl font-extrabold" style={{ color: p.c }}>
              {p.v}
            </div>
            <div className="text-text-secondary text-[11px]">{p.s}</div>
          </CardDark>
        ))}
      </div>
    </div>
  );
}
