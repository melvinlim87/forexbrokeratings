"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Star, Globe2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BrokerData {
  name: string;
  logo: string;
  rating: number;
  minDeposit: number;
  summary: string;
  affiliateUrl?: string;
  tradingInfo: Record<string, unknown>;
  tradingFeatures: Record<string, unknown>;
  fees: {
    trading: Record<string, unknown>;
    nonTrading: Record<string, unknown>;
  };
  depositWithdrawal: {
    methods: string[];
    depositTime: string;
    withdrawalTime: string;
    baseCurrencies: string[];
  };
  regulation: {
    primary: string;
    additional: string[];
    allRegulations?: string[];
    licenseNumbers?: string[];
    clientFunds: string;
    investorCompensation: string;
  };
  customerSupport: {
    channels: string[];
    hours: string;
    responseTime: string;
    languages: string[];
  };
  scores: Record<string, number>;
  pros: string[];
  cons: string[];
}

interface BrokerProfileProps {
  brokerData: BrokerData;
  relatedBrokers: any[];
}

export function BrokerProfile({ brokerData }: BrokerProfileProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50">
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}
      />
      {/* Accent glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 sm:-top-24 sm:-right-24 sm:w-64 sm:h-64 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-12 -left-12 w-36 h-36 sm:-bottom-16 sm:-left-16 sm:w-48 sm:h-48 bg-emerald-500/8 rounded-full blur-3xl" />

      <div className="relative z-10 px-4 sm:px-6 py-5">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Left: Logo + Name + Rating */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 mb-3">
              <div className="h-14 w-24 relative bg-white/10 backdrop-blur-sm rounded-xl p-2 flex-shrink-0 border border-white/10">
                <Image
                  src={brokerData.logo}
                  alt={brokerData.name}
                  fill
                  className="object-contain"
                  sizes="96px"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">
                  {brokerData.name} Review
                </h1>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/10">
                    <div className="flex space-x-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-5 w-5",
                            i < Math.floor(brokerData.rating)
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-500"
                          )}
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-bold text-white text-lg">
                      {brokerData.rating.toFixed(1)}
                    </span>
                    <span className="ml-1 text-slate-400 text-base">/10</span>
                  </div>
                  <Badge variant="outline" className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-sm">
                    Min ${brokerData.minDeposit}
                  </Badge>
                </div>
              </div>
            </div>
            <p className="text-base text-slate-300 leading-relaxed max-w-2xl line-clamp-3">
              {brokerData.summary}
            </p>
          </div>

          {/* Right: CTA Buttons */}
          <div className="flex flex-col gap-2 w-full md:w-auto md:min-w-[200px] flex-shrink-0">
            <a href={brokerData.affiliateUrl || '#'} target="_blank" rel="noopener noreferrer sponsored" className="w-full">
              <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/25 border-0 text-base font-semibold h-12">
                <Globe2 className="h-5 w-5 mr-2" />
                Visit {brokerData.name}
              </Button>
            </a>
            <Button size="sm" variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white h-9 text-sm">
              Add to Compare
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
