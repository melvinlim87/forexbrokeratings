import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Star, ExternalLink, Zap, Award, Trophy, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import ScoreRing from '@/components/ui/score-ring';

const RANK_STYLES = [
  { border: 'border-amber-300 dark:border-amber-700', rank: 'text-amber-500', badge: 'bg-amber-500 text-white', icon: Trophy, label: 'Best Overall' },
  { border: 'border-orange-300 dark:border-orange-700', rank: 'text-orange-400', badge: 'bg-orange-500 text-white', icon: Flame, label: 'Runner-Up' },
  { border: 'border-blue-300 dark:border-blue-700', rank: 'text-blue-400', badge: 'bg-blue-500 text-white', icon: Award, label: "Editor's Pick" },
];

interface BrokerCardProps {
  broker: any;
  rank: number;
}

function SpreadBar({ spreads }: { spreads: string }) {
  const match = spreads.match(/([\d.]+)/);
  const value = match ? parseFloat(match[1]) : 1.5;
  const maxSpread = 3.0;
  const pct = Math.min(100, Math.max(5, ((maxSpread - value) / maxSpread) * 100));
  const color = value < 1 ? 'bg-emerald-500' : value < 1.5 ? 'bg-blue-500' : 'bg-amber-500';

  return (
    <div className="flex items-center gap-1.5">
      <div className="h-1.5 w-16 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400">{spreads}</span>
    </div>
  );
}

export default function BrokerCard({ broker, rank }: BrokerCardProps) {
  const idx = rank - 1;
  const style = idx < 3 ? RANK_STYLES[idx] : null;

  return (
    <Card className={cn(
      "transition-all duration-300 overflow-hidden relative",
      "bg-white dark:bg-gray-900",
      style ? `border-2 ${style.border}` : "border border-gray-200 dark:border-gray-800",
      "hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700",
    )}>
      {style && (
        <div className="absolute top-0 right-0 z-10">
          <Badge className={cn("rounded-bl-lg rounded-tr-lg px-2 py-1 text-[10px] font-bold gap-1", style.badge)}>
            <style.icon className="h-3 w-3" />
            {style.label}
          </Badge>
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Rank */}
          <div className="flex-shrink-0 w-8">
            <span className={cn(
              "text-xl font-bold",
              style ? style.rank : "text-gray-300 dark:text-gray-600"
            )}>#{rank}</span>
          </div>

          {/* Logo */}
          <div className="h-10 w-20 relative bg-gray-50 dark:bg-gray-800 rounded flex-shrink-0 overflow-hidden">
            <Image
              src={broker.logo}
              alt={broker.name}
              fill
              className="object-contain p-1"
              unoptimized
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">{broker.name}</h3>
              <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                <ScoreRing score={broker.rating} size={40} strokeWidth={3} />
                <Badge variant="secondary" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] px-1.5 py-0">
                  <ShieldCheck className="h-2.5 w-2.5 mr-0.5" />
                  Regulated
                </Badge>
                {broker.userReviewsData?.trustpilot && (
                  <a href={broker.userReviewsData.trustpilot.url} target="_blank" rel="noopener noreferrer" aria-label={`${broker.name} TrustPilot rating: ${broker.userReviewsData.trustpilot.rating} out of 5`} className="flex items-center gap-0.5 bg-[#00b67a]/10 text-[#00b67a] rounded px-1.5 py-0.5 text-[10px] font-medium hover:bg-[#00b67a]/20 transition-colors">
                    <Star className="h-2.5 w-2.5 fill-current" aria-hidden="true" />
                    {broker.userReviewsData.trustpilot.rating}/5
                  </a>
                )}
              </div>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">{broker.bestFor}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{broker.description.slice(0, 140)}...</p>

            {/* Quick Stats */}
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-0.5">
                <Zap className="h-2.5 w-2.5 text-emerald-500" />
                Min: <strong className="text-gray-700 dark:text-gray-300">${broker.minDeposit}</strong>
              </span>
              <SpreadBar spreads={broker.spreads} />
              <span>{broker.platforms.slice(0, 2).join(', ')}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-2">
              <Button size="sm" variant="outline" className="h-7 text-xs px-2.5" asChild>
                <Link href={`/broker/${broker.slug}`} aria-label={`Read full review of ${broker.name}`}>Full Review</Link>
              </Button>
              <Button size="sm" className="h-7 text-xs px-2.5 bg-blue-600 hover:bg-blue-700 text-white gap-1" asChild>
                <a href={broker.affiliateUrl} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${broker.name} broker website`}>
                  Visit Broker <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
