'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ArrowUpDown, Star, ExternalLink, AlertCircle } from 'lucide-react';
import { TrendingUp } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';
import { BrokerDetails, fetchTopBroker } from '@/lib/supabase';

type SortField = 'name' | 'rating' | 'spread_eur_usd' | 'min_deposit';
type SortDirection = 'asc' | 'desc';

export default function ComparisonTable() {
  const [sortField, setSortField] = useState<SortField>('rating');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [brokers, setBrokers] = useState<BrokerDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBrokers = async () => {
      try {
        setLoading(true);
        const data = await fetchTopBroker();
        setBrokers(data);
      } catch (err) {
        console.error('Failed to fetch brokers:', err);
        setError('Failed to load brokers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadBrokers();
  }, []);

  const sortedBrokers = [...brokers].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    
    if (sortField === 'rating') {
      const aRating = parseFloat(a.rating || '0');
      const bRating = parseFloat(b.rating || '0');
      return sortDirection === 'asc' 
        ? aRating - bRating
        : bRating - aRating;
    }
    
    if (sortField === 'spread_eur_usd') {
      const aSpread = parseFloat(a.spread_eur_usd || '0');
      const bSpread = parseFloat(b.spread_eur_usd || '0');
      return sortDirection === 'asc' 
        ? aSpread - bSpread
        : bSpread - aSpread;
    }
    
    if (sortField === 'min_deposit') {
      const aDeposit = parseFloat(a.min_deposit || '0');
      const bDeposit = parseFloat(b.min_deposit || '0');
      return sortDirection === 'asc' 
        ? aDeposit - bDeposit
        : bDeposit - aDeposit;
    }
    
    return 0;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      className="h-auto p-0 font-semibold text-white hover:text-cyan-400 transition-colors"
      onClick={() => handleSort(field)}
    >
      <span className="flex items-center gap-1">
        {children}
        <ArrowUpDown className="w-4 h-4" />
      </span>
    </Button>
  );

  return (
    <section className="py-20 bg-gradient-to-b from-black/40 to-black/60">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-red-100 mb-2">Something went wrong</h3>
            <p className="text-red-200 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors border border-red-500/30"
            >
              Try Again
            </button>
          </div>
        )}
        
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Top 6 <span className="text-cyan-400">Broker Comparison</span>
          </h2>
          <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
            Comprehensive comparison of the top-rated forex brokers in the market
          </p>
        </motion.div>
        )}
        {/* Desktop Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:block"
        >
          <Card className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border-white/20">
            <Table>
              <TableHeader className="border-b border-white/20">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-cyan-300 font-semibold w-16">
                    Rank
                  </TableHead>
                  <TableHead className="text-cyan-300 font-semibold">
                    <SortButton field="name">Broker</SortButton>
                  </TableHead>
                  <TableHead className="text-cyan-300 font-semibold">
                    <SortButton field="rating">Rating</SortButton>
                  </TableHead>
                  <TableHead className="text-cyan-300 font-semibold">
                    <SortButton field="spread_eur_usd">Min Spread</SortButton>
                  </TableHead>
                  <TableHead className="text-cyan-300 font-semibold">Max Leverage</TableHead>
                  <TableHead className="text-cyan-300 font-semibold">
                    <SortButton field="min_deposit">Min Deposit</SortButton>
                  </TableHead>
                  <TableHead className="text-cyan-300 font-semibold">Regulated By</TableHead>
                  <TableHead className="text-cyan-300 font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedBrokers.map((broker, index) => (
                  <TableRow 
                    key={broker.id} 
                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                          #{index + 1}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/20">
                          <Image
                            src={broker.logo || ''}
                            alt={`${broker.name} logo`}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{broker.name}</div>
                          <div className="text-sm text-cyan-200">Est. {broker.year_published}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => {
                            const rating = parseFloat(broker.rating || '0');
                            return (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
                              />
                            );
                          })}
                        </div>
                        <span className="font-semibold text-white">{parseFloat(broker.rating || '0').toFixed(1)}/5</span>
                        <span className="text-sm text-white/60">reviews</span>
                      </div>
                    </TableCell>
                    <TableCell>
                        <span className="font-semibold text-cyan-400">
                          {!broker.spread_eur_usd || parseFloat(broker.spread_eur_usd) === 0 ? 'From 0' : parseFloat(broker.spread_eur_usd).toFixed(2)} pips
                        </span>
                    </TableCell>
                    <TableCell>
                        <span className="font-semibold text-purple-400">{broker.leverage_max}</span>
                    </TableCell>
                    <TableCell>
                        <span className="font-semibold text-green-400">
                          {broker.min_deposit}
                        </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {broker.regulators?.slice(0, 2).map((regulator) => (
                          <Badge 
                            key={regulator} 
                            variant="secondary" 
                            className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs"
                          >
                            {regulator}
                          </Badge>
                        )) || 'N/A'}
                        {broker.regulators && broker.regulators.length > 2 && (
                          <Badge 
                            variant="secondary" 
                            className="bg-gray-500/20 text-gray-300 border-gray-500/30 text-xs"
                          >
                            +{broker.regulators.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Visit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </motion.div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {sortedBrokers.map((broker, index) => (
            <motion.div
              key={broker.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border-white/20">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm mr-2">
                        #{index + 1}
                      </div>
                      <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/20">
                        <Image
                          src={broker.logo || ''}
                          alt={`${broker.name} logo`}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{broker.name}</h3>
                        <div className="flex items-center gap-1">
                          <div className="flex items-center">
                          {[...Array(10)].map((_, i) => {
                            const rating = parseFloat(broker.rating || '0');
                            return (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
                              />
                            );
                          })}
                        </div>
                        <span className="text-sm text-cyan-200 ml-1">{broker.rating || 'N/A'}/10</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <div className="text-sm text-white/60">Min Deposit</div>
                      <div className="font-semibold text-green-400">
                        ${!broker.min_deposit || parseFloat(broker.min_deposit) === 0 ? 'No minimum' : parseFloat(broker.min_deposit).toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Spread (EUR/USD)</div>
                      <div className="font-semibold text-cyan-400">
                        {!broker.spread_eur_usd || parseFloat(broker.spread_eur_usd) === 0 ? 'From 0' : parseFloat(broker.spread_eur_usd).toFixed(2)} pips
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Max Leverage</div>
                      <div className="font-semibold text-purple-400">
                        {broker.leverage_max || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Regulated By</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {broker.regulators?.slice(0, 2).map((regulator) => (
                          <Badge 
                            key={regulator} 
                            variant="secondary" 
                            className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs"
                          >
                            {regulator}
                          </Badge>
                        )) || 'N/A'}
                        {broker.regulators && broker.regulators.length > 2 && (
                          <Badge 
                            variant="secondary" 
                            className="bg-gray-500/20 text-gray-300 border-gray-500/30 text-xs"
                          >
                            +{broker.regulators.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-4">
  <a
    href={broker.website}
    target="_blank"
    rel="noopener noreferrer"
    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
  >
    <ExternalLink className="w-4 h-4" />
    Visit Broker
  </a>
  <Link
    href={`/brokers/${broker.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}
    className="w-full bg-cyan-800/80 hover:bg-cyan-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
  >
    View Details
  </Link>
</div>
                </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Find More Brokers CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Button 
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            Find More FX Brokers
          </Button>
          <p className="text-white/60 text-sm mt-4 max-w-2xl mx-auto">
            Explore our complete database of 200+ verified forex brokers with detailed analysis and real-time data.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
