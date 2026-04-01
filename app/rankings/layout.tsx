import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forex Broker Rankings 2026 | Top Rated Brokers | Forex Broker Ratings',
  description: 'Official forex broker rankings for 2026. Our expert-rated top 10 brokers based on regulation, spreads, platforms, and overall quality.',
  alternates: {
    canonical: '/rankings',
  },
};

export default function RankingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
