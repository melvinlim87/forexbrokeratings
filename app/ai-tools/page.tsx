"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Bot, Brain, LineChart, ArrowRight, Zap, Search, Filter, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// Sample data - would come from API in real implementation
const aiTools = [
  {
    id: 1,
    title: 'AI Trading Signal Generator',
    category: 'Analysis',
    icon: <LineChart className="h-5 w-5" />,
    description: 'Get real-time trading signals powered by advanced machine learning algorithms',
    features: [
      'Real-time market analysis',
      'Multi-timeframe signals',
      'Customizable alert settings',
      'Historical performance tracking'
    ],
    rating: 4.8,
    reviews: 245,
    popular: true,
    slug: 'trading-signals'
  },
  {
    id: 2,
    title: 'Market Sentiment Analyzer',
    category: 'Research',
    icon: <Brain className="h-5 w-5" />,
    description: 'Analyze market sentiment across social media and news using NLP',
    features: [
      'Social media sentiment tracking',
      'News article analysis',
      'Sentiment trend visualization',
      'Real-time updates'
    ],
    rating: 4.6,
    reviews: 189,
    popular: true,
    slug: 'sentiment-analyzer'
  },
  {
    id: 3,
    title: 'AI Portfolio Optimizer',
    category: 'Portfolio',
    icon: <Bot className="h-5 w-5" />,
    description: 'Optimize your trading portfolio using AI-driven risk management',
    features: [
      'Risk-adjusted allocation',
      'Correlation analysis',
      'Rebalancing recommendations',
      'Performance projections'
    ],
    rating: 4.7,
    reviews: 156,
    popular: false,
    slug: 'portfolio-optimizer'
  },
  {
    id: 4,
    title: 'Pattern Recognition Scanner',
    category: 'Technical Analysis',
    icon: <LineChart className="h-5 w-5" />,
    description: 'Automatically detect chart patterns and technical setups across multiple assets',
    features: [
      'Multi-timeframe scanning',
      'Custom pattern definitions',
      'Alert notifications',
      'Historical pattern backtest'
    ],
    rating: 4.5,
    reviews: 132,
    popular: true,
    slug: 'pattern-scanner'
  },
  {
    id: 5,
    title: 'AI Trading Assistant',
    category: 'Trading',
    icon: <Bot className="h-5 w-5" />,
    description: 'Your personal AI trading companion that helps analyze markets and improve decisions',
    features: [
      'Market analysis',
      'Trade suggestions',
      'Risk management',
      'Performance tracking'
    ],
    rating: 4.9,
    reviews: 312,
    popular: true,
    slug: 'trading-assistant'
  },
  {
    id: 6,
    title: 'Economic Calendar Analyzer',
    category: 'Fundamental Analysis',
    icon: <Brain className="h-5 w-5" />,
    description: 'AI-powered analysis of economic events and their potential market impact',
    features: [
      'Event impact prediction',
      'Historical correlation analysis',
      'Custom alerts',
      'Market reaction tracking'
    ],
    rating: 4.4,
    reviews: 98,
    popular: false,
    slug: 'economic-calendar'
  },
  {
    id: 7,
    title: 'Automated Trading Bots',
    category: 'Trading',
    icon: <Bot className="h-5 w-5" />,
    description: 'Deploy AI-powered trading bots that execute trades based on your custom strategies',
    features: [
      'Strategy builder',
      'Risk management settings',
      'Performance analytics',
      'Multiple broker integration'
    ],
    rating: 4.7,
    reviews: 276,
    popular: true,
    slug: 'trading-bots'
  },
  {
    id: 8,
    title: 'News Impact Predictor',
    category: 'Research',
    icon: <Brain className="h-5 w-5" />,
    description: 'Predict market movements based on breaking news using advanced NLP',
    features: [
      'Real-time news analysis',
      'Impact prediction',
      'Historical correlation',
      'Alert system'
    ],
    rating: 4.5,
    reviews: 143,
    popular: false,
    slug: 'news-predictor'
  }
];

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'analysis', label: 'Analysis' },
  { value: 'research', label: 'Research' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'technical-analysis', label: 'Technical Analysis' },
  { value: 'trading', label: 'Trading' },
  { value: 'fundamental-analysis', label: 'Fundamental Analysis' }
];

