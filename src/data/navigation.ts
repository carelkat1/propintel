import { NavItem } from "@/lib/types";

export const NAV_ITEMS: NavItem[] = [
  { id: "farming", icon: "⊕", label: "Farm", href: "/farm" },
  { id: "crm", icon: "◈", label: "CRM", href: "/crm" },
  { id: "alerts", icon: "🔔", label: "Alerts", href: "/alerts" },
  { id: "heatmap", icon: "🗺", label: "Heatmap", href: "/heatmap" },
  { id: "mandate", icon: "📋", label: "Mandate", href: "/mandate" },
  { id: "otp", icon: "📑", label: "OTP", href: "/otp" },
  { id: "syndicate", icon: "📡", label: "Publish", href: "/syndicate" },
  { id: "vault", icon: "🗄", label: "Docs", href: "/vault" },
  { id: "postsale", icon: "🤝", label: "Nurture", href: "/nurture" },
  { id: "predictor", icon: "📈", label: "Predict", href: "/predict" },
];
