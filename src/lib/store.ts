import { Agent, Deal, Settings, Activity, Property } from './types';
import { seedAgents } from '@/data/agents';
import { seedDeals } from '@/data/deals';
import { seedProperties } from '@/data/properties';

const KEYS = {
  agents: 'propscout_agents',
  deals: 'propscout_deals',
  settings: 'propscout_settings',
  activities: 'propscout_activities',
  properties: 'propscout_properties',
  farmedSuburbs: 'propscout_farmed',
  initialized: 'propscout_initialized',
};

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function getAgents(): Agent[] {
  return getItem<Agent[]>(KEYS.agents, []);
}

export function setAgents(agents: Agent[]): void {
  setItem(KEYS.agents, agents);
}

export function getDeals(): Deal[] {
  return getItem<Deal[]>(KEYS.deals, []);
}

export function setDeals(deals: Deal[]): void {
  setItem(KEYS.deals, deals);
}

export function getProperties(): Property[] {
  return getItem<Property[]>(KEYS.properties, []);
}

export function setProperties(properties: Property[]): void {
  setItem(KEYS.properties, properties);
}

export function getSettings(): Settings {
  return getItem<Settings>(KEYS.settings, {
    profile: { name: 'Carel de Beer', email: 'carel@linc.co.za', phone: '+27 82 000 0000', ffc: '', company: 'PropScout' },
    integrations: { anthropicKey: '', lightstoneKey: 'dd904dfe60eb48bcbf1c95266dc7ce83', lightstoneSecondaryKey: 'e5fc7786d6194f95961670a074a3c892' },
    defaults: { commissionPercent: 6, splitPercent: 30, preferredChannel: 'whatsapp' },
  });
}

export function setSettings(settings: Settings): void {
  setItem(KEYS.settings, settings);
}

export function getActivities(): Activity[] {
  return getItem<Activity[]>(KEYS.activities, []);
}

export function addActivity(activity: Omit<Activity, 'id' | 'timestamp'>): void {
  const activities = getActivities();
  activities.unshift({
    ...activity,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    timestamp: new Date().toISOString(),
  });
  setItem(KEYS.activities, activities.slice(0, 100));
}

export function getFarmedSuburbs(): string[] {
  return getItem<string[]>(KEYS.farmedSuburbs, ['sandhurst', 'sandton-central', 'bryanston', 'lonehill']);
}

export function setFarmedSuburbs(ids: string[]): void {
  setItem(KEYS.farmedSuburbs, ids);
}

export function initSeedData(): void {
  if (typeof window === 'undefined') return;
  const initialized = localStorage.getItem(KEYS.initialized);
  if (initialized) return;

  setAgents(seedAgents);
  setDeals(seedDeals);
  setProperties(seedProperties);
  setFarmedSuburbs(['sandhurst', 'sandton-central', 'bryanston', 'lonehill']);
  addActivity({ type: 'ai', message: 'PropScout initialized with seed data' });
  localStorage.setItem(KEYS.initialized, 'true');
}

export function resetAllData(): void {
  if (typeof window === 'undefined') return;
  Object.values(KEYS).forEach(key => localStorage.removeItem(key));
  initSeedData();
}
