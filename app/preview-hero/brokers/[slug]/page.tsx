// Broker in-depth review page — /preview-hero/brokers/[slug]/
//
// SEO: generates rich metadata (title, description, OG, keywords) from the
// per-broker rich JSON + JSON-LD structured data (Review, AggregateRating,
// FinancialService, FAQPage) for Google rich snippets.

import * as fs from 'fs';
import * as path from 'path';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import BrokerReview from '../../_components/BrokerReview';
import generatedBrokersJson from '../../_data/generated/brokers.json';

const SITE_NAME  = 'ForexBrokerRatings';
const SITE_URL   = process.env.NEXT_PUBLIC_SITE_URL || 'https://forexbrokeratings.com';
const YEAR       = new Date().getFullYear();

type HeroBroker = {
  slug: string;
  name: string;
  logo: string | null;
  logoColor: string;
  rating: number;
  minDeposit: number;
  jurisdictions: string[];
  jurisdictionIds: string[];
  platforms: string[];
  accountTypes: string[];
  defaultAccountType: string;
  rebateRates: Array<{ accountType: string; instrumentClass: string; ratePerLot: number; _synthesized?: boolean }>;
  lastVerified: string;
  popularityRank: number;
  headquarters: string | null;
  founded: string | null;
  affiliateUrl: string | null;
};

const ALL_BROKERS = (generatedBrokersJson as { brokers: HeroBroker[] }).brokers;

/* ------------------------------------------------------------------ */
/* Data loaders                                                         */
/* ------------------------------------------------------------------ */

function loadRichBroker(slug: string): Record<string, unknown> | null {
  try {
    const file = path.join(
      process.cwd(), 'app', 'preview-hero', '_data', 'generated', 'brokers-rich', `${slug}.json`
    );
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* SEO helpers                                                          */
/* ------------------------------------------------------------------ */

function buildDescription(broker: HeroBroker, rich: Record<string, unknown> | null): string {
  // Use the rich description if present and meaningful
  const desc = typeof rich?.description === 'string' ? rich.description : '';
  if (desc.length > 80) {
    return desc.slice(0, 155).trimEnd() + (desc.length > 155 ? '…' : '');
  }
  // Derive from data
  const regCount = broker.jurisdictions.length;
  const minDep = broker.minDeposit === 0 ? 'no minimum deposit' : `$${broker.minDeposit} minimum deposit`;
  const platforms = broker.platforms.slice(0, 3).join(', ') || 'MT4/MT5';
  return `${broker.name} review ${YEAR}: regulated by ${regCount} jurisdiction${regCount !== 1 ? 's' : ''}, ${minDep}, ${platforms}. Full cashback rates, regulation details & expert analysis.`.slice(0, 160);
}

function buildKeywords(broker: HeroBroker): string {
  const n = broker.name;
  const parts = [
    `${n} review`,
    `${n} review ${YEAR}`,
    `${n} cashback`,
    `${n} rebate`,
    `${n} regulation`,
    `${n} spreads`,
    `${n} minimum deposit`,
    `is ${n} legit`,
    `${n} trading platform`,
    `best forex broker cashback`,
    `forex broker review ${YEAR}`,
  ];
  if (broker.headquarters) parts.push(`${n} ${broker.headquarters}`);
  return parts.join(', ');
}

function buildJsonLd(broker: HeroBroker, rich: Record<string, unknown> | null): object {
  const url     = `${SITE_URL}/brokers/${broker.slug}/`;
  const desc    = buildDescription(broker, rich);
  const faqs    = (rich?.faqData as Array<{ question?: string; answer?: string }> | undefined) ?? [];
  const regs    = (rich?.entityRegulations as Array<{ regulator?: string }> | undefined) ?? [];
  const reviews = rich?.userReviewsData as any;

  const graph: object[] = [
    /* Organisation */
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
    },

    /* The broker as a FinancialService */
    {
      '@type': 'FinancialService',
      '@id': url,
      name: broker.name,
      description: desc,
      url: broker.affiliateUrl ?? undefined,
      foundingDate: broker.founded ?? undefined,
      areaServed: 'Worldwide',
      ...(regs.length > 0 && {
        knowsAbout: regs.map((r) => r.regulator).filter(Boolean),
      }),
      ...(reviews?.trustpilot?.rating && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: String(reviews.trustpilot.rating),
          reviewCount: String(reviews.trustpilot.reviews ?? 0),
          bestRating: '5',
          worstRating: '1',
        },
      }),
    },

    /* Our editorial Review */
    {
      '@type': 'Review',
      '@id': `${url}#review`,
      name: `${broker.name} Review ${YEAR}`,
      description: desc,
      datePublished: broker.lastVerified,
      dateModified: broker.lastVerified,
      author: {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
      },
      publisher: {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
      },
      itemReviewed: { '@id': url },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: String(broker.rating.toFixed(1)),
        bestRating: '10',
        worstRating: '1',
      },
    },

    /* BreadcrumbList */
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home',    item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Brokers', item: `${SITE_URL}/brokers/` },
        { '@type': 'ListItem', position: 3, name: `${broker.name} Review`, item: url },
      ],
    },
  ];

  /* FAQPage — generates rich FAQ snippets in Google SERP */
  if (faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.question ?? '',
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer ?? '',
        },
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

/* ------------------------------------------------------------------ */
/* Next.js exports                                                      */
/* ------------------------------------------------------------------ */

export function generateStaticParams() {
  return ALL_BROKERS.filter((b) => b.rating > 0 && b.accountTypes?.length > 0).map((b) => ({
    slug: b.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const broker = ALL_BROKERS.find((b) => b.slug === params.slug);
  if (!broker) return { title: 'Broker not found' };

  const rich  = loadRichBroker(params.slug);
  const title = `${broker.name} Review ${YEAR} — Cashback Rates, Regulation & Full Analysis`;
  const desc  = buildDescription(broker, rich);
  const url   = `${SITE_URL}/brokers/${broker.slug}/`;

  return {
    title,
    description: desc,
    keywords: buildKeywords(broker),
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    openGraph: {
      title,
      description: desc,
      url,
      siteName: SITE_NAME,
      type: 'article',
      publishedTime: broker.lastVerified,
      modifiedTime:  broker.lastVerified,
    },
    twitter: {
      card: 'summary',
      title,
      description: desc,
    },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

export default function BrokerReviewPage({ params }: { params: { slug: string } }) {
  const summary = ALL_BROKERS.find((b) => b.slug === params.slug);
  if (!summary) notFound();

  const rich   = loadRichBroker(params.slug);
  const jsonLd = buildJsonLd(summary, rich);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BrokerReview summary={summary} rich={rich} />
    </>
  );
}
