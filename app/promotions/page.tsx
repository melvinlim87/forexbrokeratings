'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Gift, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  ExternalLink,
  Star,
  Shield,
  Zap,
  Users,
  Award,
  Target,
  CheckCircle,
  AlertTriangle,
  Flame,
  Crown,
  Sparkles
} from 'lucide-react';
import Image from 'next/image';

interface Promotion {
  id: string;
  broker: {
    name: string;
    logo: string;
    rating: number;
    established: number;
    regulatedBy: string[];
  };
  promotion: {
    title: string;
    type: 'cash_bonus' | 'deposit_bonus' | 'no_deposit' | 'cashback' | 'vps' | 'spread_discount';
    value: string;
    description: string;
    requirements: string[];
    terms: string;
    validUntil: string;
    featured?: boolean;
  };
  benefits: string[];
  minDeposit: number;
  maxLeverage: string;
  platforms: string[];
}

const promotions: Promotion[] = [
  {
    id: 'rs-finance-featured',
    broker: {
      name: 'RS Finance',
      logo: 'https://images.pexels.com/photos/6801642/pexels-photo-6801642.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      rating: 4.8,
      established: 2018,
      regulatedBy: ['CySEC', 'FCA', 'ASIC']
    },
    promotion: {
      title: '$1,000 Cash Bonus',
      type: 'cash_bonus',
      value: 'Up to $1,000',
      description: 'Get instant cash bonus when you trade 10 lots within your first month. No strings attached - withdraw immediately after meeting requirements.',
      requirements: ['Trade 10 lots within 30 days', 'Minimum deposit $250', 'Complete account verification'],
      terms: 'New clients only. T&C apply.',
      validUntil: '2024-12-31',
      featured: true
    },
    benefits: ['Instant cash withdrawal', 'No trading restrictions', 'Professional support', 'Advanced trading tools'],
    minDeposit: 250,
    maxLeverage: '1:400',
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'WebTrader']
  },
  {
    id: 'ic-markets-vps',
    broker: {
      name: 'IC Markets',
      logo: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      rating: 4.9,
      established: 2007,
      regulatedBy: ['ASIC', 'CySEC', 'FSA']
    },
    promotion: {
      title: 'Free VPS Hosting',
      type: 'vps',
      value: 'Worth $30/month',
      description: 'Get complimentary Virtual Private Server hosting for ultra-fast execution and 24/7 uptime. Perfect for algorithmic trading and scalping strategies.',
      requirements: ['Minimum deposit $1,000', 'Trade 5 lots per month', 'Maintain account balance above $500'],
      terms: 'VPS provided by BeeksFX. Fair usage policy applies.',
      validUntil: 'Ongoing'
    },
    benefits: ['Ultra-low latency', '99.9% uptime guarantee', 'Pre-installed MT4/MT5', '24/7 technical support'],
    minDeposit: 1000,
    maxLeverage: '1:500',
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'cTrader']
  },
  {
    id: 'xm-no-deposit',
    broker: {
      name: 'XM Group',
      logo: 'https://images.pexels.com/photos/6801642/pexels-photo-6801642.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      rating: 4.7,
      established: 2009,
      regulatedBy: ['CySEC', 'IFSC', 'ASIC']
    },
    promotion: {
      title: '$30 No Deposit Bonus',
      type: 'no_deposit',
      value: '$30 Free',
      description: 'Start trading immediately with $30 free bonus. No deposit required - just verify your account and start trading with real money.',
      requirements: ['Complete account verification', 'No deposit required', 'Trade within 30 days'],
      terms: 'Profits withdrawable after trading 5 micro lots. Max withdrawal $100.',
      validUntil: 'Ongoing'
    },
    benefits: ['No deposit required', 'Real trading conditions', 'Keep your profits', 'Educational resources'],
    minDeposit: 0,
    maxLeverage: '1:888',
    platforms: ['MetaTrader 4', 'MetaTrader 5']
  },
  {
    id: 'pepperstone-cashback',
    broker: {
      name: 'Pepperstone',
      logo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      rating: 4.8,
      established: 2010,
      regulatedBy: ['ASIC', 'FCA', 'CySEC', 'BaFin']
    },
    promotion: {
      title: 'Smart Trader Cashback',
      type: 'cashback',
      value: 'Up to $5 per lot',
      description: 'Earn cashback on every trade with Smart Trader Tools. The more you trade, the more you earn back automatically.',
      requirements: ['Use Smart Trader Tools', 'Trade minimum 1 lot per month', 'Maintain active account'],
      terms: 'Cashback credited monthly. Minimum payout $10.',
      validUntil: 'Ongoing'
    },
    benefits: ['Automatic cashback', 'No minimum volume', 'Monthly payments', 'Smart trading tools included'],
    minDeposit: 0,
    maxLeverage: '1:400',
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'cTrader', 'TradingView']
  },
  {
    id: 'fp-markets-deposit',
    broker: {
      name: 'FP Markets',
      logo: 'https://images.pexels.com/photos/7413915/pexels-photo-7413915.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      rating: 4.8,
      established: 2005,
      regulatedBy: ['ASIC', 'CySEC']
    },
    promotion: {
      title: '100% Deposit Bonus',
      type: 'deposit_bonus',
      value: 'Up to $500',
      description: 'Double your trading capital with 100% deposit bonus. Trade with twice the buying power and maximize your profit potential.',
      requirements: ['Minimum deposit $100', 'Trade 10 lots within 60 days', 'Complete account verification'],
      terms: 'Bonus cannot be withdrawn. Profits from bonus trades are withdrawable.',
      validUntil: '2024-11-30'
    },
    benefits: ['Double trading capital', 'All profits withdrawable', 'Copy trading available', 'Professional support'],
    minDeposit: 100,
    maxLeverage: '1:500',
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'IRESS']
  },
  {
    id: 'avatrade-education',
    broker: {
      name: 'AvaTrade',
      logo: 'https://images.pexels.com/photos/8370421/pexels-photo-8370421.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      rating: 4.6,
      established: 2006,
      regulatedBy: ['CBI', 'ASIC', 'FSA', 'FSCA']
    },
    promotion: {
      title: 'Welcome Bonus Package',
      type: 'deposit_bonus',
      value: 'Up to $10,000',
      description: 'Comprehensive welcome package including deposit bonus, free education, and Trading Central signals for new traders.',
      requirements: ['Minimum deposit $100', 'Complete trading course', 'Trade 5 lots within 90 days'],
      terms: 'Bonus terms vary by region. Educational materials included.',
      validUntil: 'Ongoing'
    },
    benefits: ['Trading education included', 'Trading Central signals', 'Multi-platform access', 'Dedicated support'],
    minDeposit: 100,
    maxLeverage: '1:400',
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'AvaTradeGO']
  },
  {
    id: 'exness-unlimited',
    broker: {
      name: 'Exness',
      logo: 'https://images.pexels.com/photos/7567526/pexels-photo-7567526.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      rating: 4.5,
      established: 2008,
      regulatedBy: ['CySEC', 'FCA', 'FSA']
    },
    promotion: {
      title: 'Unlimited Leverage',
      type: 'spread_discount',
      value: 'Up to 1:2000',
      description: 'Trade with unlimited leverage for qualified accounts. Perfect for experienced traders looking for maximum capital efficiency.',
      requirements: ['Complete 10 trades', 'Pass trading assessment', 'Maintain good trading history'],
      terms: 'Available for experienced traders only. Risk management required.',
      validUntil: 'Ongoing'
    },
    benefits: ['Unlimited leverage potential', 'Instant withdrawals', 'Professional accounts', 'Advanced risk management'],
    minDeposit: 1,
    maxLeverage: '1:2000',
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'Exness Terminal']
  },
  {
    id: 'hotforex-copy',
    broker: {
      name: 'HotForex',
      logo: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      rating: 4.4,
      established: 2010,
      regulatedBy: ['CySEC', 'FSA', 'FSCA']
    },
    promotion: {
      title: 'Copy Trading Bonus',
      type: 'deposit_bonus',
      value: 'Up to $2,000',
      description: 'Special bonus for copy trading accounts. Follow successful traders and earn bonus on your deposits for copy trading activities.',
      requirements: ['Minimum deposit $500', 'Copy at least 3 traders', 'Maintain copy trading for 30 days'],
      terms: 'Bonus applicable to copy trading only. Performance fees may apply.',
      validUntil: '2024-12-15'
    },
    benefits: ['Copy successful traders', 'Performance tracking', 'Risk management tools', 'Social trading community'],
    minDeposit: 500,
    maxLeverage: '1:1000',
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'HotForex App']
  }
];

