"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Star, 
  Shield, 
  Zap, 
  DollarSign, 
  Globe, 
  BarChart as BarChartIcon, 
  ChevronDown, 
  ChevronUp,
  CheckCircle,
  XCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { motion, useScroll, useSpring } from 'framer-motion';

// Sample data - would come from API in real implementation
const brokerData = {
  id: 1,
  name: 'IronFX',
  logo: 'https://via.placeholder.com/180x90?text=IronFX',
  rating: 4.2,
  minDeposit: 100,
  summary: 'IronFX offers forex and CFD trading on multiple platforms with a wide range of account types to suit different trading styles. They provide access to a good selection of markets with competitive spreads and solid customer support.',
  tradingInfo: {
    spreads: 'From 0.7 pips',
    leverage: 'Up to 1:500',
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'IronFX WebTrader'],
    instruments: ['Forex', 'Indices', 'Commodities', 'Stocks', 'Futures', 'Metals'],
    accountTypes: ['Micro', 'Premium', 'VIP', 'Zero Spread'],
    minTrade: '0.01 lots'
  },
  tradingFeatures: {
    executionSpeed: 'Average 0.128 seconds',
    orderTypes: ['Market', 'Limit', 'Stop', 'OCO', 'Trailing Stop'],
    hedging: true,
    scalping: true,
    expertAdvisors: true,
    api: false,
    demoAccount: true
  },
  scores: {
    overall: 4.2,
    tradingInstruments: 3.4,
    platforms: 4.4,
    fees: 3.8,
    security: 4.4,
    deposit: 3.4,
    customerService: 4.6
  },
  fees: {
    trading: {
      spread: 'Variable, from 0.7 pips',
      commission: 'Varies by account type',
      overnight: 'Varies by instrument'
    },
    nonTrading: {
      deposit: 'Free',
      withdrawal: 'Free (1 per month), $50 after',
      inactivity: '$50 after 6 months',
      account: 'No monthly fees'
    }
  },
  depositWithdrawal: {
    methods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'UnionPay'],
    depositTime: 'Instant (cards & e-wallets), 3-5 days (bank transfer)',
    withdrawalTime: '1-3 business days (e-wallets), 5-7 days (cards & bank)',
    baseCurrencies: ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD']
  },
  regulation: {
    primary: 'CySEC (Cyprus Securities and Exchange Commission)',
    additional: ['FCA (UK)', 'ASIC (Australia)', 'FSCA (South Africa)'],
    clientFunds: 'Segregated accounts in tier-1 banks',
    negativeBalanceProtection: true,
    investorCompensation: 'Up to €20,000 under CySEC',
    riskDisclosure: 'Full risk disclosure provided'
  },
  customerSupport: {
    channels: ['Live Chat', 'Email', 'Phone', 'Callback Request'],
    hours: '24/5',
    languages: ['English', 'Spanish', 'German', 'French', 'Italian', 'Arabic', 'Chinese'],
    quality: 'Responsive and knowledgeable',
    responseTime: 'Chat: < 1 minute, Email: < 24 hours'
  },
  education: {
    materials: ['Trading Guides', 'Video Tutorials', 'Webinars', 'eBooks', 'Glossary'],
    marketAnalysis: 'Daily market updates and technical analysis',
    demo: 'Unlimited demo account'
  },
  pros: [
    'Multiple regulation from top-tier authorities',
    'Wide range of trading platforms',
    'Extensive language support',
    'Competitive spreads on premium accounts',
    'Fast withdrawal processing'
  ],
  cons: [
    'Higher spreads on standard accounts',
    'Inactivity fee after 6 months',
    'Limited cryptocurrency offerings',
    'Advanced platforms not available on all account types'
  ],
  historicalData: [
    { month: 'Jan', spread: 1.2, execution: 0.18 },
    { month: 'Feb', spread: 1.1, execution: 0.15 },
    { month: 'Mar', spread: 0.9, execution: 0.14 },
    { month: 'Apr', spread: 0.8, execution: 0.13 },
    { month: 'May', spread: 0.7, execution: 0.12 },
    { month: 'Jun', spread: 0.8, execution: 0.13 },
  ],
  radarData: [
    { subject: 'Trading Tools', A: 85 },
    { subject: 'Research', A: 70 },
    { subject: 'Mobile App', A: 80 },
    { subject: 'Fees', A: 65 },
    { subject: 'Customer Service', A: 90 },
    { subject: 'Ease of Use', A: 75 },
  ]
};

