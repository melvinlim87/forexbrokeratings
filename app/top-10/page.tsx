'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Shield, ArrowRight, Award, TrendingUp, ChevronDown, ChevronUp, CheckCircle2, HelpCircle, BookOpen, Scale, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTopBrokers } from '@/lib/brokers';

const SITE_URL = 'https://forexbrokeratings.netlify.app';
const MEDALS = ['🥇', '🥈', '🥉'];

const METHODOLOGY_CRITERIA = [
  { icon: ShieldCheck, label: 'Regulation & Safety', weight: '25%', description: 'Tier-1 licenses (FCA, ASIC, CySEC, MAS), fund segregation, investor compensation schemes.' },
  { icon: Scale, label: 'Trading Conditions', weight: '25%', description: 'Spreads, commissions, execution speed, slippage, and order types available.' },
  { icon: Zap, label: 'Platform & Technology', weight: '20%', description: 'Platform variety (MT4/MT5/cTrader/TradingView), mobile apps, charting tools, and API access.' },
  { icon: BookOpen, label: 'User Experience', weight: '15%', description: 'Account opening speed, deposit/withdrawal ease, educational resources, and customer support quality.' },
  { icon: CheckCircle2, label: 'Reputation & Reviews', weight: '15%', description: 'TrustPilot scores, Forex Peace Army ratings, Reddit sentiment, and complaint resolution rate.' },
];

const FAQS = [
  {
    question: 'How do you rank forex brokers?',
    answer: 'We evaluate brokers across five key dimensions: Regulation & Safety (25%), Trading Conditions (25%), Platform & Technology (20%), User Experience (15%), and Reputation & Reviews (15%). Each broker is scored independently, and the overall score determines ranking position. We update our rankings quarterly.',
  },
  {
    question: 'What should I look for when choosing a forex broker?',
    answer: 'Prioritize regulation first — look for brokers regulated by Tier-1 authorities like FCA (UK), ASIC (Australia), or CySEC (EU). Then compare spreads and commissions on your preferred trading pairs, check platform availability (MT4, MT5, cTrader), verify deposit/withdrawal methods, and read user reviews on third-party sites like TrustPilot.',
  },
  {
    question: 'Are higher-ranked brokers always better for me?',
    answer: 'Not necessarily. Our rankings reflect overall quality, but your ideal broker depends on your specific needs. If you\'re a US trader, regulation (CFTC/NFA) matters most. If you\'re a scalper, execution speed and raw spreads are critical. Beginners might prioritize educational resources and low minimum deposits. Use our comparison tool to find the best match for your trading style.',
  },
  {
    question: 'How often are these rankings updated?',
    answer: 'We review and update our broker rankings quarterly. However, we make immediate updates when brokers change their fee structure, lose or gain regulatory licenses, or receive significant negative regulatory actions. Each broker\'s "Last Updated" date is shown on its individual review page.',
  },
  {
    question: 'Do you earn commissions from these brokers?',
    answer: 'Yes, some links on our site are affiliate links, meaning we may earn a commission if you open an account through our links. This does NOT affect our rankings, scores, or reviews. Our scoring methodology is transparent and based on objective criteria. We never accept payment for higher rankings, and we clearly disclose all affiliate relationships.',
  },
];

