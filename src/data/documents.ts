import { Deal } from "@/lib/types";

export const DEALS: Deal[] = [
  { id: 1, deal: "14 Rivonia Rd — Van der Merwe", status: "Transfer", docs: [
    { n: "Sole Mandate", t: "📋", d: "2025-11-15", s: true },
    { n: "Disclosure Form", t: "📝", d: "2025-11-15", s: true },
    { n: "OTP — K. Govender", t: "📄", d: "2025-12-02", s: true },
    { n: "Bond Approval", t: "🏦", d: "2025-12-18", s: false },
    { n: "Electrical COC", t: "⚡", d: "2026-01-10", s: false },
    { n: "FICA — Seller", t: "🪪", d: "2025-11-15", s: true },
    { n: "FICA — Buyer", t: "🪪", d: "2025-12-02", s: true },
  ]},
  { id: 2, deal: "3 Maude St — Naidoo", status: "Negotiation", docs: [
    { n: "Open Mandate", t: "📋", d: "2026-01-08", s: true },
    { n: "CMA Report", t: "📊", d: "2026-01-08", s: false },
    { n: "OTP — L. Botha", t: "📄", d: "2026-02-14", s: false },
  ]},
  { id: 3, deal: "22 West St — Smith", status: "Listed", docs: [
    { n: "Sole Mandate", t: "📋", d: "2026-02-01", s: true },
    { n: "Disclosure Form", t: "📝", d: "2026-02-01", s: true },
  ]},
];