const relatedBrokers = [
  {
    id: 2,
    name: 'FXTM',
    logo: 'https://via.placeholder.com/120x60?text=FXTM',
    rating: 4.7,
    minDeposit: 50,
    slug: 'fxtm'
  },
  {
    id: 3,
    name: 'XM',
    logo: 'https://via.placeholder.com/120x60?text=XM',
    rating: 4.5,
    minDeposit: 5,
    slug: 'xm'
  },
  {
    id: 4,
    name: 'Pepperstone',
    logo: 'https://via.placeholder.com/120x60?text=Pepperstone',
    rating: 4.9,
    minDeposit: 200,
    slug: 'pepperstone'
  }
];

// Add generateStaticParams function for static site generation
export function generateStaticParams() {
  // Include all broker slugs that should be pre-rendered
  return [
    { slug: 'ironfx' },
    { slug: 'fxtm' },
    { slug: 'xm' },
    { slug: 'pepperstone' }
  ];
}

export default function BrokerProfilePage({ params }: { params: { slug: string } }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // FAQ toggle handler
  const toggleFaq = (index: number) => {
    if (activeFaq === index) {
      setActiveFaq(null);
    } else {
      setActiveFaq(index);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Progress bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-500 z-50" 
        style={{ scaleX, transformOrigin: "0%" }}
      />
      
      {/* Broker header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-16 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center">
              <div className="h-16 w-32 relative bg-gray-100 dark:bg-gray-800 rounded mr-4">
                <Image
                  src={brokerData.logo}
                  alt={brokerData.name}
                  layout="fill"
                  objectFit="contain"
                  className="p-2"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{brokerData.name} Review</h1>
                <div className="flex items-center mt-1">
                  <div className="flex items-center mr-3">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="font-medium">{brokerData.scores.overall}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">/5</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                    Min ${brokerData.minDeposit}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 space-x-3 flex">
              <Button variant="outline" size="sm" asChild>
                <Link href="/compare">
                  Add to Compare
                </Link>
              </Button>
              <Button size="sm" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Visit Broker
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content column */}
          <div className="lg:col-span-2">
            {/* Overview section */}
            <section className="mb-8">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Broker Overview</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6">{brokerData.summary}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-5">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Shield className="h-5 w-5 text-green-600 dark:text-green-500 mr-2" />
                        Regulation
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Primary Regulator:</p>
                      <p className="font-medium text-gray-900 dark:text-white mb-3">{brokerData.regulation.primary}</p>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Additional Regulations:</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {brokerData.regulation.additional.map((reg) => (
                          <Badge key={reg} variant="outline" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                            {reg}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-start mt-2">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700 dark:text-gray-300 text-sm">Client funds held in segregated accounts</p>
                      </div>
                      
                      {brokerData.regulation.negativeBalanceProtection && (
                        <div className="flex items-start mt-2">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 dark:text-gray-300 text-sm">Negative balance protection</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-5">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-500 mr-2" />
                        Trading Details
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Min. Deposit</span>
                          <span className="font-medium text-gray-900 dark:text-white">${brokerData.minDeposit}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Spreads</span>
                          <span className="font-medium text-gray-900 dark:text-white">{brokerData.tradingInfo.spreads}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Leverage</span>
                          <span className="font-medium text-gray-900 dark:text-white">{brokerData.tradingInfo.leverage}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Min. Trade Size</span>
                          <span className="font-medium text-gray-900 dark:text-white">{brokerData.tradingInfo.minTrade}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Platforms</span>
                          <span className="font-medium text-gray-900 dark:text-white">{brokerData.tradingInfo.platforms.length}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Instruments</span>
                          <span className="font-medium text-gray-900 dark:text-white">{brokerData.tradingInfo.instruments.length} types</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Rating Breakdown</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <div className="relative h-24 w-24 mb-2">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl font-bold text-blue-600 dark:text-blue-500">{brokerData.scores.overall}</span>
                        </div>
                        <svg className="h-24 w-24 transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#E2E8F0"
                            strokeWidth="10"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="10"
                            strokeDasharray={`${2 * Math.PI * 45 * (brokerData.scores.overall / 5)} ${
                              2 * Math.PI * 45 * (1 - brokerData.scores.overall / 5)
                            }`}
                            className="text-blue-600 dark:text-blue-500"
                          />
                        </svg>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">Overall Rating</span>
                    </div>
                    
                    <div className="sm:col-span-2">
                      {Object.entries(brokerData.scores)
                        .filter(([key]) => key !== 'overall')
                        .map(([key, value]) => (
                          <div key={key} className="mb-3">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                              <div 
                                className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full" 
                                style={{ width: `${(value / 5) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="flex-1" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      Open Account
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" className="flex-1" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      Try Demo
                    </a>
                  </Button>
                </div>
              </div>
            </section>
            
            {/* Detailed information tabs */}
            <section className="mb-8">
              <Tabs defaultValue="platforms" className="w-full">
                <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto p-0 bg-gray-100 dark:bg-gray-800 rounded-t-lg">
                  <TabsTrigger value="platforms" className="py-3 rounded-none rounded-tl-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
                    Platforms
                  </TabsTrigger>
                  <TabsTrigger value="fees" className="py-3 rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
                    Fees
                  </TabsTrigger>
                  <TabsTrigger value="accounts" className="py-3 rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
                    Accounts
                  </TabsTrigger>
                  <TabsTrigger value="deposit" className="py-3 rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
                    Deposit & Withdrawal
                  </TabsTrigger>
                  <TabsTrigger value="research" className="py-3 rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
                    Research
                  </TabsTrigger>
                  <TabsTrigger value="support" className="py-3 rounded-none rounded-tr-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
                    Support
                  </TabsTrigger>
                </TabsList>
                
                <div className="bg-white dark:bg-gray-900 rounded-b-lg shadow-sm border border-gray-200 dark:border-gray-800 border-t-0">
                  <TabsContent value="platforms" className="p-6 mt-0">
                    <h3 className="text-xl font-semibold mb-4">Trading Platforms</h3>
                    <div className="space-y-6">
                      {brokerData.tradingInfo.platforms.map((platform, index) => (
                        <div key={index} className="border-b border-gray-200 dark:border-gray-800 last:border-0 pb-6 last:pb-0">
                          <h4 className="text-lg font-medium mb-3">{platform}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Features</h5>
                              <ul className="space-y-1">
                                <li className="flex items-start text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                                  <span className="text-gray-600 dark:text-gray-400">
                                    {platform === 'MetaTrader 4' ? 'Expert Advisors support' : 
                                     platform === 'MetaTrader 5' ? 'Advanced market depth' : 
                                     'Web-based, no download required'}
                                  </span>
                                </li>
                                <li className="flex items-start text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                                  <span className="text-gray-600 dark:text-gray-400">
                                    {platform === 'MetaTrader 4' ? 'Custom indicators' : 
                                     platform === 'MetaTrader 5' ? 'Economic calendar integration' : 
                                     'Quick trade execution'}
                                  </span>
                                </li>
                                <li className="flex items-start text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                                  <span className="text-gray-600 dark:text-gray-400">
                                    {platform === 'MetaTrader 4' ? 'Mobile app available' : 
                                     platform === 'MetaTrader 5' ? 'Multi-asset trading' : 
                                     'Compatible with all devices'}
                                  </span>
                                </li>
                              </ul>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Availability</h5>
                              <ul className="space-y-1">
                                <li className="flex items-start text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                                  <span className="text-gray-600 dark:text-gray-400">Windows</span>
                                </li>
                                <li className="flex items-start text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                                  <span className="text-gray-600 dark:text-gray-400">macOS</span>
                                </li>
                                <li className="flex items-start text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                                  <span className="text-gray-600 dark:text-gray-400">iOS & Android</span>
                                </li>
                                {platform.includes('Web') && (
                                  <li className="flex items-start text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                                    <span className="text-gray-600 dark:text-gray-400">Web Browser</span>
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold mb-4">Trading Features</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-base font-medium mb-3">Order Types & Execution</h4>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-40">Order Types:</span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {brokerData.tradingFeatures.orderTypes.join(', ')}
                              </span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-40">Execution Speed:</span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {brokerData.tradingFeatures.executionSpeed}
                              </span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-40">Hedging:</span>
                              <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                {brokerData.tradingFeatures.hedging ? 
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" /> : 
                                  <XCircle className="h-4 w-4 text-red-500 mr-1" />}
                                {brokerData.tradingFeatures.hedging ? 'Allowed' : 'Not Allowed'}
                              </span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-40">Scalping:</span>
                              <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                {brokerData.tradingFeatures.scalping ? 
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" /> : 
                                  <XCircle className="h-4 w-4 text-red-500 mr-1" />}
                                {brokerData.tradingFeatures.scalping ? 'Allowed' : 'Not Allowed'}
                              </span>
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-base font-medium mb-3">Automation & Tools</h4>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-40">Expert Advisors:</span>
                              <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                {brokerData.tradingFeatures.expertAdvisors ? 
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" /> : 
                                  <XCircle className="h-4 w-4 text-red-500 mr-1" />}
                                {brokerData.tradingFeatures.expertAdvisors ? 'Supported' : 'Not Supported'}
                              </span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-40">API Trading:</span>
                              <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                {brokerData.tradingFeatures.api ? 
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" /> : 
                                  <XCircle className="h-4 w-4 text-red-500 mr-1" />}
                                {brokerData.tradingFeatures.api ? 'Available' : 'Not Available'}
                              </span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-40">Demo Account:</span>
                              <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                {brokerData.tradingFeatures.demoAccount ? 
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" /> : 
                                  <XCircle className="h-4 w-4 text-red-500 mr-1" />}
                                {brokerData.tradingFeatures.demoAccount ? 'Available' : 'Not Available'}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="text-base font-medium mb-3">Historical Performance</h4>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={brokerData.historicalData}
                              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                              <XAxis dataKey="month" />
                              <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                              <YAxis yAxisId="right" orientation="right" stroke="#ef4444" />
                              <Tooltip />
                              <Legend />
                              <Line yAxisId="left" type="monotone" dataKey="spread" name="Avg. Spread (pips)" stroke="#3b82f6" activeDot={{ r: 8 }} />
                              <Line yAxisId="right" type="monotone" dataKey="execution" name="Execution Time (s)" stroke="#ef4444" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="fees" className="p-6 mt-0">
                    <h3 className="text-xl font-semibold mb-4">Fees & Commissions</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <Card>
                        <CardContent className="p-5">
                          <h4 className="text-lg font-medium mb-4">Trading Fees</h4>
                          <ul className="space-y-3">
                            <li className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Spreads</span>
                              <span className="font-medium text-gray-900 dark:text-white">{brokerData.fees.trading.spread}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Commission</span>
                              <span className="font-medium text-gray-900 dark:text-white">{brokerData.fees.trading.commission}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Overnight Fees</span>
                              <span className="font-medium text-gray-900 dark:text-white">{brokerData.fees.trading.overnight}</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-5">
                          <h4 className="text-lg font-medium mb-4">Non-Trading Fees</h4>
                          <ul className="space-y-3">
                            <li className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Deposit Fee</span>
                              <span className="font-medium text-gray-900 dark:text-white">{brokerData.fees.nonTrading.deposit}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Withdrawal Fee</span>
                              <span className="font-medium text-gray-900 dark:text-white">{brokerData.fees.nonTrading.withdrawal}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Inactivity Fee</span>
                              <span className="font-medium text-gray-900 dark:text-white">{brokerData.fees.nonTrading.inactivity}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Account Fee</span>
                              <span className="font-medium text-gray-900 dark:text-white">{brokerData.fees.nonTrading.account}</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <h4 className="text-lg font-medium mb-3">Fee Comparison</h4>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: 'EUR/USD', thisbroker: 0.7, average: 1.2 },
                            { name: 'GBP/USD', thisbroker: 0.9, average: 1.4 },
                            { name: 'USD/JPY', thisbroker: 0.8, average: 1.3 },
                            { name: 'AUD/USD', thisbroker: 1.0, average: 1.5 },
                            { name: 'USD/CHF', thisbroker: 1.1, average: 1.6 },
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="name" />
                          <YAxis label={{ value: 'Spread in Pips', angle: -90, position: 'insideLeft' }} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="thisbroker" name={`${brokerData.name} Spread`} fill="#3b82f6" />
                          <Bar dataKey="average" name="Industry Average" fill="#94a3b8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="accounts" className="p-6 mt-0">
                    <h3 className="text-xl font-semibold mb-4">Account Types</h3>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-100 dark:bg-gray-800">
                            <th className="py-3 px-4 text-left font-medium">Feature</th>
                            {brokerData.tradingInfo.accountTypes.map((type) => (
                              <th key={type} className="py-3 px-4 text-center font-medium">{type}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                          <tr>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">Min. Deposit</td>
                            <td className="py-3 px-4 text-center font-medium">$100</td>
                            <td className="py-3 px-4 text-center font-medium">$1,000</td>
                            <td className="py-3 px-4 text-center font-medium">$10,000</td>
                            <td className="py-3 px-4 text-center font-medium">$3,000</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">Spreads</td>
                            <td className="py-3 px-4 text-center font-medium">From 1.8 pips</td>
                            <td className="py-3 px-4 text-center font-medium">From 1.2 pips</td>
                            <td className="py-3 px-4 text-center font-medium">From 0.7 pips</td>
                            <td className="py-3 px-4 text-center font-medium">0 pips + $4 commission</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">Leverage</td>
                            <td className="py-3 px-4 text-center font-medium">Up to 1:500</td>
                            <td className="py-3 px-4 text-center font-medium">Up to 1:500</td>
                            <td className="py-3 px-4 text-center font-medium">Up to 1:500</td>
                            <td className="py-3 px-4 text-center font-medium">Up to 1:200</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">Platforms</td>
                            <td className="py-3 px-4 text-center font-medium">MT4, WebTrader</td>
                            <td className="py-3 px-4 text-center font-medium">MT4, MT5, WebTrader</td>
                            <td className="py-3 px-4 text-center font-medium">MT4, MT5, WebTrader</td>
                            <td className="py-3 px-4 text-center font-medium">MT4, MT5</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">Dedicated Support</td>
                            <td className="py-3 px-4 text-center">
                              <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                            </td>
                            <td className="py-3 px-4 text-center">
                              <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                            </td>
                            <td className="py-3 px-4 text-center">
                              <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                            </td>
                            <td className="py-3 px-4 text-center">
                              <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">Expert Analysis</td>
                            <td className="py-3 px-4 text-center">
                              <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                            </td>
                            <td className="py-3 px-4 text-center">
                              <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                            </td>
                            <td className="py-3 px-4 text-center">
                              <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                            </td>
                            <td className="py-3 px-4 text-center">
                              <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-8">
                      <h4 className="text-lg font-medium mb-3">Performance by Account Type</h4>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart outerRadius={90} data={[
                            { subject: 'Spreads', Micro: 50, Premium: 70, VIP: 90, ZeroSpread: 95 },
                            { subject: 'Execution', Micro: 70, Premium: 80, VIP: 90, ZeroSpread: 95 },
                            { subject: 'Platform Tools', Micro: 60, Premium: 75, VIP: 90, ZeroSpread: 80 },
                            { subject: 'Customer Support', Micro: 50, Premium: 80, VIP: 95, ZeroSpread: 75 },
                            { subject: 'Educational Resources', Micro: 60, Premium: 70, VIP: 80, ZeroSpread: 60 },
                            { subject: 'Pricing', Micro: 90, Premium: 70, VIP: 50, ZeroSpread: 60 },
                          ]}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis domain={[0, 100]} />
                            <Radar name="Micro" dataKey="Micro" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                            <Radar name="Premium" dataKey="Premium" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                            <Radar name="VIP" dataKey="VIP" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                            <Radar name="Zero Spread" dataKey="ZeroSpread" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                            <Legend />
                            <Tooltip />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="deposit" className="p-6 mt-0">
                    <h3 className="text-xl font-semibold mb-4">Deposits & Withdrawals</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <Card>
                        <CardContent className="p-5">
                          <h4 className="text-lg font-medium mb-4">Payment Methods</h4>
                          <ul className="space-y-3">
                            {brokerData.depositWithdrawal.methods.map((method, index) => (
                              <li key={index} className="flex items-center">
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                <span className="text-gray-700 dark:text-gray-300">{method}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-5">
                          <h4 className="text-lg font-medium mb-4">Processing Times</h4>
                          <ul className="space-y-3">
                            <li className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Deposit Time</span>
                              <span className="font-medium text-gray-900 dark:text-white">{brokerData.depositWithdrawal.depositTime}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Withdrawal Time</span>
                              <span className="font-medium text-gray-900 dark:text-white">{brokerData.depositWithdrawal.withdrawalTime}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Base Currencies</span>
                              <span className="font-medium text-gray-900 dark:text-white">{brokerData.depositWithdrawal.baseCurrencies.join(', ')}</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-5 mb-6">
                      <h4 className="text-lg font-medium mb-3 flex items-center text-blue-700 dark:text-blue-400">
                        <Shield className="h-5 w-5 mr-2" />
                        Fund Security
                      </h4>
                      <p className="text-blue-700 dark:text-blue-300 mb-3">
                        {brokerData.name} maintains client funds in segregated accounts at top-tier banks, providing an additional layer of security for your deposits.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 mr-2 mt-0.5" />
                          <span className="text-blue-700 dark:text-blue-300">Segregated client funds</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 mr-2 mt-0.5" />
                          <span className="text-blue-700 dark:text-blue-300">Negative balance protection</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 mr-2 mt-0.5" />
                          <span className="text-blue-700 dark:text-blue-300">Investor compensation scheme up to €20,000</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-5">
                      <h4 className="text-lg font-medium mb-3">Deposit & Withdrawal Methods Comparison</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800">
                              <th className="py-3 px-4 text-left font-medium">Method</th>
                              <th className="py-3 px-4 text-center font-medium">Deposit Fee</th>
                              <th className="py-3 px-4 text-center font-medium">Withdrawal Fee</th>
                              <th className="py-3 px-4 text-center font-medium">Processing Time</th>
                              <th className="py-3 px-4 text-center font-medium">Min Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            <tr>
                              <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Credit/Debit Card</td>
                              <td className="py-3 px-4 text-center font-medium text-green-600 dark:text-green-500">Free</td>
                              <td className="py-3 px-4 text-center font-medium text-green-600 dark:text-green-500">Free (1st monthly)</td>
                              <td className="py-3 px-4 text-center font-medium">Instant / 1-3 days</td>
                              <td className="py-3 px-4 text-center font-medium">$20</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Bank Wire</td>
                              <td className="py-3 px-4 text-center font-medium text-green-600 dark:text-green-500">Free</td>
                              <td className="py-3 px-4 text-center font-medium text-amber-600 dark:text-amber-500">$25</td>
                              <td className="py-3 px-4 text-center font-medium">3-5 days / 5-7 days</td>
                              <td className="py-3 px-4 text-center font-medium">$100</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Skrill</td>
                              <td className="py-3 px-4 text-center font-medium text-green-600 dark:text-green-500">Free</td>
                              <td className="py-3 px-4 text-center font-medium text-green-600 dark:text-green-500">Free</td>
                              <td className="py-3 px-4 text-center font-medium">Instant / 1 day</td>
                              <td className="py-3 px-4 text-center font-medium">$20</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Neteller</td>
                              <td className="py-3 px-4 text-center font-medium text-green-600 dark:text-green-500">Free</td>
                              <td className="py-3 px-4 text-center font-medium text-green-600 dark:text-green-500">Free</td>
                              <td className="py-3 px-4 text-center font-medium">Instant / 1 day</td>
                              <td className="py-3 px-4 text-center font-medium">$20</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="research" className="p-6 mt-0">
                    <h3 className="text-xl font-semibold mb-4">Research & Education</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <Card>
                        <CardContent className="p-5">
                          <h4 className="text-lg font-medium mb-4">Educational Resources</h4>
                          <ul className="space-y-3">
                            {brokerData.education.materials.map((material, index) => (
                              <li key={index} className="flex items-center">
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                <span className="text-gray-700 dark:text-gray-300">{material}</span>
                              </li>
                            ))}
                          </ul>
                          
                          <div className="mt-4">
                            <h5 className="text-base font-medium mb-2">Demo Account</h5>
                            <p className="text-gray-700 dark:text-gray-300">
                              {brokerData.education.demo}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-5">
                          <h4 className="text-lg font-medium mb-4">Market Analysis</h4>
                          <p className="text-gray-700 dark:text-gray-300 mb-4">
                            {brokerData.education.marketAnalysis}
                          </p>
                          
                          <h5 className="text-base font-medium mb-2">Analysis Tools</h5>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                              <span className="text-gray-700 dark:text-gray-300">Economic Calendar</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                              <span className="text-gray-700 dark:text-gray-300">Technical Analysis Tools</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                              <span className="text-gray-700 dark:text-gray-300">Daily Market Commentary</span>
                            </li>
                            <li className="flex items-start">
                              <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                              <span className="text-gray-700 dark:text-gray-300">Trading Signals</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-lg font-medium mb-4">Broker Performance Radar</h4>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart outerRadius={90} data={brokerData.radarData}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis domain={[0, 100]} />
                            <Radar name={brokerData.name} dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                            <Tooltip />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-5">
                      <h4 className="text-lg font-medium mb-3">Trading Tools & Calculators</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <h5 className="font-medium mb-2 flex items-center">
                            <BarChartIcon className="h-5 w-5 text-blue-600 dark:text-blue-500 mr-2" />
                            Pip Calculator
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Calculate the value of a pip in your account currency for any position size.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <h5 className="font-medium mb-2 flex items-center">
                            <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-500 mr-2" />
                            Margin Calculator
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Determine required margin for positions based on leverage and position size.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <h5 className="font-medium mb-2 flex items-center">
                            <Zap className="h-5 w-5 text-blue-600 dark:text-blue-500 mr-2" />
                            Profit Calculator
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Estimate potential profits or losses before executing trades.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <h5 className="font-medium mb-2 flex items-center">
                            <Globe className="h-5 w-5 text-blue-600 dark:text-blue-500 mr-2" />
                            Economic Calendar
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Stay updated on market-moving economic events and releases.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="support" className="p-6 mt-0">
                    <h3 className="text-xl font-semibold mb-4">Customer Support</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <Card>
                        <CardContent className="p-5">
                          <h4 className="text-lg font-medium mb-4">Contact Channels</h4>
                          <ul className="space-y-3">
                            {brokerData.customerSupport.channels.map((channel, index) => (
                              <li key={index} className="flex items-center">
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                <span className="text-gray-700 dark:text-gray-300">{channel}</span>
                              </li>
                            ))}
                          </ul>
                          
                          <div className="mt-4">
                            <h5 className="text-base font-medium mb-2">Availability</h5>
                            <p className="text-gray-700 dark:text-gray-300">
                              {brokerData.customerSupport.hours}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-5">
                          <h4 className="text-lg font-medium mb-4">Support Quality</h4>
                          <p className="text-gray-700 dark:text-gray-300 mb-4">
                            {brokerData.customerSupport.quality}
                          </p>
                          
                          <div className="space-y-3">
                            <div>
                              <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Response Time</h5>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {brokerData.customerSupport.responseTime}
                              </p>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Supported Languages</h5>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {brokerData.customerSupport.languages.join(', ')}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-lg font-medium mb-4">Support Quality Rating</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { name: 'Knowledge', score: 9.2 },
                              { name: 'Response Time', score: 8.5 },
                              { name: 'Friendliness', score: 9.5 },
                              { name: 'Issue Resolution', score: 8.8 },
                              { name: 'Language Support', score: 9.0 },
                            ]}
                            layout="vertical"
                            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis type="number" domain={[0, 10]} />
                            <YAxis dataKey="name" type="category" width={100} />
                            <Tooltip />
                            <Bar dataKey="score" fill="#3b82f6" label={{ position: 'right', fill: '#3b82f6', fontSize: 12 }} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-5">
                      <h4 className="text-lg font-medium mb-4">Frequently Asked Questions</h4>
                      <div className="space-y-3">
                        {[
                          { 
                            question: 'How do I open an account with IronFX?', 
                            answer: 'To open an account with IronFX, visit their official website and click on the "Open Account" button. You\'ll need to provide personal details, identity verification documents, and complete a financial suitability assessment. The process typically takes 1-2 business days for approval.' 
                          },
                          { 
                            question: 'What is the minimum deposit required?', 
                            answer: 'The minimum deposit for IronFX varies by account type. For a Micro account, the minimum deposit is $100. Premium accounts require $1,000, VIP accounts require $10,000, and Zero Spread accounts require $3,000.' 
                          },
                          { 
                            question: 'How do I withdraw funds from my account?', 
                            answer: 'To withdraw funds, log into your IronFX client portal, navigate to the "Withdraw" section, select your preferred withdrawal method, and enter the amount. Withdrawals are processed within 1-3 business days for e-wallets and 5-7 days for bank transfers and cards.' 
                          },
                          { 
                            question: 'Is IronFX regulated?', 
                            answer: 'Yes, IronFX is regulated by multiple financial authorities including CySEC (Cyprus), FCA (UK), ASIC (Australia), and FSCA (South Africa). This multi-jurisdiction regulation provides added security for traders and ensures compliance with international financial standards.' 
                          },
                        ].map((faq, index) => (
                          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                            <button
                              className="flex justify-between items-center w-full p-4 text-left font-medium text-gray-900 dark:text-white"
                              onClick={() => toggleFaq(index)}
                            >
                              <span>{faq.question}</span>
                              {activeFaq === index ? 
                                <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                                <ChevronDown className="h-5 w-5 text-gray-500" />
                              }
                            </button>
                            {activeFaq === index && (
                              <div className="p-4 pt-0 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
                                {faq.answer}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </section>
            
            {/* Pros & Cons */}
            <section className="mb-8">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Pros & Cons</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center text-green-600 dark:text-green-500">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Advantages
                    </h3>
                    <ul className="space-y-3">
                      {brokerData.pros.map((pro, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center text-red-600 dark:text-red-500">
                      <XCircle className="h-5 w-5 mr-2" />
                      Disadvantages
                    </h3>
                    <ul className="space-y-3">
                      {brokerData.cons.map((con, index) => (
                        <li key={index} className="flex items-start">
                          <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
            
            {/* CTA */}
            <section className="mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg p-8 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-6 md:mb-0 md:mr-8">
                    <h2 className="text-2xl font-bold mb-2">Ready to Trade with {brokerData.name}?</h2>
                    <p className="text-blue-100">
                      Open an account in minutes and start trading forex with a regulated broker.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50" asChild>
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        Open Live Account
                      </a>
                    </Button>
                    <Button variant="outline" size="lg" className="border-white text-white hover:bg-blue-700" asChild>
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        Try Demo Account
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick actions card */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6 sticky top-36">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Button className="w-full" size="lg" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    Open Account
                  </a>
                </Button>
                <Button variant="outline" className="w-full" size="lg" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    Try Demo Account
                  </a>
                </Button>
                <Button variant="secondary" className="w-full" asChild>
                  <Link href="/compare">
                    Add to Compare
                  </Link>
                </Button>
              </div>
              
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall Rating</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="font-medium">{brokerData.scores.overall}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">/5</span>
                  </div>
                </div>
                
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(brokerData.scores.overall / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Key Features</h4>
                <ul className="space-y-2">
                  <li className="flex items-start text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-400">Min. Deposit: ${brokerData.minDeposit}</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-400">Spreads: {brokerData.tradingInfo.spreads}</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-400">Leverage: {brokerData.tradingInfo.leverage}</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-400">Platforms: {brokerData.tradingInfo.platforms.join(', ')}</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Regulated By</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                    {brokerData.regulation.primary.split(' (')[0]}
                  </Badge>
                  {brokerData.regulation.additional.map((reg) => (
                    <Badge key={reg} variant="outline" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                      {reg.split(' (')[0]}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Broker Website</h4>
                <Button variant="outline" className="w-full" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                    Visit {brokerData.name}
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
            
            {/* Related brokers */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold mb-4">Similar Brokers</h3>
              
              <div className="space-y-4">
                {relatedBrokers.map((broker) => (
                  <Link key={broker.id} href={`/broker/${broker.slug}`}>
                    <div className="flex items-center p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                      <div className="h-10 w-20 relative bg-gray-100 dark:bg-gray-800 rounded mr-3">
                        <Image
                          src={broker.logo}
                          alt={broker.name}
                          layout="fill"
                          objectFit="contain"
                          className="p-1"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{broker.name}</h4>
                        <div className="flex items-center mt-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{broker.rating} • ${broker.minDeposit} min</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              <Button variant="link" className="mt-4 w-full" asChild>
                <Link href="/brokers">
                  View all brokers <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}