const getPromotionIcon = (type: string) => {
  switch (type) {
    case 'cash_bonus': return DollarSign;
    case 'deposit_bonus': return TrendingUp;
    case 'no_deposit': return Gift;
    case 'cashback': return Target;
    case 'vps': return Zap;
    case 'spread_discount': return Award;
    default: return Gift;
  }
};

const getPromotionGradient = (type: string) => {
  switch (type) {
    case 'cash_bonus': return 'from-emerald-500 to-teal-500';
    case 'deposit_bonus': return 'from-blue-500 to-cyan-500';
    case 'no_deposit': return 'from-purple-500 to-pink-500';
    case 'cashback': return 'from-orange-500 to-red-500';
    case 'vps': return 'from-indigo-500 to-purple-500';
    case 'spread_discount': return 'from-violet-500 to-purple-500';
    default: return 'from-gray-500 to-gray-600';
  }
};

export default function PromotionsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const featuredPromotion = promotions.find(p => p.promotion.featured);
  const regularPromotions = promotions.filter(p => !p.promotion.featured);

  const filteredPromotions = selectedCategory === 'all' 
    ? regularPromotions 
    : regularPromotions.filter(p => p.promotion.type === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-black">
      {/* Header */}
      <section className="py-20 bg-gradient-to-r from-cyan-900/50 to-purple-900/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <Gift className="w-12 h-12 text-cyan-400 mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                FX Broker <span className="text-cyan-400">Promotions</span>
              </h1>
            </div>
            <p className="text-xl text-cyan-100 max-w-3xl mx-auto leading-relaxed mb-8">
              Discover exclusive bonuses, cashback offers, and special promotions from top-rated forex brokers. 
              Maximize your trading potential with verified deals.
            </p>
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">{promotions.length}+</div>
                <div className="text-cyan-200">Active Promotions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">$50K+</div>
                <div className="text-cyan-200">Total Bonus Value</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">Verified</div>
                <div className="text-cyan-200">All Offers</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Promotion - RS Finance */}
      {featuredPromotion && (
        <section className="py-16 bg-gradient-to-b from-black/20 to-transparent">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center mb-6">
                <Crown className="w-8 h-8 text-emerald-400 mr-3" />
                <h2 className="text-3xl font-bold text-white">
                  <span className="text-emerald-400">Top Promotion</span> of the Month
                </h2>
                <Sparkles className="w-8 h-8 text-emerald-400 ml-3" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <Card className="overflow-hidden bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-blue-500/10 backdrop-blur-sm border-2 border-emerald-400/50 shadow-2xl shadow-emerald-500/20">
                {/* Featured Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-none px-4 py-2 text-sm font-bold shadow-lg">
                    <Flame className="w-4 h-4 mr-2" />
                    FEATURED PROMOTION
                  </Badge>
                </div>

                <CardContent className="p-8 md:p-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Left Side - Content */}
                    <div>
                      <div className="flex items-center mb-6">
                        <Image
                          src={featuredPromotion.broker.logo}
                          alt={featuredPromotion.broker.name}
                          width={64}
                          height={64}
                          className="rounded-full mr-4 ring-4 ring-emerald-400/30"
                        />
                        <div>
                          <h3 className="text-2xl font-bold text-white">{featuredPromotion.broker.name}</h3>
                          <div className="flex items-center">
                            <Star className="w-5 h-5 fill-emerald-400 text-emerald-400 mr-1" />
                            <span className="text-emerald-200 font-medium">{featuredPromotion.broker.rating}/5</span>
                            <span className="text-white/60 ml-2">• Est. {featuredPromotion.broker.established}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-4xl md:text-5xl font-bold text-white mb-2">
                          {featuredPromotion.promotion.title}
                        </h4>
                        <p className="text-xl text-cyan-100 mb-4">
                          {featuredPromotion.promotion.description}
                        </p>
                        <div className="text-3xl font-bold text-emerald-400 mb-4">
                          {featuredPromotion.promotion.value}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {featuredPromotion.benefits.slice(0, 4).map((benefit, index) => (
                          <div key={index} className="flex items-center text-cyan-100">
                            <CheckCircle className="w-5 h-5 text-emerald-400 mr-2 flex-shrink-0" />
                            <span className="text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>

                      <Button 
                        size="lg"
                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105"
                      >
                        <ExternalLink className="w-5 h-5 mr-2" />
                        Claim $1,000 Bonus Now
                      </Button>
                    </div>

                    {/* Right Side - Details */}
                    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-emerald-400/20">
                      <h5 className="text-xl font-bold text-white mb-4 flex items-center">
                        <AlertTriangle className="w-5 h-5 text-emerald-400 mr-2" />
                        Promotion Details
                      </h5>
                      
                      <div className="space-y-4">
                        <div>
                          <h6 className="text-emerald-400 font-semibold mb-2">Requirements:</h6>
                          <ul className="space-y-1">
                            {featuredPromotion.promotion.requirements.map((req, index) => (
                              <li key={index} className="text-cyan-100 text-sm flex items-start">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Bonus Structure */}
                        <div>
                          <h6 className="text-emerald-400 font-semibold mb-3">Bonus Structure:</h6>
                          <div className="space-y-3">
                            <div className="bg-emerald-500/10 border border-emerald-400/20 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-white font-medium text-sm">$2,000 Deposit</span>
                                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
                                  Standard
                                </Badge>
                              </div>
                              <p className="text-cyan-200 text-xs">Every 10 lots = $250 bonus</p>
                            </div>
                            
                            <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-white font-medium text-sm">$5,000 Deposit</span>
                                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs">
                                  Premium
                                </Badge>
                              </div>
                              <p className="text-cyan-200 text-xs">Every 5 lots = $250 bonus</p>
                            </div>
                            
                            <div className="bg-purple-500/10 border border-purple-400/20 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-white font-medium text-sm">$20,000 Deposit</span>
                                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                                  VIP
                                </Badge>
                              </div>
                              <p className="text-cyan-200 text-xs">Every 2.5 lots = $250 bonus</p>
                            </div>
                          </div>
                          <p className="text-emerald-300 text-xs mt-2 font-medium">
                            Maximum bonus: $1,000 total
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-emerald-400 text-sm">Min Deposit:</span>
                            <div className="text-white font-bold">$2,000</div>
                          </div>
                          <div>
                            <span className="text-emerald-400 text-sm">Max Leverage:</span>
                            <div className="text-white font-bold">{featuredPromotion.maxLeverage}</div>
                          </div>
                        </div>

                        <div>
                          <span className="text-emerald-400 text-sm">Regulated By:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {featuredPromotion.broker.regulatedBy.map((reg) => (
                              <Badge key={reg} className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
                                {reg}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-emerald-400/20">
                          <p className="text-cyan-200 text-xs">
                            <strong>Terms:</strong> New clients only. Bonus earned progressively based on trading volume. Higher deposits unlock better bonus rates. T&C apply.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      )}

      {/* All Promotions */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              All <span className="text-cyan-400">Broker Promotions</span>
            </h2>

            {/* Category Filter */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
              <TabsList className="grid w-full grid-cols-7 bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
                <TabsTrigger value="all" className="text-white data-[state=active]:bg-white/20">All</TabsTrigger>
                <TabsTrigger value="cash_bonus" className="text-white data-[state=active]:bg-white/20">Cash Bonus</TabsTrigger>
                <TabsTrigger value="deposit_bonus" className="text-white data-[state=active]:bg-white/20">Deposit Bonus</TabsTrigger>
                <TabsTrigger value="no_deposit" className="text-white data-[state=active]:bg-white/20">No Deposit</TabsTrigger>
                <TabsTrigger value="cashback" className="text-white data-[state=active]:bg-white/20">Cashback</TabsTrigger>
                <TabsTrigger value="vps" className="text-white data-[state=active]:bg-white/20">VPS</TabsTrigger>
                <TabsTrigger value="spread_discount" className="text-white data-[state=active]:bg-white/20">Special</TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>

          {/* Promotions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPromotions.map((item, index) => {
              const PromotionIcon = getPromotionIcon(item.promotion.type);
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="group h-full"
                >
                  <Card className="h-full bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border-white/20 hover:border-cyan-400/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-cyan-500/10 overflow-hidden">
                    <CardContent className="p-6 h-full flex flex-col">
                      {/* Promotion Type Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <Badge className={`bg-gradient-to-r ${getPromotionGradient(item.promotion.type)} text-white border-none px-3 py-1 text-xs font-bold`}>
                          <PromotionIcon className="w-3 h-3 mr-1" />
                          {item.promotion.type.replace('_', ' ').toUpperCase()}
                        </Badge>
                        {item.promotion.validUntil !== 'Ongoing' && (
                          <div className="flex items-center text-xs text-orange-400">
                            <Clock className="w-3 h-3 mr-1" />
                            Until {item.promotion.validUntil}
                          </div>
                        )}
                      </div>

                      {/* Broker Info */}
                      <div className="flex items-center mb-4">
                        <Image
                          src={item.broker.logo}
                          alt={item.broker.name}
                          width={48}
                          height={48}
                          className="rounded-full mr-3 ring-2 ring-white/20"
                        />
                        <div>
                          <h3 className="text-lg font-bold text-white">{item.broker.name}</h3>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-cyan-400 text-cyan-400 mr-1" />
                            <span className="text-cyan-200 text-sm">{item.broker.rating}/5</span>
                          </div>
                        </div>
                      </div>

                      {/* Promotion Details */}
                      <div className="flex-1 mb-4">
                        <h4 className="text-xl font-bold text-white mb-2">{item.promotion.title}</h4>
                        <div className="text-2xl font-bold text-cyan-400 mb-3">{item.promotion.value}</div>
                        <p className="text-cyan-100 text-sm leading-relaxed mb-4">
                          {item.promotion.description}
                        </p>

                        {/* Key Benefits */}
                        <div className="space-y-2 mb-4">
                          {item.benefits.slice(0, 3).map((benefit, benefitIndex) => (
                            <div key={benefitIndex} className="flex items-center text-sm text-cyan-200">
                              <CheckCircle className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
                              {benefit}
                            </div>
                          ))}
                        </div>

                        {/* Trading Info */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-black/20 rounded-lg p-2 text-center">
                            <div className="text-cyan-400 font-bold text-sm">${item.minDeposit}</div>
                            <div className="text-white/70 text-xs">Min Deposit</div>
                          </div>
                          <div className="bg-black/20 rounded-lg p-2 text-center">
                            <div className="text-purple-400 font-bold text-sm">{item.maxLeverage}</div>
                            <div className="text-white/70 text-xs">Max Leverage</div>
                          </div>
                        </div>

                        {/* Regulation */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {item.broker.regulatedBy.slice(0, 3).map((reg) => (
                            <Badge key={reg} className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                              {reg}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Button 
                        className={`w-full bg-gradient-to-r ${getPromotionGradient(item.promotion.type)} hover:opacity-90 text-white font-semibold py-3 rounded-lg transition-all duration-300 group-hover:scale-105`}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Claim This Offer
                      </Button>

                      {/* Terms */}
                      <p className="text-white/60 text-xs mt-3 text-center">
                        {item.promotion.terms}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* No Results */}
          {filteredPromotions.length === 0 && (
            <div className="text-center py-12">
              <Gift className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No promotions found</h3>
              <p className="text-white/60">Try selecting a different category to see more offers.</p>
            </div>
          )}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 bg-gradient-to-t from-black/40 to-transparent">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur-sm border-red-400/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-400 mr-3" />
                  <h3 className="text-xl font-bold text-white">Important Risk Warning</h3>
                </div>
                <p className="text-red-100 leading-relaxed max-w-4xl mx-auto">
                  <strong>Trading forex and CFDs involves significant risk and may not be suitable for all investors.</strong> 
                  You should carefully consider your objectives, financial situation, needs and level of experience before entering into any margined transactions. 
                  The possibility exists that you could sustain a loss of some or all of your initial investment and therefore you should not invest money that you cannot afford to lose. 
                  You should be aware of all the risks associated with foreign exchange trading and seek advice from an independent financial advisor if you have any doubts. 
                  All promotional offers are subject to terms and conditions. Please read the full terms before participating in any promotion.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}