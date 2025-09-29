"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, ChevronRight, Award, ShieldCheck, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { fetchAllBrokerDetails } from '@/lib/supabase';
import T from '@/components/common/T';
import { useI18n } from '@/lib/i18n-client';

// Fallback data in case Supabase fetch fails
const latestReviews = [
  {
    id: '1',
    name: 'XTB',
    logo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.6,
    date: 'May 2, 2025',
    summary: 'XTB offers a solid trading experience with excellent research and educational materials, making it ideal for beginners and intermediate traders.',
    highlights: ['Low forex fees', 'Free and fast withdrawals', 'Excellent educational materials'],
    slug: 'xtb'
  },
  {
    id: '2',
    name: 'AvaTrade',
    logo: 'https://images.pexels.com/photos/7876439/pexels-photo-7876439.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.5,
    date: 'April 28, 2025',
    summary: 'AvaTrade provides a feature-rich environment for forex and CFD trading, with competitive spreads and excellent educational resources.',
    highlights: ['Multi-regulated globally', 'Wide range of platforms', 'Excellent customer support'],
    slug: 'avatrade'
  },
  {
    id: '3',
    name: 'OANDA',
    logo: 'https://images.pexels.com/photos/8370578/pexels-photo-8370578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.7,
    date: 'April 25, 2025',
    summary: 'OANDA stands out with its transparent pricing, advanced charting tools, and high-quality market analysis for experienced traders.',
    highlights: ['Advanced technical analysis', 'Historical tick data', 'Transparent pricing'],
    slug: 'oanda'
  }
];

export default function LatestReviews() {
  const { t } = useI18n();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>(latestReviews);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLatestReviews() {
      try {
        const data = await fetchAllBrokerDetails();
        
        // Take only the first 3 brokers for latest reviews
        const latestBrokers = data.slice(0, 3);
        
        // Format the reviews data
        const formattedReviews = latestBrokers.map(broker => {
          // Generate a random date within the last month for demo purposes
          const date = new Date();
          date.setDate(date.getDate() - Math.floor(Math.random() * 30));
          const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
          
          // Extract highlights from description or use default ones
          let highlights = [];
          if (broker.pros && typeof broker.pros === 'string') {
            try {
              highlights = JSON.parse(broker.pros).slice(0, 3);
            } catch {
              highlights = [broker.pros];
            }
          } else if (Array.isArray(broker.pros)) {
            highlights = broker.pros.slice(0, 3);
          } else {
            highlights = [
              'Professional trading services',
              'Competitive spreads',
              'Excellent customer support'
            ];
          }
          
          return {
            id: broker.id,
            name: broker.name,
            logo: broker.logo || `https://via.placeholder.com/180x90?text=${broker.name}`,
            rating: broker.rating || 4.5,
            date: formattedDate,
            summary: broker.description || `${broker.name} offers a solid trading experience with excellent research and educational materials.`,
            highlights: highlights,
            slug: broker.name.toLowerCase().replace(/\s+/g, '-'),
            headquarters: broker.headquarters,
            year_published: broker.year_published,
          };
        });
        
        setReviews(formattedReviews);
      } catch (err) {
        // console.error('Error fetching latest reviews:', err);
        setError('Failed to load reviews');
        // Keep the fallback data
      } finally {
        setLoading(false);
      }
    }
    
    fetchLatestReviews();
  }, []);

  return (
    <section id="latest-reviews" className="py-20 bg-white dark:bg-gray-950 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white"><T k="home.latest_reviews.title" /></h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            <T k="home.latest_reviews.subtitle" />
          </p>
          {/* <Link href="/brokers/reviews" className="mt-4 inline-flex items-center text-blue-600 dark:text-blue-500 font-medium hover:text-blue-800 dark:hover:text-blue-400 mx-auto">
            View all reviews <ChevronRight className="ml-1 h-4 w-4" />
          </Link> */}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 max-w-7xl mx-auto">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onMouseEnter={() => setHoveredCard(review.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card 
                className={cn(
                  "h-full overflow-hidden relative",
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
                )}>
                <Card className="h-full flex flex-col">
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-24 w-24 relative bg-gray-100 dark:bg-gray-800 rounded-xl">
                        <Image
                          src={review.logo}
                          alt={review.name}
                          fill
                          style={{ objectFit: "contain" }}
                          className="rounded-xl"
                        />
                      </div>
                      <div className="flex flex-col  gap-1">
                        <p className="text-md text-gray-700 dark:text-gray-300 px-2 text-right">
                          {review.headquarters}
                        </p>
                        <p className="text-md text-gray-700 dark:text-gray-300 px-2 text-right">
                          {review.year_published}
                        </p>
                        <div className='flex items-center gap-1'>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < Math.floor(review.rating/20) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-600'}`} 
                            />
                          ))}
                        <span className="ml-1 text-sm font-medium">{(parseFloat(review.rating)/20).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{review.name} <T k="home.latest_reviews.review" /></h3>
                    
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span><T k="home.latest_reviews.updated" /> {review.date}</span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {review.summary}
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300"><T k="home.latest_reviews.highlights" /></h4>
                      <ul className="space-y-1">
                        {review.highlights.map((highlight: string, i: number) => (
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
                  
                  <div className="mt-auto pt-4">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/broker/${review.slug || review.id}/#user_reviews`}>
                        <T k="home.latest_reviews.read_full_review" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}