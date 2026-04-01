'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Star, Shield, Award, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { brokers, getTopBrokers } from '@/lib/brokers';

// Determine winner for each row
function getWinner(selectedBrokers: typeof brokers, field: string): string | null {
  if (selectedBrokers.length < 2) return null;
  let best = selectedBrokers[0];
  for (const b of selectedBrokers) {
    if (field === 'rating' && b.rating > best.rating) best = b;
    if (field === 'minDeposit' && b.minDeposit < best.minDeposit) best = b;
    if (field === 'regulation' && b.regulations.length > best.regulations.length) best = b;
    if (field === 'leverage') {
      const lev = (s: string) => parseInt(s.replace(/[^0-9]/g, '')) || 0;
      if (lev(b.leverage) > lev(best.leverage)) best = b;
    }
    if (field === 'instruments' && b.tradingInstruments > best.tradingInstruments) best = b;
    if (field === 'spreads') {
      const spread = (s: string) => {
        const match = s.match(/[\d.]+/);
        return match ? parseFloat(match[0]) : 999;
      };
      if (spread(b.spreads) < spread(best.spreads)) best = b;
    }
  }
  return best.slug;
}

// Generate verdict text
function getVerdictText(selectedBrokers: typeof brokers, winners: Record<string, string | null>): string {
  if (selectedBrokers.length < 2) return '';

  const parts: string[] = [];

  if (winners.rating) {
    const w = selectedBrokers.find(b => b.slug === winners.rating)!;
    parts.push(`${w.name} leads with a ${w.rating}/10 overall rating`);
  }
  if (winners.regulation) {
    const w = selectedBrokers.find(b => b.slug === winners.regulation)!;
    parts.push(`${w.name} has the strongest regulatory profile with ${w.regulations.length} licenses`);
  }
  if (winners.minDeposit) {
    const w = selectedBrokers.find(b => b.slug === winners.minDeposit)!;
    parts.push(`${w.name} has the lowest barrier to entry at $${w.minDeposit} minimum deposit`);
  }
  if (winners.spreads) {
    const w = selectedBrokers.find(b => b.slug === winners.spreads)!;
    parts.push(`${w.name} offers the tightest spreads (${w.spreads.split(';')[0]})`);
  }

  // Overall recommendation
  const ratingWinner = selectedBrokers.find(b => b.slug === winners.rating);
  const regWinner = selectedBrokers.find(b => b.slug === winners.regulation);

  let recommendation = '';
  if (ratingWinner && regWinner && ratingWinner.slug === regWinner.slug) {
    recommendation = `Our top pick: ${ratingWinner.name} — best overall score combined with strong regulation.`;
  } else if (ratingWinner) {
    recommendation = `For overall quality, choose ${ratingWinner.name}. `;
    if (regWinner) recommendation += `For maximum safety, consider ${regWinner.name}.`;
  }

  return recommendation;
}

