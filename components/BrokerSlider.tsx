'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, A11y } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BrokerCard from './BrokerCard';
import { Broker } from '@/lib/brokers';
import { fetchTopBroker, BrokerDetails } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/a11y';

// Map BrokerDetails to Broker type
const mapToBroker = (broker: BrokerDetails): Broker => {
  // Helper function to safely parse numbers from strings
  const parseNumber = (value: string | undefined, defaultValue: number): number => {
    if (!value) return defaultValue;
    const num = parseFloat(value.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? defaultValue : num;
  };

  return {
    id: broker.id.toString(),
    name: broker.name,
    logo: broker.logo || '',
    rating: parseNumber(broker.rating, 0),
    minSpread: parseNumber(broker.spread_eur_usd, 0),
    maxLeverage: broker.leverage_max || '1:30',
    minDeposit: parseNumber(broker.min_deposit, 0),
    regulators: broker.regulators || [],
    tradingPlatforms: broker.platforms || [],
    accountTypes: [],
    perks: [...(broker.pros || []), ...(broker.cons || [])],
    description: broker.description || '',
    established: parseInt(broker.year_published || '2000'),
    headquarters: broker.headquarters || '',
    assets: 0
  };
};

export default function BrokerSlider() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBrokers = async () => {
      try {
        setLoading(true);
        const data = await fetchTopBroker();
        setBrokers(data);
      } catch (err) {
        console.error('Failed to fetch brokers:', err);
        setError('Failed to load brokers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadBrokers();
  }, []);

  // Skeleton loader for cards
  const renderSkeletons = () => {
    return Array.from({ length: 4 }).map((_, i) => (
      <SwiperSlide key={`skeleton-${i}`} className="h-auto">
        <div className="h-full p-6 bg-white/5 rounded-xl border border-white/10">
          <div className="flex justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Skeleton className="w-14 h-14 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="w-12 h-6 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </SwiperSlide>
    ));
  };

  return (
    <section 
      id="brokers" 
      className="py-20 bg-gradient-to-b from-transparent to-black/20 relative overflow-hidden"
      aria-label="Top Rated Forex Brokers"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -right-20 w-72 h-72 bg-cyan-500/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-72 h-72 bg-purple-500/10 rounded-full filter blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Top Rated <span className="text-cyan-400">Forex Brokers</span>
          </motion.h2>
          <motion.p 
            className="text-xl text-cyan-100 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Discover the most trusted brokers with competitive spreads and exceptional service
          </motion.p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            ref={prevRef}
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:border-cyan-400/50 transition-all duration-300 w-12 h-12 rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <Button
            ref={nextRef}
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:border-cyan-400/50 transition-all duration-300 w-12 h-12 rounded-full"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          {/* Swiper */}
          {error ? (
            <div 
              className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center"
              role="alert"
              aria-live="assertive"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 mb-4">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-red-100 mb-2">Something went wrong</h3>
              <p className="text-red-200 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors border border-red-500/30"
              >
                Try Again
              </button>
            </div>
          ) : (
            <Swiper
              modules={[Navigation, Pagination, Autoplay, A11y]}
              spaceBetween={24}
              slidesPerView={1.2}
              centeredSlides={false}
              loop={!loading && brokers.length > 1}
              autoplay={!loading && brokers.length > 1 ? {
                delay: 6000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              } : false}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
                disabledClass: 'opacity-30 cursor-not-allowed',
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
                dynamicMainBullets: 4,
                renderBullet: (_, className) => {
                  return `<span class="${className}" role="button" tabindex="0" aria-label="Go to slide ${_ + 1}"></span>`;
                },
              }}
              a11y={{
                prevSlideMessage: 'Previous slide',
                nextSlideMessage: 'Next slide',
                firstSlideMessage: 'This is the first slide',
                lastSlideMessage: 'This is the last slide',
                paginationBulletMessage: 'Go to slide {{index}}',
              }}
              breakpoints={{
                480: {
                  slidesPerView: 1.5,
                  spaceBetween: 20,
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
                1280: {
                  slidesPerView: 4,
                  spaceBetween: 24,
                },
              }}
              onBeforeInit={(swiper) => {
                // @ts-ignore
                swiper.params.navigation.prevEl = prevRef.current;
                // @ts-ignore
                swiper.params.navigation.nextEl = nextRef.current;
              }}
              className="pb-12 relative"
              wrapperTag="ul"
            >
              {loading ? (
                renderSkeletons()
              ) : brokers.length > 0 ? (
                brokers.map((broker, index) => (
                  <SwiperSlide 
                    key={broker.id} 
                    className="h-auto"
                    tag="li"
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${brokers.length}`}
                  >
                    <BrokerCard broker={broker} index={index} />
                  </SwiperSlide>
                ))
              ) : (
                <div className="text-center py-12 col-span-full">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 mb-4">
                    <AlertCircle className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">No brokers found</h3>
                  <p className="text-cyan-100">We couldn't find any brokers matching your criteria.</p>
                </div>
              )}
            </Swiper>
          )}
        </div>
      </div>

      {/* Custom pagination styles */}
      <style jsx global>{`
        .swiper-pagination {
          bottom: 0 !important;
        }
        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.3) !important;
          opacity: 1 !important;
        }
        .swiper-pagination-bullet-active {
          background: rgb(34, 197, 244) !important;
        }
      `}</style>
    </section>
  );
}