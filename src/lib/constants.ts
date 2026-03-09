import { StageDefinition } from './types';

export const PIPELINE_STAGES: StageDefinition[] = [
  { key: 'scored', label: 'AI Scored', color: '#6E6E73', description: 'Properties flagged by scoring engine', isYours: true },
  { key: 'contacted', label: 'Contacted', color: '#5AC8FA', description: 'Outreach sent via WhatsApp/Email', isYours: true },
  { key: 'qualified', label: 'Qualified', color: '#AF52DE', description: 'Seller confirmed interest', isYours: true },
  { key: 'assigned', label: 'Assigned', color: '#FF9500', description: 'Handed to partner agent', isYours: true },
  { key: 'mandate', label: 'Mandate', color: '#FF9500', description: 'Agent signed mandate with seller', isYours: false },
  { key: 'listed', label: 'Listed', color: '#007AFF', description: 'Property on the market', isYours: false },
  { key: 'sold', label: 'Sold', color: '#34C759', description: 'Deal closed', isYours: false },
  { key: 'paid', label: 'Paid', color: '#34C759', description: 'Commission received', isYours: true },
];

export function getStageColor(stage: string): string {
  return PIPELINE_STAGES.find(s => s.key === stage)?.color || '#6E6E73';
}

export function getStageLabel(stage: string): string {
  return PIPELINE_STAGES.find(s => s.key === stage)?.label || stage;
}

export const MAP_CENTER: [number, number] = [-26.09, 28.045];
export const MAP_ZOOM = 12;
export const MAP_TILES = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
export const MAP_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>';

export const LIGHTSTONE_BASE_URL = 'https://apis.lightstone.co.za';
