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
  connections: { to: number; type: 'horizontal' | 'vertical' }[];
}

const features: Feature[] = [
  {
    icon: <Star className="h-6 w-6" />,
    title: "200+ Brokers",
    description: "Comprehensive analysis of top forex brokers",
    gradient: "from-purple-500 via-blue-500 to-cyan-500",
    x: 170,
    y: 50,
    connections: [
      { to: 1, type: 'horizontal' },
      { to: 2, type: 'vertical' }
    ]
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Trusted Ratings",
    description: "Trusted By More Than 100,000 Traders Worldwide",
    gradient: "from-blue-500 via-cyan-500 to-purple-500",
    x: 710,
    y: 50,
    connections: [
      { to: 3, type: 'vertical' }
    ]
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Brokers Mediation Centre",
    description: "A place for brokers and traders to mediate complaints",
    gradient: "from-cyan-500 via-purple-500 to-blue-500",
    x: 170,
    y: 250,
    connections: [
      { to: 3, type: 'horizontal' }
    ]
  },
  {
    icon: <Brain className="h-6 w-6" />,
    title: "AI Trading Analyser",
    description: "AI-powered analysis of trading charts",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    x: 710,
    y: 250,
    connections: []
  }
];

export default function NetworkDiagram() {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  return (
    <div className="relative w-full justify-center align-center items-center mx-auto">
      {/* Desktop View (md and up): original design */}
      <div className="hidden md:block w-full h-[350px] overflow-visible">
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
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
              <stop offset="50%" stopColor="rgba(96, 165, 250, 0.3)" />
              <stop offset="100%" stopColor="rgba(147, 197, 253, 0.3)" />
            </linearGradient>
            
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {features.map((feature, index) => {
            return feature.connections.map((connection, connIndex) => {
              const targetFeature = features[connection.to];
              const isHorizontal = connection.type === 'horizontal';
              
              const x1 = feature.x;
              const y1 = feature.y;
              const x2 = targetFeature.x;
              const y2 = targetFeature.y;
              
              const path = isHorizontal
                ? `M ${x1} ${y1} L ${x2} ${y1}`
                : `M ${x1} ${y1} L ${x1} ${y2}`;
              
              return (
                <g key={`${index}-${connIndex}`}>
                  <motion.path
                    d={path}
                    stroke="url(#lineGradient)"
                    strokeWidth="1"
                    filter="url(#glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ 
                      pathLength: 1, 
                      opacity: hoveredNode === index || hoveredNode === connection.to ? 0.9 : 0.5
                    }}
                    transition={{ duration: 1.5, delay: index * 0.2 }}
                  />
                  
                  {/* Flowing nodes on the line */}
                  {[...Array(3)].map((_, i) => (
                    <motion.circle
                      key={i}
                      r="4"
                      fill="#3B82F6"
                      filter="url(#glow)"
                      initial={{ 
                        opacity: 0,
                        pathOffset: i * 0.3 
                      }}
                      animate={{
                        opacity: [0, 0.8, 0],
                        pathOffset: [0, 1],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 1,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <animateMotion
                        dur="2s"
                        repeatCount="indefinite"
                        path={path}
                      />
                    </motion.circle>
                  ))}
                </g>
              );
            });
          })}
        </svg>

        {/* Feature nodes */}
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="absolute z-10"
            style={{ left: feature.x, top: feature.y }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            onHoverStart={() => setHoveredNode(index)}
            onHoverEnd={() => setHoveredNode(null)}
          >
            <div 
              className="relative -translate-x-1/2 -translate-y-1/2 p-[2px] rounded-xl bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 to-green-500 hover:z-20 shadow-lg"
            >
              <div className="relative bg-metallic dark:bg-gradient-to-br dark:from-gray-900/80 dark:to-gray-900/40 backdrop-blur-sm rounded-xl p-4 w-[450px] shadow-metallic">
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 p-0.5">
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
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                  </div>
                  
                  <p className="text-base font-semibold text-gray-700 dark:text-gray-300 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Mobile/Tablet View (below md): stacked cards, no SVG lines */}
      <div className="flex flex-col gap-6 md:hidden w-full py-4">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="relative mx-auto w-full max-w-[95vw] p-[2px] rounded-xl bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 10, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="relative bg-metallic dark:bg-gradient-to-br dark:from-gray-900/80 dark:to-gray-900/40 backdrop-blur-sm rounded-xl p-4 shadow-metallic">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
              </div>
              <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}