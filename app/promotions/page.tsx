"use client";

import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, Sparkles, Gift, TimerIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { fetchFeaturedPromotion, fetchBrokerPromotionsWithDetails, BrokerPromotionWithBrokerDetails } from '@/lib/supabase';
import BrokerPromotionsCard from '@/components/promotions/BrokerPromotionsCard';
import PromotionCard from '@/components/promotions/PromotionCard';
import PromotionCardSkeleton from '@/components/promotions/PromotionCardSkeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// Type for broker promotion
export interface BrokerPromotion {
  id: string;
  title: string;
  description: string;
  terms: string;
  start_date: string;
  end_date: string | null;
  broker_detail_id: string;
  broker_name: string;
  broker_logo: string | null;
  broker_slug: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  valid_until?: string;
  category?: string;
  terms_list?: string[];
  condition?: string;
  url?: string;
  broker: BrokerData;
  link?: string;
  conditions?: string[];
  country?: string;
  images?: string[];
}

// Type for broker data from API
interface BrokerData {
  id: string;
  name: string;
  logo: string | null;
  slug: string;
}

// Type for broker data
interface Broker {
  id: string;
  name: string;
  logo: string | null;
  slug: string;
}

// Default categories for promotions
const defaultCategories = [
  { value: 'all', label: 'All Categories' },
  { value: 'welcome-bonus', label: 'Welcome Bonus' },
  { value: 'deposit-bonus', label: 'Deposit Bonus' },
  { value: 'no-deposit-bonus', label: 'No Deposit Bonus' },
  { value: 'cashback', label: 'Cashback' },
  { value: 'loyalty-program', label: 'Loyalty Program' },
  { value: 'referral', label: 'Referral' },
  { value: 'vip-program', label: 'VIP Program' },
  { value: 'contest', label: 'Contest' }
];

