// ─── Property & Prediction Types ─────────────────────────────────────────────

export type PropertyType =
  | "Freehold"
  | "Sectional Title"
  | "Estate"
  | "Agricultural"
  | "Commercial";

export type SellCriterion =
  | "Empty Nester"
  | "7+ Years Owned"
  | "10+ Years Owned"
  | "Retirement Age"
  | "High Area Sales Velocity"
  | "Divorce Record"
  | "Estate / Probate"
  | "Recent Renovation Permits"
  | "Under-valued Property"
  | "Financial Stress Indicators"
  | "Life Event – Marriage"
  | "Downsizing Candidate"
  | "Upsizing Candidate"
  | "Absentee Owner";

export interface Property {
  id: string;
  address: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  garages: number;
  erfSize: number; // sqm
  floorSize: number; // sqm
  estimatedValue: number; // ZAR
  lastSaleDate: string; // ISO date
  lastSalePrice: number; // ZAR
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerAge: number;
  yearsOwned: number;
  municipalValuation: number; // ZAR
  neighborhoodSalesVelocity: number; // transactions / year in 500m radius
  hasRenovationPermit: boolean;
  hasDivorceRecord: boolean;
  hasEstateRecord: boolean;
  isAbsenteeOwner: boolean;
  hasFinancialStressIndicator: boolean;
  likelinessScore: number; // 0–100
  criteria: SellCriterion[];
  imageUrl: string;
  lat: number;
  lng: number;
}

// ─── CRM / Lead Types ─────────────────────────────────────────────────────────

export type LeadStatus =
  | "Identified"
  | "Outreach Sent"
  | "Meeting Set"
  | "Signed";

export type NoteType = "email" | "call" | "message" | "meeting";

export interface Note {
  id: string;
  type: NoteType;
  content: string;
  timestamp: string; // ISO datetime
  agent: string;
}

export interface Lead {
  id: string;
  propertyId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  address: string;
  suburb: string;
  estimatedValue: number;
  likelinessScore: number;
  criteria: SellCriterion[];
  status: LeadStatus;
  notes: Note[];
  assignedAgent: string;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface PropertiesResponse {
  properties: Property[];
  total: number;
  highConfidence: number; // >= 70
  averageScore: number;
}

export interface LeadsResponse {
  leads: Lead[];
  total: number;
  pipeline: Record<LeadStatus, number>;
}

// ─── UI State Types ───────────────────────────────────────────────────────────

export type ViewMode = "grid" | "list";
export type SortKey = "likelinessScore" | "estimatedValue" | "yearsOwned";
export type FilterRange = "all" | "high" | "medium" | "low";
