import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Award, TrendingUp, CheckCircle, AlertTriangle, ChevronRight, ExternalLink, Star, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { brokers } from '@/lib/brokers';
import { countries, getCountryBySlug, getAllCountrySlugs } from '@/lib/countries';
import BrokerCard from '@/components/broker-card';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllCountrySlugs().map(slug => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const country = getCountryBySlug(params.slug);
  if (!country) return {};

  return {
    title: country.metaTitle,
    description: country.metaDescription,
    keywords: `best forex brokers ${country.name}, ${country.regulator} regulated brokers, forex trading ${country.name} 2026`,
    alternates: {
      canonical: `/country/${country.slug}`,
    },
    openGraph: {
      title: country.metaTitle,
      description: country.metaDescription,
      url: `/country/${country.slug}`,
    },
  };
}

export default function CountryPage({ params }: PageProps) {
  const country = getCountryBySlug(params.slug);
  if (!country) notFound();

  // Filter brokers that serve this country
  const countryBrokers = brokers.filter(country.brokerFilter).sort((a, b) => b.rating - a.rating);
  const topBrokers = countryBrokers.slice(0, 10);

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Best Forex Brokers in ${country.name}`,
    description: country.metaDescription,
    url: `https://forexbrokeratings.netlify.app/country/${country.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: topBrokers.map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'FinancialProduct',
          name: b.name,
          url: `https://forexbrokeratings.netlify.app/broker/${b.slug}`,
        },
      })),
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the best forex broker in ${country.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: topBrokers.length > 0
            ? `Based on our analysis, ${topBrokers[0].name} is the top-rated forex broker available in ${country.name} with a ${topBrokers[0].rating}/10 rating. ${topBrokers[0].bestFor}.`
            : `Several quality forex brokers serve ${country.name}. See our full rankings for detailed comparisons.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is forex trading legal in ${country.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes, forex trading is legal in ${country.name} when conducted through ${country.regulator}-regulated brokers. Always verify a broker's regulatory status before opening an account.`,
        },
      },
      {
        '@type': 'Question',
        name: `Which regulator oversees forex brokers in ${country.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${country.regulatorFull} (${country.regulator}) is the primary regulator overseeing forex brokers in ${country.name}. ${country.regulator} is considered a ${country.regulator === 'CFTC/NFA' || country.regulator === 'FCA' || country.regulator === 'ASIC' || country.regulator === 'MAS' ? 'Tier 1 (highest level)' : 'Tier 2 (strong)'} regulator.`,
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16">
          <div className="container mx-auto px-4">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/brokers" className="hover:text-white transition-colors">Brokers</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white">{country.name}</span>
            </nav>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-6xl">{country.flag}</span>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold">
                  Best Forex Brokers in {country.name}
                </h1>
                <p className="text-xl text-slate-300 mt-2">
                  {topBrokers.length} {country.regulator}-regulated brokers reviewed & ranked for 2026
                </p>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <Shield className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                <div className="text-sm font-semibold">{country.regulator} Regulated</div>
                <div className="text-xs text-slate-400">{country.regulatorFull}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <Award className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                <div className="text-sm font-semibold">{topBrokers.length} Brokers</div>
                <div className="text-xs text-slate-400">Independently rated</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <TrendingUp className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-sm font-semibold">200+ Data Points</div>
                <div className="text-xs text-slate-400">Per broker analysis</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-sm font-semibold">Updated March 2026</div>
                <div className="text-xs text-slate-400">Fresh data quarterly</div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {/* Introduction */}
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {country.description}
            </p>
          </div>

          {/* Key Points */}
          <Card className="max-w-4xl mx-auto mb-12 border-emerald-200 dark:border-emerald-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-600" />
                Key Facts About Forex Trading in {country.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {country.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Broker Rankings */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-2">
              Top {country.regulator}-Regulated Brokers in {country.name}
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
              Ranked by our proprietary 200-point analysis methodology
            </p>

            {topBrokers.length > 0 ? (
              <div className="space-y-4 max-w-5xl mx-auto">
                {topBrokers.map((broker, index) => (
                  <BrokerCard key={broker.id} broker={broker} rank={index + 1} />
                ))}
              </div>
            ) : (
              <Card className="max-w-2xl mx-auto text-center p-8">
                <p className="text-gray-600 dark:text-gray-400">
                  We're currently reviewing brokers that serve {country.name}. Check back soon for our expert rankings.
                </p>
              </Card>
            )}
          </section>

          {/* Legal Note */}
          <Card className="max-w-4xl mx-auto mb-12 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">
                    Regulatory Notice for {country.name}
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    {country.legalNote}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <section className="max-w-4xl mx-auto mb-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What is the best forex broker in {country.name}?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    {topBrokers.length > 0 ? (
                      <>
                        Based on our analysis, <strong>{topBrokers[0].name}</strong> is the top-rated {country.regulator}-regulated broker available in {country.name} with a {topBrokers[0].rating}/10 rating. {topBrokers[0].bestFor}.
                        {topBrokers.length > 1 && (
                          <> Other strong options include <strong>{topBrokers[1].name}</strong> ({topBrokers[1].rating}/10) and <strong>{topBrokers[2]?.name}</strong> ({topBrokers[2]?.rating}/10).</>
                        )}
                      </>
                    ) : (
                      `We are currently reviewing brokers available in ${country.name}. Check our main broker listings for options.`
                    )}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is forex trading legal in {country.name}?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    Yes, forex trading is legal in {country.name} when conducted through {country.regulator}-regulated brokers. The {country.regulatorFull} oversees all forex brokers operating in the country. Always verify a broker's regulatory status before opening an account.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How do I verify a broker's {country.regulator} regulation?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    Visit the official {country.regulatorFull} website and search for the broker's license number. On our broker review pages, we list each broker's verified license numbers and entity registrations. Never trade with a broker that cannot provide a verifiable license number.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Other Countries */}
          <section className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Browse Brokers by Country</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {countries.map(c => (
                <Link
                  key={c.slug}
                  href={`/country/${c.slug}`}
                  className={`flex items-center gap-2 p-4 rounded-xl border transition-all hover:shadow-md ${
                    c.slug === country.slug
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                  }`}
                >
                  <span className="text-2xl">{c.flag}</span>
                  <div>
                    <div className="font-medium text-sm">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.regulator}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
