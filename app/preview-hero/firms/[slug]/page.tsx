// Prop firm in-depth review page — /preview-hero/firms/[slug]/
//
// SEO: generates rich metadata (title, description, OG, keywords) from the
// per-firm rich JSON + JSON-LD structured data (Review, AggregateRating,
// FinancialService, FAQPage) for Google rich snippets.

import * as fs from 'fs';
import * as path from 'path';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import PropFirmReview from '../../_components/PropFirmReview';
import generatedPropFirmsJson from '../../_data/generated/prop-firms.json';

const SITE_NAME  = 'ForexBrokerRatings';
const SITE_URL   = process.env.NEXT_PUBLIC_SITE_URL || 'https://forexbrokeratings.com';
const YEAR       = new Date().getFullYear();

type HeroFirm = {
  slug: string;
  name: string;
  logo: string | null;
  logoColor: string;
  rating: number;
  evaluationModel: string;
  accountSizes: number[];
  pricing: Record<string, { standard: number; discounted: number; additionalRebate: number }>;
  profitSplit: string;
  lastVerified: string;
  popularityRank: number;
  headquarters: string | null;
  founded: string | null;
  affiliateUrl: string | null;
};

const ALL_FIRMS = (generatedPropFirmsJson as { propFirms: HeroFirm[] }).propFirms;

/* ------------------------------------------------------------------ */
/* Data loaders                                                         */
/* ------------------------------------------------------------------ */

function loadRichFirm(slug: string): Record<string, unknown> | null {
  try {
    const file = path.join(
      process.cwd(), 'app', 'preview-hero', '_data', 'generated', 'prop-firms-rich', `${slug}.json`
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

function buildDescription(firm: HeroFirm, rich: Record<string, unknown> | null): string {
  const desc = typeof rich?.description === 'string' ? rich.description
             : typeof rich?.summary === 'string'     ? rich.summary
             : '';
  if (desc.length > 80) {
    return desc.slice(0, 155).trimEnd() + (desc.length > 155 ? '…' : '');
  }
  const split   = firm.profitSplit ?? 'up to 90%';
  const model   = firm.evaluationModel ?? 'evaluation';
  const sizes   = firm.accountSizes?.length > 0
    ? `$${Math.min(...firm.accountSizes).toLocaleString()}–$${Math.max(...firm.accountSizes).toLocaleString()}`
    : '';
  return `${firm.name} prop firm review ${YEAR}: ${model} model, ${split} profit split${sizes ? `, accounts from ${sizes}` : ''}. Full challenge rules, payouts & expert analysis.`.slice(0, 160);
}

function buildKeywords(firm: HeroFirm): string {
  const n = firm.name;
  const parts = [
    `${n} review`,
    `${n} review ${YEAR}`,
    `${n} prop firm`,
    `${n} challenge`,
    `${n} profit split`,
    `${n} payout`,
    `is ${n} legit`,
    `${n} rules`,
    `best prop trading firm ${YEAR}`,
    `funded trader review`,
    `prop firm review ${YEAR}`,
  ];
  if (firm.headquarters) parts.push(`${n} ${firm.headquarters}`);
  return parts.join(', ');
}

function buildJsonLd(firm: HeroFirm, rich: Record<string, unknown> | null): object {
  const url  = `${SITE_URL}/firms/${firm.slug}/`;
  const desc = buildDescription(firm, rich);
  const faqs = (rich?.faqData as Array<{ question?: string; answer?: string }> | undefined)
            ?? (rich?.faq   as Array<{ question?: string; answer?: string }> | undefined)
            ?? [];

  const trustData = rich?.trust_and_credibility as any;
  const tpRating  = trustData?.trustpilot_score ?? (rich?.userReviewsData as any)?.trustpilot?.rating;
  const tpCount   = trustData?.trustpilot_review_count ?? (rich?.userReviewsData as any)?.trustpilot?.reviews;

  const graph: object[] = [
    /* Organisation */
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
    },

    /* Prop firm as a FinancialService */
    {
      '@type': 'FinancialService',
      '@id': url,
      name: firm.name,
      description: desc,
      url: firm.affiliateUrl ?? undefined,
      foundingDate: firm.founded ?? undefined,
      areaServed: 'Worldwide',
      ...(tpRating && tpCount && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: String(tpRating),
          reviewCount: String(tpCount),
          bestRating: '5',
          worstRating: '1',
        },
      }),
    },

    /* Our editorial Review */
    {
      '@type': 'Review',
      '@id': `${url}#review`,
      name: `${firm.name} Review ${YEAR}`,
      description: desc,
      datePublished: firm.lastVerified,
      dateModified:  firm.lastVerified,
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
        ratingValue: String(firm.rating.toFixed(1)),
        bestRating: '10',
        worstRating: '1',
      },
    },

    /* BreadcrumbList */
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home',       item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Prop Firms', item: `${SITE_URL}/firms/` },
        { '@type': 'ListItem', position: 3, name: `${firm.name} Review`, item: url },
      ],
    },
  ];

  /* FAQPage schema — generates expandable FAQ rich snippets in Google */
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
  return ALL_FIRMS.filter((f) => f.rating > 0 && f.accountSizes?.length > 0).map((f) => ({
    slug: f.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const firm = ALL_FIRMS.find((f) => f.slug === params.slug);
  if (!firm) return { title: 'Prop firm not found' };

  const rich  = loadRichFirm(params.slug);
  const title = `${firm.name} Review ${YEAR} — Challenge Rules, Payouts & Full Analysis`;
  const desc  = buildDescription(firm, rich);
  const url   = `${SITE_URL}/firms/${firm.slug}/`;

  return {
    title,
    description: desc,
    keywords: buildKeywords(firm),
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    openGraph: {
      title,
      description: desc,
      url,
      siteName: SITE_NAME,
      type: 'article',
      publishedTime: firm.lastVerified,
      modifiedTime:  firm.lastVerified,
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

export default function PropFirmReviewPage({ params }: { params: { slug: string } }) {
  const summary = ALL_FIRMS.find((f) => f.slug === params.slug);
  if (!summary) notFound();

  const rich   = loadRichFirm(params.slug);
  const jsonLd = buildJsonLd(summary, rich);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PropFirmReview summary={summary} rich={rich} />
    </>
  );
}
