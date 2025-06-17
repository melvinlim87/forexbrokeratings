'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Star, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NetworkDiagram from '../network/NetworkDiagram';
import { fetchAllBrokerDetails } from '@/lib/supabase';
import { useDebounce } from 'use-debounce';

interface Broker {
  id: string;
  name: string;
  logo?: string;
  rating?: number;
  // Add other broker properties as needed
}

export default function TopHero() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [searchResults, setSearchResults] = useState<Broker[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  const springOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });
  
  // Fetch search results
  useEffect(() => {
    const searchBrokers = async () => {
      if (!debouncedSearchTerm.trim()) {
        setSearchResults([]);
        return;
      }
      
      setIsSearching(true);
      try {
        const allBrokers = await fetchAllBrokerDetails();
        const filtered = allBrokers.filter(broker => 
          broker.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          (broker.description && broker.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
        ).slice(0, 5); // Limit to 5 results
        
        setSearchResults(filtered);
      } catch (error) {
        console.error('Error searching brokers:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };
    
    searchBrokers();
  }, [debouncedSearchTerm]);
  
  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/brokers?search=${encodeURIComponent(searchTerm.trim())}`);
      setShowResults(false);
    }
  };
  
  const handleBrokerSelect = (broker: Broker) => {
    router.push(`/broker/${broker.name.toLowerCase().replace(/\s+/g, '-')}`);
    setShowResults(false);
  };

  return (
    <div className="relative overflow-hidden bg-metallic min-h-[600px] px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
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
        
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -right-1/4 top-1/4 w-96 h-96 bg-white/20 rounded-full filter blur-3xl"
        />
        
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute -left-1/4 top-3/4 w-96 h-96 bg-gray-400/20 rounded-full filter blur-3xl"
        />
        
        {/* Additional decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-gray-300/20 to-gray-500/20 rounded-full blur-2xl" />
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-gray-200/20 to-gray-400/20 rounded-full blur-2xl" />
        </div>
      </div>

      <motion.div 
        ref={containerRef}
        style={{ y: springY, opacity: springOpacity }}
        className="container mx-auto pt-16 pb-16 relative z-10"
      >
        <div className="max-w-5xl mx-auto text-center p-12">
          <div className="flex justify-center space-x-4 mb-8">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1 }}
                className="relative group"
              >
                <div className="relative">
                  {/* Base silver stars */}
                  <div className="relative">
                    <Star
                      className="w-10 h-10 text-gray-300"
                      fill="currentColor"
                      strokeWidth={0}
                      style={{
                        filter: 'drop-shadow(0 0 2px rgba(156, 163, 175, 0.3))'
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Star
                        className="w-6 h-6 text-gray-400"
                        fill="currentColor"
                        strokeWidth={0}
                        style={{
                          filter: 'drop-shadow(0 0 2px rgba(156, 163, 175, 0.3))'
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Gold overlay with left-to-right animation */}
                  <motion.div
                    className="absolute inset-0"
                    initial={{ clipPath: 'inset(0 100% 0 0)' }}
                    animate={{
                      clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)']
                    }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.2,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                  >
                    <Star
                      className="w-10 h-10 text-amber-400"
                      fill="currentColor"
                      strokeWidth={0}
                      style={{
                        filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.5))'
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Star
                        className="w-6 h-6 text-amber-300"
                        fill="currentColor"
                        strokeWidth={0}
                        style={{
                          filter: 'drop-shadow(0 0 3px rgba(251, 191, 36, 0.4))'
                        }}
                      />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Forex Broker Ratings
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 mb-12 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ marginBottom: '3rem' }}
          >
            The Aggregated Forex Broker Ratings Across All Rating Platforms
          </motion.p>

          <motion.div
            className="max-w-2xl mx-auto mb-12 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            ref={searchRef}
          >
            <form onSubmit={handleSearch} className="relative">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    {isSearching ? (
                      <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                    ) : (
                      <Search className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <Input
                    type="text"
                    placeholder="Search for brokers..."
                    className="pl-10 py-6 w-full bg-white/10 backdrop-blur-sm border-white/20 text-gray-800 dark:text-white placeholder:text-gray-500"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowResults(true);
                    }}
                    onFocus={() => setShowResults(true)}
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="px-8 py-6 text-base bg-blue-600 hover:bg-blue-700"
                  disabled={isSearching}
                >
                  {isSearching ? 'Searching...' : 'Find Brokers'}
                </Button>
              </div>
              
              {/* Search results dropdown */}
              {showResults && searchTerm && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
                  {isSearching ? (
                    <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div>
                      {searchResults.map((broker) => (
                        <button
                          key={broker.id}
                          type="button"
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3"
                          onClick={() => handleBrokerSelect(broker)}
                        >
                          {broker.logo && (
                            <div className="h-8 w-8 relative">
                              <img
                                src={broker.logo}
                                alt={broker.name}
                                className="h-full w-full object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {broker.name}
                            </div>
                            {typeof broker.rating === 'number' && !isNaN(broker.rating) ? (
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                                {broker.rating.toFixed(1)}
                              </div>
                            ) : null}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : searchTerm ? (
                    <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                      No brokers found. Try a different search term.
                    </div>
                  ) : null}
                </div>
              )}
            </form>
          </motion.div>
          
          <NetworkDiagram />
        </div>
      </motion.div>
    </div>
  );
}