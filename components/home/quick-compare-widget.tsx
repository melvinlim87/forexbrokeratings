'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftRight, Check, X, Star, Shield, DollarSign, TrendingUp, Monitor, Zap, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import ScoreRing from '@/components/ui/score-ring';
import { brokers, getTopBrokers } from '@/lib/brokers';

interface CompareRow {
  label: string;
  icon: React.ReactNode;
  getter: (b: typeof brokers[0]) => React.ReactNode;
}

const rows: CompareRow[] = [
  {
    label: 'Overall Rating',
    icon: <Star className="h-3.5 w-3.5 text-amber-500" />,
    getter: (b) => (
      <div className="flex items-center gap-1.5">
        <ScoreRing score={b.rating} size={32} strokeWidth={2.5} />
        <span className={cn(
          'text-lg font-bold',
          b.rating >= 9 ? 'text-emerald-600 dark:text-emerald-400' :
          b.rating >= 8 ? 'text-blue-600 dark:text-blue-400' :
          'text-amber-600 dark:text-amber-400'
        )}>{b.rating}/10</span>
      </div>
    ),
  },
  {
    label: 'Best For',
    icon: <Zap className="h-3.5 w-3.5 text-yellow-500" />,
    getter: (b) => <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{b.bestFor}</span>,
  },
  {
    label: 'Min Deposit',
    icon: <DollarSign className="h-3.5 w-3.5 text-green-500" />,
    getter: (b) => {
      const isFree = b.minDeposit === 0;
      return (
        <span className={cn('text-sm font-semibold', isFree ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white')}>
          {isFree ? 'No minimum' : `$${b.minDeposit}`}
        </span>
      );
    },
  },
  {
    label: 'EUR/USD Spread',
    icon: <TrendingUp className="h-3.5 w-3.5 text-blue-500" />,
    getter: (b) => <span className="text-sm text-gray-900 dark:text-white">{b.spreads}</span>,
  },
  {
    label: 'Leverage',
    icon: <TrendingUp className="h-3.5 w-3.5 text-orange-500" />,
    getter: (b) => <span className="text-sm text-gray-900 dark:text-white">{b.leverage}</span>,
  },
  {
    label: 'Platforms',
    icon: <Monitor className="h-3.5 w-3.5 text-purple-500" />,
    getter: (b) => (
      <div className="flex flex-wrap gap-1">
        {b.platforms.slice(0, 3).map(p => (
          <span key={p} className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400">{p}</span>
        ))}
      </div>
    ),
  },
  {
    label: 'Regulation',
    icon: <Shield className="h-3.5 w-3.5 text-blue-600" />,
    getter: (b) => (
      <div className="flex flex-wrap gap-1">
        {b.regulations.slice(0, 3).map(r => (
          <span key={r} className="text-[10px] font-medium px-1.5 py-0.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">{r}</span>
        ))}
        {b.regulations.length > 3 && (
          <span className="text-[10px] text-gray-400">+{b.regulations.length - 3}</span>
        )}
      </div>
    ),
  },
];

export default function QuickCompareWidget() {
  const [broker1Slug, setBroker1Slug] = useState('pepperstone');
  const [broker2Slug, setBroker2Slug] = useState('ic-markets');
  const [openDropdown, setOpenDropdown] = useState<1 | 2 | null>(null);

  const broker1 = brokers.find(b => b.slug === broker1Slug);
  const broker2 = brokers.find(b => b.slug === broker2Slug);

  if (!broker1 || !broker2) return null;

  return (
    <section className="py-8 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-medium mb-3">
            <ArrowLeftRight className="h-3.5 w-3.5" />
            Quick Compare
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Compare Any Two Brokers
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Pick two brokers and see how they stack up side by side.
          </p>
        </div>

        {/* Broker Selectors */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          {[{ value: broker1Slug, set: setBroker1Slug, num: 1 as const }, { value: broker2Slug, set: setBroker2Slug, num: 2 as const }].map(({ value, set, num }) => {
            const selected = brokers.find(b => b.slug === value)!;
            const isOpen = openDropdown === num;
            return (
              <div key={num} className="relative w-full sm:w-72">
                <button
                  onClick={() => setOpenDropdown(isOpen ? null : num)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-400 transition-colors"
                >
                  <div className="h-8 w-16 relative flex-shrink-0">
                    <Image src={selected.logo} alt={selected.name} fill className="object-contain" unoptimized />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{selected.name}</div>
                    <div className="text-[10px] text-gray-500">{selected.bestFor}</div>
                  </div>
                  <ChevronDown className={cn('h-4 w-4 text-gray-400 transition-transform', isOpen && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute top-full left-0 right-0 z-30 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-64 overflow-y-auto"
                    >
                      {brokers.map(b => (
                        <button
                          key={b.slug}
                          onClick={() => { set(b.slug); setOpenDropdown(null); }}
                          className={cn(
                            'w-full flex items-center gap-3 p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left',
                            b.slug === value && 'bg-blue-50 dark:bg-blue-900/20'
                          )}
                        >
                          <div className="h-6 w-12 relative flex-shrink-0">
                            <Image src={b.logo} alt={b.name} fill className="object-contain" unoptimized />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-gray-900 dark:text-white truncate">{b.name}</div>
                            <div className="text-[10px] text-gray-400 truncate">{b.bestFor}</div>
                          </div>
                          <span className={cn(
                            'text-xs font-bold',
                            b.rating >= 9 ? 'text-emerald-600' : b.rating >= 8 ? 'text-blue-600' : 'text-amber-600'
                          )}>{b.rating}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40">
            <ArrowLeftRight className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>

        {/* Comparison Table */}
        <Card className="max-w-4xl mx-auto overflow-hidden shadow-lg">
          <CardContent className="p-0">
            {/* Header */}
            <div className="grid grid-cols-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <div className="px-4 py-3" />
              <div className="px-4 py-3 text-center border-x border-gray-200 dark:border-gray-800">
                <Link href={`/broker/${broker1.slug}`} className="group">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-16 relative mb-1">
                      <Image src={broker1.logo} alt={broker1.name} fill className="object-contain" unoptimized />
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{broker1.name}</span>
                    {broker1.rating >= broker2.rating && (
                      <Badge className="mt-1 bg-emerald-500 text-white text-[9px] px-1.5 py-0">★ Top Pick</Badge>
                    )}
                  </div>
                </Link>
              </div>
              <div className="px-4 py-3 text-center">
                <Link href={`/broker/${broker2.slug}`} className="group">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-16 relative mb-1">
                      <Image src={broker2.logo} alt={broker2.name} fill className="object-contain" unoptimized />
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{broker2.name}</span>
                    {broker2.rating > broker1.rating && (
                      <Badge className="mt-1 bg-emerald-500 text-white text-[9px] px-1.5 py-0">★ Top Pick</Badge>
                    )}
                  </div>
                </Link>
              </div>
            </div>

            {/* Rows */}
            {rows.map((row, idx) => (
              <div
                key={row.label}
                className={cn(
                  'grid grid-cols-3 items-center',
                  idx % 2 === 0 ? 'bg-white dark:bg-gray-950' : 'bg-gray-50/50 dark:bg-gray-900/30'
                )}
              >
                <div className="px-4 py-3 flex items-center gap-1.5">
                  {row.icon}
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{row.label}</span>
                </div>
                <div className="px-4 py-3 text-center border-x border-gray-200/50 dark:border-gray-800/50">
                  {row.getter(broker1)}
                </div>
                <div className="px-4 py-3 text-center">
                  {row.getter(broker2)}
                </div>
              </div>
            ))}

            {/* CTA Row */}
            <div className="grid grid-cols-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
              <div className="px-4 py-3" />
              <div className="px-4 py-3 text-center border-x border-gray-200 dark:border-gray-800">
                <div className="flex flex-col gap-1.5 items-center">
                  <Button size="sm" className="w-full max-w-[140px] bg-blue-600 hover:bg-blue-700 text-white" asChild>
                    <a href={broker1.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored">Visit {broker1.name}</a>
                  </Button>
                  <Link href={`/broker/${broker1.slug}`} className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline">
                    Full Review →
                  </Link>
                </div>
              </div>
              <div className="px-4 py-3 text-center">
                <div className="flex flex-col gap-1.5 items-center">
                  <Button size="sm" className="w-full max-w-[140px] bg-blue-600 hover:bg-blue-700 text-white" asChild>
                    <a href={broker2.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored">Visit {broker2.name}</a>
                  </Button>
                  <Link href={`/broker/${broker2.slug}`} className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline">
                    Full Review →
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/compare">
              Compare More Brokers <ArrowLeftRight className="ml-2 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
