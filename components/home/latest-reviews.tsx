"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, ChevronRight, Award, ShieldCheck, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Sample data - would come from API in real implementation
const latestReviews = [
  {
    id: 1,
    name: 'XTB',
    logo: 'https://via.placeholder.com/120x60?text=XTB',
    rating: 4.6,
    date: 'May 2, 2025',
    summary: 'XTB offers a solid trading experience with excellent research and educational materials, making it ideal for beginners and intermediate traders.',
    highlights: ['Low forex fees', 'Free and fast withdrawals', 'Excellent educational materials'],
    slug: 'xtb'
  },
  {
    id: 2,
    name: 'AvaTrade',
    logo: 'https://via.placeholder.com/120x60?text=AvaTrade',
    rating: 4.5,
    date: 'April 28, 2025',
    summary: 'AvaTrade provides a feature-rich environment for forex and CFD trading, with competitive spreads and excellent educational resources.',
    highlights: ['Multi-regulated globally', 'Wide range of platforms', 'Excellent customer support'],
    slug: 'avatrade'
  },
  {
    id: 3,
    name: 'OANDA',
    logo: 'https://via.placeholder.com/120x60?text=OANDA',
    rating: 4.7,
    date: 'April 25, 2025',
    summary: 'OANDA stands out with its transparent pricing, advanced charting tools, and high-quality market analysis for experienced traders.',
    highlights: ['Advanced technical analysis', 'Historical tick data', 'Transparent pricing'],
    slug: 'oanda'
  }
];

export default function LatestReviews() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Latest Broker Reviews</h2>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
              Fresh insights from our expert analysis of forex brokers.
            </p>
          </div>
          <Link href="/brokers/reviews" className="mt-4 md:mt-0 inline-flex items-center text-blue-600 dark:text-blue-500 font-medium hover:text-blue-800 dark:hover:text-blue-400">
            View all reviews <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
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
              <Card className="h-full border border-gray-200 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-24 relative bg-gray-100 dark:bg-gray-800 rounded">
                      <Image
                        src={review.logo}
                        alt={review.name}
                        layout="fill"
                        objectFit="contain"
                        className="p-1"
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
      </div>
    </section>
  );
}