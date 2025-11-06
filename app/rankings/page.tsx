"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Award, ArrowRight, ArrowUpRight, Shield, TrendingUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fetchAllBrokerDetails, BrokerDetails } from '@/lib/supabase';
import { useI18n } from '@/lib/i18n-client';

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
  const {t} = useI18n();
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 10;
  
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
            regulators: broker.regulators,
            affiliate_link: broker.affiliate_link,
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

  const handleOpenModal = (broker: BrokerDetails) => {
    if (!broker.affiliate_link) {
      // show Please claim your spots modal
      setShowModal(true);
      return;
    } else {
      // navigate to broker slug page
      window.location.href = `/broker/${broker.slug}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-[#091f40] to-[#0f2d59] h-[180px] flex flex-col justify-center items-center text-center px-4 mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow">{t('rankings.hero_title')}</h1>
        <h2 className="text-lg md:text-2xl text-cyan-200 font-medium max-w-2xl mx-auto">{t('rankings.hero_subtitle')}</h2>
      </header>

      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="ml-4 text-gray-600">{t('rankings.loading')}</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <p className="text-gray-600 mt-2">{t('rankings.showing_fallback')}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {!loading && brokers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">{t('rankings.no_brokers')}</p>
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
                      <motion.div
                        key={broker.rank}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        onMouseEnter={() => setHoveredCard(broker.rank)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <Card className="flex flex-col gap-4 px-4 py-5 mb-6 border border-gray-200 shadow-lg rounded-xl bg-white w-full min-w-0 transition hover:shadow-xl">
                          {/* Top: Rank & Logo Row */}
                          <div className="flex flex-row items-center gap-4">
                            <div className="flex flex-col items-center min-w-[4px]">
                              <div className="rounded-full w-10 h-10 flex items-center justify-center font-extrabold text-lg text-white bg-gradient-to-br from-yellow-400 to-orange-400 shadow">
                                #{broker.rank}
                              </div>
                            </div>
                            <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-100 flex items-center justify-center min-w-[40px]">
                              <Image src={broker.logo} alt={broker.name} width={40} height={40} className="object-contain h-14 w-14" />
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                              <span className="text-xl font-bold text-gray-900 truncate cursor-pointer" onClick={() => handleOpenModal(broker)}>{broker.name}</span>
                              {/* <a href={broker.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline truncate">{broker.website}</a> */}
                            </div>
                            <div className="flex flex-col items-end min-w-[60px]">
                              <span className="text-2xl font-extrabold text-yellow-400 leading-none">{(parseFloat(broker.rating) / 20).toFixed(2) || '—'}</span>
                              <span className="text-xs text-gray-400">{t('rankings.rating')}</span>
                            </div>
                          </div>
                          {/* Divider */}
                          <div className="border-t border-gray-100 my-2" />
                          {/* Accordion for Regulators & Platforms */}
                          <Button
                            variant="ghost"
                            className="w-full text-left flex justify-between items-center py-2 px-0 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                            onClick={() => setOpenAccordion(openAccordion === `info-${broker.rank}` ? null : `info-${broker.rank}`)}
                            aria-expanded={openAccordion === `info-${broker.rank}`}
                          >
                            <span className='text-sm md:text-lg'>{t('rankings.regulators_platforms')}</span>
                            <ChevronDown className={`ml-2 transition-transform ${openAccordion === `info-${broker.rank}` ? 'rotate-180' : ''}`} size={16} />
                          </Button>
                          {openAccordion === `info-${broker.rank}` && (
                            <div className="flex flex-wrap md:flex-nowrap gap-2 items-center justify-between">
                              <div className="flex flex-col gap-1 w-full md:w-1/2 basis-1/2">
                                <span className="text-xs font-semibold text-gray-500">{t('common.regulators')}</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {broker.regulators?.map((reg: string, i: number) => (
                                    <span key={i} className="bg-cyan-50 text-cyan-800 px-2 py-0.5 rounded text-xs font-medium border border-cyan-300" style={{borderRadius: '1.25rem'}}>{reg}</span>
                                  ))}
                                </div>
                              </div>
                              <div className="flex flex-col gap-1 w-full md:w-1/2 basis-1/2">
                                <span className="text-xs font-semibold text-gray-500">{t('common.platforms')}</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {broker.tradingPlatforms?.map((platform: string, i: number) => (
                                    <span key={i} className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded text-xs font-medium border border-blue-200" style={{borderRadius: '1.25rem'}}>{platform}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                          {/* Accordion for Pros & Cons */}
                          <Button
                            variant="ghost"
                            className="w-full text-left flex justify-between items-center py-2 px-0 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                            onClick={() => setOpenAccordion(openAccordion === `proscons-${broker.rank}` ? null : `proscons-${broker.rank}`)}
                            aria-expanded={openAccordion === `proscons-${broker.rank}`}
                          >
                            <span className='text-sm md:text-lg'>{t('rankings.pros_cons')}</span>
                            <ChevronDown className={`ml-2 transition-transform ${openAccordion === `proscons-${broker.rank}` ? 'rotate-180' : ''}`} size={16} />
                          </Button>
                          {openAccordion === `proscons-${broker.rank}` && (
                            <div className="flex flex-col md:flex-row gap-4 w-full">
                              <div className="flex-1">
                                <span className="text-xs font-semibold text-green-700">{t('rankings.pros')}</span>
                                <ul className="list-disc list-inside text-xs text-green-700 mt-1 space-y-0.5">
                                  {broker.pros?.slice(0, 3).map((pro: string, i: number) => (
                                    <li key={i}>{pro}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="flex-1">
                                <span className="text-xs font-semibold text-red-700">{t('rankings.cons')}</span>
                                <ul className="list-disc list-inside text-xs text-red-700 mt-1 space-y-0.5">
                                  {broker.cons?.slice(0, 3).map((con: string, i: number) => (
                                    <li key={i}>{con}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                  <div className="space-y-8">
                    {right.map((broker, index) => (
                      <motion.div
                        key={broker.rank}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        onMouseEnter={() => setHoveredCard(broker.rank)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <Card className="flex flex-col gap-4 px-4 py-5 mb-6 border border-gray-200 shadow-lg rounded-xl bg-white w-full min-w-0 transition hover:shadow-xl">
                          {/* Top: Rank & Logo Row */}
                          <div className="flex flex-row items-center gap-4">
                            <div className="flex flex-col items-center min-w-[4px]">
                              <div className="rounded-full w-10 h-10 flex items-center justify-center font-extrabold text-lg text-white bg-gradient-to-br from-yellow-400 to-orange-400 shadow">
                                #{broker.rank}
                              </div>
                            </div>
                            <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-100 flex items-center justify-center min-w-[40px]">
                              <Image src={broker.logo} alt={broker.name} width={40} height={40} className="object-contain h-14 w-14" />
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                              <span className="text-xl font-bold text-gray-900 truncate cursor-pointer" onClick={() => handleOpenModal(broker)}>{broker.name}</span>
                              {/* <a href={broker.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline truncate">{broker.website}</a> */}
                            </div>
                            <div className="flex flex-col items-end min-w-[60px]">
                              <span className="text-2xl font-extrabold text-yellow-400 leading-none">{(parseFloat(broker.rating) / 20).toFixed(2) || '—'}</span>
                              <span className="text-xs text-gray-400">{t('rankings.rating')}</span>
                            </div>
                          </div>
                          {/* Divider */}
                          <div className="border-t border-gray-100 my-2" />
                          {/* Accordion for Regulators & Platforms */}
                          <Button
                            variant="ghost"
                            className="w-full text-left flex justify-between items-center py-2 px-0 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                            onClick={() => setOpenAccordion(openAccordion === `info-${broker.rank}` ? null : `info-${broker.rank}`)}
                            aria-expanded={openAccordion === `info-${broker.rank}`}
                          >
                            <span className='text-sm md:text-lg'>{t('rankings.regulators_platforms')}</span>
                            <ChevronDown className={`ml-2 transition-transform ${openAccordion === `info-${broker.rank}` ? 'rotate-180' : ''}`} size={16} />
                          </Button>
                          {openAccordion === `info-${broker.rank}` && (
                            <div className="flex flex-wrap md:flex-nowrap gap-2 items-center justify-between">
                              <div className="flex flex-col gap-1 w-full md:w-1/2 basis-1/2">
                                <span className="text-xs font-semibold text-gray-500">{t('common.regulators')}</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {broker.regulators?.map((reg: string, i: number) => (
                                    <span key={i} className="bg-cyan-50 text-cyan-800 px-2 py-0.5 rounded text-xs font-medium border border-cyan-300" style={{borderRadius: '1.25rem'}}>{reg}</span>
                                  ))}
                                </div>
                              </div>
                              <div className="flex flex-col gap-1 w-full md:w-1/2 basis-1/2">
                                <span className="text-xs font-semibold text-gray-500">{t('common.platforms')}</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {broker.tradingPlatforms?.map((platform: string, i: number) => (
                                    <span key={i} className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded text-xs font-medium border border-blue-200" style={{borderRadius: '1.25rem'}}>{platform}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                          {/* Accordion for Pros & Cons */}
                          <Button
                            variant="ghost"
                            className="w-full text-left flex justify-between items-center py-2 px-0 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                            onClick={() => setOpenAccordion(openAccordion === `proscons-${broker.rank}` ? null : `proscons-${broker.rank}`)}
                            aria-expanded={openAccordion === `proscons-${broker.rank}`}
                          >
                            <span className='text-sm md:text-lg'>{t('rankings.pros_cons')}</span>
                            <ChevronDown className={`ml-2 transition-transform ${openAccordion === `proscons-${broker.rank}` ? 'rotate-180' : ''}`} size={16} />
                          </Button>
                          {openAccordion === `proscons-${broker.rank}` && (
                            <div className="flex flex-col md:flex-row gap-4 w-full">
                              <div className="flex-1">
                                <span className="text-xs font-semibold text-green-700">{t('rankings.pros')}</span>
                                <ul className="list-disc list-inside text-xs text-green-700 mt-1 space-y-0.5">
                                  {broker.pros?.slice(0, 3).map((pro: string, i: number) => (
                                    <li key={i}>{pro}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="flex-1">
                                <span className="text-xs font-semibold text-red-700">{t('rankings.cons')}</span>
                                <ul className="list-disc list-inside text-xs text-red-700 mt-1 space-y-0.5">
                                  {broker.cons?.slice(0, 3).map((con: string, i: number) => (
                                    <li key={i}>{con}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </Card>
                      </motion.div>
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
              <div className="text-center py-8 text-gray-500FP">
                {t('rankings.reached_end_of_list')}
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative p-6"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="claim-modal-title"
          >
            <div id="claim-modal-title" className="text-xl font-semibold mb-2 text-gray-900">
              {t('home.featured.claim_title')}
            </div>
            <p className="text-gray-700 mb-6">{t('home.featured.claim_description')}</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowModal(false)} className="px-4">
                {t('home.featured.close')}
              </Button>
              <Link href="/contact-us">
                <Button className="bg-amber-500 hover:bg-amber-600 text-white px-4">
                  {t('home.featured.contact_us')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}