"use client";

import { useState } from 'react';
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

// Sample data - would come from API in real implementation
const brokers = [
  {
    id: 1,
    name: 'IronFX',
    logo: 'https://via.placeholder.com/120x60?text=IronFX',
    rating: 4.2,
    minDeposit: 100,
    features: ['200+ Trading Instruments', 'Spreads from 0.7 pips', 'Leverage up to 1:500'],
    regulations: ['FCA', 'CySEC', 'ASIC'],
    tradingPlatforms: ['MT4', 'MT5', 'WebTrader'],
    pros: ['Multiple account types', 'Fast withdrawals', 'Good educational resources'],
    cons: ['Average trading fees', 'Limited cryptocurrency offerings'],
    slug: 'ironfx'
  },
  {
    id: 2,
    name: 'FXTM',
    logo: 'https://via.placeholder.com/120x60?text=FXTM',
    rating: 4.7,
    minDeposit: 50,
    features: ['250+ Trading Instruments', 'Spreads from 0.5 pips', 'Leverage up to 1:1000'],
    regulations: ['FCA', 'CySEC'],
    tradingPlatforms: ['MT4', 'MT5', 'FXTM Platform'],
    pros: ['Excellent educational resources', 'Fast execution speeds', 'Low spreads'],
    cons: ['Limited product portfolio', 'Basic research tools'],
    slug: 'fxtm'
  },
  {
    id: 3,
    name: 'XM',
    logo: 'https://via.placeholder.com/120x60?text=XM',
    rating: 4.5,
    minDeposit: 5,
    features: ['1000+ Trading Instruments', 'Spreads from 0.6 pips', 'Leverage up to 1:888'],
    regulations: ['CySEC', 'ASIC', 'IFSC'],
    tradingPlatforms: ['MT4', 'MT5'],
    pros: ['Ultra-low minimum deposit', 'No deposit fees', 'Multi-language support'],
    cons: ['Average trading platform', 'Limited research tools'],
    slug: 'xm'
  },
  {
    id: 4,
    name: 'Pepperstone',
    logo: 'https://via.placeholder.com/120x60?text=Pepperstone',
    rating: 4.9,
    minDeposit: 200,
    features: ['1200+ Trading Instruments', 'Raw spreads from 0.0 pips', 'Leverage up to 1:500'],
    regulations: ['FCA', 'ASIC', 'CySEC', 'BaFin', 'DFSA'],
    tradingPlatforms: ['MT4', 'MT5', 'cTrader'],
    pros: ['Excellent spreads', 'Fast execution', 'Advanced platform options'],
    cons: ['No proprietary platform', 'Limited educational content'],
    slug: 'pepperstone'
  },
  {
    id: 5,
    name: 'IG',
    logo: 'https://via.placeholder.com/120x60?text=IG',
    rating: 4.8,
    minDeposit: 250,
    features: ['17000+ Trading Instruments', 'Spreads from 0.6 pips', 'Leverage up to 1:200'],
    regulations: ['FCA', 'ASIC', 'FSCA', 'BaFin', 'CFTC'],
    tradingPlatforms: ['MT4', 'L2 Dealer', 'ProRealTime', 'IG Platform'],
    pros: ['Extensive market range', 'Excellent research', 'Reliable execution'],
    cons: ['Higher minimum deposit', 'Complex fee structure'],
    slug: 'ig'
  },
  {
    id: 6,
    name: 'eToro',
    logo: 'https://via.placeholder.com/120x60?text=eToro',
    rating: 4.6,
    minDeposit: 50,
    features: ['2000+ Trading Instruments', 'Variable spreads', 'Copy Trading'],
    regulations: ['FCA', 'CySEC', 'ASIC'],
    tradingPlatforms: ['eToro Platform', 'Mobile App'],
    pros: ['Social trading features', 'User-friendly interface', 'Cryptocurrency support'],
    cons: ['Higher spreads', 'Limited technical analysis tools'],
    slug: 'etoro'
  }
];

