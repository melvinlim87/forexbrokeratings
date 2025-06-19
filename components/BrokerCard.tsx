'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Check, X, Shield, CreditCard, Clock, BarChart2, ChevronRight, ExternalLink } from 'lucide-react';
import { Broker } from '@/lib/brokers';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BrokerCardProps {
  broker: Broker;
  index: number;
}

// Helper function to render regulation badges
const renderRegulationBadges = (regulators?: string[]) => {
  if (!regulators || regulators.length === 0) return null;
  
  return (
    <div className="flex items-center gap-1">
      <Shield className="w-3 h-3 text-green-400" />
      <span className="text-xs text-green-300">
        {regulators.length} {regulators.length === 1 ? 'Regulator' : 'Regulators'}
      </span>
    </div>
  );
};

export default function BrokerCard({ broker, index }: BrokerCardProps) {
  // Calculate a score based on available broker data
  const score = Number(broker.rating || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="h-full group relative"
      aria-labelledby={`broker-${broker.id}-title`}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      
      <Card className="h-full bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border-white/20 hover:border-cyan-400/50 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-cyan-500/10 overflow-hidden relative">
        <div className="p-6 h-full flex flex-col">
          {/* Header with Logo and Score */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <div className="relative w-14 h-14 rounded-lg overflow-hidden mr-3 ring-2 ring-white/20 group-hover:ring-cyan-400/50 transition-all duration-300 bg-white/5">
                {broker.logo ? (
                  <Image
                    src={broker.logo}
                    alt=""
                    fill
                    className="object-contain p-1"
                    sizes="56px"
                    priority={index < 4} // Only load first 4 images eagerly
                    loading={index < 4 ? 'eager' : 'lazy'}
                    aria-hidden="true"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-white/70">{broker.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div>
                <h3 
                  id={`broker-${broker.id}-title`}
                  className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors"
                >
                  {broker.name}
                  <span className="sr-only">broker details</span>
                </h3>
                <div className="flex items-center text-sm text-cyan-200">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-medium">{broker.rating || 'N/A'}</span>
                  <span className="ml-1 text-white/60">/10</span>
                </div>
              </div>
            </div>
            
            {/* Score Badge */}
            <div 
              className={cn(
                "px-3 py-1 rounded-full text-center transition-all duration-300",
                score >= 80 ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20" :
                score >= 60 ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20" :
                "bg-gradient-to-r from-amber-500/20 to-orange-500/20"
              )}
              aria-label={`Broker score: ${score} out of 100`}
            >
              <span className="text-white font-bold">{score}</span>
              <span className="text-xs text-cyan-200 ml-1">/100</span>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-black/20 rounded-lg p-3">
              <div className="flex items-center gap-1 text-cyan-400 text-sm font-medium mb-1">
                <CreditCard className="w-3 h-3" />
                Min Deposit
              </div>
              <div className="text-white font-bold">
                {broker.min_deposit ? `$${broker.min_deposit}` : 'N/A'}
              </div>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <div className="flex items-center gap-1 text-purple-400 text-sm font-medium mb-1">
                <BarChart2 className="w-3 h-3" />
                Max Leverage
              </div>
              <div className="text-white font-bold">
                {broker.maxLeverage || 'N/A'}
              </div>
            </div>
          </div>

          {/* Regulation & Spread */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-black/20 rounded-lg p-3">
              <div className="text-cyan-200 text-sm font-medium mb-1">Regulation</div>
              {broker.regulators && broker.regulators.length > 0 ? (
                renderRegulationBadges(broker.regulators)
              ) : (
                <div className="flex items-center gap-1 text-red-300 text-xs">
                  <X className="w-3 h-3" />
                  <span>Not regulated</span>
                </div>
              )}
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <div className="text-cyan-200 text-sm font-medium mb-1">EUR/USD Spread</div>
              <div className="text-white font-bold">
                {broker.minSpread ? `${broker.minSpread} pips` : 'N/A'}
              </div>
            </div>
          </div>

          {/* Platforms */}
          {broker.platforms && broker.platforms.length > 0 && (
            <div className="mb-4">
              <div className="text-xs text-cyan-200 mb-1">Platforms</div>
              <div className="flex flex-wrap gap-1">
                {broker.platforms.slice(0, 3).map((platform: string, idx: number) => (
                  <Badge 
                    key={idx}
                    variant="secondary"
                    className="bg-white/5 text-cyan-100 border-white/10 text-xs px-2 py-0.5"
                  >
                    {platform}
                  </Badge>
                ))}
                {broker.platforms.length > 3 && (
                  <span key="more" className="text-xs text-white/50 ml-1">+{broker.platforms.length - 3} more</span>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-white/10">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {broker.regulators && broker.regulators.length > 0 ? (
                  <div className="flex items-center text-green-400 text-xs">
                    <Check className="w-3 h-3 mr-1" />
                    <span>Regulated</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-400 text-xs">
                    <X className="w-3 h-3 mr-1" />
                    <span>Unregulated</span>
                  </div>
                )}
                {broker.headquarters ? (
                  <span className="text-xs text-white/70">Based in {broker.headquarters}</span>
                ) : (
                  <span className="text-xs text-white/70">Global</span>
                )}
              </div>
              
              <Link 
                href={`/brokers/${broker.id}`}
                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center group/link"
                aria-label={`View details for ${broker.name}`}
              >
                <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-cyan-400 after:transition-all after:duration-300 group-hover/link:after:w-full">
                  View Details
                </span>
                <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
        {/* Quick actions */}
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <a
            href={broker.website}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 hover:border-cyan-400/50 transition-colors"
            aria-label={`Visit ${broker.name} website (opens in new tab)`}
          >
            <ExternalLink className="w-4 h-4 text-cyan-300" />
          </a>
        </div>
      </Card>
    </motion.div>
  );
}