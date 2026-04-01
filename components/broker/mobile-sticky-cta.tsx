'use client';

import { useState, useEffect } from 'react';
import { X, ExternalLink, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrokerMobileCTAProps {
  brokerName: string;
  rating: number;
  affiliateUrl: string;
}

export default function BrokerMobileCTA({ brokerName, rating, affiliateUrl }: BrokerMobileCTAProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = () => {
      if (dismissed) return;
      setVisible(window.scrollY > 600);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [dismissed]);

  if (dismissed || !visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden animate-in slide-in-from-bottom duration-300">
      <div className="mx-3 mb-3 rounded-2xl shadow-2xl border border-gray-700 bg-gray-900/95 backdrop-blur-md p-3">
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-2 right-2 p-1 text-gray-500 hover:text-white"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-base font-semibold text-white truncate">{brokerName}</div>
            <div className="flex items-center gap-1 text-base text-gray-400">
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
              <span className="text-amber-400 font-medium">{rating}/10</span>
              <span>· Expert Verified</span>
            </div>
          </div>
          <a
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold text-base px-4 py-2.5 rounded-xl transition-colors"
          >
            Visit Broker <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
