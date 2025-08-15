"use client";

import { useEffect, useState } from 'react';
import { fetchFeaturedPromotion, BrokerPromotionWithBrokerDetails } from '@/lib/supabase';
import { TimerIcon } from 'lucide-react';

interface Promotion {
  id: number;
  title: string;
  description: string;
  summary: string;
  images: string[];
  valid_till: string;
  broker_details: {
    name: string;
    website: string;
    logo: string;
    rating: number;
  };
}

function getCountryFromIp(ip_country: string): 'Malaysia' | 'Singapore' | null {
  
  if (ip_country == 'SG') return 'Singapore';
  return 'Malaysia';
}

export default function PromotionPopup() {
  const [show, setShow] = useState(false);
  const [promotion, setPromotion] = useState<BrokerPromotionWithBrokerDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPromo() {
     
      // Fetch promo
      try {
        let country = localStorage.getItem('forexbrokeratings_country')
        const promos = await fetchFeaturedPromotion(country ?? 'Malaysia');
        if (Array.isArray(promos) && promos.length > 0) {
          setPromotion(promos[0]);
          setShow(true);
        } else {
          setPromotion(null);
        }
      } catch {
        setPromotion(null);
      } finally {
        setLoading(false);
      }
    }
    fetchPromo();
  }, []);

  if (!show || loading || !promotion) return null;

  // To ensure PromotionPopup is above the header, place <PromotionPopup /> just above <Header /> in your layout.tsx:
  // <AppProviders>
  //   <ThemeProvider ...>
  //     <PromotionPopup />
  //     <Header />
  //     ...
  return (
    <div className="fixed inset-0 z-[11000] flex items-center justify-center bg-black/50 ">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full p-8 flex flex-col md:flex-row z-[11010] mx-4">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-700 z-[11011]"
          onClick={() => setShow(false)}
          aria-label="Close promotion popup"
        >
          ×
        </button>
        <div className="flex-1 flex flex-col justify-center pr-0">
          {/* <div className="mb-2">
            <span className="inline-flex items-center bg-red-500 text-white px-4 py-1 rounded-full text-xs font-bold">
              <span className="mr-1">🔥</span> {promotion.category}
            </span>
          </div> */}
          <div className="flex flex-row items-center justify-between w-full mb-4 gap-4 bg-gray-200 rounded-xl">
            {/* Powered by section */}
            <div className="flex items-center rounded-xl px-3 py-2">
                <div className="hidden md:flex items-center">
                  <span className="text-xs text-gray-500 mr-2">Powered by</span>
                </div>
                <img src={promotion.broker_details.logo || ''} alt={promotion.broker_details.name} className="h-10 w-10 md:h-8 md:w-8 rounded-full border md:mr-2" />
                <a className="pl-2 font-bold text-cyan-700 text-lg" href={`/broker/${promotion.broker_details.name.toLowerCase().replace(/\s+/g, '-')}`}>{promotion.broker_details.name}</a>
            </div>
            {/* Expiry section */}
            <div className="flex items-center gap-2 min-w-fit rounded-xl px-3 py-2">
                <TimerIcon className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500 text-xs font-medium">
                    Valid Till: <br /> 
                    {(() => {
                      const d = new Date(promotion.valid_till);
                      const day = String(d.getDate()).padStart(2, '0');
                      const month = String(d.getMonth() + 1).padStart(2, '0');
                      const year = d.getFullYear();
                      return `${day}-${month}-${year}`;
                    })()}
                </span>
            </div>
          </div>
          {/* Promotion Images */}
          {promotion.images && promotion.images.length > 0 && (
            <img
              src={promotion.images[0].startsWith('/') || promotion.images[0].startsWith('http') ? promotion.images[0] : `/assets/images/promotions/${promotion.images[0]}`}
              alt={promotion.title}
              className="w-full h-50 object-cover rounded mb-4 border border-gray-200 bg-gray-50"
            />
          )}
          <div className="font-extrabold text-2xl md:text-3xl mb-2 text-gray-900">
            {promotion.title}
          </div>
          <div className="text-sm md:text-lg text-cyan-700 mb-4">{promotion.description}</div>
          {/* <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="flex items-center gap-2 text-green-700"><span>⚡</span> Instant Processing</div>
            <div className="flex items-center gap-2 text-green-700"><span>$</span> No Hidden Fees</div>
            <div className="flex items-center gap-2 text-green-700"><span>🛡️</span> Fully Regulated</div>
            <div className="flex items-center gap-2 text-green-700"><span>📈</span> Professional Platform</div>
          </div> */}
          <a
            href={`/broker/${promotion.broker_details.name.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={(e) => {
              e.preventDefault();
              setShow(false);
              window.location.href = `/broker/${promotion.broker_details.name.toLowerCase().replace(/\s+/g, '-')}`;
            }}
            className="block w-full text-center py-3 mt-2 rounded-lg font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-400 text-white shadow hover:brightness-110 transition"
          >
            Claim Your Bonus Now
          </a>
          {promotion.conditions ? (
            <div className="text-[10px] text-gray-400 mt-1 text-center">*T&amp;C apply. Risk warning: Trading involves substantial risk.</div>
        ) : null}
        </div>
      </div>
    </div>
  );
}
