'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Star, 
  TrendingUp, 
  Shield, 
  Zap, 
  DollarSign, 
  Users, 
  Award,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Filter,
  CheckCircle
} from 'lucide-react';
import Image from 'next/image';
import { fetchTopBroker, BrokerDetails } from '@/lib/supabase';

export default function RankingsPage() {
  const [brokers, setBrokers] = useState<BrokerDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('overall');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    async function fetchBrokers() {
      setLoading(true);
      const data = await fetchTopBroker();
      setBrokers(data || []);
      setLoading(false);
    }
    fetchBrokers();
  }, []);

  const categories = [
    {
      id: 'overall',
      name: 'Overall Best',
      icon: Trophy,
      description: 'Top-rated brokers across all criteria',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'spreads',
      name: 'Lowest Spreads',
      icon: TrendingUp,
      description: 'Brokers with the tightest spreads',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 'regulation',
      name: 'Most Regulated',
      icon: Shield,
      description: 'Highest regulatory compliance',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'execution',
      name: 'Best Execution',
      icon: Zap,
      description: 'Fastest and most reliable execution',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'beginners',
      name: 'Best for Beginners',
      icon: Users,
      description: 'Most beginner-friendly brokers',
      gradient: 'from-indigo-500 to-blue-500'
    }
  ];

  const getCategoryBrokers = () => {
    switch (selectedCategory) {
      case 'spreads':
        return [...brokers].sort((a, b) => parseFloat(a.spread_eur_usd || '0') - parseFloat(b.spread_eur_usd || '0'));
      case 'regulation':
        return [...brokers].sort((a, b) => (b.regulations || 0) - (a.regulations || 0));
      case 'execution':
        return [...brokers].sort((a, b) => (b.environment || 0) - (a.environment || 0));
      case 'beginners':
        return [...brokers].sort((a, b) => (b.user_experience || 0) - (a.user_experience || 0));
      case 'overall':
      default:
        return [...brokers].sort((a, b) => (sortOrder === 'desc' ? (parseFloat(b.rating || '0') - parseFloat(a.rating || '0')) : (parseFloat(a.rating || '0') - parseFloat(b.rating || '0'))));
    }
  };
  const sortedBrokers = getCategoryBrokers();

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white';
    if (rank <= 5) return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
    if (rank <= 10) return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
    return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
  };

  const safe = (val?: string | number) => val ?? 'N/A';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-black">
      {/* Header */}
      <section className="py-20 bg-gradient-to-r from-cyan-900/50 to-purple-900/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mr-6">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                FX Broker <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Rankings</span>
              </h1>
            </div>
            <p className="text-xl text-cyan-100 max-w-3xl mx-auto leading-relaxed mb-12">
              Comprehensive rankings of the world's top forex brokers across multiple categories. 
              Data updated daily with real-time performance metrics.
            </p>
          </motion.div>
          
          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-cyan-400 mb-2">100+</div>
              <div className="text-cyan-200 font-medium">Brokers Analyzed</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-purple-400 mb-2">50+</div>
              <div className="text-cyan-200 font-medium">Data Points</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-cyan-200 font-medium">Live Monitoring</div>
            </div>
          </motion.div>
          
          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12"
          >
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border border-cyan-400/30 rounded-2xl p-6">
              <div className="flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-cyan-400 mr-3" />
                <h3 className="text-lg font-bold text-white">Trusted by Traders Worldwide</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-cyan-400">2M+</div>
                  <div className="text-cyan-200 text-sm">Monthly Users</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">50K+</div>
                  <div className="text-cyan-200 text-sm">Reviews Verified</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">200+</div>
                  <div className="text-cyan-200 text-sm">Countries Covered</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">8+</div>
                  <div className="text-cyan-200 text-sm">Years Experience</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-8 bg-gradient-to-b from-black/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center text-cyan-200">
                <TrendingUp className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Real-time data updates every 15 minutes</span>
              </div>
              <div className="text-center">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              </div>
              <div className="flex items-center text-cyan-200">
                <Shield className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">100% independent analysis</span>
              </div>
              <div className="text-center">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              </div>
              <div className="flex items-center text-cyan-200">
                <Award className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Verified broker data</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Rankings Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Category Selection Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Choose Your <span className="text-cyan-400">Ranking Category</span>
              </h2>
              <p className="text-cyan-100 max-w-2xl mx-auto">
                Select a category to view brokers ranked by specific criteria that matter most to your trading style
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {categories.map((category, index) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.id;
                
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className="cursor-pointer group"
                  >
                    <Card className={`h-full transition-all duration-300 ${
                      isActive 
                        ? `bg-gradient-to-br ${category.gradient} border-white/30 shadow-2xl shadow-cyan-500/20` 
                        : 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-white/20 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10'
                    }`}>
                      <CardContent className="p-6 text-center h-full flex flex-col justify-between">
                        <div>
                          <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-all duration-300 ${
                            isActive 
                              ? 'bg-white/20 shadow-lg' 
                              : `bg-gradient-to-br ${category.gradient} group-hover:scale-110`
                          }`}>
                            <Icon className={`w-8 h-8 ${isActive ? 'text-white' : 'text-white'}`} />
                          </div>
                          
                          <h3 className={`text-lg font-bold mb-2 transition-colors ${
                            isActive ? 'text-white' : 'text-white group-hover:text-cyan-300'
                          }`}>
                            {category.name}
                          </h3>
                          
                          <p className={`text-sm leading-relaxed ${
                            isActive ? 'text-white/90' : 'text-cyan-200 group-hover:text-cyan-100'
                          }`}>
                            {category.description}
                          </p>
                        </div>
                        
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4"
                          >
                            <Badge className="bg-white/20 text-white border-white/30 font-semibold">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Active Category Info */}
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              {categories.map((category) => {
                if (category.id !== selectedCategory) return null;
                const Icon = category.icon;
                
                return (
                  <Card key={category.id} className={`bg-gradient-to-r ${category.gradient} border-white/30`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{category.name} Rankings</h3>
                            <p className="text-white/90">{category.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">{sortedBrokers.length}</div>
                            <div className="text-white/80 text-sm">Brokers</div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                          >
                            <Filter className="w-4 h-4 mr-2" />
                            Sort by Score
                            {sortOrder === 'desc' ? <ChevronDown className="w-4 h-4 ml-2" /> : <ChevronUp className="w-4 h-4 ml-2" />}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </motion.div>
          </motion.div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            {/* Category Content */}
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <TabsContent key={category.id} value={category.id} className="space-y-8">

                  {/* Rankings List */}
                  <div className="space-y-4">
                    {sortedBrokers.map((broker, index) => (
                      <motion.div
                        key={broker.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                      >
                        <Card className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border-white/20 hover:border-cyan-400/50 transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              {/* Rank and Broker Info */}
                              <div className="flex items-center space-x-6 flex-1">
                                {/* Rank Badge */}
                                <div className={`w-12 h-12 rounded-full ${getRankBadgeColor(parseFloat(broker.ranking))} flex items-center justify-center font-bold text-lg shadow-lg`}>
                                  #{index + 1}
                                </div>

                                {/* Broker Logo and Name */}
                                <div className="flex items-center space-x-4">
                                  <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-white/20">
                                    <Image
                                      src={broker.logo}
                                      alt={`${broker.name} logo`}
                                      fill
                                      className="object-cover"
                                      sizes="64px"
                                    />
                                  </div>
                                  <div>
                                    <h3 className="text-xl font-bold text-white mb-1">{broker.name}</h3>
                                    <div className="flex items-center space-x-3">
                                      <div className="flex items-center">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                                        <span className="text-cyan-200 font-medium">{broker.rating}/5</span>
                                      </div>
                                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                                        Est. {broker.year_published}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                {/* Key Metrics */}
                                <div className="hidden lg:flex items-center space-x-8 flex-1">
                                  <div className="text-center">
                                    <div className="text-cyan-400 font-bold text-lg">{broker.spread_eur_usd}</div>
                                    <div className="text-white/60 text-xs">Min Spread</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-purple-400 font-bold text-lg">{broker.leverage_max}</div>
                                    <div className="text-white/60 text-xs">Max Leverage</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-green-400 font-bold text-lg">
                                      {broker.min_deposit}
                                    </div>
                                    <div className="text-white/60 text-xs">Min Deposit</div>
                                  </div>
                                </div>

                                {/* Regulation Badges */}
                                <div className="hidden md:flex flex-wrap gap-1 max-w-xs">
                                  {broker.regulators?.slice(0, 2).map((regulator) => (
                                    <Badge 
                                      key={regulator}
                                      variant="secondary" 
                                      className="bg-green-500/20 text-green-300 border-green-500/30 text-xs"
                                    >
                                      {regulator}
                                    </Badge>
                                  ))}
                                  {broker.regulators?.length > 2 && (
                                    <Badge 
                                      variant="secondary" 
                                      className="bg-gray-500/20 text-gray-300 border-gray-500/30 text-xs"
                                    >
                                      +{broker.regulators?.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              {/* Score and Action */}
                              <div className="flex items-center space-x-4">
                                <div className="text-center">
                                  <div className={`text-3xl font-bold bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent`}>
                                    {broker.rating}
                                  </div>
                                  <div className="text-white/60 text-xs">Score</div>
                                </div>
                                <a href={broker.website} target="_blank" rel="noopener noreferrer">
                                  <Button 
                                    className={`bg-gradient-to-r ${category.gradient} hover:opacity-90 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105`}
                                  >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                      Visit
                                  </Button>
                                </a>
                              </div>
                            </div>

                            {/* Mobile Metrics */}
                            <div className="lg:hidden mt-4 pt-4 border-t border-white/10">
                              <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                  <div className="text-cyan-400 font-bold">{broker.spread_eur_usd}</div>
                                  <div className="text-white/60 text-xs">Min Spread</div>
                                </div>
                                <div>
                                  <div className="text-purple-400 font-bold">{broker.leverage_max}</div>
                                  <div className="text-white/60 text-xs">Max Leverage</div>
                                </div>
                                <div>
                                  <div className="text-green-400 font-bold">
                                    {broker.min_deposit}
                                  </div>
                                  <div className="text-white/60 text-xs">Min Deposit</div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>

          {/* Methodology Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-20"
          >
            <Card className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border-white/20">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <Award className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-4">Our Ranking Methodology</h3>
                  <p className="text-cyan-100 max-w-3xl mx-auto">
                    Our rankings are based on comprehensive analysis of over 50 data points, 
                    updated in real-time to ensure accuracy and relevance.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-white font-semibold mb-2">Regulation (25%)</h4>
                    <p className="text-cyan-200 text-sm">Regulatory compliance, licenses, and safety measures</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-white font-semibold mb-2">Trading Costs (25%)</h4>
                    <p className="text-cyan-200 text-sm">Spreads, commissions, and overall trading costs</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-white font-semibold mb-2">Execution (25%)</h4>
                    <p className="text-cyan-200 text-sm">Speed, reliability, and order execution quality</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-white font-semibold mb-2">User Experience (25%)</h4>
                    <p className="text-cyan-200 text-sm">Platform quality, support, and user satisfaction</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}