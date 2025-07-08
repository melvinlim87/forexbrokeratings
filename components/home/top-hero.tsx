'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import AnimateAiToolsPanel from "@/components/ai-tools/AnimateAiToolsPanel";
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Star, Search, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NetworkDiagram from '../network/NetworkDiagram';
import { BrokerDetails, fetchAllBrokerDetails } from '@/lib/supabase';
import { useDebounce } from 'use-debounce';
import Image from 'next/image';
import Link from 'next/link';
import { Textarea } from '../ui/textarea';
import { useLoginModal } from '../broker/LoginModalContext';
import LoginModal from '../ui/LoginModal';

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
  const [opacityRange, setOpacityRange] = useState([0, 300]);
  const opacity = useTransform(scrollY, [0, opacityRange[1]], [1, 0]);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    function handleResize() {
      setOpacityRange(window.innerWidth < 768 ? [0, 800] : [0, 300]);
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [searchResults, setSearchResults] = useState<BrokerDetails[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
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
        // console.error('Error searching brokers:', error);
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
  
  const handleBrokerSelect = (broker: BrokerDetails) => {
    router.push(`/broker/${broker.name.toLowerCase().replace(/\s+/g, '-')}`);
    setShowResults(false);
  };

  // --- AI typewriter effect for Textarea ---
  const aiMessage = React.useMemo(() => "Hello, I am your AI Analyzer for your broker ", []);
  const [aiTypedMessage, setAiTypedMessage] = useState("");
  const aiResultRef = useRef<HTMLTextAreaElement>(null);
  const [aiResultHeight, setAiResultHeight] = useState<string | number>('auto');
  useEffect(() => {
    setAiTypedMessage("");
    let idx = 0;
    const interval = setInterval(() => {
      setAiTypedMessage((prev) => {
        if (idx >= aiMessage.length) {
          clearInterval(interval);
          return prev;
        }
        const next = aiMessage.slice(0, idx + 1);
        idx++;
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [aiMessage]);
  useEffect(() => {
    if (aiResultRef.current) {
      aiResultRef.current.style.height = 'auto';
      const newHeight = Math.min(aiResultRef.current.scrollHeight, 320);
      aiResultRef.current.style.height = newHeight + 'px';
      if (aiResultHeight !== newHeight) {
        setAiResultHeight(newHeight);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiTypedMessage]);

  const user = useSelector((state: any) => state.auth?.user);
  const { open, setOpen } = useLoginModal();

  const handleAnalyseByAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.email_confirmed_at) {
      setOpen(true);
      return;
    }
    setLoading(true)
    setAiTypedMessage("Analysing...")
    const res = await fetch('/api/aitools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.jwt}` },
      body: JSON.stringify({name: searchTerm})
    });
    if (!res.ok) throw new Error('AI analysis failed');
    const data = await res.json();
    setLoading(false)
    let message = data.result
    if (message.length === 0) {
      return setAiTypedMessage("No result found")
    }
    let i = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      i++;
      setAiTypedMessage(message.slice(0, i));
      if (i >= message.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 12);
    setAiTypedMessage(message)  
  }

  return (
    <>
      <LoginModal open={open} onClose={() => setOpen(false)} />
      <div className="relative w-full overflow-hidden bg-metallic min-h-[600px]">
        {/* Content container with max-width and centered content */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
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
        // style={{ y: springY, opacity: springOpacity }}
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
          
          <NetworkDiagram />
          
          {/* AI Tools Field */}
          <AnimateAiToolsPanel setOpen={setOpen} />
        </div>
      </motion.div>
      </div>
    </div>
    </>
  );
}