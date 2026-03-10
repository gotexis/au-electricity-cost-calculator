import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AU Electricity Cost Calculator | Calculate Your Power Bill",
  description:
    "Free Australian electricity cost calculator. Estimate your power bill by appliance, compare time-of-use tariffs, and calculate solar savings. Updated for 2026 rates.",
  keywords: [
    "electricity cost calculator",
    "australian power bill",
    "electricity calculator australia",
    "energy cost estimator",
    "appliance running cost",
    "time of use tariff calculator",
    "solar savings calculator australia",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
