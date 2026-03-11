import Link from 'next/link';
import { getAllRetailers } from '@/lib/energy-data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Australian Energy Retailers Directory | Compare Energy Companies',
  description: 'Compare 20+ Australian energy retailers. Find the best electricity provider for your state — Big 3, budget, green, and wholesale options.',
};

export default function RetailersPage() {
  const retailers = getAllRetailers();
  const types = [...new Set(retailers.map(r => r.type))];

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:underline">Home</Link> → <span>Retailers</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">Australian Energy Retailers</h1>
      <p className="text-gray-600 mb-8">{retailers.length} energy companies compared across Australia</p>

      {types.map(type => (
        <section key={type} className="mb-10">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">{type} Retailers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {retailers.filter(r => r.type === type).map(r => (
              <div key={r.name} className="bg-white rounded-xl border p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{r.name}</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{r.type}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Available in: {r.states.join(', ')}</p>
                <a href={r.website} target="_blank" rel="noopener noreferrer"
                  className="text-blue-600 text-sm hover:underline">
                  Visit website →
                </a>
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="text-center mt-8">
        <Link href="/" className="text-blue-600 hover:underline">← Back to comparison</Link>
      </div>
    </main>
  );
}
