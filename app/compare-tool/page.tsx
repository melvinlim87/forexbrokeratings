'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Star, Shield, Award, ArrowRight, Plus, X, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import RadarChart from '@/components/ui/radar-chart';
import { brokers } from '@/lib/brokers';
import { useSearchParams } from 'next/navigation';

interface SelectedBroker {
  slug: string;
}

function getWinner(slugs: string[], field: string): string | null {
  if (slugs.length < 2) return null;
  const selected = slugs.map(s => brokers.find(b => b.slug === s)!).filter(Boolean);
  let best = selected[0];
  for (const b of selected) {
    if (field === 'rating' && b.rating > best.rating) best = b;
    if (field === 'minDeposit' && b.minDeposit < best.minDeposit) best = b;
    if (field === 'regulation' && b.regulations.length > best.regulations.length) best = b;
    if (field === 'monthlyCost' && getMonthlyCost(b) < getMonthlyCost(best)) best = b;
  }
  return best.slug;
}

// Calculate estimated monthly cost for EUR/USD at 25 lots/month
function getMonthlyCost(broker: any): number {
  const deepSpreads = broker.tradingConditionsDeep?.spreads;
  let spread = broker.avgSpreadEurUsd || 1.0;
  if (deepSpreads && Array.isArray(deepSpreads)) {
    const eurusd = deepSpreads.find((s: any) => s.pair === 'EUR/USD');
    if (eurusd) spread = eurusd.standard || eurusd.raw || spread;
  }
  const commission = broker.commissionRt || 0;
  return (spread * 10 + commission) * 25; // 25 lots/month
}

