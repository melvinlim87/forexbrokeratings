"use client";
import React from 'react';
import HeroBanner from './HeroBanner';
import StickyTOC from './StickyTOC';
import PolicySections from './PolicySections';
import BackToTopButton from './BackToTopButton';
import FooterNote from './FooterNote';

export default function PrivacyPolicyPage() {
  return (
    <main className="relative">
      <div className="flex flex-col md:flex-row gap-8 bg-white/95 dark:bg-slate-900/95 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-8">
        <aside className="hidden md:block w-64 flex-shrink-0">
          <StickyTOC />
        </aside>
        <section className="flex-1 min-w-0">
          <StickyTOC mobileOnly />
          <PolicySections />
        </section>
      </div>
      <BackToTopButton />
      <FooterNote />
    </main>
  );
}
