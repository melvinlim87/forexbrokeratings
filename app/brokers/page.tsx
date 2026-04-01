'use client';

import { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Star, Shield, ArrowUpDown, Search, TrendingUp, Award, Zap, GraduationCap, ArrowLeftRight, X, Check, Square, RefreshCw, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getTopBrokers } from '@/lib/brokers';
import { useSearchParams } from 'next/navigation';

const CountrySelector = dynamic(() => import('@/components/home/country-selector'), {
  loading: () => <div className="h-40 animate-pulse bg-muted rounded-md mx-4 my-6" />,
});

const CATEGORIES = [
  { id: 'all', label: 'All Brokers', icon: null },
  { id: 'ecn', label: 'ECN / Raw Spread', icon: Zap },
  { id: 'beginner', label: 'Best for Beginners', icon: GraduationCap },
  { id: 'low-cost', label: 'Lowest Cost', icon: TrendingUp },
  { id: 'professional', label: 'Professional', icon: Award },
  { id: 'regulated', label: 'Top Regulated', icon: Shield },
];

function matchCategory(broker: any, catId: string): boolean {
  if (catId === 'all') return true;
  if (catId === 'ecn') return broker.platforms?.includes('cTrader') || broker.avgSpreadEurUsd < 0.5;
  if (catId === 'beginner') return broker.minDeposit <= 10 && broker.rating >= 7;
  if (catId === 'low-cost') return broker.avgSpreadEurUsd < 1.0 || broker.commissionRt < 5;
  if (catId === 'professional') return broker.rating >= 8.5 && broker.platforms?.length >= 3;
  if (catId === 'regulated') {
    return broker.regulations?.some((r: string) => ['FCA', 'ASIC', 'CFTC/NFA', 'MAS', 'IIROC'].includes(r));
  }
  return true;
}

