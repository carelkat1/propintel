/**
 * Mock Lightstone Property API Service
 *
 * Field names mirror the real Lightstone REST API response schema so that
 * swapping the mock for real HTTP calls requires only changing this file.
 *
 * Real API usage:
 *   const res = await fetch(`${process.env.LIGHTSTONE_API_URL}/properties/search`, {
 *     method: 'POST',
 *     headers: { Authorization: `Bearer ${process.env.LIGHTSTONE_API_KEY}` },
 *     body: JSON.stringify({ suburbs: [...], limit: 100 }),
 *   });
 *   const { results } = await res.json();
 *   return results.map(mapLightstoneResponse);
 */

import type { Property, PropertyType } from "@/types";
import { runPredictionEngine } from "./predictionEngine";

// ─── Seed Data ────────────────────────────────────────────────────────────────

const LOCATIONS = [
  { suburb: "Constantia",    city: "Cape Town",       province: "Western Cape",  postalCode: "7806", lat: -34.03, lng: 18.43 },
  { suburb: "Bishopscourt",  city: "Cape Town",       province: "Western Cape",  postalCode: "7708", lat: -33.99, lng: 18.46 },
  { suburb: "Camps Bay",     city: "Cape Town",       province: "Western Cape",  postalCode: "8005", lat: -33.95, lng: 18.38 },
  { suburb: "Clifton",       city: "Cape Town",       province: "Western Cape",  postalCode: "8005", lat: -33.94, lng: 18.37 },
  { suburb: "Fresnaye",      city: "Cape Town",       province: "Western Cape",  postalCode: "8005", lat: -33.92, lng: 18.39 },
  { suburb: "Bantry Bay",    city: "Cape Town",       province: "Western Cape",  postalCode: "8005", lat: -33.93, lng: 18.38 },
  { suburb: "Stellenbosch",  city: "Stellenbosch",    province: "Western Cape",  postalCode: "7600", lat: -33.93, lng: 18.86 },
  { suburb: "Somerset West", city: "Somerset West",   province: "Western Cape",  postalCode: "7130", lat: -34.07, lng: 18.84 },
  { suburb: "Sandton",       city: "Johannesburg",    province: "Gauteng",       postalCode: "2196", lat: -26.11, lng: 28.05 },
  { suburb: "Morningside",   city: "Johannesburg",    province: "Gauteng",       postalCode: "2057", lat: -26.09, lng: 28.07 },
  { suburb: "Hyde Park",     city: "Johannesburg",    province: "Gauteng",       postalCode: "2196", lat: -26.12, lng: 28.04 },
  { suburb: "Bryanston",     city: "Johannesburg",    province: "Gauteng",       postalCode: "2021", lat: -26.07, lng: 28.02 },
  { suburb: "Waterkloof",    city: "Pretoria",        province: "Gauteng",       postalCode: "0181", lat: -25.78, lng: 28.25 },
  { suburb: "Menlyn",        city: "Pretoria",        province: "Gauteng",       postalCode: "0181", lat: -25.79, lng: 28.28 },
  { suburb: "Umhlanga",      city: "Durban",          province: "KwaZulu-Natal", postalCode: "4320", lat: -29.72, lng: 31.07 },
  { suburb: "Ballito",       city: "Ballito",         province: "KwaZulu-Natal", postalCode: "4420", lat: -29.54, lng: 31.21 },
  { suburb: "Plettenberg Bay", city: "Plettenberg Bay", province: "Western Cape", postalCode: "6600", lat: -34.05, lng: 23.37 },
  { suburb: "Knysna",        city: "Knysna",          province: "Western Cape",  postalCode: "6570", lat: -34.04, lng: 23.05 },
  { suburb: "Hermanus",      city: "Hermanus",        province: "Western Cape",  postalCode: "7200", lat: -34.42, lng: 19.23 },
  { suburb: "George",        city: "George",          province: "Western Cape",  postalCode: "6529", lat: -33.96, lng: 22.46 },
];

