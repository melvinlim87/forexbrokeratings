'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  MessageCircle, 
  Eye, 
  ThumbsUp, 
  ThumbsDown, 
  User, 
  Calendar,
  TrendingUp,
  Award,
  Flame
} from 'lucide-react';
import Image from 'next/image';

const topReviews = [
  {
    id: 'most-commented',
    type: 'Most Commented',
    icon: MessageCircle,
    gradient: 'from-orange-500 to-red-500',
    broker: {
      name: 'IC Markets',
      logo: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      rating: 4.8
    },
    review: {
      id: 'rev-001',
      title: 'Outstanding execution speed and transparency',
      content: 'Been trading with IC Markets for over 2 years now and I can confidently say they are the best ECN broker I\'ve used. The execution speed is lightning fast, spreads are genuinely tight (often 0.0 on EUR/USD), and their customer support is top-notch. The Raw Spread account is perfect for scalping strategies.',
      rating: 5,
      author: {
        name: 'Michael Chen',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        verified: true,
        tradingExperience: '5+ years',
        accountType: 'Raw Spread'
      },
      metrics: {
        comments: 247,
        views: 12400,
        thumbsUp: 189,
        thumbsDown: 12
      },
      date: '2024-01-15',
      tags: ['ECN Trading', 'Scalping', 'Low Spreads', 'Fast Execution']
    }
  },
  {
    id: 'most-viewed',
    type: 'Most Viewed',
    icon: Eye,
    gradient: 'from-blue-500 to-purple-500',
    broker: {
      name: 'Pepperstone',
      logo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      rating: 4.6
    },
    review: {
      id: 'rev-002',
      title: 'Perfect for beginners and professionals alike',
      content: 'Pepperstone has been my go-to broker for the past 3 years. What sets them apart is their educational resources and the fact that they don\'t have a minimum deposit requirement. The platform integration with TradingView is seamless, and their Smart Trader Tools have significantly improved my trading performance.',
      rating: 5,
      author: {
        name: 'Sarah Johnson',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        verified: true,
        tradingExperience: '3+ years',
        accountType: 'Razor'
      },
      metrics: {
        comments: 156,
        views: 28900,
        thumbsUp: 234,
        thumbsDown: 18
      },
      date: '2024-01-08',
      tags: ['No Minimum Deposit', 'TradingView', 'Education', 'Multi-Regulated']
    }
  },
  {
    id: 'most-helpful',
    type: 'Most Helpful',
    icon: ThumbsUp,
    gradient: 'from-green-500 to-teal-500',
    broker: {
      name: 'FP Markets',
      logo: 'https://images.pexels.com/photos/7413915/pexels-photo-7413915.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      rating: 4.7
    },
    review: {
      id: 'rev-003',
      title: 'Exceptional customer service and reliable platform',
      content: 'After trying multiple brokers, FP Markets stands out for their exceptional customer service and platform reliability. Their IRESS platform is incredibly stable, and I\'ve never experienced any slippage issues during major news events. The copy trading feature has also been a game-changer for diversifying my strategies.',
      rating: 5,
      author: {
        name: 'David Rodriguez',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        verified: true,
        tradingExperience: '7+ years',
        accountType: 'ECN'
      },
      metrics: {
        comments: 89,
        views: 15600,
        thumbsUp: 312,
        thumbsDown: 8
      },
      date: '2024-01-22',
      tags: ['Customer Service', 'Platform Stability', 'Copy Trading', 'IRESS']
    }
  }
];

