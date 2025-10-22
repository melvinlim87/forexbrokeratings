'use client';

  import React, { useState, useRef, useEffect } from 'react';
  import { motion } from 'framer-motion';
  import { Star, Shield, Users, Brain } from 'lucide-react';
  import { useI18n } from '@/lib/i18n-client';

interface Feature {
  icon: JSX.Element;
  title: string;
  description: string;
  gradient: string;
  x: number;
  y: number;
  connections: { to: number; type: 'horizontal' | 'vertical' }[];
}

export default function NetworkDiagram() {
  const { t } = useI18n();
  const features: Feature[] = [
    {
      icon: <Star className="h-6 w-6" />,
      title: t('network.diagram.brokers.title'),
      description: t('network.diagram.brokers.desc'),
      gradient: "from-purple-500 via-blue-500 to-cyan-500",
      x: 270,
      y: 50,
      connections: [
        { to: 1, type: 'horizontal' },
        { to: 2, type: 'vertical' }
      ]
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: t('network.diagram.trusted.title'),
      description: t('network.diagram.trusted.desc'),
      gradient: "from-blue-500 via-cyan-500 to-purple-500",
      x: 770,
      y: 50,
      connections: [
        { to: 3, type: 'vertical' }
      ]
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: t('network.diagram.mediation.title'),
      description: t('network.diagram.mediation.desc'),
      gradient: "from-cyan-500 via-purple-500 to-blue-500",
      x: 270,
      y: 250,
      connections: [
        { to: 3, type: 'horizontal' }
      ]
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: t('network.diagram.ai.title'),
      description: t('network.diagram.ai.desc'),
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      x: 770,
      y: 250,
      connections: []
    }
  ];
  
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 1000, height: 350 });
  const [nodePositions, setNodePositions] = useState<{x: number, y: number}[]>([]);

  // Update container dimensions and recalculate node positions on mount and resize
  useEffect(() => {
    function updateDimensions() {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = containerRef.current.offsetHeight;
        setContainerSize({ width, height });
        
        // Calculate grid-based positions for each feature
        const gridCols = 2;
        const gridRows = 2;
        const cellWidth = width / gridCols;
        const cellHeight = height / gridRows;
        
        const positions = features.map((_, idx) => {
          const row = Math.floor(idx / gridCols);
          const col = idx % gridCols;
          return {
            x: col * cellWidth + cellWidth / 2,
            y: row * cellHeight + cellHeight / 2
          };
        });
        
        setNodePositions(positions);
      }
    }
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div className="relative w-full">
      {/* Desktop View (md and up): grid-cols-2 layout with connection lines */}
      <div className="hidden md:block w-full h-[350px] relative" ref={containerRef}>
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

          {/* Only render connection lines when positions are calculated */}
          {nodePositions.length > 0 && features.map((feature, index) => {
            return feature.connections.map((connection, connIndex) => {
              if (!nodePositions[index] || !nodePositions[connection.to]) return null;
              
              const isHorizontal = connection.type === 'horizontal';
              const NODE_WIDTH = containerSize.width / 2 * 0.7; // 70% of half container width
              const NODE_HEIGHT = 120; // estimated node height
              
              // Get positions from the calculated nodePositions
              const sourcePos = nodePositions[index];
              const targetPos = nodePositions[connection.to];
              
              // Calculate connection line start and end points
              let x1 = sourcePos.x;
              let y1 = sourcePos.y;
              let x2 = targetPos.x;
              let y2 = targetPos.y;
              
              // Adjust positions to connect from edges instead of centers
              if (isHorizontal) {
                // For horizontal lines, connect from right edge of source to left edge of target
                if (x1 < x2) { // if source is to the left of target
                  x1 += NODE_WIDTH / 2;
                  x2 -= NODE_WIDTH / 2;
                } else { // if source is to the right of target
                  x1 -= NODE_WIDTH / 2;
                  x2 += NODE_WIDTH / 2;
                }
              } else {
                // For vertical lines, connect from bottom edge of source to top edge of target
                if (y1 < y2) { // if source is above target
                  y1 += NODE_HEIGHT / 2;
                  y2 -= NODE_HEIGHT / 2;
                } else { // if source is below target
                  y1 -= NODE_HEIGHT / 2;
                  y2 += NODE_HEIGHT / 2;
                }
              }
              
              const path = isHorizontal
                ? `M ${x1} ${y1} L ${x2} ${y1 + 10}`
                : `M ${x1} ${y1} L ${x1} ${y2 + 20}`;
              
              return (
                <g key={`${index}-${connIndex}`}>
                  <motion.path
                    d={path}
                    strokeWidth="1"
                    filter="url(#glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ 
                      pathLength: 1, 
                      opacity: hoveredNode === index || hoveredNode === connection.to ? 0.9 : 0.5
                    }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
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
                        opacity: [0, 0.8, 0.8, 0],
                        pathOffset: [0, 1, 1, 1],
                      }}
                      transition={{
                        duration: 3, // Increased duration to account for pause
                        delay: i * 1.5,
                        repeat: Infinity,
                        times: [0, 0.3, 0.9, 1], // Keyframe times for the animation
                        ease: ["easeOut", "linear", "easeIn"],
                      }}
                    >
                      <animateMotion
                        dur={(3 + (index * 0.3)) + "s"} // Increased duration to match parent
                        repeatCount="indefinite"
                        path={path}
                        keyPoints="0;1;1"
                        keyTimes="0;0.3;1"
                        calcMode="linear"
                      >
                        <animate
                          attributeName="keyPoints"
                          values="0;1;1;0"
                          keyTimes="0;0.3;0.9;1"
                          dur={(3 + (index * 0.3)) + "s"}
                          repeatCount="indefinite"
                        />
                      </animateMotion>
                    </motion.circle>
                  ))}
                </g>
              );
            });
          })}
        </svg>

        {/* Feature nodes grid */}
        <div className="grid grid-cols-2 w-full h-full">
          {features.map((feature, index) => {
            // Get the calculated position from nodePositions if available
            const position = nodePositions[index] || { x: 0, y: 0 };
            
            return (
              <div 
                key={index}
                className="flex justify-center items-center"
                style={{ gridColumn: (index % 2) + 1, gridRow: Math.floor(index / 2) + 1 }}
              >
                <motion.div
                  className="w-[90%] max-w-[500px]"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  onHoverStart={() => setHoveredNode(index)}
                  onHoverEnd={() => setHoveredNode(null)}
                >
                  <div 
                    className="relative p-[2px] rounded-xl bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 to-green-500 hover:z-20 shadow-lg"
                  >
                    <div className="relative bg-metallic backdrop-blur-sm rounded-xl p-4 shadow-metallic w-full min-h-[120px]">
                      <div className="relative z-10 py-1">
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
                              <div className="absolute inset-[1px] bg-metallic rounded-[5px] flex items-center justify-center text-gray-900">
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
                          <h3 className="text-lg font-bold text-gray-900">
                            {feature.title}
                          </h3>
                        </div>
                        
                        <p className="text-base font-semibold text-gray-700 text-center leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
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
            <div className="relative bg-metallic backdrop-blur-sm rounded-xl p-4 shadow-metallic">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  {feature.title}
                </h3>
              </div>
              <p className="text-base font-medium text-gray-700">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}