import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Shield, Zap, ExternalLink, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTopBrokers } from '@/lib/brokers';

export const metadata: Metadata = {
  title: 'Best ECN Brokers 2026 | Top 10 ECN Forex Brokers Ranked',
  description: 'Compare the 10 best ECN forex brokers in 2026. Raw spreads from 0.0 pips, direct market access, and no dealing desk execution. Expert-tested rankings.',
  openGraph: {
    title: 'Best ECN Brokers 2026 | Top 10 ECN Forex Brokers Ranked',
    description: 'Compare the 10 best ECN forex brokers in 2026. Raw spreads from 0.0 pips, direct market access, and no dealing desk execution.',
    type: 'website',
  },
};

function getEcnBrokers() {
  const allBrokers = getTopBrokers(81);
  return allBrokers
    .filter(b => b.executionType && b.executionType.toLowerCase().includes('ecn'))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);
}

export default function EcnBrokersPage() {
  const brokers = getEcnBrokers();

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best ECN Forex Brokers 2026',
    description: 'Top 10 ECN forex brokers ranked by rating, spreads, and execution quality.',
    numberOfItems: brokers.length,
    itemListElement: brokers.map((broker, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'FinancialProduct',
        name: broker.name,
        url: `https://forexbrokeratings.netlify.app/brokers/${broker.slug}`,
        description: broker.bestFor,
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
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                <Zap className="h-3 w-3 mr-1" /> Expert Ranked
              </Badge>
              <Badge variant="outline">Updated March 2026</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Best ECN Brokers 2026
            </h1>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                ECN (Electronic Communication Network) brokers provide direct market access with no dealing desk intervention, 
                offering the tightest spreads and most transparent execution available to retail forex traders. Unlike market makers, 
                ECN brokers connect your orders directly to a liquidity pool of banks, hedge funds, and institutional participants, 
                resulting in raw spreads that can start from 0.0 pips on major pairs like EUR/USD. Our expert team has tested and 
                ranked the top 10 ECN brokers based on execution speed, spread quality, regulatory strength, platform options, 
                and overall trading costs. Whether you're a scalper seeking the fastest fills, an algorithmic trader needing 
                reliable API access, or a professional looking for institutional-grade execution, these ECN brokers deliver 
                the best combination of tight spreads, fast execution, and strong regulation in 2026.
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card><CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{brokers.length}</div>
              <div className="text-sm text-gray-500">ECN Brokers Ranked</div>
            </CardContent></Card>
            <Card><CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">0.0</div>
              <div className="text-sm text-gray-500">Min Spread (Pips)</div>
            </CardContent></Card>
            <Card><CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">ECN</div>
              <div className="text-sm text-gray-500">Execution Type</div>
            </CardContent></Card>
          </div>

          {/* Broker Rankings */}
          <div className="space-y-4 mb-12">
            {brokers.map((broker, index) => (
              <Card key={broker.id} className={`hover:shadow-lg transition-all duration-200 ${index === 0 ? 'ring-2 ring-blue-500/30 shadow-md' : ''}`}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Rank */}
                    <div className="flex items-center gap-3 md:w-16 flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                        index === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white' :
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
                        <Link href={`/brokers/${broker.slug}`} className="font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {broker.name}
                        </Link>
                        <div className="text-xs text-gray-500">{broker.bestFor}</div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 md:w-28 flex-shrink-0">
                      <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-gray-900 dark:text-white">{broker.rating}</span>
                        <span className="text-xs text-gray-500">/10</span>
                      </div>
                    </div>

                    {/* Key Stats */}
                    <div className="flex-1 grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {broker.avgSpreadEurUsd !== undefined ? `${broker.avgSpreadEurUsd} pips` : 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">EUR/USD Spread</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          ${broker.minDeposit}
                        </div>
                        <div className="text-xs text-gray-500">Min Deposit</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {broker.executionType}
                        </div>
                        <div className="text-xs text-gray-500">Execution</div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex gap-2 md:flex-shrink-0">
                      <Button asChild size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What Is an ECN Broker?</h2>
              <div className="prose prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                <p>
                  An ECN (Electronic Communication Network) broker is a type of forex broker that connects traders directly 
                  to a network of liquidity providers — including banks, hedge funds, and other institutional participants. 
                  Unlike market maker brokers that take the opposite side of your trade, ECN brokers act as intermediaries, 
                  matching buy and sell orders from multiple participants in the network.
                </p>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">Key Benefits of ECN Brokers</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Raw Spreads:</strong> Access interbank spreads starting from 0.0 pips on major pairs</li>
                  <li><strong>No Dealing Desk:</strong> No conflict of interest — your broker doesn't trade against you</li>
                  <li><strong>Deep Liquidity:</strong> Orders filled from multiple liquidity providers for better pricing</li>
                  <li><strong>Transparent Pricing:</strong> See the order book depth with Level II pricing data</li>
                  <li><strong>Fast Execution:</strong> Direct market access with execution speeds under 100ms</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Internal Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <Link href="/best/low-spread-brokers" className="block">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" /> Lowest Spread Brokers →
                  </h3>
                  <p className="text-sm text-gray-500">Compare brokers with the tightest EUR/USD spreads in 2026</p>
                </Link>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <Link href="/best/beginner-brokers" className="block">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" /> Best Brokers for Beginners →
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
