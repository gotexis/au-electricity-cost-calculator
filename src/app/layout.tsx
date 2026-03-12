import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";
import { WebsiteJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: {
    default: "Australian Energy Plan Comparison | Compare Electricity Prices",
    template: "%s | AU Energy Comparison",
  },
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
    "solar savings calculator",
  ],
  metadataBase: new URL("https://energy.rollersoft.com.au"),
  openGraph: {
    title: "Australian Energy Plan Comparison",
    description: "Compare electricity prices across Australian distribution zones",
    url: "https://energy.rollersoft.com.au",
    siteName: "AU Energy Comparison",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <WebsiteJsonLd />
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased flex flex-col">
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
