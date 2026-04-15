// /preview-hero/firms — prop firm listing page for the new design

import type { Metadata } from 'next';
import FirmsListClient from './FirmsListClient';
import generatedPropFirmsJson from '../_data/generated/prop-firms.json';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://forexbrokeratings.com';
const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Best Prop Trading Firms ${YEAR} — Compare Funded Trader Programs | Forex Broker Ratings`,
  description: `Compare the best prop trading firms in ${YEAR}. Find the top funded trader programs by evaluation model, profit split, account size and payout speed.`,
  keywords: `best prop trading firms ${YEAR}, funded trader programs, prop firm comparison, FTMO alternative, 2-step challenge, instant funding prop firm`,
  openGraph: {
    title: `Best Prop Trading Firms ${YEAR} — Compare Funded Trader Programs`,
    description: `Compare 100+ prop trading firms by profit split, account size and payout speed.`,
    url: `${SITE_URL}/firms/`,
    siteName: 'Forex Broker Ratings',
    type: 'website',
  },
  alternates: { canonical: `${SITE_URL}/firms/` },
  robots: { index: true, follow: true },
};

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

export default function FirmsPage() {
  return <FirmsListClient firms={ALL_FIRMS} />;
}
