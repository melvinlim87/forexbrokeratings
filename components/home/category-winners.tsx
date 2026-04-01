'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Trophy, TrendingDown, GraduationCap, Monitor, Shield, Globe, ChevronRight, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { brokers } from '@/lib/brokers';

interface CategoryPick {
  icon: any;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  brokerSlug: string;
  reason: string;
}

function getCategories(): CategoryPick[] {
  const all = [...brokers];

  const lowestCost = all.filter(b => b.avgSpreadEurUsd != null).sort((a, b) =>
    ((a.avgSpreadEurUsd ?? 0) + (a.commissionRt ?? 0) / 10) - ((b.avgSpreadEurUsd ?? 0) + (b.commissionRt ?? 0) / 10)
  )[0];

  const bestBeginner = all
    .filter(b => b.minDeposit <= 50 && b.scores)
    .sort((a, b) => (b.scores?.customerService ?? 0) - (a.scores?.customerService ?? 0))[0];

  const bestUS = all.find(b => (b.regulations ?? []).some((r: string) => r.includes('CFTC') || r.includes('NFA')));

  const bestPlatforms = all.filter(b => b.platforms?.length).sort((a, b) => b.platforms.length - a.platforms.length)[0];

  const bestRegulated = all.filter(b => b.regulations?.length && b.scores).sort((a, b) => {
    const tier1 = (r: typeof a) => (r.regulations ?? []).filter(reg =>
      ['FCA', 'ASIC', 'CFTC/NFA', 'CySEC', 'MAS', 'IIROC'].includes(reg)
    ).length;
    return tier1(b) - tier1(a) || (b.scores?.security ?? 0) - (a.scores?.security ?? 0);
  })[0];

  const bestOverall = all.sort((a, b) => b.rating - a.rating)[0];

  return [
    {
      icon: Trophy,
      label: 'Best Overall',
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      borderColor: 'border-amber-200 dark:border-amber-800',
      brokerSlug: bestOverall?.slug ?? 'pepperstone',
      reason: `${bestOverall?.rating}/10 rating`,
    },
    {
      icon: TrendingDown,
      label: 'Lowest Costs',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      brokerSlug: lowestCost?.slug ?? 'fusion-markets',
      reason: lowestCost ? `${lowestCost.avgSpreadEurUsd} pips EUR/USD` : 'Lowest spreads',
    },
    {
      icon: GraduationCap,
      label: 'Best for Beginners',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      brokerSlug: bestBeginner?.slug ?? 'xm',
      reason: bestBeginner ? `$${bestBeginner.minDeposit} min deposit` : 'Low barrier to entry',
    },
    {
      icon: Globe,
      label: 'Best for US Traders',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      brokerSlug: bestUS?.slug ?? 'forex-com',
      reason: 'CFTC/NFA registered',
    },
    {
      icon: Monitor,
      label: 'Best Platforms',
      color: 'text-violet-600 dark:text-violet-400',
      bgColor: 'bg-violet-50 dark:bg-violet-900/20',
      borderColor: 'border-violet-200 dark:border-violet-800',
      brokerSlug: bestPlatforms?.slug ?? 'pepperstone',
      reason: bestPlatforms ? `${bestPlatforms.platforms.length} platforms` : 'Most platform options',
    },
    {
      icon: Shield,
      label: 'Most Regulated',
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      borderColor: 'border-indigo-200 dark:border-indigo-800',
      brokerSlug: bestRegulated?.slug ?? 'ig',
      reason: bestRegulated ? `${bestRegulated.regulations.length} regulators` : 'Top-tier regulation',
    },
  ];
}

export default function CategoryWinners() {
  const categories = getCategories();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section className="py-12 md:py-16 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                2026 Category Winners
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Top pick in each category — based on 200+ data points
              </p>
            </div>
          </div>
          <Link
            href="/brokers"
            className="hidden sm:inline-flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            View all brokers
            <ChevronRight className="h-3 w-3 ml-0.5" />
          </Link>
        </div>

        {/* Category Cards — horizontal scroll on mobile, grid on desktop */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:overflow-visible sm:pb-0">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            const broker = brokers.find(b => b.slug === cat.brokerSlug);
            if (!broker) return null;

            return (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="flex-shrink-0 w-48 sm:w-auto"
              >
                <Link
                  href={`/broker/${broker.slug}`}
                  className={cn(
                    'block rounded-xl border p-3 transition-all duration-200 h-full',
                    cat.bgColor,
                    cat.borderColor,
                    hoveredIdx === idx
                      ? 'shadow-md scale-[1.02] ring-1 ring-offset-1'
                      : 'hover:shadow-sm'
                  )}
                >
                  {/* Icon + Label */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <Icon className={cn('h-3.5 w-3.5', cat.color)} />
                    <span className={cn('text-[10px] font-bold uppercase tracking-wider', cat.color)}>
                      {cat.label}
                    </span>
                  </div>

                  {/* Broker Logo + Name */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="h-6 w-12 relative flex-shrink-0">
                      <Image
                        src={broker.logo}
                        alt={broker.name}
                        fill
                        className="object-contain"
                        loading="lazy"
                        unoptimized
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                      {broker.name}
                    </span>
                  </div>

                  {/* Reason */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                      {cat.reason}
                    </span>
                    <Badge
                      variant="secondary"
                      className={cn(
                        'text-[9px] px-1 py-0 h-4 font-bold flex-shrink-0 ml-1',
                        broker.rating >= 9 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                        broker.rating >= 8 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                        'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                      )}
                    >
                      {broker.rating}
                    </Badge>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile link */}
        <div className="sm:hidden text-center mt-4">
          <Link
            href="/brokers"
            className="inline-flex items-center text-xs font-medium text-blue-600 dark:text-blue-400"
          >
            View all brokers
            <ChevronRight className="h-3 w-3 ml-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
