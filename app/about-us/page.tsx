import React from 'react';
import MissionVision from '../../src/components/about/MissionVision';
import CorePillarsGrid from '../../src/components/about/CorePillarsGrid';
import StatsStrip from '../../src/components/about/StatsStrip';
import TeamPeek from '../../src/components/about/TeamPeek';
import CallToActionBanner from '../../src/components/about/CallToActionBanner';
import BackToTopButton from '../../src/components/about/BackToTopButton';
import Newsletter from '@/components/home/newsletter';

export default function AboutPage() {
  return (
    <main className="relative min-h-screen py-10 px-2 sm:px-4 bg-gradient-to-br from-[#f8fafc] via-[#e8f0fa] to-[#f3f6fa] dark:from-slate-900 dark:via-slate-950 dark:to-slate-800 shadow-inner">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Mission & Vision */}
        <section className="bg-white/95 dark:bg-slate-900/95 rounded-2xl shadow-lg p-8 border border-cyan-100 dark:border-slate-800">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-cyan-700 dark:text-cyan-300">About Us</h2>
          <MissionVision />
          <StatsStrip />
        </section>
        {/* Stats with overlap */}
        {/* <div className="relative z-10 -mt-8">
        </div> */}
        {/* Core Pillars */}
        <section className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow p-8 border border-cyan-100 dark:border-slate-800">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-1 rounded bg-gradient-to-r from-cyan-400 to-blue-400 opacity-60" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-cyan-700 dark:text-cyan-300">Our Core Pillars</h2>
          <CorePillarsGrid />
        </section>
        {/* Team Section with floating card effect */}
        <section className="relative bg-white/95 dark:bg-slate-900/95 rounded-2xl shadow-2xl p-8 border border-cyan-100 dark:border-slate-800 overflow-visible">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-1 rounded bg-gradient-to-r from-cyan-400 to-blue-400 opacity-60" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-cyan-700 dark:text-cyan-300 text-center">Meet the Team</h2>
          <TeamPeek />
        </section>
        {/* Newsletter with top border accent */}
        <section className="rounded-xl shadow p-6 border-t-4 border-cyan-400 dark:border-cyan-700 bg-white/95 dark:bg-slate-900/95">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-1 rounded bg-gradient-to-r from-cyan-400 to-blue-400 opacity-60" />
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-cyan-700 dark:text-cyan-300">Stay Connected</h2>
          <p className="text-gray-700 dark:text-gray-300">Get the latest broker reviews, insights, and exclusive promotions—straight to your inbox.</p>
          <Newsletter />
        </section>
      </div>
      <BackToTopButton />
    </main>
  );
}
