import { MessageTemplate } from "@/lib/types";

export const MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: "email-intro",
    name: "intro",
    channel: "email",
    strategy: "Professional introduction + free valuation offer",
    template: `Dear {owner},

I hope this message finds you well. My name is [Agent Name] and I specialise in the {suburb} property market.

I noticed your property at {address} and wanted to reach out regarding a complimentary, no-obligation market valuation. Properties in your area have seen significant growth recently, with comparable sales achieving impressive prices.

Given your property's current estimated value of {value} and the {yearsOwned} years of ownership, there may be substantial equity growth worth exploring.

I'd welcome the opportunity to share a detailed Comparative Market Analysis at your convenience.

Kind regards,
Your PropScout Agent`,
  },
  {
    id: "email-market",
    name: "market",
    channel: "email",
    strategy: "Share recent comparable sales in the area",
    template: `Dear {owner},

I wanted to share some exciting market activity in {suburb} that may be of interest to you.

Recent comparable sales near {address} include properties achieving prices well above municipal valuations. The area has experienced {growth}% growth over the past 12 months, and buyer demand remains strong.

Your property, with its {beds} bedrooms and {size}m² of living space, is well-positioned in the current market.

I'd be happy to prepare a detailed report on how these trends specifically impact your property's value.

Kind regards,
Your PropScout Agent`,
  },
  {
    id: "email-value",
    name: "value",
    channel: "email",
    strategy: "Lead with equity growth since purchase",
    template: `Dear {owner},

I hope you don't mind me reaching out directly. I've been tracking property values in {suburb} and your property at {address} caught my attention.

Based on current market conditions, your property has appreciated significantly since your purchase at {lastSale}. The current estimated value of {value} represents substantial equity growth over your {yearsOwned} years of ownership.

Whether you're considering selling, refinancing, or simply curious about your property's worth, I'd be delighted to provide a professional valuation.

Kind regards,
Your PropScout Agent`,
  },
  {
    id: "wa-intro",
    name: "intro",
    channel: "whatsapp",
    strategy: "Professional introduction + free valuation offer",
    template: `Hi {owner} 👋 I'm a property specialist in {suburb}. I noticed your property at {address} and wanted to offer a free, no-obligation market valuation. Properties in your area are doing really well at the moment. Would you be open to a quick chat?`,
  },
  {
    id: "wa-market",
    name: "market",
    channel: "whatsapp",
    strategy: "Share recent comparable sales in the area",
    template: `Hi {owner}, hope you're well! Quick update on {suburb} — there's been some great activity with recent sales near {address}. The area is up {growth}% this year. Happy to share what this means for your property if you're interested 📈`,
  },
  {
    id: "wa-value",
    name: "value",
    channel: "whatsapp",
    strategy: "Lead with equity growth since purchase",
    template: `Hi {owner} 👋 I specialise in {suburb} and noticed your property at {address} has seen solid growth since purchase. Current value is estimated around {value}. Would you like a detailed breakdown? No obligation at all.`,
  },
];
