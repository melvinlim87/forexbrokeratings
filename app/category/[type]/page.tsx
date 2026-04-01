import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { brokers } from '@/lib/brokers';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Shield, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CategoryInfo {
  title: string;
  description: string;
  filter: (b: (typeof brokers)[0]) => boolean;
}

const CATEGORIES: Record<string, CategoryInfo> = {
  ecn: {
    title: 'ECN Forex Brokers',
    description: 'ECN brokers provide direct market access with tight spreads and fast execution. Ideal for scalpers and algorithmic traders.',
    filter: (b) => !!(
      b.executionType?.toLowerCase().includes('ecn') ||
      b.executionType?.toLowerCase().includes('stp') ||
      b.executionType?.toLowerCase().includes('ndd')
    ),
  },
  mt4: {
    title: 'MT4 Forex Brokers',
    description: 'MetaTrader 4 remains the world\'s most popular trading platform. These brokers offer MT4 with full EA and indicator support.',
    filter: (b) => b.platforms.some((p) => p.toLowerCase().includes('mt4')),
  },
  'low-spread': {
    title: 'Low Spread Forex Brokers',
    description: 'These brokers offer the tightest EUR/USD spreads, saving you money on every trade. Ideal for high-volume and active traders.',
    filter: (b) => b.avgSpreadEurUsd !== undefined && b.avgSpreadEurUsd <= 0.5,
  },
  'us-friendly': {
    title: 'US-Friendly Forex Brokers',
    description: 'Forex brokers that accept US clients with proper CFTC/NFA registration. Essential for American traders seeking regulated options.',
    filter: (b) =>
      b.regulations.some(
        (r) => r.toUpperCase().includes('CFTC') || r.toUpperCase().includes('NFA')
      ) || b.name === 'FOREX.com',
  },
  'fca-regulated': {
    title: 'FCA Regulated Forex Brokers',
    description: 'UK FCA-regulated brokers offer the highest level of client protection with FSCS compensation up to £85,000.',
    filter: (b) => b.regulations.some((r) => r.toUpperCase() === 'FCA'),
  },
  'copy-trading': {
    title: 'Copy Trading Forex Brokers',
    description: 'These brokers offer social and copy trading features, allowing you to follow and replicate the strategies of successful traders.',
    filter: (b) =>
      b.description?.toLowerCase().includes('copy trad') ||
      b.description?.toLowerCase().includes('social trad') ||
      b.features?.some((f) => f.toLowerCase().includes('copy') || f.toLowerCase().includes('social')),
  },
  'zero-deposit': {
    title: 'No Minimum Deposit Brokers',
    description: 'Start trading with any amount — these brokers have no minimum deposit requirement.',
    filter: (b) => b.minDeposit === 0,
  },
  ctrader: {
    title: 'cTrader Forex Brokers',
    description: 'cTrader offers advanced order types, Level II pricing, and a modern interface. These brokers support the cTrader platform.',
    filter: (b) => b.platforms.some((p) => p.toLowerCase().includes('ctrader')),
  },
};

const categorySlugs = Object.keys(CATEGORIES);

export function generateStaticParams() {
  return categorySlugs.map((type) => ({ type }));
}

export async function generateMetadata({
  params,
}: {
  params: { type: string };
}): Promise<Metadata> {
  const category = CATEGORIES[params.type];
  if (!category) return { title: 'Category Not Found' };

  return {
    title: `${category.title} — ForexBrokerRatings`,
    description: category.description,
    alternates: {
      canonical: `/category/${params.type}`,
    },
  };
}

export default function CategoryPage({ params }: { params: { type: string } }) {
  const category = CATEGORIES[params.type];
  if (!category) notFound();

  const filteredBrokers = brokers.filter(category.filter).sort((a, b) => b.rating - a.rating);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        {/* Back link */}
        <Link
          href="/brokers"
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          All Brokers
        </Link>

        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{category.title}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">{category.description}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Showing {filteredBrokers.length} broker{filteredBrokers.length !== 1 ? 's' : ''}
          </p>
        </header>

        {/* Category nav */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categorySlugs.map((slug) => (
            <Link
              key={slug}
              href={`/category/${slug}`}
              className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
                slug === params.type
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {CATEGORIES[slug].title.replace(' Forex Brokers', '').replace(' Brokers', '')}
            </Link>
          ))}
        </div>

        {/* Broker grid */}
        {filteredBrokers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No brokers found matching this category.</p>
            <Link href="/brokers" className="text-primary hover:underline mt-2 inline-block">
              Browse all brokers
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBrokers.map((broker, index) => (
              <Link key={broker.slug} href={`/broker/${broker.slug}`}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-20 relative bg-muted rounded flex-shrink-0 overflow-hidden">
                        <Image
                          src={broker.logo}
                          alt={broker.name}
                          fill
                          className="object-contain p-1"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-semibold truncate">{broker.name}</h3>
                          <div className="flex items-center bg-amber-50 dark:bg-amber-900/20 rounded px-1.5 py-0.5">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-0.5" />
                            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                              {broker.rating}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {broker.bestFor}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {broker.regulations.slice(0, 3).map((r) => (
                            <Badge key={r} variant="secondary" className="text-xs px-1.5 py-0">
                              <Shield className="h-2.5 w-2.5 mr-0.5 text-green-500" />
                              {r}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                          <span>
                            Min: {broker.minDeposit === 0 ? '$0' : `$${broker.minDeposit}`}
                          </span>
                          <span>
                            {broker.avgSpreadEurUsd !== undefined
                              ? `${broker.avgSpreadEurUsd} pip EUR/USD`
                              : broker.spreads}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 p-8 bg-muted/50 rounded-xl text-center border border-border/50">
          <h3 className="text-xl font-bold mb-2">Looking for something specific?</h3>
          <p className="text-muted-foreground mb-4">
            Compare all {brokers.length} brokers or use our comparison tool.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/brokers"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-6 py-3 font-medium hover:opacity-90 transition-opacity"
            >
              Browse All Brokers
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 font-medium hover:bg-muted transition-colors"
            >
              Compare Brokers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
