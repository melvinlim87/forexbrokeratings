import React from 'react';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forex Broker Blog & Insights",
  description: "Insights, guides, news, and tips for forex traders. Stay updated with the latest trends, broker reviews, and trading strategies from ForexBrokerRatings.",
  keywords: "forex blog, trading insights, broker reviews, forex news, forex tips, trading strategies, ForexBrokerRatings",
  alternates: { canonical: 'https://forexbrokeratings.com/blog' },
  openGraph: {
    type: 'website',
    url: 'https://forexbrokeratings.com/blog',
    title: "Forex Broker Blog & Insights",
    description: "Insights, guides, news, and tips for forex traders. Stay updated with the latest trends, broker reviews, and trading strategies from ForexBrokerRatings.",
    images: ['https://forexbrokeratings.com/assets/images/blog-default.jpg'],
    siteName: 'Forex Broker Ratings',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Forex Broker Blog & Insights",
    description: "Insights, guides, news, and tips for forex traders. Stay updated with the latest trends, broker reviews, and trading strategies from ForexBrokerRatings.",
    images: ['https://forexbrokeratings.com/assets/images/blog-default.jpg'],
    site: '@forexbrokeratings',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="bg-gradient-to-r from-[#091f40] to-[#0f2d59] h-[180px] flex flex-col justify-center items-center text-center px-4 mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow">ForexBrokerRatings Blog</h1>
        <h2 className="text-lg md:text-2xl text-cyan-200 font-medium max-w-2xl mx-auto">Insights, guides, and news for forex traders</h2>
      </header>
      <main className="mx-auto px-12 py-12 ">
        {children}
      </main>
    </div>
  );
}
