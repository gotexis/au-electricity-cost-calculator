import Link from 'next/link';
import { getAllZones, getZoneBySlug, getRetailersByState, slugify, formatAnnualCost } from '@/lib/energy-data';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type PageProps = { params: Promise<{ zone: string }> };

export function generateStaticParams() {
  return getAllZones().map(z => ({ zone: slugify(z.zone) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { zone: zoneSlug } = await params;
  const zone = getZoneBySlug(zoneSlug);
  if (!zone) return {};
  return {
    title: `${zone.zone} Electricity Prices 2024-25 | ${zone.region_name}`,
    description: `Electricity prices for ${zone.zone} distribution zone in ${zone.region_name}. Residential: ${formatAnnualCost(zone.residential.annual_cost)}/yr at ${zone.residential.usage_rate_c_kwh}¢/kWh.`,
  };
}

export default async function ZonePage({ params }: PageProps) {
  const { zone: zoneSlug } = await params;
  const zone = getZoneBySlug(zoneSlug);
  if (!zone) notFound();

  const allZones = getAllZones().sort((a, b) => a.residential.annual_cost - b.residential.annual_cost);
  const rank = allZones.findIndex(z => slugify(z.zone) === zoneSlug) + 1;
  const retailers = getRetailersByState(zone.state);

  const monthlyRes = Math.round(zone.residential.annual_cost / 12);
  const quarterlyRes = Math.round(zone.residential.annual_cost / 4);
  const dailyRes = (zone.residential.annual_cost / 365).toFixed(2);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:underline">Home</Link>
        {' → '}
        <Link href={`/states/${zone.state.toLowerCase()}`} className="hover:underline">{zone.region_name}</Link>
        {' → '}
        <span>{zone.zone}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">{zone.zone} Electricity Prices</h1>
      <p className="text-gray-600 mb-2">{zone.region_name} ({zone.state}) • 2024-25 Reference Prices</p>
      <p className="text-sm text-gray-500 mb-8">Ranked #{rank} of {allZones.length} zones (cheapest to most expensive)</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-bold mb-4 text-blue-900">🏠 Residential</h2>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-gray-600">Annual Cost</span><span className="font-bold text-2xl">{formatAnnualCost(zone.residential.annual_cost)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Quarterly</span><span className="font-semibold">${quarterlyRes}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Monthly</span><span className="font-semibold">${monthlyRes}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Daily</span><span className="font-semibold">${dailyRes}</span></div>
            <hr />
            <div className="flex justify-between"><span className="text-gray-600">Usage Rate</span><span className="font-semibold">{zone.residential.usage_rate_c_kwh}¢/kWh</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Daily Supply Charge</span><span className="font-semibold">{zone.residential.daily_supply_charge_c}¢/day</span></div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-bold mb-4 text-purple-900">🏢 Small Business</h2>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-gray-600">Annual Cost</span><span className="font-bold text-2xl">{formatAnnualCost(zone.small_business.annual_cost)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Quarterly</span><span className="font-semibold">${Math.round(zone.small_business.annual_cost / 4)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Monthly</span><span className="font-semibold">${Math.round(zone.small_business.annual_cost / 12)}</span></div>
            <hr />
            <div className="flex justify-between"><span className="text-gray-600">Usage Rate</span><span className="font-semibold">{zone.small_business.usage_rate_c_kwh}¢/kWh</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Daily Supply Charge</span><span className="font-semibold">{zone.small_business.daily_supply_charge_c}¢/day</span></div>
          </div>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Available Energy Retailers</h2>
        <p className="text-gray-600 mb-4">{retailers.length} energy companies operate in {zone.state}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {retailers.map(r => (
            <a key={r.name} href={r.website} target="_blank" rel="noopener noreferrer"
              className="bg-white rounded-lg border p-4 hover:shadow-sm transition-shadow">
              <p className="font-semibold text-blue-600">{r.name}</p>
              <p className="text-xs text-gray-500">{r.type}</p>
            </a>
          ))}
        </div>
      </section>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
        <h3 className="font-bold text-yellow-900">💡 Save Money</h3>
        <p className="text-sm text-yellow-800">
          These are maximum reference prices (DMO/VDO caps). Most competitive plans offer 10-25% below these rates.
          <Link href="/tips" className="text-blue-600 hover:underline ml-1">See energy saving tips →</Link>
        </p>
      </div>

      <div className="text-center space-x-4">
        <Link href={`/states/${zone.state.toLowerCase()}`} className="text-blue-600 hover:underline">← {zone.region_name}</Link>
        <Link href="/" className="text-blue-600 hover:underline">All states</Link>
      </div>
    </main>
  );
}
