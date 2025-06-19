"use client";

import { motion } from 'framer-motion';
import { Layers, TrendingUp, Shield, Zap, Users, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const trustFeatures = [
  {
    icon: <Shield className="h-8 w-8 text-cyan-500 bg-cyan-100 dark:bg-cyan-900/30 p-1 rounded-full" />, // Unbiased & Transparent
    badge: {
      text: '100% Independent',
      className: 'bg-cyan-300 text-black dark:bg-cyan-800 dark:text-black',
    },
    title: 'Unbiased & Transparent',
    description: 'Independent analysis with no broker partnerships. Our ratings are based purely on performance data, regulatory compliance, and verified user feedback.',
    checklist: [
      'No affiliate bias',
      'Transparent methodology',
      'Public rating criteria',
    ],
  },
  {
    icon: <Layers className="h-8 w-8 text-purple-500 bg-purple-100 dark:bg-purple-900/30 p-1 rounded-full" />, // Real-Time Market Data
    badge: {
      text: '24/7 Monitoring',
      className: 'bg-purple-300 text-black dark:bg-purple-800 dark:text-black',
    },
    title: 'Real-Time Market Data',
    description: 'Live spreads, execution speeds, and slippage data updated every 15 minutes from institutional-grade APIs and direct broker feeds.',
    checklist: [
      'Live spread tracking',
      'Execution analysis',
      'Performance metrics',
    ],
  },
  {
    icon: <Users className="h-8 w-8 text-green-600 bg-green-100 dark:bg-green-900/30 p-1 rounded-full" />, // Verified Community
    badge: {
      text: '50k+ Reviews',
      className: 'bg-green-300 text-black dark:bg-green-800 dark:text-black',
    },
    title: 'Verified Community',
    description: 'Authentic reviews from verified traders with account verification. Every review undergoes multi-layer validation to ensure authenticity.',
    checklist: [
      'Account verification',
      'Anti-spam protection',
      'Moderated feedback',
    ],
  },

];

import { useState } from 'react';

export default function TrustedBySection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <motion.h2 
            className="text-3xl font-bold text-gray-900 dark:text-black"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Why Traders Trust Our Ratings
          </motion.h2>
          <motion.p 
            className="mt-4 text-lg text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Our rigorous evaluation process ensures you get honest, accurate broker information.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 max-w-7xl mx-auto">
          {trustFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              className={cn(
                "h-full flex flex-col transition-all duration-300",
                hoveredCard === index
                  ? "shadow-2xl shadow-cyan-200/40 dark:shadow-cyan-900/30 -translate-y-2 z-10"
                  : "shadow-metallic hover:shadow-2xl hover:shadow-cyan-200/40 hover:-translate-y-2 hover:z-10"
              )}
            >
              <Card className="h-full flex flex-col">
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div>{feature.icon}</div>
                    <Badge className={feature.badge?.className ?? ''}>{feature.badge?.text ?? ''}</Badge>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{feature.description}</p>
                  <div className="space-y-2 mt-auto">
                    <h4 className="text-sm font-medium text-gray-700">Highlights:</h4>
                    <ul className="space-y-1">
                      {feature.checklist?.map((item, i) => (
                        <li key={i} className="flex items-start text-sm">
                          <svg className="h-4 w-4 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <motion.div
            className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-500 font-medium"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="text-lg">Trusted by over 100,000 traders worldwide</span>
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-medium">
                  {['JD', 'MK', 'TS', 'RN', 'AL'][i]}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}