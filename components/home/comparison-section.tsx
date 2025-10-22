"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Check, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchAllBrokersWithPromotionCategories } from '@/lib/supabase';
import { useI18n } from '@/lib/i18n-client';

type Feature = {
  score?: number;
  label?: string;
  value?: string | boolean;
};

type BrokerFeatures = {
  [key: string]: Feature;
};

type Broker = {
  id: number;
  name: string;
  logo: string;
  features: BrokerFeatures;
  page: string;
  slug: string;
};

type ComparisonData = {
  'beginner-friendly': Broker[];
  'low-fees': Broker[];
  'advanced-trading': Broker[];
  'promotions': Broker[];
};

// Sample data - would come from API in real implementation
const brokerComparisonData: ComparisonData = {
  'beginner-friendly': [
    {
      id: 1,
      name: 'eToro',
      logo: 'https://images.pexels.com/photos/7876439/pexels-photo-7876439.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      features: {
        userInterface: { score: 9.5, label: 'Excellent' },
        educationalContent: { score: 9.8, label: 'Extensive' },
        demoAccount: { value: true },
        customerSupport: { score: 8.7, label: '24/7 Chat & Email' },
        minDeposit: { value: '$50' },
        mobileApp: { score: 9.2, label: 'iOS & Android' }
      },
      page: "https://www.etoro.com/",
      slug: "etoro"
    },
    {
      id: 2,
      name: 'Plus500',
      logo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      features: {
        userInterface: { score: 8.8, label: 'Very Good' },
        educationalContent: { score: 7.5, label: 'Good' },
        demoAccount: { value: true },
        customerSupport: { score: 7.9, label: '24/7 Chat' },
        minDeposit: { value: '$100' },
        mobileApp: { score: 8.7, label: 'iOS & Android' }
      },
      page: "https://www.plus500.com/",
      slug: "plus500"
    },
    {
      id: 3,
      name: 'FXTM',
      logo: 'https://images.pexels.com/photos/8370578/pexels-photo-8370578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      features: {
        userInterface: { score: 8.2, label: 'Good' },
        educationalContent: { score: 9.5, label: 'Excellent' },
        demoAccount: { value: true },
        customerSupport: { score: 9.0, label: '24/7 Multi-language' },
        minDeposit: { value: '$50' },
        mobileApp: { score: 8.5, label: 'iOS & Android' }
      },
      page: "https://www.fxtm.com/",
      slug: "fxtm"
    }
  ],
  'low-fees': [
    {
      id: 1,
      name: 'IC Markets',
      logo: 'https://via.placeholder.com/100x50?text=ICMarkets',
      features: {
        spreads: { value: 'From 0.0 pips' },
        commissions: { value: '$3.50 per lot' },
        overnightFees: { score: 8.5, label: 'Low' },
        depositFees: { value: 'Free' },
        withdrawalFees: { value: 'Free (some methods)' },
        inactivityFees: { value: 'None' }
      },
      page: "https://www.icmarkets.com/",
      slug: "icmarkets"
    },
    {
      id: 2,
      name: 'Pepperstone',
      logo: 'https://via.placeholder.com/100x50?text=Pepperstone',
      features: {
        spreads: { value: 'From 0.0 pips' },
        commissions: { value: '$3.50 per lot' },
        overnightFees: { score: 8.0, label: 'Low' },
        depositFees: { value: 'Free' },
        withdrawalFees: { value: 'Free' },
        inactivityFees: { value: 'None' }
      },
      page: "https://www.pepperstone.com/",
      slug: "pepperstone"
    },
    {
      id: 3,
      name: 'XM',
      logo: 'https://via.placeholder.com/100x50?text=XM',
      features: {
        spreads: { value: 'From 0.1 pips' },
        commissions: { value: 'Zero' },
        overnightFees: { score: 7.8, label: 'Average' },
        depositFees: { value: 'Free' },
        withdrawalFees: { value: 'Free (first monthly)' },
        inactivityFees: { value: 'After 90 days' }
      },
      page: "https://www.xm.com/",
      slug: "xm" 
    }
  ],
  'advanced-trading': [
    {
      id: 1,
      name: 'Saxo Bank',
      logo: 'https://via.placeholder.com/100x50?text=SaxoBank',
      features: {
        tradingPlatforms: { value: 'SaxoTraderGO, SaxoTraderPRO' },
        technicalTools: { score: 9.8, label: 'Extensive' },
        apiAccess: { value: true },
        tradingAlgorithms: { value: true },
        executionSpeed: { score: 9.5, label: 'Ultra-fast' },
        advancedOrderTypes: { score: 9.7, label: 'Comprehensive' }
      },
      page: "https://www.saxobank.com/",
      slug: "saxobank"
    },
    {
      id: 2,
      name: 'Interactive Brokers',
      logo: 'https://via.placeholder.com/100x50?text=IBKR',
      features: {
        tradingPlatforms: { value: 'TWS, IBKR Mobile' },
        technicalTools: { score: 9.7, label: 'Extensive' },
        apiAccess: { value: true },
        tradingAlgorithms: { value: true },
        executionSpeed: { score: 9.7, label: 'Ultra-fast' },
        advancedOrderTypes: { score: 9.9, label: 'Most extensive' }
      },
      page: "https://www.interactivebrokers.com/",
      slug: "interactivebrokers" 
    },
    {
      id: 3,
      name: 'Dukascopy',
      logo: 'https://via.placeholder.com/100x50?text=Dukascopy',
      features: {
        tradingPlatforms: { value: 'JForex, JForex Web' },
        technicalTools: { score: 9.5, label: 'Extensive' },
        apiAccess: { value: true },
        tradingAlgorithms: { value: true },
        executionSpeed: { score: 9.3, label: 'Very fast' },
        advancedOrderTypes: { score: 9.4, label: 'Very comprehensive' }
      },
      page: "https://www.dukascopy.com/",
      slug: "dukascopy"  
    }
  ],
  'promotions': [
    {
      id: 1,
      name: 'Saxo Bank',
      logo: 'https://via.placeholder.com/100x50?text=SaxoBank',
      features: {
        promotion: {value: 'Leverage, Bonuses'}
      },
      page: "https://www.saxobank.com/",
      slug: "saxobank"
    },
    {
      id: 2,
      name: 'Interactive Brokers',
      logo: 'https://via.placeholder.com/100x50?text=IBKR',
      features: {
        promotion: {value: 'Deposit Bonus, Cashback, Referral Bonus'}
      },
      page: "https://www.interactivebrokers.com/",
      slug: "interactivebrokers"   
    },
    {
      id: 3,
      name: 'Dukascopy',
      logo: 'https://via.placeholder.com/100x50?text=Dukascopy',
      features: {
        promotion: {value: 'Deposit Bonus, Leverage, Referral Bonus'}
      },
      page: "https://www.dukascopy.com/",
      slug: "dukascopy"  
    }
  ]
};

