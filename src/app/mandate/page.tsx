"use client";

import { useState } from "react";
import SectionTitle from "@/components/shared/section-title";
import CardDark from "@/components/shared/card-dark";
import Btn from "@/components/shared/btn";

export default function MandatePage() {
  const [step, setStep] = useState(0);
  const [type, setType] = useState("sole");
  const [comm, setComm] = useState("6");
  const steps = ["Type", "Seller", "Property", "Terms", "Sign"];

  return (
    <div>
      <SectionTitle sub="CPA-compliant mandate agreements with Lightstone auto-fill and e-signature.">
        📋 Digital Mandate Builder
      </SectionTitle>

      <div className="flex gap-1 mb-5">
        {steps.map((s, i) => (
          <div key={s} className="flex-1 cursor-pointer" onClick={() => setStep(i)}>
            <div className="h-[3px] rounded-sm mb-1" style={{ background: i <= step ? "#10b981" : "#1e293b" }} />
            <div className="text-[10px]" style={{ color: i <= step ? "#f1f5f9" : "#475569", fontWeight: i === step ? 700 : 400 }}>
              {i + 1}. {s}
            </div>
          </div>
        ))}
      </div>

      <CardDark className="p-6">
        {step === 0 && (
          <div>
            <div className="text-text-primary text-[15px] font-bold mb-3.5">Select Mandate Type</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {[
                { t: "sole", l: "Sole & Exclusive", d: "Best protection. CPA requires written form.", rec: true },
                { t: "open", l: "Open Mandate", d: "Multiple agencies. Higher dispute risk." },
                { t: "multi", l: "Multi-Listing", d: "Sole + shared via network." },
              ].map((m) => (
                <div
                  key={m.t}
                  onClick={() => setType(m.t)}
                  className="relative rounded-xl p-4 cursor-pointer"
                  style={{
                    background: type === m.t ? "#10b98112" : "#0a0f1a",
                    border: type === m.t ? "2px solid #10b98150" : "1px solid #1e293b",
                  }}
                >
                  {m.rec && (
                    <div className="absolute -top-2 right-2.5 bg-brand text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                      RECOMMENDED
                    </div>
                  )}
                  <div className="text-text-primary text-[13px] font-bold mb-1">{m.l}</div>
                  <div className="text-text-secondary text-[11px] leading-relaxed">{m.d}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-text-primary text-[15px] font-bold mb-3.5">Seller Details</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {["Full Name(s)", "ID Number", "Address", "Email", "Phone", "VAT Vendor?"].map((f) => (
                <div key={f}>
                  <label className="text-text-muted text-[10px] block mb-1">{f}</label>
                  <input className="w-full py-2 px-2.5 rounded-md bg-bg-input border border-border text-text-primary text-xs font-sans outline-none" />
                </div>
              ))}
            </div>
            <div className="bg-brand/10 border border-brand/20 rounded-md p-2.5 mt-3 text-text-secondary text-[11px]">
              ✦ Auto-populate from Lightstone deeds data
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-text-primary text-[15px] font-bold mb-3.5">Property Details</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {["Address", "Erf / Stand", "Suburb", "Title Deed #", "Size (m²)", "Type"].map((f) => (
                <div key={f}>
                  <label className="text-text-muted text-[10px] block mb-1">{f}</label>
                  <input className="w-full py-2 px-2.5 rounded-md bg-bg-input border border-border text-text-primary text-xs font-sans outline-none" />
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-text-primary text-[15px] font-bold mb-3.5">Terms &amp; Commission</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div>
                <label className="text-text-muted text-[10px]">Duration</label>
                <select className="w-full py-2 px-2.5 rounded-md bg-bg-input border border-border text-text-primary text-xs font-sans">
                  <option>3 months</option>
                  <option>6 months</option>
                </select>
              </div>
              <div>
                <label className="text-text-muted text-[10px]">Asking Price</label>
                <input defaultValue="7,850,000" className="w-full py-2 px-2.5 rounded-md bg-bg-input border border-border text-text-primary text-xs font-sans outline-none" />
              </div>
              <div>
                <label className="text-text-muted text-[10px]">Commission %</label>
                <input value={comm} onChange={(e) => setComm(e.target.value)} className="w-full py-2 px-2.5 rounded-md bg-bg-input border border-border text-text-primary text-xs font-sans outline-none" />
              </div>
              <div>
                <label className="text-text-muted text-[10px]">Est. Commission (incl VAT)</label>
                <div className="py-2 px-2.5 rounded-md bg-brand/10 border border-brand/30 text-brand text-[15px] font-extrabold font-mono">
                  R {(7850000 * (parseFloat(comm) || 0) / 100 * 1.15).toLocaleString("en-ZA", { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>
            <div className="flex gap-1.5 flex-wrap mt-3">
              {["CPA cooling-off (5 days)", "Post-mandate clause", "Marketing auth", "Photo consent"].map((c) => (
                <div key={c} className="flex items-center gap-1 bg-bg-input rounded-[5px] px-2 py-1">
                  <div className="w-3 h-3 rounded-sm bg-brand/30 border border-brand flex items-center justify-center text-brand text-[8px]">✓</div>
                  <span className="text-text-secondary text-[10px]">{c}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-text-primary text-[15px] font-bold mb-3.5">Review &amp; Sign</div>
            <CardDark className="p-4 bg-bg-input">
              {[
                ["Type", "Sole & Exclusive"],
                ["Seller", "Johannes van der Merwe"],
                ["Property", "14 Rivonia Rd, Sandhurst"],
                ["Price", "R 7,850,000"],
                ["Commission", `${comm}% + VAT`],
                ["Duration", "3 months"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1.5 border-b border-border">
                  <span className="text-text-muted text-[11px]">{k}</span>
                  <span className="text-text-primary text-[11px] font-semibold">{v}</span>
                </div>
              ))}
            </CardDark>
            <div className="flex gap-2 mt-3.5">
              <Btn color="#25D366" style={{ flex: 1 }}>💬 Sign via WhatsApp</Btn>
              <Btn color="#0ea5e9" style={{ flex: 1 }}>✉ Sign via Email</Btn>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-5 pt-3.5 border-t border-border">
          <Btn
            color="#475569"
            variant="ghost"
            onClick={() => setStep(Math.max(0, step - 1))}
            style={{ visibility: step === 0 ? "hidden" : "visible" }}
          >
            ← Back
          </Btn>
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div key={i} className="w-[7px] h-[7px] rounded-full" style={{ background: i === step ? "#10b981" : "#1e293b" }} />
            ))}
          </div>
          <Btn
            onClick={() => setStep(Math.min(4, step + 1))}
            style={{ visibility: step === 4 ? "hidden" : "visible" }}
          >
            Next →
          </Btn>
        </div>
      </CardDark>
    </div>
  );
}
