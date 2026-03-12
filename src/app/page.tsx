import Link from 'next/link';
import { getAllRegions, getAllZones, getAllRetailers, slugify, formatAnnualCost } from '@/lib/energy-data';

export default function HomePage() {
  const regions = getAllRegions();
  const zones = getAllZones();
  const retailers = getAllRetailers();
  const cheapestZone = zones.reduce((a, b) => a.residential.annual_cost < b.residential.annual_cost ? a : b);
  const mostExpensiveZone = zones.reduce((a, b) => a.residential.annual_cost > b.residential.annual_cost ? a : b);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Australian Energy Plan Comparison</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Compare electricity prices across {zones.length} distribution zones in {regions.length} states.
          Find the best energy deal for your home or business.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Based on 2024-25 AER Default Market Offer &amp; Victorian Default Offer reference prices
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <p className="text-sm text-green-700 font-medium">Cheapest Region</p>
          <p className="text-2xl font-bold text-green-900">{cheapestZone.zone}</p>
          <p className="text-lg text-green-800">{formatAnnualCost(cheapestZone.residential.annual_cost)}/yr</p>
          <p className="text-xs text-green-600">{cheapestZone.state}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <p className="text-sm text-blue-700 font-medium">Distribution Zones</p>
          <p className="text-3xl font-bold text-blue-900">{zones.length}</p>
          <p className="text-sm text-blue-700">across {regions.length} states</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-sm text-red-700 font-medium">Most Expensive Region</p>
          <p className="text-2xl font-bold text-red-900">{mostExpensiveZone.zone}</p>
          <p className="text-lg text-red-800">{formatAnnualCost(mostExpensiveZone.residential.annual_cost)}/yr</p>
          <p className="text-xs text-red-600">{mostExpensiveZone.state}</p>
        </div>
      </div>

      {/* State Comparison Table */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Electricity Prices by State</h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow-sm border">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-3 text-left font-semibold">Zone</th>
                <th className="px-4 py-3 text-left font-semibold">State</th>
                <th className="px-4 py-3 text-right font-semibold">Annual Cost</th>
                <th className="px-4 py-3 text-right font-semibold">Usage Rate</th>
                <th className="px-4 py-3 text-right font-semibold">Daily Supply</th>
              </tr>
            </thead>
            <tbody>
              {zones.sort((a, b) => a.residential.annual_cost - b.residential.annual_cost).map((zone, i) => (
                <tr key={zone.zone} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3">
                    <Link href={`/zones/${slugify(zone.zone)}`} className="text-blue-600 hover:underline font-medium">
                      {zone.zone}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/states/${zone.state.toLowerCase()}`} className="text-blue-600 hover:underline">
                      {zone.region_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{formatAnnualCost(zone.residential.annual_cost)}</td>
                  <td className="px-4 py-3 text-right">{zone.residential.usage_rate_c_kwh}¢/kWh</td>
                  <td className="px-4 py-3 text-right">{zone.residential.daily_supply_charge_c}¢/day</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Retailers Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Energy Retailers</h2>
          <Link href="/retailers" className="text-blue-600 hover:underline">View all {retailers.length} retailers →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {retailers.slice(0, 8).map(r => (
            <div key={r.name} className="bg-white rounded-lg border p-4">
              <p className="font-semibold">{r.name}</p>
              <p className="text-xs text-gray-500">{r.type}</p>
              <p className="text-xs text-gray-400">{r.states.join(', ')}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Navigation Links */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Browse by State</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {regions.map(r => (
            <Link key={r.state} href={`/states/${r.state.toLowerCase()}`}
              className="bg-white rounded-xl border p-6 text-center hover:shadow-md transition-shadow">
              <p className="text-2xl font-bold">{r.state}</p>
              <p className="text-gray-600">{r.region_name}</p>
              <p className="text-sm text-gray-500">{r.distribution_zones.length} zone{r.distribution_zones.length > 1 ? 's' : ''}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link href="/tools/calculator" className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold text-yellow-900">⚡ Bill Calculator</h3>
          <p className="text-sm text-yellow-700">Estimate your electricity costs by appliance</p>
        </Link>
        <Link href="/tools/solar" className="bg-orange-50 border border-orange-200 rounded-xl p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold text-orange-900">☀️ Solar Savings Calculator</h3>
          <p className="text-sm text-orange-700">Estimate your solar panel savings by state</p>
        </Link>
        <Link href="/tips" className="bg-green-50 border border-green-200 rounded-xl p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold text-green-900">💡 Energy Saving Tips</h3>
          <p className="text-sm text-green-700">8 tips to reduce your power bill</p>
        </Link>
        <Link href="/retailers" className="bg-blue-50 border border-blue-200 rounded-xl p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold text-blue-900">🏢 Retailer Directory</h3>
          <p className="text-sm text-blue-700">Compare {retailers.length} energy companies</p>
        </Link>
      </section>

      {/* Footer handled by layout */}
    </main>
  );
}
