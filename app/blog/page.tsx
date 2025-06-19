'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Calendar, 
  User, 
  Eye, 
  MessageCircle, 
  ThumbsUp, 
  Star, 
  TrendingUp, 
  Clock, 
  Filter,
  Search,
  ArrowRight,
  Award,
  Target,
  Zap,
  Shield,
  DollarSign,
  BarChart3,
  Globe,
  Flame
} from 'lucide-react';
import Image from 'next/image';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    experience: string;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  views: number;
  comments: number;
  likes: number;
  featured?: boolean;
  trending?: boolean;
  coverImage: string;
  brokerReviewed?: {
    name: string;
    logo: string;
    rating: number;
  };
}

const blogPosts: BlogPost[] = [
  {
    id: 'ic-markets-review-2024',
    title: 'IC Markets Deep Dive: 6 Months of Real Trading Experience',
    excerpt: 'After trading with IC Markets for 6 months, here\'s my honest review of their execution speed, spreads, and customer service. Spoiler: The results might surprise you.',
    content: 'Full detailed review content...',
    author: {
      name: 'Marcus Chen',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      role: 'Professional Trader',
      experience: '8+ years'
    },
    category: 'Broker Reviews',
    tags: ['IC Markets', 'ECN Trading', 'Spreads', 'Execution'],
    publishedAt: '2024-01-15',
    readTime: 12,
    views: 15420,
    comments: 89,
    likes: 234,
    featured: true,
    trending: true,
    coverImage: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
    brokerReviewed: {
      name: 'IC Markets',
      logo: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      rating: 4.8
    }
  },
  {
    id: 'pepperstone-vs-fp-markets',
    title: 'Pepperstone vs FP Markets: The Ultimate Comparison for Australian Traders',
    excerpt: 'Two of Australia\'s top forex brokers go head-to-head. We compare spreads, platforms, regulation, and real trading costs to help you choose.',
    content: 'Detailed comparison content...',
    author: {
      name: 'Sarah Williams',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      role: 'Market Analyst',
      experience: '5+ years'
    },
    category: 'Comparisons',
    tags: ['Pepperstone', 'FP Markets', 'Australian Brokers', 'Comparison'],
    publishedAt: '2024-01-12',
    readTime: 15,
    views: 12800,
    comments: 67,
    likes: 189,
    featured: true,
    coverImage: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
    brokerReviewed: {
      name: 'Pepperstone',
      logo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      rating: 4.6
    }
  },
  {
    id: 'scalping-strategy-guide',
    title: 'My Profitable Scalping Strategy: 3 Years of Backtesting Results',
    excerpt: 'Learn the exact scalping strategy that generated 127% returns over 3 years. Includes entry/exit rules, risk management, and broker requirements.',
    content: 'Strategy guide content...',
    author: {
      name: 'David Rodriguez',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      role: 'Quantitative Trader',
      experience: '10+ years'
    },
    category: 'Trading Strategies',
    tags: ['Scalping', 'Strategy', 'Backtesting', 'Risk Management'],
    publishedAt: '2024-01-10',
    readTime: 18,
    views: 18900,
    comments: 156,
    likes: 312,
    featured: true,
    trending: true,
    coverImage: 'https://images.pexels.com/photos/7567526/pexels-photo-7567526.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
  },
  {
    id: 'xm-bonus-experience',
    title: 'XM Group $30 No Deposit Bonus: My Complete Experience',
    excerpt: 'I tested XM\'s famous no deposit bonus. Here\'s exactly what happened, including withdrawal process, trading restrictions, and final results.',
    content: 'Bonus experience content...',
    author: {
      name: 'Emma Thompson',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      role: 'Retail Trader',
      experience: '3+ years'
    },
    category: 'Broker Reviews',
    tags: ['XM Group', 'Bonus', 'No Deposit', 'Experience'],
    publishedAt: '2024-01-08',
    readTime: 8,
    views: 9650,
    comments: 43,
    likes: 127,
    coverImage: 'https://images.pexels.com/photos/6801642/pexels-photo-6801642.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
    brokerReviewed: {
      name: 'XM Group',
      logo: 'https://images.pexels.com/photos/6801642/pexels-photo-6801642.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      rating: 4.2
    }
  },
  {
    id: 'forex-psychology-mistakes',
    title: '7 Psychology Mistakes That Destroyed My First Trading Account',
    excerpt: 'The brutal truth about forex psychology. Learn from my $5,000 mistake and discover the mental frameworks that finally made me profitable.',
    content: 'Psychology guide content...',
    author: {
      name: 'James Mitchell',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      role: 'Trading Coach',
      experience: '7+ years'
    },
    category: 'Trading Psychology',
    tags: ['Psychology', 'Mistakes', 'Risk Management', 'Mindset'],
    publishedAt: '2024-01-05',
    readTime: 14,
    views: 22100,
    comments: 198,
    likes: 445,
    trending: true,
    coverImage: 'https://images.pexels.com/photos/7413915/pexels-photo-7413915.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
  },
  {
    id: 'oanda-platform-review',
    title: 'OANDA Platform Review: Why I Switched After 2 Years',
    excerpt: 'An honest review of OANDA\'s trading platform, customer service, and execution quality. Plus, why I eventually moved to a different broker.',
    content: 'Platform review content...',
    author: {
      name: 'Lisa Park',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      role: 'Swing Trader',
      experience: '4+ years'
    },
    category: 'Broker Reviews',
    tags: ['OANDA', 'Platform', 'Review', 'User Experience'],
    publishedAt: '2024-01-03',
    readTime: 10,
    views: 8750,
    comments: 52,
    likes: 98,
    coverImage: 'https://images.pexels.com/photos/8370421/pexels-photo-8370421.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
    brokerReviewed: {
      name: 'OANDA',
      logo: 'https://images.pexels.com/photos/8370421/pexels-photo-8370421.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      rating: 4.1
    }
  },
  {
    id: 'etoro-copy-trading-results',
    title: 'eToro Copy Trading: 12 Months of Real Results and Lessons Learned',
    excerpt: 'I copied 5 top traders on eToro for a full year. Here are the exact results, fees paid, and whether copy trading is worth it in 2024.',
    content: 'Copy trading results content...',
    author: {
      name: 'Michael Brown',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      role: 'Part-time Trader',
      experience: '2+ years'
    },
    category: 'Platform Features',
    tags: ['eToro', 'Copy Trading', 'Social Trading', 'Results'],
    publishedAt: '2024-01-01',
    readTime: 16,
    views: 14200,
    comments: 87,
    likes: 203,
    coverImage: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
    brokerReviewed: {
      name: 'eToro',
      logo: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      rating: 4.0
    }
  },
  {
    id: 'plus500-cfd-experience',
    title: 'Plus500 CFD Trading: 6 Months of Real User Experience',
    excerpt: 'My detailed experience trading CFDs with Plus500. Covering spreads, platform usability, customer support, and withdrawal process.',
    content: 'CFD trading experience content...',
    author: {
      name: 'Anna Schmidt',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      role: 'CFD Trader',
      experience: '3+ years'
    },
    category: 'Broker Reviews',
    tags: ['Plus500', 'CFD Trading', 'Platform', 'User Experience'],
    publishedAt: '2023-12-28',
    readTime: 11,
    views: 7890,
    comments: 34,
    likes: 76,
    coverImage: 'https://images.pexels.com/photos/8370733/pexels-photo-8370733.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
    brokerReviewed: {
      name: 'Plus500',
      logo: 'https://images.pexels.com/photos/8370733/pexels-photo-8370733.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      rating: 3.9
    }
  }
];

