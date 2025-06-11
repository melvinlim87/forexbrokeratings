"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Gift, Timer, ArrowRight, Info, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Sample data - would come from API in real implementation
const promotions = [
  {
    id: 1,
    broker: 'XM',
    logo: 'https://images.pexels.com/photos/6771985/pexels-photo-6771985.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: '30% Welcome Bonus',
    description: 'Get up to $700 bonus on your first deposit',
    category: 'Welcome Bonus',
    featured: true,
    terms: [
      'Minimum deposit: $5',
      'Maximum bonus: $700',
      'Trading requirement: 5 standard lots',
      'Time limit: 30 days'
    ],
    validUntil: '2025-06-30',
    slug: 'xm'
  },
  {
    id: 2,
    broker: 'FXTM',
    logo: 'https://images.pexels.com/photos/7876439/pexels-photo-7876439.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: '100% Trading Bonus',
    description: 'Double your deposit up to $1000',
    category: 'Deposit Bonus',
    featured: true,
    terms: [
      'Minimum deposit: $100',
      'Maximum bonus: $1000',
      'Trading requirement: 10 standard lots',
      'Time limit: 60 days'
    ],
    validUntil: '2025-07-15',
    slug: 'fxtm'
  },
  {
    id: 3,
    broker: 'IronFX',
    logo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: 'Cashback Program',
    description: '$8 per standard lot traded',
    category: 'Cashback',
    featured: false,
    terms: [
      'Minimum deposit: $500',
      'Maximum cashback: Unlimited',
      'Trading requirement: 1 standard lot',
      'Monthly payout'
    ],
    validUntil: '2025-12-31',
    slug: 'ironfx'
  },
  {
    id: 4,
    broker: 'Pepperstone',
    logo: 'https://images.pexels.com/photos/8370578/pexels-photo-8370578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: 'Active Trader Program',
    description: 'Up to 15% commission rebates',
    category: 'Loyalty Program',
    featured: false,
    terms: [
      'Minimum volume: 100 lots/month',
      'Progressive rebate tiers',
      'Monthly rewards',
      'VIP account service'
    ],
    validUntil: '2025-12-31',
    slug: 'pepperstone'
  },
  {
    id: 5,
    broker: 'eToro',
    logo: 'https://images.pexels.com/photos/6802042/pexels-photo-6802042.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: 'Refer a Friend',
    description: 'Get $50 for each friend who joins',
    category: 'Referral',
    featured: true,
    terms: [
      'Friend must deposit $100',
      'Friend must trade $500 volume',
      'Maximum 10 referrals per month',
      'Bonus credited within 7 days'
    ],
    validUntil: '2025-09-30',
    slug: 'etoro'
  },
  {
    id: 6,
    broker: 'AvaTrade',
    logo: 'https://images.pexels.com/photos/5980743/pexels-photo-5980743.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: 'No Deposit Bonus',
    description: 'Start trading with $50 free',
    category: 'No Deposit Bonus',
    featured: false,
    terms: [
      'New clients only',
      'Trading requirement: 5 standard lots',
      'Maximum withdrawal: $100',
      'Time limit: 30 days'
    ],
    validUntil: '2025-08-15',
    slug: 'avatrade'
  },
  {
    id: 7,
    broker: 'IC Markets',
    logo: 'https://images.pexels.com/photos/6781351/pexels-photo-6781351.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: 'VIP Account Upgrade',
    description: 'Free upgrade to VIP status',
    category: 'VIP Program',
    featured: false,
    terms: [
      'Minimum deposit: $10,000',
      'Benefits: Dedicated account manager',
      'Lower spreads and commissions',
      'Priority withdrawal processing'
    ],
    validUntil: '2025-10-31',
    slug: 'icmarkets'
  },
  {
    id: 8,
    broker: 'FBS',
    logo: 'https://images.pexels.com/photos/5980856/pexels-photo-5980856.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: 'Trading Contest',
    description: 'Win up to $10,000 in monthly contest',
    category: 'Contest',
    featured: true,
    terms: [
      'Minimum deposit: $100',
      'Contest period: 1 month',
      'Winners selected by highest profit %',
      'Prizes distributed by 10th of next month'
    ],
    validUntil: '2025-12-31',
    slug: 'fbs'
  }
];

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'welcome-bonus', label: 'Welcome Bonus' },
  { value: 'deposit-bonus', label: 'Deposit Bonus' },
  { value: 'no-deposit-bonus', label: 'No Deposit Bonus' },
  { value: 'cashback', label: 'Cashback' },
  { value: 'loyalty-program', label: 'Loyalty Program' },
  { value: 'referral', label: 'Referral' },
  { value: 'vip-program', label: 'VIP Program' },
  { value: 'contest', label: 'Contest' }
];

export default function PromotionsPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPromotions = promotions.filter(promo => {
    const matchesSearch = promo.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         promo.broker.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         promo.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                           promo.category.toLowerCase().replace(' ', '-') === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/20 dark:to-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center justify-center p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
              <Gift className="h-6 w-6 text-amber-600 dark:text-amber-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Forex Broker Promotions
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Discover the best bonuses, rewards, and special offers from top forex brokers
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search promotions..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Promotions */}
      <section className="py-12 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Featured Promotions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPromotions
              .filter(promo => promo.featured)
              .map((promo, index) => (
                <PromotionCard 
                  key={promo.id} 
                  promo={promo} 
                  index={index} 
                  hoveredCard={hoveredCard}
                  setHoveredCard={setHoveredCard}
                />
              ))
            }
          </div>
        </div>
      </section>

      {/* All Promotions */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            All Promotions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPromotions.map((promo, index) => (
              <PromotionCard 
                key={promo.id} 
                promo={promo} 
                index={index} 
                hoveredCard={hoveredCard}
                setHoveredCard={setHoveredCard}
              />
            ))}
          </div>

          {filteredPromotions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No promotions found matching your criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function PromotionCard({ promo, index, hoveredCard, setHoveredCard }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onMouseEnter={() => setHoveredCard(promo.id)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <Card 
        className={cn(
          "overflow-hidden relative",
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
          "shadow-metallic hover:shadow-metallic-hover transition-all duration-300"
        )}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-20 relative bg-gray-100 dark:bg-gray-800 rounded">
              <Image
                src={promo.logo}
                alt={promo.broker}
                layout="fill"
                objectFit="contain"
                className="p-1"
              />
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <ul className="text-sm space-y-1">
                    {promo.terms.map((term, i) => (
                      <li key={i}>{term}</li>
                    ))}
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="mb-2">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
              {promo.category}
            </span>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {promo.title}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {promo.description}
          </p>

          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Timer className="h-4 w-4 mr-1" />
            <span>Valid until {new Date(promo.validUntil).toLocaleDateString('en-GB')}</span>
          </div>

          <Button className="w-full" asChild>
            <a href="#" target="_blank" rel="noopener noreferrer">
              Claim Bonus <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
