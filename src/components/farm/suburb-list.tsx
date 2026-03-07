"use client";

import { Suburb } from "@/lib/types";
import { fmt, scoreColor } from "@/lib/utils";
import CardDark from "@/components/shared/card-dark";
import BadgeCustom from "@/components/shared/badge-custom";

interface SuburbListProps {
  suburbs: Suburb[];
  farmed: string[];
  onToggle: (name: string) => void;
  onDrill: (name: string) => void;
}

export default function SuburbList({ suburbs, farmed, onToggle, onDrill }: SuburbListProps) {
  const sorted = [...suburbs].sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[400px]">
      {sorted.map((s) => {
        const isFarmed = farmed.includes(s.name);
        return (
          <CardDark
            key={s.name}
            className="feat-card p-2.5 cursor-pointer"
            onClick={() => (isFarmed ? onDrill(s.name) : undefined)}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-text-primary text-xs font-bold">{s.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(s.name);
                }}
                className="px-2 py-0.5 rounded-[5px] text-[9px] font-bold cursor-pointer"
                style={{
                  background: isFarmed ? "#10b98120" : "#1e293b",
                  border: isFarmed ? "1px solid #10b98140" : "1px solid #334155",
                  color: isFarmed ? "#10b981" : "#64748b",
                }}
              >
                {isFarmed ? "✓ Farmed" : "+ Add"}
              </button>
            </div>
            <div className="flex gap-2 text-text-secondary text-[10px]">
              <span>{fmt(s.avgPrice)}</span>
              <span className="text-brand">↑{s.growth}%</span>
              <span>{s.stock} props</span>
            </div>
            <div className="flex gap-1 mt-1">
              <BadgeCustom color={scoreColor(s.score)}>Score {s.score}</BadgeCustom>
              <BadgeCustom color="#ef4444">{s.hotLeads} hot</BadgeCustom>
            </div>
          </CardDark>
        );
      })}
    </div>
  );
}
