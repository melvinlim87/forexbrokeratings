"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchAllBrokerDetails } from '@/lib/supabase';

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
};

type ComparisonData = {
  'beginner-friendly': Broker[];
  'low-fees': Broker[];
  'advanced-trading': Broker[];
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
      page: "https://www.etoro.com/"
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
      page: "https://www.plus500.com/"
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
      page: "https://www.fxtm.com/"
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
      page: "https://www.icmarkets.com/"
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
      page: "https://www.pepperstone.com/"
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
      page: "https://www.xm.com/" 
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
      page: "https://www.saxobank.com/"
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
      page: "https://www.interactivebrokers.com/" 
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
      page: "https://www.dukascopy.com/"  
    }
  ]
};

export default function ComparisonSection() {
  const [activeTab, setActiveTab] = useState<keyof ComparisonData>('beginner-friendly');
  const [comparisonData, setComparisonData] = useState<ComparisonData>(brokerComparisonData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchBrokers() {
      try {
        console.log('Fetching brokers for comparison section...');
        const data = await fetchAllBrokerDetails();
        
        if (!data || data.length === 0) {
          throw new Error('No broker data available');
        }
        
        console.log('Comparison brokers data:', data);
        
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
          'advanced-trading': []
        };
        
        // Take top 3 brokers for each category
        data.slice(0, 9).forEach((broker: any, index: number) => {
          const formattedBroker: Broker = {
            id: index + 1,
            name: broker.name || `Broker ${index + 1}`,
            logo: broker.logo || `https://via.placeholder.com/100x50?text=${broker.name || 'Broker'}`,
            page: broker.website || '#',
            features: {}
          };
          
          // Beginner-friendly features
          if (index < 3) {
            formattedBroker.features = {
              userInterface: { score: broker.userInterfaceScore || 8.0, label: broker.userInterfaceLabel || 'Good' },
              educationalContent: { score: broker.educationalContentScore || 8.0, label: broker.educationalContentLabel || 'Good' },
              demoAccount: { value: broker.hasDemoAccount !== false },
              customerSupport: { score: broker.customerSupportScore || 8.0, label: broker.customerSupportLabel || '24/7 Support' },
              minDeposit: { value: `$${broker.minDeposit || 100}` },
              mobileApp: { score: broker.mobileAppScore || 8.0, label: broker.mobileAppLabel || 'iOS & Android' }
            };
            formattedData['beginner-friendly'].push(formattedBroker);
          }
          
          // Low-fees features
          if (index >= 3 && index < 6) {
            formattedBroker.features = {
              spreads: { value: broker.spreads || 'From 1.0 pips' },
              commissions: { value: broker.commissions || 'Varies' },
              overnightFees: { score: broker.overnightFeesScore || 7.5, label: broker.overnightFeesLabel || 'Average' },
              depositFees: { value: broker.depositFees || 'Free' },
              withdrawalFees: { value: broker.withdrawalFees || 'Varies' },
              inactivityFees: { value: broker.inactivityFees || 'After 60 days' }
            };
            formattedData['low-fees'].push(formattedBroker);
          }
          
          // Advanced-trading features
          if (index >= 6 && index < 9) {
            formattedBroker.features = {
              tradingPlatforms: { value: parseArrayField(broker.platforms).join(', ') || 'MT4/MT5' },
              technicalTools: { score: broker.technicalToolsScore || 8.0, label: broker.technicalToolsLabel || 'Good' },
              fundamentalTools: { score: broker.fundamentalToolsScore || 8.0, label: broker.fundamentalToolsLabel || 'Good' },
              tradingAlgorithms: { value: broker.hasTradingAlgorithms !== false },
              executionSpeed: { score: broker.executionSpeedScore || 8.5, label: broker.executionSpeedLabel || 'Fast' },
              advancedOrderTypes: { score: broker.advancedOrderTypesScore || 8.0, label: broker.advancedOrderTypesLabel || 'Comprehensive' }
            };
            formattedData['advanced-trading'].push(formattedBroker);
          }
        });
        
        setComparisonData(formattedData);
      } catch (err) {
        console.error('Error fetching comparison brokers:', err);
        setError('Failed to load broker comparison data');
        // Keep using the fallback data
      } finally {
        setLoading(false);
      }
    }
    
    fetchBrokers();
  }, []);

  // Determine which feature fields to show based on active tab
  const getFeatureRows = () => {
    switch(activeTab) {
      case 'beginner-friendly':
        return [
          { key: 'userInterface', label: 'User Interface' },
          { key: 'educationalContent', label: 'Educational Content' },
          { key: 'demoAccount', label: 'Free Demo Account' },
          { key: 'customerSupport', label: 'Customer Support' },
          { key: 'minDeposit', label: 'Minimum Deposit' },
          { key: 'mobileApp', label: 'Mobile App' }
        ];
      case 'low-fees':
        return [
          { key: 'spreads', label: 'Spreads' },
          { key: 'commissions', label: 'Commissions' },
          { key: 'overnightFees', label: 'Overnight Fees' },
          { key: 'depositFees', label: 'Deposit Fees' },
          { key: 'withdrawalFees', label: 'Withdrawal Fees' },
          { key: 'inactivityFees', label: 'Inactivity Fees' }
        ];
      case 'advanced-trading':
        return [
          { key: 'tradingPlatforms', label: 'Trading Platforms' },
          { key: 'technicalTools', label: 'Technical Analysis Tools' },
          { key: 'apiAccess', label: 'API Access' },
          { key: 'tradingAlgorithms', label: 'Algorithmic Trading' },
          { key: 'executionSpeed', label: 'Execution Speed' },
          { key: 'advancedOrderTypes', label: 'Advanced Order Types' }
        ];
      default:
        return [];
    }
  };
  
  // Render appropriate cell content based on feature type
  const renderFeatureCell = (broker: Broker, featureKey: string) => {
    const feature = broker.features[featureKey];
    
    if (!feature) return <span className="text-gray-400">-</span>;
    
    if (typeof feature.value === 'boolean') {
      return feature.value ? 
        <Check className="h-5 w-5 text-green-500" /> : 
        <X className="h-5 w-5 text-red-500" />;
    }
    
    if (feature.value) {
      return <span className="font-medium">{feature.value}</span>;
    }
    
    if (feature.score && feature.label) {
      return (
        <div>
          <div className="font-medium">{feature.label}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{feature.score}/10</div>
        </div>
      );
    }
    
    return <span className="text-gray-400">-</span>;
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-950 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Compare Top Forex Brokers</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Find the perfect broker for your trading style with our detailed side-by-side comparisons.
          </p>
        </div>
        
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as keyof ComparisonData)} className="w-full">
              <div className="bg-gray-100 dark:bg-gray-800 px-4 py-4 sm:px-6">
                <TabsList className="w-full grid grid-cols-3 bg-gray-200 dark:bg-gray-700">
                  <TabsTrigger value="beginner-friendly">For Beginners</TabsTrigger>
                  <TabsTrigger value="low-fees">Lowest Fees</TabsTrigger>
                  <TabsTrigger value="advanced-trading">Advanced Trading</TabsTrigger>
                </TabsList>
              </div>
              
              {(['beginner-friendly', 'low-fees', 'advanced-trading'] as const).map((tabValue) => (
                <TabsContent key={tabValue} value={tabValue} className="mt-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-white dark:bg-gray-950">
                          <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/4">
                            Broker
                          </th>
                          {comparisonData[tabValue].map((broker) => (
                            <th key={broker.id} className="px-6 py-5 text-center">
                              <div className="flex flex-col items-center">
                                <div className="h-10 w-24 relative mb-2">
                                  <Image
                                    src={broker.logo}
                                    alt={broker.name}
                                    fill
                                    style={{ objectFit: "contain" }}
                                  />
                                </div>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  {broker.name}
                                </span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {getFeatureRows().map((row) => (
                          <tr key={row.key} className="bg-white dark:bg-gray-950">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                              {row.label}
                            </td>
                            {comparisonData[tabValue].map((broker) => (
                              <td key={broker.id} className="px-6 py-4 text-sm text-center">
                                {renderFeatureCell(broker, row.key)}
                              </td>
                            ))}
                          </tr>
                        ))}
                        <tr className="bg-white dark:bg-gray-950">
                          <td className="px-6 py-4"></td>
                          {comparisonData[tabValue].map((broker) => (
                            <td key={broker.id} className="px-6 py-4 text-center">
                              <Button size="sm" className="w-full" asChild>
                                <a href={broker.page} target="_blank" rel="noopener noreferrer">
                                  Visit Site
                                </a>
                              </Button>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="mt-12 max-w-7xl mx-auto">
          <Button variant="outline" size="lg" asChild>
            <Link href="/compare">
              Create Custom Comparison <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}