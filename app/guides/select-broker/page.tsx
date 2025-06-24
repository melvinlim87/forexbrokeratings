import React from 'react';
import { BookOpen, CheckCircle, Info, ListOrdered, Table } from 'lucide-react';

// Dummy broker data for demonstration
const dummyBrokers = [
  {
    name: 'AlphaTrade',
    regulated: 'Yes',
    spread: '0.8 pips',
    leverage: '1:500',
    platforms: 'MetaTrader 4, WebTrader',
    minDeposit: '$100',
  },
  {
    name: 'BetaMarkets',
    regulated: 'Yes',
    spread: '1.2 pips',
    leverage: '1:200',
    platforms: 'MetaTrader 5, Mobile',
    minDeposit: '$50',
  },
  {
    name: 'GammaFX',
    regulated: 'No',
    spread: '1.5 pips',
    leverage: '1:1000',
    platforms: 'cTrader',
    minDeposit: '$10',
  },
];

export default function SelectBrokerGuide() {
  return (
    <main className="bg-[#fff9f3] min-h-screen pb-24">
      <header className="bg-gradient-to-r from-[#091f40] to-[#0f2d59] h-[160px] flex flex-col justify-center items-center text-center px-4 mb-12">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 drop-shadow">How to Use the Compare Brokers Feature</h1>
        <h2 className="text-md md:text-xl text-cyan-200 font-medium max-w-2xl mx-auto">Quickly find the right broker for you by comparing key features side by side.</h2>
      </header>
      <section className="max-w-3xl mx-auto px-4 mb-12">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-8 h-8 text-cyan-600" />
          <h2 className="text-xl font-bold text-navy-900">Getting Started</h2>
        </div>
        <ol className="list-decimal list-inside space-y-4 text-gray-800">
          <li>
            <strong>Access the Compare Page:</strong>
            <div className="ml-3">
              Go to the <a href="/compare" className="text-cyan-700 font-semibold underline hover:text-cyan-900">Compare Brokers</a> page from the main navigation.
            </div>
          </li>
          <li>
            <strong>Select Brokers to Compare:</strong>
            <div className="ml-3">
              Use the search bar to find brokers by name, or browse the list. Click <span className="inline-flex items-center px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 text-xs font-semibold">Add to Compare</span> on up to 3 brokers to add them to your comparison list.
            </div>
          </li>
          <li>
            <strong>View the Comparison Table:</strong>
            <div className="ml-3">
              Scroll down to see a side-by-side table of your selected brokers. You can compare important details like regulation, spreads, leverage, platforms, and more.
            </div>
          </li>
          <li>
            <strong>Interpret the Results:</strong>
            <div className="ml-3">
              Review the table to see how each broker stacks up. Use the information to choose the broker that best fits your trading needs.
            </div>
          </li>
        </ol>
      </section>
      <section className="max-w-3xl mx-auto px-4 mb-12">
        <div className="flex items-center gap-3 mb-4">
          <ListOrdered className="w-7 h-7 text-cyan-600" />
          <h2 className="text-lg font-bold text-navy-900">Comparison Fields Explained</h2>
        </div>
        <table className="w-full text-sm bg-white rounded-xl shadow overflow-hidden mb-6">
          <thead className="bg-blue-50">
            <tr>
              <th className="py-2 px-3 text-left font-bold text-gray-900">Field</th>
              <th className="py-2 px-3 text-left font-bold text-gray-900">What It Means</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-3 font-semibold text-navy-900">Regulation</td>
              <td className="py-2 px-3">Whether the broker is licensed and overseen by a financial authority.</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-semibold text-navy-900">Spreads</td>
              <td className="py-2 px-3">The difference between buy and sell prices. Lower spreads mean lower trading costs.</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-semibold text-navy-900">Leverage</td>
              <td className="py-2 px-3">The ratio of borrowed funds to your own. Higher leverage increases both potential gains and risks.</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-semibold text-navy-900">Platforms</td>
              <td className="py-2 px-3">The trading software offered (e.g., MetaTrader, cTrader, WebTrader).</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-semibold text-navy-900">Minimum Deposit</td>
              <td className="py-2 px-3">The smallest amount required to open an account.</td>
            </tr>
          </tbody>
        </table>
        <div className="text-xs text-gray-500">
          <Info className="inline-block w-4 h-4 mr-1 align-text-bottom text-cyan-600" />
          <span>Tip: Hover over info icons in the compare table for more details on each field.</span>
        </div>
      </section>
      <section className="max-w-3xl mx-auto px-4 mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Table className="w-7 h-7 text-cyan-600" />
          <h2 className="text-lg font-bold text-navy-900">Example Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-white rounded-xl shadow overflow-hidden">
            <thead className="bg-blue-50">
              <tr>
                <th className="py-2 px-3 text-left font-bold text-gray-900">Broker</th>
                <th className="py-2 px-3 text-left font-bold text-gray-900">Regulated</th>
                <th className="py-2 px-3 text-left font-bold text-gray-900">Spread</th>
                <th className="py-2 px-3 text-left font-bold text-gray-900">Leverage</th>
                <th className="py-2 px-3 text-left font-bold text-gray-900">Platforms</th>
                <th className="py-2 px-3 text-left font-bold text-gray-900">Min. Deposit</th>
              </tr>
            </thead>
            <tbody>
              {dummyBrokers.map((broker) => (
                <tr key={broker.name}>
                  <td className="py-2 px-3 font-semibold text-navy-900">{broker.name}</td>
                  <td className="py-2 px-3">{broker.regulated}</td>
                  <td className="py-2 px-3">{broker.spread}</td>
                  <td className="py-2 px-3">{broker.leverage}</td>
                  <td className="py-2 px-3">{broker.platforms}</td>
                  <td className="py-2 px-3">{broker.minDeposit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="max-w-3xl mx-auto px-4 mb-12">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-7 h-7 text-cyan-600" />
          <h2 className="text-lg font-bold text-navy-900">Tips & Limitations</h2>
        </div>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>You can compare up to 3 brokers at a time.</li>
          <li>Some fields (like spreads or leverage) may vary based on account type or region. Always check the broker's official site for the latest info.</li>
          <li>Use the "Visit Broker" button to learn more or open an account directly with the broker.</li>
          <li>Regulation status is an important safety factor—prioritize regulated brokers when possible.</li>
        </ul>
      </section>
    </main>
  );
}
