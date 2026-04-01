'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, Star, ExternalLink, Zap, MessageSquare, ThumbsUp, BadgeCheck, Award, Trophy, Flame, GitCompareArrows, X, CheckSquare, Square, ChevronDown, ChevronUp, BarChart2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import ScoreRing from '@/components/ui/score-ring';
import { brokers, getTopBrokers } from '@/lib/brokers';

// Category awards for top 3 brokers — NerdWallet/BrokerChooser style
const CATEGORY_AWARDS = [
  { icon: Trophy, label: 'Best Overall', color: 'bg-amber-500 text-white', darkColor: 'bg-amber-600' },
  { icon: Flame, label: 'Most Popular', color: 'bg-orange-500 text-white', darkColor: 'bg-orange-600' },
  { icon: Award, label: 'Editor\'s Pick', color: 'bg-blue-500 text-white', darkColor: 'bg-blue-600' },
];

/** Inline score breakdown bars — inspired by BrokerChooser's detailed rating breakdown */
function ScoreBreakdown({ scores, expanded }: { scores: any; expanded: boolean }) {
  if (!scores) return null;
  const categories = [
    { key: 'fees', label: 'Fees', icon: '💰' },
    { key: 'security', label: 'Security', icon: '🛡️' },
    { key: 'platforms', label: 'Platforms', icon: '📊' },
    { key: 'tradingInstruments', label: 'Instruments', icon: '📈' },
    { key: 'deposit', label: 'Deposit', icon: '💳' },
    { key: 'customerService', label: 'Support', icon: '🎧' },
  ];
  const getColor = (val: number) => {
    if (val >= 9) return 'bg-emerald-500';
    if (val >= 8) return 'bg-blue-500';
    if (val >= 7) return 'bg-amber-500';
    if (val >= 6) return 'bg-orange-500';
    return 'bg-red-500';
  };
  return (
    <AnimatePresence>
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-x-4 gap-y-1.5">
            {categories.map(cat => {
              const val = scores[cat.key] ?? 7;
              return (
                <div key={cat.key} className="flex items-center gap-1.5">
                  <span className="text-xs w-16 text-gray-500 dark:text-gray-400 truncate">{cat.label}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${getColor(val)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${val * 10}%` }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-5 text-right">{val}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SpreadBar({ spreads }: { spreads: string }) {
  // Parse spread value for visual bar
  const match = spreads.match(/([\d.]+)/);
  const value = match ? parseFloat(match[1]) : 1.5;
  const maxSpread = 3.0;
  const pct = Math.min(100, Math.max(5, ((maxSpread - value) / maxSpread) * 100));
  const color = value < 1 ? 'bg-emerald-500' : value < 1.5 ? 'bg-blue-500' : 'bg-amber-500';
  
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-1.5 w-16 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400">{spreads}</span>
    </div>
  );
}

type FilterKey = 'all' | 'lowest-cost' | 'beginners' | 'regulated' | 'platforms';

const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All Top Brokers' },
  { key: 'lowest-cost', label: '💰 Lowest Cost' },
  { key: 'beginners', label: '🎓 Beginners' },
  { key: 'regulated', label: '🛡️ Most Regulated' },
  { key: 'platforms', label: '📊 Best Platforms' },
];

function filterBrokers(allBrokers: typeof brokers, filter: FilterKey) {
  if (filter === 'all') return allBrokers;
  const sorted = [...allBrokers];
  switch (filter) {
    case 'lowest-cost':
      return sorted.filter(b => b.avgSpreadEurUsd != null).sort((a, b) =>
        ((a.avgSpreadEurUsd ?? 0) + (a.commissionRt ?? 0) / 10) - ((b.avgSpreadEurUsd ?? 0) + (b.commissionRt ?? 0) / 10)
      ).slice(0, 6);
    case 'beginners':
      return sorted
        .filter(b => b.minDeposit <= 100 && b.scores)
        .sort((a, b) => (b.scores?.customerService ?? 0) - (a.scores?.customerService ?? 0))
        .slice(0, 6);
    case 'regulated':
      return sorted.filter(b => b.regulations?.length && b.scores).sort((a, b) => {
        const tier1 = (r: typeof a) => (r.regulations ?? []).filter(reg =>
          ['FCA', 'ASIC', 'CFTC/NFA', 'CySEC', 'MAS', 'IIROC'].includes(reg)
        ).length;
        return tier1(b) - tier1(a) || (b.scores?.security ?? 0) - (a.scores?.security ?? 0);
      }).slice(0, 6);
    case 'platforms':
      return sorted.filter(b => b.platforms?.length).sort((a, b) => b.platforms.length - a.platforms.length).slice(0, 6);
    default:
      return allBrokers;
  }
}

type SortKey = 'default' | 'rating' | 'spread' | 'minDeposit';
type SortDir = 'asc' | 'desc';

function parseSpreadNum(spreads: string): number {
  const match = spreads.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : 999;
}

export default function FeaturedBrokers() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [selectedForCompare, setSelectedForCompare] = useState<number[]>([]);
  const [expandedScores, setExpandedScores] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [sortKey, setSortKey] = useState<SortKey>('default');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const allTopBrokers = getTopBrokers(6);
  const filteredBrokers = activeFilter === 'all' ? allTopBrokers : filterBrokers(getTopBrokers(50), activeFilter);

  // Sort handler — clicking same header toggles direction, new header defaults to desc (best first)
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(prev => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'minDeposit' ? 'asc' : 'desc'); // lower deposit = better
    }
  };

  const topBrokers = (() => {
    if (sortKey === 'default') return filteredBrokers;
    const sorted = [...filteredBrokers];
    sorted.sort((a, b) => {
      let diff = 0;
      switch (sortKey) {
        case 'rating':
          diff = a.rating - b.rating;
          break;
        case 'spread':
          diff = parseSpreadNum(a.spreads) - parseSpreadNum(b.spreads);
          break;
        case 'minDeposit':
          diff = a.minDeposit - b.minDeposit;
          break;
      }
      return sortDir === 'desc' ? -diff : diff;
    });
    return sorted;
  })();

  const toggleCompare = (brokerId: number) => {
    setSelectedForCompare(prev => {
      if (prev.includes(brokerId)) {
        return prev.filter(id => id !== brokerId);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), brokerId]; // Keep max 3, remove oldest
      }
      return [...prev, brokerId];
    });
  };

  const compareSlugs = selectedForCompare
    .map(id => topBrokers.find(b => b.id === id)?.slug)
    .filter(Boolean)
    .join('/vs/');

  return (
    <section className="py-12 md:py-16 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex flex-col md:flex-row md:items-end justify-between mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Top 10 Forex Brokers</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
              Comprehensive ranking based on regulation, spreads, platforms, and overall trading experience.
            </p>
          </div>
          <Link href="/brokers" className="mt-4 md:mt-0 inline-flex items-center text-blue-600 dark:text-blue-500 font-medium hover:text-blue-800 dark:hover:text-blue-400">
            View all brokers <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </motion.div>

        {/* Quick Filter Bar — NerdWallet/forexbrokers.com inspired category filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {FILTER_OPTIONS.map(opt => (
            <button
              key={opt.key}
              onClick={() => setActiveFilter(opt.key)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border',
                activeFilter === opt.key
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Sort Controls — click headers to sort broker list */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
          <span className="text-gray-500 dark:text-gray-400 font-medium mr-1">Sort by:</span>
          {([
            { key: 'rating' as SortKey, label: 'Rating', icon: '⭐' },
            { key: 'spread' as SortKey, label: 'Spread', icon: '📊' },
            { key: 'minDeposit' as SortKey, label: 'Min Deposit', icon: '💰' },
          ]).map(({ key, label, icon }) => {
            const active = sortKey === key;
            return (
              <button
                key={key}
                onClick={() => handleSort(key)}
                className={cn(
                  'flex items-center gap-1 px-3 py-1.5 rounded-full font-medium transition-all duration-200 border',
                  active
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400'
                )}
              >
                <span>{icon}</span>
                {label}
                {active && (
                  <span className="ml-0.5">{sortDir === 'desc' ? '↓' : '↑'}</span>
                )}
              </button>
            );
          })}
          {sortKey !== 'default' && (
            <button
              onClick={() => { setSortKey('default'); setSortDir('desc'); }}
              className="px-2 py-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* Compare Bar — appears when brokers are selected */}
        <AnimatePresence>
          {selectedForCompare.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="bg-blue-600 dark:bg-blue-700 rounded-xl p-3 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-white/20 rounded-lg">
                    <GitCompareArrows className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {selectedForCompare.length} brokers selected for comparison
                    </p>
                    <p className="text-xs text-blue-200">
                      {selectedForCompare.map(id => topBrokers.find(b => b.id === id)?.name).join(' vs ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20 text-xs h-8"
                    onClick={() => setSelectedForCompare([])}
                  >
                    <X className="h-3 w-3 mr-1" /> Clear
                  </Button>
                  <Button
                    size="sm"
                    className="bg-white text-blue-700 hover:bg-blue-50 text-xs h-8 font-semibold"
                    asChild
                  >
                    <Link href={`/compare/${compareSlugs}`}>
                      Compare Now <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topBrokers.map((broker, index) => (
            <motion.div
              key={broker.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              onMouseEnter={() => setHoveredCard(broker.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card className={cn(
                "h-full transition-all duration-300 overflow-hidden relative",
                "bg-white dark:bg-gray-900",
                selectedForCompare.includes(broker.id) 
                  ? "ring-2 ring-blue-500 border-blue-500 dark:border-blue-400" 
                  : "",
                index < 3 && !selectedForCompare.includes(broker.id) ? "border-2" : "border border-gray-200 dark:border-gray-800",
                index === 0 && !selectedForCompare.includes(broker.id) ? "border-amber-300 dark:border-amber-700" : "",
                index === 1 && !selectedForCompare.includes(broker.id) ? "border-orange-300 dark:border-orange-700" : "",
                index === 2 && !selectedForCompare.includes(broker.id) ? "border-blue-300 dark:border-blue-700" : "",
                "hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700",
              )}>
                {/* Compare checkbox — top left */}
                <button
                  onClick={() => toggleCompare(broker.id)}
                  className={cn(
                    "absolute top-2 left-2 z-20 p-1 rounded-md transition-all",
                    selectedForCompare.includes(broker.id)
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-white/80 dark:bg-gray-800/80 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  )}
                  title={selectedForCompare.includes(broker.id) ? "Remove from comparison" : "Add to comparison"}
                >
                  {selectedForCompare.includes(broker.id) ? (
                    <CheckSquare className="h-4 w-4" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </button>

                {/* Award Badge for top 3 */}
                {index < 3 && (
                  <div className="absolute top-0 right-0 z-10">
                    <Badge className={cn("rounded-bl-lg rounded-tr-lg px-2 py-1 text-[10px] font-bold gap-1", CATEGORY_AWARDS[index].color)}>
                      {(() => { const Icon = CATEGORY_AWARDS[index].icon; return <Icon className="h-3 w-3" />; })()}
                      {CATEGORY_AWARDS[index].label}
                    </Badge>
                  </div>
                )}
                <CardContent className="p-4 sm:p-3">
                  <div className="flex items-start gap-3">
                    {/* Rank */}
                    <div className="flex-shrink-0 w-8">
                      <span className={cn(
                        "text-xl font-bold",
                        index === 0 ? "text-amber-500" : index === 1 ? "text-orange-400" : index === 2 ? "text-blue-400" : "text-gray-300 dark:text-gray-600"
                      )}>#{index + 1}</span>
                    </div>
                    
                    {/* Logo */}
                    <div className="h-10 w-20 relative bg-gray-50 dark:bg-gray-800 rounded flex-shrink-0 overflow-hidden">
                      <Image
                        src={broker.logo}
                        alt={broker.name}
                        fill
                        className="object-contain p-1"
                        loading="lazy"
                        unoptimized
                      />
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">{broker.name}</h3>
                        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                          <ScoreRing score={broker.rating} size={40} strokeWidth={3} />
                          <Badge variant="secondary" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] px-1.5 py-0">
                            <ShieldCheck className="h-2.5 w-2.5 mr-0.5" />
                            Regulated
                          </Badge>
                          {broker.userReviewsData?.trustpilot && (
                            <a href={broker.userReviewsData.trustpilot.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-0.5 bg-[#00b67a]/10 text-[#00b67a] rounded px-1.5 py-0.5 text-[10px] font-medium hover:bg-[#00b67a]/20 transition-colors">
                              <Star className="h-2.5 w-2.5 fill-current" />
                              {broker.userReviewsData.trustpilot.rating}/5
                            </a>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">{broker.bestFor}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{broker.description.slice(0, 120)}...</p>
                      
                      {/* Quick Stats */}
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-0.5">
                          <Zap className="h-2.5 w-2.5 text-emerald-500" />
                          Min: <strong className="text-gray-700 dark:text-gray-300">${broker.minDeposit}</strong>
                        </span>
                        <SpreadBar spreads={broker.spreads} />
                        <span>{broker.platforms.slice(0, 2).join(', ')}</span>
                      </div>
                      
                      {/* Actions — Visit Broker is dominant CTA */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-3">
                        {/* Primary CTA — large, prominent */}
                        <Button size="default" className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2 shadow-md shadow-blue-500/20 w-full sm:w-auto" asChild>
                          <a href={broker.affiliateUrl} target="_blank" rel="noopener noreferrer">
                            {index === 0 && <span className="text-xs bg-white/20 rounded px-1.5 py-0.5">⭐ #1 Rated</span>}
                            Visit Broker <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                        {/* Secondary actions — compact */}
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className="h-9 text-xs px-3" asChild>
                            <Link href={`/broker/${broker.slug}`}>Full Review</Link>
                          </Button>
                          {/* More actions dropdown */}
                          <div className="relative">
                            <button
                              onClick={() => setExpandedScores(expandedScores === broker.id ? null : broker.id)}
                              className={cn(
                                "h-9 px-3 rounded-md text-xs font-medium border transition-all flex items-center gap-1",
                                expandedScores === broker.id
                                  ? "bg-violet-50 dark:bg-violet-900/20 text-violet-600 border-violet-200 dark:border-violet-800"
                                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-violet-300 hover:text-violet-600"
                              )}
                            >
                              <BarChart2 className="h-3 w-3" />
                              {expandedScores === broker.id ? 'Hide Scores' : 'Scores'}
                              {expandedScores === broker.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                            </button>
                          </div>
                          <button
                            onClick={() => toggleCompare(broker.id)}
                            className={cn(
                              "h-9 px-3 rounded-md text-xs font-medium border transition-all flex items-center gap-1",
                              selectedForCompare.includes(broker.id)
                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-blue-200 dark:border-blue-800"
                                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:text-blue-600"
                            )}
                          >
                            <GitCompareArrows className="h-3 w-3" />
                            {selectedForCompare.includes(broker.id) ? 'Added' : 'Compare'}
                          </button>
                        </div>
                      </div>
                      {/* Trust micro-copy near CTA — top 3 only */}
                      {index < 3 && (
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[10px] text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-0.5">
                            <ShieldCheck className="h-3 w-3 text-green-500" />
                            {broker.regulations?.[0] ?? 'Regulated'}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Zap className="h-3 w-3 text-emerald-500" />
                            {broker.spreads}
                          </span>
                          {broker.userReviewsData?.trustpilot && (
                            <span className="flex items-center gap-0.5">
                              <Star className="h-3 w-3 text-[#00b67a] fill-current" />
                              {broker.userReviewsData.trustpilot.rating}/5 Trustpilot
                            </span>
                          )}
                        </div>
                      )}
                      {/* Score Breakdown — inline expandable */}
                      <ScoreBreakdown scores={broker.scores} expanded={expandedScores === broker.id} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
