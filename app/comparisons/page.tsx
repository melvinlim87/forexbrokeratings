'use client';

import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  Shield, 
  TrendingUp, 
  Zap, 
  DollarSign, 
  Users, 
  Award,
  Plus,
  X,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Info,
  BarChart3,
  Globe,
  Clock,
  Target,
  Grip
} from 'lucide-react';
import Image from 'next/image';
import { comparisonBrokers, type ComparisonBroker } from '@/lib/comparison-data';

export default function ComparisonsPage() {
  const [selectedBrokers, setSelectedBrokers] = useState<ComparisonBroker[]>([]);
  const [draggedBroker, setDraggedBroker] = useState<ComparisonBroker | null>(null);
  const [activeCategory, setActiveCategory] = useState('overview');
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const maxComparisons = 4;

  // Memoize filtered and sorted brokers to avoid duplicates
  const availableBrokers = useMemo(() => {
    return comparisonBrokers.filter(broker => 
      !selectedBrokers.find(selected => selected.id === broker.id)
    );
  }, [selectedBrokers]);

  const handleDragStart = (broker: ComparisonBroker) => {
    setDraggedBroker(broker);
  };

  const handleDragEnd = () => {
    setDraggedBroker(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedBroker && selectedBrokers.length < maxComparisons) {
      if (!selectedBrokers.find(b => b.id === draggedBroker.id)) {
        setSelectedBrokers([...selectedBrokers, draggedBroker]);
      }
    }
    setDraggedBroker(null);
  };

  const addBroker = (broker: ComparisonBroker) => {
    if (selectedBrokers.length < maxComparisons && !selectedBrokers.find(b => b.id === broker.id)) {
      setSelectedBrokers([...selectedBrokers, broker]);
    }
  };

  const removeBroker = (brokerId: string) => {
    setSelectedBrokers(selectedBrokers.filter(b => b.id !== brokerId));
  };

  const clearAll = () => {
    setSelectedBrokers([]);
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-400';
    if (score >= 7) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskLevel = (level: string) => {
    const colors = {
      'Low': 'bg-green-500/20 text-green-300 border-green-500/30',
      'Medium': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'High': 'bg-red-500/20 text-red-300 border-red-500/30'
    };
    return colors[level as keyof typeof colors] || colors.Medium;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-black">
      {/* Header */}
      <section className="py-20 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <BarChart3 className="w-12 h-12 text-cyan-400 mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                FX Broker <span className="text-cyan-400">Comparisons</span>
              </h1>
            </div>
            <p className="text-xl text-cyan-100 max-w-3xl mx-auto leading-relaxed mb-8">
              Compare forex brokers side-by-side with detailed analysis of ratings, promotions, 
              regulations, risk control, and trading environments.
            </p>
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">{comparisonBrokers.length}+</div>
                <div className="text-cyan-200">Brokers Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">50+</div>
                <div className="text-cyan-200">Data Points</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">Real-Time</div>
                <div className="text-cyan-200">Updates</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comparison Interface */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border-cyan-400/30">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Info className="w-6 h-6 text-cyan-400 mr-3" />
                  <h3 className="text-xl font-bold text-white">How to Compare</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-cyan-100">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center mr-3">
                      <span className="text-cyan-400 font-bold">1</span>
                    </div>
                    <span>Drag brokers from the list below to the comparison area</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mr-3">
                      <span className="text-purple-400 font-bold">2</span>
                    </div>
                    <span>Compare up to {maxComparisons} brokers simultaneously</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-400 font-bold">3</span>
                    </div>
                    <span>Switch between different comparison categories</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Comparison Drop Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Comparison Area ({selectedBrokers.length}/{maxComparisons})
              </h2>
              {selectedBrokers.length > 0 && (
                <Button
                  onClick={clearAll}
                  variant="outline"
                  className="bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30"
                >
                  Clear All
                </Button>
              )}
            </div>

            <div
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`min-h-[200px] border-2 border-dashed rounded-2xl p-6 transition-all duration-300 ${
                selectedBrokers.length === 0
                  ? 'border-white/30 bg-white/5'
                  : 'border-cyan-400/50 bg-gradient-to-r from-cyan-500/5 to-purple-500/5'
              }`}
            >
              {selectedBrokers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Target className="w-16 h-16 text-white/40 mb-4" />
                  <h3 className="text-xl font-semibold text-white/60 mb-2">
                    Drag brokers here to start comparing
                  </h3>
                  <p className="text-white/40">
                    Select up to {maxComparisons} brokers to compare their features side-by-side
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Comparison Categories */}
                  <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                    <TabsList className="grid w-full grid-cols-5 bg-white/10 backdrop-blur-sm border border-white/20">
                      <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20">
                        Overview
                      </TabsTrigger>
                      <TabsTrigger value="ratings" className="text-white data-[state=active]:bg-white/20">
                        Ratings
                      </TabsTrigger>
                      <TabsTrigger value="promotions" className="text-white data-[state=active]:bg-white/20">
                        Promotions
                      </TabsTrigger>
                      <TabsTrigger value="regulations" className="text-white data-[state=active]:bg-white/20">
                        Regulations
                      </TabsTrigger>
                      <TabsTrigger value="trading" className="text-white data-[state=active]:bg-white/20">
                        Trading
                      </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {selectedBrokers.map((broker) => (
                          <Card key={broker.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Image
                                    src={broker.logo}
                                    alt={broker.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full mr-3"
                                  />
                                  <div>
                                    <h4 className="font-bold text-white">{broker.name}</h4>
                                    <div className="flex items-center">
                                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                                      <span className="text-cyan-200 text-sm">{broker.overview.rating}/10</span>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  onClick={() => removeBroker(broker.id)}
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-white/60">Min Spread:</span>
                                  <div className="text-cyan-400 font-semibold">{broker.overview.minSpread}</div>
                                </div>
                                <div>
                                  <span className="text-white/60">Max Leverage:</span>
                                  <div className="text-purple-400 font-semibold">{broker.overview.maxLeverage}</div>
                                </div>
                                <div>
                                  <span className="text-white/60">Min Deposit:</span>
                                  <div className="text-green-400 font-semibold">${broker.overview.minDeposit}</div>
                                </div>
                                <div>
                                  <span className="text-white/60">Founded:</span>
                                  <div className="text-white font-semibold">{broker.overview.established}</div>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {broker.overview.regulatedBy.slice(0, 2).map((reg) => (
                                  <Badge key={reg} className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                                    {reg}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    {/* Ratings Tab */}
                    <TabsContent value="ratings" className="mt-6">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-white/20">
                              <th className="text-left text-white font-semibold p-3">Broker</th>
                              <th className="text-center text-white font-semibold p-3">Overall</th>
                              <th className="text-center text-white font-semibold p-3">Spreads</th>
                              <th className="text-center text-white font-semibold p-3">Execution</th>
                              <th className="text-center text-white font-semibold p-3">Platform</th>
                              <th className="text-center text-white font-semibold p-3">Support</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedBrokers.map((broker) => (
                              <tr key={broker.id} className="border-b border-white/10">
                                <td className="p-3">
                                  <div className="flex items-center">
                                    <Image
                                      src={broker.logo}
                                      alt={broker.name}
                                      width={32}
                                      height={32}
                                      className="rounded-full mr-3"
                                    />
                                    <span className="text-white font-medium">{broker.name}</span>
                                  </div>
                                </td>
                                <td className="text-center p-3">
                                  <span className={`font-bold text-lg ${getScoreColor(broker.ratings.overall)}`}>
                                    {broker.ratings.overall}/10
                                  </span>
                                </td>
                                <td className="text-center p-3">
                                  <span className={`font-bold ${getScoreColor(broker.ratings.spreads)}`}>
                                    {broker.ratings.spreads}/10
                                  </span>
                                </td>
                                <td className="text-center p-3">
                                  <span className={`font-bold ${getScoreColor(broker.ratings.execution)}`}>
                                    {broker.ratings.execution}/10
                                  </span>
                                </td>
                                <td className="text-center p-3">
                                  <span className={`font-bold ${getScoreColor(broker.ratings.platform)}`}>
                                    {broker.ratings.platform}/10
                                  </span>
                                </td>
                                <td className="text-center p-3">
                                  <span className={`font-bold ${getScoreColor(broker.ratings.support)}`}>
                                    {broker.ratings.support}/10
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>

                    {/* Promotions Tab */}
                    <TabsContent value="promotions" className="mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {selectedBrokers.map((broker) => (
                          <Card key={broker.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold text-white">{broker.name}</h4>
                                <Button
                                  onClick={() => removeBroker(broker.id)}
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <h5 className="text-cyan-400 font-semibold mb-2">Welcome Bonus</h5>
                                <p className="text-white text-sm">{broker.promotions.welcomeBonus}</p>
                              </div>
                              <div>
                                <h5 className="text-purple-400 font-semibold mb-2">Deposit Bonus</h5>
                                <p className="text-white text-sm">{broker.promotions.depositBonus}</p>
                              </div>
                              <div>
                                <h5 className="text-green-400 font-semibold mb-2">Special Offers</h5>
                                <div className="space-y-1">
                                  {broker.promotions.specialOffers.map((offer, index) => (
                                    <div key={index} className="flex items-center text-sm text-cyan-200">
                                      <CheckCircle className="w-3 h-3 text-green-400 mr-2" />
                                      {offer}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    {/* Regulations Tab */}
                    <TabsContent value="regulations" className="mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {selectedBrokers.map((broker) => (
                          <Card key={broker.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold text-white">{broker.name}</h4>
                                <Button
                                  onClick={() => removeBroker(broker.id)}
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <h5 className="text-cyan-400 font-semibold mb-2">Regulators</h5>
                                <div className="flex flex-wrap gap-1">
                                  {broker.regulations.regulators.map((reg) => (
                                    <Badge key={reg} className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                                      {reg}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h5 className="text-purple-400 font-semibold mb-2">Licenses</h5>
                                <div className="space-y-1">
                                  {broker.regulations.licenses.map((license, index) => (
                                    <div key={index} className="text-sm text-cyan-200">{license}</div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h5 className="text-green-400 font-semibold mb-2">Client Protection</h5>
                                <div className="space-y-1">
                                  {broker.regulations.clientProtection.map((protection, index) => (
                                    <div key={index} className="flex items-center text-sm text-cyan-200">
                                      <Shield className="w-3 h-3 text-green-400 mr-2" />
                                      {protection}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    {/* Trading Tab */}
                    <TabsContent value="trading" className="mt-6">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-white/20">
                              <th className="text-left text-white font-semibold p-3">Broker</th>
                              <th className="text-center text-white font-semibold p-3">Platforms</th>
                              <th className="text-center text-white font-semibold p-3">Assets</th>
                              <th className="text-center text-white font-semibold p-3">Execution</th>
                              <th className="text-center text-white font-semibold p-3">Risk Level</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedBrokers.map((broker) => (
                              <tr key={broker.id} className="border-b border-white/10">
                                <td className="p-3">
                                  <div className="flex items-center">
                                    <Image
                                      src={broker.logo}
                                      alt={broker.name}
                                      width={32}
                                      height={32}
                                      className="rounded-full mr-3"
                                    />
                                    <span className="text-white font-medium">{broker.name}</span>
                                  </div>
                                </td>
                                <td className="text-center p-3">
                                  <div className="flex flex-wrap gap-1 justify-center">
                                    {broker.trading.platforms.slice(0, 2).map((platform) => (
                                      <Badge key={platform} className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs">
                                        {platform}
                                      </Badge>
                                    ))}
                                  </div>
                                </td>
                                <td className="text-center p-3">
                                  <span className="text-white font-medium">{broker.trading.assets}+</span>
                                </td>
                                <td className="text-center p-3">
                                  <span className="text-cyan-400 font-medium">{broker.trading.executionSpeed}</span>
                                </td>
                                <td className="text-center p-3">
                                  <Badge className={getRiskLevel(broker.trading.riskLevel)}>
                                    {broker.trading.riskLevel}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          </motion.div>

          {/* Available Brokers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Available Brokers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {availableBrokers.map((broker, index) => (
                <motion.div
                  key={broker.id}
                  draggable
                  onDragStart={() => handleDragStart(broker)}
                  onDragEnd={handleDragEnd}
                  whileHover={{ scale: 1.02 }}
                  whileDrag={{ scale: 1.05, rotate: 2 }}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <Card className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border-white/20 hover:border-cyan-400/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Image
                            src={broker.logo}
                            alt={broker.name}
                            width={48}
                            height={48}
                            className="rounded-full mr-3"
                          />
                          <div>
                            <h3 className="font-bold text-white">{broker.name}</h3>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                              <span className="text-cyan-200 text-sm">{broker.overview.rating}/10</span>
                            </div>
                          </div>
                        </div>
                        <Grip className="w-5 h-5 text-white/40" />
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        <div>
                          <span className="text-white/60">Min Spread:</span>
                          <div className="text-cyan-400 font-semibold">{broker.overview.minSpread}</div>
                        </div>
                        <div>
                          <span className="text-white/60">Max Leverage:</span>
                          <div className="text-purple-400 font-semibold">{broker.overview.maxLeverage}</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {broker.overview.regulatedBy.slice(0, 2).map((reg) => (
                          <Badge key={reg} className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                            {reg}
                          </Badge>
                        ))}
                      </div>

                      <Button
                        onClick={() => addBroker(broker)}
                        disabled={selectedBrokers.length >= maxComparisons || selectedBrokers.some(b => b.id === broker.id)}
                        className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add to Compare
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {availableBrokers.length === 0 && selectedBrokers.length > 0 && (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">All Available Brokers Added</h3>
                <p className="text-white/60">You've added all available brokers to your comparison.</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}