/**
 * PropTech Intelligence — Prediction Engine
 *
 * Scores a property 0–100 based on behavioural, demographic, and market
 * signals that correlate with an owner being likely to sell within 12 months.
 *
 * Each criterion carries a weight; the raw score is clamped to [0, 100].
 */

import type { SellCriterion } from "@/types";

interface RawProperty {
  ownerAge: number;
  yearsOwned: number;
  bedrooms: number;
  neighborhoodSalesVelocity: number;
  hasDivorceRecord: boolean;
  hasEstateRecord: boolean;
  hasRenovationPermit: boolean;
  estimatedValue: number;
  municipalValuation: number;
  isAbsenteeOwner: boolean;
  hasFinancialStressIndicator: boolean;
}

interface PredictionResult {
  score: number;
  criteria: SellCriterion[];
}

// ─── Weighted Criteria ────────────────────────────────────────────────────────

interface CriterionRule {
  name: SellCriterion;
  weight: number;
  test: (p: RawProperty) => boolean;
}

const CRITERION_RULES: CriterionRule[] = [
  {
    name: "Divorce Record",
    weight: 28,
    test: (p) => p.hasDivorceRecord,
  },
  {
    name: "Estate / Probate",
    weight: 26,
    test: (p) => p.hasEstateRecord,
  },
  {
    name: "Financial Stress Indicators",
    weight: 22,
    test: (p) => p.hasFinancialStressIndicator,
  },
  {
    name: "10+ Years Owned",
    weight: 18,
    test: (p) => p.yearsOwned >= 10,
  },
  {
    name: "7+ Years Owned",
    weight: 12,
    test: (p) => p.yearsOwned >= 7 && p.yearsOwned < 10,
  },
  {
    name: "Retirement Age",
    weight: 18,
    test: (p) => p.ownerAge >= 65,
  },
  {
    name: "Empty Nester",
    weight: 16,
    test: (p) => p.ownerAge >= 52 && p.bedrooms >= 3,
  },
  {
    name: "Downsizing Candidate",
    weight: 10,
    test: (p) => p.ownerAge >= 58 && p.bedrooms >= 4,
  },
  {
    name: "Upsizing Candidate",
    weight: 8,
    test: (p) => p.ownerAge < 40 && p.bedrooms <= 2,
  },
  {
    name: "High Area Sales Velocity",
    weight: 15,
    test: (p) => p.neighborhoodSalesVelocity >= 8,
  },
  {
    name: "Recent Renovation Permits",
    weight: 14,
    test: (p) => p.hasRenovationPermit,
  },
  {
    name: "Under-valued Property",
    weight: 10,
    test: (p) =>
      p.municipalValuation > 0 &&
      p.estimatedValue / p.municipalValuation > 1.5,
  },
  {
    name: "Absentee Owner",
    weight: 12,
    test: (p) => p.isAbsenteeOwner,
  },
  {
    name: "Life Event – Marriage",
    weight: 9,
    test: (p) => p.ownerAge >= 28 && p.ownerAge <= 38,
  },
];

// ─── Engine ───────────────────────────────────────────────────────────────────

export function runPredictionEngine(property: RawProperty): PredictionResult {
  let rawScore = 0;
  const matchedCriteria: SellCriterion[] = [];

  for (const rule of CRITERION_RULES) {
    if (rule.test(property)) {
      rawScore += rule.weight;
      matchedCriteria.push(rule.name);
    }
  }

  // Normalise: the theoretical maximum sum of all weights is used as the ceiling.
  const maxPossible = CRITERION_RULES.reduce((acc, r) => acc + r.weight, 0);
  const normalised = Math.round((rawScore / maxPossible) * 100);

  // Add a small baseline so that zero-criteria properties still show a non-zero score.
  const baseline = 4;
  const score = Math.min(100, Math.max(baseline, normalised));

  // Limit to top 4 most impactful criteria for display clarity.
  const topCriteria = matchedCriteria
    .sort(
      (a, b) =>
        (CRITERION_RULES.find((r) => r.name === b)?.weight ?? 0) -
        (CRITERION_RULES.find((r) => r.name === a)?.weight ?? 0)
    )
    .slice(0, 4);

  return { score, criteria: topCriteria };
}

// ─── Interpretation Helpers ───────────────────────────────────────────────────

export function getScoreLabel(score: number): string {
  if (score >= 70) return "High Confidence";
  if (score >= 45) return "Moderate";
  return "Watch List";
}

export function getScoreColor(score: number): {
  ring: string;
  badge: string;
  text: string;
} {
  if (score >= 70) {
    return {
      ring: "#FF3B30",   // Apple Red
      badge: "bg-red-50 border-red-200",
      text: "text-red-600",
    };
  }
  if (score >= 45) {
    return {
      ring: "#FF9500",   // Apple Orange
      badge: "bg-orange-50 border-orange-200",
      text: "text-orange-600",
    };
  }
  return {
    ring: "#34C759",     // Apple Green
    badge: "bg-green-50 border-green-200",
    text: "text-green-600",
  };
}
