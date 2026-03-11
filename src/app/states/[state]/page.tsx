import Link from 'next/link';
import { getAllRegions, getRegionByState, getRetailersByState, slugify, formatAnnualCost } from '@/lib/energy-data';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type PageProps = { params: Promise<{ state: string }> };

export function generateStaticParams() {
  return getAllRegions().map(r => ({ state: r.state.toLowerCase() }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state } = await params;
  const region = getRegionByState(state);
  if (!region) return {};
  return {
    title: `${region.region_name} Electricity Prices 2024-25 | Energy Comparison`,
    description: `Compare electricity prices across ${region.distribution_zones.length} distribution zones in ${region.region_name}. Based on AER Default Market Offer reference prices.`,
  };
}

export default async function StatePage({ params }: PageProps) {
  const { state } = await params;
  const region = getRegionByState(state);
  if (!region) notFound();

  const retailers = getRetailersByState(state);
  const cheapest = region.distribution_zones.reduce((a, b) => 
    a.residential.annual_cost < b.residential.annual_cost ? a : b
  );

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:underline">Home</Link> → <span>{region.region_name}</span>
      </nav>
      
      <h1 className="text-3xl font-bold mb-2">{region.region_name} Electricity Prices</h1>
      <p className="text-gray-600 mb-8">
        2024-25 reference prices for {region.distribution_zones.length} distribution zone{region.distribution_zones.length > 1 ? 's' : ''} in {region.state}
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Distribution Zones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {region.distribution_zones.map(zone => (
            <Link key={zone.zone} href={`/zones/${slugify(zone.zone)}`}
              className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{zone.zone}</h3>
                {zone === cheapest && region.distribution_zones.length > 1 && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Cheapest</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Residential</p>
                  <p className="text-2xl font-bold">{formatAnnualCost(zone.residential.annual_cost)}<span className="text-sm font-normal">/yr</span></p>
                  <p className="text-sm text-gray-600">{zone.residential.usage_rate_c_kwh}¢/kWh</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Small Business</p>
                  <p className="text-2xl font-bold">{formatAnnualCost(zone.small_business.annual_cost)}<span className="text-sm font-normal">/yr</span></p>
                  <p className="text-sm text-gray-600">{zone.small_business.usage_rate_c_kwh}¢/kWh</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Energy Retailers in {region.state}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {retailers.map(r => (
            <div key={r.name} className="bg-white rounded-lg border p-4">
              <a href={r.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">{r.name}</a>
              <p className="text-xs text-gray-500 mt-1">{r.type}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center">
        <Link href="/" className="text-blue-600 hover:underline">← Back to all states</Link>
      </div>
    </main>
  );
}
