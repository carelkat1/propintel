"use client";

import { useState } from "react";
import { OTP_CLAUSES, PPRA_CHECKS } from "@/data/otp";
import SectionTitle from "@/components/shared/section-title";
import CardDark from "@/components/shared/card-dark";
import Btn from "@/components/shared/btn";
import BadgeCustom from "@/components/shared/badge-custom";

const sC: Record<string, string> = { pass: "#10b981", warn: "#f59e0b", fail: "#ef4444" };

export default function OTPPage() {
  const [tab, setTab] = useState("otp");

  return (
    <div>
      <SectionTitle sub="OTP clause builder and PPRA compliance validation.">
        📑 OTP &amp; PPRA Compliance
      </SectionTitle>
      <div className="flex gap-1.5 mb-4">
        <Btn color={tab === "otp" ? "#10b981" : "#475569"} variant={tab === "otp" ? "filled" : "ghost"} onClick={() => setTab("otp")}>
          OTP Builder
        </Btn>
        <Btn color={tab === "ppra" ? "#ef4444" : "#475569"} variant={tab === "ppra" ? "filled" : "ghost"} onClick={() => setTab("ppra")}>
          PPRA Check
        </Btn>
      </div>

      {tab === "otp" && (
        <CardDark className="p-5">
          <div className="flex flex-col gap-1.5">
            {OTP_CLAUSES.map((c) => (
              <div key={c.n} className="flex items-center gap-2.5 p-2 md:p-3 bg-bg-input rounded-md">
                <div className="w-4 h-4 rounded-sm bg-brand/30 border border-brand flex items-center justify-center text-brand text-[9px]">✓</div>
                <span className="text-text-primary text-xs flex-1">{c.n}</span>
                {c.r && <BadgeCustom color="#ef4444">Required</BadgeCustom>}
              </div>
            ))}
          </div>
          <Btn color="#10b981" style={{ marginTop: 14, width: "100%" }}>
            ✦ AI Auto-Fill &amp; Generate OTP
          </Btn>
        </CardDark>
      )}

      {tab === "ppra" && (
        <CardDark className="p-5">
          <div className="flex gap-1.5 mb-3.5">
            <BadgeCustom color="#10b981">{PPRA_CHECKS.filter((c) => c.s === "pass").length} passed</BadgeCustom>
            <BadgeCustom color="#f59e0b">{PPRA_CHECKS.filter((c) => c.s === "warn").length} warn</BadgeCustom>
            <BadgeCustom color="#ef4444">{PPRA_CHECKS.filter((c) => c.s === "fail").length} fail</BadgeCustom>
          </div>
          {PPRA_CHECKS.map((c) => (
            <div key={c.c} className="flex items-start gap-2.5 py-2.5 border-b border-border">
              <div
                className="w-5 h-5 rounded-[5px] flex items-center justify-center text-[10px] font-extrabold flex-shrink-0"
                style={{ background: `${sC[c.s]}18`, color: sC[c.s] }}
              >
                {c.s === "pass" ? "✓" : c.s === "warn" ? "!" : "✕"}
              </div>
              <div>
                <div className="text-text-primary text-xs font-semibold">{c.c}</div>
                <div className="text-text-secondary text-[11px]">{c.d}</div>
              </div>
            </div>
          ))}
        </CardDark>
      )}
    </div>
  );
}
