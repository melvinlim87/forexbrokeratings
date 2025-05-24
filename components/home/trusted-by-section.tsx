"use client";

import { motion } from 'framer-motion';
import { Layers, TrendingUp, Shield, Zap, Users, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const trustFeatures = [
  {
    icon: <Shield className="h-8 w-8 text-blue-600 dark:text-blue-500" />,
    title: 'Strict Regulatory Standards',
    description: 'We only recommend brokers that comply with top-tier financial regulations from authorities like FCA, ASIC, CySEC, and more.'
  },
  {
    icon: <Layers className="h-8 w-8 text-blue-600 dark:text-blue-500" />,
    title: 'Comprehensive Analysis',
    description: 'Each broker undergoes a thorough 100-point evaluation covering everything from trading costs to platform functionality.'
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-500" />,
    title: 'Real Trading Experience',
    description: 'Our experts open real accounts with each broker to test the complete trading experience from start to finish.'
  },
  {
    icon: <Zap className="h-8 w-8 text-blue-600 dark:text-blue-500" />,
    title: 'Monthly Updates',
    description: 'All broker data is verified and updated monthly to ensure you always have the most current information.'
  },
  {
    icon: <Users className="h-8 w-8 text-blue-600 dark:text-blue-500" />,
    title: 'Trader Community Input',
    description: 'We incorporate feedback from our community of 100,000+ traders to enhance our broker evaluations.'
  },
  {
    icon: <Globe className="h-8 w-8 text-blue-600 dark:text-blue-500" />,
    title: 'Global Perspective',
    description: 'Our international team tests broker services from multiple regions to verify global availability and service.'
  }
];

export default function TrustedBySection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.h2 
            className="text-3xl font-bold text-gray-900 dark:text-white"
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trustFeatures.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "relative p-6 rounded-lg",
                "bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40",
                "backdrop-blur-sm",
                "border-0",
                "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]",
                "before:absolute before:inset-0 before:p-[1px] before:rounded-lg before:-z-10",
                "before:bg-gradient-to-br before:from-gray-700 before:via-gray-900 before:to-gray-800",
                "dark:before:from-gray-600 before:via-gray-800 before:to-gray-900",
                "after:absolute after:inset-0 after:p-[1px] after:rounded-lg after:-z-20",
                "after:bg-gradient-to-br after:from-black/20 after:via-black/10 after:to-transparent",
                "dark:after:from-black/30 dark:after:via-black/20 dark:after:to-transparent",
                "shadow-metallic hover:shadow-metallic-hover transition-all duration-300"
              )}
            >
              <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-full w-fit mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
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