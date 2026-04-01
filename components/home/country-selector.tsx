'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronRight, Shield, Search, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { brokers, getTopBrokers } from '@/lib/brokers';

interface CountryGuide {
  country: string;
  flag: string;
  code: string;
  regulator: string;
  slug: string;
  topBroker: string;
  brokerCount: number;
}

const countryGuides: CountryGuide[] = [
  { country: 'Singapore', flag: '🇸🇬', code: 'SG', regulator: 'MAS', slug: 'singapore', topBroker: 'IG', brokerCount: 25 },
  { country: 'United Kingdom', flag: '🇬🇧', code: 'GB', regulator: 'FCA', slug: 'united-kingdom', topBroker: 'IG', brokerCount: 38 },
  { country: 'Australia', flag: '🇦🇺', code: 'AU', regulator: 'ASIC', slug: 'australia', topBroker: 'Pepperstone', brokerCount: 30 },
  { country: 'United States', flag: '🇺🇸', code: 'US', regulator: 'CFTC/NFA', slug: 'united-states', topBroker: 'FOREX.com', brokerCount: 5 },
  { country: 'Canada', flag: '🇨🇦', code: 'CA', regulator: 'IIROC', slug: 'canada', topBroker: 'OANDA', brokerCount: 8 },
  { country: 'South Africa', flag: '🇿🇦', code: 'ZA', regulator: 'FSCA', slug: 'south-africa', topBroker: 'CMC Markets', brokerCount: 18 },
  { country: 'India', flag: '🇮🇳', code: 'IN', regulator: 'SEBI', slug: 'india', topBroker: 'IC Markets', brokerCount: 15 },
  { country: 'Germany', flag: '🇩🇪', code: 'DE', regulator: 'BaFin', slug: 'germany', topBroker: 'eToro', brokerCount: 28 },
  { country: 'UAE', flag: '🇦🇪', code: 'AE', regulator: 'DFSA', slug: 'uae', topBroker: 'AvaTrade', brokerCount: 20 },
  { country: 'Japan', flag: '🇯🇵', code: 'JP', regulator: 'FSA', slug: 'japan', topBroker: 'SBI FX', brokerCount: 12 },
  { country: 'Nigeria', flag: '🇳🇬', code: 'NG', regulator: 'SEC', slug: 'nigeria', topBroker: 'Exness', brokerCount: 22 },
  { country: 'Kenya', flag: '🇰🇪', code: 'KE', regulator: 'CMA', slug: 'kenya', topBroker: 'Exness', brokerCount: 14 },
];

export default function CountrySelector() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryGuide | null>(null);

  const filtered = searchQuery
    ? countryGuides.filter(c =>
        c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.regulator.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : countryGuides;

  // Get the top broker for the selected country
  const topBroker = selectedCountry
    ? brokers.find(b => b.name.toLowerCase().includes(selectedCountry.topBroker.toLowerCase()))
    : null;

  return (
    <section className="py-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium mb-3">
            <Globe className="h-3.5 w-3.5" />
            Regional Broker Guides
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Find the Best Broker for Your Country
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Regulation and broker availability vary by country. Choose your region to see brokers licensed by your local regulator.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search country or regulator..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
            />
          </div>
        </div>

        {/* Country Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-5xl mx-auto">
          {filtered.map((country) => (
            <motion.button
              key={country.code}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedCountry(selectedCountry?.code === country.code ? null : country)}
              className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all cursor-pointer ${
                selectedCountry?.code === country.code
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-md shadow-blue-500/10'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm'
              }`}
            >
              <span className="text-2xl">{country.flag}</span>
              <span className="text-xs font-semibold text-gray-900 dark:text-white text-center leading-tight">
                {country.country}
              </span>
              <div className="flex items-center gap-1">
                <Shield className="h-2.5 w-2.5 text-blue-500" />
                <span className="text-[10px] text-gray-500 dark:text-gray-400">{country.regulator}</span>
              </div>
              <span className="text-[10px] text-gray-400">{country.brokerCount} brokers</span>
            </motion.button>
          ))}
        </div>

        {/* Selected Country Detail */}
        <AnimatePresence>
          {selectedCountry && (
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto mt-6 overflow-hidden"
            >
              <Card className="border-blue-200 dark:border-blue-800 shadow-lg">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{selectedCountry.flag}</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Best Forex Brokers in {selectedCountry.country}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px]">
                          <Shield className="h-2.5 w-2.5 mr-0.5" />
                          {selectedCountry.regulator} Regulated
                        </Badge>
                        <span className="text-xs text-gray-500">{selectedCountry.brokerCount} verified brokers</span>
                      </div>

                      {topBroker && (
                        <div className="mt-3 flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                          <div className="h-8 w-16 relative flex-shrink-0">
                            <Image src={topBroker.logo} alt={topBroker.name} fill className="object-contain" unoptimized />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              #{1} Recommended: {topBroker.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {topBroker.bestFor} • Rating: {topBroker.rating}/10
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="text-xs h-7" asChild>
                              <Link href={`/broker/${topBroker.slug}`}>Review</Link>
                            </Button>
                            <Button size="sm" className="text-xs h-7 bg-blue-600 hover:bg-blue-700" asChild>
                              <a href={topBroker.affiliateUrl} target="_blank" rel="noopener noreferrer">Visit</a>
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="mt-3">
                        <Link
                          href={`/${selectedCountry.slug}`}
                          className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          View full {selectedCountry.country} broker guide
                          <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
