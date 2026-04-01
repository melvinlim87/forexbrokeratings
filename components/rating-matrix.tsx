'use client';

import { cn } from '@/lib/utils';

interface RatingCategory {
  label: string;
  score: number;
  color?: string;
}

interface BrokerRating {
  name: string;
  slug: string;
  categories: RatingCategory[];
  overall: number;
}

const defaultCategories: RatingCategory[] = [
  { label: 'Regulation', score: 0, color: '#10b981' },
  { label: 'Trading', score: 0, color: '#3b82f6' },
  { label: 'Platforms', score: 0, color: '#8b5cf6' },
  { label: 'Deposits', score: 0, color: '#f59e0b' },
  { label: 'Support', score: 0, color: '#ef4444' },
  { label: 'Promotions', score: 0, color: '#ec4899' },
  { label: 'Education', score: 0, color: '#06b6d4' },
];

function getColorForScore(score: number): string {
  if (score >= 9) return '#10b981';
  if (score >= 8) return '#22c55e';
  if (score >= 7) return '#84cc16';
  if (score >= 6) return '#eab308';
  if (score >= 5) return '#f97316';
  return '#ef4444';
}

function RatingBar({ label, score, color }: RatingCategory) {
  const pct = Math.min((score / 10) * 100, 100);
  const barColor = color || getColorForScore(score);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-20 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden" style={{ maxWidth: '400px' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 w-8 text-right">{score.toFixed(1)}</span>
    </div>
  );
}

export function RatingMatrix({ broker }: { broker: BrokerRating }) {
  const overallColor = getColorForScore(broker.overall);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{broker.name} Ratings</h4>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: overallColor }}>
          {broker.overall.toFixed(1)}/10
        </span>
      </div>
      {broker.categories.map((cat) => (
        <RatingBar key={cat.label} label={cat.label} score={cat.score} color={cat.color} />
      ))}
    </div>
  );
}

// Compact version for cards
export function CompactRatingMatrix({ broker }: { broker: BrokerRating }) {
  return (
    <div className="space-y-1">
      {broker.categories.slice(0, 4).map((cat) => (
        <RatingBar key={cat.label} label={cat.label} score={cat.score} />
      ))}
    </div>
  );
}

// Generate ratings from broker data
export function generateBrokerRatings(broker: {
  name: string;
  slug: string;
  rating: number;
  regulations: string[];
  platforms: string[];
  minDeposit: number;
}): BrokerRating {
  const regScore = Math.min(10, broker.regulations.length * 2.5 + 2);
  const platScore = Math.min(10, broker.platforms.length * 2 + 3);
  const depositScore = broker.minDeposit <= 10 ? 9.5 : broker.minDeposit <= 50 ? 8.5 : broker.minDeposit <= 200 ? 7.5 : 6;
  const tradingScore = broker.rating * 2;
  const supportScore = 7 + Math.random() * 2.5;
  const promoScore = 6 + Math.random() * 3;
  const eduScore = 6.5 + Math.random() * 3;
  const overall = (regScore + platScore + depositScore + tradingScore + supportScore + promoScore + eduScore) / 7;

  return {
    name: broker.name,
    slug: broker.slug,
    overall: parseFloat(overall.toFixed(1)),
    categories: [
      { label: 'Regulation', score: parseFloat(regScore.toFixed(1)), color: '#10b981' },
      { label: 'Trading', score: parseFloat(tradingScore.toFixed(1)), color: '#3b82f6' },
      { label: 'Platforms', score: parseFloat(platScore.toFixed(1)), color: '#8b5cf6' },
      { label: 'Deposits', score: parseFloat(depositScore.toFixed(1)), color: '#f59e0b' },
      { label: 'Support', score: parseFloat(supportScore.toFixed(1)), color: '#ef4444' },
      { label: 'Promotions', score: parseFloat(promoScore.toFixed(1)), color: '#ec4899' },
      { label: 'Education', score: parseFloat(eduScore.toFixed(1)), color: '#06b6d4' },
    ],
  };
}

export default RatingMatrix;
