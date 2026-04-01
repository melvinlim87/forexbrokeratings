import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Forex Brokers | Compare & Choose | Forex Broker Ratings',
  description: 'Browse and compare all reviewed forex brokers. Filter by regulation, spreads, minimum deposit, and more.',
  alternates: {
    canonical: '/brokers',
  },
};

export default function BrokersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
