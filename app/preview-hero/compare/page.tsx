// Compare page — 3-way side-by-side for brokers and/or prop firms.
// Part of the /preview-hero prototype.

import type { Metadata } from 'next';
import CompareClient from '../_components/CompareClient';

export const metadata: Metadata = {
  title: 'Compare · Forex Broker Ratings Preview',
  description: '3-way side-by-side comparison for brokers and prop firms.',
  robots: { index: false, follow: false },
};

export default function ComparePage() {
  return <CompareClient />;
}
