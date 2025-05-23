"use client";

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div 
        ref={containerRef} 
        className="container mx-auto px-4 pt-20 pb-24 sm:pt-24 sm:pb-32 lg:pt-32 lg:pb-40 relative z-10"
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Find the <span className="text-blue-600 dark:text-blue-500">Perfect Forex Broker</span> for Your Trading Journey
          </motion.h1>
          
          <motion.p 
            className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            We've reviewed and ranked the best forex brokers to help you make informed decisions. Compare fees, platforms, and regulations all in one place.
          </motion.p>
          
          <motion.div 
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative flex-grow max-w-md mx-auto sm:mx-0 w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input 
                type="text" 
                placeholder="Search for brokers..." 
                className="pl-10 py-6 w-full"
              />
            </div>
            <Button size="lg" className="px-8 py-6 text-base">
              Find Brokers
            </Button>
          </motion.div>
          
          <motion.div 
            className="mt-10 flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="flex items-center">
              <svg className="h-5 w-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              100+ Brokers Reviewed
            </span>
            <span className="flex items-center">
              <svg className="h-5 w-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Expert Analysis
            </span>
            <span className="flex items-center">
              <svg className="h-5 w-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Updated Monthly
            </span>
            <span className="flex items-center">
              <svg className="h-5 w-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Unbiased Ratings
            </span>
          </motion.div>
        </div>
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-5 top-1/4 w-72 h-72 bg-blue-400/10 dark:bg-blue-600/10 rounded-full filter blur-3xl"></div>
        <div className="absolute -left-10 top-3/4 w-72 h-72 bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full filter blur-3xl"></div>
        <div className="absolute left-1/4 top-1/3 w-60 h-60 bg-cyan-400/10 dark:bg-cyan-600/10 rounded-full filter blur-3xl"></div>
      </div>
    </div>
  );
}