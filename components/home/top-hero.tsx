'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Globe, BarChart2, TrendingUp, Award, Shield, Users, Star } from 'lucide-react';
import NetworkDiagram from '../network/NetworkDiagram';

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
        className="container mx-auto px-4 pt-16 pb-16 relative z-10"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center space-x-4 mb-8">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: [0, 1, 0.9],
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  delay: i * 0.15,
                  duration: 0.8
                }}
                className="relative group"
              >
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 blur-md bg-amber-400/30 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.2, 0.6, 0.2]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: i * 0.4
                    }}
                  />
                  <Star
                    className="w-8 h-8 text-amber-400 transition-colors duration-300"
                    fill="currentColor"
                    strokeWidth={1}
                  />
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={false}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: i * 0.2
                    }}
                  >
                    <Star
                      className="w-8 h-8 text-amber-500"
                      fill="none"
                      strokeWidth={1.5}
                    />
                  </motion.div>
                  
                  {/* Glowing trail effect */}
                  <motion.div
                    className="absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-amber-400/50 to-transparent"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{
                      scaleX: [0, 1, 0],
                      opacity: [0, 0.8, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.3
                    }}
                    style={{
                      display: i < 4 ? 'block' : 'none',
                      transformOrigin: 'left'
                    }}
                  />
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
        </div>
      </motion.div>
    </div>
  );
}