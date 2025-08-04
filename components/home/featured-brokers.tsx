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
        // console.error('Error fetching brokers:', err);
        setError('Failed to load brokers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBrokers();
  }, []);

  const calculateAverageRating = (broker: BrokerDetails) => {
    const { regulations, risk_control, promotions, user_experience, environment, user_traffic } = broker;
    const sum = (user_traffic || 0) + (regulations || 0) + (risk_control || 0) + 
               (promotions || 0) + (user_experience || 0) + (environment || 0);
    return (sum / 6) * 10;
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-black">Top Rate Forex Brokers</h2>
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

        {/* Desktop Table (md+) */}
        <div className="overflow-x-auto rounded-2xl shadow-lg from-gray-950/90 via-gray-900/90 to-gray-950/95 p-1 hidden md:block">
          <table className="min-w-full text-sm text-left rounded-2xl overflow-hidden bg-gray-950">
            <thead className="bg-white">
              <tr>
                <th className="px-4 py-3 font-semibold text-center text-gray-800">Rank</th>
                <th className="px-4 py-3 font-semibold text-gray-800">Broker</th>
                <th className="px-4 py-3 font-semibold text-center text-gray-800">Rating</th>
                <th className="px-4 py-3 font-semibold text-center text-gray-800">User Traffic</th>
                <th className="px-4 py-3 font-semibold text-center text-gray-800">Regulations</th>
                <th className="px-4 py-3 font-semibold text-center text-gray-800">Risk Control</th>
                <th className="px-4 py-3 font-semibold text-center text-gray-800">Promotions</th>
                <th className="px-4 py-3 font-semibold text-center text-gray-800">User Ratings</th>
                <th className="px-4 py-3 font-semibold text-center text-gray-800">Trading Platform</th>
                <th className="px-4 py-3 font-semibold text-center text-gray-800">Regulated By</th>
              </tr>
            </thead>
            <tbody className="bg-gray-50">
              {brokers.map((broker, idx) => (
                <tr key={broker.id} className="border-b border-gray-200 hover:bg-blue-100 transition cursor-pointer" onClick={() => broker.name && window.open(`/broker/${broker.name.toLowerCase().replace(/\s+/g, '-')}`)}>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-black font-bold text-sm md:text-lg shadow">
                      #{broker.rank || idx + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                      {broker.logo ? (
                        <img src={broker.logo} alt={broker.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-lg font-bold text-black">{broker.name?.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-black leading-tight text-sm md:text-lg ">{broker.name}</div>
                      <div className="text-sm md:text-md text-gray-400">{broker.year_published || ''}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {(() => {
                        let rawScore = broker.avgRating;
                        if (typeof rawScore === 'string') {
                          const parsed = parseFloat(rawScore);
                          rawScore = isNaN(parsed) ? 0 : parsed;
                        }
                        if (typeof rawScore !== 'number' || isNaN(rawScore)) {
                          return <span className="text-sm md:text-lg font-medium text-gray-400">-</span>;
                        }
                        // If score is out of 10, scale to 5
                        let score = rawScore > 5 ? (rawScore / 10) * 5 : rawScore;
                        score = Math.min(5, Math.max(0, score)); // Clamp between 0-5
                        const fullStars = Math.floor(score);
                        const hasHalfStar = score % 1 >= 0.25 && score % 1 < 0.75;
                        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
                        return (
                          <>
                            {/* Full stars */}
                            {Array(fullStars).fill(0).map((_, i) => (
                              <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-yellow-400" fill="currentColor" viewBox="0 0 20 20"><polygon points="9.9,1.1 7.6,6.8 1.4,7.6 6,12.1 4.7,18.3 9.9,15.3 15.1,18.3 13.8,12.1 18.4,7.6 12.2,6.8" /></svg>
                            ))}
                            {/* Half star */}
                            {hasHalfStar && (
                              <svg className="w-4 h-4 text-yellow-400 fill-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <defs>
                                  <linearGradient id="half">
                                    <stop offset="50%" stopColor="#facc15" />
                                    <stop offset="50%" stopColor="#d1d5db" />
                                  </linearGradient>
                                </defs>
                                <polygon points="9.9,1.1 7.6,6.8 1.4,7.6 6,12.1 4.7,18.3 9.9,15.3 15.1,18.3 13.8,12.1 18.4,7.6 12.2,6.8" fill="url(#half)" />
                              </svg>
                            )}
                            {/* Empty stars */}
                            {Array(emptyStars).fill(0).map((_, i) => (
                              <svg key={`empty-${i}`} className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><polygon points="9.9,1.1 7.6,6.8 1.4,7.6 6,12.1 4.7,18.3 9.9,15.3 15.1,18.3 13.8,12.1 18.4,7.6 12.2,6.8" /></svg>
                            ))}
                            <span className="ml-1 text-sm md:text-lg text-gray-600">{typeof rawScore === 'number' ? rawScore.toFixed(2) : '-'}{typeof rawScore === 'number' ? '/100' : ''}</span>
                          </>
                        );
                      })()}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-cyan-600 font-medium text-sm md:text-lg ">
                    {broker.user_traffic || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-center text-blue-600 font-medium text-sm md:text-lg ">
                    {broker.regulations || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-center text-green-600 font-medium text-sm md:text-lg ">
                    {broker.risk_control || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-center text-green-600 font-medium text-sm md:text-lg ">
                    {broker.promotions || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-center text-green-600 font-medium text-sm md:text-lg ">
                    {broker.user_experience || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-center text-green-600 font-medium text-sm md:text-lg ">
                    {broker.environment || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {broker.regulators && Array.isArray(broker.regulators) && broker.regulators.length > 0 ? (
                      <div className="flex flex-wrap gap-1 justify-center">
                        {broker.regulators?.slice(0, 2).map((regulator, i) => (
                          <span key={i} className="bg-white text-black px-2 py-0.5 rounded text-xs font-medium border border-cyan-700" style={{borderRadius: '1.25rem'}}>{regulator}</span>
                        ))}
                        {broker.regulators && broker.regulators.length > 2 && (
                          <span className="bg-white text-black px-2 py-0.5 rounded text-xs font-medium border border-cyan-700" style={{borderRadius: '1.25rem'}}>+{broker.regulators.length - 2}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>           
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile Cards (below md) */}
        <div className="flex flex-col gap-4 md:hidden">
          {brokers.map((broker, idx) => (
            <div key={broker.id} className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow p-4 flex flex-col gap-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-800 transition" onClick={() => broker.name && window.open(`/broker/${broker.name.toLowerCase().replace(/\s+/g, '-')}`)}>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-black font-bold text-xs shadow bg-white">#{broker.rank || idx + 1}</span>
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                  {broker.logo ? (
                    <img src={broker.logo} alt={broker.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-lg font-bold text-black">{broker.name?.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-black leading-tight">{broker.name}</div>
                  <div className="text-xs text-gray-400">{broker.year_published || ''}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Rating:</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < Math.round(broker.avgRating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20"><polygon points="9.9,1.1 7.6,6.8 1.4,7.6 6,12.1 4.7,18.3 9.9,15.3 15.1,18.3 13.8,12.1 18.4,7.6 12.2,6.8" /></svg>
                  ))}
                  <span className="ml-1 text-xs text-gray-600">{broker.avgRating?.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">User Traffic:</span>
                <span className="text-cyan-600 font-medium">{broker.user_traffic || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Regulations:</span>
                <span className="text-blue-600 font-medium">{broker.regulations || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Risk Control:</span>
                <span className="text-green-600 font-medium">{broker.risk_control || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Promotions:</span>
                <span className="text-green-600 font-medium">{broker.promotions || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">User Ratings:</span>
                <span className="text-green-600 font-medium">{broker.user_experience || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Trading Platform:</span>
                <span className="text-green-600 font-medium">{broker.environment || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-700">Regulated By:</span>
                {broker.regulators && Array.isArray(broker.regulators) && broker.regulators.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {broker.regulators?.slice(0, 2).map((regulator, i) => (
                      <span key={i} className="bg-white text-black px-2 py-0.5 rounded text-xs font-medium border border-cyan-700" style={{borderRadius: '1.25rem'}}>{regulator}</span>
                    ))}
                    {broker.regulators && broker.regulators.length > 2 && (
                      <span className="bg-white text-black px-2 py-0.5 rounded text-xs font-medium border border-cyan-700" style={{borderRadius: '1.25rem'}}>+{broker.regulators.length - 2}</span>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}