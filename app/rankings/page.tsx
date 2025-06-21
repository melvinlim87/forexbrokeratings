"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Award, ArrowRight, ArrowUpRight, Shield, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fetchAllBrokerDetails } from '@/lib/supabase';

// Fallback data in case Supabase fetch fails
const rankedBrokers = [
  {
    rank: 1,
    name: 'Pepperstone',
    logo: 'https://images.pexels.com/photos/8370578/pexels-photo-8370578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.9,
    minDeposit: 200,
    features: ['Raw spreads from 0.0 pips', 'Ultra-fast execution', 'Top-tier regulation'],
    regulators: ['FCA', 'ASIC', 'CySEC', 'BaFin', 'DFSA'],
    tradingPlatforms: ['MT4', 'MT5', 'cTrader'],
    pros: ['Excellent spreads', 'Fast execution', 'Advanced platform options'],
    cons: ['Higher minimum deposit', 'Limited educational content'],
    slug: 'pepperstone',
    website: 'https://www.pepperstone.com'
  },
  {
    rank: 2,
    name: 'IC Markets',
    logo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.8,
    minDeposit: 200,
    features: ['True ECN connectivity', 'Institutional liquidity', '500+ trading instruments'],
    regulations: ['ASIC', 'CySEC', 'FSA'],
    tradingPlatforms: ['MT4', 'MT5', 'cTrader'],
    pros: ['Deep liquidity', 'Low spreads', 'Fast execution speeds'],
    cons: ['Basic research tools', 'Limited educational content'],
    slug: 'ic-markets',
    website: 'https://www.icmarkets.com'
  },
  {
    rank: 3,
    name: 'XM',
    logo: 'https://images.pexels.com/photos/6771985/pexels-photo-6771985.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.7,
    minDeposit: 5,
    features: ['$5 minimum deposit', 'Extensive education', 'Multi-language support'],
    regulations: ['CySEC', 'ASIC', 'IFSC'],
    tradingPlatforms: ['MT4', 'MT5'],
    pros: ['Ultra-low minimum deposit', 'No deposit fees', 'Multi-language support'],
    cons: ['Average trading platform', 'Limited research tools'],
    slug: 'xm',
    website: 'https://www.xm.com'
  }
];

