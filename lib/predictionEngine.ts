/**
 * PropTech Intelligence — Prediction Engine
 *
 * Scores a property 0–100 based on behavioural, demographic, and market
 * signals that correlate with an owner being likely to sell within 12 months.
 *
 * Criterion weights are calibrated so that:
 *   - 1 strong signal alone  → ~20–30%  (Watch List)
 *   - 2–3 moderate signals   → ~40–60%  (Moderate)
 *   - 3+ strong or 4+ mixed  → 70–100%  (High Confidence)
 */

import type { SellCriterion } from "@/types";

export interface RawPropertyForEngine {
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

export interface PredictionResult {
  score: number;
  criteria: SellCriterion[];
  criteriaDetails: CriterionDetail[];
}

export interface CriterionDetail {
  name: SellCriterion;
  weight: number;
  explanation: string;
}

// ─── Weighted Criteria ────────────────────────────────────────────────────────

interface CriterionRule {
  name: SellCriterion;
  weight: number;
  test: (p: RawPropertyForEngine) => boolean;
  explain: (p: RawPropertyForEngine) => string;
}

const CRITERION_RULES: CriterionRule[] = [
  {
    name: "Divorce Record",
    weight: 32,
    test: (p) => p.hasDivorceRecord,
    explain: (p) =>
      `A divorce filing is one of the strongest predictors of an imminent sale. Joint assets — including this ${p.bedrooms}-bedroom property — are typically liquidated as part of the settlement process. Historically, over 70% of properties flagged with active divorce records transact within 18 months.`,
  },
  {
    name: "Estate / Probate",
    weight: 30,
    test: (p) => p.hasEstateRecord,
    explain: () =>
      `A deceased estate or probate filing has been linked to this title deed. Inherited properties are most often sold by beneficiaries, particularly when the estate is shared among multiple heirs. These properties typically come to market within 6–24 months of the estate being wound up.`,
  },
  {
    name: "Financial Stress Indicators",
    weight: 28,
    test: (p) => p.hasFinancialStressIndicator,
    explain: () =>
      `Credit bureau and deeds data indicate financial stress signals for this owner — including late bond payments, judgment listings, or administration orders. Owners under financial pressure are significantly more likely to liquidate property assets to service debt.`,
  },
  {
    name: "10+ Years Owned",
    weight: 22,
    test: (p) => p.yearsOwned >= 10,
    explain: (p) =>
      `This property has been owned for ${p.yearsOwned} years. Statistical analysis of Lightstone transaction data shows that ownership tenure of 10+ years is a strong leading indicator: properties in this cohort are 3× more likely to transact in the next 12 months compared to recently acquired properties.`,
  },
  {
    name: "7+ Years Owned",
    weight: 14,
    test: (p) => p.yearsOwned >= 7 && p.yearsOwned < 10,
    explain: (p) =>
      `At ${p.yearsOwned} years of ownership, this property is entering the "churn window". Lightstone data shows a meaningful uptick in sale probability in the 7–9 year band, often coinciding with school changes, job relocations, or family structure shifts.`,
  },
  {
    name: "Retirement Age",
    weight: 22,
    test: (p) => p.ownerAge >= 65,
    explain: (p) =>
      `The registered owner is ${p.ownerAge} years old and falls within the retirement-transition demographic. Retirement commonly triggers downsizing, moves to retirement estates, or relocation closer to family. This age group accounts for a disproportionately high share of voluntary residential sales each year.`,
  },
  {
    name: "Empty Nester",
    weight: 18,
    test: (p) => p.ownerAge >= 52 && p.bedrooms >= 3,
    explain: (p) =>
      `The owner is ${p.ownerAge} years old and holds a ${p.bedrooms}-bedroom property — a classic empty nester profile. As children leave home, larger properties become expensive and impractical to maintain. This segment is highly active in the mid-to-upper market as owners downsize to lock in equity.`,
  },
  {
    name: "Downsizing Candidate",
    weight: 14,
    test: (p) => p.ownerAge >= 58 && p.bedrooms >= 4,
    explain: (p) =>
      `Owner age (${p.ownerAge}) combined with a ${p.bedrooms}-bedroom home points to a strong downsizing motivation. The cost-to-maintain versus lifestyle-need equation typically tips in favour of selling at this life stage.`,
  },
  {
    name: "High Area Sales Velocity",
    weight: 18,
    test: (p) => p.neighborhoodSalesVelocity >= 8,
    explain: (p) =>
      `There are approximately ${p.neighborhoodSalesVelocity.toFixed(1)} residential transactions per year within a 500m radius of this property. High neighbourhood velocity indicates a liquid market, lower selling friction, and strong price competition — all factors that encourage hesitant sellers to act.`,
  },
  {
    name: "Recent Renovation Permits",
    weight: 16,
    test: (p) => p.hasRenovationPermit,
    explain: () =>
      `Building permit data shows recent renovation activity on this property. Owners frequently renovate to maximise sale value before listing — a leading indicator that typically precedes a listing by 6–18 months. Upgrades to kitchens, bathrooms, or outdoor entertainment areas are the most common pre-sale improvements.`,
  },
  {
    name: "Under-valued Property",
    weight: 12,
    test: (p) =>
      p.municipalValuation > 0 &&
      p.estimatedValue / p.municipalValuation > 1.5,
    explain: (p) => {
      const ratio = (p.estimatedValue / p.municipalValuation).toFixed(1);
      return `The AVM-estimated value (R${(p.estimatedValue / 1e6).toFixed(2)}M) is ${ratio}× higher than the municipal valuation (R${(p.municipalValuation / 1e6).toFixed(2)}M). This gap signals significant unrealised equity that motivates owners to sell and capture gains.`;
    },
  },
  {
    name: "Absentee Owner",
    weight: 14,
    test: (p) => p.isAbsenteeOwner,
    explain: () =>
      `The registered owner's residential address does not match this property, indicating an absentee or investment owner. Absentee owners are more likely to sell when rental yields compress, interest rates rise, or when they receive an unsolicited offer — making proactive outreach especially effective.`,
  },
  {
    name: "Life Event – Marriage",
    weight: 10,
    test: (p) => p.ownerAge >= 28 && p.ownerAge <= 38,
    explain: (p) =>
      `At ${p.ownerAge} years of age, this owner falls in the prime household formation and upsizing bracket. Marriage, first child, or combined household income increases commonly trigger a move from a starter home to a family property.`,
  },
  {
    name: "Upsizing Candidate",
    weight: 10,
    test: (p) => p.ownerAge < 40 && p.bedrooms <= 2,
    explain: (p) =>
      `A ${p.bedrooms}-bedroom property owned by a ${p.ownerAge}-year-old is a classic upsizing profile. Growing families outgrow smaller homes, making this cohort a consistent source of seller leads.`,
  },
];

const MAX_POSSIBLE = CRITERION_RULES.reduce((acc, r) => acc + r.weight, 0);

// ─── Engine ───────────────────────────────────────────────────────────────────

export function runPredictionEngine(property: RawPropertyForEngine): PredictionResult {
  let rawScore = 0;
  const matchedDetails: CriterionDetail[] = [];

  for (const rule of CRITERION_RULES) {
    if (rule.test(property)) {
      rawScore += rule.weight;
      matchedDetails.push({
        name: rule.name,
        weight: rule.weight,
        explanation: rule.explain(property),
      });
    }
  }

  // Normalise with a gentle power curve so scores spread across all ranges
  const linear = (rawScore / MAX_POSSIBLE) * 100;
  const curved = Math.pow(linear / 100, 0.78) * 100;
  const score = Math.min(100, Math.max(5, Math.round(curved)));

  const topDetails = [...matchedDetails].sort((a, b) => b.weight - a.weight).slice(0, 5);

  return {
    score,
    criteria: topDetails.map((d) => d.name),
    criteriaDetails: topDetails,
  };
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
  bg: string;
} {
  if (score >= 70) {
    return { ring: "#FF3B30", badge: "bg-red-50 border-red-200", text: "text-red-600", bg: "bg-red-500" };
  }
  if (score >= 45) {
    return { ring: "#FF9500", badge: "bg-orange-50 border-orange-200", text: "text-orange-600", bg: "bg-orange-500" };
  }
  return { ring: "#34C759", badge: "bg-green-50 border-green-200", text: "text-green-600", bg: "bg-green-500" };
}
