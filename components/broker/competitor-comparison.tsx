"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Columns, Check, X, ExternalLink, Award, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

interface ComparisonBroker {
  name: string;
  slug: string;
  logo: string;
  rating: number;
  minDeposit: number;
  avgSpreadEurUsd: number;
  commissionRt: number;
  leverage: string;
  platforms: string[];
  regulations: string[];
  founded: string;
  affiliateUrl: string;
  bestFor: string;
}

interface CompetitorComparisonProps {
  mainBroker: ComparisonBroker;
  competitors: ComparisonBroker[];
}

function totalCost(spread: number, commission: number): number {
  return spread * 10 + commission;
}

export function CompetitorComparison({ mainBroker, competitors }: CompetitorComparisonProps) {
  const all = [mainBroker, ...competitors];
  const bestSpread = Math.min(...all.map((b) => b.avgSpreadEurUsd));
  const bestRating = Math.max(...all.map((b) => b.rating));
  const lowestDeposit = Math.min(...all.map((b) => b.minDeposit));
  const mostReg = Math.max(...all.map((b) => b.regulations.length));
  const cheapestCost = Math.min(...all.map((b) => totalCost(b.avgSpreadEurUsd, b.commissionRt)));

  const [showMore, setShowMore] = useState(false);

  // Count wins per broker
  const wins: Record<string, number> = {};
  all.forEach(b => { wins[b.slug] = 0; });
  all.filter(b => b.rating === bestRating).forEach(b => wins[b.slug]++);
  all.filter(b => b.avgSpreadEurUsd === bestSpread).forEach(b => wins[b.slug]++);
  all.filter(b => b.minDeposit === lowestDeposit).forEach(b => wins[b.slug]++);
  all.filter(b => b.regulations.length === mostReg).forEach(b => wins[b.slug]++);
  all.filter(b => totalCost(b.avgSpreadEurUsd, b.commissionRt) === cheapestCost).forEach(b => wins[b.slug]++);

  const comparisonRows = [
    { label: 'Rating', render: (b: ComparisonBroker) => <span className={b.rating === bestRating ? 'text-emerald-400 font-semibold' : 'text-gray-300'}>{b.rating}/10</span>, basic: true },
    { label: 'EUR/USD Spread', render: (b: ComparisonBroker) => <span className={b.avgSpreadEurUsd === bestSpread ? 'text-emerald-400 font-semibold' : 'text-gray-300'}>{b.avgSpreadEurUsd} pips</span>, basic: true },
    { label: 'Commission', render: (b: ComparisonBroker) => <span className="text-gray-300">{b.commissionRt > 0 ? `$${b.commissionRt}/lot` : 'None'}</span>, basic: true },
    { label: 'Cost/Lot*', render: (b: ComparisonBroker) => {
      const cost = totalCost(b.avgSpreadEurUsd, b.commissionRt);
      return <span className={cost === cheapestCost ? 'text-emerald-400 font-semibold' : 'text-gray-300'}>${cost.toFixed(2)}</span>;
    }, basic: true },
    { label: 'Min Deposit', render: (b: ComparisonBroker) => <span className={b.minDeposit === lowestDeposit ? 'text-emerald-400 font-semibold' : 'text-gray-300'}>{b.minDeposit > 0 ? `$${b.minDeposit}` : '$0'}</span>, basic: true },
    { label: 'Leverage', render: (b: ComparisonBroker) => <span className="text-gray-300">{b.leverage}</span>, basic: false },
    { label: 'Platforms', render: (b: ComparisonBroker) => <span className="text-gray-300">{b.platforms.slice(0, 2).join(', ')}</span>, basic: false },
    { label: 'Regulation', render: (b: ComparisonBroker) => (
      <div className="flex flex-wrap justify-center gap-0.5">
        {b.regulations.slice(0, 2).map(r => (
          <span key={r} className={`text-[10px] px-1 py-0.5 rounded ${b.regulations.length === mostReg ? 'bg-emerald-900/40 text-emerald-400' : 'bg-gray-800 text-gray-400'}`}>{r}</span>
        ))}
        {b.regulations.length > 2 && <span className="text-[10px] text-gray-500">+{b.regulations.length - 2}</span>}
      </div>
    ), basic: false },
    { label: 'Best For', render: (b: ComparisonBroker) => <span className="text-gray-400 italic text-[10px]">{b.bestFor?.replace('Best for ', '') || '—'}</span>, basic: false },
    { label: 'Founded', render: (b: ComparisonBroker) => <span className="text-gray-400">{b.founded}</span>, basic: false },
  ];

  const visibleRows = showMore ? comparisonRows : comparisonRows.filter(r => r.basic);

  // Determine overall winner
  const maxWins = Math.max(...Object.values(wins));
  const overallWinner = all.find(b => wins[b.slug] === maxWins);

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-gray-900/80">
        <Columns className="h-4 w-4 text-orange-400" />
        <h3 className="text-base font-semibold text-white">Side-by-Side Comparison</h3>
        <span className="ml-auto text-[10px] text-gray-500">🟢 = best in category</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-base">
          <thead>
            <tr className="border-b border-gray-700/50 bg-gray-800/40">
              <th className="text-left py-2 px-3 text-gray-500 font-medium sticky left-0 bg-gray-900/95 z-10 w-28"></th>
              {all.map((b) => (
                <th key={b.slug} className="text-center py-2 px-3 min-w-[90px]">
                  <div className="flex flex-col items-center gap-1">
                    <span className={`font-semibold text-base ${b.slug === mainBroker.slug ? 'text-emerald-400' : 'text-white'}`}>
                      {b.name}
                    </span>
                    {b.slug === mainBroker.slug && <span className="text-[9px] text-emerald-500 bg-emerald-900/30 px-1.5 py-0.5 rounded-full">This Broker</span>}
                    {overallWinner && b.slug === overallWinner.slug && b.slug !== mainBroker.slug && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] text-amber-400 bg-amber-900/30 px-1.5 py-0.5 rounded-full">
                        <Award className="h-2.5 w-2.5" /> Winner
                      </span>
                    )}
                    {wins[b.slug] > 0 && (
                      <span className="text-[9px] text-gray-500">{wins[b.slug]} win{wins[b.slug] > 1 ? 's' : ''}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, i) => (
              <tr key={row.label} className={`border-b border-gray-800/20 ${i % 2 === 0 ? 'bg-transparent' : 'bg-gray-800/10'}`}>
                <td className="py-2 px-3 text-gray-400 font-medium sticky left-0 z-10" style={{ background: i % 2 === 0 ? 'rgb(17 24 39 / 0.95)' : 'rgb(17 24 39 / 0.95)' }}>
                  {row.label}
                </td>
                {all.map((b) => (
                  <td key={b.slug} className="py-2 px-3 text-center">{row.render(b)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Show More / Less Toggle */}
      <button
        onClick={() => setShowMore(!showMore)}
        className="w-full flex items-center justify-center gap-1 py-2 text-base text-gray-400 hover:text-gray-300 transition-colors border-t border-gray-800"
      >
        {showMore ? (
          <><ChevronUp className="h-3.5 w-3.5" /> Show Less</>
        ) : (
          <><ChevronDown className="h-3.5 w-3.5" /> Show {comparisonRows.length - comparisonRows.filter(r => r.basic).length} More Details</>
        )}
      </button>

      {/* Quick Verdict */}
      {overallWinner && (
        <div className="px-4 py-3 bg-emerald-950/20 border-t border-emerald-800/30">
          <div className="flex items-start gap-2">
            <Award className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-base font-semibold text-emerald-400">Quick Verdict: </span>
              <span className="text-base text-gray-300">
                <strong className="text-white">{overallWinner.name}</strong> wins in {maxWins} of 5 categories.
                {overallWinner.slug === mainBroker.slug
                  ? ` ${mainBroker.name} is a strong choice.`
                  : ` Consider ${overallWinner.name} for the best overall value.`
                }
              </span>
            </div>
          </div>
          <p className="text-[10px] text-gray-500 mt-1.5 ml-6">* Cost/Lot = (EUR/USD spread × $10) + commission per standard lot</p>
        </div>
      )}

      {/* CTA Row */}
      <div className="px-4 py-3 border-t border-gray-800 bg-gray-900/60">
        <div className="flex flex-wrap gap-2 justify-center">
          {all.map((b) => (
            <a key={b.slug} href={b.affiliateUrl} target="_blank" rel="noopener noreferrer"
               className={`inline-flex items-center gap-1 text-base px-3 py-1.5 rounded-lg font-medium transition-colors ${
                 b.slug === mainBroker.slug
                   ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                   : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
               }`}>
              Visit {b.name} <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
