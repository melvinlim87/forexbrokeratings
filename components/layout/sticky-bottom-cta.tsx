'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Sticky Bottom CTA Bar — inspired by BrokerChooser & NerdWallet.
 * Appears after scrolling past 1200px (past hero + initial content).
 * Dismissible. Persistent CTA to drive quiz/start engagement.
 */
export default function StickyBottomCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!isDismissed) {
        setIsVisible(window.scrollY > 1200);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-[60] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)]"
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-14 md:h-16">
              {/* Left: Value proposition */}
              <div className="flex items-center gap-3 md:gap-4">
                <div className="hidden sm:flex items-center gap-1.5 text-xs md:text-sm">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span className="text-gray-700 dark:text-gray-200 font-medium">
                    Find your ideal broker in <strong className="text-blue-600 dark:text-blue-400">2 minutes</strong>
                  </span>
                </div>
                <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>Updated March 2026</span>
                </div>
                {/* Mobile: shorter text */}
                <span className="sm:hidden text-sm font-medium text-gray-800 dark:text-gray-200">
                  Find your best broker →
                </span>
              </div>

              {/* Right: CTA + Close */}
              <div className="flex items-center gap-2 md:gap-3">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md text-xs md:text-sm px-3 md:px-5" asChild>
                  <Link href="/#quick-compare">
                    Start Free Quiz
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
                <button
                  onClick={() => setIsDismissed(true)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label="Dismiss"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
