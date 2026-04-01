import Link from 'next/link';
import Image from 'next/image';
import { Star, DollarSign, ExternalLink } from 'lucide-react';
import { getTopBrokers } from '@/lib/brokers';

interface SidebarTopBrokersProps {
  /** Optional title override */
  title?: string;
  /** Number of brokers to show (default 5) */
  count?: number;
  /** Optional className for outer wrapper */
  className?: string;
}

export default function SidebarTopBrokers({
  title = 'Top 5 Brokers This Month',
  count = 5,
  className = '',
}: SidebarTopBrokersProps) {
  const topBrokers = getTopBrokers(count);

  return (
    <div className={`rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-yellow-300 text-yellow-300" />
          {title}
        </h3>
        <p className="text-[10px] text-blue-100 mt-0.5">Updated March 2026</p>
      </div>

      {/* Broker List */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {topBrokers.map((broker, idx) => (
          <Link
            key={broker.id}
            href={`/broker/${broker.slug}`}
            className="group flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            {/* Rank Badge */}
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              idx === 0
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                : idx === 1
                  ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  : idx === 2
                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                    : 'bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-500'
            }`}>
              {idx + 1}
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 h-8 w-16 relative">
              <Image
                src={broker.logo}
                alt={broker.name}
                fill
                className="object-contain"
                sizes="64px"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {broker.name}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {/* Rating */}
                <span className="inline-flex items-center gap-0.5 text-xs">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {broker.rating.toFixed(1)}
                  </span>
                </span>
                {/* Min Deposit */}
                <span className="inline-flex items-center gap-0.5 text-xs text-gray-500 dark:text-gray-400">
                  <DollarSign className="h-2.5 w-2.5" />
                  {broker.minDeposit === 0 ? 'No min' : `$${broker.minDeposit}`}
                </span>
              </div>
            </div>

            {/* Arrow */}
            <ExternalLink className="h-3.5 w-3.5 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
          </Link>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <Link
          href="/brokers"
          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          View All Brokers <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
