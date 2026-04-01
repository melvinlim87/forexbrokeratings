'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, ChevronRight, Calendar, FolderOpen, BookOpen, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { articlesMeta } from '@/lib/articles-meta';

const latestReviews = [
  {
    id: 1,
    name: 'XTB',
    logo: '/logos/xtb.svg',
    rating: 4.6,
    date: 'May 2, 2025',
    summary: 'XTB offers a solid trading experience with excellent research and educational materials, making it ideal for beginners and intermediate traders.',
    highlights: ['Low forex fees', 'Free and fast withdrawals', 'Excellent educational materials'],
    slug: 'xtb'
  },
  {
    id: 2,
    name: 'AvaTrade',
    logo: '/logos/avatrade.svg',
    rating: 4.5,
    date: 'April 28, 2025',
    summary: 'AvaTrade provides a feature-rich environment for forex and CFD trading, with competitive spreads and excellent educational resources.',
    highlights: ['Multi-regulated globally', 'Wide range of platforms', 'Excellent customer support'],
    slug: 'avatrade'
  },
  {
    id: 3,
    name: 'OANDA',
    logo: '/logos/oanda.svg',
    rating: 4.7,
    date: 'April 25, 2025',
    summary: 'OANDA stands out with its transparent pricing, advanced charting tools, and high-quality market analysis for experienced traders.',
    highlights: ['Advanced technical analysis', 'Historical tick data', 'Transparent pricing'],
    slug: 'oanda'
  }
];

type Tab = 'reviews' | 'articles';

export default function LatestReviewsAndArticles() {
  const [activeTab, setActiveTab] = useState<Tab>('reviews');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const articles = articlesMeta.slice(0, 6).map(a => ({
    ...a,
    excerpt: a.excerpt,
  }));

  const hasArticles = articles.length > 0;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'reviews', label: 'Latest Reviews', icon: <MessageSquare className="h-4 w-4" /> },
    ...(hasArticles ? [{ id: 'articles' as Tab, label: 'Latest Articles', icon: <BookOpen className="h-4 w-4" /> }] : []),
  ];

  return (
    <section className="py-12 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        {/* Header with Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Updates</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
              Fresh broker reviews and expert trading guides.
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            {/* Tab Buttons */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  onMouseEnter={() => setHoveredCard(review.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Card className="h-full overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-24 relative bg-gray-100 dark:bg-gray-800 rounded">
                          <Image
                            src={review.logo}
                            alt={review.name}
                            fill
                            className="p-1 object-contain"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < Math.floor(review.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}
                            />
                          ))}
                          <span className="ml-1 text-sm font-medium">{review.rating}</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{review.name} Review</h3>

                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Updated: {review.date}</span>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {review.summary}
                      </p>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Highlights:</h4>
                        <ul className="space-y-1">
                          {review.highlights.map((highlight, i) => (
                            <li key={i} className="flex items-start text-sm">
                              <svg className="h-4 w-4 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-gray-600 dark:text-gray-400">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>

                    <CardFooter className="px-6 pb-6 pt-2">
                      <Button className="w-full" asChild>
                        <Link href={`/broker/${review.slug}`}>
                          Read Full Review
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link href="/brokers/reviews" className="inline-flex items-center text-blue-600 dark:text-blue-500 font-medium hover:text-blue-800 dark:hover:text-blue-400">
                View all reviews <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Articles Tab */}
        {activeTab === 'articles' && hasArticles && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Card key={article.slug} className="h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        <FolderOpen className="h-3 w-3 mr-1" />
                        {article.category}
                      </Badge>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        {article.date}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      <Link href={`/blog/${article.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {article.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 flex-1">
                      {article.excerpt}
                    </p>
                    <div className="mt-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/blog/${article.slug}`}>Read More</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link href="/blog" className="inline-flex items-center text-blue-600 dark:text-blue-500 font-medium hover:text-blue-800 dark:hover:text-blue-400">
                View all articles <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
