/**
 * Mock Lightstone Property API Service
 *
 * In production, replace the mock data generation with real HTTP calls to
 * the Lightstone REST API endpoints, e.g.:
 *   const res = await fetch('https://api.lightstone.co.za/v1/properties', {
 *     headers: { Authorization: `Bearer ${process.env.LIGHTSTONE_API_KEY}` }
 *   });
 */

import type { Property, PropertyType } from "@/types";
import { runPredictionEngine } from "./predictionEngine";

// ─── Seed Data ────────────────────────────────────────────────────────────────

const SUBURBS = [
  { suburb: "Constantia", city: "Cape Town", province: "Western Cape", postalCode: "7806" },
  { suburb: "Bishopscourt", city: "Cape Town", province: "Western Cape", postalCode: "7708" },
  { suburb: "Sandton", city: "Johannesburg", province: "Gauteng", postalCode: "2196" },
  { suburb: "Morningside", city: "Johannesburg", province: "Gauteng", postalCode: "2057" },
  { suburb: "Umhlanga", city: "Durban", province: "KwaZulu-Natal", postalCode: "4320" },
  { suburb: "Waterkloof", city: "Pretoria", province: "Gauteng", postalCode: "0181" },
  { suburb: "Camps Bay", city: "Cape Town", province: "Western Cape", postalCode: "8005" },
  { suburb: "Hyde Park", city: "Johannesburg", province: "Gauteng", postalCode: "2196" },
  { suburb: "Stellenbosch", city: "Stellenbosch", province: "Western Cape", postalCode: "7600" },
  { suburb: "Ballito", city: "Ballito", province: "KwaZulu-Natal", postalCode: "4420" },
  { suburb: "Clifton", city: "Cape Town", province: "Western Cape", postalCode: "8005" },
  { suburb: "Menlyn", city: "Pretoria", province: "Gauteng", postalCode: "0181" },
];

const STREET_NAMES = [
  "Oak Avenue", "Vineyard Road", "Kloof Street", "Mountain View Drive",
  "Sunset Boulevard", "Palm Lane", "Heritage Close", "Fynbos Way",
  "Silver Stream Road", "Protea Heights", "Baobab Close", "Milkwood Lane",
  "The Crescent", "Acacia Drive", "Bougainvillea Court",
];

const FIRST_NAMES = [
  "James", "Sarah", "David", "Emma", "Michael", "Olivia", "Robert",
  "Charlotte", "William", "Amelia", "John", "Sophia", "Thomas", "Isabella",
  "Johan", "Thandi", "Sipho", "Nomsa", "Pieter", "Lerato",
];

const LAST_NAMES = [
  "van der Berg", "Smith", "Johnson", "Williams", "Nkosi", "Dlamini",
  "Botha", "Pretorius", "Fourie", "Nel", "Vorster", "De Villiers",
  "Adams", "Mitchell", "Thompson", "Hendricks",
];

const PROPERTY_TYPES: PropertyType[] = [
  "Freehold", "Sectional Title", "Estate", "Agricultural", "Commercial",
];

const PROPERTY_IMAGES = [
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
  "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=600&q=80",
  "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=600&q=80",
  "https://images.unsplash.com/photo-1549517045-bc93de744b89?w=600&q=80",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80",
  "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80",
  "https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=600&q=80",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function pickRandom<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function randomInt(min: number, max: number, rand: () => number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function randomDate(yearsBack: number, rand: () => number): string {
  const now = new Date();
  const ms = rand() * yearsBack * 365 * 24 * 60 * 60 * 1000;
  return new Date(now.getTime() - ms).toISOString().split("T")[0];
}

// ─── Mock Raw Property Generator ─────────────────────────────────────────────

function generateRawProperty(index: number): Omit<Property, "likelinessScore" | "criteria"> {
  const rand = seededRandom(index * 31337 + 42);
  const location = pickRandom(SUBURBS, rand);
  const streetNumber = randomInt(1, 250, rand);
  const streetName = pickRandom(STREET_NAMES, rand);
  const firstName = pickRandom(FIRST_NAMES, rand);
  const lastName = pickRandom(LAST_NAMES, rand);
  const propertyType = pickRandom(PROPERTY_TYPES, rand);

  const bedrooms = randomInt(2, 6, rand);
  const bathrooms = randomInt(1, 4, rand);
  const garages = randomInt(0, 3, rand);
  const erfSize = randomInt(400, 2500, rand);
  const floorSize = randomInt(120, Math.min(erfSize, 600), rand);

  const baseValue = randomInt(1_200_000, 18_000_000, rand);
  const estimatedValue = Math.round(baseValue / 50000) * 50000;
  const lastSalePrice = Math.round(estimatedValue * (0.6 + rand() * 0.35) / 10000) * 10000;

  const yearsOwned = randomInt(1, 22, rand);
  const lastSaleDate = randomDate(yearsOwned, rand);

  const ownerAge = randomInt(28, 78, rand);
  const municipalValuation = Math.round(estimatedValue * (0.55 + rand() * 0.3) / 10000) * 10000;
  const neighborhoodSalesVelocity = parseFloat((rand() * 14 + 1).toFixed(1));

  const hasRenovationPermit = rand() > 0.78;
  const hasDivorceRecord = rand() > 0.88;
  const hasEstateRecord = rand() > 0.91;
  const isAbsenteeOwner = rand() > 0.85;
  const hasFinancialStressIndicator = rand() > 0.87;

  // Approximate coordinates centred on South Africa
  const lat = -33.9 + (rand() - 0.5) * 4;
  const lng = 18.4 + (rand() - 0.5) * 4;

  return {
    id: `ls-prop-${String(index).padStart(4, "0")}`,
    address: `${streetNumber} ${streetName}`,
    suburb: location.suburb,
    city: location.city,
    province: location.province,
    postalCode: location.postalCode,
    propertyType,
    bedrooms,
    bathrooms,
    garages,
    erfSize,
    floorSize,
    estimatedValue,
    lastSaleDate,
    lastSalePrice,
    ownerName: `${firstName} ${lastName}`,
    ownerEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/ /g, "")}@email.co.za`,
    ownerPhone: `+27 ${randomInt(60, 83, rand)} ${randomInt(100, 999, rand)} ${randomInt(1000, 9999, rand)}`,
    ownerAge,
    yearsOwned,
    municipalValuation,
    neighborhoodSalesVelocity,
    hasRenovationPermit,
    hasDivorceRecord,
    hasEstateRecord,
    isAbsenteeOwner,
    hasFinancialStressIndicator,
    imageUrl: PROPERTY_IMAGES[index % PROPERTY_IMAGES.length],
    lat,
    lng,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

let _cachedProperties: Property[] | null = null;

export function getLightstoneProperties(count = 48): Property[] {
  if (_cachedProperties) return _cachedProperties;

  _cachedProperties = Array.from({ length: count }, (_, i) => {
    const raw = generateRawProperty(i);
    const { score, criteria } = runPredictionEngine(raw);
    return { ...raw, likelinessScore: score, criteria };
  }).sort((a, b) => b.likelinessScore - a.likelinessScore);

  return _cachedProperties;
}

export function getLightstonePropertyById(id: string): Property | undefined {
  return getLightstoneProperties().find((p) => p.id === id);
}
