import React from 'react';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Forex Trading Tools",
  description: "Explore AI-powered forex trading tools and analyzers to enhance your trading strategies. Discover smart analytics, signals, and more.",
  keywords: "AI forex tools, trading AI, forex analyzers, trading signals, smart analytics, ForexBrokerRatings",
  metadataBase: new URL('https://forexbrokeratings.com'),
  alternates: {
    canonical: 'https://forexbrokeratings.com/ai-tools',
    languages: {
      'en': 'https://forexbrokeratings.com/ai-tools',
      'zh': 'https://forexbrokeratings.com/zh/ai-tools'
    }
  },
  openGraph: {
    type: 'website',
    url: 'https://forexbrokeratings.com/ai-tools',
    title: "AI Forex Trading Tools",
    description: "Explore AI-powered forex trading tools and analyzers to enhance your trading strategies. Discover smart analytics, signals, and more.",
    images: ['https://forexbrokeratings.com/assets/images/ai-tools-default.jpg'],
    siteName: 'Forex Broker Ratings',
  },
  twitter: {
    card: 'summary_large_image',
    title: "AI Forex Trading Tools",
    description: "Explore AI-powered forex trading tools and analyzers to enhance your trading strategies.",
    images: ['https://forexbrokeratings.com/assets/images/ai-tools-default.jpg'],
  },
};

export default function AIToolsLayout({
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
