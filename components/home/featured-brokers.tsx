"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Star, ArrowRight, Award, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Sample data - would come from API in real implementation
const featuredBrokers = [
  {
    rank: 1,
    name: 'IronFX',
    logo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.8,
    minDeposit: 100,
    platforms: ['MT4', 'MT5', 'WebTrader'],
    tradingInstruments: 500,
    isRegulated: true,
    regulations: ['FCA', 'CySEC', 'ASIC'],
    bestFor: 'Best Overall Forex Broker',
    description: 'Excellent all-round performance with competitive spreads and advanced trading tools',
    slug: 'ironfx'
  },
  {
    rank: 2,
    name: 'FXTM',
    logo: 'https://images.pexels.com/photos/7876439/pexels-photo-7876439.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.7,
    minDeposit: 50,
    platforms: ['MT4', 'MT5', 'FXTM Platform'],
    tradingInstruments: 450,
    isRegulated: true,
    regulations: ['FCA', 'CySEC'],
    bestFor: 'Best for Beginners',
    description: 'Outstanding educational resources and user-friendly trading platforms',
    slug: 'fxtm'
  },
  {
    rank: 3,
    name: 'Pepperstone',
    logo: 'https://images.pexels.com/photos/8370578/pexels-photo-8370578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.9,
    minDeposit: 200,
    platforms: ['MT4', 'MT5', 'cTrader'],
    tradingInstruments: 600,
    isRegulated: true,
    regulations: ['FCA', 'ASIC', 'CySEC', 'BaFin'],
    bestFor: 'Best for Professional Traders',
    description: 'Ultra-low spreads and institutional-grade liquidity',
    slug: 'pepperstone'
  },
  {
    rank: 4,
    name: 'IG',
    logo: 'https://images.pexels.com/photos/8370724/pexels-photo-8370724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.8,
    minDeposit: 250,
    platforms: ['MT4', 'L2 Dealer', 'ProRealTime', 'IG Platform'],
    tradingInstruments: 17000,
    isRegulated: true,
    regulations: ['FCA', 'ASIC', 'FSCA', 'BaFin'],
    bestFor: 'Best for Market Selection',
    description: 'Widest range of trading instruments and markets',
    slug: 'ig'
  },
  {
    rank: 5,
    name: 'XM',
    logo: 'https://images.pexels.com/photos/6771985/pexels-photo-6771985.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.7,
    minDeposit: 5,
    platforms: ['MT4', 'MT5', 'WebTrader'],
    tradingInstruments: 1000,
    isRegulated: true,
    regulations: ['CySEC', 'ASIC', 'IFSC'],
    bestFor: 'Best for Low Minimum Deposit',
    description: 'Ultra-low minimum deposit and multi-account options',
    slug: 'xm'
  },
  {
    rank: 6,
    name: 'eToro',
    logo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.6,
    minDeposit: 50,
    platforms: ['eToro Platform', 'Mobile App'],
    tradingInstruments: 2000,
    isRegulated: true,
    regulations: ['FCA', 'CySEC', 'ASIC'],
    bestFor: 'Best for Social Trading',
    description: 'Pioneer in social trading and copy trading features',
    slug: 'etoro'
  },
  {
    rank: 7,
    name: 'Interactive Brokers',
    logo: 'https://images.pexels.com/photos/8370578/pexels-photo-8370578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.8,
    minDeposit: 0,
    platforms: ['TWS', 'IBKR Mobile', 'Impact'],
    tradingInstruments: 25000,
    isRegulated: true,
    regulations: ['SEC', 'FCA', 'IIROC'],
    bestFor: 'Best for Advanced Tools',
    description: 'Comprehensive research and advanced trading platforms',
    slug: 'interactive-brokers'
  },
  {
    rank: 8,
    name: 'Saxo Bank',
    logo: 'https://images.pexels.com/photos/7876439/pexels-photo-7876439.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.7,
    minDeposit: 2000,
    platforms: ['SaxoTraderGO', 'SaxoTraderPRO'],
    tradingInstruments: 40000,
    isRegulated: true,
    regulations: ['FCA', 'MAS', 'FINMA'],
    bestFor: 'Best for Research',
    description: 'Premium research and institutional-grade platforms',
    slug: 'saxo-bank'
  },
  {
    rank: 9,
    name: 'CMC Markets',
    logo: 'https://images.pexels.com/photos/8370724/pexels-photo-8370724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.6,
    minDeposit: 0,
    platforms: ['Next Generation', 'MT4'],
    tradingInstruments: 10000,
    isRegulated: true,
    regulations: ['FCA', 'ASIC', 'MAS'],
    bestFor: 'Best for Platform Technology',
    description: 'Advanced proprietary trading platform with excellent features',
    slug: 'cmc-markets'
  },
  {
    rank: 10,
    name: 'OANDA',
    logo: 'https://images.pexels.com/photos/6771985/pexels-photo-6771985.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.5,
    minDeposit: 0,
    platforms: ['fxTrade', 'MT4'],
    tradingInstruments: 100,
    isRegulated: true,
    regulations: ['FCA', 'CySEC', 'MAS'],
    bestFor: 'Best for Transparency',
    description: 'Transparent pricing and excellent educational resources',
    slug: 'oanda'
  }
];

