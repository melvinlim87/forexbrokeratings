import Link from 'next/link';
import { Award, Star, ArrowRight } from 'lucide-react';
import { brokers } from '@/lib/brokers';

const awardCategories = [
  { label: 'Best Overall', filter: (b: typeof brokers[0]) => b.rating >= 4.8 },
  { label: 'Best for Beginners', filter: (b: typeof brokers[0]) => b.minDeposit <= 50 && b.rating >= 4.3 },
  { label: 'Best for Low Costs', filter: (b: typeof brokers[0]) => (b.avgSpreadEurUsd ?? 999) <= 0.7 },
  { label: 'Best Regulated', filter: (b: typeof brokers[0]) => b.regulations.filter(r => ['FCA', 'ASIC', 'MAS'].includes(r)).length >= 2 },
];

function getAwardWinner(filter: (b: typeof brokers[0]) => boolean) {
  const candidates = brokers.filter(filter);
  candidates.sort((a, b) => b.rating - a.rating);
  return candidates[0] || null;
}

export default function AwardsBanner() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10 rounded-2xl border border-amber-200/50 dark:border-amber-800/30 p-6 md:p-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">2026 Award Winners</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Our annual picks based on extensive testing</p>
              </div>
            </div>
            <Link
              href="/rankings"
              className="hidden sm:flex items-center gap-1 text-amber-700 dark:text-amber-400 font-medium text-sm hover:gap-2 transition-all"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Award Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {awardCategories.map((cat) => {
              const winner = getAwardWinner(cat.filter);
              if (!winner) return null;
              return (
                <Link
                  key={cat.label}
                  href={`/broker/${winner.slug}`}
                  className="group bg-white dark:bg-gray-900 rounded-xl p-4 border border-amber-100 dark:border-amber-900/30 hover:border-amber-300 dark:hover:border-amber-600 transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">{cat.label}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                    {winner.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{winner.rating}/10</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">EUR/USD {winner.avgSpreadEurUsd} pips</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Mobile link */}
          <div className="sm:hidden mt-6 text-center">
            <Link
              href="/rankings"
              className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-medium text-sm"
            >
              View All Award Winners
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