export default function BrokersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('rating');
  const [minDepositFilter, setMinDepositFilter] = useState('all');
  const [regulationFilter, setRegulationFilter] = useState('all');
  
  // Filter brokers based on search term and filters
  const filteredBrokers = brokers.filter(broker => {
    const matchesSearch = broker.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDeposit = minDepositFilter === 'all' || 
                           (minDepositFilter === 'under50' && broker.minDeposit <= 50) ||
                           (minDepositFilter === 'under100' && broker.minDeposit <= 100) ||
                           (minDepositFilter === 'under200' && broker.minDeposit <= 200) ||
                           (minDepositFilter === 'over200' && broker.minDeposit > 200);
    const matchesRegulation = regulationFilter === 'all' || broker.regulations.includes(regulationFilter);
    
    return matchesSearch && matchesDeposit && matchesRegulation;
  });
  
  // Sort brokers based on selected option
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
            <p className="text-lg text-blue-100 mb-6">
              Find and compare the best forex brokers with our comprehensive reviews and ratings.
            </p>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search for brokers..."
                className="pl-10 py-6 bg-white dark:bg-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {sortedBrokers.length} Forex Brokers
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sorted by {sortOption === 'rating' ? 'highest rating' : sortOption === 'minDeposit' ? 'lowest minimum deposit' : 'broker name'}
            </p>
          </div>
          
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
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select minimum deposit" />
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
                <div className="p-2 pt-0">
                  <p className="text-sm font-medium mb-2">Regulation</p>
                  <Select value={regulationFilter} onValueChange={setRegulationFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select regulation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="FCA">FCA (UK)</SelectItem>
                      <SelectItem value="CySEC">CySEC (EU)</SelectItem>
                      <SelectItem value="ASIC">ASIC (Australia)</SelectItem>
                      <SelectItem value="FSCA">FSCA (South Africa)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort by
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortOption('rating')}>
                  Highest Rating
                  {sortOption === 'rating' && <Check className="h-4 w-4 ml-2" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption('minDeposit')}>
                  Lowest Minimum Deposit
                  {sortOption === 'minDeposit' && <Check className="h-4 w-4 ml-2" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption('name')}>
                  Broker Name (A-Z)
                  {sortOption === 'name' && <Check className="h-4 w-4 ml-2" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="grid gap-6">
          {sortedBrokers.map((broker, index) => (
            <motion.div
              key={broker.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-3 lg:col-span-2 p-4 md:p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800">
                    <div className="h-16 w-32 relative bg-gray-100 dark:bg-gray-800 rounded mb-3">
                      <Image
                        src={broker.logo}
                        alt={broker.name}
                        layout="fill"
                        objectFit="contain"
                        className="p-2"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-center text-gray-900 dark:text-white mb-2">{broker.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="font-medium">{broker.rating}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">/5</span>
                    </div>
                  </div>
                  
                  <div className="md:col-span-6 lg:col-span-7 p-4 md:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Key Features</p>
                        <ul className="space-y-1">
                          {broker.features.map((feature, i) => (
                            <li key={i} className="flex items-start text-sm">
                              <svg className="h-4 w-4 text-green-500 mr-1.5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Regulations</p>
                          <div className="flex flex-wrap gap-1">
                            {broker.regulations.map((reg) => (
                              <Badge key={reg} variant="outline" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                                {reg}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Trading Platforms</p>
                          <div className="flex flex-wrap gap-1">
                            {broker.tradingPlatforms.map((platform) => (
                              <Badge key={platform} variant="secondary">
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Pros</p>
                        <ul className="space-y-1">
                          {broker.pros.map((pro, i) => (
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
                          {broker.cons.map((con, i) => (
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
                  </div>
                  
                  <div className="md:col-span-3 lg:col-span-3 p-4 md:p-6 flex flex-col justify-center items-center md:items-end border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800">
                    <div className="mb-3 text-center md:text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Min. Deposit</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">${broker.minDeposit}</p>
                    </div>
                    
                    <div className="space-y-2 w-full">
                      <Button className="w-full" asChild>
                        <a href="#" target="_blank" rel="noopener noreferrer">
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
      </div>
    </div>
  );
}