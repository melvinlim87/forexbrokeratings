"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, Clock, User, ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Sample data - would come from API in real implementation
const blogPosts = [
  {
    id: 1,
    title: 'Understanding Forex Market Volatility in 2025',
    excerpt: 'Learn how to navigate the increasingly volatile forex markets and identify trading opportunities.',
    category: 'Market Analysis',
    author: 'Sarah Johnson',
    date: '2025-05-28',
    readTime: 8,
    image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    featured: true,
    slug: 'understanding-forex-volatility-2025'
  },
  {
    id: 2,
    title: 'Top 5 Technical Indicators Every Forex Trader Should Know',
    excerpt: 'Master these essential technical indicators to improve your trading strategy and decision-making.',
    category: 'Technical Analysis',
    author: 'Michael Chen',
    date: '2025-06-02',
    readTime: 6,
    image: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    featured: true,
    slug: 'top-5-technical-indicators'
  },
  {
    id: 3,
    title: 'How Central Bank Policies Affect Currency Pairs',
    excerpt: 'Understand the relationship between monetary policy decisions and forex market movements.',
    category: 'Fundamental Analysis',
    author: 'Emma Roberts',
    date: '2025-05-15',
    readTime: 10,
    image: 'https://images.pexels.com/photos/7567434/pexels-photo-7567434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    featured: false,
    slug: 'central-bank-policies-currency-pairs'
  },
  {
    id: 4,
    title: 'Risk Management Strategies for Forex Traders',
    excerpt: 'Learn effective risk management techniques to protect your capital and maximize returns.',
    category: 'Risk Management',
    author: 'David Wilson',
    date: '2025-06-05',
    readTime: 7,
    image: 'https://images.pexels.com/photos/6781351/pexels-photo-6781351.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    featured: true,
    slug: 'risk-management-strategies'
  },
  {
    id: 5,
    title: 'The Psychology of Successful Forex Trading',
    excerpt: 'Discover how emotional discipline and psychological factors influence trading outcomes.',
    category: 'Trading Psychology',
    author: 'Jessica Lee',
    date: '2025-05-20',
    readTime: 9,
    image: 'https://images.pexels.com/photos/6801647/pexels-photo-6801647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    featured: false,
    slug: 'psychology-successful-trading'
  },
  {
    id: 6,
    title: 'Emerging Currency Pairs to Watch in 2025',
    excerpt: 'Explore promising emerging market currencies and potential trading opportunities.',
    category: 'Market Analysis',
    author: 'Robert Zhang',
    date: '2025-06-08',
    readTime: 6,
    image: 'https://images.pexels.com/photos/6781443/pexels-photo-6781443.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    featured: false,
    slug: 'emerging-currency-pairs-2025'
  }
];

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'market-analysis', label: 'Market Analysis' },
  { value: 'technical-analysis', label: 'Technical Analysis' },
  { value: 'fundamental-analysis', label: 'Fundamental Analysis' },
  { value: 'risk-management', label: 'Risk Management' },
  { value: 'trading-psychology', label: 'Trading Psychology' }
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                           post.category.toLowerCase().replace(' ', '-') === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-gray-100 to-white dark:from-gray-900/50 dark:to-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Forex Trading Blog
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Expert insights, market analysis, and trading tips to help you succeed
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
                placeholder="Search articles..."
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

      {/* Featured Posts */}
      <section className="py-12 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Featured Articles
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredPosts
              .filter(post => post.featured)
              .slice(0, 2)
              .map((post, index) => (
                <FeaturedPostCard key={post.id} post={post} index={index} />
              ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Latest Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => (
              <BlogPostCard key={post.id} post={post} index={index} />
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No articles found matching your criteria.</p>
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

      {/* Newsletter Section */}
      <section className="py-16 bg-blue-50 dark:bg-blue-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Get the latest forex insights and trading tips delivered straight to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input placeholder="Your email address" className="flex-grow" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeaturedPostCard({ post, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
    >
      <Link href={`/blog/${post.slug}`}>
        <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300">
          <div className="flex flex-col md:flex-row h-full">
            <div className="md:w-2/5 relative h-60 md:h-auto">
              <Image
                src={post.image}
                alt={post.title}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <CardContent className="p-6 md:w-3/5 flex flex-col">
              <div className="mb-3">
                <Badge variant="secondary">{post.category}</Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {post.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                {post.excerpt}
              </p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                <User className="h-4 w-4 mr-1" />
                <span className="mr-4">{post.author}</span>
                <Calendar className="h-4 w-4 mr-1" />
                <span className="mr-4">{new Date(post.date).toLocaleDateString('en-GB')}</span>
                <Clock className="h-4 w-4 mr-1" />
                <span>{post.readTime} min read</span>
              </div>
              <div className="flex items-center text-blue-600 dark:text-blue-500 font-medium">
                Read article <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

function BlogPostCard({ post, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/blog/${post.slug}`}>
        <Card className="overflow-hidden h-full hover:shadow-md transition-all duration-300">
          <div className="relative h-48">
            <Image
              src={post.image}
              alt={post.title}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <CardContent className="p-6">
            <div className="mb-3">
              <Badge variant="secondary">{post.category}</Badge>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              {post.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
              {post.excerpt}
            </p>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="mr-4">{new Date(post.date).toLocaleDateString('en-GB')}</span>
              <Clock className="h-4 w-4 mr-1" />
              <span>{post.readTime} min read</span>
            </div>
            <div className="flex items-center text-blue-600 dark:text-blue-500 font-medium">
              Read article <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
