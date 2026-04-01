interface BrokerSchemaProps {
  broker: {
    name: string;
    slug: string;
    rating: number;
    description: string;
    reviews: string;
    founded: string;
    logo: string;
    regulations: string[];
    spreads: string;
    minDeposit: number;
    affiliateUrl: string;
    platforms: string[];
    leverage: string;
    tradingInstruments: number;
    pros: string[];
    cons: string[];
    faqData?: Array<{ question: string; answer: string }>;
  };
}

const SITE_URL = 'https://forexbrokeratings.netlify.app';

export function BrokerReviewSchema({ broker }: BrokerSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    name: `${broker.name} Forex Broker Review 2026`,
    reviewBody: broker.description.slice(0, 500),
    author: {
      '@type': 'Organization',
      name: 'Forex Broker Ratings',
      url: SITE_URL,
    },
    datePublished: '2026-01-15',
    dateModified: '2026-03-31',
    itemReviewed: {
      '@type': 'FinancialProduct',
      name: `${broker.name} Forex Trading`,
      description: broker.description.slice(0, 200),
      url: broker.affiliateUrl,
      provider: {
        '@type': 'Organization',
        name: broker.name,
        foundingDate: broker.founded,
        url: broker.affiliateUrl,
      },
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: broker.rating,
      bestRating: 10,
      worstRating: 1,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Forex Broker Ratings',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BrokerFAQSchema({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BrokerBreadcrumbSchema({ brokerName, brokerSlug }: { brokerName: string; brokerSlug: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Forex Brokers',
        item: `${SITE_URL}/brokers`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${brokerName} Review`,
        item: `${SITE_URL}/broker/${brokerSlug}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BrokerProductSchema({ broker }: BrokerSchemaProps) {
  const reviewCount = parseInt(broker.reviews.replace(/,/g, '')) || 100;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: `${broker.name} Forex Trading`,
    description: broker.description.slice(0, 300),
    url: `${SITE_URL}/broker/${broker.slug}`,
    provider: {
      '@type': 'Organization',
      name: broker.name,
      url: broker.affiliateUrl,
      foundingDate: broker.founded,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: broker.rating,
      bestRating: 10,
      worstRating: 1,
      ratingCount: reviewCount,
      reviewCount: reviewCount,
    },
    offers: {
      '@type': 'Offer',
      price: broker.minDeposit,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: broker.affiliateUrl,
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Spreads', value: broker.spreads },
      { '@type': 'PropertyValue', name: 'Leverage', value: broker.leverage },
      { '@type': 'PropertyValue', name: 'Platforms', value: broker.platforms.join(', ') },
      { '@type': 'PropertyValue', name: 'Regulation', value: broker.regulations.join(', ') },
      { '@type': 'PropertyValue', name: 'Instruments', value: `${broker.tradingInstruments}+` },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * All-in-one broker schema component. Renders Review + BreadcrumbList + FAQPage + FinancialProduct JSON-LD.
 */
export default function BrokerSchema({ broker }: BrokerSchemaProps) {
  return (
    <>
      <BrokerReviewSchema broker={broker} />
      <BrokerBreadcrumbSchema brokerName={broker.name} brokerSlug={broker.slug} />
      <BrokerProductSchema broker={broker} />
      {broker.faqData && broker.faqData.length > 0 && (
        <BrokerFAQSchema faqs={broker.faqData} />
      )}
    </>
  );
}
