'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Eye, ArrowLeftRight, Flame, ChevronRight } from 'lucide-react';

/**
 * Trending Brokers Strip — horizontal scroll of trending broker activity.
 * Inspired by forexbrokers.com's "9M+ visitors" and Booking.com's live activity bar.
 * Creates FOMO and social proof through visible activity metrics.
 */

interface TrendingItem {
  id: number;
  label: string;
  metric: string;
  change: string;
  href: string;
}

const trendingItems: TrendingItem[] = [
  { id: 1, label: 'Pepperstone', metric: '2.4K views/hr', change: '+18%', href: '/broker/pepperstone' },
  { id: 2, label: 'IC Markets', metric: '1.9K views/hr', change: '+12%', href: '/broker/ic-markets' },
  { id: 3, label: 'Fusion Markets', metric: '1.6K views/hr', change: '+31%', href: '/broker/fusion-markets' },
  { id: 4, label: 'XM', metric: '1.3K views/hr', change: '+8%', href: '/broker/xm' },
  { id: 5, label: 'Tickmill', metric: '1.1K views/hr', change: '+22%', href: '/broker/tickmill' },
  { id: 6, label: 'FP Markets', metric: '980 views/hr', change: '+15%', href: '/broker/fp-markets' },
  { id: 7, label: 'OANDA', metric: '870 views/hr', change: '+5%', href: '/broker/oanda' },
  { id: 8, label: 'eToro', metric: '820 views/hr', change: '+9%', href: '/broker/etoro' },
];

export default function TrendingStrip() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Delay showing to avoid overwhelming on first load
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-700/50 overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 py-2.5 overflow-x-auto scrollbar-hide">
          {/* Label */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 whitespace-nowrap flex-shrink-0">
            <Flame className="h-3.5 w-3.5 animate-pulse" />
            Trending Now
          </div>
          
          <div className="w-px h-4 bg-slate-600 flex-shrink-0" />

          {/* Horizontal scroll items — no animation, better performance */}
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
            {trendingItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center gap-2 text-xs text-slate-300 hover:text-white transition-colors group flex-shrink-0"
              >
                <span className="font-medium group-hover:text-amber-400 transition-colors">{item.label}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400">{item.metric}</span>
                <span className="text-emerald-400 font-medium text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                  {item.change}
                </span>
              </Link>
            ))}
          </div>

          {/* Right CTA */}
          <div className="ml-auto flex-shrink-0">
            <Link
              href="/rankings"
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Full Rankings
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
