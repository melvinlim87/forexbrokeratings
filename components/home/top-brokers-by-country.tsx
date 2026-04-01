'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Globe, Shield, Star, ChevronRight, MapPin, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { brokers } from '@/lib/brokers';

interface CountryBroker {
  country: string;
  flag: string;
  code: string;
  regulator: string;
  slug: string;
  brokers: Array<{
    name: string;
    slug: string;
    rating: number;
    logo: string;
    bestFor: string;
    affiliateUrl: string;
  }>;
}

// Top 3 brokers per major country, sourced from entityRegulations country data
const countryBrokerData: CountryBroker[] = [
  {
    country: 'United States',
    flag: '🇺🇸',
    code: 'US',
    regulator: 'CFTC/NFA',
    slug: 'united-states',
    brokers: [
      { name: 'FOREX.com', slug: 'forex-com', rating: 7.9, logo: '/logos/forexcom.svg', bestFor: 'Best for US Traders & Regulatory Trust', affiliateUrl: 'https://www.forex.com' },
      { name: 'IG', slug: 'ig', rating: 9.0, logo: '/logos/ig.png', bestFor: 'Best for Active Traders & Market Access', affiliateUrl: 'https://www.ig.com' },
      { name: 'OANDA', slug: 'oanda', rating: 8.1, logo: '/logos/oanda.png', bestFor: 'Best for Flexibility & Transparency', affiliateUrl: 'https://www.oanda.com' },
    ],
  },
  {
    country: 'United Kingdom',
    flag: '🇬🇧',
    code: 'GB',
    regulator: 'FCA',
    slug: 'united-kingdom',
    brokers: [
      { name: 'IG', slug: 'ig', rating: 9.0, logo: '/logos/ig.png', bestFor: 'Best for Active Traders & Market Access', affiliateUrl: 'https://www.ig.com' },
      { name: 'Pepperstone', slug: 'pepperstone', rating: 9.6, logo: '/logos/pepperstone.png', bestFor: 'Best for Low-Cost ECN & Copy Trading', affiliateUrl: 'https://www.pepperstone.com' },
      { name: 'CMC Markets', slug: 'cmc-markets', rating: 8.5, logo: '/logos/cmcmarkets.png', bestFor: 'Best for Indices & Platform Quality', affiliateUrl: 'https://www.cmcmarkets.com' },
    ],
  },
  {
    country: 'Australia',
    flag: '🇦🇺',
    code: 'AU',
    regulator: 'ASIC',
    slug: 'australia',
    brokers: [
      { name: 'Pepperstone', slug: 'pepperstone', rating: 9.6, logo: '/logos/pepperstone.png', bestFor: 'Best for Low-Cost ECN & Copy Trading', affiliateUrl: 'https://www.pepperstone.com' },
      { name: 'IC Markets', slug: 'ic-markets', rating: 9.0, logo: '/logos/icmarkets.png', bestFor: 'Best for Professional Traders & Scalping', affiliateUrl: 'https://www.icmarkets.com' },
      { name: 'Fusion Markets', slug: 'fusion-markets', rating: 7.3, logo: '/logos/fusionmarkets.png', bestFor: 'Best for Lowest Costs & Platform Choice', affiliateUrl: 'https://www.fusionmarkets.com' },
    ],
  },
  {
    country: 'Singapore',
    flag: '🇸🇬',
    code: 'SG',
    regulator: 'MAS',
    slug: 'singapore',
    brokers: [
      { name: 'IG', slug: 'ig', rating: 9.0, logo: '/logos/ig.png', bestFor: 'Best for Active Traders & Market Access', affiliateUrl: 'https://www.ig.com' },
      { name: 'CMC Markets', slug: 'cmc-markets', rating: 8.5, logo: '/logos/cmcmarkets.png', bestFor: 'Best for Indices & Platform Quality', affiliateUrl: 'https://www.cmcmarkets.com' },
      { name: 'Saxo Bank', slug: 'saxo-bank', rating: 8.0, logo: '/logos/saxobank.png', bestFor: 'Best for Premium Multi-Asset Trading', affiliateUrl: 'https://www.saxotrader.com' },
    ],
  },
  {
    country: 'EU / Europe',
    flag: '🇪🇺',
    code: 'EU',
    regulator: 'CySEC / BaFin',
    slug: 'germany',
    brokers: [
      { name: 'XTB', slug: 'xtb', rating: 8.7, logo: '/logos/xtb.png', bestFor: 'Best for Stock CFDs & Commission-Free Trading', affiliateUrl: 'https://www.xtb.com' },
      { name: 'IG', slug: 'ig', rating: 9.0, logo: '/logos/ig.png', bestFor: 'Best for Active Traders & Market Access', affiliateUrl: 'https://www.ig.com' },
      { name: 'ActivTrades', slug: 'activtrades', rating: 8.4, logo: '/logos/activtrades.png', bestFor: 'Best for Fast Execution & Fund Protection', affiliateUrl: 'https://www.activtrades.com' },
    ],
  },
];

export default function TopBrokersByCountry() {
  const [selected, setSelected] = useState<CountryBroker | null>(null);

  return (
    <section className="py-10 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-medium mb-3">
            <Award className="h-3.5 w-3.5" />
            Top 3 Per Country
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            🌍 Top 3 Brokers by Country
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            The best brokers vary by jurisdiction. See the top 3 rated brokers for each major region — curated by regulation, reputation, and user experience.
          </p>
        </div>

        {/* Country Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-4xl mx-auto mb-8">
          {countryBrokerData.map((c) => (
            <motion.button
              key={c.code}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelected(selected?.code === c.code ? null : c)}
              className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all cursor-pointer ${
                selected?.code === c.code
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-md shadow-indigo-500/10'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-sm'
              }`}
            >
              <span className="text-2xl">{c.flag}</span>
              <span className="text-xs font-semibold text-gray-900 dark:text-white text-center leading-tight">
                {c.country}
              </span>
              <div className="flex items-center gap-1">
                <Shield className="h-2.5 w-2.5 text-indigo-500" />
                <span className="text-[10px] text-gray-500 dark:text-gray-400">{c.regulator}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Selected Country — Top 3 Brokers */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="border-indigo-200 dark:border-indigo-800 shadow-lg">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{selected.flag}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Top 3 Brokers in {selected.country}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="secondary" className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-[10px]">
                        <Shield className="h-2.5 w-2.5 mr-0.5" />
                        {selected.regulator}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {selected.brokers.map((broker, idx) => (
                    <div
                      key={broker.slug}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      {/* Rank badge */}
                      <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                        idx === 0
                          ? 'bg-yellow-400 text-yellow-900'
                          : idx === 1
                          ? 'bg-gray-300 text-gray-700'
                          : 'bg-amber-600 text-white'
                      }`}>
                        {idx + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {broker.name}
                          </span>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              {broker.rating}/10
                            </span>
                          </div>
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                          {broker.bestFor}
                        </p>
                      </div>

                      <div className="flex gap-2 flex-shrink-0">
                        <Button size="sm" variant="outline" className="text-xs h-7" asChild>
                          <Link href={`/broker/${broker.slug}`}>Review</Link>
                        </Button>
                        <Button size="sm" className="text-xs h-7 bg-indigo-600 hover:bg-indigo-700" asChild>
                          <a href={broker.affiliateUrl} target="_blank" rel="noopener noreferrer">Visit</a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    href={`/${selected.slug}`}
                    className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                  >
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    View full {selected.country} broker guide
                    <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  );
}
