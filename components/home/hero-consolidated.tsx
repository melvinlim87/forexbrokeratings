'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Search, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { brokers } from '@/lib/brokers';

export default function HeroConsolidated() {
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  const springOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });

  // Search autocomplete
  const filteredBrokers = useMemo(() => {
    if (searchTerm.length < 2) return [];
    const term = searchTerm.toLowerCase();
    return brokers
      .filter(b => b.name.toLowerCase().includes(term) || b.bestFor.toLowerCase().includes(term))
      .slice(0, 5);
  }, [searchTerm]);

  useEffect(() => {
    setShowDropdown(filteredBrokers.length > 0);
  }, [filteredBrokers]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 min-h-[480px] md:min-h-[520px]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-1/4 top-1/4 w-96 h-96 bg-white/20 rounded-full filter blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -left-1/4 top-3/4 w-96 h-96 bg-gray-400/20 rounded-full filter blur-3xl"
        />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-gray-300/20 to-gray-500/20 rounded-full blur-2xl" />
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-gray-200/20 to-gray-400/20 rounded-full blur-2xl" />
        </div>
      </div>

      <motion.div
        ref={containerRef}
        style={{ y: springY, opacity: springOpacity }}
        className="container mx-auto px-4 pt-12 pb-10 relative z-10"
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Heading */}
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Find Your Perfect Forex Broker
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-600 mb-8 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Independent ratings from 200+ data points across 50+ brokers
          </motion.p>

          {/* Search bar — single CTA */}
          <motion.div
            className="max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div ref={searchRef} className="relative flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search brokers (e.g. Pepperstone, IC Markets)..."
                  className="pl-10 py-5 w-full bg-white border-gray-200 shadow-sm text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder:text-gray-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => { if (filteredBrokers.length > 0) setShowDropdown(true); }}
                  autoComplete="off"
                />
                {showDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                    {filteredBrokers.map((broker) => (
                      <Link
                        key={broker.id}
                        href={`/broker/${broker.slug}`}
                        onClick={() => { setShowDropdown(false); setSearchTerm(''); }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-400">
                          {broker.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 dark:text-white text-sm truncate">{broker.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{broker.bestFor}</div>
                        </div>
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full flex-shrink-0">
                          {broker.rating}/10
                        </span>
                      </Link>
                    ))}
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400">
                      {filteredBrokers.length} result{filteredBrokers.length !== 1 ? 's' : ''} found
                    </div>
                  </div>
                )}
              </div>
              <Link href="/brokers">
                <Button size="lg" className="px-8 py-5 text-base bg-blue-600 hover:bg-blue-700">
                  Find Brokers
                </Button>
              </Link>
            </div>
            {/* Quiz CTA — below search bar, BrokerChooser-style */}
            <div className="mt-4">
              <a href="#broker-match-quiz">
                <Button variant="outline" size="sm" className="gap-2 border-indigo-300 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-300 dark:hover:bg-indigo-900/20">
                  <Target className="h-4 w-4" />
                  Not sure? Take our 30-second Broker Match Quiz →
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Trust stat — single line */}
          <motion.p
            className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Trusted by 9M+ traders · Updated March 2026 ·{' '}
            <Link href="/methodology" className="underline text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">How we rate</Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
