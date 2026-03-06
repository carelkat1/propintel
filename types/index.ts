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

export interface CriterionDetail {
  name: SellCriterion;
  weight: number;
  explanation: string;
}

export interface Property {
  id: string;
  // ── Lightstone API field equivalents ──────────────────────────────────────
  address: string;               // streetAddress
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  garages: number;
  erfSize: number;               // erfExtent (m²)
  floorSize: number;             // grossFloorArea (m²)
  estimatedValue: number;        // avm – Automated Valuation Model (ZAR)
  lastSaleDate: string;          // lastTransferDate (ISO)
  lastSalePrice: number;         // lastTransferPrice (ZAR)
  ownerName: string;             // registeredOwner
  ownerEmail: string;
  ownerPhone: string;
  ownerAge: number;              // derived from ownerDateOfBirth
  yearsOwned: number;            // derived from lastTransferDate
  municipalValuation: number;    // municipalValue (ZAR)
  neighborhoodSalesVelocity: number; // neighbourhood analytics (tx/year, 500m radius)
  hasRenovationPermit: boolean;  // council permit data
  hasDivorceRecord: boolean;     // deeds/court data integration
  hasEstateRecord: boolean;      // deceased estate registry
  isAbsenteeOwner: boolean;      // owner address vs property address mismatch
  hasFinancialStressIndicator: boolean; // credit bureau integration
  // ── Computed by prediction engine ─────────────────────────────────────────
  likelinessScore: number;       // 0–100
  criteria: SellCriterion[];
  criteriaDetails: CriterionDetail[];
  // ── Display ───────────────────────────────────────────────────────────────
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
  timestamp: string;
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
  criteriaDetails?: CriterionDetail[];
  status: LeadStatus;
  notes: Note[];
  assignedAgent: string;
  createdAt: string;
  updatedAt: string;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface PropertiesResponse {
  properties: Property[];
  total: number;
  highConfidence: number;
  moderate: number;
  watchList: number;
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
