"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, XCircle, Star, ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// Sample data - would come from API in real implementation
const brokers = [
  {
    id: 1,
    name: 'IronFX',
    logo: 'https://via.placeholder.com/120x60?text=IronFX',
    rating: 4.2,
    minDeposit: 100,
    spreads: 'From 0.7 pips',
    leverage: 'Up to 1:500',
    platforms: ['MT4', 'MT5', 'WebTrader'],
    regulations: ['FCA', 'CySEC', 'ASIC'],
    tradingInstruments: ['Forex', 'Indices', 'Commodities', 'Stocks', 'Metals'],
    accountTypes: ['Micro', 'Premium', 'VIP', 'Zero Spread'],
    depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'UnionPay'],
    customerSupport: ['Live Chat', 'Email', 'Phone'],
    education: ['Video Tutorials', 'Webinars', 'eBooks', 'Glossary'],
    pros: ['Multiple regulations', 'Wide range of platforms', 'Competitive spreads on premium accounts'],
    cons: ['Higher spreads on standard accounts', 'Inactivity fee after 6 months'],
    slug: 'ironfx'
  },
  {
    id: 2,
    name: 'FXTM',
    logo: 'https://via.placeholder.com/120x60?text=FXTM',
    rating: 4.7,
    minDeposit: 50,
    spreads: 'From 0.5 pips',
    leverage: 'Up to 1:1000',
    platforms: ['MT4', 'MT5', 'FXTM Platform'],
    regulations: ['FCA', 'CySEC'],
    tradingInstruments: ['Forex', 'Indices', 'Commodities', 'Stocks', 'Metals', 'Cryptocurrencies'],
    accountTypes: ['Standard', 'Cent', 'FXTM Pro', 'FXTM Invest'],
    depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'Perfect Money'],
    customerSupport: ['Live Chat', 'Email', 'Phone', 'Callback'],
    education: ['Trading Academy', 'Webinars', 'Video Tutorials', 'eBooks', 'Glossary'],
    pros: ['Excellent educational resources', 'Low minimum deposit', 'Fast withdrawal processing'],
    cons: ['Limited product portfolio', 'Basic research tools'],
    slug: 'fxtm'
  },
  {
    id: 3,
    name: 'XM',
    logo: 'https://via.placeholder.com/120x60?text=XM',
    rating: 4.5,
    minDeposit: 5,
    spreads: 'From 0.6 pips',
    leverage: 'Up to 1:888',
    platforms: ['MT4', 'MT5'],
    regulations: ['CySEC', 'ASIC', 'IFSC'],
    tradingInstruments: ['Forex', 'Indices', 'Commodities', 'Stocks', 'Metals', 'Energies', 'Cryptocurrencies'],
    accountTypes: ['Micro', 'Standard', 'XM Ultra Low'],
    depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'Perfect Money', 'UnionPay'],
    customerSupport: ['Live Chat', 'Email', 'Phone', 'Multilingual Support'],
    education: ['XM Research', 'Webinars', 'Educational Videos', 'eBooks'],
    pros: ['Ultra-low minimum deposit', 'Multi-language support', 'No deposit fees'],
    cons: ['Average trading platform', 'Limited research tools'],
    slug: 'xm'
  },
  {
    id: 4,
    name: 'Pepperstone',
    logo: 'https://via.placeholder.com/120x60?text=Pepperstone',
    rating: 4.9,
    minDeposit: 200,
    spreads: 'From 0.0 pips',
    leverage: 'Up to 1:500',
    platforms: ['MT4', 'MT5', 'cTrader'],
    regulations: ['FCA', 'ASIC', 'CySEC', 'BaFin', 'DFSA'],
    tradingInstruments: ['Forex', 'Indices', 'Commodities', 'Stocks', 'Metals', 'Cryptocurrencies'],
    accountTypes: ['Standard', 'Razor', 'Active Trader'],
    depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'PayPal', 'Skrill', 'Neteller'],
    customerSupport: ['Live Chat', 'Email', 'Phone'],
    education: ['Market Analysis', 'Webinars', 'Trading Guides'],
    pros: ['Excellent spreads', 'Fast execution', 'Advanced platform options'],
    cons: ['Higher minimum deposit', 'No proprietary platform'],
    slug: 'pepperstone'
  },
  {
    id: 5,
    name: 'IG',
    logo: 'https://via.placeholder.com/120x60?text=IG',
    rating: 4.8,
    minDeposit: 250,
    spreads: 'From 0.6 pips',
    leverage: 'Up to 1:200',
    platforms: ['MT4', 'L2 Dealer', 'ProRealTime', 'IG Platform'],
    regulations: ['FCA', 'ASIC', 'FSCA', 'BaFin', 'CFTC'],
    tradingInstruments: ['Forex', 'Indices', 'Commodities', 'Stocks', 'Bonds', 'Interest Rates', 'Options', 'ETFs'],
    accountTypes: ['CFD', 'Spread Betting', 'Share Dealing', 'ISA', 'SIPP'],
    depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'PayPal'],
    customerSupport: ['Live Chat', 'Email', 'Phone', 'Twitter'],
    education: ['IG Academy', 'Webinars', 'Seminars', 'Trading Guides', 'News & Analysis'],
    pros: ['Extensive market range', 'Excellent research', 'Proprietary platform'],
    cons: ['Higher minimum deposit', 'Complex fee structure'],
    slug: 'ig'
  },
  {
    id: 6,
    name: 'eToro',
    logo: 'https://via.placeholder.com/120x60?text=eToro',
    rating: 4.6,
    minDeposit: 50,
    spreads: 'Variable',
    leverage: 'Up to 1:30',
    platforms: ['eToro Platform', 'Mobile App'],
    regulations: ['FCA', 'CySEC', 'ASIC'],
    tradingInstruments: ['Forex', 'Indices', 'Commodities', 'Stocks', 'ETFs', 'Cryptocurrencies'],
    accountTypes: ['Retail', 'Professional', 'Islamic'],
    depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'PayPal', 'Skrill', 'Neteller'],
    customerSupport: ['Live Chat', 'Email', 'Ticket System'],
    education: ['eToro Academy', 'Trading School', 'Video Tutorials', 'Market Analysis'],
    pros: ['Social trading features', 'User-friendly interface', 'Wide range of assets'],
    cons: ['Higher spreads', 'USD base currency only'],
    slug: 'etoro'
  }
];

