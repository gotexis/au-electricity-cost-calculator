import energyData from '../../data/energy-plans.json';

export type DistributionZone = {
  zone: string;
  residential: { annual_cost: number; daily_supply_charge_c: number; usage_rate_c_kwh: number };
  small_business: { annual_cost: number; daily_supply_charge_c: number; usage_rate_c_kwh: number };
};

export type Region = {
  state: string;
  region_name: string;
  distribution_zones: DistributionZone[];
};

export type Retailer = {
  name: string;
  website: string;
  states: string[];
  type: string;
};

export type Tip = {
  title: string;
  saving_pct: number;
  description: string;
};

export function getAllRegions(): Region[] {
  return [...energyData.dmo.regions, ...energyData.vdo.regions];
}

export function getRegionByState(state: string): Region | undefined {
  return getAllRegions().find(r => r.state.toLowerCase() === state.toLowerCase());
}

export function getAllZones(): (DistributionZone & { state: string; region_name: string })[] {
  return getAllRegions().flatMap(r =>
    r.distribution_zones.map(z => ({ ...z, state: r.state, region_name: r.region_name }))
  );
}

export function getZoneBySlug(slug: string): (DistributionZone & { state: string; region_name: string }) | undefined {
  return getAllZones().find(z => slugify(z.zone) === slug);
}

export function getAllRetailers(): Retailer[] {
  return energyData.retailers;
}

export function getRetailersByState(state: string): Retailer[] {
  return energyData.retailers.filter(r => r.states.includes(state.toUpperCase()));
}

export function getAllTips(): Tip[] {
  return energyData.tips;
}

export function getMetadata() {
  return energyData.metadata;
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatAnnualCost(dollars: number): string {
  return `$${dollars.toLocaleString()}`;
}
