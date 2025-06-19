'use client';

import { useState } from 'react';
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
import { ArrowUpDown, Star, ExternalLink } from 'lucide-react';
import { TrendingUp } from 'lucide-react';
import { brokers, Broker } from '@/lib/brokers';
import Image from 'next/image';

type SortField = 'name' | 'rating' | 'minSpread' | 'minDeposit';
type SortDirection = 'asc' | 'desc';

export default function ComparisonTable() {
  const [sortField, setSortField] = useState<SortField>('rating');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortedBrokers = [...brokers].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' 
        ? aValue - bValue
        : bValue - aValue;
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Top 10 <span className="text-cyan-400">Broker Comparison</span>
          </h2>
          <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
            Comprehensive comparison of the top-rated forex brokers in the market
          </p>
        </motion.div>

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
                    <SortButton field="minSpread">Min Spread</SortButton>
                  </TableHead>
                  <TableHead className="text-cyan-300 font-semibold">Max Leverage</TableHead>
                  <TableHead className="text-cyan-300 font-semibold">
                    <SortButton field="minDeposit">Min Deposit</SortButton>
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
                            src={broker.logo}
                            alt={`${broker.name} logo`}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{broker.name}</div>
                          <div className="text-sm text-cyan-200">Est. {broker.established}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(10)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < Math.floor(broker.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
                            />
                          ))}
                        </div>
                        <span className="font-semibold text-white">{broker.rating}/10</span>
                        <span className="text-sm text-white/60">reviews</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-cyan-400">
                        {broker.minSpread === 0 ? 'From 0' : broker.minSpread} pips
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-purple-400">{broker.maxLeverage}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-green-400">
                        ${broker.minDeposit === 0 ? 'No minimum' : broker.minDeposit}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {broker.regulatedBy.slice(0, 2).map((regulator) => (
                          <Badge 
                            key={regulator} 
                            variant="secondary" 
                            className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs"
                          >
                            {regulator}
                          </Badge>
                        ))}
                        {broker.regulatedBy.length > 2 && (
                          <Badge 
                            variant="secondary" 
                            className="bg-gray-500/20 text-gray-300 border-gray-500/30 text-xs"
                          >
                            +{broker.regulatedBy.length - 2}
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
                          src={broker.logo}
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
                            {[...Array(10)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-2 h-2 ${i < Math.floor(broker.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-cyan-200 ml-1">{broker.rating}/10</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white"
                    >
                      Visit
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-white/60">Min Spread</div>
                      <div className="font-semibold text-cyan-400">
                        {broker.minSpread === 0 ? 'From 0' : broker.minSpread} pips
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Max Leverage</div>
                      <div className="font-semibold text-purple-400">{broker.maxLeverage}</div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Min Deposit</div>
                      <div className="font-semibold text-green-400">
                        ${broker.minDeposit === 0 ? 'No minimum' : broker.minDeposit}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Regulated By</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {broker.regulatedBy.slice(0, 2).map((regulator) => (
                          <Badge 
                            key={regulator} 
                            variant="secondary" 
                            className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs"
                          >
                            {regulator}
                          </Badge>
                        ))}
                      </div>
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