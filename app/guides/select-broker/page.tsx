import React from 'react';
import { BookOpen, CheckCircle, Info, ListOrdered, Table } from 'lucide-react';

// Dummy broker data for demonstration
const dummyBrokers = [
  {
    name: 'AlphaTrade',
    regulated: 'Yes',
    spread_eur_usd: '0.8 pips',
    leverage_max: '1:500',
    platforms: 'MetaTrader 4, WebTrader',
    min_deposit: '$100',
    min_withdrawl: '$100',
  },
  {
    name: 'BetaMarkets',
    regulated: 'Yes',
    spread_eur_usd: '1.2 pips',
    leverage_max: '1:200',
    platforms: 'MetaTrader 5, Mobile',
    min_deposit: '$50',
    min_withdrawl: '$50',
  },
  {
    name: 'GammaFX',
    regulated: 'No',
    spread_eur_usd: '1.5 pips',
    leverage_max: '1:1000',
    platforms: 'cTrader',
    min_deposit: '$10',
    min_withdrawl: '$10',
  },
];

export default function SelectBrokerGuide() {
  return (
    <main className="flex flex-col min-h-screen bg-[#f8f9fc] pb-24">

      <header className="bg-gradient-to-b from-[#091f40] to-[#0f2d59] h-[160px] flex flex-col justify-center items-center text-center px-4 mb-12 w-full">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 drop-shadow">How to Use the Compare Brokers Feature</h1>
        <h2 className="text-md md:text-xl text-cyan-200 font-medium max-w-2xl mx-auto">Quickly find the right broker for you by comparing key features side by side.</h2>
      </header>
      <section className="w-full max-w-5xl mx-auto px-4 mb-12">
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
      <section className="w-full max-w-5xl mx-auto px-4 mb-12">
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
      <section className="w-full max-w-5xl mx-auto px-4 mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Table className="w-7 h-7 text-cyan-600" />
          <h2 className="text-lg font-bold text-navy-900">Example Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          {/* Desktop Table */}
          <table className="w-full text-sm bg-white rounded-xl shadow overflow-hidden hidden md:table">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">Broker</th>
                {dummyBrokers.map((broker) => (
                  <th key={broker.name} className="px-6 py-3">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-md font-medium text-black uppercase tracking-wider">
                        {broker.name}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-gray-900">Minimum Deposit</td>
                {dummyBrokers.map((broker) => (
                  <td key={broker.name} className="text-center px-6 py-4 whitespace-nowrap text-md text-gray-500">
                    {broker.min_deposit || 'N/A'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-gray-900">Minimum Withdrawal</td>
                {dummyBrokers.map((broker) => (
                  <td key={broker.name} className="text-center px-6 py-4 whitespace-nowrap text-md text-gray-500">
                    {broker.min_withdrawl || 'N/A'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-gray-900">EUR/USD Spread</td>
                {dummyBrokers.map((broker) => (
                  <td key={broker.name} className="text-center px-6 py-4 whitespace-nowrap text-md text-gray-500">
                    {broker.spread_eur_usd || 'N/A'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-gray-900">Max Leverage</td>
                {dummyBrokers.map((broker) => (
                  <td key={broker.name} className="text-center px-6 py-4 whitespace-nowrap text-md text-gray-500">
                    {broker.leverage_max ? `${broker.leverage_max}` : 'N/A'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>

          {/* Mobile Vertical Table */}
          <div className="flex flex-col gap-6 md:hidden">
            {dummyBrokers.map((broker) => (
              <div key={broker.name} className="border rounded-xl shadow bg-white overflow-hidden">
                <div className="bg-blue-50 px-4 py-2 flex items-center justify-center">
                  <span className="text-md font-medium text-black uppercase tracking-wider">{broker.name}</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">Minimum Deposit:</span>
                    <span className="text-gray-500">{broker.min_deposit || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">Minimum Withdrawal:</span>
                    <span className="text-gray-500">{broker.min_withdrawl || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">EUR/USD Spread:</span>
                    <span className="text-gray-500">{broker.spread_eur_usd || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">Max Leverage:</span>
                    <span className="text-gray-500">{broker.leverage_max ? `${broker.leverage_max}` : 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="w-full max-w-5xl mx-auto px-4 mb-12">
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
