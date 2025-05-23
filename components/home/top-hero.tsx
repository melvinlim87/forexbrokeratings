"use client";

import { motion } from 'framer-motion';
import { Globe, BarChart2, TrendingUp } from 'lucide-react';

export default function TopHero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600">
      {/* Circuit board pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-1/4 top-1/4 w-96 h-96 bg-blue-400/30 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute -left-1/4 top-3/4 w-96 h-96 bg-indigo-400/30 rounded-full filter blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center mb-6"
          >
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl">
              <Globe className="h-8 w-8 text-white" />
            </div>
          </motion.div>

          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Forex Broker Ratings
          </motion.h1>

          <motion.p 
            className="text-xl md:text-2xl text-blue-100 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            The Aggregated Forex Broker Ratings Across All Rating Platforms
          </motion.p>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              {
                icon: <BarChart2 className="h-6 w-6 text-blue-500" />,
                title: "100+ Brokers",
                description: "Comprehensive analysis of top forex brokers"
              },
              {
                icon: <TrendingUp className="h-6 w-6 text-blue-500" />,
                title: "Real-time Data",
                description: "Up-to-date ratings and market insights"
              },
              {
                icon: <Globe className="h-6 w-6 text-blue-500" />,
                title: "Global Coverage",
                description: "Reviews from multiple rating platforms"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="bg-white/10 rounded-lg p-2 w-fit mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-blue-100 text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}