const categories = [
  { id: 'all', name: 'All Posts', icon: BookOpen },
  { id: 'broker-reviews', name: 'Broker Reviews', icon: Star },
  { id: 'trading-strategies', name: 'Trading Strategies', icon: Target },
  { id: 'comparisons', name: 'Comparisons', icon: BarChart3 },
  { id: 'trading-psychology', name: 'Psychology', icon: Shield },
  { id: 'platform-features', name: 'Platform Features', icon: Zap }
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const featuredPosts = blogPosts.filter(post => post.featured);
  const trendingPosts = blogPosts.filter(post => post.trending);
  
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || 
      post.category.toLowerCase().replace(' ', '-') === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
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
              <BookOpen className="w-12 h-12 text-cyan-400 mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                Forex <span className="text-cyan-400">Blog</span>
              </h1>
            </div>
            <p className="text-xl text-cyan-100 max-w-3xl mx-auto leading-relaxed mb-8">
              Real trading experiences, honest broker reviews, and proven strategies from professional traders. 
              Learn from our community's successes and failures.
            </p>
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">{blogPosts.length}+</div>
                <div className="text-cyan-200">Expert Articles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">50K+</div>
                <div className="text-cyan-200">Monthly Readers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">Real</div>
                <div className="text-cyan-200">Trading Results</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 bg-gradient-to-b from-black/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <Award className="w-8 h-8 text-yellow-400 mr-3" />
              <h2 className="text-3xl font-bold text-white">
                <span className="text-yellow-400">Featured</span> Posts
              </h2>
            </div>
            <p className="text-cyan-100 text-center max-w-2xl mx-auto">
              Hand-picked articles from our top contributors with the most valuable insights
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredPosts.slice(0, 3).map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group"
              >
                <Card className="h-full bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border-white/20 hover:border-yellow-400/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-yellow-500/10 overflow-hidden">
                  <div className="relative">
                    <div className="aspect-video overflow-hidden">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-none font-bold">
                        <Award className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                    {post.trending && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-none font-bold">
                          <Flame className="w-3 h-3 mr-1" />
                          Trending
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        {post.category}
                      </Badge>
                      <div className="flex items-center text-sm text-white/60">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.readTime} min read
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-yellow-300 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-cyan-100 text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {post.brokerReviewed && (
                      <div className="flex items-center mb-4 p-3 bg-black/20 rounded-lg">
                        <Image
                          src={post.brokerReviewed.logo}
                          alt={post.brokerReviewed.name}
                          width={32}
                          height={32}
                          className="rounded-full mr-3"
                        />
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium">{post.brokerReviewed.name}</div>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="text-cyan-200 text-xs">{post.brokerReviewed.rating}/5</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          width={32}
                          height={32}
                          className="rounded-full mr-3"
                        />
                        <div>
                          <div className="text-white text-sm font-medium">{post.author.name}</div>
                          <div className="text-cyan-200 text-xs">{post.author.role}</div>
                        </div>
                      </div>
                      <div className="text-white/60 text-xs">
                        {formatDate(post.publishedAt)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {formatNumber(post.views)}
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {post.comments}
                        </div>
                        <div className="flex items-center">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {post.likes}
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold group-hover:scale-105 transition-all duration-300">
                      Read Full Article
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-cyan-400/50 transition-colors"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-white/60" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white px-4 py-3 focus:outline-none focus:border-cyan-400/50 transition-colors"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id} className="bg-gray-900 text-white">
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-white/10 backdrop-blur-sm border border-white/20">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id} 
                      className="text-white data-[state=active]:bg-white/20 flex items-center"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">{category.name}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </motion.div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
                className="group"
              >
                <Card className="h-full bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border-white/20 hover:border-cyan-400/50 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-cyan-500/10 overflow-hidden">
                  <div className="relative">
                    <div className="aspect-video overflow-hidden">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    {post.trending && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-none font-bold">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Trending
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                        {post.category}
                      </Badge>
                      <div className="flex items-center text-sm text-white/60">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.readTime} min
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-cyan-300 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-cyan-100 text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {post.brokerReviewed && (
                      <div className="flex items-center mb-4 p-2 bg-black/20 rounded-lg">
                        <Image
                          src={post.brokerReviewed.logo}
                          alt={post.brokerReviewed.name}
                          width={24}
                          height={24}
                          className="rounded-full mr-2"
                        />
                        <div className="flex-1">
                          <div className="text-white text-xs font-medium">{post.brokerReviewed.name}</div>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="text-cyan-200 text-xs">{post.brokerReviewed.rating}/5</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          width={28}
                          height={28}
                          className="rounded-full mr-2"
                        />
                        <div>
                          <div className="text-white text-sm font-medium">{post.author.name}</div>
                          <div className="text-cyan-200 text-xs">{post.author.experience}</div>
                        </div>
                      </div>
                      <div className="text-white/60 text-xs">
                        {formatDate(post.publishedAt)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-white/60 mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {formatNumber(post.views)}
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          {post.comments}
                        </div>
                        <div className="flex items-center">
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          {post.likes}
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold text-sm group-hover:scale-105 transition-all duration-300">
                      Read Article
                      <ArrowRight className="w-3 h-3 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No articles found</h3>
              <p className="text-white/60">Try adjusting your search or filter criteria.</p>
            </div>
          )}

          {/* Load More */}
          {filteredPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center mt-12"
            >
              <Button 
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Load More Articles
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-t from-black/40 to-transparent">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border-cyan-400/30 max-w-4xl mx-auto">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-center justify-center mb-6">
                  <Globe className="w-8 h-8 text-cyan-400 mr-3" />
                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    Stay Updated with Forex Insights
                  </h3>
                </div>
                <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
                  Get weekly updates on broker reviews, trading strategies, and market analysis directly in your inbox.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-cyan-400/50 transition-colors"
                  />
                  <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-semibold">
                    Subscribe
                  </Button>
                </div>
                <p className="text-cyan-200 text-sm mt-4">
                  Join 10,000+ traders getting our weekly newsletter. Unsubscribe anytime.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}