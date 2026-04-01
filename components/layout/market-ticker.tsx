'use client';

import { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ForexPair {
  pair: string;
  price: string;
  change: number;
  changePercent: number;
}

// Simulated live data — in production, connect to a forex API
const generatePairs = (): ForexPair[] => {
  const base: Array<{ pair: string; basePrice: number }> = [
    { pair: 'EUR/USD', basePrice: 1.0842 },
    { pair: 'GBP/USD', basePrice: 1.2695 },
    { pair: 'USD/JPY', basePrice: 150.32 },
    { pair: 'AUD/USD', basePrice: 0.6528 },
    { pair: 'USD/CHF', basePrice: 0.8841 },
    { pair: 'USD/CAD', basePrice: 1.3562 },
    { pair: 'NZD/USD', basePrice: 0.5987 },
    { pair: 'EUR/GBP', basePrice: 0.8541 },
    { pair: 'XAU/USD', basePrice: 2328.50 },
    { pair: 'BTC/USD', basePrice: 68420.00 },
    { pair: 'EUR/JPY', basePrice: 162.95 },
    { pair: 'GBP/JPY', basePrice: 190.78 },
  ];

  return base.map(({ pair, basePrice }) => {
    const change = (Math.random() - 0.48) * (basePrice > 100 ? 0.5 : 0.002);
    const changePercent = (change / basePrice) * 100;
    const decimals = basePrice > 100 ? (pair === 'XAU/USD' ? 2 : pair === 'BTC/USD' ? 0 : 2) : 5;
    return {
      pair,
      price: (basePrice + change).toFixed(decimals),
      change,
      changePercent,
    };
  });
};

export default function MarketTicker() {
  const [pairs, setPairs] = useState<ForexPair[]>(generatePairs);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Check localStorage for dismissal state on mount
  useEffect(() => {
    const dismissed = localStorage.getItem('market-ticker-dismissed');
    if (dismissed) setIsDismissed(true);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('market-ticker-dismissed', '1');
  };

  if (isDismissed) return null;

  // Update prices every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPairs(generatePairs());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (!scrollRef.current || isPaused) return;
    const el = scrollRef.current;
    let pos = el.scrollLeft;
    const maxScroll = el.scrollWidth - el.clientWidth;

    const scroll = () => {
      if (!isPaused) {
        pos += 0.5;
        if (pos >= maxScroll) pos = 0;
        el.scrollLeft = pos;
      }
    };
    const raf = setInterval(scroll, 30);
    return () => clearInterval(raf);
  }, [isPaused]);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollLeft += dir === 'left' ? -200 : 200;
  };

  return (
    <div
      className="bg-gray-950 dark:bg-black border-b border-gray-800 relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Scroll arrows */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-r from-gray-950 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-4 w-4 text-gray-400" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-l from-gray-950 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </button>

      <div
        ref={scrollRef}
        className="flex items-center gap-4 px-4 py-1.5 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Label */}
        <div className="flex-shrink-0 flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Live
        </div>

        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-0.5 text-gray-500 hover:text-gray-300 transition-colors"
          aria-label="Dismiss market ticker"
        >
          <X className="h-3 w-3" />
        </button>

        {pairs.map((p) => {
          const isUp = p.change >= 0;
          return (
            <div
              key={p.pair}
              className="flex-shrink-0 flex items-center gap-2 px-2.5 py-0.5 rounded hover:bg-gray-800/50 transition-colors cursor-default"
              title={`${p.pair}: ${p.price} (${isUp ? '+' : ''}${p.changePercent.toFixed(2)}%)`}
            >
              <span className="text-[11px] font-medium text-gray-300">{p.pair}</span>
              <span className="text-[11px] font-mono font-semibold text-white">{p.price}</span>
              <span
                className={`flex items-center gap-0.5 text-[10px] font-medium ${
                  isUp ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {isUp ? (
                  <TrendingUp className="h-2.5 w-2.5" />
                ) : (
                  <TrendingDown className="h-2.5 w-2.5" />
                )}
                {isUp ? '+' : ''}{p.changePercent.toFixed(2)}%
              </span>
            </div>
          );
        })}

        {/* Repeat for seamless scroll */}
        {pairs.slice(0, 6).map((p) => {
          const isUp = p.change >= 0;
          return (
            <div
              key={`${p.pair}-dup`}
              className="flex-shrink-0 flex items-center gap-2 px-2.5 py-0.5 rounded cursor-default"
            >
              <span className="text-[11px] font-medium text-gray-300">{p.pair}</span>
              <span className="text-[11px] font-mono font-semibold text-white">{p.price}</span>
              <span
                className={`flex items-center gap-0.5 text-[10px] font-medium ${
                  isUp ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {isUp ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                {isUp ? '+' : ''}{p.changePercent.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
