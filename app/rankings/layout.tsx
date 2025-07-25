import React from 'react';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Forex Broker Rankings",
  description: "Discover the top-ranked forex brokers based on ratings, reviews, and trading conditions. Find the best broker for your trading needs.",
  keywords: "forex broker rankings, top brokers, broker ratings, best forex brokers, trading reviews, ForexBrokerRatings",
  alternates: { canonical: 'https://forexbrokeratings.com/rankings' },
  openGraph: {
    type: 'website',
    url: 'https://forexbrokeratings.com/rankings',
    title: "Top Forex Broker Rankings",
    description: "Discover the top-ranked forex brokers based on ratings, reviews, and trading conditions. Find the best broker for your trading needs.",
    images: ['https://forexbrokeratings.com/assets/images/rankings-default.jpg'],
    siteName: 'Forex Broker Ratings',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Top Forex Broker Rankings",
    description: "Discover the top-ranked forex brokers based on ratings, reviews, and trading conditions.",
    images: ['https://forexbrokeratings.com/assets/images/rankings-default.jpg'],
  },
};

export default function RankingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
}
