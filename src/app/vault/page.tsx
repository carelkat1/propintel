"use client";

import { useState } from "react";
import { DEALS } from "@/data/documents";
import SectionTitle from "@/components/shared/section-title";
import CardDark from "@/components/shared/card-dark";
import BadgeCustom from "@/components/shared/badge-custom";
import Btn from "@/components/shared/btn";

export default function VaultPage() {
  const [exp, setExp] = useState<number | null>(1);

  return (
    <div>
      <SectionTitle sub="All deal documents organized and accessible.">
        🗄 Document Vault
      </SectionTitle>
      <div className="flex flex-col gap-2">
        {DEALS.map((d) => (
          <CardDark key={d.id} className="overflow-hidden">
            <div
              onClick={() => setExp(exp === d.id ? null : d.id)}
              className="p-3.5 md:p-4.5 flex justify-between items-center cursor-pointer"
            >
              <div>
                <div className="text-text-primary text-[13px] font-bold">{d.deal}</div>
                <div className="flex gap-1 mt-1">
                  <BadgeCustom color="#0ea5e9">{d.status}</BadgeCustom>
                  <BadgeCustom color="#64748b">{d.docs.length} docs</BadgeCustom>
                  <BadgeCustom color={d.docs.every((x) => x.s) ? "#10b981" : "#f59e0b"}>
                    {d.docs.filter((x) => x.s).length}/{d.docs.length} signed
                  </BadgeCustom>
                </div>
              </div>
              <span
                className="text-text-dim text-base transition-transform"
                style={{ transform: exp === d.id ? "rotate(90deg)" : "rotate(0)" }}
              >
                ›
              </span>
            </div>
            {exp === d.id && (
              <div className="px-4 pb-3.5 border-t border-border">
                {d.docs.map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 py-2"
                    style={{ borderBottom: i < d.docs.length - 1 ? "1px solid #0a0f1a" : "none" }}
                  >
                    <span className="text-sm">{doc.t}</span>
                    <div className="flex-1">
                      <div className="text-text-primary text-[11px] font-semibold">{doc.n}</div>
                      <div className="text-text-dim text-[9px] font-mono">{doc.d}</div>
                    </div>
                    {doc.s ? (
                      <BadgeCustom color="#10b981">Signed</BadgeCustom>
                    ) : (
                      <BadgeCustom color="#f59e0b">Pending</BadgeCustom>
                    )}
                  </div>
                ))}
                <Btn color="#475569" variant="ghost" style={{ fontSize: 9, padding: "4px 10px", marginTop: 8 }}>
                  + Upload
                </Btn>
              </div>
            )}
          </CardDark>
        ))}
      </div>
    </div>
  );
}
