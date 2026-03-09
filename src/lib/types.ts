export type PipelineStage = 'scored' | 'contacted' | 'qualified' | 'assigned' | 'mandate' | 'listed' | 'sold' | 'paid';

export interface Suburb {
  id: string;
  name: string;
  lat: number;
  lng: number;
  score: number;
  avgPrice: number;
  growth: number;
  stock: number;
  hotLeads: number;
  velocity: number;
  farmed: boolean;
}

export interface Property {
  id: string;
  address: string;
  suburb: string;
  suburbId: string;
  score: number;
  owner: string;
  phone: string;
  email: string;
  yearsOwned: number;
  value: number;
  lastSalePrice: number;
  lastSaleDate: string;
  bondBalance: number;
  municipalValue: number;
  beds: number;
  baths: number;
  size: number;
  erf: number;
  signals: string[];
  pipelineStage: PipelineStage | null;
  lightstoneId?: string;
}

export interface Agent {
  id: string;
  name: string;
  phone: string;
  email: string;
  agency: string;
  area: string;
  split: number;
  ffc: string;
  rating: number;
  deals: number;
  avgDays: number;
  earned: number;
  activeLeads: number;
  status: 'active' | 'inactive';
  notes: string;
  createdAt: string;
}

export interface Deal {
  id: string;
  propertyId: string;
  property: string;
  suburb: string;
  seller: string;
  value: number;
  agentId: string | null;
  agentName: string | null;
  stage: PipelineStage;
  score: number;
  commission: number;
  yourCut: number;
  daysInPipeline: number;
  timestamps: Partial<Record<PipelineStage, string>>;
  createdAt: string;
}

export interface Alert {
  id: string;
  type: 'estate' | 'financial' | 'cluster' | 'divorce' | 'listing' | 'development' | 'emigration' | 'valuation';
  severity: 'hot' | 'warm' | 'info';
  title: string;
  description: string;
  suburb: string;
  propertyId?: string;
  timestamp: string;
}

export interface PriceDataPoint {
  month: string;
  actual: number | null;
  predicted: number | null;
  lower: number | null;
  upper: number | null;
}

export interface Activity {
  id: string;
  type: 'revenue' | 'outreach' | 'ai' | 'assignment';
  message: string;
  timestamp: string;
}

export interface Settings {
  profile: {
    name: string;
    email: string;
    phone: string;
    ffc: string;
    company: string;
  };
  integrations: {
    anthropicKey: string;
    lightstoneKey: string;
    lightstoneSecondaryKey: string;
  };
  defaults: {
    commissionPercent: number;
    splitPercent: number;
    preferredChannel: 'email' | 'whatsapp';
  };
}

export interface StageDefinition {
  key: PipelineStage;
  label: string;
  color: string;
  description: string;
  isYours: boolean;
}
