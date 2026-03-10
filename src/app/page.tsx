"use client";

import { useState } from "react";

interface Appliance {
  id: number;
  name: string;
  watts: number;
  hoursPerDay: number;
}

const DEFAULT_APPLIANCES: Appliance[] = [
  { id: 1, name: "Air Conditioner", watts: 2000, hoursPerDay: 4 },
  { id: 2, name: "Fridge/Freezer", watts: 150, hoursPerDay: 24 },
  { id: 3, name: "Washing Machine", watts: 500, hoursPerDay: 1 },
  { id: 4, name: "Dishwasher", watts: 1800, hoursPerDay: 1 },
  { id: 5, name: "Electric Oven", watts: 2400, hoursPerDay: 0.5 },
  { id: 6, name: "TV (55 inch)", watts: 100, hoursPerDay: 4 },
  { id: 7, name: "LED Lights (10x)", watts: 100, hoursPerDay: 6 },
  { id: 8, name: "Electric Hot Water", watts: 3600, hoursPerDay: 3 },
  { id: 9, name: "Pool Pump", watts: 1100, hoursPerDay: 6 },
  { id: 10, name: "Computer/Monitor", watts: 200, hoursPerDay: 8 },
];

const TARIFF_OPTIONS = [
  { label: "Flat Rate", peakRate: 0.30, offPeakRate: 0.30, shoulderRate: 0.30, dailySupply: 1.05 },
  { label: "Time of Use (TOU)", peakRate: 0.45, offPeakRate: 0.18, shoulderRate: 0.28, dailySupply: 1.05 },
  { label: "Controlled Load", peakRate: 0.22, offPeakRate: 0.22, shoulderRate: 0.22, dailySupply: 0.50 },
];

