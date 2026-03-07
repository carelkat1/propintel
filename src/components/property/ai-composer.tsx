"use client";

import { useState, useEffect, useMemo } from "react";
import { Property } from "@/lib/types";
import { fmt } from "@/lib/utils";
import { MESSAGE_TEMPLATES } from "@/data/templates";
import { SUBURBS } from "@/data/suburbs";
import Btn from "@/components/shared/btn";

interface AIComposerProps {
  property: Property;
  channel: string;
  onClose: () => void;
}

export default function AIComposer({ property, channel, onClose }: AIComposerProps) {
  const [template, setTemplate] = useState("intro");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const channelColor = channel === "whatsapp" ? "#25D366" : "#0ea5e9";

  const templates = useMemo(() => {
    return MESSAGE_TEMPLATES.filter((t) => t.channel === channel);
  }, [channel]);

  // Find suburb for this property
  const suburb = useMemo(() => {
    // Try to find which suburb this property belongs to
    return SUBURBS.find((s) => s.name)?.name || "the area";
  }, []);

  useEffect(() => {
    const tmpl = templates.find((t) => t.name === template);
    if (tmpl) {
      const filled = tmpl.template
        .replace(/{owner}/g, property.owner)
        .replace(/{address}/g, property.address)
        .replace(/{suburb}/g, suburb)
        .replace(/{value}/g, fmt(property.value))
        .replace(/{lastSale}/g, fmt(property.lastSale))
        .replace(/{yearsOwned}/g, String(property.yearsOwned))
        .replace(/{beds}/g, String(property.beds))
        .replace(/{size}/g, String(property.size))
        .replace(/{growth}/g, "6.1");
      setMessage(filled);
    }
  }, [template, property, templates, suburb]);

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-5"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-bg-card border border-border rounded-2xl w-full max-w-[560px] max-h-[90vh] overflow-auto animate-slide-up"
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
              style={{ background: `${channelColor}20` }}
            >
              {channel === "whatsapp" ? "💬" : "✉"}
            </div>
            <div>
              <div className="text-text-primary text-[15px] font-semibold">
                {channel === "whatsapp" ? "WhatsApp" : "Email"} — {property.owner}
              </div>
              <div className="text-text-muted text-[11px] font-mono">
                {channel === "whatsapp" ? property.phone : property.email}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-text-muted text-xl cursor-pointer hover:text-text-primary"
          >
            ×
          </button>
        </div>

        {/* Template selector */}
        <div className="px-6 py-3.5 flex gap-2 flex-wrap">
          {templates.map((t) => (
            <button
              key={t.name}
              onClick={() => setTemplate(t.name)}
              className="px-3.5 py-1.5 rounded-md text-xs font-medium cursor-pointer capitalize"
              style={{
                border: template === t.name ? `1px solid ${channelColor}` : "1px solid #1e293b",
                background: template === t.name ? `${channelColor}15` : "transparent",
                color: template === t.name ? channelColor : "#94a3b8",
              }}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Message area */}
        <div className="px-6 pb-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-bg-input border border-border rounded-xl p-4 text-text-primary text-[13px] leading-relaxed font-sans resize-y outline-none"
            style={{ minHeight: channel === "whatsapp" ? 120 : 200 }}
          />
          <div className="flex justify-between mt-1">
            <span className="text-text-dim text-[11px] font-mono">✦ AI-generated · review before sending</span>
            <span className="text-text-dim text-[11px]">{message.length} chars</span>
          </div>
        </div>

        {/* Context badges */}
        <div className="px-6 pb-3 flex gap-1.5 flex-wrap">
          {[
            `Score: ${property.score}`,
            `${property.yearsOwned}yr owner`,
            fmt(property.value),
            property.signals[0],
          ].map((t) => (
            <span
              key={t}
              className="bg-[#1a2332] text-text-secondary text-[10px] px-2 py-0.5 rounded font-mono"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-border flex gap-2.5">
          <Btn color="#475569" variant="ghost" onClick={onClose} style={{ flex: 1 }}>
            Cancel
          </Btn>
          <Btn
            color={sent ? "#10b981" : channelColor}
            onClick={() => setSent(true)}
            style={{ flex: 2 }}
          >
            {sent ? "✓ Sent!" : channel === "whatsapp" ? "Send WhatsApp" : "Send Email"}
          </Btn>
        </div>
      </div>
    </div>
  );
}
