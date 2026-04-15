// /preview-hero/brokers — broker listing page for the new design
// Server component — reads the generated brokers.json at build time.

import type { Metadata } from 'next';
import BrokersListClient from './BrokersListClient';
import generatedBrokersJson from '../_data/generated/brokers.json';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://forexbrokeratings.com';
const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Best Forex Brokers ${YEAR} — Compare 500+ Brokers with Cashback | Forex Broker Ratings`,
  description: `Compare 500+ forex brokers by rating, regulation, minimum deposit, spreads and cashback rebate rates. Find the best forex broker for your trading style in ${YEAR}.`,
  keywords: `best forex brokers ${YEAR}, forex broker comparison, forex cashback, regulated forex brokers, lowest spread broker, ECN brokers`,
  openGraph: {
    title: `Best Forex Brokers ${YEAR} — Compare with Cashback`,
    description: `Compare 500+ forex brokers by rating, regulation, cashback and more.`,
    url: `${SITE_URL}/brokers/`,
    siteName: 'Forex Broker Ratings',
    type: 'website',
  },
  alternates: { canonical: `${SITE_URL}/brokers/` },
  robots: { index: true, follow: true },
};

type HeroBroker = {
  slug: string;
  name: string;
  logo: string | null;
  logoColor: string;
  rating: number;
  minDeposit: number;
  jurisdictions: string[];
  platforms: string[];
  accountTypes: string[];
  rebateRates: Array<{ accountType: string; instrumentClass: string; ratePerLot: number }>;
  lastVerified: string;
  popularityRank: number;
  headquarters: string | null;
  founded: string | null;
  affiliateUrl: string | null;
};

const ALL_BROKERS = (generatedBrokersJson as { brokers: HeroBroker[] }).brokers;

export default function BrokersPage() {
  return <BrokersListClient brokers={ALL_BROKERS} />;
}
