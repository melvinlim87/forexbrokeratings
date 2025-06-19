'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp } from 'lucide-react';
import { Broker } from '@/lib/brokers';
import Image from 'next/image';

interface BrokerCardProps {
  broker: Broker;
  index: number;
}

export default function BrokerCard({ broker, index }: BrokerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.04, y: -8 }}
      className="h-full"
    >
      <Card className="h-full bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border-white/20 hover:border-cyan-400/50 transition-all duration-300 cursor-pointer group">
        <div className="p-6 h-full flex flex-col">
          {/* Logo and Name */}
          <div className="flex items-center mb-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3 ring-2 ring-white/20 group-hover:ring-cyan-400/50 transition-all duration-300">
              <Image
                src={broker.logo}
                alt={`${broker.name} logo`}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                {broker.name}
              </h3>
              <div className="flex items-center text-sm text-cyan-200">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-medium">{broker.rating}</span>
                <span className="ml-1 text-white/60">({Math.floor(Math.random() * 1000) + 500} reviews)</span>
              </div>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-black/20 rounded-lg p-3 text-center">
              <div className="text-cyan-400 font-bold text-lg">
                {broker.minSpread === 0 ? 'From 0' : broker.minSpread}
              </div>
              <div className="text-white/70 text-xs">Min Spread</div>
            </div>
            <div className="bg-black/20 rounded-lg p-3 text-center">
              <div className="text-purple-400 font-bold text-lg">{broker.maxLeverage}</div>
              <div className="text-white/70 text-xs">Max Leverage</div>
            </div>
          </div>

          {/* Perks */}
          <div className="flex-1 mb-4">
            <div className="flex flex-wrap gap-2">
              {broker.perks.slice(0, 3).map((perk, perkIndex) => (
                <Badge 
                  key={perkIndex} 
                  variant="secondary" 
                  className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-cyan-500/30 text-xs hover:from-cyan-500/30 hover:to-purple-500/30 transition-all duration-300"
                >
                  {perk}
                </Badge>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-sm text-white/60 pt-3 border-t border-white/10">
            <span>Est. {broker.established}</span>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-1 text-green-400" />
              <span className="text-green-400">Active</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}