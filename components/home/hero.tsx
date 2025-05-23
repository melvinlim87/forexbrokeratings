"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const heroSlides = [
  {
    image: 'https://images.pexels.com/photos/7567434/pexels-photo-7567434.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Find Your Perfect Trading Partner',
    description: 'Compare top forex brokers with detailed reviews and ratings',
    rating: 4.8,
    reviews: '2,547'
  },
  {
    image: 'https://images.pexels.com/photos/6771985/pexels-photo-6771985.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Expert Analysis & Reviews',
    description: 'In-depth broker comparisons by professional traders',
    rating: 4.9,
    reviews: '1,892'
  },
  {
    image: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Start Trading with Confidence',
    description: 'Choose from regulated brokers with proven track records',
    rating: 4.7,
    reviews: '3,124'
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

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                {heroSlides[currentSlide].title}
              </h1>
              
              <p className="text-xl text-gray-200 mb-8">
                {heroSlides[currentSlide].description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
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