import { OTPClause, PPRACheck, Platform } from "@/lib/types";

export const OTP_CLAUSES: OTPClause[] = [
  { n: "Purchase Price & Deposit", r: true },
  { n: "Bond Condition", r: true },
  { n: "72-Hour Escape Clause" },
  { n: "Voetstoots (As-Is)", r: true },
  { n: "Occupational Rent" },
  { n: "Agent Commission", r: true },
  { n: "Transfer/Occupation Date", r: true },
  { n: "Property Disclosure", r: true },
  { n: "FICA Requirements", r: true },
  { n: "HOA Disclosure" },
  { n: "Special Conditions" },
];

export const PPRA_CHECKS: PPRACheck[] = [
  { c: "Valid FFC", s: "pass", d: "FFC #2026-JHB-04521 — valid" },
  { c: "PPRA Registration", s: "pass", d: "Active" },
  { c: "Written mandate", s: "pass", d: "CPA compliant" },
  { c: "Cooling-off disclosure", s: "pass", d: "5-day clause included" },
  { c: "Term ≤ 24 months", s: "pass", d: "3 months" },
  { c: "Commission stated", s: "pass", d: "6% + VAT" },
  { c: "Terms explained", s: "warn", d: "Confirm verbal explanation" },
  { c: "Trust account", s: "pass", d: "Registered" },
  { c: "Disclosure form", s: "warn", d: "Pending seller completion" },
  { c: "FICA both parties", s: "fail", d: "Buyer docs outstanding" },
];

export const PLATFORMS: Platform[] = [
  { k: "p24", n: "Property24", c: "#ef4444" },
  { k: "pp", n: "Private Property", c: "#0ea5e9" },
  { k: "fb", n: "Facebook", c: "#3b82f6" },
  { k: "ag", n: "Agency Site", c: "#10b981" },
  { k: "iol", n: "IOL Property", c: "#f59e0b" },
  { k: "gt", n: "Gumtree", c: "#22c55e" },
];
