'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Server, DollarSign, ExternalLink, Clock, CheckCircle } from 'lucide-react';
import Image from 'next/image';

const promotions = [
  {
    id: 'fp-markets',
    brokerName: 'FP Markets',
    logo: 'https://images.pexels.com/photos/7413915/pexels-photo-7413915.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    promotion: {
      title: 'Free VPS Hosting',
      description: 'Get complimentary Virtual Private Server hosting for ultra-fast trade execution and 24/7 uptime.',
      value: 'Worth $30/month',
      icon: Server,
      gradient: 'from-blue-500 to-cyan-500',
      terms: 'T&C Apply'
    },
    benefits: [
      'Ultra-low latency execution',
      'Multi-regulated broker (ASIC, CySEC)',
      'Raw spreads from 0.0 pips',
      'Award-winning customer support',
      'Advanced trading platforms'
    ],
    rating: 4.7,
    established: 2005,
    minDeposit: 100,
    maxLeverage: '1:500'
  },
  {
    id: 'rs-finance',
    brokerName: 'RS Finance',
    logo: 'https://images.pexels.com/photos/6801642/pexels-photo-6801642.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    promotion: {
      title: '$1,000 Cash Bonus',
      description: 'Receive up to $1,000 cash bonus on your first deposit to boost your trading capital.',
      value: 'Up to $1,000',
      icon: DollarSign,
      gradient: 'from-green-500 to-emerald-500',
      terms: 'T&C Apply'
    },
    benefits: [
      'Competitive spreads from 0.1 pips',
      'Multiple account types available',
      'Professional trading tools',
      'Dedicated account managers',
      'Educational resources included'
    ],
    rating: 4.5,
    established: 2018,
    minDeposit: 250,
    maxLeverage: '1:400'
  }
];

export default function PromotionsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-20 bg-gradient-to-b from-transparent to-black/20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <Gift className="w-8 h-8 text-yellow-400 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Top Broker <span className="text-yellow-400">Promotions</span>
            </h2>
          </div>
          <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
            Exclusive offers from our top-rated brokers to maximize your trading potential
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {promotions.map((promo, index) => {
            const PromotionIcon = promo.promotion.icon;
            
            return (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.3,
                  ease: "easeOut",
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group h-full"
              >
                <Card className="h-full bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border-white/20 hover:border-yellow-400/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-yellow-500/10 overflow-hidden">
                  <CardContent className="p-0 h-full">
                    {/* Promotion Header */}
                    <div className={`bg-gradient-to-r ${promo.promotion.gradient} p-6 relative overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <Badge className="bg-white/20 text-white border-white/30 font-semibold">
                            <Clock className="w-3 h-3 mr-1" />
                            Limited Time
                          </Badge>
                          <span className="text-white/80 text-sm font-medium">{promo.promotion.terms}</span>
                        </div>
                        
                        <div className="flex items-center mb-3">
                          <PromotionIcon className="w-8 h-8 text-white mr-3" />
                          <div>
                            <h3 className="text-2xl font-bold text-white">{promo.promotion.title}</h3>
                            <p className="text-white/90 font-semibold">{promo.promotion.value}</p>
                          </div>
                        </div>
                        
                        <p className="text-white/90 leading-relaxed">
                          {promo.promotion.description}
                        </p>
                      </div>
                    </div>

                    {/* Broker Info */}
                    <div className="p-6">
                      <div className="flex items-center mb-6">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 ring-2 ring-white/20 group-hover:ring-yellow-400/50 transition-all duration-300">
                          <Image
                            src={promo.logo}
                            alt={`${promo.brokerName} logo`}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-white group-hover:text-yellow-300 transition-colors">
                            {promo.brokerName}
                          </h4>
                          <div className="flex items-center text-sm text-cyan-200">
                            <span className="text-yellow-400 mr-1">★</span>
                            <span className="font-medium">{promo.rating}</span>
                            <span className="ml-2 text-white/60">Est. {promo.established}</span>
                          </div>
                        </div>
                      </div>

                      {/* Key Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-black/20 rounded-lg p-3 text-center">
                          <div className="text-cyan-400 font-bold text-lg">{promo.maxLeverage}</div>
                          <div className="text-white/70 text-xs">Max Leverage</div>
                        </div>
                        <div className="bg-black/20 rounded-lg p-3 text-center">
                          <div className="text-green-400 font-bold text-lg">${promo.minDeposit}</div>
                          <div className="text-white/70 text-xs">Min Deposit</div>
                        </div>
                      </div>

                      {/* Benefits */}
                      <div className="mb-6">
                        <h5 className="text-white font-semibold mb-3 flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                          Key Benefits
                        </h5>
                        <ul className="space-y-2">
                          {promo.benefits.slice(0, 3).map((benefit, benefitIndex) => (
                            <li key={benefitIndex} className="flex items-center text-sm text-cyan-100">
                              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA Button */}
                      <Button 
                        className={`w-full bg-gradient-to-r ${promo.promotion.gradient} hover:opacity-90 text-white font-semibold py-3 rounded-lg transition-all duration-300 group-hover:scale-105`}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Claim Offer Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-white/60 text-sm max-w-4xl mx-auto leading-relaxed">
            <strong>Risk Warning:</strong> Trading forex and CFDs involves significant risk and may not be suitable for all investors. 
            You should carefully consider your objectives, financial situation, needs and level of experience before entering into any margined transactions. 
            Terms and conditions apply to all promotional offers. Please read the full terms before participating.
          </p>
        </motion.div>
      </div>
    </section>
  );
}