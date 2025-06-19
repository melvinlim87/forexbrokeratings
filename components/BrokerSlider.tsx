'use client';

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BrokerCard from './BrokerCard';
import { brokers } from '@/lib/brokers';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function BrokerSlider() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <section id="brokers" className="py-20 bg-gradient-to-b from-transparent to-black/20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Top Rated <span className="text-cyan-400">Forex Brokers</span>
          </h2>
          <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
            Discover the most trusted brokers with competitive spreads and exceptional service
          </p>
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
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1.2}
            centeredSlides={false}
            loop={true}
            autoplay={{
              delay: 6000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                centeredSlides: false,
              },
              1024: {
                slidesPerView: 3,
                centeredSlides: false,
              },
              1280: {
                slidesPerView: 4,
                centeredSlides: false,
              },
            }}
            onBeforeInit={(swiper) => {
              // @ts-ignore
              swiper.params.navigation.prevEl = prevRef.current;
              // @ts-ignore
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            className="pb-12"
          >
            {brokers.map((broker, index) => (
              <SwiperSlide key={broker.id} className="h-auto">
                <BrokerCard broker={broker} index={index} />
              </SwiperSlide>
            ))}
          </Swiper>
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