export default function ComparePage() {
  const [selectedBrokers, setSelectedBrokers] = useState<number[]>([]);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  
  const toggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category);
  };
  
  const addBroker = (brokerId: number) => {
    if (selectedBrokers.length < 3 && !selectedBrokers.includes(brokerId)) {
      setSelectedBrokers([...selectedBrokers, brokerId]);
    }
  };
  
  const removeBroker = (brokerId: number) => {
    setSelectedBrokers(selectedBrokers.filter(id => id !== brokerId));
  };
  
  // Get selected broker details
  const selectedBrokerDetails = brokers.filter(broker => selectedBrokers.includes(broker.id));
  
  // Render check or x for boolean values or feature presence
  const renderCheckOrX = (value: boolean | string[] | undefined, item?: string) => {
    if (typeof value === 'boolean') {
      return value ? 
        <CheckCircle className="h-5 w-5 text-green-500" /> : 
        <XCircle className="h-5 w-5 text-red-500" />;
    }
    
    if (Array.isArray(value) && item) {
      return value.includes(item) ? 
        <CheckCircle className="h-5 w-5 text-green-500" /> : 
        <XCircle className="h-5 w-5 text-red-500" />;
    }
    
    return null;
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-blue-600 dark:bg-blue-900">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Compare Forex Brokers
            </h1>
            <p className="text-lg text-blue-100 mb-6">
              Select up to 3 brokers to compare their features, fees, platforms, and more side by side.
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {selectedBrokers.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Select Brokers to Compare</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Choose up to 3 brokers to see a detailed side-by-side comparison of their features and services.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((slot) => (
                <div key={slot} className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start mb-2">
                        <Search className="mr-2 h-4 w-4" />
                        <span>Select broker {slot}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" align="start" side="bottom" sideOffset={5}>
                      <Command>
                        <CommandInput placeholder="Search broker..." />
                        <CommandEmpty>No broker found.</CommandEmpty>
                        <CommandGroup>
                          {brokers.map((broker) => (
                            <CommandItem
                              key={broker.id}
                              value={broker.name}
                              onSelect={() => {
                                addBroker(broker.id);
                              }}
                              disabled={selectedBrokers.includes(broker.id)}
                              className="flex items-center"
                            >
                              <div className="h-8 w-16 relative bg-gray-100 dark:bg-gray-800 rounded mr-2">
                                <Image
                                  src={broker.logo}
                                  alt={broker.name}
                                  layout="fill"
                                  objectFit="contain"
                                  className="p-1"
                                />
                              </div>
                              <span>{broker.name}</span>
                              {selectedBrokers.includes(broker.id) && (
                                <CheckCircle className="ml-auto h-4 w-4 text-green-500" />
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Add a broker to compare
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Popular Comparisons</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { brokers: [1, 2], label: 'IronFX vs FXTM' },
                  { brokers: [3, 4], label: 'XM vs Pepperstone' },
                  { brokers: [5, 6], label: 'IG vs eToro' },
                  { brokers: [2, 3, 4], label: 'FXTM vs XM vs Pepperstone' },
                  { brokers: [1, 4, 5], label: 'IronFX vs Pepperstone vs IG' },
                  { brokers: [3, 5, 6], label: 'XM vs IG vs eToro' },
                ].map((comparison, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => setSelectedBrokers(comparison.brokers)}
                  >
                    {comparison.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Comparing {selectedBrokerDetails.map(b => b.name).join(' vs ')}
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2 sm:mt-0" 
                  onClick={() => setSelectedBrokers([])}
                >
                  Clear All
                </Button>
              </div>
              
              <div className="grid grid-cols-4">
                <div className="col-span-1"></div>
                {selectedBrokerDetails.map((broker) => (
                  <div key={broker.id} className="col-span-1 flex flex-col items-center p-2 relative">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-0 right-0" 
                      onClick={() => removeBroker(broker.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    
                    <div className="h-16 w-32 relative bg-gray-100 dark:bg-gray-800 rounded mb-2">
                      <Image
                        src={broker.logo}
                        alt={broker.name}
                        layout="fill"
                        objectFit="contain"
                        className="p-2"
                      />
                    </div>
                    
                    <h3 className="text-lg font-semibold">{broker.name}</h3>
                    <div className="flex items-center mt-1">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="font-medium">{broker.rating}</span>
                    </div>
                    
                    <Button 
                      className="mt-3 w-full" 
                      size="sm"
                      asChild
                    >
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        Visit Site
                      </a>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="mt-2 w-full" 
                      size="sm"
                      asChild
                    >
                      <Link href={`/broker/${broker.slug}`}>
                        Full Review
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Basic Info Section */}
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <button 
                  className="w-full p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
                  onClick={() => toggleCategory('basicInfo')}
                >
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  {openCategory === 'basicInfo' ? 
                    <ChevronUp className="h-5 w-5" /> : 
                    <ChevronDown className="h-5 w-5" />
                  }
                </button>
                
                {openCategory === 'basicInfo' && (
                  <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    <div className="grid grid-cols-4 divide-x divide-gray-200 dark:divide-gray-800">
                      <div className="col-span-1 p-4 font-medium">Minimum Deposit</div>
                      {selectedBrokerDetails.map((broker) => (
                        <div key={broker.id} className="col-span-1 p-4 text-center">${broker.minDeposit}</div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-4 divide-x divide-gray-200 dark:divide-gray-800">
                      <div className="col-span-1 p-4 font-medium">Spreads</div>
                      {selectedBrokerDetails.map((broker) => (
                        <div key={broker.id} className="col-span-1 p-4 text-center">{broker.spreads}</div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-4 divide-x divide-gray-200 dark:divide-gray-800">
                      <div className="col-span-1 p-4 font-medium">Leverage</div>
                      {selectedBrokerDetails.map((broker) => (
                        <div key={broker.id} className="col-span-1 p-4 text-center">{broker.leverage}</div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-4 divide-x divide-gray-200 dark:divide-gray-800">
                      <div className="col-span-1 p-4 font-medium">Regulation</div>
                      {selectedBrokerDetails.map((broker) => (
                        <div key={broker.id} className="col-span-1 p-4 text-center">
                          <div className="flex flex-wrap justify-center gap-1">
                            {broker.regulations.map((reg) => (
                              <Badge key={reg} variant="outline" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                                {reg}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Trading Platforms Section */}
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <button 
                  className="w-full p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
                  onClick={() => toggleCategory('platforms')}
                >
                  <h3 className="text-lg font-semibold">Trading Platforms</h3>
                  {openCategory === 'platforms' ? 
                    <ChevronUp className="h-5 w-5" /> : 
                    <ChevronDown className="h-5 w-5" />
                  }
                </button>
                
                {openCategory === 'platforms' && (
                  <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {['MT4', 'MT5', 'cTrader', 'WebTrader', 'Proprietary Platform', 'Mobile App'].map((platform) => (
                      <div key={platform} className="grid grid-cols-4 divide-x divide-gray-200 dark:divide-gray-800">
                        <div className="col-span-1 p-4 font-medium">{platform}</div>
                        {selectedBrokerDetails.map((broker) => (
                          <div key={broker.id} className="col-span-1 p-4 flex justify-center">
                            {broker.platforms.some(p => p.includes(platform.replace('Proprietary Platform', 'Platform'))) ? 
                              <CheckCircle className="h-5 w-5 text-green-500" /> : 
                              <XCircle className="h-5 w-5 text-red-500" />
                            }
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Trading Instruments Section */}
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <button 
                  className="w-full p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
                  onClick={() => toggleCategory('instruments')}
                >
                  <h3 className="text-lg font-semibold">Trading Instruments</h3>
                  {openCategory === 'instruments' ? 
                    <ChevronUp className="h-5 w-5" /> : 
                    <ChevronDown className="h-5 w-5" />
                  }
                </button>
                
                {openCategory === 'instruments' && (
                  <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {['Forex', 'Indices', 'Commodities', 'Stocks', 'Metals', 'Cryptocurrencies', 'Bonds', 'ETFs'].map((instrument) => (
                      <div key={instrument} className="grid grid-cols-4 divide-x divide-gray-200 dark:divide-gray-800">
                        <div className="col-span-1 p-4 font-medium">{instrument}</div>
                        {selectedBrokerDetails.map((broker) => (
                          <div key={broker.id} className="col-span-1 p-4 flex justify-center">
                            {broker.tradingInstruments.includes(instrument) ? 
                              <CheckCircle className="h-5 w-5 text-green-500" /> : 
                              <XCircle className="h-5 w-5 text-red-500" />
                            }
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Account Types Section */}
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <button 
                  className="w-full p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
                  onClick={() => toggleCategory('accounts')}
                >
                  <h3 className="text-lg font-semibold">Account Types</h3>
                  {openCategory === 'accounts' ? 
                    <ChevronUp className="h-5 w-5" /> : 
                    <ChevronDown className="h-5 w-5" />
                  }
                </button>
                
                {openCategory === 'accounts' && (
                  <div className="p-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-1 font-medium">Available Account Types</div>
                      {selectedBrokerDetails.map((broker) => (
                        <div key={broker.id} className="col-span-1">
                          <ul className="space-y-2">
                            {broker.accountTypes.map((type) => (
                              <li key={type} className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span className="text-sm">{type}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Deposit & Withdrawal Methods Section */}
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <button 
                  className="w-full p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
                  onClick={() => toggleCategory('depositWithdrawal')}
                >
                  <h3 className="text-lg font-semibold">Deposit & Withdrawal Methods</h3>
                  {openCategory === 'depositWithdrawal' ? 
                    <ChevronUp className="h-5 w-5" /> : 
                    <ChevronDown className="h-5 w-5" />
                  }
                </button>
                
                {openCategory === 'depositWithdrawal' && (
                  <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {['Credit/Debit Card', 'Bank Transfer', 'PayPal', 'Skrill', 'Neteller', 'Perfect Money', 'UnionPay'].map((method) => (
                      <div key={method} className="grid grid-cols-4 divide-x divide-gray-200 dark:divide-gray-800">
                        <div className="col-span-1 p-4 font-medium">{method}</div>
                        {selectedBrokerDetails.map((broker) => (
                          <div key={broker.id} className="col-span-1 p-4 flex justify-center">
                            {broker.depositMethods.includes(method) ? 
                              <CheckCircle className="h-5 w-5 text-green-500" /> : 
                              <XCircle className="h-5 w-5 text-red-500" />
                            }
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Customer Support Section */}
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <button 
                  className="w-full p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
                  onClick={() => toggleCategory('support')}
                >
                  <h3 className="text-lg font-semibold">Customer Support</h3>
                  {openCategory === 'support' ? 
                    <ChevronUp className="h-5 w-5" /> : 
                    <ChevronDown className="h-5 w-5" />
                  }
                </button>
                
                {openCategory === 'support' && (
                  <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {['Live Chat', 'Email', 'Phone', 'Callback', 'Multilingual Support', 'Weekend Support'].map((support) => (
                      <div key={support} className="grid grid-cols-4 divide-x divide-gray-200 dark:divide-gray-800">
                        <div className="col-span-1 p-4 font-medium">{support}</div>
                        {selectedBrokerDetails.map((broker) => (
                          <div key={broker.id} className="col-span-1 p-4 flex justify-center">
                            {broker.customerSupport.some(s => s.includes(support.replace('Weekend Support', 'Weekend'))) ? 
                              <CheckCircle className="h-5 w-5 text-green-500" /> : 
                              <XCircle className="h-5 w-5 text-red-500" />
                            }
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Education & Research Section */}
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <button 
                  className="w-full p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
                  onClick={() => toggleCategory('education')}
                >
                  <h3 className="text-lg font-semibold">Education & Research</h3>
                  {openCategory === 'education' ? 
                    <ChevronUp className="h-5 w-5" /> : 
                    <ChevronDown className="h-5 w-5" />
                  }
                </button>
                
                {openCategory === 'education' && (
                  <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {['Webinars', 'Video Tutorials', 'eBooks', 'Market Analysis', 'Trading Guides', 'Glossary', 'Economic Calendar'].map((resource) => (
                      <div key={resource} className="grid grid-cols-4 divide-x divide-gray-200 dark:divide-gray-800">
                        <div className="col-span-1 p-4 font-medium">{resource}</div>
                        {selectedBrokerDetails.map((broker) => (
                          <div key={broker.id} className="col-span-1 p-4 flex justify-center">
                            {broker.education.some(e => e.includes(resource)) ? 
                              <CheckCircle className="h-5 w-5 text-green-500" /> : 
                              <XCircle className="h-5 w-5 text-red-500" />
                            }
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Pros & Cons Section */}
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <button 
                  className="w-full p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
                  onClick={() => toggleCategory('prosCons')}
                >
                  <h3 className="text-lg font-semibold">Pros & Cons</h3>
                  {openCategory === 'prosCons' ? 
                    <ChevronUp className="h-5 w-5" /> : 
                    <ChevronDown className="h-5 w-5" />
                  }
                </button>
                
                {openCategory === 'prosCons' && (
                  <div className="p-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-1 font-medium">Strengths & Weaknesses</div>
                      {selectedBrokerDetails.map((broker) => (
                        <div key={broker.id} className="col-span-1">
                          <h4 className="text-sm font-medium text-green-600 dark:text-green-500 mb-2">Pros</h4>
                          <ul className="mb-4 space-y-2">
                            {broker.pros.map((pro, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{pro}</span>
                              </li>
                            ))}
                          </ul>
                          
                          <h4 className="text-sm font-medium text-red-600 dark:text-red-500 mb-2">Cons</h4>
                          <ul className="space-y-2">
                            {broker.cons.map((con, index) => (
                              <li key={index} className="flex items-start">
                                <XCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Final Verdict Section */}
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <button 
                  className="w-full p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
                  onClick={() => toggleCategory('verdict')}
                >
                  <h3 className="text-lg font-semibold">Final Verdict</h3>
                  {openCategory === 'verdict' ? 
                    <ChevronUp className="h-5 w-5" /> : 
                    <ChevronDown className="h-5 w-5" />
                  }
                </button>
                
                {openCategory === 'verdict' && (
                  <div className="p-4">
                    <div className="grid grid-cols-4 gap-6">
                      <div className="col-span-1 font-medium">Overall Assessment</div>
                      {selectedBrokerDetails.map((broker) => (
                        <div key={broker.id} className="col-span-1">
                          <div className="text-center mb-4">
                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 dark:bg-blue-900/20 mb-2">
                              <span className="text-2xl font-bold text-blue-600 dark:text-blue-500">{broker.rating}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Overall Rating</p>
                          </div>
                          
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                            {broker.name} is {broker.rating >= 4.7 ? 'an excellent' : broker.rating >= 4.5 ? 'a very good' : 'a good'} choice for 
                            {broker.minDeposit <= 50 ? ' beginners with its low minimum deposit' : ' traders looking for'} 
                            {broker.platforms.includes('cTrader') ? ' advanced platforms' : broker.platforms.length > 2 ? ' multiple platform options' : ' reliable trading'}.
                          </p>
                          
                          <div className="flex justify-center">
                            <Button size="sm" asChild>
                              <a href="#" target="_blank" rel="noopener noreferrer">
                                Visit Broker
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}