"use client";

import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, Sparkles, Gift, Timer, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { fetchBrokerPromotions } from '@/lib/supabase-promotions';
import { fetchAllBrokerDetails } from '@/lib/supabase';
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
  const [promotions, setPromotions] = useState<BrokerPromotion[]>([]);
  const [featuredPromotions, setFeaturedPromotions] = useState<BrokerPromotion[]>([]);
  const [brokers, setBrokers] = useState<Record<string, Broker>>({});
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [categories] = useState(defaultCategories);

  // Fetch promotions and broker data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all broker details first
        const brokersData = await fetchAllBrokerDetails();
        
        // Create a map of broker details for easy lookup
        const brokersMap = brokersData.reduce((acc, broker) => ({
          ...acc,
          [broker.id]: broker
        }), {});
        
        setBrokers(brokersMap);

        // Fetch promotions and enhance with broker data
        const promotionsData = await fetchBrokerPromotions();
        const enhancedPromotions = promotionsData.map((promo: any) => ({
          ...promo,
          broker_name: brokersMap[promo.broker_detail_id]?.name || 'Unknown Broker',
          broker_logo: brokersMap[promo.broker_detail_id]?.logo || null,
          broker_slug: brokersMap[promo.broker_detail_id]?.slug || ''
        }));
        
        setPromotions(enhancedPromotions);
        
        // Set random featured promotions
        const featured = [...enhancedPromotions]
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        setFeaturedPromotions(featured);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load promotions. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter promotions based on search query
  const filteredPromotions = searchQuery
    ? promotions.filter(promo => 
        promo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        promo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (promo.broker_name || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : promotions;

  // Group filtered promotions by broker
  const promotionsByBroker = filteredPromotions.reduce<Record<string, BrokerPromotion[]>>((acc, promo) => {
    const brokerId = promo.broker_detail_id;
    if (!acc[brokerId]) {
      acc[brokerId] = [];
    }
    acc[brokerId].push(promo);
    return acc;
  }, {});

  // Get broker info
  const getBrokerInfo = (brokerId: string) => {
    return brokers[brokerId] || { id: brokerId, name: 'Unknown Broker', logo: null, slug: '' };
  };

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
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Forex Broker Promotions</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Discover the latest promotions, bonuses, and special offers from top forex brokers.
        </p>
        
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-12">
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
        
        {featuredPromotions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPromotions.map((promo, index) => (
              <PromotionCard 
                key={promo.id}
                promo={promo}
                index={index}
                hoveredCard={hoveredCard}
                setHoveredCard={setHoveredCard}
                hideBrokerInfo={false}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No featured promotions available at the moment.</p>
        )}
      </section>

      {/* All Promotions Grouped by Broker */}
      <section>
        <h2 className="text-2xl font-bold mb-6">All Promotions</h2>
        
        {Object.entries(promotionsByBroker).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(promotionsByBroker).map(([brokerId, brokerPromotions]) => {
              const broker = getBrokerInfo(brokerId);
              return (
                <BrokerPromotionsCard
                  key={brokerId}
                  brokerName={broker.name}
                  brokerLogo={broker.logo}
                  promotions={brokerPromotions}
                  hoveredCard={hoveredCard}
                  setHoveredCard={setHoveredCard}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-muted-foreground">No promotions found matching your search.</p>
            {searchQuery && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchQuery('')}
              >
                Clear search
              </Button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
