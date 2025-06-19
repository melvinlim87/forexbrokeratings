'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Users, 
  RefreshCw, 
  Award, 
  TrendingUp, 
  Clock,
  CheckCircle,
  BarChart3,
  Globe,
  Lock,
  Zap,
  Target
} from 'lucide-react';

const primaryBenefits = [
  {
    icon: Shield,
    title: 'Unbiased & Transparent',
    description: 'Independent analysis with no broker partnerships. Our ratings are based purely on performance data, regulatory compliance, and verified user feedback.',
    gradient: 'from-cyan-500 to-blue-500',
    stats: '100% Independent',
    features: ['No affiliate bias', 'Transparent methodology', 'Public rating criteria']
  },
  {
    icon: BarChart3,
    title: 'Real-Time Market Data',
    description: 'Live spreads, execution speeds, and slippage data updated every 15 minutes from institutional-grade APIs and direct broker feeds.',
    gradient: 'from-purple-500 to-pink-500',
    stats: '24/7 Monitoring',
    features: ['Live spread tracking', 'Execution analysis', 'Performance metrics']
  },
  {
    icon: Users,
    title: 'Verified Community',
    description: 'Authentic reviews from verified traders with account verification. Every review undergoes multi-layer validation to ensure authenticity.',
    gradient: 'from-green-500 to-teal-500',
    stats: '50K+ Reviews',
    features: ['Account verification', 'Anti-spam protection', 'Moderated feedback']
  }
];

const secondaryBenefits = [
  {
    icon: Award,
    title: 'Industry Recognition',
    description: 'Trusted by financial institutions and featured in major publications.',
    stats: '5+ Awards',
    highlight: 'Best Comparison Platform 2024'
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description: 'Comprehensive database covering brokers from 50+ countries.',
    stats: '200+ Brokers',
    highlight: 'Worldwide Analysis'
  },
  {
    icon: Lock,
    title: 'Data Security',
    description: 'Bank-grade encryption and privacy protection for all user data.',
    stats: 'ISO 27001',
    highlight: 'Certified Security'
  },
  {
    icon: Zap,
    title: 'Instant Alerts',
    description: 'Real-time notifications for spread changes and broker updates.',
    stats: 'Live Updates',
    highlight: 'Never Miss Changes'
  },
  {
    icon: Target,
    title: 'Personalized Matching',
    description: 'AI-powered broker recommendations based on your trading style.',
    stats: 'Smart AI',
    highlight: 'Perfect Matches'
  },
  {
    icon: TrendingUp,
    title: 'Market Insights',
    description: 'Professional analysis and market trends from trading experts.',
    stats: 'Expert Analysis',
    highlight: 'Professional Insights'
  }
];

const trustIndicators = [
  { label: 'Years of Experience', value: '8+' },
  { label: 'Brokers Analyzed', value: '200+' },
  { label: 'Countries Covered', value: '50+' },
  { label: 'Monthly Users', value: '2M+' },
  { label: 'Data Points Tracked', value: '10K+' },
  { label: 'Reviews Verified', value: '50K+' }
];

export default function BenefitGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="benefits" className="py-24 bg-gradient-to-b from-black/20 to-black/40">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center mb-6">
            <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-cyan-500/30 px-4 py-2 text-sm font-semibold">
              <Award className="w-4 h-4 mr-2" />
              Industry Leading Platform
            </Badge>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Why Choose <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Forex Broker Ratings</span>
          </h2>
          <p className="text-xl text-cyan-100 max-w-3xl mx-auto leading-relaxed">
            The most comprehensive and trusted forex broker comparison platform, 
            providing unbiased analysis and real-time data to help you make informed trading decisions.
          </p>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-20"
        >
          {trustIndicators.map((indicator, index) => (
            <div key={indicator.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {indicator.value}
              </div>
              <div className="text-sm text-cyan-200 font-medium">
                {indicator.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Primary Benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {primaryBenefits.map((benefit, index) => {
            const Icon = benefit.icon;
            
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.4 + index * 0.2,
                  ease: "easeOut",
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ y: -12, transition: { duration: 0.3 } }}
                className="group h-full"
              >
                <Card className="h-full bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border-white/20 hover:border-cyan-400/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-cyan-500/20 overflow-hidden">
                  <CardContent className="p-8 h-full flex flex-col">
                    {/* Header with Icon and Stats */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${benefit.gradient} p-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-full h-full text-white" />
                      </div>
                      <Badge className="bg-white/10 text-cyan-300 border-white/20 font-semibold">
                        {benefit.stats}
                      </Badge>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">
                      {benefit.title}
                    </h3>
                    
                    <p className="text-cyan-100 leading-relaxed mb-6 flex-1">
                      {benefit.description}
                    </p>

                    {/* Feature List */}
                    <div className="space-y-2">
                      {benefit.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-cyan-200">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Secondary Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mb-16"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            Additional <span className="text-cyan-400">Platform Benefits</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {secondaryBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 1.2 + index * 0.1,
                    ease: "easeOut"
                  }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  className="group"
                >
                  <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border-white/10 hover:border-cyan-400/30 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/10">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 p-3 mr-4 group-hover:from-cyan-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                          <Icon className="w-full h-full text-cyan-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {benefit.title}
                          </h4>
                          <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs mt-1">
                            {benefit.highlight}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-purple-400">{benefit.stats}</div>
                        </div>
                      </div>
                      <p className="text-cyan-100 text-sm leading-relaxed">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border-cyan-400/30 max-w-4xl mx-auto">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-cyan-400 mr-3" />
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  Start Your Broker Search Today
                </h3>
              </div>
              <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
                Join millions of traders who trust our platform to find the perfect broker for their trading needs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  100% Free to Use
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2">
                  <Shield className="w-4 h-4 mr-2" />
                  No Registration Required
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2">
                  <Zap className="w-4 h-4 mr-2" />
                  Instant Results
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}