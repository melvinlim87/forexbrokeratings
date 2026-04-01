'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calculator, TrendingDown, DollarSign, BarChart3, ChevronDown, Info, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { brokers } from '@/lib/brokers';
import ScoreRing from '@/components/ui/score-ring';

/**
 * TradingCostCalculator — Interactive widget showing real trading costs
 * across brokers based on user's monthly volume.
 * 
 * Inspired by BrokerChooser's cost calculator and Investopedia's
 * cost breakdown tools. Makes abstract "low spreads" concrete in dollars.
 */

const LOT_PRESETS = [5, 10, 25, 50, 100, 250];

// Currency pairs available for cost comparison
const TRADING_PAIRS = [
  { key: 'EUR/USD', label: 'EUR/USD', pipValue: 10 },
  { key: 'GBP/USD', label: 'GBP/USD', pipValue: 10 },
  { key: 'USD/JPY', label: 'USD/JPY', pipValue: 10 },
];

// Get spread for a specific pair from broker data
function getSpreadForPair(broker: any, pair: string): number {
  // Try tradingConditionsDeep.spreads first (has per-pair data)
  const deepSpreads = broker.tradingConditionsDeep?.spreads;
  if (deepSpreads && Array.isArray(deepSpreads)) {
    const pairData = deepSpreads.find((s: any) => s.pair === pair);
    if (pairData) {
      // Use standard spread (more representative for most traders)
      return pairData.standard || pairData.raw || 1.0;
    }
  }
  // Fallback to avgSpreadEurUsd for EUR/USD
  if (pair === 'EUR/USD' && broker.avgSpreadEurUsd) {
    return broker.avgSpreadEurUsd;
  }
  // Estimated fallbacks
  if (pair === 'GBP/USD') return (broker.avgSpreadEurUsd || 1.0) * 1.3;
  if (pair === 'USD/JPY') return (broker.avgSpreadEurUsd || 1.0) * 1.1;
  return 1.0;
}

// Standard cost calculation: spread cost per lot = spread (pips) × pip value
// Commission cost per lot = commission RT
// Total cost per lot = spread cost + commission
function calculateMonthlyCost(broker: any, lotsPerMonth: number, pair: string = 'EUR/USD') {
  const avgSpread = getSpreadForPair(broker, pair);
  const commissionRt = broker.commissionRt || 0;
  const pipValue = TRADING_PAIRS.find(p => p.key === pair)?.pipValue || 10;
  const spreadCostPerLot = avgSpread * pipValue;
  const totalPerLot = spreadCostPerLot + commissionRt;
  return {
    spreadCost: spreadCostPerLot * lotsPerMonth,
    commissionCost: commissionRt * lotsPerMonth,
    total: totalPerLot * lotsPerMonth,
    perLot: totalPerLot,
    spread: avgSpread,
  };
}

// Top 8 brokers for comparison (mix of cheapest and most popular)
const COMPARE_BROKERS = [
  'fusion-markets',
  'ic-markets',
  'pepperstone',
  'tickmill',
  'vantage',
  'fp-markets',
  'activtrades',
  'capital-com',
];