export default function PromotionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredPromotions, setFeaturedPromotions] = useState<BrokerPromotionWithBrokerDetails[]>([]);
  const [allPromotions, setAllPromotions] = useState<BrokerPromotionWithBrokerDetails[]>([]);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch featured
        const promos = await fetchFeaturedPromotion('');
        setFeaturedPromotions(promos.slice(0, 4));
        // Fetch all promotions
        const allPromosRaw = await fetchBrokerPromotionsWithDetails();
        setAllPromotions(allPromosRaw);
        setLoading(false);
      } catch (err) {
        setError('Failed to load promotions. Please try again later.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter promotions based on search query
  // Search filter for both featured and all promotions
  const filterPromos = (promos: BrokerPromotionWithBrokerDetails[]) => {
    if (!searchQuery) return promos;
    const q = searchQuery.toLowerCase();
    return promos.filter(promo =>
      (promo.title && promo.title.toLowerCase().includes(q)) ||
      (promo.description && promo.description.toLowerCase().includes(q)) ||
      (promo.broker_details?.name && promo.broker_details.name.toLowerCase().includes(q)) ||
      (Array.isArray(promo.conditions) && promo.conditions.some(cond => cond.toLowerCase().includes(q)))
    );
  };

  const filteredFeaturedPromotions = filterPromos(featuredPromotions);
  const filteredAllPromotions = filterPromos(allPromotions);


  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-12 w-full max-w-2xl" />
        </div>
        
        <div className="mb-12">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <PromotionCardSkeleton key={i} />
            ))}
          </div>
        </div>
        
        <div>
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-8 w-64 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((j) => (
                    <PromotionCardSkeleton key={`${i}-${j}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="bg-gradient-to-r from-[#091f40] to-[#0f2d59] h-[180px] flex flex-col justify-center items-center text-center px-4 mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow">Forex Broker Promotions</h1>
        <h2 className="text-lg md:text-2xl text-cyan-200 font-medium max-w-2xl mx-auto">Discover the latest promotions, bonuses, and special offers from top forex brokers.</h2>
      </header>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          {/* <h1 className="text-4xl font-bold mb-4">Forex Broker Promotions</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover the latest promotions, bonuses, and special offers from top forex brokers.
          </p> */}
          
          {/* Search Bar */}
          <div className="relative max-w-6xl mx-auto mb-12">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search promotions by broker, offer, or keyword..."
              className="w-full pl-10 pr-4 py-6 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        {/* Featured Promotions */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
              Featured Promotions
            </h2>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1,2,3,4].map((i) => (
                <PromotionCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : filteredFeaturedPromotions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredFeaturedPromotions.map((promo, idx) => (
                <div
                  key={promo.id || idx}
                  className="bg-white rounded-xl shadow p-6 flex flex-col h-full border border-gray-100"
                >
                  {/* Promo Badge/Category */}
                  <div className="mb-2 flex flex-wrap gap-2 flex-row flex-nowrap overflow-x-auto">
                    {promo.categories?.map((category, idx) => (
                      <span
                        key={idx}
                        className={
                          (category.includes('PROMO')
                            ? 'bg-purple-500 text-white '
                            : category.includes('BONUS')
                            ? 'bg-pink-500 text-white '
                            : category.includes('FREE')
                            ? 'bg-blue-500 text-white '
                            : category.includes('LIMITED')
                            ? 'bg-green-500 text-white '
                            : 'bg-gray-300 text-gray-800 ') +
                          'px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap mr-2'
                        }
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  {/* Promo Country */}
                  <div className="flex flex-row items-center justify-between w-full mb-4 gap-4 bg-gray-200 rounded-xl">
                    {/* Powered by section */}
                    <div className="flex items-center rounded-xl px-3 py-2">
                      <span className="text-xs text-gray-500 mr-2">Powered by</span>
                      <img
                        src={promo.broker_details?.logo || '/assets/images/default-broker-logo.png'}
                        alt={promo.broker_details?.name || 'Broker'}
                        className="h-8 w-8 rounded-full border mr-2"
                      />
                      <a href={`/broker/${promo.broker_details.name.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `/broker/${promo.broker_details.name.toLowerCase().replace(/\s+/g, '-')}`;
                      }}>
                        <span className="font-bold text-cyan-700 text-lg">{promo.broker_details?.name || 'Broker'}</span>
                      </a>
                    </div>
                    {/* Expiry section */}
                    {promo.valid_till && (
                      <div className="flex items-center gap-2 min-w-fit rounded-xl px-3 py-2">
                        <TimerIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-500 text-xs font-medium">
                          Valid Till: <br />
                          {promo.valid_till
                            ? new Date(promo.valid_till).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                              : 'N/A'}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Promotion Images */}
                  {promo.images && promo.images.length > 0 && (
                    <img
                      src={promo.images[0].startsWith('/') || promo.images[0].startsWith('http') ? promo.images[0] : `/assets/images/promotions/${promo.images[0]}`}
                      alt={promo.title}
                      className="w-full h-32 object-cover rounded mb-4 border border-gray-200 bg-gray-50 cursor-pointer"
                    />
                  )}
                  {/* Promo Title */}
                  <div className="font-bold text-2xl mb-2 text-gray-900">{promo.title}</div>
                  {/* Promo Description */}
                  <div className="text-gray-700 text-md mb-4">{promo.description}</div>
                  {/* Promo Features/Conditions */}
                  {promo.conditions && typeof promo.conditions === 'object' && !Array.isArray(promo.conditions) && (promo.conditions as any).type === 'table' && (() => {
                    type TableCondition = { type: 'table'; headers: string[]; rows: string[][]; extra?: string[]; warning?: string };
                    const tableCond = promo.conditions as TableCondition;
                    return (
                      <div className="mb-4">
                        <table className="w-full text-xs text-gray-700 border border-gray-200 rounded-lg overflow-hidden">
                          <thead className="bg-blue-50">
                            <tr>
                              {tableCond.headers.map((header: string, idx: number) => (
                                <th key={idx} className="py-2 px-3 font-bold text-gray-900 border-b">{header}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {tableCond.rows.map((row: string[], i: number) => (
                              <tr key={i} className="even:bg-gray-50">
                                {row.map((cell: string, j: number) => (
                                  <td key={j} className="py-2 px-3 border-b">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {tableCond.extra && tableCond.extra.length > 0 && (
                          <ul className="mt-2 text-xs text-gray-500 list-disc list-inside">
                            {tableCond.extra.map((item: string, i: number) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        )}
                        {tableCond.warning && tableCond.warning.length > 0 && tableCond.warning != 'None' && (
                          <div className="mt-2 text-xs text-yellow-700 bg-yellow-100 rounded px-2 py-1 border border-yellow-300">
                            {tableCond.warning}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                  <a
                    href={`/broker/${promo.broker_details.name.toLowerCase().replace(/\s+/g, '-')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      promo.category === 'CASHBACK'
                        ? 'mt-auto inline-flex items-center justify-center w-full px-4 py-2 rounded bg-orange-500 text-white font-semibold text-sm shadow hover:brightness-110 transition disabled:opacity-50'
                        : 'mt-auto inline-flex items-center justify-center w-full px-4 py-2 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-sm shadow hover:brightness-110 transition disabled:opacity-50'
                    }
                    style={{ pointerEvents: promo.link ? 'auto' : 'none', opacity: promo.link ? 1 : 0.6 }}
                  >
                    View details
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No featured promotions available at the moment.</p>
          )}
        </section>

        {/* All Promotions Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Gift className="h-5 w-5 mr-2 text-purple-500" />
              All Promotions
            </h2>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map((i) => (
                <PromotionCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : filteredAllPromotions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAllPromotions.map((promo, idx) => (
                <div
                  key={promo.id || idx}
                  className="bg-white rounded-xl shadow p-6 flex flex-col h-full border border-gray-100"
                >
                  {/* Promo Badge/Category */}
                  <div className="mb-2 flex flex-wrap gap-2 flex-row flex-nowrap overflow-x-auto">
                    {promo.categories?.map((category, idx) => (
                      <span
                        key={idx}
                        className={
                          (category.includes('PROMO')
                            ? 'bg-purple-500 text-white '
                            : category.includes('BONUS')
                            ? 'bg-pink-500 text-white '
                            : category.includes('FREE')
                            ? 'bg-blue-500 text-white '
                            : category.includes('LIMITED')
                            ? 'bg-green-500 text-white '
                            : 'bg-gray-300 text-gray-800 ') +
                          'px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap mr-2'
                        }
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  {/* Promo Country */}
                  <div className="flex flex-row items-center justify-between w-full mb-4 gap-4 bg-gray-200 rounded-xl">
                    {/* Powered by section */}
                    <div className="flex items-center rounded-xl px-3 py-2">
                      <span className="text-xs text-gray-500 mr-2">Powered by</span>
                      <img
                        src={promo.broker_details?.logo || '/assets/images/default-broker-logo.png'}
                        alt={promo.broker_details?.name || 'Broker'}
                        className="h-8 w-8 rounded-full border mr-2"
                      />
                      <a href={`/broker/${promo.broker_details.name.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `/broker/${promo.broker_details.name.toLowerCase().replace(/\s+/g, '-')}`;
                      }}>
                        <span className="font-bold text-cyan-700 text-lg">{promo.broker_details?.name || 'Broker'}</span>
                      </a>
                    </div>
                    {/* Expiry section */}
                    {promo.valid_till && (
                      <div className="flex items-center gap-2 min-w-fit rounded-xl px-3 py-2">
                        <TimerIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-500 text-xs font-medium">
                          Valid Till: <br />
                          {promo.valid_till
                            ? new Date(promo.valid_till).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'N/A'}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Promotion Images */}
                  {promo.images && promo.images.length > 0 && (
                    <img
                      src={promo.images[0].startsWith('/') || promo.images[0].startsWith('http') ? promo.images[0] : `/assets/images/promotions/${promo.images[0]}`}
                      alt={promo.title}
                      className="w-full h-32 object-cover rounded mb-4 border border-gray-200 bg-gray-50 cursor-pointer"
                    />
                  )}
                  {promo.conditions && typeof promo.conditions === 'object' && !Array.isArray(promo.conditions) && (promo.conditions as any).type === 'list' && (() => {
                    type ListCondition = { type: 'list'; items: string[]; extra?: string[]; warning?: string };
                    const listCond = promo.conditions as ListCondition;
                    return (
                      <div className="mb-4">
                        <ul className="text-xs text-gray-700 list-disc list-inside">
                          {listCond.items.map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                        {listCond.extra && listCond.extra.length > 0 && (
                          <ul className="mt-2 text-xs text-gray-500 list-disc list-inside">
                            {listCond.extra.map((item: string, i: number) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        )}
                        {listCond.warning && listCond.warning.length > 0 && listCond.warning != 'None' && (
                          <div className="mt-2 text-xs text-yellow-700 bg-yellow-100 rounded px-2 py-1 border border-yellow-300">
                            {listCond.warning}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Promo Button */}
                  <a
                    href={`/broker/${promo.broker_details.name.toLowerCase().replace(/\s+/g, '-')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      promo.category === 'CASHBACK'
                        ? 'mt-auto inline-flex items-center justify-center w-full px-4 py-2 rounded bg-orange-500 text-white font-semibold text-sm shadow hover:brightness-110 transition disabled:opacity-50'
                        : 'mt-auto inline-flex items-center justify-center w-full px-4 py-2 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-sm shadow hover:brightness-110 transition disabled:opacity-50'
                    }
                    style={{ pointerEvents: promo.link ? 'auto' : 'none', opacity: promo.link ? 1 : 0.6 }}
                  >
                    View details
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No promotions available at the moment.</p>
          )}
        </section>
      </div>
    </div>
  );
}
