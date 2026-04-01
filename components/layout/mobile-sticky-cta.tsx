'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Star, X } from 'lucide-react';

interface MobileStickyCTAProps {
  brokerName: string;
  rating: number;
  affiliateUrl: string;
}

/**
 * Mobile Sticky CTA Bar — appears on mobile only (hidden on md+) when viewing broker review pages.
 * Shows broker name + "Visit Broker" CTA button.
 * Appears after scrolling past the hero section (300px).
 */
export default function MobileStickyCTA({ brokerName, rating, affiliateUrl }: MobileStickyCTAProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = () => {
      if (dismissed) return;
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Left: Broker info */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {brokerName}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                  <span className="text-amber-500 dark:text-amber-400 font-medium">{rating}/10</span>
                  <span>· Expert Verified</span>
                </div>
              </div>
            </div>

            {/* Right: CTA + Close */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <a
                href={affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors shadow-md shadow-blue-500/20"
              >
                Visit Broker
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button
                onClick={() => setDismissed(true)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