const STREETS = [
  "Oak Avenue", "Vineyard Road", "Kloof Street", "Mountain View Drive",
  "Sunset Boulevard", "Palm Lane", "Heritage Close", "Fynbos Way",
  "Silver Stream Road", "Protea Heights", "Baobab Close", "Milkwood Lane",
  "The Crescent", "Acacia Drive", "Bougainvillea Court", "Wisteria Way",
  "Blue Crane Close", "Ficus Road", "Yellowwood Place", "Coral Tree Lane",
  "Klein Constantia Road", "Helderberg Crescent", "Jonkershoek Road",
];

const FIRST_NAMES = [
  "James", "Sarah", "David", "Emma", "Michael", "Olivia", "Robert",
  "Charlotte", "William", "Amelia", "Johan", "Thandi", "Sipho", "Nomsa",
  "Pieter", "Lerato", "André", "Chloe", "Francois", "Zanele",
  "Heinrich", "Nandi", "Riaan", "Miriam", "Gerrit", "Ayesha",
];

const LAST_NAMES = [
  "van der Berg", "Smith", "Johnson", "Nkosi", "Dlamini", "Botha",
  "Pretorius", "Fourie", "Nel", "De Villiers", "Adams", "Mitchell",
  "Hendricks", "Coetzee", "Steyn", "Erasmus", "Du Plessis",
  "Khumalo", "Mokoena", "Sithole", "Zulu", "Motsepe",
];

const PROPERTY_TYPES: PropertyType[] = [
  "Freehold", "Freehold", "Freehold",
  "Sectional Title", "Sectional Title",
  "Estate", "Estate",
  "Agricultural", "Commercial",
];

const IMAGES = [
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800&q=80",
  "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80",
  "https://images.unsplash.com/photo-1549517045-bc93de744b89?w=800&q=80",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
  "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
  "https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=800&q=80",
  "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
  "https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?w=800&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
];

// ─── RNG ─────────────────────────────────────────────────────────────────────

function seededRandom(seed: number): () => number {
  let s = (seed * 1664525 + 1013904223) & 0x7fffffff;
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}
function pick<T>(arr: T[], r: () => number): T { return arr[Math.floor(r() * arr.length)]; }
function randInt(min: number, max: number, r: () => number): number { return Math.floor(r() * (max - min + 1)) + min; }
function isoDate(daysAgo: number): string { return new Date(Date.now() - daysAgo * 86400000).toISOString().split("T")[0]; }

// ─── Score-bucket templates for even range distribution ───────────────────────

interface ScoreTemplate {
  minYearsOwned: number; maxYearsOwned: number;
  minAge: number; maxAge: number;
  divorcePct: number; estatePct: number; financialPct: number;
  renovationPct: number; absenteePct: number;
  minVelocity: number; maxVelocity: number;
}

const HIGH: ScoreTemplate   = { minYearsOwned:11, maxYearsOwned:22, minAge:60, maxAge:78, divorcePct:0.75, estatePct:0.55, financialPct:0.60, renovationPct:0.60, absenteePct:0.50, minVelocity:9,  maxVelocity:15 };
const MEDIUM: ScoreTemplate = { minYearsOwned:7,  maxYearsOwned:14, minAge:45, maxAge:65, divorcePct:0.25, estatePct:0.18, financialPct:0.20, renovationPct:0.45, absenteePct:0.30, minVelocity:5,  maxVelocity:12 };
const LOW: ScoreTemplate    = { minYearsOwned:1,  maxYearsOwned:7,  minAge:28, maxAge:50, divorcePct:0.05, estatePct:0.04, financialPct:0.05, renovationPct:0.15, absenteePct:0.10, minVelocity:1,  maxVelocity:6  };

// ─── Generator ────────────────────────────────────────────────────────────────

