'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Star, ArrowRight, TrendingUp, BarChart2 } from 'lucide-react';
import { brokers } from '@/lib/brokers';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

// Popular searches for quick access
const popularSearches = [
  { label: 'Best for Beginners', href: '/rankings', icon: TrendingUp },
  { label: 'Lowest Spreads', href: '/rankings', icon: BarChart2 },
  { label: 'Compare Brokers', href: '/compare', icon: ArrowRight },
];

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredBrokers = query.length >= 2
    ? brokers.filter(
        b =>
          b.name.toLowerCase().includes(query.toLowerCase()) ||
          b.bestFor.toLowerCase().includes(query.toLowerCase()) ||
          b.regulations.some(r => r.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const totalResults = filteredBrokers.length;

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, totalResults - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      }
    },
    [onClose, totalResults]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Search panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed top-[10vh] left-1/2 -translate-x-1/2 z-[71] w-full max-w-2xl"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mx-4">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search brokers, regulations, features..."
                  className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 outline-none text-base"
                  autoComplete="off"
                />
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 rounded border border-gray-200 dark:border-gray-700">
                  ESC
                </kbd>
                <button
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Results area */}
              <div className="max-h-[60vh] overflow-y-auto">
                {/* No query — show popular searches */}
                {query.length < 2 && (
                  <div className="p-4">
                    <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-3">
                      Quick Links
                    </div>
                    <div className="space-y-1">
                      {popularSearches.map(item => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={onClose}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                            <item.icon className="h-4 w-4" />
                          </div>
                          <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                            {item.label}
                          </span>
                          <ArrowRight className="h-4 w-4 text-gray-300 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      ))}
                    </div>

                    <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-3 mt-5">
                      Popular Brokers
                    </div>
                    <div className="space-y-1">
                      {brokers.slice(0, 4).map(broker => (
                        <Link
                          key={broker.id}
                          href={`/broker/${broker.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                        >
                          <div className="w-10 h-8 relative bg-gray-50 dark:bg-gray-800 rounded flex-shrink-0 overflow-hidden">
                            <Image
                              src={broker.logo}
                              alt={broker.name}
                              fill
                              className="object-contain p-0.5"
                              sizes="40px"
                              unoptimized
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {broker.name}
                            </div>
                            <div className="text-xs text-gray-500 truncate">{broker.bestFor}</div>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {broker.rating}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Search results */}
                {query.length >= 2 && (
                  <div className="p-2">
                    {filteredBrokers.length === 0 ? (
                      <div className="text-center py-8">
                        <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">
                          No brokers found for "{query}"
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Try searching by name, regulation, or feature
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                          {filteredBrokers.length} result{filteredBrokers.length !== 1 ? 's' : ''}
                        </div>
                        {filteredBrokers.slice(0, 8).map((broker, i) => (
                          <Link
                            key={broker.id}
                            href={`/broker/${broker.slug}`}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                              i === selectedIndex
                                ? 'bg-blue-50 dark:bg-blue-900/20'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                          >
                            <div className="w-10 h-8 relative bg-gray-50 dark:bg-gray-800 rounded flex-shrink-0 overflow-hidden">
                              <Image
                                src={broker.logo}
                                alt={broker.name}
                                fill
                                className="object-contain p-0.5"
                                sizes="40px"
                                unoptimized
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {broker.name}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {broker.bestFor} · {broker.regulations.slice(0, 2).join(', ')}
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-medium">
                                {broker.rating}/10
                              </span>
                            </div>
                          </Link>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">↵</kbd>
                    Open
                  </span>
                </div>
                <Link
                  href="/brokers"
                  onClick={onClose}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View all brokers →
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
