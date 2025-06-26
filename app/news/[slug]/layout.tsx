import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'News Article | Forex Broker Ratings',
  description: 'Read detailed forex market news and analysis.'
};

export default function NewsSlugLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#f3f6fa] dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-2xl mx-auto px-2 sm:px-4 py-6">
        {children}
      </div>
    </section>
  );
}
