"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, ArrowRight, Award, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Sample data - would come from API in real implementation
const featuredBrokers = [
  {
    id: 1,
    name: 'IronFX',
    logo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.8,
    minDeposit: 100,
    platforms: ['MT4', 'MT5', 'WebTrader'],
    tradingInstruments: 500,
    isRegulated: true,
    regulations: ['FCA', 'CySEC', 'ASIC'],
    bestFor: 'Overall Trading Experience',
    slug: 'ironfx'
  },
  {
    id: 2,
    name: 'FXTM',
    logo: 'https://images.pexels.com/photos/7876439/pexels-photo-7876439.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.7,
    minDeposit: 50,
    platforms: ['MT4', 'MT5', 'FXTM Platform'],
    tradingInstruments: 450,
    isRegulated: true,
    regulations: ['FCA', 'CySEC'],
    bestFor: 'Educational Resources',
    slug: 'fxtm'
  },
  {
    id: 3,
    name: 'Pepperstone',
    logo: 'https://images.pexels.com/photos/8370578/pexels-photo-8370578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.9,
    minDeposit: 200,
    platforms: ['MT4', 'MT5', 'cTrader'],
    tradingInstruments: 600,
    isRegulated: true,
    regulations: ['FCA', 'ASIC', 'CySEC', 'BaFin'],
    bestFor: 'Low Spreads',
    slug: 'pepperstone'
  },
  {
    id: 4,
    name: 'IG',
    logo: 'https://images.pexels.com/photos/8370724/pexels-photo-8370724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.8,
    minDeposit: 250,
    platforms: ['MT4', 'L2 Dealer', 'ProRealTime', 'IG Platform'],
    tradingInstruments: 17000,
    isRegulated: true,
    regulations: ['FCA', 'ASIC', 'FSCA', 'BaFin'],
    bestFor: 'Variety of Markets',
    slug: 'ig'
  }
];

export default function FeaturedBrokers() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Forex Brokers</h2>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
              Our top-rated brokers selected based on regulation, reliability, fees, and trading experience.
            </p>
          </div>
          <Link href="/brokers" className="mt-4 md:mt-0 inline-flex items-center text-blue-600 dark:text-blue-500 font-medium hover:text-blue-800 dark:hover:text-blue-400">
            View all brokers <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBrokers.map((broker, index) => (
            <motion.div
              key={broker.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              onMouseEnter={() => setHoveredCard(broker.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card className={cn(
                "h-full transition-all duration-300 overflow-hidden", 
                hoveredCard === broker.id ? "shadow-lg border-blue-200 dark:border-blue-800" : ""
              )}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-24 relative bg-gray-100 dark:bg-gray-800 rounded">
                      <Image
                        src={broker.logo}
                        alt={broker.name}
                        layout="fill"
                        objectFit="contain"
                        className="p-1"
                      />
                    </div>
                    
                    <div className="flex items-center bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                      <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                      <span className="font-medium text-gray-900 dark:text-white">{broker.rating}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{broker.name}</h3>
                  
                  <div className="flex items-center mb-4">
                    <Badge variant="secondary" className="mr-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-100">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Regulated
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-100">
                      Min ${broker.minDeposit}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Platforms</p>
                      <p className="text-sm text-gray-900 dark:text-gray-200">{broker.platforms.slice(0, 3).join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Trading Instruments</p>
                      <p className="text-sm text-gray-900 dark:text-gray-200">{broker.tradingInstruments}+</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Best For</p>
                      <div className="flex items-center">
                        <Award className="h-4 w-4 text-amber-500 mr-1" />
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{broker.bestFor}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="px-6 pb-6 pt-2">
                  <div className="w-full space-y-2">
                    <Button className="w-full" asChild>
                      <Link href={`/broker/${broker.slug}`}>
                        View Full Review
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        Visit Broker
                      </a>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}