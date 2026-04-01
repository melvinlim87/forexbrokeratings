import { getTopBrokers } from '@/lib/brokers';

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Forex Broker Ratings',
    url: 'https://forexbrokeratings.netlify.app',
    logo: 'https://forexbrokeratings.netlify.app/logo.png',
    description: 'Independent forex broker reviews and ratings. Compare spreads, regulations, platforms and more across 50+ brokers.',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      availableLanguage: 'English',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Forex Broker Ratings',
    url: 'https://forexbrokeratings.netlify.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://forexbrokeratings.netlify.app/brokers?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BrokerListSchema() {
  const topBrokers = getTopBrokers(10);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best Forex Brokers 2026',
    description: 'Our expert-ranked list of the best forex brokers based on spreads, regulation, platforms, and user reviews.',
    numberOfItems: topBrokers.length,
    itemListElement: topBrokers.map((broker, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'FinancialProduct',
        name: broker.name,
        description: broker.description,
        url: `https://forexbrokeratings.netlify.app/brokers/${broker.slug}`,
        provider: {
          '@type': 'Organization',
          name: broker.name,
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: broker.rating,
          bestRating: 10,
          ratingCount: parseInt(broker.reviews.replace(/,/g, '')),
        },
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

export function FAQSchema({ faqs }: { faqs: { question: string; answer: string }[] }) {
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

export function ReviewSchema({ broker }: { broker: { name: string; slug: string; rating: number; description: string; reviews: string } }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    name: `${broker.name} Forex Broker Review`,
    reviewBody: broker.description,
    author: {
      '@type': 'Organization',
      name: 'Forex Broker Ratings',
      url: 'https://forexbrokeratings.netlify.app',
    },
    datePublished: '2026-03-01',
    dateModified: '2026-03-31',
    itemReviewed: {
      '@type': 'FinancialProduct',
      name: broker.name,
      url: `https://forexbrokeratings.netlify.app/broker/${broker.slug}`,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: broker.rating,
      bestRating: 10,
      worstRating: 1,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function HowToSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Choose the Best Forex Broker in 2026',
    description: 'A step-by-step guide to selecting a safe, reliable, and cost-effective forex broker based on regulation, fees, platforms, and more.',
    totalTime: 'PT15M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: '0',
    },
    tool: [
      { '@type': 'HowToTool', name: 'Forex Broker Ratings comparison tool' },
      { '@type': 'HowToTool', name: 'Regulatory database (FCA, ASIC, CySEC)' },
    ],
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Verify Regulation',
        text: 'Check that the broker is licensed by a Tier 1 regulator such as FCA (UK), ASIC (Australia), CySEC (EU), or CFTC/NFA (US). Verify the license number directly on the regulator\'s website.',
        url: 'https://forexbrokeratings.netlify.app/methodology',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Compare Trading Costs',
        text: 'Evaluate spreads, commissions, swap rates, and any hidden fees. Raw spread accounts (ECN) typically offer lower costs but charge a commission per lot.',
        url: 'https://forexbrokeratings.netlify.app/best/low-spread-brokers',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Test the Platform',
        text: 'Open a demo account to test the broker\'s trading platform (MT4, MT5, cTrader, or proprietary). Check execution speed, charting tools, and order types.',
        url: 'https://forexbrokeratings.netlify.app/category/mt4',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Check Available Instruments',
        text: 'Ensure the broker offers the currency pairs, commodities, indices, and crypto markets you want to trade.',
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Read User Reviews',
        text: 'Check TrustPilot, Forex Peace Army, and Reddit for real trader experiences. Look for patterns in complaints about withdrawals or execution.',
      },
      {
        '@type': 'HowToStep',
        position: 6,
        name: 'Compare & Decide',
        text: 'Use our side-by-side comparison tool to evaluate your shortlisted brokers across all criteria, then choose the one that best fits your trading style.',
        url: 'https://forexbrokeratings.netlify.app/compare-tool',
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
