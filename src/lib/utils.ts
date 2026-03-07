import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fmt = (n: number) =>
  "R " + Math.round(n || 0).toLocaleString("en-ZA");

export const scoreColor = (s: number) =>
  s >= 75 ? "#10b981" : s >= 50 ? "#eab308" : s >= 25 ? "#f97316" : "#ef4444";

export const scoreLabel = (s: number) =>
  s >= 75 ? "HOT" : s >= 50 ? "WARM" : s >= 25 ? "WATCH" : "COLD";

export const scoreTailwind = (s: number) =>
  s >= 75 ? "text-brand" : s >= 50 ? "text-score-watch" : s >= 25 ? "text-score-warm" : "text-score-hot";
