'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Award, ArrowRight, Shield, TrendingUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTopBrokers, brokers } from '@/lib/brokers';

export default function RankingsPage() {
  const rankedBrokers = getTopBrokers(10);
  const [expandedBroker, setExpandedBroker] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            <Award className="inline-block h-6 w-6 text-amber-500 mr-2" />
            Forex Broker Rankings 2025
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Our comprehensive rankings based on regulation, trading conditions, platforms, and overall value.</p>
        </div>

        {/* Rankings Cards */}
        <div className="space-y-3">
          {rankedBrokers.map((broker, index) => (
            <motion.div
              key={broker.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-3">
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {index + 1}
                    </div>

                    {/* Logo */}
                    <div className="h-10 w-20 relative bg-gray-50 dark:bg-gray-800 rounded flex-shrink-0 overflow-hidden">
                      <Image src={broker.logo} alt={broker.name} fill className="object-contain p-1" unoptimized />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{broker.name}</h3>
                          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{broker.bestFor}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-amber-50 dark:bg-amber-900/20 rounded px-2 py-1">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500 mr-1" />
                            <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{broker.rating}</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>Min Deposit: <strong className="text-gray-700 dark:text-gray-300">${broker.minDeposit}</strong></span>
                        <span>Spreads: <strong className="text-gray-700 dark:text-gray-300">{broker.spreads}</strong></span>
                        <span>Instruments: <strong className="text-gray-700 dark:text-gray-300">{broker.tradingInstruments}+</strong></span>
                      </div>

                      {/* Regulations */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {broker.regulations.map(r => (
                          <span key={r} className="text-[10px] font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">
                            <Shield className="inline h-2 w-2 mr-0.5" />{r}
                          </span>
                        ))}
                      </div>

                      {/* Expandable Review */}
                      {expandedBroker === broker.id && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{broker.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <h4 className="font-semibold text-green-600 dark:text-green-400 mb-1">Pros</h4>
                              <ul className="space-y-0.5">
                                {broker.pros.slice(0, 3).map((p, i) => (
                                  <li key={i} className="text-gray-600 dark:text-gray-400">✓ {p}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-red-600 dark:text-red-400 mb-1">Cons</h4>
                              <ul className="space-y-0.5">
                                {broker.cons.slice(0, 3).map((c, i) => (
                                  <li key={i} className="text-gray-600 dark:text-gray-400">✗ {c}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" variant="outline" className="h-7 text-xs px-2" onClick={() => setExpandedBroker(expandedBroker === broker.id ? null : broker.id)}>
                          {expandedBroker === broker.id ? 'Less' : 'More'}
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs px-2" asChild>
                          <Link href={`/broker/${broker.slug}`}>Full Review</Link>
                        </Button>
                        <Button size="sm" className="h-7 text-xs px-2 bg-blue-600 hover:bg-blue-700 text-white" asChild>
                          <a href={broker.affiliateUrl} target="_blank" rel="noopener noreferrer">Visit Broker</a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
