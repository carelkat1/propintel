"use client";

import { useState } from "react";
import { PIPELINE, ACTIVITY } from "@/data/pipeline";
import { PROPERTIES_BY_SUBURB } from "@/data/properties";
import { Property } from "@/lib/types";
import { fmt } from "@/lib/utils";
import SectionTitle from "@/components/shared/section-title";
import CardDark from "@/components/shared/card-dark";
import Btn from "@/components/shared/btn";
import ScoreGauge from "@/components/shared/score-gauge";
import BadgeCustom from "@/components/shared/badge-custom";
import DetailPanel from "@/components/property/detail-panel";
import AIComposer from "@/components/property/ai-composer";

export default function CRMPage() {
  const [tab, setTab] = useState("pipeline");
  const [selectedProp, setSelectedProp] = useState<Property | null>(null);
  const [composer, setComposer] = useState<{ property: Property; channel: string } | null>(null);
  const allProps = Object.values(PROPERTIES_BY_SUBURB).flat();

  const handleSelectProperty = (p: Property, channel?: string) => {
    setSelectedProp(p);
    if (channel) setComposer({ property: p, channel });
  };

  return (
    <div>
      <SectionTitle sub="Track every lead from identification to signed mandate. Manage outreach and monitor conversion.">
        ◈ CRM &amp; Pipeline
      </SectionTitle>

      <div className="flex gap-1.5 mb-5 flex-wrap">
        {[
          { l: "Pipeline", v: "pipeline" },
          { l: "All Contacts", v: "contacts" },
          { l: "Activity Feed", v: "activity" },
        ].map((t) => (
          <Btn
            key={t.v}
            color={tab === t.v ? "#10b981" : "#475569"}
            variant={tab === t.v ? "filled" : "ghost"}
            onClick={() => setTab(t.v)}
            style={{ fontSize: 11, padding: "6px 14px" }}
          >
            {t.l}
          </Btn>
        ))}
      </div>

      {tab === "pipeline" && (
        <>
          {/* Pipeline stages */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-5">
            {PIPELINE.map((s, i) => (
              <CardDark key={s.stage} className="p-4 text-center relative" style={{ borderTop: `3px solid ${s.color}` }}>
                <div className="font-mono text-[32px] font-extrabold" style={{ color: s.color }}>
                  {s.count}
                </div>
                <div className="text-text-secondary text-[11px] mt-0.5">{s.stage}</div>
                {i < PIPELINE.length - 1 && (
                  <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 text-border-hover text-sm z-[2]">
                    ›
                  </div>
                )}
              </CardDark>
            ))}
          </div>

          {/* Funnel */}
          <CardDark className="p-6">
            <div className="text-text-muted text-[10px] font-bold tracking-wider uppercase mb-3.5">
              Conversion Funnel
            </div>
            {PIPELINE.map((s, i) => {
              const w = 100 - i * 18;
              const rate = i > 0 ? Math.round((s.count / PIPELINE[i - 1].count) * 100) : 100;
              return (
                <div key={s.stage} className="flex items-center gap-3 mb-1.5">
                  <span className="text-text-muted text-[11px] w-[85px] text-right flex-shrink-0">{s.stage}</span>
                  <div
                    className="flex-1 h-[26px] rounded-[5px] relative"
                    style={{ background: `${s.color}10`, width: `${w}%` }}
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 rounded-[5px]"
                      style={{
                        width: `${(s.count / PIPELINE[0].count) * 100}%`,
                        background: `${s.color}35`,
                      }}
                    />
                    <span className="relative z-[1] text-text-primary text-xs font-bold font-mono px-2.5 leading-[26px]">
                      {s.count}
                    </span>
                  </div>
                  <span className="text-text-dim text-[11px] font-mono w-9">{rate}%</span>
                </div>
              );
            })}
          </CardDark>
        </>
      )}

      {tab === "contacts" && (
        <div className="flex flex-col gap-1.5">
          {allProps
            .filter((p) => p.pipelineStage)
            .sort((a, b) => b.score - a.score)
            .map((p, i) => {
              const stageInfo = PIPELINE.find((x) => x.key === p.pipelineStage);
              return (
                <CardDark
                  key={p.id}
                  className="feat-card animate-fade-up p-2.5 md:p-3.5 flex items-center gap-3 cursor-pointer"
                  onClick={() => handleSelectProperty(p)}
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <div className="hidden sm:block">
                    <ScoreGauge score={p.score} size={56} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-text-primary text-[13px] font-bold">{p.owner}</div>
                    <div className="text-text-muted text-[11px]">{p.address}</div>
                  </div>
                  <BadgeCustom color={stageInfo?.color || "#475569"}>
                    {p.pipelineStage}
                  </BadgeCustom>
                  <span className="text-text-primary text-xs font-bold font-mono hidden md:inline">
                    {fmt(p.value)}
                  </span>
                  <div className="hidden md:flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <Btn
                      color="#0ea5e9"
                      variant="ghost"
                      onClick={() => handleSelectProperty(p, "email")}
                      style={{ fontSize: 9, padding: "4px 8px" }}
                    >
                      ✉
                    </Btn>
                    <Btn
                      color="#25D366"
                      variant="ghost"
                      onClick={() => handleSelectProperty(p, "whatsapp")}
                      style={{ fontSize: 9, padding: "4px 8px" }}
                    >
                      💬
                    </Btn>
                  </div>
                </CardDark>
              );
            })}
        </div>
      )}

      {tab === "activity" && (
        <CardDark className="p-5">
          {ACTIVITY.map((a, i) => (
            <div
              key={i}
              className="flex gap-3 items-start py-2.5"
              style={{ borderBottom: i < ACTIVITY.length - 1 ? "1px solid #141c2e" : "none" }}
            >
              <div
                className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
                style={{ background: a.color, boxShadow: `0 0 6px ${a.color}50` }}
              />
              <div className="flex-1">
                <div className="text-text-primary text-xs">{a.text}</div>
                <div className="text-text-dim text-[10px] font-mono mt-0.5">{a.time}</div>
              </div>
            </div>
          ))}
        </CardDark>
      )}

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
