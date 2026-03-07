import { Alert } from "@/lib/types";

export const ALERTS: Alert[] = [
  { id: 1, type: "estate", severity: "hot", time: "12 min ago", title: "Estate Transfer — 14 Rivonia Rd", desc: "Executor appointed. R7.85M property, 12yr hold.", suburb: "Sandhurst" },
  { id: 2, type: "cluster", severity: "hot", time: "2h ago", title: "Sales Cluster — Bryanston East", desc: "5 sales in 800m radius, 30 days. 3% above asking.", suburb: "Bryanston" },
  { id: 3, type: "financial", severity: "warm", time: "5h ago", title: "Bond Default — 3 Maude St", desc: "3 months arrears, R2.9M bond. Owner: S. Naidoo.", suburb: "Sandton Central" },
  { id: 4, type: "valuation", severity: "warm", time: "Yesterday", title: "Valuation Roll Update — Morningside", desc: "23 properties show >R500k gap. CMA opportunity.", suburb: "Morningside" },
  { id: 5, type: "listing", severity: "info", time: "Yesterday", title: "Expired Listing — 88 Oxford Rd", desc: "120 days on market, no reductions. Re-listing opportunity.", suburb: "Rivonia" },
  { id: 6, type: "divorce", severity: "hot", time: "2 days ago", title: "Divorce Filing — 8 Katherine St", desc: "Penthouse R12.4M, 15yr hold, no bond. Likely forced sale.", suburb: "Sandhurst" },
];