export default function ComparePage() {
  const [selected, setSelected] = useState<string[]>(['pepperstone', 'ic-markets', 'xm']);
  const topBrokers = getTopBrokers(15);

  const toggleBroker = (slug: string) => {
    if (selected.includes(slug)) {
      setSelected(selected.filter(s => s !== slug));
    } else if (selected.length < 4) {
      setSelected([...selected, slug]);
    }
  };

  const selectedBrokers = selected.map(s => brokers.find(b => b.slug === s)!).filter(Boolean);

  // Calculate all winners
  const winners = {
    rating: getWinner(selectedBrokers, 'rating'),
    deposit: getWinner(selectedBrokers, 'minDeposit'),
    regulation: getWinner(selectedBrokers, 'regulation'),
    leverage: getWinner(selectedBrokers, 'leverage'),
    instruments: getWinner(selectedBrokers, 'instruments'),
    spreads: getWinner(selectedBrokers, 'spreads'),
  };

  const verdict = getVerdictText(selectedBrokers, winners);

  // Count wins per broker
  const winCounts: Record<string, number> = {};
  selectedBrokers.forEach(b => { winCounts[b.slug] = 0; });
  Object.values(winners).forEach(slug => {
    if (slug) winCounts[slug] = (winCounts[slug] || 0) + 1;
  });
  const overallWinnerSlug = Object.entries(winCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Compare Forex Brokers</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Select up to 4 brokers to compare side by side. <span className="text-green-600 dark:text-green-400 font-medium">Green highlights</span> show the best value in each row.
          </p>
        </div>

        {/* Broker Selection */}
        <div className="flex flex-wrap gap-2 mb-6">
          {topBrokers.map(broker => (
            <button
              key={broker.slug}
              onClick={() => toggleBroker(broker.slug)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selected.includes(broker.slug)
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-400'
              }`}
            >
              <div className="h-4 w-8 relative">
                <Image src={broker.logo} alt={broker.name} fill className="object-contain" unoptimized />
              </div>
              {broker.name}
              {selected.includes(broker.slug) && <Check className="h-3 w-3" />}
            </button>
          ))}
        </div>

        {/* Comparison Table */}
        {selectedBrokers.length > 0 && (
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-40">Feature</th>
                      {selectedBrokers.map(broker => (
                        <th key={broker.slug} className="px-4 py-3 text-center">
                          <div className="flex flex-col items-center">
                            <div className="h-8 w-16 relative mb-1">
                              <Image src={broker.logo} alt={broker.name} fill className="object-contain" unoptimized />
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white text-sm">{broker.name}</span>
                            <div className="flex items-center mt-0.5">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-0.5" />
                              <span className="text-xs font-bold text-amber-600">{broker.rating}/10</span>
                            </div>
                            {broker.slug === overallWinnerSlug && (
                              <Badge className="mt-1 text-[9px] bg-amber-500 text-white border-0 px-1.5 py-0">
                                <Award className="h-2.5 w-2.5 mr-0.5" /> Best Overall
                              </Badge>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {/* Best For */}
                    <tr>
                      <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-white">Best For</td>
                      {selectedBrokers.map(b => <td key={b.slug} className="px-4 py-2.5 text-center text-xs">{b.bestFor}</td>)}
                    </tr>

                    {/* Rating */}
                    <tr className="bg-gray-50 dark:bg-gray-900/50">
                      <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-white">Overall Rating</td>
                      {selectedBrokers.map(b => (
                        <td key={b.slug} className={`px-4 py-2.5 text-center font-bold ${b.slug === winners.rating ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : ''}`}>
                          {b.rating}/10
                          {b.slug === winners.rating && <Award className="inline h-3 w-3 ml-1 text-green-500" />}
                        </td>
                      ))}
                    </tr>

                    {/* Min Deposit */}
                    <tr>
                      <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-white">Min Deposit</td>
                      {selectedBrokers.map(b => (
                        <td key={b.slug} className={`px-4 py-2.5 text-center font-semibold ${b.slug === winners.deposit ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : ''}`}>
                          ${b.minDeposit}
                          {b.slug === winners.deposit && <Award className="inline h-3 w-3 ml-1 text-green-500" />}
                        </td>
                      ))}
                    </tr>

                    {/* Spreads */}
                    <tr className="bg-gray-50 dark:bg-gray-900/50">
                      <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-white">Spreads</td>
                      {selectedBrokers.map(b => (
                        <td key={b.slug} className={`px-4 py-2.5 text-center ${b.slug === winners.spreads ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-semibold' : ''}`}>
                          {b.spreads.split(';')[0]}
                          {b.slug === winners.spreads && <Award className="inline h-3 w-3 ml-1 text-green-500" />}
                        </td>
                      ))}
                    </tr>

                    {/* Leverage */}
                    <tr>
                      <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-white">Max Leverage</td>
                      {selectedBrokers.map(b => (
                        <td key={b.slug} className={`px-4 py-2.5 text-center ${b.slug === winners.leverage ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-semibold' : ''}`}>
                          {b.leverage}
                          {b.slug === winners.leverage && <Award className="inline h-3 w-3 ml-1 text-green-500" />}
                        </td>
                      ))}
                    </tr>

                    {/* Platforms */}
                    <tr className="bg-gray-50 dark:bg-gray-900/50">
                      <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-white">Platforms</td>
                      {selectedBrokers.map(b => <td key={b.slug} className="px-4 py-2.5 text-center text-xs">{b.platforms.join(', ')}</td>)}
                    </tr>

                    {/* Instruments */}
                    <tr>
                      <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-white">Instruments</td>
                      {selectedBrokers.map(b => (
                        <td key={b.slug} className={`px-4 py-2.5 text-center font-semibold ${b.slug === winners.instruments ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : ''}`}>
                          {b.tradingInstruments}+
                          {b.slug === winners.instruments && <Award className="inline h-3 w-3 ml-1 text-green-500" />}
                        </td>
                      ))}
                    </tr>

                    {/* Regulation */}
                    <tr className="bg-gray-50 dark:bg-gray-900/50">
                      <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-white">Regulation</td>
                      {selectedBrokers.map(b => (
                        <td key={b.slug} className={`px-4 py-2.5 text-center ${b.slug === winners.regulation ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
                          <div className="flex flex-wrap justify-center gap-1">
                            {b.regulations.map(r => (
                              <span key={r} className={`text-[10px] font-medium px-1 py-0.5 rounded ${b.slug === winners.regulation ? 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30' : 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20'}`}>{r}</span>
                            ))}
                          </div>
                          {b.slug === winners.regulation && <Award className="inline h-3 w-3 mt-1 text-green-500" />}
                        </td>
                      ))}
                    </tr>

                    {/* Founded */}
                    <tr>
                      <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-white">Founded</td>
                      {selectedBrokers.map(b => <td key={b.slug} className="px-4 py-2.5 text-center">{b.founded}</td>)}
                    </tr>

                    {/* Actions */}
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <td className="px-4 py-3"></td>
                      {selectedBrokers.map(b => (
                        <td key={b.slug} className="px-4 py-3 text-center">
                          <div className="flex flex-col gap-1.5">
                            <Button size="sm" variant="outline" className="text-xs h-7" asChild>
                              <Link href={`/broker/${b.slug}`}>Full Review</Link>
                            </Button>
                            <Button size="sm" className="text-xs h-7 bg-blue-600 hover:bg-blue-700 text-white" asChild>
                              <a href={b.affiliateUrl} target="_blank" rel="noopener noreferrer">Visit Broker</a>
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
        )}

        {/* Detailed Verdict */}
        {selectedBrokers.length >= 2 && (
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950/30 dark:to-emerald-950/30 rounded-xl border border-blue-200 dark:border-blue-800 p-5">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              Verdict
            </h3>

            {/* Win counts */}
            <div className="flex flex-wrap gap-3 mb-4">
              {selectedBrokers.map(b => (
                <div key={b.slug} className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700">
                  <div className="h-6 w-12 relative">
                    <Image src={b.logo} alt={b.name} fill className="object-contain" unoptimized />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{b.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{winCounts[b.slug] || 0} wins</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Category winners */}
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1.5 mb-4">
              {winners.rating && (
                <p>🏆 <strong>Highest Rated:</strong> {brokers.find(b => b.slug === winners.rating)?.name} ({brokers.find(b => b.slug === winners.rating)?.rating}/10)</p>
              )}
              {winners.deposit && (
                <p>💰 <strong>Lowest Barrier:</strong> {brokers.find(b => b.slug === winners.deposit)?.name} (${brokers.find(b => b.slug === winners.deposit)?.minDeposit} min deposit)</p>
              )}
              {winners.regulation && (
                <p>🛡️ <strong>Best Regulated:</strong> {brokers.find(b => b.slug === winners.regulation)?.name} ({brokers.find(b => b.slug === winners.regulation)?.regulations.length} licenses)</p>
              )}
              {winners.spreads && (
                <p>📉 <strong>Tightest Spreads:</strong> {brokers.find(b => b.slug === winners.spreads)?.name} ({brokers.find(b => b.slug === winners.spreads)?.spreads.split(';')[0]})</p>
              )}
              {winners.leverage && (
                <p>⚡ <strong>Highest Leverage:</strong> {brokers.find(b => b.slug === winners.leverage)?.name} ({brokers.find(b => b.slug === winners.leverage)?.leverage})</p>
              )}
              {winners.instruments && (
                <p>📊 <strong>Most Instruments:</strong> {brokers.find(b => b.slug === winners.instruments)?.name} ({brokers.find(b => b.slug === winners.instruments)?.tradingInstruments}+)</p>
              )}
            </div>

            {/* Recommendation */}
            {verdict && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  💡 <strong>Our Recommendation:</strong> {verdict}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
