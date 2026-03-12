'use client';

import { useState } from 'react';

const STATES = [
  { name: 'NSW', avgRate: 36.07, feedIn: 5.0, sunHours: 5.2 },
  { name: 'QLD', avgRate: 31.04, feedIn: 5.0, sunHours: 5.7 },
  { name: 'VIC', avgRate: 32.92, feedIn: 4.3, sunHours: 4.3 },
  { name: 'SA', avgRate: 42.39, feedIn: 5.0, sunHours: 5.5 },
  { name: 'WA', avgRate: 30.82, feedIn: 2.25, sunHours: 5.8 },
  { name: 'TAS', avgRate: 29.0, feedIn: 5.0, sunHours: 3.8 },
  { name: 'ACT', avgRate: 28.5, feedIn: 6.0, sunHours: 5.0 },
  { name: 'NT', avgRate: 27.06, feedIn: 8.3, sunHours: 6.2 },
];

const SYSTEM_SIZES = [3, 5, 6.6, 8, 10, 13];

export default function SolarCalculator() {
  const [state, setState] = useState('NSW');
  const [systemSize, setSystemSize] = useState(6.6);
  const [dailyUsage, setDailyUsage] = useState(20);
  const [selfConsumption, setSelfConsumption] = useState(40);
  const [systemCost, setSystemCost] = useState(7000);

  const stateData = STATES.find(s => s.name === state)!;

  // Calculate solar generation
  const dailyGeneration = systemSize * stateData.sunHours;
  const annualGeneration = dailyGeneration * 365;

  // Self-consumed vs exported
  const selfConsumedKwh = dailyGeneration * (selfConsumption / 100);
  const exportedKwh = dailyGeneration - selfConsumedKwh;

  // Savings
  const dailySavings = (selfConsumedKwh * stateData.avgRate / 100) + (exportedKwh * stateData.feedIn / 100);
  const annualSavings = dailySavings * 365;
  const paybackYears = systemCost / annualSavings;
  const savings25yr = annualSavings * 25 - systemCost;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">☀️ Solar Savings Calculator</h1>
      <p className="text-gray-600 mb-8">
        Estimate how much you could save with solar panels in Australia.
        Based on average state electricity rates, feed-in tariffs, and peak sun hours.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-6">
          <div>
            <label className="block font-semibold mb-2">State</label>
            <select value={state} onChange={e => setState(e.target.value)}
              className="select select-bordered w-full">
              {STATES.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">System Size: {systemSize} kW</label>
            <div className="flex flex-wrap gap-2">
              {SYSTEM_SIZES.map(s => (
                <button key={s} onClick={() => setSystemSize(s)}
                  className={`btn btn-sm ${systemSize === s ? 'btn-primary' : 'btn-outline'}`}>
                  {s} kW
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Daily Usage: {dailyUsage} kWh</label>
            <input type="range" min={5} max={60} value={dailyUsage}
              onChange={e => setDailyUsage(Number(e.target.value))}
              className="range range-primary w-full" />
            <div className="flex justify-between text-xs text-gray-400"><span>5 kWh</span><span>60 kWh</span></div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Self-Consumption: {selfConsumption}%</label>
            <input type="range" min={10} max={90} value={selfConsumption}
              onChange={e => setSelfConsumption(Number(e.target.value))}
              className="range range-secondary w-full" />
            <div className="flex justify-between text-xs text-gray-400"><span>10% (mostly export)</span><span>90% (mostly self-use)</span></div>
          </div>

          <div>
            <label className="block font-semibold mb-2">System Cost ($)</label>
            <input type="number" value={systemCost} onChange={e => setSystemCost(Number(e.target.value))}
              className="input input-bordered w-full" min={1000} max={50000} step={500} />
            <p className="text-xs text-gray-400 mt-1">After STCs/rebates. Typical: $4,000–$15,000</p>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-yellow-900 mb-4">Your Solar Estimate</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Daily generation</span>
                <span className="font-semibold">{dailyGeneration.toFixed(1)} kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Annual generation</span>
                <span className="font-semibold">{annualGeneration.toFixed(0)} kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Self-consumed daily</span>
                <span className="font-semibold">{selfConsumedKwh.toFixed(1)} kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Exported daily</span>
                <span className="font-semibold">{exportedKwh.toFixed(1)} kWh</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-green-900 mb-4">💰 Savings</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Daily savings</span>
                <span className="font-bold text-green-700">${dailySavings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-700 font-medium">Annual savings</span>
                <span className="font-bold text-green-700">${annualSavings.toFixed(0)}</span>
              </div>
              <hr />
              <div className="flex justify-between">
                <span className="text-gray-600">Payback period</span>
                <span className="font-bold text-blue-700">{paybackYears.toFixed(1)} years</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-700 font-medium">25-year net savings</span>
                <span className={`font-bold ${savings25yr > 0 ? 'text-green-700' : 'text-red-700'}`}>
                  ${savings25yr.toFixed(0)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
            <h3 className="font-semibold text-blue-900 mb-2">📊 {state} Rates</h3>
            <p>Avg electricity: {stateData.avgRate}¢/kWh</p>
            <p>Feed-in tariff: {stateData.feedIn}¢/kWh</p>
            <p>Peak sun hours: {stateData.sunHours}h/day</p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p><strong>Disclaimer:</strong> This calculator provides estimates only. Actual savings depend on your specific electricity plan,
        roof orientation, shading, panel efficiency, and local conditions. Feed-in tariffs and electricity rates vary by retailer.
        Sun hours are annual averages from BOM data.</p>
      </div>
    </main>
  );
}
