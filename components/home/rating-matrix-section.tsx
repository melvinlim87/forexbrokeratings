'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, ArrowRight, Shield, TrendingUp, BarChart3, Star } from 'lucide-react';
import { brokers } from '@/lib/brokers';
import { generateBrokerRatings } from '@/components/rating-matrix';

type SortKey = 'overall' | 'regulation' | 'trading' | 'fees' | 'platforms' | 'deposit';

const sortLabels: Record<SortKey, string> = {
  overall: 'Overall',
  regulation: 'Regulation',
  trading: 'Trading',
  fees: 'Fees',
  platforms: 'Platforms',
  deposit: 'Deposits',
};

function getColorForScore(score: number): string {
  if (score >= 9) return '#10b981';
  if (score >= 8) return '#22c55e';
  if (score >= 7) return '#84cc16';
  if (score >= 6) return '#eab308';
  if (score >= 5) return '#f97316';
  return '#ef4444';
}

function MiniBar({ score, color }: { score: number; color?: string }) {
  const pct = Math.min((score / 10) * 100, 100);
  const barColor = color || getColorForScore(score);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden" style={{ minWidth: 60 }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
      <span className="text-xs font-semibold w-7 text-right" style={{ color: barColor }}>
        {score.toFixed(1)}
      </span>
    </div>
  );
}

export default function HomeRatingMatrix() {
  const [sortBy, setSortBy] = useState<SortKey>('overall');
  const [expanded, setExpanded] = useState<string | null>(null);

  const topBrokers = useMemo(() => {
    return [...brokers]
      .map(b => ({
        ...b,
        ratings: generateBrokerRatings(b),
      }))
      .sort((a, b) => {
        if (sortBy === 'overall') return b.ratings.overall - a.ratings.overall;
        const aCat = a.ratings.categories.find(c => c.label.toLowerCase() === sortBy);
        const bCat = b.ratings.categories.find(c => c.label.toLowerCase() === sortBy);
        return (bCat?.score ?? 0) - (aCat?.score ?? 0);
      })
      .slice(0, 10);
  }, [sortBy]);

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full px-4 py-1.5 text-sm font-medium mb-3">
              <BarChart3 className="h-4 w-4" />
              Data-Driven Ratings
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Broker Rating Matrix
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">
              Comprehensive ratings across 7 key dimensions — regulation, trading, platforms, fees, deposits, support, and education.
              Based on 200+ data points per broker.
            </p>
          </div>
          {/* Sort controls */}
          <div className="flex flex-wrap gap-2">
            {(Object.keys(sortLabels) as SortKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                  sortBy === key
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {sortLabels[key]}
              </button>
            ))}
          </div>
        </div>

        {/* Rating Matrix Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <div className="col-span-1">#</div>
            <div className="col-span-3">Broker</div>
            <div className="col-span-2">Regulation</div>
            <div className="col-span-2">Trading</div>
            <div className="col-span-1">Fees</div>
            <div className="col-span-1">Platforms</div>
            <div className="col-span-1">Overall</div>
            <div className="col-span-1"></div>
          </div>

          {/* Rows */}
          {topBrokers.map((broker, index) => {
            const isExpanded = expanded === broker.slug;
            const regCat = broker.ratings.categories.find(c => c.label === 'Regulation');
            const tradingCat = broker.ratings.categories.find(c => c.label === 'Trading');
            const feesCat = broker.ratings.categories.find(c => c.label === 'Promotions');
            const platformsCat = broker.ratings.categories.find(c => c.label === 'Platforms');

            return (
              <div key={broker.slug}>
                {/* Main Row */}
                <div
                  className={`grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 md:px-6 py-4 border-b cursor-pointer transition-all duration-300 ${
                    index === 0
                      ? 'bg-gradient-to-r from-amber-50/60 via-amber-50/30 to-transparent dark:from-amber-900/10 dark:via-amber-900/5 dark:to-transparent border-amber-200/50 dark:border-amber-800/30 shadow-[inset_0_1px_0_0_rgba(251,191,36,0.2)]'
                      : 'border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30'
                  }`}
                  onClick={() => setExpanded(isExpanded ? null : broker.slug)}
                >
                  {/* Rank — mobile + desktop */}
                  <div className="hidden md:flex col-span-1 items-center">
                    <span className={`text-lg font-bold ${
                      index === 0 ? 'text-amber-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-400' : 'text-gray-500'
                    }`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </span>
                  </div>

                  {/* Broker name + badges */}
                  <div className="col-span-1 md:col-span-3 flex items-center gap-3">
                    <div className="md:hidden">
                      <span className={`text-lg font-bold ${
                        index === 0 ? 'text-amber-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-400' : 'text-gray-500'
                      }`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">
                      {broker.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">{broker.name}</span>
                        {index === 0 && (
                          <span className="flex-shrink-0 text-[9px] font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-white px-1.5 py-0.5 rounded-full uppercase tracking-wide shadow-sm">
                            🏆 Top Pick
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{broker.bestFor}</div>
                    </div>
                  </div>

                  {/* Regulation — desktop */}
                  <div className="hidden md:flex col-span-2 items-center">
                    {regCat && <MiniBar score={regCat.score} color={regCat.color} />}
                  </div>

                  {/* Trading — desktop */}
                  <div className="hidden md:flex col-span-2 items-center">
                    {tradingCat && <MiniBar score={tradingCat.score} color={tradingCat.color} />}
                  </div>

                  {/* Fees — desktop */}
                  <div className="hidden md:flex col-span-1 items-center">
                    {feesCat && <MiniBar score={feesCat.score} color={feesCat.color} />}
                  </div>

                  {/* Platforms — desktop */}
                  <div className="hidden md:flex col-span-1 items-center">
                    {platformsCat && <MiniBar score={platformsCat.score} color={platformsCat.color} />}
                  </div>

                  {/* Overall */}
                  <div className="col-span-1 flex items-center">
                    <span
                      className="text-sm font-bold px-2.5 py-1 rounded-lg text-white"
                      style={{ backgroundColor: getColorForScore(broker.ratings.overall) }}
                    >
                      {broker.ratings.overall.toFixed(1)}
                    </span>
                  </div>

                  {/* Expand arrow */}
                  <div className="col-span-1 flex items-center justify-end">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>

                  {/* Mobile: show all bars */}
                  <div className="md:hidden col-span-1 grid grid-cols-2 gap-2 mt-1">
                    {broker.ratings.categories.slice(0, 4).map(cat => (
                      <div key={cat.label} className="flex items-center gap-1">
                        <span className="text-[10px] text-gray-500 w-14 truncate">{cat.label}</span>
                        <MiniBar score={cat.score} color={cat.color} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expanded Detail Row */}
                {isExpanded && (
                  <div className="px-4 md:px-6 py-4 bg-gray-50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* All 7 category scores */}
                      {broker.ratings.categories.map(cat => (
                        <div key={cat.label} className="flex flex-col gap-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{cat.label}</span>
                          <MiniBar score={cat.score} color={cat.color} />
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex flex-wrap gap-1.5">
                        {broker.regulations.slice(0, 4).map(reg => (
                          <span key={reg} className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                            <Shield className="h-3 w-3 inline mr-0.5" />{reg}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        <Star className="h-3 w-3 inline text-amber-500 mr-0.5" />
                        {broker.avgSpreadEurUsd} pips EUR/USD · ${broker.minDeposit} min deposit
                      </div>
                      <Link
                        href={`/broker/${broker.slug}`}
                        className="ml-auto text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Full Review <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-6">
          <Link
            href="/rankings"
            className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            View Complete Rankings
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
