import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t bg-base-200 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-3">Energy Tools</h3>
            <ul className="space-y-1 text-sm">
              <li><Link href="/tools/calculator" className="hover:underline">Bill Calculator</Link></li>
              <li><Link href="/tools/solar" className="hover:underline">Solar Savings Calculator</Link></li>
              <li><Link href="/retailers" className="hover:underline">Retailer Directory</Link></li>
              <li><Link href="/tips" className="hover:underline">Energy Saving Tips</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3">Browse by State</h3>
            <ul className="space-y-1 text-sm">
              <li><Link href="/states/nsw" className="hover:underline">New South Wales</Link></li>
              <li><Link href="/states/qld" className="hover:underline">Queensland</Link></li>
              <li><Link href="/states/sa" className="hover:underline">South Australia</Link></li>
              <li><Link href="/states/vic" className="hover:underline">Victoria</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3">Rollersoft Tools</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="https://rollersoft.com.au" className="hover:underline">Rollersoft Home</a></li>
              <li><a href="https://property.rollersoft.com.au" className="hover:underline">Property Hub</a></li>
              <li><a href="https://jobs.rollersoft.com.au" className="hover:underline">Job & Salary DB</a></li>
              <li><a href="https://cars.rollersoft.com.au" className="hover:underline">Car Hub</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 border-t pt-4">
          <p>Data sourced from AER Default Market Offer and Victorian Default Offer 2024-25.</p>
          <p className="mt-1">© {new Date().getFullYear()} <a href="https://rollersoft.com.au" className="hover:underline">Rollersoft</a>. Reference prices are annual maximum caps.</p>
        </div>
      </div>
    </footer>
  );
}
