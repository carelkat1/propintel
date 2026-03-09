import { getSettings } from './store';

async function lightstoneGet(path: string): Promise<unknown> {
  const settings = getSettings();
  const key = settings.integrations.lightstoneKey;

  if (!key) {
    throw new Error('Lightstone API key not configured');
  }

  const res = await fetch(`/api/lightstone?path=${encodeURIComponent(path)}`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    if (res.status === 204) return null;
    throw new Error(`Lightstone API error: ${res.status}`);
  }

  return res.json();
}

export async function searchAddress(query: string) {
  return lightstoneGet(`/lspsearch/address?query=${encodeURIComponent(query)}`);
}

export async function searchSuburb(query: string) {
  return lightstoneGet(`/lspsearch/suburb?query=${encodeURIComponent(query)}`);
}

export async function getPropertyDetails(propertyId: string) {
  return lightstoneGet(`/lspdata/property/${propertyId}/propertydetails`);
}

export async function getPropertyAVM(propertyId: string) {
  return lightstoneGet(`/lspdata/property/${propertyId}/avm`);
}

export async function getPropertyOwner(propertyId: string) {
  return lightstoneGet(`/lspdata/property/${propertyId}/owner`);
}

export async function getPropertyTransferHistory(propertyId: string) {
  return lightstoneGet(`/lspdata/property/${propertyId}/transferhistory`);
}

export async function getPropertyBondHistory(propertyId: string) {
  return lightstoneGet(`/lspdata/property/${propertyId}/bondhistory`);
}

export async function getPropertyComparableSales(propertyId: string) {
  return lightstoneGet(`/lspdata/property/${propertyId}/comparablesales`);
}

export async function getSuburbSalesAnalytics(suburbId: string) {
  return lightstoneGet(`/lspdata/suburb/${suburbId}/salesanalytics`);
}

export async function getSuburbPriceIndex(suburbId: string) {
  return lightstoneGet(`/lspdata/suburb/${suburbId}/priceindex`);
}

export async function getSuburbDetails(suburbId: string) {
  return lightstoneGet(`/lspdata/suburb/${suburbId}/suburbdetails`);
}

export async function getPropertyImprovement(propertyId: string) {
  return lightstoneGet(`/lspdata/property/${propertyId}/improvement`);
}

export async function getPropertyAddress(propertyId: string) {
  return lightstoneGet(`/lspdata/property/${propertyId}/address`);
}

export async function autocompleteAddress(query: string) {
  return lightstoneGet(`/lspsearch/complete?query=${encodeURIComponent(query)}&useSearchAsYouType=true`);
}
