'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useEffect as useMountEffect, useRef as useScrollRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Globe, BarChart2, TrendingUp, Award, Shield, Users, Star, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import NetworkDiagram from '../network/NetworkDiagram';
import { brokers } from '@/lib/brokers';

export default function TopHero() {
  const containerRef = useScrollRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  const springOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });

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
    <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 min-h-[600px]">
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
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -right-1/4 top-1/4 w-96 h-96 bg-white/20 rounded-full filter blur-3xl"
        />
        
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute -left-1/4 top-3/4 w-96 h-96 bg-gray-400/20 rounded-full filter blur-3xl"
        />
        
        {/* Additional decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-gray-300/20 to-gray-500/20 rounded-full blur-2xl" />
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-gray-200/20 to-gray-400/20 rounded-full blur-2xl" />
        </div>
      </div>

      <motion.div 
        ref={containerRef}
        style={{ y: springY, opacity: springOpacity }}
        className="container mx-auto px-4 pt-16 pb-16 relative z-10"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center space-x-4 mb-8">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1 }}
                className="relative group"
              >
                <div className="relative">
                  {/* Base silver stars */}
                  <div className="relative">
                    <Star
                      className="w-10 h-10 text-gray-300"
                      fill="currentColor"
                      strokeWidth={0}
                      style={{
                        filter: 'drop-shadow(0 0 2px rgba(156, 163, 175, 0.3))'
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Star
                        className="w-6 h-6 text-gray-400"
                        fill="currentColor"
                        strokeWidth={0}
                        style={{
                          filter: 'drop-shadow(0 0 2px rgba(156, 163, 175, 0.3))'
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Gold overlay with left-to-right animation */}
                  <motion.div
                    className="absolute inset-0"
                    initial={{ clipPath: 'inset(0 100% 0 0)' }}
                    animate={{
                      clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)']
                    }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.2,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                  >
                    <Star
                      className="w-10 h-10 text-amber-400"
                      fill="currentColor"
                      strokeWidth={0}
                      style={{
                        filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.5))'
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Star
                        className="w-6 h-6 text-amber-300"
                        fill="currentColor"
                        strokeWidth={0}
                        style={{
                          filter: 'drop-shadow(0 0 3px rgba(251, 191, 36, 0.4))'
                        }}
                      />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Forex Broker Ratings
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 mb-6 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            The Aggregated Forex Broker Ratings Across All Rating Platforms
          </motion.p>

          {/* Freshness & Trust Badges — inspired by BrokerChooser & ForexBrokers.com */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span className="inline-flex items-center gap-1.5 bg-green-50/80 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium px-3 py-1.5 rounded-full border border-green-200/60 dark:border-green-800/50 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Updated March 2026
            </span>
            <span className="inline-flex items-center gap-1.5 bg-blue-50/80 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-200/60 dark:border-blue-800/50 backdrop-blur-sm">
              <Users className="h-3 w-3" />
              9M+ Traders Served
            </span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-50/80 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium px-3 py-1.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/50 backdrop-blur-sm">
              <Shield className="h-3 w-3" />
              {'<0.1% Error Rate'}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-amber-50/80 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-medium px-3 py-1.5 rounded-full border border-amber-200/60 dark:border-amber-800/50 backdrop-blur-sm">
              <Award className="h-3 w-3" />
              200+ Data Points Per Broker
            </span>
          </motion.div>

          {/* High-impact trust sentence — NerdWallet/Investopedia style */}
          <motion.p
            className="text-sm text-gray-500 dark:text-gray-400 mb-10 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            Trusted by millions of traders worldwide. Read our{' '}
            <Link href="/methodology" className="underline text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              editorial methodology
            </Link>{' '}
            to see how we test and rate brokers.
          </motion.p>

          <motion.div
            className="max-w-2xl mx-auto mb-12"
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
                  className="pl-10 py-6 w-full bg-white/10 backdrop-blur-sm border-white/20 text-gray-800 dark:text-white placeholder:text-gray-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => { if (filteredBrokers.length > 0) setShowDropdown(true); }}
                  autoComplete="off"
                />
                {/* Autocomplete Dropdown */}
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
                <Button
                  size="lg"
                  className="px-8 py-6 text-base bg-blue-600 hover:bg-blue-700"
                >
                  Find Brokers
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <NetworkDiagram />
        </div>
      </motion.div>
    </div>
  );
}