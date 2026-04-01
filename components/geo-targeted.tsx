'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';

const countryData: Record<string, { flag: string; name: string; slug: string; topBroker: string }> = {
  SG: { flag: '🇸🇬', name: 'Singapore', slug: 'singapore', topBroker: 'Pepperstone' },
  MY: { flag: '🇲🇾', name: 'Malaysia', slug: 'malaysia', topBroker: 'IC Markets' },
  ID: { flag: '🇮🇩', name: 'Indonesia', slug: 'indonesia', topBroker: 'Exness' },
  TH: { flag: '🇹🇭', name: 'Thailand', slug: 'thailand', topBroker: 'Pepperstone' },
  PH: { flag: '🇵🇭', name: 'Philippines', slug: 'philippines', topBroker: 'eToro' },
  VN: { flag: '🇻🇳', name: 'Vietnam', slug: 'vietnam', topBroker: 'IC Markets' },
  IN: { flag: '🇮🇳', name: 'India', slug: 'india', topBroker: 'Exness' },
  JP: { flag: '🇯🇵', name: 'Japan', slug: 'japan', topBroker: 'SBI FX' },
  KR: { flag: '🇰🇷', name: 'South Korea', slug: 'south-korea', topBroker: 'IG Group' },
  AU: { flag: '🇦🇺', name: 'Australia', slug: 'australia', topBroker: 'Pepperstone' },
  GB: { flag: '🇬🇧', name: 'UK', slug: 'uk', topBroker: 'IG Group' },
  NG: { flag: '🇳🇬', name: 'Nigeria', slug: 'nigeria', topBroker: 'Exness' },
  ZA: { flag: '🇿🇦', name: 'South Africa', slug: 'south-africa', topBroker: 'Exness' },
  AE: { flag: '🇦🇪', name: 'UAE', slug: 'uae', topBroker: 'Saxo Bank' },
  SA: { flag: '🇸🇦', name: 'Saudi Arabia', slug: 'saudi-arabia', topBroker: 'Saxo Bank' },
  BR: { flag: '🇧🇷', name: 'Brazil', slug: 'brazil', topBroker: 'XP Investimentos' },
};

export default function GeoTargeted() {
  const [country, setCountry] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(data => setCountry(data.country_code))
      .catch(() => setCountry(null));
  }, []);

  if (!country || !countryData[country]) return null;

  const info = countryData[country];

  return (
    <section className="py-4">
      <div className="container mx-auto px-4">
        <Link
          href={`/${info.slug}`}
          className="flex items-center justify-between bg-white/50 dark:bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-gray-200/30 dark:border-white/10 hover:bg-white/70 dark:hover:bg-white/15 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{info.flag}</span>
            <div>
              <div className="text-sm text-gray-500 dark:text-white/60">Top Brokers in</div>
              <div className="font-bold text-gray-900 dark:text-white">{info.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-medium">
            View Top 50 <ArrowRight className="h-4 w-4" />
          </div>
        </Link>
      </div>
    </section>
  );
}
