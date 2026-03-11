import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Australian Energy Plan Comparison | Compare Electricity Prices",
  description:
    "Compare electricity prices across 9 distribution zones in 4 Australian states. Based on 2024-25 AER Default Market Offer and Victorian Default Offer reference prices.",
  keywords: [
    "energy comparison australia",
    "electricity prices australia",
    "default market offer",
    "victorian default offer",
    "energy plan comparison",
    "cheapest electricity australia",
    "energy retailers australia",
    "power bill comparison",
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
