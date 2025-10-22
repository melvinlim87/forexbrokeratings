import React from 'react';

export const metadata = {
  title: 'Market Sentiment Analyzer | ForexBrokerRatings',
  description: 'Live market risk sentiment based on major assets and FX pairs.'
};

export default function MarketSentimentAnalyzerLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="bg-gradient-to-r from-[#091f40] to-[#0f2d59] h-[180px] flex flex-col justify-center items-center text-center px-4 mb-10">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow">Market Sentiment Analyzer</h1>
        <p className="text-base md:text-lg text-cyan-200 max-w-3xl">
          A quick snapshot of market risk sentiment using stocks, commodities, FX and yields.
        </p>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">{children}</div>
    </section>
  );
}
