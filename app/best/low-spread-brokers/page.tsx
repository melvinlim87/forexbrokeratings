import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Shield, TrendingDown, ExternalLink, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTopBrokers } from '@/lib/brokers';

export const metadata: Metadata = {
  title: 'Lowest Spread Forex Brokers 2026 | Top 10 Tight Spread Brokers',
  description: 'Find the forex brokers with the lowest EUR/USD spreads in 2026. Compare raw spreads from 0.0 pips across the top 10 low-cost brokers.',
  openGraph: {
    title: 'Lowest Spread Forex Brokers 2026 | Top 10 Tight Spread Brokers',
    description: 'Find the forex brokers with the lowest EUR/USD spreads in 2026. Raw spreads from 0.0 pips.',
    type: 'website',
  },
};

function getLowSpreadBrokers() {
  const allBrokers = getTopBrokers(81);
  return allBrokers
    .filter(b => b.avgSpreadEurUsd !== undefined && b.avgSpreadEurUsd !== null)
    .sort((a, b) => (a.avgSpreadEurUsd ?? 999) - (b.avgSpreadEurUsd ?? 999))
    .slice(0, 10);
}

export default function LowSpreadBrokersPage() {
  const brokers = getLowSpreadBrokers();

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Lowest Spread Forex Brokers 2026',
    description: 'Top 10 forex brokers with the lowest EUR/USD spreads, ranked by spread cost.',
    numberOfItems: brokers.length,
    itemListElement: brokers.map((broker, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'FinancialProduct',
        name: broker.name,
        url: `https://forexbrokeratings.netlify.app/brokers/${broker.slug}`,
        description: `${broker.bestFor} — EUR/USD spread: ${broker.avgSpreadEurUsd} pips`,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: broker.rating,
          bestRating: 10,
          reviewCount: broker.reviews,
        },
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <TrendingDown className="h-3 w-3 mr-1" /> Lowest Costs
              </Badge>
              <Badge variant="outline">Updated March 2026</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Lowest Spread Forex Brokers 2026
            </h1>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Spread is the single most important cost factor for active forex traders. The spread — the difference between 
                the bid and ask price — directly impacts your profitability on every trade. Low-spread brokers reduce your 
                trading costs, making them essential for scalpers, day traders, and high-frequency strategies. In this ranking, 
                we compare the top 10 forex brokers offering the tightest EUR/USD spreads in 2026, from raw spreads of 
                0.0 pips on ECN accounts to competitive standard spreads under 0.5 pips. We factor in not just the advertised 
                spread but also commissions, execution quality, and hidden fees to give you the true cost picture. Whether 
                you trade forex, gold, or indices, these brokers consistently deliver the lowest total trading costs across 
                all major instruments.
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card><CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{brokers.length}</div>
              <div className="text-sm text-gray-500">Brokers Ranked</div>
            </CardContent></Card>
            <Card><CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{brokers[0]?.avgSpreadEurUsd ?? 0}</div>
              <div className="text-sm text-gray-500">Lowest Spread (Pips)</div>
            </CardContent></Card>
            <Card><CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                ${(brokers.reduce((sum, b) => sum + (b.minDeposit || 0), 0) / brokers.length).toFixed(0)}
              </div>
              <div className="text-sm text-gray-500">Avg Min Deposit</div>
            </CardContent></Card>
          </div>

          {/* Broker Rankings */}
          <div className="space-y-4 mb-12">
            {brokers.map((broker, index) => (
              <Card key={broker.id} className={`hover:shadow-lg transition-all duration-200 ${index === 0 ? 'ring-2 ring-green-500/30 shadow-md' : ''}`}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Rank */}
                    <div className="flex items-center gap-3 md:w-16 flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                        index === 0 ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' :
                        index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                        index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white' :
                        'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}>
                        {index + 1}
                      </div>
                    </div>

                    {/* Logo + Name */}
                    <div className="flex items-center gap-3 md:w-48 flex-shrink-0">
                      <div className="h-10 w-20 relative bg-gray-50 dark:bg-gray-800 rounded overflow-hidden">
                        <Image src={broker.logo} alt={broker.name} fill className="object-contain p-1" unoptimized />
                      </div>
                      <div>
                        <Link href={`/brokers/${broker.slug}`} className="font-bold text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors">
                          {broker.name}
                        </Link>
                        <div className="text-xs text-gray-500">{broker.bestFor}</div>
                      </div>
                    </div>

                    {/* Spread Highlight */}
                    <div className="flex items-center gap-1 md:w-32 flex-shrink-0">
                      <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg">
                        <TrendingDown className="h-4 w-4 text-green-600" />
                        <span className="font-bold text-green-700 dark:text-green-400 text-lg">{broker.avgSpreadEurUsd}</span>
                        <span className="text-xs text-gray-500">pips</span>
                      </div>
                    </div>

                    {/* Key Stats */}
                    <div className="flex-1 grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          <Star className="inline h-3 w-3 fill-amber-400 text-amber-400 mr-0.5" />
                          {broker.rating}
                        </div>
                        <div className="text-xs text-gray-500">Rating</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          ${broker.minDeposit}
                        </div>
                        <div className="text-xs text-gray-500">Min Deposit</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {broker.executionType || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">Execution</div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex gap-2 md:flex-shrink-0">
                      <Button asChild size="sm" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                        <a href={broker.affiliateUrl} target="_blank" rel="noopener noreferrer">
                          Visit <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/brokers/${broker.slug}`}>Review</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info Section */}
          <Card className="mb-8">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Understanding Forex Spreads</h2>
              <div className="prose prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                <p>
                  The spread is the difference between the buy (ask) and sell (bid) price of a currency pair. It represents 
                  the primary cost of trading forex and is measured in pips (percentage in points). For EUR/USD, one pip 
                  equals 0.0001 in price movement. A tighter spread means lower trading costs.
                </p>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">Raw vs Standard Spreads</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Raw Spreads (0.0–0.3 pips):</strong> Available on ECN/Razor accounts with per-lot commission ($3–7/lot round-turn)</li>
                  <li><strong>Standard Spreads (0.6–1.5 pips):</strong> Commission-free accounts where the spread includes the broker's markup</li>
                  <li><strong>Fixed Spreads:</strong> Constant spreads regardless of market conditions — useful during news events</li>
                </ul>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">Total Cost = Spread + Commission</h3>
                <p>
                  When comparing brokers, always calculate the total cost: spread cost + commission per lot. A broker with 
                  0.0 pip spread and $7/lot commission may cost more than one with 0.3 pip spread and $0 commission, 
                  depending on your trade size and frequency.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Internal Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <Link href="/best/ecn-brokers" className="block">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-500" /> Best ECN Brokers →
                  </h3>
                  <p className="text-sm text-gray-500">Direct market access brokers with raw spreads and fast execution</p>
                </Link>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <Link href="/best/beginner-brokers" className="block">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-purple-500" /> Best Brokers for Beginners →
                  </h3>
                  <p className="text-sm text-gray-500">Low-deposit, beginner-friendly brokers with educational resources</p>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
