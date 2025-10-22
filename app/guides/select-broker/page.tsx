"use client";
import React from 'react';
import { BookOpen, CheckCircle, Info, ListOrdered, Table } from 'lucide-react';
import T from '@/components/common/T';
import { useI18n } from '@/lib/i18n-client';

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
  useI18n();
  return (
    <main className="flex flex-col min-h-screen bg-[#f8f9fc] pb-24">

      <header className="bg-gradient-to-b from-[#091f40] to-[#0f2d59] h-[160px] flex flex-col justify-center items-center text-center px-4 mb-12 w-full">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 drop-shadow"><T k="guide.select.header_title" /></h1>
        <h2 className="text-md md:text-xl text-cyan-200 font-medium max-w-2xl mx-auto"><T k="guide.select.header_subtitle" /></h2>
      </header>
      <section className="w-full max-w-5xl mx-auto px-4 mb-12">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-8 h-8 text-cyan-600" />
          <h2 className="text-xl font-bold text-navy-900"><T k="guide.select.getting_started" /></h2>
        </div>
        <ol className="list-decimal list-inside space-y-4 text-gray-800">
          <li>
            <strong><T k="guide.select.access_compare" /></strong>
            <div className="ml-3">
              <T k="guide.select.access_compare_hint" />
            </div>
          </li>
          <li>
            <strong><T k="guide.select.select_brokers" /></strong>
            <div className="ml-3">
              <T k="guide.select.select_brokers_hint" />
            </div>
          </li>
          <li>
            <strong><T k="guide.select.view_table" /></strong>
            <div className="ml-3">
              <T k="guide.select.view_table_hint" />
            </div>
          </li>
          <li>
            <strong><T k="guide.select.interpret_results" /></strong>
            <div className="ml-3">
              <T k="guide.select.interpret_results_hint" />
            </div>
          </li>
        </ol>
      </section>
      <section className="w-full max-w-5xl mx-auto px-4 mb-12">
        <div className="flex items-center gap-3 mb-4">
          <ListOrdered className="w-7 h-7 text-cyan-600" />
          <h2 className="text-lg font-bold text-navy-900"><T k="guide.select.fields_title" /></h2>
        </div>
        <div className="overflow-x-auto rounded-2xl shadow-lg from-gray-950/90 via-gray-900/90 to-gray-950/95 hidden md:block">
          <table className="min-w-full text-sm text-left rounded-2xl overflow-hidden ">
            <thead className="bg-white">
              <tr>
                <th className="py-2 px-3 text-left text-gray-900"><T k="guide.select.table.field" /></th>
                <th className="py-2 px-3 text-left text-gray-900"><T k="guide.select.table.meaning" /></th>
              </tr>
            </thead>
            <tbody className="bg-gray-50">
              <tr  className="border-b border-gray-200 hover:bg-blue-100 transition " >
                <td className="py-2 px-3 font-semibold text-navy-900"><T k="guide.select.field.regulation" /></td>
                <td className="py-2 px-3"><T k="guide.select.field.regulation_desc" /></td>
              </tr>
              <tr  className="border-b border-gray-200 hover:bg-blue-100 transition " >
                <td className="py-2 px-3 font-semibold text-navy-900"><T k="guide.select.field.spreads" /></td>
                <td className="py-2 px-3"><T k="guide.select.field.spreads_desc" /></td>
              </tr>
              <tr  className="border-b border-gray-200 hover:bg-blue-100 transition " >
                <td className="py-2 px-3 font-semibold text-navy-900"><T k="guide.select.field.leverage" /></td>
                <td className="py-2 px-3"><T k="guide.select.field.leverage_desc" /></td>
              </tr>
              <tr  className="border-b border-gray-200 hover:bg-blue-100 transition " >
                <td className="py-2 px-3 font-semibold text-navy-900"><T k="guide.select.field.platforms" /></td>
                <td className="py-2 px-3"><T k="guide.select.field.platforms_desc" /></td>
              </tr>
              <tr  className="border-b border-gray-200 hover:bg-blue-100 transition " >
                <td className="py-2 px-3 font-semibold text-navy-900"><T k="guide.select.field.min_deposit" /></td>
                <td className="py-2 px-3"><T k="guide.select.field.min_deposit_desc" /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          <Info className="inline-block w-4 h-4 mr-1 align-text-bottom text-cyan-600" />
          <span><T k="guide.select.tip1" /></span>
        </div>
      </section>
      <section className="w-full max-w-5xl mx-auto px-4 mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Table className="w-7 h-7 text-cyan-600" />
          <h2 className="text-lg font-bold text-navy-900"><T k="guide.select.example_title" /></h2>
        </div>
        <div className="overflow-x-auto rounded-2xl">
          {/* Desktop Table */}
          <div className="overflow-x-auto rounded-2xl shadow-lg from-gray-950/90 via-gray-900/90 to-gray-950/95 hidden md:block">
            <table className="min-w-full text-sm text-left rounded-2xl overflow-hidden bg-gray-950">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"><T k="guide.select.table.broker" /></th>
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
              <tbody className="bg-gray-50 divide-y divide-gray-200">
                <tr className="border-b border-gray-200 hover:bg-blue-100 transition" >
                  <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-gray-900"><T k="guide.select.field.min_deposit" /></td>
                  {dummyBrokers.map((broker) => (
                    <td key={broker.name} className="text-center px-6 py-4 whitespace-nowrap text-md text-gray-500">
                      {broker.min_deposit || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200 hover:bg-blue-100 transition" >
                  <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-gray-900"><T k="guide.select.mobile.min_withdrawal" /></td>
                  {dummyBrokers.map((broker) => (
                    <td key={broker.name} className="text-center px-6 py-4 whitespace-nowrap text-md text-gray-500">
                      {broker.min_withdrawl || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200 hover:bg-blue-100 transition" >
                  <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-gray-900"><T k="guide.select.mobile.spread" /></td>
                  {dummyBrokers.map((broker) => (
                    <td key={broker.name} className="text-center px-6 py-4 whitespace-nowrap text-md text-gray-500">
                      {broker.spread_eur_usd || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200 hover:bg-blue-100 transition" >
                  <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-gray-900"><T k="guide.select.mobile.max_leverage" /></td>
                  {dummyBrokers.map((broker) => (
                    <td key={broker.name} className="text-center px-6 py-4 whitespace-nowrap text-md text-gray-500">
                      {broker.leverage_max ? `${broker.leverage_max}` : 'N/A'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          {/* Mobile Cards (matches featured-brokers.tsx) */}
          <div className="flex flex-col gap-4 md:hidden">
            {dummyBrokers.map((broker, idx) => (
              <div key={broker.name} className="bg-gray-50 rounded-xl shadow p-4 flex flex-col gap-2 cursor-pointer hover:bg-blue-100 transition">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-black font-bold text-xs shadow bg-white">#{idx + 1}</span>
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">{broker.name?.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-black leading-tight">{broker.name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700"><T k="guide.select.field.min_deposit" /></span>
                  <span className="text-green-600 font-medium">{broker.min_deposit || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700"><T k="guide.select.mobile.min_withdrawal" /></span>
                  <span className="text-gray-500">{broker.min_withdrawl || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700"><T k="guide.select.mobile.spread" /></span>
                  <span className="text-cyan-600 font-medium">{broker.spread_eur_usd || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700"><T k="guide.select.mobile.max_leverage" /></span>
                  <span className="text-blue-600 font-medium">{broker.leverage_max ? `${broker.leverage_max}` : 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="w-full max-w-5xl mx-auto px-4 mb-12">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-7 h-7 text-cyan-600" />
          <h2 className="text-lg font-bold text-navy-900"><T k="guide.select.tips_title" /></h2>
        </div>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li><T k="guide.select.tip1" /></li>
          <li><T k="guide.select.tip2" /></li>
          <li><T k="guide.select.tip3" /></li>
          <li><T k="guide.select.tip4" /></li>
        </ul>
      </section>
    </main>
  );
}