export default function ComparisonSection() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<keyof ComparisonData>('beginner-friendly');
  const [comparisonData, setComparisonData] = useState<ComparisonData>(brokerComparisonData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const data = await fetchAllBrokersWithPromotionCategories();
        
        if (!data || data.length === 0) {
          throw new Error('No broker data available');
        }
        
        // Parse arrays that might be stored as strings
        const parseArrayField = (field: string[] | string | null | undefined) => {
          if (!field) return [];
          if (Array.isArray(field)) return field;
          try {
            return JSON.parse(field);
          } catch {
            return [field];
          }
        };
        
        // Format and categorize brokers
        const formattedData: ComparisonData = {
          'beginner-friendly': [],
          'low-fees': [],
          'advanced-trading': [],
          'promotions': []
        };

        const beginnerBrokers = getRandomItems(data, 1);
        const lowFeesBrokers = getRandomItems(data, 1);
        const advancedBrokers = getRandomItems(data, 1);

        beginnerBrokers.forEach((broker: any, index: number) => {
          const formattedBroker: Broker = {
            id: broker.id,
            name: broker.name || `Broker ${index + 1}`,
            logo: broker.logo || `https://via.placeholder.com/100x50?text=${broker.name || 'Broker'}`,
            page: broker.website || '#',
            features: {
              userExperience: { score: broker.user_experience, label: broker.user_experience?.toString() },
              environment: { score: broker.environment, label: broker.environment?.toString() },
              user_traffic: { score: broker.user_traffic, label: broker.user_traffic?.toString() },
              riskControl: { score: broker.risk_control, label: broker.risk_control?.toString() },
              promotions: { score: broker.promotions, label: broker.promotions?.toString() },
              regulations: { score: broker.regulations, label: broker.regulations?.toString() }
            },
            slug: broker.name ? broker.name.toLowerCase().replace(/\s+/g, '-') : `broker-${index + 1}`
          };
          formattedData['beginner-friendly'].push(formattedBroker);
        });

        lowFeesBrokers.forEach((broker: any, index: number) => {
          const formattedBroker: Broker = {
            id: broker.id,
            name: broker.name || `Broker ${index + 1}`,
            logo: broker.logo || `https://via.placeholder.com/100x50?text=${broker.name || 'Broker'}`,
            page: broker.website || '#',
            features: {
              depositProcessTime: { value: broker.deposit_process_time },
              withdrawalProcessTime: { value: broker.withdrawal_process_time },
              minDeposit: { value: broker.min_deposit },
              minWithdrawl: { value: broker.min_withdrawl },
              availability: { value: broker.availability }
            },
            slug: broker.name ? broker.name.toLowerCase().replace(/\s+/g, '-') : `broker-${index + 1}`
          };
          formattedData['low-fees'].push(formattedBroker);
        });

        advancedBrokers.forEach((broker: any, index: number) => {
          const formattedBroker: Broker = {
            id: broker.id,
            name: broker.name || `Broker ${index + 1}`,
            logo: broker.logo || `https://via.placeholder.com/100x50?text=${broker.name || 'Broker'}`,
            page: broker.website || '#',
            features: {
              instruments: { value: Array.isArray(broker.instruments) ? broker.instruments.join(', ') : broker.instruments },
              baseCurrencies: { value: Array.isArray(broker.base_currencies) ? broker.base_currencies.join(', ') : broker.base_currencies },
              responseTime: { value: broker.response_time },
              spreadEurUsd: { value: broker.spread_eur_usd }
            },
            slug: broker.name ? broker.name.toLowerCase().replace(/\s+/g, '-') : `broker-${index + 1}`
          };
          formattedData['advanced-trading'].push(formattedBroker);
        });

        getRandomItems(data, 1).forEach((broker: any, index: number) => {
          const categories_tag = broker.promotion_categories.filter((value: any, index: any, self: any) => {
            return self.indexOf(value) === index;
          });
          const formattedBroker: Broker = {
            id: broker.id,
            name: broker.name || `Broker ${index + 1}`,
            logo: broker.logo || `https://via.placeholder.com/100x50?text=${broker.name || 'Broker'}`,
            page: broker.website || '#',
            features: {
              promotion: { value: typeof broker.promotions === 'number' ? broker.promotions : parseFloat(broker.promotions) || 0 },
              category: { value: categories_tag.join(', ') }
            },
            slug: broker.name ? broker.name.toLowerCase().replace(/\s+/g, '-') : `broker-${index + 1}`
          };
          formattedData['promotions'].push(formattedBroker);
        });

        setComparisonData(formattedData);
      } catch (err) {
        // console.error('Error fetching comparison brokers:', err);
        setError(t('home.comparison.failed_to_load'));
      } finally {
        setLoading(false);
      }
    }

    fetchBrokers();
  }, []);

  function getRandomItems<T extends { id?: number }>(arr: T[], n: number): T[] {
    const shuffled = arr.slice();
    const specificItems: T[] = [];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      if (shuffled[i].id === 28 || shuffled[i].id === 31) {
        specificItems.push(shuffled[i]);
      }
    }
    return specificItems.concat(shuffled.slice(0, n));
  }

  const getFeatureRows = () => {
    switch (activeTab) {
      case 'beginner-friendly':
        return [
          { key: 'userExperience', label: t('home.comparison.rows.user_experience') },
          { key: 'environment', label: t('home.comparison.rows.environment') },
          { key: 'user_traffic', label: t('home.comparison.rows.user_traffic') },
          { key: 'riskControl', label: t('home.comparison.rows.risk_control') },
          { key: 'promotions', label: t('home.comparison.rows.promotions') },
          { key: 'regulations', label: t('home.comparison.rows.regulations') }
        ];
      case 'low-fees':
        return [
          { key: 'depositProcessTime', label: t('home.comparison.rows.deposit_process_time') },
          { key: 'withdrawalProcessTime', label: t('home.comparison.rows.withdrawal_process_time') },
          { key: 'minDeposit', label: t('home.comparison.rows.min_deposit') },
          { key: 'minWithdrawl', label: t('home.comparison.rows.min_withdrawal') },
          { key: 'availability', label: t('home.comparison.rows.availability') }
        ];
      case 'advanced-trading':
        return [
          { key: 'instruments', label: t('home.comparison.rows.instruments') },
          { key: 'baseCurrencies', label: t('home.comparison.rows.base_currencies') },
          { key: 'responseTime', label: t('home.comparison.rows.response_time') },
          { key: 'spreadEurUsd', label: t('home.comparison.rows.spread_eur_usd') }
        ];
      case 'promotions':
        return [
          { key: 'promotion', label: t('home.comparison.rows.promotion') },
          { key: 'category', label: t('home.comparison.rows.category') },
        ];
      default:
        return [];
    }
  };

  const renderFeatureCell = (broker: Broker, featureKey: string) => {
    const feature = broker.features[featureKey];

    if (!feature) return <span className="text-sm md:text-lg font-medium text-gray-400">-</span>;
    
    if (typeof feature.value === 'boolean') {
      return feature.value ? 
        <Check className="h-5 w-5 text-green-500 mx-auto" /> : 
        <X className="h-5 w-5 text-red-500 mx-auto" />;
    }
    
    if (feature.value) {
      return <span className="text-sm md:text-lg font-medium">{feature.value}</span>;
    }
    
    // Support for 10-point data, scale to 5 stars
    if ((feature.score && feature.label) || (typeof feature.value === 'number' && feature.label === 'Rating')) {
      // Use score if present, else value
      let rawScore = feature.score ?? feature.value;
      if (typeof rawScore === 'string') {
        const parsed = parseFloat(rawScore);
        rawScore = isNaN(parsed) ? undefined : parsed;
      }
      if (typeof rawScore !== 'number' || isNaN(rawScore)) {
        return <span className="text-sm md:text-lg font-medium text-gray-400">-</span>;
      }
      // If score is out of 10, scale to 5
      // let score = rawScore > 5 ? (rawScore / 10) * 5 : rawScore;
      let score = rawScore > 5 ? (rawScore / 20) : rawScore;

      // console.log('rawScore',rawScore)
      score = Math.min(5, Math.max(0, score)); // Clamp between 0-5
      const fullStars = Math.floor(score);
      const hasHalfStar = score % 1 >= 0.25 && score % 1 < 0.75;
      const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
      return (
        <div className="flex flex-col items-center space-y-1">
          <div className="hidden md:flex justify-center items-center space-x-0.5">
            {/* Full stars */}
            {Array(fullStars).fill(0).map((_, i) => (<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
            {/* Half star */}
            {hasHalfStar && (
              <div className="relative h-4 w-4">
                <Star className="absolute h-4 w-4 text-gray-300" />
                <div className="absolute left-0 top-0 h-full w-1/2 overflow-hidden">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
            )}
            {/* Empty stars */}
            {Array(emptyStars).fill(0).map((_, i) => (
              <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
            ))}
          </div>
          {/* Mobile: show just score label */}
          <span className="block md:hidden text-sm font-medium text-gray-500">
            {(rawScore / 20).toFixed(2)}/5
          </span>
          {/* Desktop: show score label under stars */}
          <span className="hidden md:block text-sm md:text-lg font-medium text-gray-500">
            {(rawScore / 20).toFixed(2)}/5
          </span>
        </div>
      );
    }
    
    return <span className="text-sm md:text-lg font-medium">{feature.label}</span>;
  };

  return (
    <section className="py-16 bg-white w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{t('home.comparison.title')}</h2>
          <p className="mt-4 text-lg sm:text-md lg:text-lg text-gray-600">
            {t('home.comparison.subtitle')}
          </p>
        </div>
        
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as keyof ComparisonData)} className="w-full">
              <div className="bg-gray-100 px-4 py-4 sm:px-6">
                <TabsList
                  className="w-full bg-gray-200 
                    flex md:grid md:grid-cols-4
                    overflow-x-auto md:overflow-visible
                    no-scrollbar
                    rounded-lg
                    p-1
                    mb-2
                    md:mb-0
                    md:rounded-md
                    md:p-0  
                    ">
                  <TabsTrigger value="beginner-friendly" className="flex-none w-40 md:w-auto md:flex-1 text-xs md:text-base px-4 py-2 md:py-1.5 rounded-lg md:rounded-none">{t('home.comparison.tabs.beginner')}</TabsTrigger>
                  <TabsTrigger value="low-fees" className="flex-none w-40 md:w-auto md:flex-1 text-xs md:text-base px-4 py-2 md:py-1.5 rounded-lg md:rounded-none">{t('home.comparison.tabs.low_fees')}</TabsTrigger>
                  <TabsTrigger value="advanced-trading" className="flex-none w-40 md:w-auto md:flex-1 text-xs md:text-base px-4 py-2 md:py-1.5 rounded-lg md:rounded-none">{t('home.comparison.tabs.advanced_trading')}</TabsTrigger>
                  <TabsTrigger value="promotions" className="flex-none w-40 md:w-auto md:flex-1 text-xs md:text-base px-4 py-2 md:py-1.5 rounded-lg md:rounded-none">{t('home.comparison.tabs.promotions')}</TabsTrigger>
                </TabsList>
              </div>
              
              {(['beginner-friendly', 'low-fees', 'advanced-trading', 'promotions'] as const).map((tabValue) => (
                <TabsContent key={tabValue} value={tabValue} className="mt-0">
                  <div className="overflow-x-auto hidden md:block">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-white">
                          <th className="px-6 py-5 text-left text-lg sm:text-sm lg:text-lg font-medium text-gray-500 uppercase tracking-wider w-1/4">
                            {t('home.comparison.table.header_broker')}
                          </th>
                          {comparisonData[tabValue].map((broker) => (
                            <th key={broker.id} className="px-6 py-5 text-center">
                              <div className="flex flex-col items-center">
                                <div className="h-0 md:h-24 w-0 md:w-24 relative mb-2 rounded-xl">
                                  <a href={`/broker/${broker.slug}`} target="_blank" rel="noopener noreferrer">
                                    <Image
                                      src={broker.logo}
                                      alt={broker.name}
                                      fill
                                      className='rounded-xl'
                                      style={{ objectFit: "contain" }}
                                    />
                                  </a>
                                </div>
                                <span className="font-semibold text-lg sm:text-sm lg:text-lg text-gray-900">
                                  {broker.name}
                                </span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {getFeatureRows().map((row) => (
                          <tr key={row.key} className="bg-white">
                            <td className="px-6 py-4 text-sm md:text-lg font-medium text-gray-900">
                              {row.label}
                            </td>
                            {comparisonData[tabValue].map((broker) => (
                              <td key={broker.id} className="px-6 py-4 text-sm md:text-2xl text-center justify-center align-middle">
                                {renderFeatureCell(broker, row.key)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Mobile Cards (below md) */}
                  <div className="flex flex-col gap-4 md:hidden">
                    {comparisonData[tabValue].map((broker) => (
                      <div key={broker.id} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                            <a href={`/broker/${broker.slug}`} target="_blank" rel="noopener noreferrer">
                              {broker.logo ? (
                                <img src={broker.logo} alt={broker.name} className="w-full h-full object-contain" />
                              ) : (
                                <span className="text-lg font-bold text-black">{broker.name?.charAt(0)}</span>
                              )}
                            </a>
                          </div>
                          <div>
                            <div className="font-semibold text-black leading-tight">{broker.name}</div>
                          </div>
                        </div>
                        {getFeatureRows().map((row) => (
                          <div key={row.key} className="flex items-center gap-2 py-1 border-b border-gray-100 last:border-0">
                            <span className="text-gray-600 font-medium w-32 flex-shrink-0">{row.label}:</span>
                            <span className="text-gray-900">{renderFeatureCell(broker, row.key)}</span>
                          </div>
                        ))}
                        <div className="mt-3">
                          <Button size="sm" className="w-full" asChild>
                            <a
                              href={`/broker/${broker.slug}`}
                              target="_blank"
                              className="w-full inline-flex items-center justify-center gap-1 px-3 py-3 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-xs shadow hover:brightness-110 transition disabled:opacity-50"
                              rel="noopener noreferrer"
                            >
                              {t('home.hero.view_full_review')}
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
        
        {/* <div className="mt-12 max-w-7xl mx-auto ">
          <Button variant="outline" size="lg" asChild>
            <Link href="/compare">
              Create Custom Comparison <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div> */}
      </div>
    </section>
  );
}