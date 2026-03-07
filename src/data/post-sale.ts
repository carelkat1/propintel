import { PostSaleClient } from "@/lib/types";

export const POST_SALE_CLIENTS: PostSaleClient[] = [
  {
    owner: "K. Govender",
    prop: "14 Rivonia Rd",
    stage: "transfer",
    timeline: [
      { d: "2025-12-02", e: "OTP Signed", done: true },
      { d: "2025-12-18", e: "Bond Approved", done: true },
      { d: "2026-02-10", e: "Lodged at Deeds", done: true },
      { d: "2026-03-15", e: "Registration (est.)", done: false },
      { d: "2026-03-16", e: "Congrats Message", done: false },
      { d: "2026-06-15", e: "3-Month Check-in", done: false },
      { d: "2027-03-15", e: "Anniversary + Referral", done: false },
    ],
  },
  {
    owner: "A. Pillay",
    prop: "55 Corlett Dr, Illovo",
    stage: "nurture",
    timeline: [
      { d: "2025-06-20", e: "Transfer Complete", done: true },
      { d: "2025-06-21", e: "Congrats Sent", done: true },
      { d: "2025-09-20", e: "3-Month Check-in", done: true },
      { d: "2025-12-20", e: "Value Update Sent", done: true },
      { d: "2025-12-22", e: "Google Review ⭐⭐⭐⭐⭐", done: true },
      { d: "2026-06-20", e: "1-Year Anniversary", done: false },
    ],
  },
];
