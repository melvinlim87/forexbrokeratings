'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Award, ShieldCheck, ArrowRight } from 'lucide-react';

export default function StickyTrustBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // On mobile: show 600-1200px, hide when bottom CTA appears
      // On desktop: show after 600px always
      if (isMobile) {
        setIsVisible(scrollY > 600 && scrollY <= 1200);
      } else {
        setIsVisible(scrollY > 600);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-0 left-0 right-0 z-[60] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm"
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-11">
              {/* Trust stats */}
              <div className="hidden md:flex items-center gap-6">
                <div className="flex items-center gap-1.5 text-xs">
                  <Users className="h-3.5 w-3.5 text-blue-500" />
                  <span className="text-gray-600 dark:text-gray-300">
                    <strong className="text-gray-900 dark:text-white">9M+</strong> visitors served
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <Award className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-gray-600 dark:text-gray-300">
                    <strong className="text-gray-900 dark:text-white">50+</strong> brokers tested
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-gray-600 dark:text-gray-300">
                    <strong className="text-gray-900 dark:text-white">&lt;0.1%</strong> error rate
                  </span>
                </div>
              </div>

              {/* Mobile: just show count */}
              <div className="md:hidden flex items-center gap-1.5 text-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-gray-600 dark:text-gray-300">
                  Trusted by <strong className="text-gray-900 dark:text-white">9M+</strong> traders
                </span>
              </div>

              {/* Methodology link + CTA */}
              <div className="flex items-center gap-3">
                <Link
                  href="/methodology"
                  className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  How We Rate
                  <ArrowRight className="h-3 w-3" />
                </Link>
                <Link
                  href="/#quick-compare"
                  className="hidden sm:flex items-center gap-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-full transition-colors shadow-sm"
                >
                  Find Your Broker
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
