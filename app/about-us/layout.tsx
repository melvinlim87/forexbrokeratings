import React from 'react';

export const metadata = {
  title: 'About Us | ForexBrokerRatings',
  description: 'Learn about the mission, vision, and team behind ForexBrokerRatings.'
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#f3f6fa]">
      <header className="bg-gradient-to-r from-[#091f40] to-[#0f2d59] h-[180px] flex flex-col justify-center items-center text-center px-4 mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow">About Us</h1>
        <h2 className="text-lg md:text-2xl text-cyan-200 font-medium max-w-2xl mx-auto">Independent reviews, real trading results, and the most rewarding promotions</h2>
      </header>
      <div className="max-w-5xl mx-auto px-2 sm:px-4 py-6">
        {children}
      </div>
    </section>
  );
}
