export interface Suburb {
  name: string;
  lat: number;
  lng: number;
  score: number;
  avgPrice: number;
  growth: number;
  stock: number;
  hotLeads: number;
  velocity: number;
  color: string;
}

export interface Property {
  id: number;
  address: string;
  score: number;
  owner: string;
  phone: string;
  email: string;
  yearsOwned: number;
  value: number;
  lastSale: number;
  bond: number;
  beds: number;
  baths: number;
  size: number;
  erf: number;
  signals: string[];
  pipelineStage: string | null;
}

export interface PipelineStage {
  stage: string;
  key: string;
  count: number;
  color: string;
}

export interface ActivityItem {
  time: string;
  text: string;
  color: string;
}

export interface Alert {
  id: number;
  type: string;
  severity: "hot" | "warm" | "info";
  time: string;
  title: string;
  desc: string;
  suburb: string;
}

export interface DealDoc {
  n: string;
  t: string;
  d: string;
  s: boolean;
}

export interface Deal {
  id: number;
  deal: string;
  status: string;
  docs: DealDoc[];
}

export interface PostSaleClient {
  owner: string;
  prop: string;
  stage: string;
  timeline: { d: string; e: string; done: boolean }[];
}

export interface PriceDataPoint {
  m: string;
  a?: number;
  p?: number;
}

export interface NavItem {
  id: string;
  icon: string;
  label: string;
  href: string;
}

export interface OTPClause {
  n: string;
  r?: boolean;
}

export interface PPRACheck {
  c: string;
  s: "pass" | "warn" | "fail";
  d: string;
}

export interface Platform {
  k: string;
  n: string;
  c: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  channel: "email" | "whatsapp";
  strategy: string;
  template: string;
}
