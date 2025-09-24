'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Filter, Search, Star, ArrowUpDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion } from 'framer-motion';

export interface BrokerListItem {
  id?: number;
  name: string;
  logo: string;
  rating: number | string;
  minDeposit: number;
  features: string[];
  regulations: string[];
  tradingPlatforms: string[];
  pros: string[];
  cons: string[];
  slug: string;
  bestFor?: string;
  description?: string;
  url?: string;
  website?: string;
}

interface Props {
  initialBrokers: BrokerListItem[];
}

export default function BrokersListClient({ initialBrokers }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<'rating' | 'minDeposit' | 'name'>('rating');
  const [minDepositFilter, setMinDepositFilter] = useState<'all' | 'under50' | 'under100' | 'under200' | 'over200'>('all');
  const [regulationFilter, setRegulationFilter] = useState<'all' | string>('all');

  const filteredBrokers = useMemo(() => {
    return (initialBrokers || []).filter((broker) => {
      const matchesSearch = broker.name.toLowerCase().includes(searchTerm.toLowerCase());
      let matchesDeposit = true;
      if (minDepositFilter === 'under50') matchesDeposit = broker.minDeposit <= 50;
      else if (minDepositFilter === 'under100') matchesDeposit = broker.minDeposit <= 100;
      else if (minDepositFilter === 'under200') matchesDeposit = broker.minDeposit <= 200;
      else if (minDepositFilter === 'over200') matchesDeposit = broker.minDeposit > 200;

      let matchesRegulation = true;
      if (regulationFilter !== 'all') {
        matchesRegulation = broker.regulations.some((reg) => reg.toLowerCase().includes(String(regulationFilter).toLowerCase()));
      }

      return matchesSearch && matchesDeposit && matchesRegulation;
    });
  }, [initialBrokers, searchTerm, minDepositFilter, regulationFilter]);

  const sortedBrokers = useMemo(() => {
    return [...filteredBrokers].sort((a, b) => {
      switch (sortOption) {
        case 'rating':
          const ar = typeof a.rating === 'string' ? parseFloat(a.rating) : a.rating || 0;
          const br = typeof b.rating === 'string' ? parseFloat(b.rating) : b.rating || 0;
          return br - ar;
        case 'minDeposit':
          return a.minDeposit - b.minDeposit;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [filteredBrokers, sortOption]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search */}
      <section className="text-center mb-12">
        <div className="relative mx-auto mb-12">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search brokers by name..."
            className="pl-10 py-6 bg-white dark:bg-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
            Showing {sortedBrokers.length} brokers{' '}
            {minDepositFilter !== 'all' && ' with filtered minimum deposit'}
            {regulationFilter !== 'all' && ` regulated by ${regulationFilter}`}
            {searchTerm && ` matching "${searchTerm}"`}. Sorted by{' '}
            {sortOption === 'rating' ? 'highest rating' : sortOption === 'minDeposit' ? 'lowest minimum deposit' : 'broker name'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <div className="p-2">
                  <p className="text-sm font-medium mb-2">Minimum Deposit</p>
                  <Select value={minDepositFilter} onValueChange={setMinDepositFilter as any}>
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="under50">Under $50</SelectItem>
                      <SelectItem value="under100">Under $100</SelectItem>
                      <SelectItem value="under200">Under $200</SelectItem>
                      <SelectItem value="over200">Over $200</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-2 border-t">
                  <p className="text-sm font-medium mb-2">Regulation</p>
                  <Select value={regulationFilter} onValueChange={setRegulationFilter as any}>
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="fca">FCA</SelectItem>
                      <SelectItem value="cysec">CySEC</SelectItem>
                      <SelectItem value="asic">ASIC</SelectItem>
                      <SelectItem value="fsca">FSCA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortOption('rating')}>
                  {sortOption === 'rating' && <Check className="h-4 w-4 mr-2" />}
                  Highest Rating
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption('minDeposit')}>
                  {sortOption === 'minDeposit' && <Check className="h-4 w-4 mr-2" />}
                  Lowest Minimum Deposit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption('name')}>
                  {sortOption === 'name' && <Check className="h-4 w-4 mr-2" />}
                  Broker Name (A-Z)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-6">
          {sortedBrokers.map((broker, index) => (
            <motion.div
              key={broker.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5">
                  <div className="p-4 md:p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800">
                    <div className="w-full max-w-[160px] h-[80px] relative mb-3">
                      <Image src={broker.logo} alt={broker.name} fill className="object-contain" sizes="160px" />
                    </div>
                    <h3 className="text-xl font-semibold text-center">{broker.name}</h3>
                    <div className="flex items-center mt-2">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const rating = typeof broker.rating === 'string' ? parseFloat(broker.rating as string) : (broker.rating as number) || 0;
                        return (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : i < rating
                                ? 'text-yellow-400 fill-yellow-400 opacity-50'
                                : 'text-gray-300'
                            }`}
                          />
                        );
                      })}
                      <span className="ml-2 text-sm font-medium">
                        {typeof broker.rating === 'string' ? parseFloat(broker.rating as string).toFixed(2) : ((broker.rating as number) || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-2 lg:col-span-3 p-4 md:p-6">
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Description</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{broker.description}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Regulators</p>
                      <div className="flex flex-wrap gap-2">
                        {broker.regulations.map((reg, idx) => (
                          <span key={idx} className="bg-white text-black px-2 mx-0.5 py-0.5 rounded text-xs font-medium border border-cyan-700" style={{ borderRadius: '1.25rem' }}>
                            {reg}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Trading Platforms</p>
                      <div className="flex flex-wrap gap-2">
                        {broker.tradingPlatforms.map((p, idx) => (
                          <span key={idx} className="bg-white text-black px-2 mx-0.5 py-0.5 rounded text-xs font-medium border border-cyan-700" style={{ borderRadius: '1.25rem' }}>
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 md:hidden">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Pros</p>
                      <ul className="space-y-1">
                        {broker.pros.slice(0, 3).map((pro, i) => (
                          <li key={i} className="flex items-start text-sm">
                            <svg className="h-4 w-4 text-green-500 mr-1.5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Cons</p>
                      <ul className="space-y-1">
                        {broker.cons.slice(0, 3).map((con, i) => (
                          <li key={i} className="flex items-start text-sm">
                            <svg className="h-4 w-4 text-red-500 mr-1.5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="md:col-span-1 lg:col-span-1 p-4 md:p-6 flex flex-col justify-center items-center md:items-end border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800">
                    <div className="mb-3 text-center md:text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Min. Deposit</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{broker.minDeposit}</p>
                    </div>

                    <div className="space-y-2 w-full">
                      <Button className="w-full" asChild>
                        <a href={broker.website || '#'} target="_blank" rel="noopener noreferrer" className="block w-full text-center py-3 mt-2 rounded-lg font-bold text-lg bg-gradient-to-r bg-gradient-to-br from-gray-700 to-gray-900 text-white shadow hover:brightness-110 transition">
                          Visit {broker.name}
                        </a>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/broker/${broker.slug}`}>Read Review</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {sortedBrokers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500 dark:text-gray-400">No brokers found matching your search criteria.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setMinDepositFilter('all');
                setRegulationFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