export default function TradingCostCalculator() {
  const [lotsPerMonth, setLotsPerMonth] = useState(25);
  const [selectedPair, setSelectedPair] = useState('EUR/USD');
  const [showAll, setShowAll] = useState(false);

  const selectedBrokers = useMemo(() => {
    return COMPARE_BROKERS
      .map(slug => brokers.find(b => b.slug === slug))
      .filter(Boolean)
      .map(broker => ({
        ...broker,
        cost: calculateMonthlyCost(broker, lotsPerMonth, selectedPair),
      }))
      .sort((a, b) => a.cost.total - b.cost.total);
  }, [lotsPerMonth, selectedPair]);

  const cheapest = selectedBrokers[0];
  const mostExpensive = selectedBrokers[selectedBrokers.length - 1];
  const savingsPotential = mostExpensive && cheapest
    ? mostExpensive.cost.total - cheapest.cost.total
    : 0;

  const displayedBrokers = showAll ? selectedBrokers : selectedBrokers.slice(0, 5);

  return (
    <section className="py-10 bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-gray-950">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium mb-3">
            <Calculator className="h-3.5 w-3.5" />
            Trading Cost Calculator
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            How Much Are You <span className="text-emerald-600 dark:text-emerald-400">Really</span> Paying?
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-xl mx-auto">
            Enter your monthly trading volume and see the <strong>actual dollar cost</strong> difference between brokers.
          </p>
        </div>

        {/* Pair Selector */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">Currency pair:</span>
            {TRADING_PAIRS.map(pair => (
              <button
                key={pair.key}
                onClick={() => setSelectedPair(pair.key)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all border',
                  selectedPair === pair.key
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                )}
              >
                {pair.label}
              </button>
            ))}
          </div>
        </div>

        {/* Volume Selector */}
        <div className="max-w-2xl mx-auto mb-8">
          <Card className="border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Monthly Volume (EUR/USD lots)
                </label>
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {lotsPerMonth} lots
                </span>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="1"
                max="500"
                value={lotsPerMonth}
                onChange={(e) => setLotsPerMonth(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                aria-label="Monthly trading volume in lots"
              />
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-gray-400">1 lot</span>
                <span className="text-[10px] text-gray-400">500 lots</span>
              </div>

              {/* Preset Buttons */}
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-xs text-gray-500 dark:text-gray-400 self-center mr-1">Quick set:</span>
                {LOT_PRESETS.map(preset => (
                  <button
                    key={preset}
                    onClick={() => setLotsPerMonth(preset)}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium transition-all',
                      lotsPerMonth === preset
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                    )}
                  >
                    {preset} lots
                  </button>
                ))}
              </div>

              {/* Savings Callout */}
              {savingsPotential > 0 && (
                <div className="mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <p className="text-sm text-emerald-800 dark:text-emerald-200">
                      You could save <strong className="text-emerald-600 dark:text-emerald-400">${savingsPotential.toFixed(0)}/month</strong> (${(savingsPotential * 12).toFixed(0)}/year) by choosing {cheapest?.name} over {mostExpensive?.name}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cost Comparison Table */}
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-lg">
            <CardContent className="p-0">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                <div className="col-span-4 md:col-span-4">Broker</div>
                <div className="col-span-2 md:col-span-2 text-center">Spread Cost</div>
                <div className="col-span-2 md:col-span-2 text-center">Commission</div>
                <div className="col-span-2 md:col-span-2 text-center">Total/Month</div>
                <div className="col-span-2 md:col-span-2 text-center">Total/Year</div>
              </div>

              {/* Broker Rows */}
              {displayedBrokers.map((broker: any, idx: number) => {
                const isCheapest = idx === 0;
                const isSecond = idx === 1;
                return (
                  <motion.div
                    key={broker.slug}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={cn(
                      'grid grid-cols-12 gap-2 items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800/50 transition-colors',
                      isCheapest ? 'bg-emerald-50/80 dark:bg-emerald-900/20' :
                      isSecond ? 'bg-blue-50/50 dark:bg-blue-900/10' :
                      idx % 2 === 0 ? 'bg-white dark:bg-gray-950' : 'bg-gray-50/50 dark:bg-gray-900/30'
                    )}
                  >
                    {/* Rank + Broker */}
                    <div className="col-span-4 flex items-center gap-2">
                      <span className={cn(
                        'text-xs font-bold w-5 text-center',
                        isCheapest ? 'text-emerald-600' : 'text-gray-400'
                      )}>
                        #{idx + 1}
                      </span>
                      <div className="h-6 w-10 relative flex-shrink-0">
                        <Image src={broker.logo} alt={broker.name} fill className="object-contain" unoptimized />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/broker/${broker.slug}`}
                          className="text-xs font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate block"
                        >
                          {broker.name}
                        </Link>
                        {isCheapest && (
                          <Badge className="mt-0.5 bg-emerald-500 text-white text-[8px] px-1.5 py-0 h-4">
                            <Zap className="h-2 w-2 mr-0.5" /> Cheapest
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Spread Cost */}
                    <div className="col-span-2 text-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        ${broker.cost.spreadCost.toFixed(0)}
                      </span>
                    </div>

                    {/* Commission */}
                    <div className="col-span-2 text-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {broker.cost.commissionCost > 0 ? `$${broker.cost.commissionCost.toFixed(0)}` : '—'}
                      </span>
                    </div>

                    {/* Total Monthly */}
                    <div className="col-span-2 text-center">
                      <span className={cn(
                        'text-sm font-bold',
                        isCheapest ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'
                      )}>
                        ${broker.cost.total.toFixed(0)}
                      </span>
                    </div>

                    {/* Total Yearly */}
                    <div className="col-span-2 text-center">
                      <span className={cn(
                        'text-sm font-semibold',
                        isCheapest ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400'
                      )}>
                        ${(broker.cost.total * 12).toFixed(0)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}

              {/* Show More / Less */}
              {!showAll && selectedBrokers.length > 5 && (
                <button
                  onClick={() => setShowAll(true)}
                  className="w-full py-3 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center gap-1"
                >
                  Show {selectedBrokers.length - 5} more brokers
                  <ChevronDown className="h-3 w-3" />
                </button>
              )}
              {showAll && (
                <button
                  onClick={() => setShowAll(false)}
                  className="w-full py-3 text-xs font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-colors"
                >
                  Show less
                </button>
              )}

              {/* Disclaimer */}
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-start gap-2">
                  <Info className="h-3.5 w-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">
                    Costs calculated using average EUR/USD spreads on standard accounts + round-turn commissions. 
                    Actual costs may vary based on account type, market conditions, and time of trading. 
                    Data updated regularly from broker disclosures and independent testing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center mt-6">
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Link href="/brokers">
                <BarChart3 className="h-4 w-4 mr-2" />
                Compare All Brokers
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
