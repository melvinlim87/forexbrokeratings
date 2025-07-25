import React from 'react';
import { Metadata } from "next";

import { fetchAllBrokerDetails } from '@/lib/supabase';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Fetch broker data by slug
  try {
    const brokers = await fetchAllBrokerDetails();
    const broker = brokers.find(b => b.name.toLowerCase().replace(/\s+/g, '-') === params.slug);
    const brokerName = broker?.name || '';
    const baseUrl = 'https://forexbrokeratings.com';
    const canonical = broker ? `${baseUrl}/broker/${params.slug}` : baseUrl;
    const image = broker?.logo || `${baseUrl}/assets/images/broker-default.jpg`;
    const description = brokerName
      ? `Read real reviews, ratings, and in-depth analysis for ${brokerName}. Discover features, pros, cons, and more.`
      : 'Detailed information about this forex broker.';
    const keywords = brokerName
      ? `${brokerName}, forex broker, reviews, ratings, trading, platforms, regulation, CFD, spread, leverage`
      : 'forex broker, reviews, ratings, trading, platforms, regulation, CFD, spread, leverage';
    return {
      title: brokerName ? `${brokerName} Reviews` : 'Broker Reviews',
      description,
      keywords,
      alternates: { canonical },
      openGraph: {
        type: 'website',
        url: canonical,
        title: brokerName ? `${brokerName} Reviews` : 'Broker Reviews',
        description,
        images: [image],
        siteName: 'Forex Broker Ratings',
      },
      twitter: {
        card: 'summary_large_image',
        title: brokerName ? `${brokerName} Reviews` : 'Broker Reviews',
        description,
        images: [image],
        site: '@forexbrokeratings',
      },
    };

  } catch {
    return {
      title: 'Broker Reviews',
      description: 'Detailed information about this forex broker',
    };
  }
}

export default function BrokerDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">{children}</main>
    </div>
  );
}