function CompareToolInner() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get('brokers')?.split(',').filter(Boolean) || [];

  const [selected, setSelected] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  // Initialize from URL params on mount
  useEffect(() => {
    if (preselected.length > 0) {
      const valid = preselected.filter(slug => brokers.some(b => b.slug === slug)).slice(0, 4);
      setSelected(valid);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sortedBrokers = [...brokers].sort((a, b) => a.name.localeCompare(b.name));

  const addBroker = () => {
    if (selected.length < 4) {
      setSelected([...selected, '']);
      setOpenDropdown(selected.length);
    }
  };

  const removeBroker = (index: number) => {
    const next = selected.filter((_, i) => i !== index);
    setSelected(next);
    setOpenDropdown(null);
  };

  const setBroker = (index: number, slug: string) => {
    const next = [...selected];
    next[index] = slug;
    setSelected(next);
    setOpenDropdown(null);
  };

  const selectedBrokers = selected.filter(Boolean).map(s => brokers.find(b => b.slug === s)!).filter(Boolean);
  const availableBrokers = sortedBrokers.filter(b => !selected.includes(b.slug));

  const ratingWinner = getWinner(selected, 'rating');
  const depositWinner = getWinner(selected, 'minDeposit');
  const regulationWinner = getWinner(selected, 'regulation');
  const costWinner = getWinner(selected, 'monthlyCost');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Broker Comparison Tool
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Select 2–4 brokers to compare side by side. See ratings, spreads, platforms, regulations, and more at a glance.
          </p>
        </div>

        {/* Broker Selectors */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {selected.map((slug, index) => {
            const broker = slug ? brokers.find(b => b.slug === slug) : null;
            return (
              <div key={index} className="relative">
                <div
                  className="w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 cursor-pointer hover:border-blue-400 transition-colors"
                  onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                >
                  {broker ? (
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-16 relative flex-shrink-0">
                        <Image src={broker.logo} alt={broker.name} fill className="object-contain" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{broker.name}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span className="text-xs font-bold text-amber-600">{broker.rating}/10</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeBroker(index); }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 py-2 text-gray-400">
                      <Plus className="w-4 h-4" />
                      <span className="text-sm">Select Broker {index + 1}</span>
                    </div>
                  )}
                </div>

                {/* Dropdown */}
                {openDropdown === index && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 max-h-72 overflow-y-auto">
                    {availableBrokers.length === 0 && !broker ? (
                      <p className="p-4 text-sm text-gray-500 text-center">All brokers selected</p>
                    ) : (
                      availableBrokers.map(b => (
                        <button
                          key={b.slug}
                          onClick={() => setBroker(index, b.slug)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                        >
                          <div className="h-8 w-14 relative flex-shrink-0">
                            <Image src={b.logo} alt={b.name} fill className="object-contain" unoptimized />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{b.name}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              <span>{b.rating}</span>
                              <span>·</span>
                              <span>{b.regulations.join(', ')}</span>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Add broker button */}
          {selected.length < 4 && (
            <button
              onClick={addBroker}
              className="w-64 bg-gray-100 dark:bg-gray-800/50 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 flex items-center justify-center gap-2 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm font-medium">Add Broker</span>
            </button>
          )}
        </div>

        {/* Comparison Table */}
        {selectedBrokers.length >= 2 && (
          <>
            <Card className="overflow-hidden mb-8">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-800">
                        <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-44">Feature</th>
                        {selectedBrokers.map(broker => (
                          <th key={broker.slug} className="px-5 py-4 text-center">
                            <div className="flex flex-col items-center">
                              <div className="h-10 w-20 relative mb-2">
                                <Image src={broker.logo} alt={broker.name} fill className="object-contain" unoptimized />
                              </div>
                              <span className="font-bold text-gray-900 dark:text-white">{broker.name}</span>
                              <div className="flex items-center mt-1">
                                <Star className="w-4 h-4 text-amber-500 fill-amber-500 mr-1" />
                                <span className="text-sm font-bold text-amber-600">{broker.rating}/10</span>
                              </div>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                      {/* Best For */}
                      <tr>
                        <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">Best For</td>
                        {selectedBrokers.map(b => (
                          <td key={b.slug} className="px-5 py-3.5 text-center text-xs text-gray-600 dark:text-gray-400">{b.bestFor}</td>
                        ))}
                      </tr>

                      {/* Rating */}
                      <tr className="bg-gray-50 dark:bg-gray-900/50">
                        <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">Overall Rating</td>
                        {selectedBrokers.map(b => (
                          <td key={b.slug} className={`px-5 py-3.5 text-center font-bold ${b.slug === ratingWinner ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                            {b.rating}/10
                            {b.slug === ratingWinner && <Award className="inline h-3.5 w-3.5 ml-1 text-green-500" />}
                          </td>
                        ))}
                      </tr>

                      {/* Min Deposit */}
                      <tr>
                        <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">Min Deposit</td>
                        {selectedBrokers.map(b => (
                          <td key={b.slug} className={`px-5 py-3.5 text-center font-semibold ${b.slug === depositWinner ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : ''}`}>
                            ${b.minDeposit}
                            {b.slug === depositWinner && <Award className="inline h-3.5 w-3.5 ml-1 text-green-500" />}
                          </td>
                        ))}
                      </tr>

                      {/* Spreads */}
                      <tr className="bg-gray-50 dark:bg-gray-900/50">
                        <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">Spreads</td>
                        {selectedBrokers.map(b => (
                          <td key={b.slug} className="px-5 py-3.5 text-center text-xs">{b.spreads}</td>
                        ))}
                      </tr>

                      {/* Leverage */}
                      <tr>
                        <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">Leverage</td>
                        {selectedBrokers.map(b => (
                          <td key={b.slug} className="px-5 py-3.5 text-center">{b.leverage}</td>
                        ))}
                      </tr>

                      {/* Platforms */}
                      <tr className="bg-gray-50 dark:bg-gray-900/50">
                        <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">Platforms</td>
                        {selectedBrokers.map(b => (
                          <td key={b.slug} className="px-5 py-3.5 text-center text-xs">{b.platforms.join(', ')}</td>
                        ))}
                      </tr>

                      {/* Instruments */}
                      <tr>
                        <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">Instruments</td>
                        {selectedBrokers.map(b => (
                          <td key={b.slug} className="px-5 py-3.5 text-center font-semibold">{b.tradingInstruments}+</td>
                        ))}
                      </tr>

                      {/* Est. Monthly Cost */}
                      <tr className="bg-blue-50 dark:bg-blue-900/20">
                        <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">
                          Est. Monthly Cost
                          <div className="text-[10px] text-gray-400 font-normal">25 lots EUR/USD</div>
                        </td>
                        {selectedBrokers.map(b => {
                          const monthlyCost = getMonthlyCost(b);
                          return (
                            <td key={b.slug} className={`px-5 py-3.5 text-center font-bold ${b.slug === costWinner ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                              ${monthlyCost.toLocaleString()}
                              {b.slug === costWinner && <Award className="inline h-3.5 w-3.5 ml-1 text-emerald-500" />}
                              <div className="text-[10px] text-gray-400 font-normal mt-0.5">
                                ${((b.commissionRt || 0) + ((b as any).avgSpreadEurUsd || 1) * 10).toFixed(2)}/lot
                              </div>
                            </td>
                          );
                        })}
                      </tr>

                      {/* Regulation */}
                      <tr className="bg-gray-50 dark:bg-gray-900/50">
                        <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">Regulation</td>
                        {selectedBrokers.map(b => (
                          <td key={b.slug} className={`px-5 py-3.5 text-center ${b.slug === regulationWinner ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
                            <div className="flex flex-wrap justify-center gap-1">
                              {b.regulations.map(r => (
                                <Badge key={r} variant="outline" className={`text-[10px] font-medium ${b.slug === regulationWinner ? 'text-green-700 dark:text-green-400 border-green-300' : 'text-green-700 dark:text-green-400'}`}>
                                  <Shield className="h-2 w-2 mr-0.5" />{r}
                                </Badge>
                              ))}
                            </div>
                            {b.slug === regulationWinner && <Award className="inline h-3.5 w-3.5 mt-1 text-green-500" />}
                          </td>
                        ))}
                      </tr>

                      {/* Founded */}
                      <tr>
                        <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">Founded</td>
                        {selectedBrokers.map(b => (
                          <td key={b.slug} className="px-5 py-3.5 text-center">{b.founded}</td>
                        ))}
                      </tr>

                      {/* Pros */}
                      <tr className="bg-gray-50 dark:bg-gray-900/50">
                        <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white align-top">Pros</td>
                        {selectedBrokers.map(b => (
                          <td key={b.slug} className="px-5 py-3.5 text-xs">
                            <ul className="space-y-1">
                              {b.pros.slice(0, 4).map((p, i) => (
                                <li key={i} className="flex items-start gap-1">
                                  <Check className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-600 dark:text-gray-400">{p}</span>
                                </li>
                              ))}
                            </ul>
                          </td>
                        ))}
                      </tr>

                      {/* Cons */}
                      <tr>
                        <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white align-top">Cons</td>
                        {selectedBrokers.map(b => (
                          <td key={b.slug} className="px-5 py-3.5 text-xs">
                            <ul className="space-y-1">
                              {b.cons.slice(0, 4).map((c, i) => (
                                <li key={i} className="flex items-start gap-1">
                                  <span className="text-red-500 mt-0.5 flex-shrink-0">✗</span>
                                  <span className="text-gray-600 dark:text-gray-400">{c}</span>
                                </li>
                              ))}
                            </ul>
                          </td>
                        ))}
                      </tr>

                      {/* Actions */}
                      <tr className="bg-gray-100 dark:bg-gray-800">
                        <td className="px-5 py-4"></td>
                        {selectedBrokers.map(b => (
                          <td key={b.slug} className="px-5 py-4 text-center">
                            <div className="flex flex-col gap-2">
                              <Button size="sm" variant="outline" className="text-xs h-8" asChild>
                                <Link href={`/broker/${b.slug}`}>Full Review</Link>
                              </Button>
                              <Button size="sm" className="text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white" asChild>
                                <a href={b.affiliateUrl} target="_blank" rel="noopener noreferrer">
                                  Visit {b.name} <ArrowRight className="h-3 w-3 ml-1" />
                                </a>
                              </Button>
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Radar Chart — Visual Score Comparison */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  Score Comparison
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Visual breakdown across 6 key categories (out of 10)</p>
                <div className="flex justify-center">
                  <RadarChart
                    brokers={selectedBrokers.map((b, i) => ({
                      name: b.name,
                      color: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'][i],
                      scores: {
                        fees: b.scores?.fees ?? 7,
                        security: b.scores?.security ?? 7,
                        platforms: b.scores?.platforms ?? 7,
                        instruments: b.scores?.tradingInstruments ?? 7,
                        deposit: b.scores?.deposit ?? 7,
                        support: b.scores?.customerService ?? 7,
                      },
                    }))}
                    size={300}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Verdict */}
            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950/30 dark:to-emerald-950/30 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                Quick Verdict
              </h3>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                {ratingWinner && (
                  <p>🏆 <strong>Highest Rated:</strong> {brokers.find(b => b.slug === ratingWinner)?.name} ({brokers.find(b => b.slug === ratingWinner)?.rating}/10)</p>
                )}
                {depositWinner && (
                  <p>💰 <strong>Lowest Barrier:</strong> {brokers.find(b => b.slug === depositWinner)?.name} (${brokers.find(b => b.slug === depositWinner)?.minDeposit} min deposit)</p>
                )}
                {regulationWinner && (
                  <p>🛡️ <strong>Best Regulated:</strong> {brokers.find(b => b.slug === regulationWinner)?.name} ({brokers.find(b => b.slug === regulationWinner)?.regulations.length} licenses)</p>
                )}
                {costWinner && selected.length >= 2 && (
                  <p>💸 <strong>Lowest Cost:</strong> {brokers.find(b => b.slug === costWinner)?.name} (${getMonthlyCost(brokers.find(b => b.slug === costWinner)!).toLocaleString()}/mo for 25 lots EUR/USD)</p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Empty state */}
        {selectedBrokers.length < 2 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚖️</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Select at least 2 brokers to compare</h2>
            <p className="text-gray-500 dark:text-gray-400">Use the dropdowns above to pick brokers and see a detailed side-by-side comparison.</p>
            <div className="mt-6">
              <Button asChild>
                <Link href="/brokers">Browse All Brokers</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CompareToolPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading comparison tool...</p></div>}>
      <CompareToolInner />
    </Suspense>
  );
}