export default function FeaturedBrokers() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Top 10 Forex Brokers</h2>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
              Comprehensive ranking of the best forex brokers based on our detailed analysis.
            </p>
          </div>
          <Link href="/brokers" className="mt-4 md:mt-0 inline-flex items-center text-blue-600 dark:text-blue-500 font-medium hover:text-blue-800 dark:hover:text-blue-400">
            View all brokers <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredBrokers.map((broker, index) => (
            <motion.div
              key={broker.rank}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1
              }}
              onMouseEnter={() => setHoveredCard(broker.rank)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card 
                className={cn(
                  "h-full transition-all duration-300 overflow-hidden relative",
                  "bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40",
                  "backdrop-blur-sm",
                  "border-0",
                  "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]",
                  "before:absolute before:inset-0 before:p-[1px] before:rounded-lg before:-z-10",
                  "before:bg-gradient-to-br before:from-gray-300 before:via-gray-100 before:to-gray-400",
                  "dark:before:from-gray-600 dark:before:via-gray-700 dark:before:to-gray-800",
                  "after:absolute after:inset-0 after:p-[1px] after:rounded-lg after:-z-20",
                  "after:bg-gradient-to-br after:from-black/20 after:via-black/10 after:to-transparent",
                  "dark:after:from-black/30 dark:after:via-black/20 dark:after:to-transparent",
                  "shadow-metallic",
                  hoveredCard === broker.rank && [
                    "shadow-xl",
                    "shadow-metallic-hover",
                    "before:from-gray-400 before:via-gray-200 before:to-gray-500",
                    "dark:before:from-gray-500 dark:before:via-gray-600 dark:before:to-gray-700",
                    "after:from-black/30 after:via-black/20 after:to-transparent",
                    "dark:after:from-black/40 dark:after:via-black/30 dark:after:to-transparent"
                  ]
                )}
              >
                <CardContent className="p-6 flex items-center">
                  <div className="flex items-center w-12 mr-4">
                    <span className="text-3xl font-bold bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-400 dark:to-gray-200 bg-clip-text text-transparent">#{broker.rank}</span>
                  </div>
                  
                  <div className="flex-1 flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-12 w-24 relative bg-gray-100 dark:bg-gray-800 rounded">
                      <Image
                        src={broker.logo}
                        alt={broker.name}
                        layout="fill"
                        objectFit="contain"
                        className="p-1"
                        priority
                      />
                      </div>
                      <div className="flex items-center">
                        <div className="relative w-20 h-20 mr-3">
                          <svg viewBox="0 0 51 48" className="w-full h-full">
                            <defs>
                              <linearGradient id={`rating-gradient-${broker.rank}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#FFD700">
                                  <animate
                                    attributeName="stop-color"
                                    values="#FFD700;#FFA500;#FFD700"
                                    dur="2s"
                                    repeatCount="indefinite"
                                  />
                                </stop>
                                <stop offset="100%" stopColor="#FF8C00">
                                  <animate
                                    attributeName="stop-color"
                                    values="#FF8C00;#FFD700;#FF8C00"
                                    dur="2s"
                                    repeatCount="indefinite"
                                  />
                                </stop>
                              </linearGradient>
                              <filter id={`glow-${broker.rank}`}>
                                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                <feMerge>
                                  <feMergeNode in="coloredBlur"/>
                                  <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                              </filter>
                              <mask id={`rating-mask-${broker.rank}`}>
                                <path
                                  d="M25.5 0L31.8 18.5H51L35.7 29.9L42 48.4L25.5 36.9L9 48.4L15.3 29.9L0 18.5H19.2L25.5 0Z"
                                  fill="white"
                                />
                              </mask>
                            </defs>
                            {/* Background star */}
                            <path
                              d="M25.5 0L31.8 18.5H51L35.7 29.9L42 48.4L25.5 36.9L9 48.4L15.3 29.9L0 18.5H19.2L25.5 0Z"
                              className="fill-gray-200 dark:fill-gray-700"
                            />
                            {/* Filled star with gradient and mask for progress */}
                            <rect
                              x="0"
                              y="0"
                              width={`${(broker.rating / 5) * 100}%`}
                              height="100%"
                              fill={`url(#rating-gradient-${broker.rank})`}
                              mask={`url(#rating-mask-${broker.rank})`}
                              filter={`url(#glow-${broker.rank})`}
                            >
                              <animate
                                attributeName="width"
                                from="0"
                                to={`${(broker.rating / 5) * 100}%`}
                                dur="1s"
                                fill="freeze"
                              />
                            </rect>
                            {/* Rating text */}
                            <text
                              x="50%"
                              y="55%"
                              textAnchor="middle"
                              className="fill-gray-900 dark:fill-white font-bold text-xl"
                              style={{ 
                                filter: `url(#glow-${broker.rank})`,
                                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                              }}
                            />
                              {broker.rating.toFixed(1)}
                            </text>
                          </svg>
                        </div>
                        <Badge variant="secondary" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          Regulated
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <motion.h3 
                        className="text-xl font-semibold text-gray-900 dark:text-white mb-1"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: 0.2,
                          type: "spring",
                          stiffness: 150,
                          damping: 20
                        }}
                      >
                        {broker.name}
                      </motion.h3>
                      <motion.p 
                        className="font-medium text-gray-900 dark:text-white mb-1"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: 0.3,
                          type: "spring",
                          stiffness: 150,
                          damping: 20
                        }}
                      >{broker.bestFor}</motion.p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{broker.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-3 pt-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/broker/${broker.slug}`}>
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Full Review
                          </motion.span>
                        </Link>
                      </Button>
                      <Button size="sm" className="min-w-[100px]" asChild>
                        <a href="#" target="_blank" rel="noopener noreferrer">
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Visit Broker
                          </motion.span>
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}