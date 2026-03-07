import { PipelineStage, ActivityItem } from "@/lib/types";

export const PIPELINE: PipelineStage[] = [
  { stage: "Identified", key: "identified", count: 342, color: "#475569" },
  { stage: "Contacted", key: "contacted", count: 87, color: "#0ea5e9" },
  { stage: "Responded", key: "responded", count: 23, color: "#eab308" },
  { stage: "Meeting Set", key: "meeting", count: 8, color: "#f97316" },
  { stage: "Mandate Won", key: "mandate", count: 3, color: "#10b981" },
];

export const ACTIVITY: ActivityItem[] = [
  { time: "12 min ago", text: "WhatsApp delivered to J. van der Merwe — 14 Rivonia Road", color: "#25D366" },
  { time: "2 hours ago", text: "Email opened by S. Naidoo — 3 Maude Street", color: "#0ea5e9" },
  { time: "5 hours ago", text: "S. Meyer replied via WhatsApp — interested in valuation", color: "#eab308" },
  { time: "Yesterday", text: "Meeting set with Estate Late R. Fourie — Plot 7 Lonehill", color: "#f97316" },
  { time: "Yesterday", text: "Mandate signed! M. & P. Smith — 22 West Street, Bryanston", color: "#10b981" },
  { time: "2 days ago", text: "New hot lead: D. Abramowitz — 8 Katherine St (score 85)", color: "#10b981" },
  { time: "3 days ago", text: "CMA report sent to M. Sobukwe Trust — 22 Oxford Road", color: "#0ea5e9" },
];
