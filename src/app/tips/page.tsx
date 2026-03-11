import Link from 'next/link';
import { getAllTips } from '@/lib/energy-data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Energy Saving Tips Australia | Reduce Your Power Bill',
  description: '8 proven tips to reduce your Australian electricity bill. From LED lighting to solar panels — save up to 30% on your energy costs.',
};

export default function TipsPage() {
  const tips = getAllTips();
  const totalPotential = tips.reduce((sum, t) => sum + t.saving_pct, 0);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:underline">Home</Link> → <span>Energy Saving Tips</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">Energy Saving Tips</h1>
      <p className="text-gray-600 mb-8">
        {tips.length} proven ways to reduce your electricity bill. Combined potential savings: up to {totalPotential}%.
      </p>

      <div className="space-y-6">
        {tips.sort((a, b) => b.saving_pct - a.saving_pct).map((tip, i) => (
          <div key={tip.title} className="bg-white rounded-xl border p-6">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 text-green-800 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shrink-0">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold">{tip.title}</h2>
                  <span className="bg-green-50 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                    Save ~{tip.saving_pct}%
                  </span>
                </div>
                <p className="text-gray-600">{tip.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
        <h3 className="font-bold text-blue-900">📊 Compare Prices First</h3>
        <p className="text-sm text-blue-800">
          Before investing in efficiency upgrades, make sure you&apos;re on the cheapest plan available.
          <Link href="/" className="text-blue-600 hover:underline ml-1">Compare energy prices →</Link>
        </p>
      </div>

      <div className="text-center mt-8">
        <Link href="/" className="text-blue-600 hover:underline">← Back to comparison</Link>
      </div>
    </main>
  );
}
