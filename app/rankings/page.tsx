"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Award, ArrowRight, Shield, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Sample data - would come from API in real implementation
const rankedBrokers = [
  {
    rank: 1,
    name: 'Pepperstone',
    logo: 'https://images.pexels.com/photos/8370578/pexels-photo-8370578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.9,
    minDeposit: 200,
    features: ['Raw spreads from 0.0 pips', 'Ultra-fast execution', 'Top-tier regulation'],
    regulations: ['FCA', 'ASIC', 'CySEC', 'BaFin', 'DFSA'],
    tradingPlatforms: ['MT4', 'MT5', 'cTrader'],
    pros: ['Excellent spreads', 'Fast execution', 'Advanced platform options'],
    cons: ['Higher minimum deposit', 'Limited educational content'],
    slug: 'pepperstone'
  },
  {
    rank: 2,
    name: 'IC Markets',
    logo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.8,
    minDeposit: 200,
    features: ['True ECN connectivity', 'Institutional liquidity', '500+ trading instruments'],
    regulations: ['ASIC', 'CySEC', 'FSA'],
    tradingPlatforms: ['MT4', 'MT5', 'cTrader'],
    pros: ['Deep liquidity', 'Low spreads', 'Fast execution speeds'],
    cons: ['Basic research tools', 'Limited educational content'],
    slug: 'ic-markets'
  },
  {
    rank: 3,
    name: 'XM',
    logo: 'https://images.pexels.com/photos/6771985/pexels-photo-6771985.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.7,
    minDeposit: 5,
    features: ['$5 minimum deposit', 'Extensive education', 'Multi-language support'],
    regulations: ['CySEC', 'ASIC', 'IFSC'],
    tradingPlatforms: ['MT4', 'MT5'],
    pros: ['Ultra-low minimum deposit', 'No deposit fees', 'Multi-language support'],
    cons: ['Average trading platform', 'Limited research tools'],
    slug: 'xm'
  }
];

export default function RankingsPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-metallic pt-28 pb-16 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Top Rated Forex Brokers
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Comprehensive rankings of the best forex brokers based on our detailed analysis and evaluation criteria.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          {rankedBrokers.map((broker, index) => (
            <motion.div
              key={broker.rank}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredCard(broker.rank)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card 
                className="overflow-hidden bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40 backdrop-blur-sm border-0 shadow-metallic hover:shadow-metallic-hover transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-3 lg:col-span-2 flex flex-col items-center justify-center">
                      <div className="text-4xl font-bold bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-400 dark:to-gray-200 bg-clip-text text-transparent mb-4">
                        #{broker.rank}
                      </div>
                      <div className="h-16 w-32 relative bg-gray-100 dark:bg-gray-800 rounded mb-3">
                        <Image
                          src={broker.logo}
                          alt={broker.name}
                          layout="fill"
                          objectFit="contain"
                          className="p-2"
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">
                        {broker.name}
                      </h3>
                      <div className="flex items-center">
                        <Award className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="font-medium">{broker.rating}</span>
                      </div>
                    </div>

                    <div className="md:col-span-7 lg:col-span-7">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Key Features
                          </h4>
                          <ul className="space-y-2">
                            {broker.features.map((feature, i) => (
                              <li key={i} className="flex items-start text-sm">
                                <TrendingUp className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                              Regulation
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {broker.regulations.map((reg) => (
                                <Badge 
                                  key={reg} 
                                  variant="outline"
                                  className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                                >
                                  <Shield className="h-3 w-3 mr-1" />
                                  {reg}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                              Trading Platforms
                            </h4>
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Pros
                          </h4>
                          <ul className="space-y-2">
                            {broker.pros.map((pro, i) => (
                              <li key={i} className="flex items-start text-sm">
                                <svg className="h-4 w-4 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Cons
                          </h4>
                          <ul className="space-y-2">
                            {broker.cons.map((con, i) => (
                              <li key={i} className="flex items-start text-sm">
                                <svg className="h-4 w-4 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2 lg:col-span-3 flex flex-col justify-center items-center md:items-end">
                      <div className="mb-4 text-center md:text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Min. Deposit</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          ${broker.minDeposit}
                        </p>
                      </div>

                      <div className="space-y-2 w-full">
                        <Button className="w-full" asChild>
                          <a href="#" target="_blank" rel="noopener noreferrer">
                            Visit Broker
                          </a>
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href={`/broker/${broker.slug}`}>
                            Read Review <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}