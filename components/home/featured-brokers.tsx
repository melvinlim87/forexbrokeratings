'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { fetchAllBrokerDetails, type BrokerDetails } from '@/lib/supabase';

interface Broker extends BrokerDetails {
  avgRating: number;
  rank: number;
}

export default function FeaturedBrokers() {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        setLoading(true);
        const data = await fetchAllBrokerDetails();
        
        if (data) {
          // Calculate average rating and add rank
          const brokersWithRating = data
            .map(broker => ({
              ...broker,
              avgRating: calculateAverageRating(broker)
            }))
            .sort((a, b) => b.avgRating - a.avgRating)
            .slice(0, 10) // Get top 10 brokers
            .map((broker, index) => ({
              ...broker,
              rank: index + 1
            }));
          
          setBrokers(brokersWithRating);
        } else {
          setError('No broker data available');
        }
      } catch (err) {
        console.error('Error fetching brokers:', err);
        setError('Failed to load brokers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBrokers();
  }, []);

  const calculateAverageRating = (broker: BrokerDetails) => {
    const { sw, regulations, risk_control, promotions, user_experience, environment } = broker;
    const sum = (sw || 0) + (regulations || 0) + (risk_control || 0) + 
               (promotions || 0) + (user_experience || 0) + (environment || 0);
    return sum / 6;
  };

  if (loading) {
    return (
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mx-auto mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
                    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-5/6 mb-4"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">{error}</div>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Retry
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Top 10 Forex Brokers</h2>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
              Comprehensive ranking of the best forex brokers based on our detailed analysis.
            </p>
          </div>
          <Link 
            href="/brokers" 
            className="mt-4 md:mt-0 inline-flex items-center text-blue-600 dark:text-blue-500 font-medium hover:text-blue-800 dark:hover:text-blue-400"
          >
            View all brokers <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brokers.map((broker) => (
            <motion.div
              key={broker.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: broker.rank * 0.1 }}
            >
              <Card 
                className={cn(
                  'h-full transition-all duration-300',
                  hoveredCard === broker.rank ? 'shadow-lg -translate-y-1' : 'shadow-md hover:shadow-lg'
                )}
                onMouseEnter={() => setHoveredCard(broker.rank)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg mr-4">
                        {broker.logo ? (
                          <Image 
                            src={broker.logo} 
                            alt={broker.name}
                            width={48}
                            height={48}
                            className="h-12 w-12 object-contain"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{broker.name}</h3>
                        <div className="flex items-center mt-1">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">
                              {broker.avgRating?.toFixed(1) || 'N/A'}
                            </span>
                          </div>
                          {broker.is_regulated && (
                            <Badge variant="outline" className="ml-2 border-green-200 text-green-800 dark:border-green-900 dark:text-green-200">
                              <ShieldCheck className="h-3 w-3 mr-1" />
                              Regulated
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 h-8 w-8 rounded-full flex items-center justify-center font-bold">
                      {broker.rank}
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {broker.description || 'A reliable forex broker offering competitive trading conditions.'}
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">Min. Deposit</div>
                      <div className="font-medium">{broker.min_deposit || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">Platforms</div>
                      <div className="font-medium">
                        {Array.isArray(broker.platforms) ? broker.platforms.slice(0, 2).join(', ') : 'N/A'}
                        {Array.isArray(broker.platforms) && broker.platforms.length > 2 && '...'}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(broker.regulators) && broker.regulators.slice(0, 2).map((regulator, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {regulator}
                        </Badge>
                      ))}
                      {Array.isArray(broker.regulators) && broker.regulators.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{broker.regulators.length - 2} more
                        </Badge>
                      )}
                    </div>
                    <Button asChild size="sm">
                      <Link href={`/broker/${broker.slug || broker.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}