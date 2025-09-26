import React from 'react';
import { Metadata } from "next";
import T from '@/components/common/T';

export const metadata: Metadata = {
  title: "Compare Forex Brokers",
  description: "Side-by-side comparison of top forex brokers. Filter, select, and analyze the best fit for your trading style.",
  keywords: "compare forex brokers, broker comparison, trading platforms, spreads, leverage, regulation, ForexBrokerRatings",
  alternates: { canonical: 'https://forexbrokeratings.com/compare' },
  openGraph: {
    type: 'website',
    url: 'https://forexbrokeratings.com/compare',
    title: "Compare Forex Brokers",
    description: "Side-by-side comparison of top forex brokers. Filter, select, and analyze the best fit for your trading style.",
    images: ['https://forexbrokeratings.com/assets/images/compare-default.jpg'],
    siteName: 'Forex Broker Ratings',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Compare Forex Brokers",
    description: "Side-by-side comparison of top forex brokers. Filter, select, and analyze the best fit for your trading style.",
    images: ['https://forexbrokeratings.com/assets/images/compare-default.jpg'],
    site: '@forexbrokeratings',
  },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="bg-gradient-to-r from-[#091f40] to-[#0f2d59] h-[180px] flex flex-col justify-center items-center text-center px-4 mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow"><T k="compare.title" /></h1>
        <h2 className="text-lg md:text-2xl text-cyan-200 font-medium max-w-2xl mx-auto"><T k="compare.subtitle" /></h2>
      </header>
      <main className="mx-auto px-12 py-12">
        {children}
      </main>
    </div>
  );
}
