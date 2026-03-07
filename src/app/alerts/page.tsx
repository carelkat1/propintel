"use client";

import { ALERTS } from "@/data/alerts";
import SectionTitle from "@/components/shared/section-title";
import CardDark from "@/components/shared/card-dark";
import BadgeCustom from "@/components/shared/badge-custom";
import Btn from "@/components/shared/btn";

const sevC: Record<string, string> = { hot: "#ef4444", warm: "#f59e0b", info: "#0ea5e9" };

export default function AlertsPage() {
  return (
    <div>
      <SectionTitle sub="Real-time notifications when property signals change in your farm areas.">
        🔔 Market Alerts
      </SectionTitle>
      <div className="flex flex-col gap-2">
        {ALERTS.map((a, i) => (
          <CardDark
            key={a.id}
            className="animate-fade-up p-4"
            style={{ borderLeft: `3px solid ${sevC[a.severity]}`, animationDelay: `${i * 0.05}s` }}
          >
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-text-primary text-[13px] font-bold flex-1">{a.title}</span>
              <BadgeCustom color={sevC[a.severity]} border>
                {a.severity.toUpperCase()}
              </BadgeCustom>
              <span className="text-text-dim text-[10px] font-mono">{a.time}</span>
            </div>
            <div className="text-text-secondary text-xs mb-1.5">{a.desc}</div>
            <div className="flex gap-1.5">
              <Btn color={sevC[a.severity]} variant="ghost" style={{ fontSize: 10, padding: "4px 10px" }}>
                View Property
              </Btn>
              <Btn color={sevC[a.severity]} variant="ghost" style={{ fontSize: 10, padding: "4px 10px" }}>
                Draft Outreach
              </Btn>
            </div>
          </CardDark>
        ))}
      </div>
    </div>
  );
}
