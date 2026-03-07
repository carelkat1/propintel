"use client";

import { POST_SALE_CLIENTS } from "@/data/post-sale";
import SectionTitle from "@/components/shared/section-title";
import CardDark from "@/components/shared/card-dark";
import BadgeCustom from "@/components/shared/badge-custom";
import Btn from "@/components/shared/btn";

export default function NurturePage() {
  return (
    <div>
      <SectionTitle sub="Turn every closed deal into referrals with automated touchpoints.">
        🤝 Post-Sale Nurture
      </SectionTitle>
      <div className="flex flex-col gap-3.5">
        {POST_SALE_CLIENTS.map((c) => (
          <CardDark key={c.owner} className="p-5">
            <div className="flex justify-between mb-3.5 flex-wrap gap-2">
              <div>
                <div className="text-text-primary text-[15px] font-bold">{c.owner}</div>
                <div className="text-text-muted text-xs">{c.prop}</div>
              </div>
              <BadgeCustom color={c.stage === "transfer" ? "#f59e0b" : "#10b981"}>
                {c.stage === "transfer" ? "In Transfer" : "Nurturing"}
              </BadgeCustom>
            </div>
            <div className="pl-6 relative">
              <div className="absolute left-[7px] top-1 bottom-1 w-0.5 bg-border" />
              {c.timeline.map((t, i) => (
                <div key={i} className="flex items-start gap-2.5 mb-2.5 relative">
                  <div
                    className="absolute -left-[20px] w-3 h-3 rounded-full flex items-center justify-center"
                    style={{
                      background: t.done ? "#10b981" : "#1e293b",
                      border: t.done ? "none" : "2px solid #334155",
                    }}
                  >
                    {t.done && <span className="text-white text-[7px]">✓</span>}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs" style={{ color: t.done ? "#94a3b8" : "#f1f5f9", fontWeight: t.done ? 400 : 600 }}>
                      {t.e}
                    </div>
                    <div className="text-text-dim text-[9px] font-mono">{t.d}</div>
                  </div>
                  {!t.done && i === c.timeline.findIndex((x) => !x.done) && (
                    <Btn color="#10b981" variant="ghost" style={{ fontSize: 9, padding: "3px 8px" }}>
                      Send
                    </Btn>
                  )}
                </div>
              ))}
            </div>
          </CardDark>
        ))}
      </div>
    </div>
  );
}
