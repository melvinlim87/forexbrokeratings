"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Filter, Search, Star, ArrowUpDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { fetchAllBrokerDetails } from '@/lib/supabase';

// Define broker types
interface Broker {
  id?: number;
  name: string;
  logo: string;
  rating: number;
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

export default function BrokersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('rating');
  const [minDepositFilter, setMinDepositFilter] = useState('all');
  const [regulationFilter, setRegulationFilter] = useState('all');
  const [brokersData, setBrokersData] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchBrokers() {
      try {
        console.log('Fetching brokers data using fetchAllBrokerDetails...');
        const data = await fetchAllBrokerDetails();
        
        if (data && data.length > 0) {
          // Format the brokers data to match our expected structure
          const formattedBrokers = data.map((broker: any, index: number) => {
            // Parse arrays that might be stored as strings
            const parseArrayField = (field: string[] | string | null | undefined) => {
              if (!field) return [];
              if (Array.isArray(field)) return field;
              
              // Handle string values
              if (typeof field === 'string') {
                // Check if it looks like a JSON array
                if (field.trim().startsWith('[') && field.trim().endsWith(']')) {
                  try {
                    // Sanitize the string before parsing
                    const sanitized = field
                      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
                      .replace(/\\(?!["\\/bfnrt])/g, '\\\\'); // Escape unescaped backslashes
                    
                    const parsed = JSON.parse(sanitized);
                    return Array.isArray(parsed) ? parsed : [field];
                  } catch (e) {
                    console.error('JSON parse error:', e);
                    // If parsing fails, treat as a single item
                    return [field];
                  }
                }
                // If it doesn't look like JSON, treat as a single item
                return [field];
              }
              
              // Fallback for any other type
              return [String(field)];
            };
            
            return {
              id: broker.id || index + 1,
              name: broker.name || `Broker ${index + 1}`,
              logo: broker.logo || `https://via.placeholder.com/120x60?text=${broker.name || 'Broker'}`,
              rating: broker.rating || 4.0,
              minDeposit: broker.min_deposits || 100,
              features: parseArrayField(broker.features),
              regulations: parseArrayField(broker.regulators),
              tradingPlatforms: parseArrayField(broker.platforms),
              pros: parseArrayField(broker.pros),
              cons: parseArrayField(broker.cons),
              bestFor: broker.bestFor || 'Forex Trading',
              description: broker.description || 'A reliable forex broker offering competitive trading conditions.',
              url: broker.url || '#',
              website: broker.website || '#',
              slug: broker.name ? broker.name.toLowerCase().replace(/\s+/g, '-') : `broker-${index + 1}`
            };
          });
          
          setBrokersData(formattedBrokers);
        }
      } catch (err) {
        console.error('Error fetching brokers:', err);
        setError('Failed to load brokers data');
      } finally {
        setLoading(false);
      }
    }
    
    fetchBrokers();
  }, []);
  
  // Filter brokers based on search term and filters
  const filteredBrokers = brokersData.filter(broker => {
    const matchesSearch = broker.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by minimum deposit
    let matchesDeposit = true;
    if (minDepositFilter === 'under50') {
      matchesDeposit = broker.minDeposit <= 50;
    } else if (minDepositFilter === 'under100') {
      matchesDeposit = broker.minDeposit <= 100;
    } else if (minDepositFilter === 'under200') {
      matchesDeposit = broker.minDeposit <= 200;
    } else if (minDepositFilter === 'over200') {
      matchesDeposit = broker.minDeposit > 200;
    }
    
    // Filter by regulation
    let matchesRegulation = true;
    if (regulationFilter !== 'all') {
      matchesRegulation = broker.regulations.some(reg => 
        reg.toLowerCase().includes(regulationFilter.toLowerCase())
      );
    }
    
    return matchesSearch && matchesDeposit && matchesRegulation;
  });
  
  // Sort brokers
  const sortedBrokers = [...filteredBrokers].sort((a, b) => {
    switch (sortOption) {
      case 'rating':
        return b.rating - a.rating;
      case 'minDeposit':
        return a.minDeposit - b.minDeposit;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-blue-600 dark:bg-blue-900">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Compare Top Forex Brokers
            </h1>
            <p className="text-blue-100 mb-6">
              Find the best forex broker for your trading style. Compare features, minimum deposits, 
              regulations and more.
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              <Input 
                placeholder="Search brokers by name..." 
                className="pl-10 py-6 bg-white dark:bg-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-lg text-red-500 mb-4">{error}</p>
            <p className="text-gray-600 dark:text-gray-400">
              We're having trouble loading the broker data. Please try again later.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
                Showing {sortedBrokers.length} brokers 
                {minDepositFilter !== 'all' && ' with filtered minimum deposit'}
                {regulationFilter !== 'all' && ` regulated by ${regulationFilter}`}
                {searchTerm && ` matching "${searchTerm}"`}. 
                Sorted by {sortOption === 'rating' ? 'highest rating' : sortOption === 'minDeposit' ? 'lowest minimum deposit' : 'broker name'}
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
                      <Select value={minDepositFilter} onValueChange={setMinDepositFilter}>
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
                      <Select value={regulationFilter} onValueChange={setRegulationFilter}>
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
                          <Image
                            src={broker.logo}
                            alt={broker.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <h3 className="text-xl font-semibold text-center">{broker.name}</h3>
                        <div className="flex items-center mt-2">
                          {Array.from({ length: 5 }).map((_, i) => {
                            const rating = parseFloat(broker.rating);
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
                            {broker.rating}
                          </span>
                        </div>
                      </div>
                      
                      <div className="md:col-span-2 lg:col-span-3 p-4 md:p-6">
                        <div className="mb-4">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Description</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {broker.description}
                          </p>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Regulators</p>
                          <div className="flex flex-wrap gap-2">
                            {broker.regulations.map((reg, index) => (
                              <span key={index} className="bg-white text-black px-2 mx-0.5 py-0.5 rounded text-xs font-medium border border-cyan-700" style={{borderRadius: '1.25rem'}}>{reg}</span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Trading Platforms</p>
                          <div className="flex flex-wrap gap-2">
                            {broker.tradingPlatforms.map((platform, index) => (
                              <span key={index} className="bg-white text-black px-2 mx-0.5 py-0.5 rounded text-xs font-medium border border-cyan-700" style={{borderRadius: '1.25rem'}}>{platform}</span>
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
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">${broker.minDeposit}</p>
                        </div>
                        
                        <div className="space-y-2 w-full">
                          <Button className="w-full" asChild>
                            <a href={broker.website || '#'} target="_blank" rel="noopener noreferrer">
                              Visit Broker
                            </a>
                          </Button>
                          <Button variant="outline" className="w-full" asChild>
                            <Link href={`/broker/${broker.slug}`}>
                              Read Review
                            </Link>
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
          </>
        )}
      </div>
    </div>
  );
}
