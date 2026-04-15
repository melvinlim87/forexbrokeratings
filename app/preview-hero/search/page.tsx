// Search page — Cmd+K style instant filter across all 536 brokers + 139 prop firms.
// Part of the /preview-hero prototype. Uses the same consolidated data
// everything else consumes.

import type { Metadata } from 'next';
import SearchClient from '../_components/SearchClient';

export const metadata: Metadata = {
  title: 'Search · Forex Broker Ratings Preview',
  description: 'Instant search across 536 brokers and 139 prop firms.',
  robots: { index: false, follow: false },
};

export default function SearchPage() {
  return <SearchClient />;
}
