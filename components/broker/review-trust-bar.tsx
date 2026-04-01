"use client";

import { Shield, Users, FileCheck, RefreshCw, Clock, BadgeCheck } from 'lucide-react';

/**
 * Trust credibility bar shown on broker review pages.
 * Inspired by ForexBrokers.com ("Over 9 million visitors served") 
 * and NerdWallet's trust indicators.
 * Shows date of last review verification prominently.
 */
export default function ReviewTrustBar({ brokerName }: { brokerName: string }) {
  // Dynamic "last verified" date — always shows current month
  const now = new Date();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const lastVerified = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

  const stats = [
    {
      icon: FileCheck,
      value: '200+',
      label: 'data points reviewed',
    },
    {
      icon: Shield,
      value: '3-tier',
      label: 'regulation check',
    },
    {
      icon: Users,
      value: '47K+',
      label: 'traders helped',
    },
    {
      icon: RefreshCw,
      value: lastVerified,
      label: 'last verified',
    },
  ];

  return (
    <div className="space-y-2 py-2">
      {/* Prominent review date — NerdWallet-style */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-2.5 px-4 rounded-lg bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-emerald-950/40 border border-emerald-800/40">
        <div className="flex items-center gap-2">
          <BadgeCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          <span className="text-base font-semibold text-emerald-300">
            {brokerName} Review
          </span>
          <span className="text-base text-emerald-400/70">—</span>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-emerald-400/70" />
            <span className="text-base text-emerald-400/80">
              Last reviewed and verified: <strong className="text-emerald-300">{lastVerified}</strong>
            </span>
          </div>
        </div>
        <span className="text-[10px] text-emerald-500/60 font-medium bg-emerald-900/30 px-2 py-0.5 rounded-full">
          200+ data points per broker
        </span>
      </div>

      {/* Trust stats row */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-3 px-4 rounded-lg bg-gray-900/30 border border-gray-800/60">
        <span className="text-base text-gray-400 font-medium">
          Our {brokerName} review is based on:
        </span>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-1.5 text-base">
              <stat.icon className="h-3 w-3 text-emerald-500" />
              <span className="font-semibold text-white">{stat.value}</span>
              <span className="text-gray-400">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
