import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare Forex Brokers Side by Side | Forex Broker Ratings',
  description: 'Compare forex brokers side by side. See spreads, platforms, regulations, and features at a glance.',
  alternates: {
    canonical: '/compare',
  },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
