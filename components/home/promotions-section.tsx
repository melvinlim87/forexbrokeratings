"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Gift, Timer, ArrowRight, Info, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { fetchBrokerPromotions } from '@/lib/supabase-promotions';
import { fetchAllBrokerDetails } from '@/lib/supabase';

interface BrokerPromotionWithDetails {
  id: string;
  broker_detail_id: string;
  title: string;
  description: string;
  condition: string;
  url: string;
  valid_until?: string;
  broker_name?: string;
  broker_logo?: string;
  slug?: string;
}

export default function PromotionsSection() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [promotions, setPromotions] = useState<BrokerPromotionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        
        // Fetch all brokers first
        const brokers = await fetchAllBrokerDetails();
        if (!brokers) throw new Error('Failed to fetch brokers');
        
        // Fetch promotions for each broker and combine with broker details
        const allPromotions: BrokerPromotionWithDetails[] = [];
        
        for (const broker of brokers) {
          try {
            const brokerPromotions = await fetchBrokerPromotions(broker.id);
            if (brokerPromotions && brokerPromotions.length > 0) {
              const promotionsWithDetails = brokerPromotions.map(promo => ({
                ...promo,
                broker_name: broker.name,
                broker_logo: broker.logo_url,
                slug: broker.slug
              }));
              allPromotions.push(...promotionsWithDetails);
            }
          } catch (err) {
            console.error(`Error fetching promotions for broker ${broker.id}:`, err);
            // Continue with next broker even if one fails
          }
        }
        
        // Sort by most recent first (if valid_until exists)
        const sortedPromotions = allPromotions.sort((a, b) => {
          const dateA = a.valid_until ? new Date(a.valid_until).getTime() : 0;
          const dateB = b.valid_until ? new Date(b.valid_until).getTime() : 0;
          return dateB - dateA;
        });
        
        setPromotions(sortedPromotions.slice(0, 3)); // Show top 3 promotions
      } catch (err) {
        console.error('Error fetching promotions:', err);
        setError('Failed to load promotions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);
  
  // Format terms from condition string
  const formatTerms = (condition: string): string[] => {
    if (!condition) return [];
    return condition
      .split('.')
      .map(term => term.trim())
      .filter(term => term.length > 0)
      .map(term => term.endsWith('.') ? term : term + '.');
  };
  
  // Get fallback logo URL
  const getFallbackLogo = (brokerName: string): string => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(brokerName)}&background=random`;
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-950 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
            <Gift className="h-6 w-6 text-amber-600 dark:text-amber-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Top Broker Promotions
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Exclusive bonuses and rewards from leading forex brokers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 max-w-7xl mx-auto">
          {loading ? (
            // Skeleton loaders
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="h-[400px] bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
            ))
          ) : error ? (
            <div className="col-span-full py-12 text-center">
              <div className="inline-flex items-center justify-center p-3 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-500" />
              </div>
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : promotions.length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">No promotions available at the moment.</p>
            </div>
          ) : (
            promotions.map((promo: BrokerPromotionWithDetails, index: number) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredCard(promo.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card 
                className={cn(
                  "overflow-hidden relative",
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
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-20 relative bg-gray-100 dark:bg-gray-800 rounded">
                      <Image
                        src={promo.broker_logo || getFallbackLogo(promo.broker_name || 'Broker')}
                        alt={promo.broker_name || 'Broker'}
                        fill
                        style={{ objectFit: "contain" }}
                        className="p-1"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = getFallbackLogo(promo.broker_name || 'Broker');
                        }}
                      />
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <ul className="text-sm space-y-1">
                            {formatTerms(promo.condition).map((term: string, i: number) => (
                              <li key={i} className="text-xs">{term}</li>
                            ))}
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {promo.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {promo.description}
                  </p>

                  {promo.valid_until && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <Timer className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">
                        Valid until {new Date(promo.valid_until).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                  )}

                  <Button className="w-full" asChild>
                    <a 
                      href={promo.url || `/${promo.slug}`} 
                      target={promo.url ? "_blank" : "_self"} 
                      rel="noopener noreferrer"
                    >
                      {promo.url ? 'View Offer' : 'Learn More'} <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )))}
        </div>

        <div className="mt-12 text-center max-w-7xl mx-auto">
          <Button variant="outline" size="lg" asChild>
            <Link href="/promotions">
              View All Promotions <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}