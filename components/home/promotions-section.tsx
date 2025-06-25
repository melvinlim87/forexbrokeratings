"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Gift, ArrowRight, Info, AlertCircle, Star, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { fetchUniquePromotions, BrokerPromotionWithBrokerDetails } from '@/lib/supabase';

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
  const [promotions, setPromotions] = useState<BrokerPromotionWithBrokerDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const promos = await fetchUniquePromotions();
        setPromotions(promos.slice(0, 3));
      } catch (err) {
        // console.error('Error fetching promotions:', err);
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
            promotions.map((promo: BrokerPromotionWithBrokerDetails, index: number) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredCard(promo.id?.toString())}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Card 
                  className={cn(
                    "overflow-hidden relative",
                    "bg-white dark:bg-gray-900",
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
                      <div className="flex items-center">
                        <div className="h-20 w-20 relative bg-gray-100 dark:bg-gray-800 rounded-xl">
                          <Image
                            src={promo.broker_details.logo || getFallbackLogo(promo.broker_details.name || 'Broker')}
                            alt={promo.broker_details.name || 'Broker'}
                            fill
                            style={{ objectFit: "contain" }}
                            className='rounded-xl'
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = getFallbackLogo(promo.broker_details.name || 'Broker');
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                            {promo.broker_details.name}
                          </h4>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="ml-1">{promo.broker_details?.rating}/5</span>
                          </div>
                        </div>
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

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {promo.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {promo.description}
                    </p>

                    <div className="flex flex-col gap-2 mb-4">
                      {promo.broker_details?.pros && promo.broker_details?.pros.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center text-sm text-emerald-800">
                          <CheckCircle className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
                          {feature}
                        </div>                    
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-black/10 rounded-lg p-2 text-center">
                        <div className="text-cyan-400 font-bold text-sm">{promo.broker_details?.min_deposit}</div>
                        <div className="text-black text-xs">Min Deposit</div>
                      </div>
                      <div className="bg-black/10 rounded-lg p-2 text-center">
                        <div className="text-purple-400 font-bold text-sm">{promo.broker_details?.leverage_max}</div>
                        <div className="text-black text-xs">Max Leverage</div>
                      </div>
                    </div>

                    <a
                      href={promo.link || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1 px-3 py-3 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-xs shadow hover:brightness-110 transition disabled:opacity-50"
                      style={{ pointerEvents: promo.link ? 'auto' : 'none', opacity: promo.link ? 1 : 0.6 }}
                    >
                      Claim Offer
                    </a>
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