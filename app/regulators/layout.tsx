import React from 'react';
import T from '@/components/common/T';

export const metadata = {
  title: 'Regulators | ForexBrokerRatings',
  description: 'Directory of global financial market regulators organized by jurisdiction.',
};

export default function RegulatorsLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
      <header className="bg-gradient-to-r from-[#091f40] to-[#0f2d59] h-[180px] flex flex-col justify-center items-center text-center px-4 mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow"><T k="regulators.title" /></h1>
        <h2 className="text-lg md:text-2xl text-cyan-200 font-medium max-w-2xl mx-auto"><T k="regulators.subtitle" /></h2>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        {children}
      </div>
    </section>
  );
}
