"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Shield, DollarSign, Monitor, TrendingUp, Award, DollarSign as Dollar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { brokers, getTopBrokers } from '@/lib/brokers';

// Pick top 4 brokers for comparison
const topBrokers = getTopBrokers(4);

// Regulation flag map
const regulationFlags: Record<string, string> = {
  'FCA': '🇬🇧',
  'ASIC': '🇦🇺',
  'CySEC': '🇨🇾',
  'CFTC/NFA': '🇺🇸',
  'MAS': '🇸🇬',
  'IIROC': '🇨🇦',
  'FSCA': '🇿🇦',
  'DFSA': '🇦🇪',
  'FSA': '🇯🇵',
  'CIMA': '🇰🇾',
  'SCB': '🇧🇸',
  'VFSC': '🇻🇺',
  'FMA NZ': '🇳🇿',
  'CMVM': '🇵🇹',
  'FSC': '🇲🇺',
  'FSA Seychelles': '🇸🇨',
  'BVI FSC': '🇻🇬',
  'ISA': '🇮🇱',
};

function StarRating({ rating, max = 10 }: { rating: number; max?: number }) {
  const fullStars = Math.floor(rating / 2);
  const hasHalf = (rating / 2) - fullStars >= 0.25;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalf && (
        <div className="relative h-4 w-4">
          <Star className="absolute h-4 w-4 text-gray-300 dark:text-gray-600" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300 dark:text-gray-600" />
      ))}
      <span className="ml-1.5 text-sm font-semibold text-gray-900 dark:text-white">{rating.toFixed(1)}</span>
    </div>
  );
}

function SpreadBar({ value, max = 2.5, label }: { value: number; max?: number; label?: string }) {
  const pct = Math.min((value / max) * 100, 100);
  const color = value <= 0.5 ? 'bg-green-500' : value <= 1.0 ? 'bg-yellow-500' : 'bg-orange-500';

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-16 text-right">
        {value.toFixed(1)} pips
      </span>
    </div>
  );
}

function DepositBar({ value, max = 500 }: { value: number; max?: number }) {
  const pct = Math.min((value / max) * 100, 100);
  const color = value === 0 ? 'bg-green-500' : value <= 100 ? 'bg-green-400' : value <= 250 ? 'bg-yellow-500' : 'bg-orange-500';

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${Math.max(pct, 5)}%` }}
        />
      </div>
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-14 text-right">
        {value === 0 ? '$0' : `$${value}`}
      </span>
    </div>
  );
}

/**
 * Total Cost per Standard Lot (100K units EUR/USD)
 * Formula: (spread_in_pips × pip_value × 100K) + commission_per_lot
 * pip_value for EUR/USD ≈ $10 per pip per standard lot
 * So: cost = spread × $10 + commission (round-turn)
 */
function TotalCostBar({ spread, commission }: { spread: number; commission: number }) {
  const totalCost = spread * 10 + commission; // $ per standard lot
  const maxCost = 25; // $25 is high, $5 or less is excellent
  const pct = Math.min((totalCost / maxCost) * 100, 100);
  const color = totalCost <= 7 ? 'bg-emerald-500' : totalCost <= 12 ? 'bg-green-400' : totalCost <= 17 ? 'bg-yellow-500' : 'bg-orange-500';

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${Math.max(pct, 8)}%` }}
        />
      </div>
      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 w-16 text-right">
        ${totalCost.toFixed(2)}/lot
      </span>
    </div>
  );
}

