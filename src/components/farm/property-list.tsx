"use client";

import { Property } from "@/lib/types";
import { fmt, scoreColor } from "@/lib/utils";
import { PIPELINE } from "@/data/pipeline";
import CardDark from "@/components/shared/card-dark";
import ScoreGauge from "@/components/shared/score-gauge";
import BadgeCustom from "@/components/shared/badge-custom";
import Btn from "@/components/shared/btn";

interface PropertyListProps {
  properties: Property[];
  onSelect: (p: Property, channel?: string) => void;
}

export default function PropertyList({ properties, onSelect }: PropertyListProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {properties.map((p, i) => {
        const c = scoreColor(p.score);
        return (
          <CardDark
            key={p.id}
            className="feat-card animate-fade-up p-3 md:p-4 flex items-center gap-3 cursor-pointer"
            onClick={() => onSelect(p)}
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            <div className="hidden sm:block">
              <ScoreGauge score={p.score} size={68} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-0.5 flex-wrap">
                <span className="text-text-primary text-[13px] font-bold">{p.address}</span>
                {p.pipelineStage && (
                  <BadgeCustom color={PIPELINE.find((x) => x.key === p.pipelineStage)?.color || "#475569"}>
                    {p.pipelineStage}
                  </BadgeCustom>
                )}
              </div>
              <div className="text-text-muted text-[11px] mb-1">
                {p.owner} · {p.yearsOwned}yr · {fmt(p.value)} · {p.beds}bd/{p.baths}ba · {p.size}m²
              </div>
              <div className="flex gap-1 flex-wrap">
                {p.signals.map((s) => (
                  <span
                    key={s}
                    className="font-mono text-[9px] px-1.5 py-0.5 rounded"
                    style={{
                      background: `${c}10`,
                      color: c,
                      border: `1px solid ${c}20`,
                    }}
                  >
                    {s}
                  </span>
                ))}
                {p.bond > 0 && (
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-score-warm/10 text-score-warm">
                    Bond: {Math.round((p.bond / p.value) * 100)}% LTV
                  </span>
                )}
              </div>
            </div>
            <div className="hidden md:flex flex-col gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              <Btn color="#0ea5e9" variant="ghost" onClick={() => onSelect(p, "email")} style={{ fontSize: 10, padding: "5px 10px" }}>
                ✉ Email
              </Btn>
              <Btn color="#25D366" variant="ghost" onClick={() => onSelect(p, "whatsapp")} style={{ fontSize: 10, padding: "5px 10px" }}>
                💬 WhatsApp
              </Btn>
            </div>
          </CardDark>
        );
      })}
      {properties.length === 0 && (
        <div className="text-center py-10 text-text-dim">No properties match this filter.</div>
      )}
    </div>
  );
}
