"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';
import { supabase, fetchAllBrokerDetails } from '@/lib/supabase';

interface HeroSlide {
  broker: string;
  image: string;
  logo: string;
  title: string;
  description: string;
  rating: number;
  reviews: string;
  features: string[];
  slug: string;
  url: string;
}

const defaultHeroSlides: HeroSlide[] = [
  {
    broker: 'Pepperstone',
    image: 'https://images.pexels.com/photos/7567434/pexels-photo-7567434.jpeg?auto=compress&cs=tinysrgb&w=1920',
    logo: 'https://images.pexels.com/photos/7567434/pexels-photo-7567434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: '#1 Best Overall Forex Broker',
    description: 'Award-winning broker with ultra-low spreads and lightning-fast execution',
    rating: 4.9,
    reviews: '3,547',
    features: ['Raw spreads from 0.0 pips', 'Ultra-fast execution', 'Top-tier regulation'],
    slug: 'pepperstone',
    url: 'https://www.pepperstone.com'
  },
  {
    broker: 'IC Markets',
    image: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1920',
    logo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: '#2 Best for Professional Traders',
    description: 'True ECN broker with institutional-grade liquidity and advanced tools',
    rating: 4.8,
    reviews: '2,892',
    features: ['True ECN connectivity', 'Institutional liquidity', '500+ trading instruments'],
    slug: 'ic-markets',
    url: 'https://www.icmarkets.com'
  },
  {
    broker: 'XM',
    image: 'https://images.pexels.com/photos/6771985/pexels-photo-6771985.jpeg?auto=compress&cs=tinysrgb&w=1920',
    logo: 'https://images.pexels.com/photos/6771985/pexels-photo-6771985.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: '#3 Best for Beginners',
    description: 'Trusted broker with excellent educational resources and low minimum deposit',
    rating: 4.7,
    reviews: '4,124',
    features: ['$5 minimum deposit', 'Extensive education', 'Multi-language support'],
    slug: 'xm',
    url: 'https://www.xm.com'
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(defaultHeroSlides);
  const [isLoading, setIsLoading] = useState(true);
  const bgImages = [
    'https://images.pexels.com/photos/7567434/pexels-photo-7567434.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/6771985/pexels-photo-6771985.jpeg?auto=compress&cs=tinysrgb&w=1920',  
  ]

  // Fetch top brokers from Supabase
  useEffect(() => {
    const fetchTopBrokers = async () => {
      try {
        const brokers = await fetchAllBrokerDetails();
        
        // Take top 3 brokers by rating
        const topBrokers = brokers.slice(0, 3);
        
        // Format the data for hero slides
        const formattedSlides = topBrokers.map((broker, index) => ({
          broker: broker.name,
          image: broker.image || `https://images.pexels.com/photos/7567434/pexels-photo-7567434.jpeg?auto=compress&cs=tinysrgb&w=1920`,
          logo: broker.logo || `https://via.placeholder.com/120x60?text=${broker.name || 'Broker'}`,
          title: `#${index + 1} ${broker.bestFor || 'Top Rated Forex Broker'}`,
          description: broker.description || 'A reliable broker with competitive trading conditions',
          rating: broker.rating || 4.5,
          reviews: '1,000+', // Default value since we don't have review count in the database
          features: broker.pros?.slice(0, 3) || ['Competitive spreads', 'Multiple trading platforms', 'Regulated'],
          slug: broker.name ? broker.name.toLowerCase().replace(/\s+/g, '-') : `broker-${index + 1}`,
          url: broker.url || '#'
        }));
        
        setHeroSlides(formattedSlides.length > 0 ? formattedSlides : defaultHeroSlides);
      } catch (error) {
        // console.error('Error fetching top brokers:', error);
        setHeroSlides(defaultHeroSlides);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTopBrokers();
  }, []);

  useEffect(() => {
    if (heroSlides.length === 0) return;
    
    const timer = setInterval(() => {
      if (!isAnimating) {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [isAnimating, heroSlides.length]);

  const handleSlideChange = (direction: 'next' | 'prev') => {
    if (heroSlides.length === 0) return;
    
    setIsAnimating(true);
    if (direction === 'next') {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    } else {
      setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    }
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  // Get current slide data with fallback
  const currentSlideData = heroSlides[currentSlide] || defaultHeroSlides[0];

  return (
    <div className="relative h-[950px] md:h-[700px] overflow-hidden flex items-center justify-center " style={{ backgroundImage: `url(${bgImages[currentSlide]})`, backgroundSize: 'cover', backgroundPosition: 'center' }} >
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white text-lg">Loading...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <div className="relative h-full">
            <Image
              src={currentSlideData.image}
              alt="Hero background"
              fill
              style={{ objectFit: "cover" }}
              quality={100}
              priority
            />
            <div className="absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-900/80 to-black/60" />
          </div>
        </AnimatePresence>
      )}

      <div className="absolute inset-0 flex items-center z-30">
        <div className="container mx-auto px-4 w-full flex justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 text-white hover:bg-white/20 z-40"
            onClick={() => handleSlideChange('prev')}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 text-white hover:bg-white/20 z-40"
            onClick={() => handleSlideChange('next')}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center z-50 w-full pointer-events-none">
        <div className="container mx-auto w-full">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col items-center pb-8 space-y-6 md:mb-6 md:space-y-4">
                <div className="h-32 w-32 relative bg-white/10 backdrop-blur-sm rounded-xl p-2 pb-3 md:mb-3">
                  <Image
                    src={currentSlideData.logo || '/placeholder-logo.png'}
                    alt={currentSlideData.broker || 'Broker'}
                    fill
                    style={{ objectFit: "contain" }}
                    className='rounded-xl bg-white'
                    sizes="(max-width: 128px) 100vw, 128px"
                  />
                </div>
                <h2 className="text-white/80 text-3xl font-bold">
                  {currentSlideData.broker || 'Top Forex Broker'}
                </h2>
              </div>
              
              <div className="flex flex-col items-center justify-center space-y-4 pb-8 md:space-y-2 md:mb-6">
                <div className="flex items-center justify-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${
                      i < Math.floor(currentSlideData.rating || 0)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-400'
                    }`}
                  />
                ))}
                <span className="text-white font-medium">
                  {(typeof currentSlideData.rating === 'number' ? currentSlideData.rating.toFixed(1) : '4.5')}/10
                </span>
              </div>
              <div className="text-white text-sm">
                {currentSlideData.reviews || '1,000+'} reviews
              </div>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 px-2" style={{textShadow: '4px 4px 8px #000000'}}>
                {currentSlideData.title || 'Top Rated Forex Broker'}
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-3xl mx-auto px-4">
                {currentSlideData.description || 'A reliable broker with competitive trading conditions'}
              </p>

              <div className="flex flex-wrap justify-center gap-3 mb-10">
                {(currentSlideData.features || ['Competitive spreads', 'Multiple trading platforms', 'Regulated']).map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
                  >
                    <Check className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                    <span className="text-sm text-white">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto z-45 p-10">
                <Button
                  size="lg"
                  className="px-8 py-6 text-base bg-blue-600 hover:bg-blue-700"
                  asChild
                >
                  <Link href={`/broker/${currentSlideData.slug}`}>
                    View Full Review
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="px-8 py-6 text-base bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20"
                  asChild
                >
                  <a 
                    href={currentSlideData.url}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    Visit Broker
                  </a>
                </Button>
              </div>

              {/* Search bar moved to bottom */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
              </div>
            </motion.div>
          </div>
        </div>
        
      </div>

      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              currentSlide === index ? 'bg-white w-8' : 'bg-white/50'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}