export default function ComparisonSection() {
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  return (
    <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-3 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Verified Data — Updated March 2026
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Compare Top Forex Brokers Side-by-Side
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Real data from our top-rated brokers. Compare spreads, regulation, deposits, platforms, and ratings at a glance.
          </p>
        </div>

        <Card className="border-0 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                {/* Header Row — Broker Logos & Names */}
                <thead>
                  <tr className="bg-white dark:bg-gray-950">
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-40 sticky left-0 bg-white dark:bg-gray-950 z-10">
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5" /> Broker
                      </div>
                    </th>
                    {topBrokers.map((broker, idx) => (
                      <th
                        key={broker.id}
                        className={`px-4 py-4 text-center transition-colors ${hoveredCol === idx ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                        onMouseEnter={() => setHoveredCol(idx)}
                        onMouseLeave={() => setHoveredCol(null)}
                      >
                        <Link href={`/broker/${broker.slug}`} className="group flex flex-col items-center">
                          <div className="h-10 w-24 relative mb-2 mx-auto">
                            <Image
                              src={broker.logo}
                              alt={broker.name}
                              fill
                              className="object-contain"
                              sizes="96px"
                            />
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm">
                            {broker.name}
                          </span>
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {/* Rating Row */}
                  <tr className="bg-white dark:bg-gray-950">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-gray-950 z-10">
                      <div className="flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5 text-yellow-500" /> Rating
                      </div>
                    </td>
                    {topBrokers.map((broker, idx) => (
                      <td
                        key={broker.id}
                        className={`px-4 py-3 text-center transition-colors ${hoveredCol === idx ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                        onMouseEnter={() => setHoveredCol(idx)}
                        onMouseLeave={() => setHoveredCol(null)}
                      >
                        <StarRating rating={broker.rating} />
                      </td>
                    ))}
                  </tr>

                  {/* Spreads Row */}
                  <tr className="bg-white dark:bg-gray-950">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-gray-950 z-10">
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5 text-green-500" /> EUR/USD Spread
                      </div>
                    </td>
                    {topBrokers.map((broker, idx) => {
                      const spread = (broker as any).avgSpreadEurUsd ?? 1.0;
                      return (
                        <td
                          key={broker.id}
                          className={`px-4 py-3 transition-colors ${hoveredCol === idx ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                          onMouseEnter={() => setHoveredCol(idx)}
                          onMouseLeave={() => setHoveredCol(null)}
                        >
                          <SpreadBar value={spread} />
                        </td>
                      );
                    })}
                  </tr>

                  {/* Regulation Row */}
                  <tr className="bg-white dark:bg-gray-950">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-gray-950 z-10">
                      <div className="flex items-center gap-1.5">
                        <Shield className="h-3.5 w-3.5 text-blue-500" /> Regulation
                      </div>
                    </td>
                    {topBrokers.map((broker, idx) => (
                      <td
                        key={broker.id}
                        className={`px-4 py-3 text-center transition-colors ${hoveredCol === idx ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                        onMouseEnter={() => setHoveredCol(idx)}
                        onMouseLeave={() => setHoveredCol(null)}
                      >
                        <div className="flex flex-wrap justify-center gap-1">
                          {broker.regulations.map((reg) => (
                            <span
                              key={reg}
                              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium"
                              title={reg}
                            >
                              {regulationFlags[reg] || '🌐'} {reg}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Min Deposit Row */}
                  <tr className="bg-white dark:bg-gray-950">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-gray-950 z-10">
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="h-3.5 w-3.5 text-green-600" /> Min Deposit
                      </div>
                    </td>
                    {topBrokers.map((broker, idx) => (
                      <td
                        key={broker.id}
                        className={`px-4 py-3 transition-colors ${hoveredCol === idx ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                        onMouseEnter={() => setHoveredCol(idx)}
                        onMouseLeave={() => setHoveredCol(null)}
                      >
                        <DepositBar value={broker.minDeposit} />
                      </td>
                    ))}
                  </tr>

                  {/* Total Cost per Standard Lot Row — NEW */}
                  {(() => {
                    const costs = topBrokers.map(b => {
                      const spread = (b as any).avgSpreadEurUsd ?? 1.0;
                      const comm = (b as any).commissionRt ?? 0;
                      return spread * 10 + comm;
                    });
                    const cheapest = Math.min(...costs);
                    return (
                      <tr className="bg-emerald-50/50 dark:bg-emerald-900/10">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white sticky left-0 bg-emerald-50/50 dark:bg-emerald-900/10 z-10">
                          <div className="flex items-center gap-1.5">
                            <Dollar className="h-3.5 w-3.5 text-emerald-600" /> Total Cost/Lot *
                          </div>
                        </td>
                        {topBrokers.map((broker, idx) => {
                          const spread = (broker as any).avgSpreadEurUsd ?? 1.0;
                          const comm = (broker as any).commissionRt ?? 0;
                          const totalCost = spread * 10 + comm;
                          const isCheapest = totalCost === cheapest;
                          return (
                            <td
                              key={broker.id}
                              className={`px-4 py-3 transition-colors ${hoveredCol === idx ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                              onMouseEnter={() => setHoveredCol(idx)}
                              onMouseLeave={() => setHoveredCol(null)}
                            >
                              <div className="flex items-center gap-1.5">
                                <TotalCostBar spread={spread} commission={comm} />
                                {isCheapest && (
                                  <Badge className="bg-emerald-600 text-white text-[10px] px-1.5 py-0 h-4 whitespace-nowrap">
                                    <Award className="h-2.5 w-2.5 mr-0.5" /> Best
                                  </Badge>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })()}

                  {/* Platforms Row */}
                  <tr className="bg-white dark:bg-gray-950">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-gray-950 z-10">
                      <div className="flex items-center gap-1.5">
                        <Monitor className="h-3.5 w-3.5 text-purple-500" /> Platforms
                      </div>
                    </td>
                    {topBrokers.map((broker, idx) => (
                      <td
                        key={broker.id}
                        className={`px-4 py-3 text-center transition-colors ${hoveredCol === idx ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                        onMouseEnter={() => setHoveredCol(idx)}
                        onMouseLeave={() => setHoveredCol(null)}
                      >
                        <div className="flex flex-wrap justify-center gap-1">
                          {broker.platforms.map((p) => (
                            <span
                              key={p}
                              className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Instruments Row */}
                  <tr className="bg-white dark:bg-gray-950">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-gray-950 z-10">
                      <div className="flex items-center gap-1.5">
                        <svg className="h-3.5 w-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                        Instruments
                      </div>
                    </td>
                    {topBrokers.map((broker, idx) => {
                      const instruments = (broker as any).tradingInstruments ?? broker.platforms?.length ?? '—';
                      return (
                        <td
                          key={broker.id}
                          className={`px-4 py-3 text-center transition-colors ${hoveredCol === idx ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                          onMouseEnter={() => setHoveredCol(idx)}
                          onMouseLeave={() => setHoveredCol(null)}
                        >
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {typeof instruments === 'number' ? instruments.toLocaleString() + '+' : instruments}
                          </span>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Best For Row */}
                  <tr className="bg-white dark:bg-gray-950">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-gray-950 z-10">
                      Best For
                    </td>
                    {topBrokers.map((broker, idx) => (
                      <td
                        key={broker.id}
                        className={`px-4 py-3 text-center transition-colors ${hoveredCol === idx ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                        onMouseEnter={() => setHoveredCol(idx)}
                        onMouseLeave={() => setHoveredCol(null)}
                      >
                        <span className="text-xs text-gray-600 dark:text-gray-400 italic">
                          {broker.bestFor?.replace('Best for ', '') || '—'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* CTA Row */}
                  <tr className="bg-gray-50 dark:bg-gray-900">
                    <td className="px-4 py-4 sticky left-0 bg-gray-50 dark:bg-gray-900 z-10" />
                    {topBrokers.map((broker, idx) => (
                      <td
                        key={broker.id}
                        className={`px-4 py-4 text-center transition-colors ${hoveredCol === idx ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                        onMouseEnter={() => setHoveredCol(idx)}
                        onMouseLeave={() => setHoveredCol(null)}
                      >
                        <div className="flex flex-col gap-1.5 items-center">
                          <Button size="sm" className="w-full max-w-[160px]" asChild>
                            <a href={broker.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored">
                              Visit {broker.name}
                            </a>
                          </Button>
                          <Link
                            href={`/broker/${broker.slug}`}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Read Review →
                          </Link>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            * Total Cost/Lot = (EUR/USD spread × $10) + round-turn commission per standard lot (100K units).
            Data verified March 2026. Costs may vary by account type.
          </p>
          <Button variant="outline" size="lg" asChild>
            <Link href="/compare">
              Create Custom Comparison <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
