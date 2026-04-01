import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Shield, GraduationCap, ExternalLink, Zap, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTopBrokers } from '@/lib/brokers';

export const metadata: Metadata = {
  title: 'Best Forex Brokers for Beginners 2026 | Top 10 Starter Brokers',
  description: 'Start forex trading with the best beginner-friendly brokers in 2026. Low deposits, demo accounts, educational resources, and easy-to-use platforms.',
  openGraph: {
    title: 'Best Forex Brokers for Beginners 2026 | Top 10 Starter Brokers',
    description: 'Start forex trading with the best beginner-friendly brokers. Low deposits, demo accounts, and educational resources.',
    type: 'website',
  },
};

function getBeginnerBrokers() {
  const allBrokers = getTopBrokers(81);
  return allBrokers
    .filter(b => b.minDeposit < 100 && b.rating > 7)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);
}

export default function BeginnerBrokersPage() {
  const brokers = getBeginnerBrokers();

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best Forex Brokers for Beginners 2026',
    description: 'Top 10 beginner-friendly forex brokers ranked by rating, minimum deposit, and educational resources.',
    numberOfItems: brokers.length,
    itemListElement: brokers.map((broker, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'FinancialProduct',
        name: broker.name,
        url: `https://forexbrokeratings.netlify.app/brokers/${broker.slug}`,
        description: `${broker.bestFor} — Min deposit: $${broker.minDeposit}`,
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
              <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                <GraduationCap className="h-3 w-3 mr-1" /> Beginner Friendly
              </Badge>
              <Badge variant="outline">Updated March 2026</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Best Forex Brokers for Beginners 2026
            </h1>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Starting your forex trading journey can be overwhelming — choosing the right broker is one of the most 
                important decisions you'll make. The best beginner-friendly brokers combine low minimum deposits (so you 
                can start small and learn without risking significant capital), intuitive trading platforms, comprehensive 
                educational resources, and responsive customer support. In this ranking, we've identified the top 10 forex 
                brokers for beginners in 2026, filtering for brokers with minimum deposits under $100 and expert ratings 
                above 7/10. These brokers offer demo accounts for risk-free practice, step-by-step tutorials, webinars, 
                and the regulatory protection beginners need for peace of mind. Whether you're completely new to trading 
                or transitioning from a demo account to live trading, these brokers provide the ideal environment to build 
                your skills and confidence.
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card><CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{brokers.length}</div>
              <div className="text-sm text-gray-500">Beginner Brokers</div>
            </CardContent></Card>
            <Card><CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                ${Math.min(...brokers.map(b => b.minDeposit))}
              </div>
              <div className="text-sm text-gray-500">Lowest Min Deposit</div>
            </CardContent></Card>
            <Card><CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">
                {Math.max(...brokers.map(b => b.rating))}
              </div>
              <div className="text-sm text-gray-500">Highest Rating</div>
            </CardContent></Card>
          </div>

          {/* Broker Rankings */}
          <div className="space-y-4 mb-12">
            {brokers.map((broker, index) => (
              <Card key={broker.id} className={`hover:shadow-lg transition-all duration-200 ${index === 0 ? 'ring-2 ring-purple-500/30 shadow-md' : ''}`}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Rank */}
                    <div className="flex items-center gap-3 md:w-16 flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                        index === 0 ? 'bg-gradient-to-br from-purple-400 to-purple-600 text-white' :
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
                        <Link href={`/brokers/${broker.slug}`} className="font-bold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                          {broker.name}
                        </Link>
                        <div className="text-xs text-gray-500">{broker.bestFor}</div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 md:w-28 flex-shrink-0">
                      <div className="flex items-center gap-1 bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 rounded-lg">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-gray-900 dark:text-white">{broker.rating}</span>
                        <span className="text-xs text-gray-500">/10</span>
                      </div>
                    </div>

                    {/* Key Stats */}
                    <div className="flex-1 grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                          ${broker.minDeposit}
                        </div>
                        <div className="text-xs text-gray-500">Min Deposit</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {broker.avgSpreadEurUsd !== undefined ? `${broker.avgSpreadEurUsd} pips` : 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">EUR/USD Spread</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {broker.platforms?.slice(0, 2).join(', ') || 'MT4/MT5'}
                        </div>
                        <div className="text-xs text-gray-500">Platforms</div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex gap-2 md:flex-shrink-0">
                      <Button asChild size="sm" className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                        <a href={broker.affiliateUrl} target="_blank" rel="noopener noreferrer">
                          Start Trading <ExternalLink className="ml-1 h-3 w-3" />
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Choose a Forex Broker as a Beginner</h2>
              <div className="prose prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                <p>
                  Choosing your first forex broker is a critical step. The wrong choice can lead to unnecessary losses, 
                  poor trading conditions, or even fraud. Here's what beginners should prioritize:
                </p>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">Essential Features for Beginners</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Low Minimum Deposit:</strong> Start with $10–$50 so you can learn without risking significant capital</li>
                  <li><strong>Demo Account:</strong> Practice with virtual money before trading real funds</li>
                  <li><strong>Strong Regulation:</strong> Choose brokers regulated by FCA, ASIC, CySEC, or equivalent Tier-1 authorities</li>
                  <li><strong>Educational Resources:</strong> Look for webinars, courses, video tutorials, and market analysis</li>
                  <li><strong>User-Friendly Platform:</strong> An intuitive interface reduces the learning curve</li>
                  <li><strong>Responsive Support:</strong> 24/5 live chat support in your language helps when you're stuck</li>
                </ul>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">Beginner Mistakes to Avoid</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Starting with too much capital before you understand the risks</li>
                  <li>Choosing an unregulated broker for higher leverage or bonuses</li>
                  <li>Ignoring risk management (always use stop-loss orders)</li>
                  <li>Skipping the demo account and going straight to live trading</li>
                </ul>
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
                <Link href="/best/low-spread-brokers" className="block">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-green-500" /> Lowest Spread Brokers →
                  </h3>
                  <p className="text-sm text-gray-500">Compare brokers with the tightest EUR/USD spreads in 2026</p>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
