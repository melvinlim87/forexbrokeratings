"use client";

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Globe, BarChart2, TrendingUp, Star, Shield, Users } from 'lucide-react';

export default function TopHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  const springOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });

  return (
    <div className="relative overflow-hidden bg-metallic min-h-[600px]">
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
        className="container mx-auto px-4 pt-40 pb-20 relative z-10"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center mb-16"
          >
            <div className="bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-lg p-5 rounded-3xl shadow-metallic border border-white/30">
              <Globe className="h-10 w-10 text-gray-800" />
            </div>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Forex Broker Ratings
          </motion.h1>

          <motion.div
            className="flex items-center justify-center mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-lg p-4 rounded-2xl shadow-metallic border border-white/30 flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, 0],
                    filter: ['brightness(0.5)', 'brightness(2)', 'brightness(0.5)']
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.3,
                    repeat: Infinity,
                    repeatDelay: 1.5
                  }}
                  className="relative"
                >
                  <Star 
                    className="w-8 h-8 text-amber-500 fill-amber-500"
                    style={{
                      filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.5))'
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.p 
            className="text-xl md:text-2xl text-gray-600 mb-16 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            The Aggregated Forex Broker Ratings Across All Rating Platforms
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: <Star className="h-6 w-6" />,
                title: "200+ Brokers", 
                description: "Comprehensive analysis of top forex brokers", 
                animations: {
                  icon: {
                    rotate: [-10, 10, -10],
                    scale: [1, 1.2, 1],
                    filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)']
                  }
                },
                color: "from-gray-700 to-gray-900"
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: "Trusted Ratings",
                description: "Trusted By More Than 100,000 Traders Worldwide",
                animations: {
                  icon: {
                    y: [-2, 2, -2],
                    scale: [1, 1.1, 1],
                    filter: ['drop-shadow(0 0 0 rgba(59, 130, 246, 0))', 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))', 'drop-shadow(0 0 0 rgba(59, 130, 246, 0))']
                  }
                },
                color: "from-gray-700 to-gray-900"
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: "Brokers Mediation Centre",
                description: "A place for brokers and traders to mediate complaints",
                animations: {
                  icon: {
                    x: [-3, 3, -3],
                    scale: [1, 1.15, 1],
                    filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)']
                  }
                },
                color: "from-gray-700 to-gray-900"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                className="relative group overflow-hidden"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-300/20 to-purple-500/20 rounded-xl transform rotate-45">
                    <div className="absolute inset-[2px] bg-white dark:bg-gray-900 rounded-xl" />
                  </div>
                </motion.div>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40 rounded-2xl backdrop-blur-xl border border-white/30 shadow-metallic"
                  animate={{
                    scale: [1, 1.02, 1],
                    boxShadow: [
                      "0 4px 8px -1px rgba(0, 0, 0, 0.1)",
                      "0 8px 16px -2px rgba(0, 0, 0, 0.15)",
                      "0 4px 8px -1px rgba(0, 0, 0, 0.1)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{
                    x: ['-200%', '200%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <div className="relative p-6">
                  <motion.div 
                    className={`bg-gradient-to-br ${item.color} p-3 rounded-xl w-fit mb-4 shadow-lg relative overflow-hidden`}
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatDelay: 0.5
                      }}
                    />
                    <motion.div 
                      className="text-white relative z-10"
                      animate={item.animations.icon}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {item.icon}
                    </motion.div>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}