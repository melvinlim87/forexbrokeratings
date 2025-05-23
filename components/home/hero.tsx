"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';

const heroSlides = [
  {
    broker: 'Pepperstone',
    image: 'https://images.pexels.com/photos/7567434/pexels-photo-7567434.jpeg?auto=compress&cs=tinysrgb&w=1920',
    logo: 'https://images.pexels.com/photos/7567434/pexels-photo-7567434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: '#1 Best Overall Forex Broker',
    description: 'Award-winning broker with ultra-low spreads and lightning-fast execution',
    rating: 4.9,
    reviews: '3,547',
    features: ['Raw spreads from 0.0 pips', 'Ultra-fast execution', 'Top-tier regulation'],
    slug: 'pepperstone'
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
    slug: 'ic-markets'
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
    slug: 'xm'
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnimating) {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [isAnimating]);

  const handleSlideChange = (direction: 'next' | 'prev') => {
    setIsAnimating(true);
    if (direction === 'next') {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    } else {
      setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    }
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  return (
    <div className="relative h-[600px] md:h-[700px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative h-full">
            <Image
              src={heroSlides[currentSlide].image}
              alt="Hero background"
              layout="fill"
              objectFit="cover"
              quality={100}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center justify-between z-10 pointer-events-none">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 ml-4 pointer-events-auto text-white hover:bg-white/20"
          onClick={() => handleSlideChange('prev')}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 mr-4 pointer-events-auto text-white hover:bg-white/20"
          onClick={() => handleSlideChange('next')}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>

      <div className="absolute inset-0 flex items-center z-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-12 w-24 relative bg-white/10 backdrop-blur-sm rounded">
                  <Image
                    src={heroSlides[currentSlide].logo}
                    alt={heroSlides[currentSlide].broker}
                    layout="fill"
                    objectFit="contain"
                    className="p-1"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${
                      i < Math.floor(heroSlides[currentSlide].rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-400'
                    }`}
                  />
                ))}
                <span className="text-white font-medium ml-2">
                  {heroSlides[currentSlide].rating}/5 ({heroSlides[currentSlide].reviews} reviews)
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                {heroSlides[currentSlide].title}
              </h1>
              
              <p className="text-xl text-gray-200 mb-6">
                {heroSlides[currentSlide].description}
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                {heroSlides[currentSlide].features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
                  >
                    <Check className="h-4 w-4 text-green-400 mr-2" />
                    <span className="text-sm text-white">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="px-8 py-6 text-base bg-blue-600 hover:bg-blue-700 w-[200px]"
                  asChild
                >
                  <Link href={`/broker/${heroSlides[currentSlide].slug}`}>
                    View Full Review
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="px-8 py-6 text-base bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20 w-[200px]"
                  asChild
                >
                  <a 
                    href="https://example.com/broker"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full"
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
        
        {/* Search bar section at bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm py-6">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search for brokers..."
                  className="pl-10 py-6 w-full bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <Button
                size="lg"
                className="px-8 py-6 text-base bg-blue-600 hover:bg-blue-700"
              >
                Find Brokers
              </Button>
            </div>
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