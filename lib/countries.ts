// Country-specific broker data for SEO landing pages
// Inspired by ForexBrokers.com country pages

export interface CountryData {
  slug: string;
  name: string;
  flag: string;
  regulator: string;
  regulatorFull: string;
  description: string;
  keyPoints: string[];
  legalNote: string;
  brokerFilter: (broker: any) => boolean;
  metaTitle: string;
  metaDescription: string;
}

export const countries: CountryData[] = [
  {
    slug: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    regulator: 'ASIC',
    regulatorFull: 'Australian Securities and Investments Commission',
    description: 'Australia is one of the world\'s largest retail forex markets, regulated by ASIC (Australian Securities and Investments Commission). ASIC-regulated brokers must meet strict capital requirements, maintain segregated client funds, and adhere to responsible lending obligations. Since 2021, ASIC has capped leverage at 30:1 for major forex pairs for retail clients.',
    keyPoints: [
      'ASIC regulation is considered Tier 1 — among the strongest globally',
      'Client funds must be held in segregated trust accounts at Australian banks',
      'Maximum retail leverage: 30:1 (major forex), 20:1 (minor forex)',
      'AFCA (Australian Financial Complaints Authority) provides free dispute resolution',
      'Negative balance protection is mandatory for retail clients',
    ],
    legalNote: 'ASIC-regulated brokers must hold an Australian Financial Services License (AFSL). Always verify a broker\'s AFSL number on ASIC\'s professional register before opening an account.',
    brokerFilter: (b: any) => b.regulations?.some((r: string) => r.includes('ASIC')) || b.entityRegulations?.some((e: any) => e.country === 'AU' || e.country === 'Australia'),
    metaTitle: 'Best ASIC-Regulated Forex Brokers in Australia 2026 | ForexBrokerRatings',
    metaDescription: 'Compare the top ASIC-regulated forex brokers available to Australian traders in 2026. Expert reviews, verified AFSL numbers, and side-by-side comparisons.',
  },
  {
    slug: 'united-kingdom',
    name: 'United Kingdom',
    flag: '🇬🇧',
    regulator: 'FCA',
    regulatorFull: 'Financial Conduct Authority',
    description: 'The United Kingdom is the global center of forex trading, with London accounting for ~43% of all daily forex volume. The FCA (Financial Conduct Authority) is widely regarded as the gold standard of financial regulation. FCA-regulated brokers must maintain minimum capital of £1 million, hold client funds in segregated accounts at approved banks, and participate in the FSCS compensation scheme protecting up to £85,000 per client.',
    keyPoints: [
      'FCA regulation is the global gold standard — strictest consumer protections',
      'FSCS protection: up to £85,000 compensation if a broker fails',
      'Maximum retail leverage: 30:1 (major forex), 20:1 (minor forex)',
      'Spread betting is tax-free for UK residents (no Capital Gains Tax)',
      'Client money rules require segregation at Tier 1 UK banks',
    ],
    legalNote: 'All FCA-regulated brokers appear on the FCA Financial Services Register. UK residents should verify a broker\'s FRN (Firm Reference Number) before trading. Spread betting profits are tax-free in the UK.',
    brokerFilter: (b: any) => b.regulations?.some((r: string) => r.includes('FCA')) || b.entityRegulations?.some((e: any) => e.country === 'GB' || e.country === 'United Kingdom'),
    metaTitle: 'Best FCA-Regulated Forex Brokers in the UK 2026 | ForexBrokerRatings',
    metaDescription: 'Compare the top FCA-regulated forex brokers for UK traders in 2026. FSCS protection, spread betting options, and expert reviews with verified FRN numbers.',
  },
  {
    slug: 'united-states',
    name: 'United States',
    flag: '🇺🇸',
    regulator: 'CFTC/NFA',
    regulatorFull: 'Commodity Futures Trading Commission / National Futures Association',
    description: 'The United States has the most restrictive forex regulatory environment globally. Only brokers registered with the CFTC (Commodity Futures Trading Commission) and members of the NFA (National Futures Association) can offer retail forex trading to US residents. As of 2026, fewer than 5 brokers hold active CFTC registration for retail forex. US traders face FIFO (First In, First Out) rules, no hedging, and maximum leverage of 50:1 for major pairs.',
    keyPoints: [
      'CFTC/NFA regulation is extremely strict — very few brokers qualify',
      'Maximum retail leverage: 50:1 (major forex), 20:1 (minor forex)',
      'FIFO rule applies: positions must be closed in the order they were opened',
      'No hedging allowed: cannot hold long and short positions simultaneously',
      'US brokers must maintain minimum net capital of $20 million',
    ],
    legalNote: 'Only CFTC-registered, NFA-member brokers may accept US residents for retail forex trading. Using an offshore broker as a US resident may violate CFTC regulations. Always verify NFA membership on NFA BASIC.',
    brokerFilter: (b: any) => b.regulations?.some((r: string) => r.includes('CFTC') || r.includes('NFA') || r.includes('US')) || b.entityRegulations?.some((e: any) => e.country === 'US' || e.country === 'United States'),
    metaTitle: 'Best CFTC-Regulated Forex Brokers for US Traders 2026 | ForexBrokerRatings',
    metaDescription: 'Find the best CFTC/NFA-regulated forex brokers accepting US clients in 2026. Very few brokers qualify — see which ones made our expert list.',
  },
  {
    slug: 'singapore',
    name: 'Singapore',
    flag: '🇸🇬',
    regulator: 'MAS',
    regulatorFull: 'Monetary Authority of Singapore',
    description: 'Singapore is Asia\'s largest forex trading hub and a global financial center. The MAS (Monetary Authority of Singapore) regulates forex brokers under the Securities and Futures Act. MAS-regulated brokers must hold a Capital Markets Services (CMS) license and meet strict capital adequacy requirements. Singapore-based traders benefit from the absence of capital gains tax on forex trading profits.',
    keyPoints: [
      'MAS regulation is Tier 1 — among the most respected in Asia',
      'No capital gains tax on forex trading profits in Singapore',
      'CMS license required for offering leveraged forex trading',
      'Client funds must be segregated from broker operating funds',
      'MAS maintains strict advertising and disclosure rules for brokers',
    ],
    legalNote: 'Verify a broker\'s MAS CMS license number on the MAS Financial Institutions Directory before opening an account. Only trade with MAS-licensed or exempt entities.',
    brokerFilter: (b: any) => b.regulations?.some((r: string) => r.includes('MAS')) || b.entityRegulations?.some((e: any) => e.country === 'SG' || e.country === 'Singapore'),
    metaTitle: 'Best MAS-Regulated Forex Brokers in Singapore 2026 | ForexBrokerRatings',
    metaDescription: 'Compare top MAS-regulated forex brokers for Singapore traders in 2026. Verified CMS licenses, no capital gains tax advantages, and expert reviews.',
  },
  {
    slug: 'south-africa',
    name: 'South Africa',
    flag: '🇿🇦',
    regulator: 'FSCA',
    regulatorFull: 'Financial Sector Conduct Authority',
    description: 'South Africa has emerged as Africa\'s largest retail forex market, regulated by the FSCA (Financial Sector Conduct Authority). The FSCA replaced the previous Financial Services Board (FSB) in 2018 and oversees all financial services providers including forex brokers. South African traders benefit from a growing ecosystem of locally-regulated brokers combined with access to international FCA/CySEC-regulated firms.',
    keyPoints: [
      'FSCA regulation is the primary oversight body for forex brokers in South Africa',
      'Brokers must hold an FSP (Financial Services Provider) license',
      'Maximum retail leverage varies by broker — typically up to 500:1',
      'South African Rand (ZAR) accounts available from many brokers',
      'No restrictions on forex trading for South African residents',
    ],
    legalNote: 'Verify a broker\'s FSP license number on the FSCA Financial Services Providers register. Consider brokers with dual FSCA + FCA regulation for added protection.',
    brokerFilter: (b: any) => b.regulations?.some((r: string) => r.includes('FSCA')) || b.entityRegulations?.some((e: any) => e.country === 'ZA' || e.country === 'South Africa'),
    metaTitle: 'Best FSCA-Regulated Forex Brokers in South Africa 2026 | ForexBrokerRatings',
    metaDescription: 'Compare the best forex brokers for South African traders in 2026. FSCA-regulated options, ZAR accounts, and expert reviews.',
  },
];

export function getCountryBySlug(slug: string): CountryData | undefined {
  return countries.find(c => c.slug === slug);
}

export function getAllCountrySlugs(): string[] {
  return countries.map(c => c.slug);
}
