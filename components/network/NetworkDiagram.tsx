'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Shield, Users, Brain } from 'lucide-react';

interface Feature {
  icon: JSX.Element;
  title: string;
  description: string;
  gradient: string;
  x: number;
  y: number;
  angle: number;
}

const features: Feature[] = [
  {
    icon: <Star className="h-6 w-6" />,
    title: "200+ Brokers",
    description: "Comprehensive analysis of top forex brokers",
    gradient: "from-purple-500 via-blue-500 to-cyan-500",
    x: 150,
    y: 100,
    angle: 0
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Trusted Ratings",
    description: "Trusted By More Than 100,000 Traders Worldwide",
    gradient: "from-blue-500 via-cyan-500 to-purple-500",
    x: 750,
    y: 100,
    angle: 120
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Brokers Mediation Centre",
    description: "A place for brokers and traders to mediate complaints",
    gradient: "from-cyan-500 via-purple-500 to-blue-500",
    x: 150,
    y: 450,
    angle: 240
  },
  {
    icon: <Brain className="h-6 w-6" />,
    title: "AI Trading Analyser",
    description: "AI-powered analysis of trading charts",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    x: 750,
    y: 450,
    angle: 360
  }
];

export default function NetworkDiagram() {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const centerX = 400;
  const centerY = 225;

  return (
    <div className="relative w-full h-[500px] overflow-visible">
      {/* Background gradient animation */}
      <motion.div
        className="absolute inset-0 opacity-20 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.3), transparent 70%)',
            'radial-gradient(circle at 70% 70%, rgba(139, 92, 246, 0.3), transparent 70%)',
            'radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.3), transparent 70%)'
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(147, 51, 234, 0.2)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.2)" />
            <stop offset="100%" stopColor="rgba(34, 211, 238, 0.2)" />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {features.map((feature, index) => {
          const nextFeature = features[(index + 1) % features.length];
          
          return (
            <g key={index}>
              {/* Line to center */}
              <motion.line
                x1={feature.x}
                y1={feature.y}
                x2={centerX}
                y2={centerY}
                stroke="url(#lineGradient)"
                strokeWidth="1"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: hoveredNode === index ? 0.8 : 0.4 
                }}
                transition={{ duration: 1.5, delay: index * 0.2 }}
              />
              
              {/* Curved line to next node */}
              <motion.path
                d={`M ${feature.x} ${feature.y} Q ${centerX} ${centerY} ${nextFeature.x} ${nextFeature.y}`}
                stroke="url(#lineGradient)"
                strokeWidth="1"
                fill="none"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: hoveredNode === index ? 0.8 : 0.4 
                }}
                transition={{ duration: 2, delay: index * 0.3 }}
              />
            </g>
          );
        })}
      </svg>

      {/* Center node */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ left: centerX, top: centerY }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full p-[2px]">
            <div className="w-full h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full" />
          </div>
        </motion.div>
      </motion.div>

      {/* Feature nodes */}
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className="absolute z-10"
          style={{ left: feature.x, top: feature.y }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          onHoverStart={() => setHoveredNode(index)}
          onHoverEnd={() => setHoveredNode(null)}
        >
          <div 
            className="relative -translate-x-1/2 -translate-y-1/2 p-[2px] rounded-xl bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 to-green-500 hover:z-20"
          >
            <div className="relative bg-metallic dark:bg-gradient-to-br dark:from-gray-900/80 dark:to-gray-900/40 backdrop-blur-sm rounded-xl p-4 w-[250px] shadow-metallic">
              <div className="relative z-10">
                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 p-0.5">
                  <div className="relative w-full h-full">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 to-green-500 rounded-[6px]" />
                    </motion.div>
                    <div className="absolute inset-[1px] bg-metallic dark:bg-gray-900 rounded-[5px] flex items-center justify-center text-gray-900 dark:text-white">
                      <motion.div
                        animate={hoveredNode === index ? {
                          rotate: [0, 360],
                          transition: { duration: 20, repeat: Infinity, ease: "linear" }
                        } : {}}
                      >
                        {feature.icon}
                      </motion.div>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-base font-semibold text-gray-700 dark:text-gray-300 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}