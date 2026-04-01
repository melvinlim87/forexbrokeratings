'use client';

import Link from 'next/link';
import { Star, Shield, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Top Rated Widget
export function TopRatedWidget() {
  const topBrokers = [
    { name: 'Pepperstone', rating: 4.9, slug: 'pepperstone', tag: 'Ultra-low spreads' },
    { name: 'IG', rating: 4.8, slug: 'ig', tag: '17,000+ instruments' },
    { name: 'IronFX', rating: 4.8, slug: 'ironfx', tag: 'Best all-round' },
    { name: 'Saxo Bank', rating: 4.7, slug: 'saxo-bank', tag: 'Premium research' },
    { name: 'XM', rating: 4.7, slug: 'xm', tag: '$5 min deposit' },
  ];

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Top Rated Brokers</h3>
        </div>
        <div className="space-y-2">
          {topBrokers.map((b, i) => (
            <Link key={b.slug} href={`/broker/${b.slug}`} className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition group">
              <span className="text-xs font-bold text-gray-400 w-4">#{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600">{b.name}</div>
                <div className="text-xs text-gray-500">{b.tag}</div>
              </div>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded">{b.rating}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Best Spreads Widget
export function BestSpreadsWidget() {
  const spreadBrokers = [
    { name: 'IC Markets', spreads: '0.0 pips', slug: 'ic-markets', commission: '$3.50/lot' },
    { name: 'Pepperstone', spreads: '0.0 pips', slug: 'pepperstone', commission: '$3.50/lot' },
    { name: 'XM', spreads: '0.1 pips', slug: 'xm', commission: 'Zero' },
    { name: 'FXTM', spreads: '0.5 pips', slug: 'fxtm', commission: 'Varies' },
    { name: 'OANDA', spreads: '0.8 pips', slug: 'oanda', commission: 'None' },
  ];

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Best Spreads</h3>
        </div>
        <div className="space-y-2">
          {spreadBrokers.map((b) => (
            <Link key={b.slug} href={`/broker/${b.slug}`} className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition group">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600">{b.name}</div>
                <div className="text-xs text-gray-500">Commission: {b.commission}</div>
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded whitespace-nowrap">{b.spreads}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Regulation Leaders Widget
export function RegulationLeadersWidget() {
  const regBrokers = [
    { name: 'IG', regs: ['FCA', 'ASIC', 'FSCA', 'BaFin'], slug: 'ig' },
    { name: 'Pepperstone', regs: ['FCA', 'ASIC', 'CySEC', 'BaFin'], slug: 'pepperstone' },
    { name: 'IronFX', regs: ['FCA', 'CySEC', 'ASIC'], slug: 'ironfx' },
    { name: 'Interactive Brokers', regs: ['SEC', 'FCA', 'IIROC'], slug: 'interactive-brokers' },
    { name: 'Saxo Bank', regs: ['FCA', 'MAS', 'FINMA'], slug: 'saxo-bank' },
  ];

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-4 w-4 text-blue-500" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Regulation Leaders</h3>
        </div>
        <div className="space-y-2">
          {regBrokers.map((b) => (
            <Link key={b.slug} href={`/broker/${b.slug}`} className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition group">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600">{b.name}</div>
                <div className="flex gap-1 mt-0.5 flex-wrap">
                  {b.regs.map(r => (
                    <span key={r} className="text-[10px] font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-1 py-0.5 rounded">{r}</span>
                  ))}
                </div>
              </div>
              <span className="text-xs font-bold text-blue-600">{b.regs.length} regs</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
