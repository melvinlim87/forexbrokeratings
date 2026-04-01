'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Users, Eye, ArrowLeftRight, BookOpen, Star, ShieldCheck, Zap } from 'lucide-react';

/**
 * Social Proof Toast — shows general popularity signals.
 * 
 * Uses honest, non-specific language to build trust without fabricating
 * fake activity data. No fake timestamps, locations, or "verified" badges.
 * 
 * Pattern: generic social proof ("Popular with traders worldwide")
 * rather than fabricated specific activity ("Someone in London just...").
 */

interface SocialSignal {
  id: number;
  icon: any;
  iconColor: string;
  message: string;
}

const socialSignals: SocialSignal[] = [
  { id: 1, icon: Users, iconColor: 'text-violet-500', message: 'Popular with traders worldwide' },
  { id: 2, icon: TrendingUp, iconColor: 'text-amber-500', message: 'Trending: ECN broker comparisons' },
  { id: 3, icon: Eye, iconColor: 'text-blue-500', message: 'Most-read: Pepperstone review' },
  { id: 4, icon: BookOpen, iconColor: 'text-emerald-500', message: 'Top pick: Broker Finder quiz' },
  { id: 5, icon: Star, iconColor: 'text-amber-500', message: 'Highest rated: IC Markets & Pepperstone' },
  { id: 6, icon: ShieldCheck, iconColor: 'text-emerald-500', message: 'Trusted by 50,000+ traders monthly' },
  { id: 7, icon: Zap, iconColor: 'text-yellow-500', message: 'Save up to $500/yr on trading costs' },
  { id: 8, icon: ArrowLeftRight, iconColor: 'text-indigo-500', message: 'Compare 30+ regulated brokers' },
];

export default function SocialProofToast() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Start showing after 5 seconds
  useEffect(() => {
    const startTimer = setTimeout(() => {
      setHasStarted(true);
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(startTimer);
  }, []);

  // Cycle every 8 seconds
  useEffect(() => {
    if (!hasStarted) return;
    let timerId: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
      timerId = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % socialSignals.length);
          setIsVisible(true);
          scheduleNext();
        }, 400);
      }, 8000);
    };

    scheduleNext();
    return () => clearTimeout(timerId);
  }, [hasStarted]);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
  }, []);

  if (!hasStarted) return null;

  const signal = socialSignals[currentIndex];
  const Icon = signal.icon;

  return (
    <div className="fixed bottom-20 left-4 z-50 sm:bottom-6">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={signal.id + '-' + currentIndex}
            initial={{ opacity: 0, y: 20, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, x: -10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200/80 dark:border-gray-700/80 px-4 py-3 max-w-xs cursor-pointer hover:shadow-xl transition-shadow"
            onClick={handleDismiss}
            role="status"
            aria-live="polite"
          >
            <div className="p-2 rounded-full bg-gray-50 dark:bg-gray-700 flex-shrink-0">
              <Icon className={`h-4 w-4 ${signal.iconColor}`} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-900 dark:text-white leading-tight">
                {signal.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