export default function Top10Page() {
  const topBrokers = getTopBrokers(10);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // JSON-LD: ItemList for top 10
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Top 10 Forex Brokers 2026',
    description: 'Expert-ranked list of the best forex brokers based on regulation, trading conditions, platforms, and user reviews.',
    numberOfItems: topBrokers.length,
    itemListElement: topBrokers.map((broker, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'FinancialProduct',
        name: broker.name,
        description: broker.description.slice(0, 200),
        url: `${SITE_URL}/broker/${broker.slug}`,
        provider: {
          '@type': 'Organization',
          name: broker.name,
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: broker.rating,
          bestRating: 10,
          ratingCount: parseInt(broker.reviews.replace(/,/g, '')) || 100,
        },
      },
    })),
  };

  // JSON-LD: FAQPage
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  // JSON-LD: BreadcrumbList
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Top 10 Forex Brokers', item: `${SITE_URL}/top-10` },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Award className="h-4 w-4" />
            Updated March 2026
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Top 10 Forex Brokers of 2026
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our expert rankings based on regulation, trading conditions, platform quality, and user satisfaction. Independently reviewed and updated for 2026.
          </p>
        </div>

        {/* ── Methodology Section ── */}
        <Card className="mb-8 max-w-4xl mx-auto border-blue-200 dark:border-blue-800">
          <CardContent className="p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Why These Brokers?</h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Our rankings use a weighted scoring system across 5 core dimensions. Every broker is evaluated independently — we never accept payment for rankings. Data sources include regulatory databases, broker disclosures, independent spread monitoring, and verified user reviews.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {METHODOLOGY_CRITERIA.map(({ icon: Icon, label, weight, description }) => (
                <div key={label} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{label}</span>
                    <Badge variant="outline" className="text-[10px] ml-auto">{weight}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Rankings ── */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {topBrokers.map((broker, index) => {
            const isMedal = index < 3;
            const isExpanded = expandedId === broker.id;

            return (
              <Card
                key={broker.id}
                className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${
                  isMedal ? 'border-amber-200 dark:border-amber-800 shadow-md' : ''
                }`}
              >
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    {/* Rank / Medal */}
                    <div className={`flex-shrink-0 w-16 md:w-20 flex flex-col items-center justify-center ${
                      isMedal
                        ? 'bg-gradient-to-b from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-900/10'
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      {isMedal ? (
                        <span className="text-3xl md:text-4xl">{MEDALS[index]}</span>
                      ) : (
                        <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">#{index + 1}</span>
                      )}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-4 md:p-5">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Logo + Name */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="h-12 w-24 relative flex-shrink-0 bg-white dark:bg-gray-700 rounded-lg p-1">
                            <Image src={broker.logo} alt={broker.name} fill className="object-contain" unoptimized />
                          </div>
                          <div className="min-w-0">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">{broker.name}</h2>
                            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{broker.bestFor}</p>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2">
                          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                          <span className="text-lg font-bold text-amber-700 dark:text-amber-400">{broker.rating}</span>
                          <span className="text-xs text-amber-600 dark:text-amber-500">/10</span>
                        </div>

                        {/* Key Stats */}
                        <div className="hidden lg:flex items-center gap-5 text-sm text-gray-600 dark:text-gray-400">
                          <div>
                            <span className="block text-xs text-gray-400 uppercase">Min Deposit</span>
                            <span className="font-semibold text-gray-900 dark:text-white">${broker.minDeposit}</span>
                          </div>
                          <div>
                            <span className="block text-xs text-gray-400 uppercase">Spreads</span>
                            <span className="font-semibold text-gray-900 dark:text-white">{broker.spreads.split(';')[0]}</span>
                          </div>
                          <div>
                            <span className="block text-xs text-gray-400 uppercase">Instruments</span>
                            <span className="font-semibold text-gray-900 dark:text-white">{broker.tradingInstruments}+</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className="text-xs h-8" asChild>
                            <Link href={`/broker/${broker.slug}`}>Review</Link>
                          </Button>
                          <Button size="sm" className="text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white" asChild>
                            <a href={broker.affiliateUrl} target="_blank" rel="noopener noreferrer">
                              Visit <ArrowRight className="h-3 w-3 ml-1" />
                            </a>
                          </Button>
                        </div>
                      </div>

                      {/* Regulation Badges */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {broker.regulations.map(r => (
                          <Badge key={r} variant="outline" className="text-[10px] font-medium text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                            <Shield className="h-2.5 w-2.5 mr-0.5" />{r}
                          </Badge>
                        ))}
                      </div>

                      {/* Mobile stats */}
                      <div className="flex lg:hidden items-center gap-4 mt-3 text-xs text-gray-600 dark:text-gray-400">
                        <span>Min Deposit: <strong className="text-gray-900 dark:text-white">${broker.minDeposit}</strong></span>
                        <span>Spreads: <strong className="text-gray-900 dark:text-white">{broker.spreads.split(';')[0]}</strong></span>
                        <span>Instruments: <strong className="text-gray-900 dark:text-white">{broker.tradingInstruments}+</strong></span>
                      </div>

                      {/* Expandable Details */}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : broker.id)}
                        className="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {isExpanded ? 'Show less' : 'Show pros & cons'}
                      </button>

                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">Pros</h4>
                            <ul className="space-y-1">
                              {broker.pros.slice(0, 5).map((p, i) => (
                                <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                                  <span className="text-green-500 mt-0.5">✓</span> {p}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Cons</h4>
                            <ul className="space-y-1">
                              {broker.cons.slice(0, 5).map((c, i) => (
                                <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                                  <span className="text-red-500 mt-0.5">✗</span> {c}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* ── FAQ Section ── */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <Card key={i} className="overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900 dark:text-white pr-4">{faq.question}</span>
                  {openFaq === i ? (
                    <ChevronUp className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mt-3">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-2">Need help choosing?</h3>
            <p className="text-blue-100 text-sm mb-4">Use our interactive comparison tool to find the perfect broker for your trading style.</p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold" asChild>
              <Link href="/compare-tool">
                <TrendingUp className="h-4 w-4 mr-2" />
                Compare Brokers Now
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
