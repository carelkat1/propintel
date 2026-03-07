"use client";

import { useState } from "react";
import { SUBURBS } from "@/data/suburbs";
import { PROPERTIES_BY_SUBURB } from "@/data/properties";
import { Property } from "@/lib/types";
import SectionTitle from "@/components/shared/section-title";
import CardDark from "@/components/shared/card-dark";
import Btn from "@/components/shared/btn";
import SuburbMapWrapper from "@/components/farm/suburb-map-wrapper";
import SuburbList from "@/components/farm/suburb-list";
import PropertyList from "@/components/farm/property-list";
import DetailPanel from "@/components/property/detail-panel";
import AIComposer from "@/components/property/ai-composer";

export default function FarmPage() {
  const [farmed, setFarmed] = useState(["Sandhurst", "Bryanston", "Lonehill", "Sandton Central"]);
  const [drillSuburb, setDrillSuburb] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("score");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [selectedProp, setSelectedProp] = useState<Property | null>(null);
  const [composer, setComposer] = useState<{ property: Property; channel: string } | null>(null);

  const toggle = (name: string) =>
    setFarmed((f) => (f.includes(name) ? f.filter((x) => x !== name) : [...f, name]));

  const totalProps = farmed.reduce((s, n) => s + (SUBURBS.find((x) => x.name === n)?.stock || 0), 0);
  const totalHot = farmed.reduce((s, n) => s + (SUBURBS.find((x) => x.name === n)?.hotLeads || 0), 0);

  const handleSelectProperty = (p: Property, channel?: string) => {
    setSelectedProp(p);
    if (channel) setComposer({ property: p, channel });
  };

  if (drillSuburb) {
    const suburb = SUBURBS.find((s) => s.name === drillSuburb);
    let props = PROPERTIES_BY_SUBURB[drillSuburb] || [];
    if (scoreFilter === "hot") props = props.filter((p) => p.score >= 75);
    else if (scoreFilter === "warm") props = props.filter((p) => p.score >= 50 && p.score < 75);
    else if (scoreFilter === "watch") props = props.filter((p) => p.score < 50);
    props = [...props].sort((a, b) => (sortBy === "score" ? b.score - a.score : b.yearsOwned - a.yearsOwned));

    return (
      <div>
        <SectionTitle
          sub={`${props.length} properties tracked · Avg score ${suburb?.score} · ${suburb?.growth}% 12-month growth`}
          right={
            <Btn color="#475569" variant="ghost" onClick={() => setDrillSuburb(null)} style={{ fontSize: 11 }}>
              ← Back to Suburbs
            </Btn>
          }
        >
          ⊕ {drillSuburb} — Properties
        </SectionTitle>

        <div className="flex gap-1.5 mb-4 flex-wrap">
          {[
            { l: "All", v: "all" },
            { l: "🔥 Hot ≥75", v: "hot" },
            { l: "Warm 50-74", v: "warm" },
            { l: "Watch <50", v: "watch" },
          ].map((f) => (
            <Btn
              key={f.v}
              color={scoreFilter === f.v ? "#10b981" : "#475569"}
              variant={scoreFilter === f.v ? "filled" : "ghost"}
              onClick={() => setScoreFilter(f.v)}
              style={{ fontSize: 10, padding: "5px 12px" }}
            >
              {f.l}
            </Btn>
          ))}
          <div className="flex-1" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2.5 py-1.5 rounded-md bg-bg-card border border-border text-text-secondary text-[11px] font-mono"
          >
            <option value="score">Sort: Score</option>
            <option value="years">Sort: Years Owned</option>
          </select>
        </div>

        <PropertyList properties={props} onSelect={handleSelectProperty} />

        {selectedProp && !composer && (
          <DetailPanel
            property={selectedProp}
            onClose={() => setSelectedProp(null)}
            onCompose={(ch) => setComposer({ property: selectedProp, channel: ch })}
          />
        )}
        {composer && (
          <AIComposer
            property={composer.property}
            channel={composer.channel}
            onClose={() => setComposer(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <SectionTitle sub="Define target suburbs. Click any farmed suburb to drill down into individual properties.">
        ⊕ Area Farming Tool
      </SectionTitle>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-4">
        {[
          { l: "Farmed Suburbs", v: farmed.length, c: "#10b981" },
          { l: "Total Properties", v: totalProps, c: "#0ea5e9" },
          { l: "Hot Leads", v: totalHot, c: "#ef4444" },
          { l: "Monthly Cost", v: `~R${farmed.length * 149}`, c: "#eab308" },
        ].map((s) => (
          <CardDark key={s.l} className="p-3.5">
            <div className="text-text-muted text-[10px] mb-0.5">{s.l}</div>
            <div className="text-xl font-extrabold font-mono" style={{ color: s.c }}>
              {s.v}
            </div>
          </CardDark>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-3">
        <CardDark className="p-0.5 overflow-hidden relative min-h-[400px]">
          <SuburbMapWrapper
            suburbs={SUBURBS}
            farmed={farmed}
            onToggle={toggle}
            onDrill={setDrillSuburb}
          />
        </CardDark>
        <SuburbList
          suburbs={SUBURBS}
          farmed={farmed}
          onToggle={toggle}
          onDrill={setDrillSuburb}
        />
      </div>

      {selectedProp && !composer && (
        <DetailPanel
          property={selectedProp}
          onClose={() => setSelectedProp(null)}
          onCompose={(ch) => setComposer({ property: selectedProp, channel: ch })}
        />
      )}
      {composer && (
        <AIComposer
          property={composer.property}
          channel={composer.channel}
          onClose={() => setComposer(null)}
        />
      )}
    </div>
  );
}