export default function AIToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const filteredTools = aiTools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                           tool.category.toLowerCase().replace(' ', '-') === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <Bot className="h-6 w-6 text-blue-600 dark:text-blue-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              AI Trading Tools
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Enhance your trading with our cutting-edge AI-powered tools and analytics
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
                placeholder="Search AI tools..."
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

      {/* Popular Tools */}
      <section className="py-12 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Popular AI Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools
              .filter(tool => tool.popular)
              .map((tool, index) => (
                <ToolCard 
                  key={tool.id} 
                  tool={tool} 
                  index={index} 
                  hoveredCard={hoveredCard}
                  setHoveredCard={setHoveredCard}
                />
              ))
            }
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <motion.div 
              className="relative bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-yellow-400 text-yellow-900 text-xs font-bold shadow-md dark:bg-yellow-300 dark:text-yellow-900" aria-label="Coming Soon">Coming Soon</span>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-full w-fit mb-4">
                <Brain className="h-6 w-6 text-blue-600 dark:text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">AI Trading Assistant</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-5">
                Get personalized trading insights and recommendations powered by advanced machine learning algorithms.
              </p>
              <Button asChild disabled className='cursor-not-allowed'>
                <Link href="#" >
                  Try Assistant <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
            
            <motion.div 
              className="relative bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-8"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-yellow-400 text-yellow-900 text-xs font-bold shadow-md dark:bg-yellow-300 dark:text-yellow-900" aria-label="Coming Soon">Coming Soon</span>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-full w-fit mb-4">
                <Bot className="h-6 w-6 text-amber-600 dark:text-amber-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Automated Trading Bots</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-5">
                Deploy AI-powered trading bots that execute trades based on your custom strategies and risk parameters.
              </p>
              <Button variant="secondary" asChild disabled className='cursor-not-allowed'>
                <Link href="#">
                  Create Bot <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            All AI Tools
          </h2>
          <div className="mb-8 flex justify-center">
            <span className="inline-block bg-yellow-200 text-yellow-900 font-semibold rounded-full px-6 py-2 text-lg shadow-lg">
              🚧 All AI Tools Coming Soon!
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool, index) => (
              <ToolCard 
                key={tool.id} 
                tool={tool} 
                index={index} 
                hoveredCard={hoveredCard}
                setHoveredCard={setHoveredCard}
              />
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No AI tools found matching your criteria.</p>
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

// Define interface for tool object
interface Tool {
  id: number;
  title: string;
  category: string;
  icon: React.ReactNode;
  description: string;
  features: string[];
  rating: number;
  reviews: number;
  popular?: boolean;
  slug: string;
}

function ToolCard({ 
  tool, 
  index, 
  hoveredCard, 
  setHoveredCard 
}: { 
  tool: Tool; 
  index: number; 
  hoveredCard: number | null; 
  setHoveredCard: (id: number | null) => void 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onMouseEnter={() => setHoveredCard(tool.id)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div className="relative h-full">
        <Card className="h-full hover:shadow-md transition-all duration-300 cursor-not-allowed opacity-80">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-full">
                {tool.icon}
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600 dark:text-blue-500">
                {tool.category}
              </span>
              <div className="ml-auto flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Zap className="h-4 w-4 mr-1" />
                <span>AI-Powered</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
              {tool.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {tool.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {tool.features.slice(0, 2).map((feature, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {tool.features.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{tool.features.length - 2} more
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="ml-1 text-sm font-medium">{tool.rating}</span>
                <span className="ml-1 text-xs text-gray-500">({tool.reviews})</span>
              </div>
              <div className="flex items-center text-gray-400 font-medium">
                <span className="mr-2">Coming Soon</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
            {/* Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10 rounded-lg">
              <span className="text-xl font-bold text-yellow-700 dark:text-yellow-300">Coming Soon</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