export default function ReviewsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <section className="py-20 bg-gradient-to-b from-black/20 to-black/40">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <Award className="w-8 h-8 text-yellow-400 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Genuine Forex Broker <span className="text-yellow-400">Reviews</span>
            </h2>
          </div>
          <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
            Real experiences from verified traders - unfiltered and authentic feedback
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {topReviews.map((item, index) => {
            const TypeIcon = item.icon;
            const helpfulnessRatio = ((item.review.metrics.thumbsUp / (item.review.metrics.thumbsUp + item.review.metrics.thumbsDown)) * 100).toFixed(0);
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.2,
                  ease: "easeOut",
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group h-full"
              >
                <Card className="h-full bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border-white/20 hover:border-yellow-400/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-yellow-500/10 overflow-hidden">
                  <CardContent className="p-0 h-full flex flex-col">
                    {/* Review Type Header */}
                    <div className={`bg-gradient-to-r ${item.gradient} p-4 relative overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center">
                          <TypeIcon className="w-6 h-6 text-white mr-2" />
                          <span className="text-white font-bold text-lg">{item.type}</span>
                        </div>
                        <Flame className="w-5 h-5 text-white/80" />
                      </div>
                    </div>

                    {/* Broker Info */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center mb-4">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 ring-2 ring-white/20">
                          <Image
                            src={item.broker.logo}
                            alt={`${item.broker.name} logo`}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-white">{item.broker.name}</h4>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < Math.floor(item.broker.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
                              />
                            ))}
                            <span className="ml-2 text-sm text-cyan-200">{item.broker.rating}</span>
                          </div>
                        </div>
                      </div>

                      {/* Review Content */}
                      <div className="flex-1 mb-6">
                        <h5 className="text-white font-semibold mb-3 line-clamp-2">
                          {item.review.title}
                        </h5>
                        <p className="text-cyan-100 text-sm leading-relaxed line-clamp-4 mb-4">
                          {item.review.content}
                        </p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {item.review.tags.slice(0, 2).map((tag, tagIndex) => (
                            <Badge 
                              key={tagIndex}
                              variant="secondary" 
                              className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {item.review.tags.length > 2 && (
                            <Badge 
                              variant="secondary" 
                              className="bg-gray-500/20 text-gray-300 border-gray-500/30 text-xs"
                            >
                              +{item.review.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Author Info */}
                      <div className="flex items-center mb-4 p-3 bg-black/20 rounded-lg">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
                          <Image
                            src={item.review.author.avatar}
                            alt={item.review.author.name}
                            fill
                            className="object-cover"
                            sizes="32px"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="text-white text-sm font-medium">{item.review.author.name}</span>
                            {item.review.author.verified && (
                              <Badge className="ml-2 bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-cyan-200">
                            {item.review.author.tradingExperience} • {item.review.author.accountType}
                          </div>
                        </div>
                      </div>

                      {/* Engagement Metrics */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center p-2 bg-black/20 rounded-lg">
                          <div className="flex items-center justify-center mb-1">
                            <MessageCircle className="w-4 h-4 text-orange-400 mr-1" />
                            <span className="text-white font-bold text-sm">
                              {formatNumber(item.review.metrics.comments)}
                            </span>
                          </div>
                          <div className="text-xs text-white/60">Comments</div>
                        </div>
                        <div className="text-center p-2 bg-black/20 rounded-lg">
                          <div className="flex items-center justify-center mb-1">
                            <Eye className="w-4 h-4 text-blue-400 mr-1" />
                            <span className="text-white font-bold text-sm">
                              {formatNumber(item.review.metrics.views)}
                            </span>
                          </div>
                          <div className="text-xs text-white/60">Views</div>
                        </div>
                        <div className="text-center p-2 bg-black/20 rounded-lg">
                          <div className="flex items-center justify-center mb-1">
                            <ThumbsUp className="w-4 h-4 text-green-400 mr-1" />
                            <span className="text-white font-bold text-sm">{helpfulnessRatio}%</span>
                          </div>
                          <div className="text-xs text-white/60">Helpful</div>
                        </div>
                      </div>

                      {/* Review Rating & Date */}
                      <div className="flex items-center justify-between text-sm text-white/60 pt-3 border-t border-white/10">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < item.review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
                            />
                          ))}
                          <span className="ml-2">{item.review.rating}/5</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{formatDate(item.review.date)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* View All Reviews CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Button 
            size="lg"
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            View All Reviews
          </Button>
          <p className="text-white/60 text-sm mt-4 max-w-2xl mx-auto">
            Join thousands of traders sharing their genuine experiences. All reviews are verified and moderated for authenticity.
          </p>
        </motion.div>
      </div>
    </section>
  );
}