export default function Home() {
  const [appliances, setAppliances] = useState<Appliance[]>(DEFAULT_APPLIANCES);
  const [tariffIndex, setTariffIndex] = useState(0);
  const [customRate, setCustomRate] = useState(0.30);
  const [useCustom, setUseCustom] = useState(false);
  const [solarKw, setSolarKw] = useState(0);
  const [solarHours, setSolarHours] = useState(4.5);
  const [feedInTariff, setFeedInTariff] = useState(0.05);
  const [nextId, setNextId] = useState(11);

  const tariff = TARIFF_OPTIONS[tariffIndex];
  const effectiveRate = useCustom ? customRate : tariff.peakRate;
  const dailySupply = useCustom ? 1.05 : tariff.dailySupply;

  // Calculate daily kWh
  const dailyKwh = appliances.reduce(
    (sum, a) => sum + (a.watts * a.hoursPerDay) / 1000,
    0
  );

  // Solar generation
  const dailySolarKwh = solarKw * solarHours;
  const selfConsumed = Math.min(dailySolarKwh * 0.7, dailyKwh);
  const exported = dailySolarKwh - selfConsumed;

  // Costs
  const dailyCostNoSolar = dailyKwh * effectiveRate + dailySupply;
  const dailySolarSavings = selfConsumed * effectiveRate + exported * feedInTariff;
  const dailyCost = Math.max(dailyCostNoSolar - dailySolarSavings, dailySupply);

  const quarterlyCost = dailyCost * 91;
  const annualCost = dailyCost * 365;

  const updateAppliance = (id: number, field: keyof Appliance, value: string | number) => {
    setAppliances((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const addAppliance = () => {
    setAppliances((prev) => [
      ...prev,
      { id: nextId, name: "New Appliance", watts: 100, hoursPerDay: 1 },
    ]);
    setNextId((n) => n + 1);
  };

  const removeAppliance = (id: number) => {
    setAppliances((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2">
        ⚡ AU Electricity Cost Calculator
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Estimate your Australian power bill by appliance. Includes solar offset
        &amp; time-of-use tariffs.
      </p>

      {/* Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <div className="text-sm text-gray-500 mb-1">Daily Cost</div>
          <div className="text-3xl font-bold text-blue-600">
            ${dailyCost.toFixed(2)}
          </div>
          <div className="text-xs text-gray-400">{dailyKwh.toFixed(1)} kWh/day</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <div className="text-sm text-gray-500 mb-1">Quarterly Bill</div>
          <div className="text-3xl font-bold text-orange-600">
            ${quarterlyCost.toFixed(0)}
          </div>
          <div className="text-xs text-gray-400">~91 days</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <div className="text-sm text-gray-500 mb-1">Annual Cost</div>
          <div className="text-3xl font-bold text-red-600">
            ${annualCost.toFixed(0)}
          </div>
          {dailySolarKwh > 0 && (
            <div className="text-xs text-green-600">
              Solar saves ${(dailySolarSavings * 365).toFixed(0)}/yr
            </div>
          )}
        </div>
      </div>

      {/* Tariff Selection */}
      <section className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">💰 Tariff Settings</h2>
        <div className="flex flex-wrap gap-3 mb-4">
          {TARIFF_OPTIONS.map((t, i) => (
            <button
              key={i}
              onClick={() => {
                setTariffIndex(i);
                setUseCustom(false);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                !useCustom && tariffIndex === i
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
          <button
            onClick={() => setUseCustom(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              useCustom
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Custom Rate
          </button>
        </div>
        {useCustom ? (
          <div className="flex items-center gap-2">
            <label className="text-sm">Rate ($/kWh):</label>
            <input
              type="number"
              step="0.01"
              value={customRate}
              onChange={(e) => setCustomRate(parseFloat(e.target.value) || 0)}
              className="border rounded px-3 py-1 w-24"
            />
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            Peak: ${tariff.peakRate}/kWh | Off-Peak: ${tariff.offPeakRate}/kWh |
            Shoulder: ${tariff.shoulderRate}/kWh | Supply: $
            {tariff.dailySupply}/day
          </div>
        )}
      </section>

      {/* Appliances */}
      <section className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">🔌 Appliances</h2>
          <button
            onClick={addAppliance}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition"
          >
            + Add Appliance
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Appliance</th>
                <th className="pb-2">Watts</th>
                <th className="pb-2">Hours/Day</th>
                <th className="pb-2">Daily kWh</th>
                <th className="pb-2">Daily Cost</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {appliances.map((a) => {
                const dkwh = (a.watts * a.hoursPerDay) / 1000;
                return (
                  <tr key={a.id} className="border-b last:border-0">
                    <td className="py-2">
                      <input
                        type="text"
                        value={a.name}
                        onChange={(e) =>
                          updateAppliance(a.id, "name", e.target.value)
                        }
                        className="border rounded px-2 py-1 w-full max-w-[180px]"
                      />
                    </td>
                    <td className="py-2">
                      <input
                        type="number"
                        value={a.watts}
                        onChange={(e) =>
                          updateAppliance(
                            a.id,
                            "watts",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="border rounded px-2 py-1 w-20"
                      />
                    </td>
                    <td className="py-2">
                      <input
                        type="number"
                        step="0.5"
                        value={a.hoursPerDay}
                        onChange={(e) =>
                          updateAppliance(
                            a.id,
                            "hoursPerDay",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="border rounded px-2 py-1 w-20"
                      />
                    </td>
                    <td className="py-2 text-gray-700">{dkwh.toFixed(2)}</td>
                    <td className="py-2 font-medium">
                      ${(dkwh * effectiveRate).toFixed(2)}
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => removeAppliance(a.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Solar */}
      <section className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">☀️ Solar Offset</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              System Size (kW)
            </label>
            <input
              type="number"
              step="0.5"
              value={solarKw}
              onChange={(e) => setSolarKw(parseFloat(e.target.value) || 0)}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Avg Sun Hours/Day
            </label>
            <input
              type="number"
              step="0.5"
              value={solarHours}
              onChange={(e) => setSolarHours(parseFloat(e.target.value) || 0)}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Feed-in Tariff ($/kWh)
            </label>
            <input
              type="number"
              step="0.01"
              value={feedInTariff}
              onChange={(e) =>
                setFeedInTariff(parseFloat(e.target.value) || 0)
              }
              className="border rounded px-3 py-2 w-full"
            />
          </div>
        </div>
        {solarKw > 0 && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg text-sm text-green-800">
            Daily solar generation: {dailySolarKwh.toFixed(1)} kWh |
            Self-consumed: {selfConsumed.toFixed(1)} kWh | Exported:{" "}
            {exported.toFixed(1)} kWh | Daily savings: $
            {dailySolarSavings.toFixed(2)}
          </div>
        )}
      </section>

      {/* Info */}
      <section className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">📖 How It Works</h2>
        <div className="text-sm text-gray-600 space-y-2">
          <p>
            This calculator estimates your electricity costs based on the wattage
            and usage hours of your appliances. Default rates are based on
            typical Australian energy plans in 2026.
          </p>
          <p>
            <strong>Flat Rate:</strong> ~30c/kWh at all times.{" "}
            <strong>Time of Use:</strong> Peak (2-8pm weekdays) ~45c, Off-peak
            (10pm-7am) ~18c, Shoulder ~28c.
          </p>
          <p>
            <strong>Solar:</strong> Assumes 70% self-consumption ratio. Exported
            energy earns the feed-in tariff. Actual savings depend on your usage
            pattern and location.
          </p>
          <p>
            <strong>Tip:</strong> Check your latest bill for your exact rates and
            daily supply charge, then use &quot;Custom Rate&quot; for the most accurate
            estimate.
          </p>
        </div>
      </section>

      <footer className="text-center text-xs text-gray-400 py-4">
        © {new Date().getFullYear()} AU Electricity Cost Calculator. For
        estimation purposes only. Rates may vary by retailer and state.
      </footer>
    </main>
  );
}