export default function RankingsPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 6;
  
  const fetchBrokers = async (pageNumber: number, isInitialLoad = false) => {
    if (isInitialLoad) setLoading(true);
    else setLoadingMore(true);
    
    try {
      const data = await fetchAllBrokerDetails();
      
      if (data && data.length > 0) {
        // Format the brokers data to match our expected structure
        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = data.slice(startIndex, endIndex);
        
        const formattedBrokers = paginatedData.map((broker: any, index: number) => {
          // Parse array fields that might be stored as JSON strings
          const parseArrayField = (field: any) => {
            if (!field) return [];
            if (Array.isArray(field)) return field;
            try {
              return JSON.parse(field);
            } catch {
              return [field];
            }
          };
          console.log('check broker here', broker)
          return {
            rank: startIndex + index + 1,
            name: broker.name || `Broker ${startIndex + index + 1}`,
            logo: broker.logo || `https://via.placeholder.com/120x60?text=${broker.name || 'Broker'}`,
            website: broker.website,
            rating: broker.rating || 4.0,
            minDeposit: broker.minDeposit || 100,
            features: parseArrayField(broker.features) || [
              'Competitive spreads',
              'Fast execution',
              'Multiple platforms'
            ],
            regulations: parseArrayField(broker.regulations) || ['Regulated'],
            tradingPlatforms: parseArrayField(broker.platforms) || ['MT4', 'MT5'],
            pros: parseArrayField(broker.pros) || ['Professional trading services'],
            cons: parseArrayField(broker.cons) || ['Limited educational resources'],
            slug: broker.name ? broker.name.toLowerCase().replace(/\s+/g, '-') : `broker-${startIndex + index + 1}`,
            spread_eur_usd: broker.spread_eur_usd,
            leverage_max: broker.leverage_max,
          };
        });
        
        setBrokers(prev => isInitialLoad ? formattedBrokers : [...prev, ...formattedBrokers]);
        
        setHasMore(endIndex < data.length);
      } else if (pageNumber === 1) {
        // If no data from API, use fallback data for first page
        setBrokers(rankedBrokers);
        setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      if (pageNumber === 1) {
        setError('Failed to load broker rankings');
        setBrokers(rankedBrokers);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };
  
  // Initial load
  useEffect(() => {
    fetchBrokers(1, true);
  }, []);
  
  // Handle scroll for infinite loading
  useEffect(() => {
    const handleScroll = () => {
      if (loading || loadingMore || !hasMore) return;
      
      const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
      const bottomPosition = document.documentElement.offsetHeight - 200; // 200px from bottom
      
      if (scrollPosition > bottomPosition) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchBrokers(nextPage);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, loading, loadingMore, hasMore]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-metallic pt-28 pb-16 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Top Rated Forex Brokers
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Comprehensive rankings of the best forex brokers based on our detailed analysis and evaluation criteria.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="ml-4 text-gray-600 dark:text-gray-400">Loading broker rankings...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Showing fallback data instead.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {!loading && brokers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">No brokers found.</p>
              </div>
            )}
            {(() => {
              // Split into two columns: left (first 5), right (next 5)
              const left = brokers.slice(0, 5);
              const right = brokers.slice(5, 10);
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl mx-auto">
                  <div className="space-y-8">
                    {left.map((broker, index) => (
                      <Link key={broker.rank} href={`/broker/${broker.slug}`}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          onMouseEnter={() => setHoveredCard(broker.rank)}
                          onMouseLeave={() => setHoveredCard(null)}
                        >
                          <Card className="flex flex-row items-center gap-4 px-6 py-6 mb-4 border border-gray-200 dark:border-gray-800 shadow w-full min-w-0">
                            {/* Ranking Badge */}
                            <div className="flex flex-col items-center mr-4 min-w-[4px]">
                              <div className="rounded-full w-8 h-8 flex items-center justify-center font-bold text-md text-white bg-gradient-to-br from-yellow-400 to-orange-400">
                                #{broker.rank}
                              </div>
                            </div>
                            {/* Logo */}
                            <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center min-w-[32px]">
                              <Image src={broker.logo} alt={broker.name} width={32} height={32} className="object-contain h-14 w-14" />
                            </div>
                            {/* Main Info */}
                            <div className="flex-1 min-w-0 w-full flex flex-row items-center gap-4">
                              <span className="text-lg font-bold text-gray-900 dark:text-white w-40 truncate">{broker.name}</span>
                              {/* Key stats row */}
                              <div className="flex flex-col items-start w-28">
                                <span className="text-cyan-400 font-bold text-base">{broker.spread_eur_usd}</span>
                                <span className="text-xs text-gray-400">Min Spread</span>
                              </div>
                              <div className="flex flex-col items-start w-28">
                                <span className="text-purple-400 font-bold text-base">{broker.leverage_max}</span>
                                <span className="text-xs text-gray-400">Max Leverage</span>
                              </div>
                              <div className="flex flex-col items-end w-16 gap-2">
                                <div className="flex items-center">
                                  <span className="text-2xl font-extrabold text-yellow-400 mr-1">{broker.score || broker.rating || '—'}</span>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                  <div className="space-y-8">
                    {right.map((broker, index) => (
                      <Link key={broker.rank} href={`/broker/${broker.slug}`}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          onMouseEnter={() => setHoveredCard(broker.rank)}
                          onMouseLeave={() => setHoveredCard(null)}
                        >
                          <Card className="flex flex-row items-center gap-4 px-6 py-6 mb-4 border border-gray-200 dark:border-gray-800 shadow w-full min-w-0">
                            {/* Ranking Badge */}
                            <div className="flex flex-col items-center mr-4 min-w-[4px]">
                              <div className="rounded-full w-8 h-8 flex items-center justify-center font-bold text-md text-white bg-gradient-to-br from-yellow-400 to-orange-400">
                                #{broker.rank}
                              </div>
                            </div>
                            {/* Logo */}
                            <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center min-w-[32px]">
                              <Image src={broker.logo} alt={broker.name} width={32} height={32} className="object-contain h-14 w-14" />
                            </div>
                            {/* Main Info */}
                            <div className="flex-1 min-w-0 w-full flex flex-row items-center gap-4">
                              <span className="text-lg font-bold text-gray-900 dark:text-white w-40 truncate">{broker.name}</span>
                              {/* Key stats row */}
                              <div className="flex flex-col items-start w-28">
                                <span className="text-cyan-400 font-bold text-base">{broker.spread_eur_usd}</span>
                                <span className="text-xs text-gray-400">Min Spread</span>
                              </div>
                              <div className="flex flex-col items-start w-28">
                                <span className="text-purple-400 font-bold text-base">{broker.leverage_max}</span>
                                <span className="text-xs text-gray-400">Max Leverage</span>
                              </div>
                              <div className="flex flex-col items-end w-16 gap-2">
                                <div className="flex items-center">
                                  <span className="text-2xl font-extrabold text-yellow-400 mr-1">{broker.score || broker.rating || '—'}</span>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })()}

            
            {loadingMore && (
              <div className="flex justify-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              </div>
            )}
            
            {!loading && !loadingMore && !hasMore && brokers.length > 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                You've reached the end of the list
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}