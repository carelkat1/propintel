"use client";

import { useState } from "react";
import { SUBURBS } from "@/data/suburbs";
import { Suburb } from "@/lib/types";
import SectionTitle from "@/components/shared/section-title";
import CardDark from "@/components/shared/card-dark";
import Btn from "@/components/shared/btn";

type MetricKey = "score" | "growth" | "velocity";

const metrics: Record<MetricKey, { key: MetricKey; label: string; fmt: (v: number) => string; max: number }> = {
  score: { key: "score", label: "Propensity Score", fmt: (v) => String(v), max: 100 },
  growth: { key: "growth", label: "Price Growth", fmt: (v) => v + "%", max: 15 },
  velocity: { key: "velocity", label: "Sales/mo", fmt: (v) => String(v), max: 30 },
};

function getSuburbMetric(s: Suburb, key: MetricKey): number {
  return s[key];
}

export default function HeatmapPage() {
  const [metric, setMetric] = useState<MetricKey>("score");
  const m = metrics[metric];

  return (
    <div>
      <SectionTitle sub="Compare suburbs at a glance to find the best farm areas.">
        🗺 Neighbourhood Heatmap
      </SectionTitle>
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {(Object.entries(metrics) as [MetricKey, typeof m][]).map(([k, v]) => (
          <Btn
            key={k}
            color={metric === k ? "#10b981" : "#475569"}
            variant={metric === k ? "filled" : "ghost"}
            onClick={() => setMetric(k)}
            style={{ fontSize: 11, padding: "5px 12px" }}
          >
            {v.label}
          </Btn>
        ))}
      </div>
      <CardDark className="p-5">
        {[...SUBURBS]
          .sort((a, b) => getSuburbMetric(b, m.key) - getSuburbMetric(a, m.key))
          .map((s, i) => {
            const val = getSuburbMetric(s, m.key);
            const pct = (val / m.max) * 100;
            const heat = pct > 70 ? "#ef4444" : pct > 50 ? "#f97316" : pct > 30 ? "#eab308" : "#22c55e";
            return (
              <div
                key={s.name}
                className="animate-fade-up flex items-center gap-3 mb-1.5"
                style={{ animationDelay: `${i * 0.03}s` }}
              >
                <span className="text-text-secondary text-[11px] w-[110px] text-right font-semibold flex-shrink-0">
                  {s.name}
                </span>
                <div className="flex-1 h-[26px] bg-bg-input rounded-[5px] overflow-hidden flex gap-0.5 p-[3px]">
                  {Array.from({ length: 20 }).map((_, j) => (
                    <div
                      key={j}
                      className="flex-1 rounded-sm transition-colors"
                      style={{
                        background: j < Math.round(pct / 5) ? `${heat}${String(40 + j * 3)}` : "#141c2e",
                        transitionDelay: `${j * 0.02}s`,
                      }}
                    />
                  ))}
                </div>
                <span className="font-mono text-[13px] font-extrabold w-[50px] text-right" style={{ color: heat }}>
                  {m.fmt(val)}
                </span>
              </div>
            );
          })}
      </CardDark>
    </div>
  );
}