function generateRaw(idx: number, t: ScoreTemplate, salt: number): Omit<Property, "likelinessScore" | "criteria" | "criteriaDetails"> {
  const r = seededRandom(idx * 97331 + 1337 + salt);
  const loc = pick(LOCATIONS, r);
  const bedrooms = randInt(2, 6, r);
  const erfSize = randInt(350, 3000, r);
  const floorSize = randInt(90, Math.min(erfSize - 50, 700), r);
  const estimatedValue = Math.round(randInt(900_000, 22_000_000, r) / 50_000) * 50_000;
  const yearsOwned = randInt(t.minYearsOwned, t.maxYearsOwned, r);
  const ownerAge = randInt(t.minAge, t.maxAge, r);

  return {
    id: `ls-${String(idx).padStart(4, "0")}`,
    // ── Lightstone API field mapping ──────────────────────────────────────────
    address:      `${randInt(1, 280, r)} ${pick(STREETS, r)}`,  // streetAddress
    suburb:       loc.suburb,
    city:         loc.city,
    province:     loc.province,
    postalCode:   loc.postalCode,
    propertyType: pick(PROPERTY_TYPES, r),
    bedrooms,                                     // bedrooms
    bathrooms:    randInt(1, Math.min(bedrooms, 4), r), // bathrooms
    garages:      randInt(0, 3, r),               // garages
    erfSize,                                      // erfExtent (m²)
    floorSize,                                    // grossFloorArea (m²)
    estimatedValue,                               // avm (Automated Valuation Model)
    lastSaleDate: isoDate(yearsOwned * 365 + randInt(0, 60, r)), // lastTransferDate
    lastSalePrice: Math.round(estimatedValue * (0.55 + r() * 0.4) / 10_000) * 10_000, // lastTransferPrice
    ownerName:    `${pick(FIRST_NAMES, r)} ${pick(LAST_NAMES, r)}`, // registeredOwner
    ownerEmail:   `owner${idx}@email.co.za`,
    ownerPhone:   `+27 ${randInt(60, 83, r)} ${randInt(100, 999, r)} ${randInt(1000, 9999, r)}`,
    ownerAge,                                     // derived from ownerDateOfBirth
    yearsOwned,                                   // derived from lastTransferDate
    municipalValuation: Math.round(estimatedValue * (0.45 + r() * 0.40) / 10_000) * 10_000, // municipalValue
    neighborhoodSalesVelocity: parseFloat((t.minVelocity + r() * (t.maxVelocity - t.minVelocity)).toFixed(1)), // neighbourhood analytics
    hasDivorceRecord:           r() < t.divorcePct,    // deeds/court data
    hasEstateRecord:            r() < t.estatePct,     // deceased estate registry
    hasFinancialStressIndicator: r() < t.financialPct, // credit bureau integration
    hasRenovationPermit:        r() < t.renovationPct, // council permit data
    isAbsenteeOwner:            r() < t.absenteePct,   // owner address mismatch
    imageUrl: IMAGES[idx % IMAGES.length],
    lat: loc.lat + (r() - 0.5) * 0.02,
    lng: loc.lng + (r() - 0.5) * 0.02,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

let _cached: Property[] | null = null;

export function getLightstoneProperties(count = 96): Property[] {
  if (_cached) return _cached;

  const third = Math.floor(count / 3);
  const buckets: [ScoreTemplate, number][] = [
    [HIGH,   third],
    [MEDIUM, third],
    [LOW,    count - third * 2],
  ];

  const all: Property[] = [];
  let idx = 0;
  for (const [tpl, n] of buckets) {
    for (let i = 0; i < n; i++) {
      const base = generateRaw(idx, tpl, count);
      const result = runPredictionEngine(base);
      all.push({ ...base, likelinessScore: result.score, criteria: result.criteria, criteriaDetails: result.criteriaDetails });
      idx++;
    }
  }

  _cached = all.sort((a, b) => b.likelinessScore - a.likelinessScore);
  return _cached;
}

export function getLightstonePropertyById(id: string): Property | undefined {
  return getLightstoneProperties().find((p) => p.id === id);
}

export function resetCache(): void { _cached = null; }
