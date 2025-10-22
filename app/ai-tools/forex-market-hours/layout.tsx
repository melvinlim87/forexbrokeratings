import React from 'react';

export const metadata = {
  title: 'Forex Market Hours | ForexBrokerRatings',
  description:
    'View live forex session times in your local timezone. Detect overlaps and see which sessions are currently open.',
};


export default function ForexMarketHourLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white ">
      <header className="bg-gradient-to-r from-[#091f40] to-[#0f2d59] h-[180px] flex flex-col justify-center items-center text-center px-4 mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow">
          Forex Market Hours
        </h1>
        <p className="text-lg md:text-2xl text-cyan-200 font-medium max-w-3xl mx-auto">
        View live forex session times in your local timezone. Detect overlaps and see which sessions are currently open.
        </p>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">{children}</div>
    </section>
  );
}