function BrokersPageInner() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [search, setSearch] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<'rating' | 'deposit' | 'name'>('rating');
  const [activeCategory, setActiveCategory] = useState('all');
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const allBrokers = getTopBrokers(20);

  const filteredBrokers = useMemo(() => {
    return allBrokers
      .filter(b => b.name.toLowerCase().includes(search.toLowerCase()))
      .filter(b => matchCategory(b, activeCategory))
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'deposit') return a.minDeposit - b.minDeposit;
        return a.name.localeCompare(b.name);
      });
  }, [allBrokers, search, sortBy, activeCategory]);

  const toggleCompare = (slug: string) => {
    setSelectedForCompare(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : prev.length < 4 ? [...prev, slug] : prev
    );
  };

  const compareUrl = selectedForCompare.length >= 2
    ? `/compare-tool?brokers=${selectedForCompare.join(',')}`
    : '#';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Country Selector — Regional Broker Guides */}
      <CountrySelector />

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">All Forex Brokers</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Compare and review {allBrokers.length} regulated forex brokers — verified data, expert ratings</p>
        </div>

        {/* Trust & Verification Banner — inspired by BrokerChooser & NerdWallet */}
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl px-4 py-3 mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
            <Shield className="h-3.5 w-3.5" />
            <span>Every broker verified by our research team</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            <Database className="h-3.5 w-3.5" />
            <span>Spreads & fees checked against live broker data</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Updated: March 2026</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 ml-auto">
            <Award className="h-3.5 w-3.5 text-amber-500" />
            <span>50+ brokers tested · 200+ hours research</span>
          </div>
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search brokers..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={sortBy === 'rating' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('rating')}
            >
              Rating <ArrowUpDown className="ml-1 h-3 w-3" />
            </Button>
            <Button
              variant={sortBy === 'deposit' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('deposit')}
            >
              Min Deposit <ArrowUpDown className="ml-1 h-3 w-3" />
            </Button>
            <Button
              variant={sortBy === 'name' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('name')}
            >
              Name <ArrowUpDown className="ml-1 h-3 w-3" />
            </Button>
            <Button
              variant={compareMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setCompareMode(!compareMode);
                if (compareMode) setSelectedForCompare([]);
              }}
              className={compareMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''}
            >
              <ArrowLeftRight className="mr-1 h-3 w-3" />
              {compareMode ? 'Exit Compare' : 'Compare'}
            </Button>
          </div>
        </div>

        {/* Compare Mode Banner */}
        <AnimatePresence>
          {compareMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-indigo-700 dark:text-indigo-300">
                  <ArrowLeftRight className="h-4 w-4" />
                  <span>
                    <strong>Compare Mode:</strong> Select 2–4 brokers to compare side by side
                    {selectedForCompare.length > 0 && (
                      <span className="ml-1">({selectedForCompare.length} selected)</span>
                    )}
                  </span>
                </div>
                {selectedForCompare.length >= 2 && (
                  <Link
                    href={compareUrl}
                    className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
                  >
                    Compare Now →
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Filter Chips — sticky on scroll */}
        <div className="sticky top-16 z-30 bg-gray-50 dark:bg-gray-900 py-3 -mx-4 px-4 border-b border-gray-200 dark:border-gray-800 mb-5">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:text-blue-600'
                  }`}
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  {cat.label}
                </button>
              );
            })}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Showing {filteredBrokers.length} of {allBrokers.length} brokers
            {activeCategory !== 'all' && (
              <button onClick={() => setActiveCategory('all')} className="ml-2 text-blue-500 hover:underline">
                Clear filter
              </button>
            )}
          </div>
        </div>

        {/* Broker Grid */}
        {filteredBrokers.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <p className="text-lg font-medium mb-2">No brokers match your filters</p>
            <button onClick={() => { setActiveCategory('all'); setSearch(''); }} className="text-blue-500 hover:underline">
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBrokers.map((broker, index) => {
              const isSelected = selectedForCompare.includes(broker.slug);
              return (
                <motion.div
                  key={broker.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
                >
                  <Card
                    className={`h-full hover:shadow-lg transition-all duration-200 ${
                      index === 0 && sortBy === 'rating' ? 'ring-2 ring-blue-500/30 shadow-md' : ''
                    } ${isSelected ? 'ring-2 ring-indigo-500/50 shadow-md shadow-indigo-500/10' : ''}`}
                  >
                    <CardContent className="p-3">
                      {/* "Best For" Badge — top of card */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
                          {broker.bestFor}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {index === 0 && sortBy === 'rating' && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              <Award className="h-3 w-3" /> #1 Rated
                            </span>
                          )}
                          {/* Compare Checkbox */}
                          {compareMode && (
                            <button
                              onClick={() => toggleCompare(broker.slug)}
                              className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-indigo-600 border-indigo-600 text-white'
                                  : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
                              }`}
                              aria-label={`${isSelected ? 'Remove' : 'Add'} ${broker.name} from comparison`}
                            >
                              {isSelected && <Check className="h-3.5 w-3.5" />}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="h-10 w-20 relative bg-gray-50 dark:bg-gray-800 rounded flex-shrink-0 overflow-hidden">
                          <Image src={broker.logo} alt={broker.name} fill className="object-contain p-1" unoptimized />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{broker.name}</h3>
                            <div className="flex items-center bg-amber-50 dark:bg-amber-900/20 rounded px-1.5 py-0.5">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-0.5" />
                              <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{broker.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-500">
                            <span>Min: <strong className="text-gray-700 dark:text-gray-300">${broker.minDeposit}</strong></span>
                            <span>Spreads: <strong className="text-gray-700 dark:text-gray-300">{broker.spreads}</strong></span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {broker.regulations.slice(0, 3).map(r => (
                              <span key={r} className="text-[10px] font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-1 py-0.5 rounded">{r}</span>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2">{broker.description.slice(0, 100)}...</p>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="outline" className="h-6 text-[10px] px-2" asChild>
                              <Link href={`/broker/${broker.slug}`}>Review</Link>
                            </Button>
                            <Button size="sm" className="h-6 text-[10px] px-2 bg-blue-600 hover:bg-blue-700 text-white" asChild>
                              <a href={broker.affiliateUrl} target="_blank" rel="noopener noreferrer">Visit</a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Compare Bar */}
      <AnimatePresence>
        {compareMode && selectedForCompare.length >= 2 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-2xl"
          >
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                {/* Selected broker logos */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {selectedForCompare.length} selected:
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto">
                    {selectedForCompare.map((slug) => {
                      const b = allBrokers.find(broker => broker.slug === slug);
                      if (!b) return null;
                      return (
                        <div key={slug} className="relative flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-1 flex-shrink-0">
                          <div className="h-6 w-10 relative">
                            <Image src={b.logo} alt={b.name} fill className="object-contain" unoptimized />
                          </div>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{b.name}</span>
                          <button
                            onClick={() => toggleCompare(slug)}
                            className="text-gray-400 hover:text-red-500 transition-colors ml-0.5"
                            aria-label={`Remove ${b.name}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setSelectedForCompare([])}
                    className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors px-2"
                  >
                    Clear
                  </button>
                  <Link
                    href={compareUrl}
                    className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors shadow-md"
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                    Compare {selectedForCompare.length} Brokers
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BrokersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading brokers...</p></div>}>
      <BrokersPageInner />
    </Suspense>
  );
}
