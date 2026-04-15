'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ArrowUpRight, Shield, Sparkles } from 'lucide-react';

// All interactive pieces load client-side (they use framer-motion and/or WebGL).
const CashbackCalculator = dynamic(() => import('./_components/CashbackCalculator'), { ssr: false });
const GlobeStage = dynamic(() => import('./_components/GlobeStage'), { ssr: false });
const InlineStats = dynamic(() => import('./_components/InlineStats'), { ssr: false });
const TopRebateRates = dynamic(() => import('./_components/TopRebateRates'), { ssr: false });
const TopPropFirms = dynamic(() => import('./_components/TopPropFirms'), { ssr: false });
const HowCashbackWorks = dynamic(() => import('./_components/HowCashbackWorks'), { ssr: false });
const DeepResearch = dynamic(() => import('./_components/DeepResearch'), { ssr: false });

export default function PreviewHeroPage() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Layered backgrounds */}
      <div className="ph-mesh-bg" />
      <div className="absolute inset-0 ph-grid-bg opacity-30" />

      {/* Top nav (minimal prototype chrome) */}
      <nav className="relative z-30 flex items-center justify-between px-4 py-4 md:px-8 md:py-5">
        <Link href="/preview-hero" className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{
              background: 'linear-gradient(135deg, #4ADE80 0%, #22D3EE 100%)',
              boxShadow: '0 0 20px rgba(74,222,128,0.4)',
            }}
          >
            <Sparkles className="h-4 w-4" style={{ color: '#05070E' }} />
          </div>
          <span style={{ color: 'var(--ph-text-1)' }}>forexbrokeratings</span>
        </Link>

        <div className="hidden items-center gap-7 text-[14px] md:flex" style={{ color: 'var(--ph-text-2)' }}>
          <Link href="/preview-hero/brokers/" className="transition-colors hover:text-white">
            Brokers
          </Link>
          <Link href="/preview-hero/firms/" className="transition-colors hover:text-white">
            Prop Firms
          </Link>
          <Link href="/preview-hero/compare/" className="transition-colors hover:text-white">
            Compare
          </Link>
          <Link href="/preview-hero/search/" className="transition-colors hover:text-white">
            Search
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="hidden rounded-full border px-3 py-1.5 text-[12px] md:inline-block"
            style={{ borderColor: 'var(--ph-border-subtle)', color: 'var(--ph-text-2)' }}
          >
            ← Back to live site
          </Link>
          <a
            href="#calculator"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className="ph-focus-ring rounded-full px-4 py-1.5 text-[13px] font-semibold"
            style={{
              background: 'linear-gradient(135deg, #4ADE80 0%, #22D3EE 100%)',
              color: '#05070E',
              boxShadow: '0 0 24px rgba(74,222,128,0.3)',
            }}
          >
            Get cashback
          </a>
        </div>
      </nav>

      {/* Hero — 2 column on desktop: left = text+calculator, right = globe+stats */}
      <section className="relative z-10 mx-auto grid w-full max-w-[1300px] grid-cols-1 items-start gap-8 px-4 pb-10 pt-1 md:px-6 md:gap-10 md:pt-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10 lg:px-8 lg:pt-6">
        {/* LEFT — eyebrow, headline, tagline, calculator, regulators */}
        <div className="relative z-20 flex flex-col gap-5 md:gap-6 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[12px] uppercase tracking-[0.14em] ph-glass"
            style={{ color: 'var(--ph-text-2)' }}
          >
            <Shield className="h-3.5 w-3.5" style={{ color: 'var(--ph-emerald)' }} />
            <span>Audited across 26 regulators</span>
            <span className="opacity-40">·</span>
            <span style={{ color: 'var(--ph-emerald)' }}>Live rates</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(1.75rem,4.2vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.025em]"
          >
            <span className="ph-gradient-text">Earn cashback on every</span>{' '}
            <span className="ph-gradient-text-brand">trade you already make.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl text-[15px] leading-[1.65] md:text-[17px] md:leading-[1.6]"
            style={{ color: 'var(--ph-text-2)' }}
          >
            Pick any broker or prop firm in our database and see exactly what you&apos;d earn
            back — verified rates, no signup needed. 536 brokers, 139 prop firms, 26 jurisdictions.
          </motion.p>

          <motion.div
            id="calculator"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <CashbackCalculator />
          </motion.div>

          {/* Regulator logos row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: 'var(--ph-text-3)' }}
          >
            <span style={{ color: 'var(--ph-text-2)' }}>Trusted by traders covered by</span>
            <span>FCA</span>
            <span>ASIC</span>
            <span>CySEC</span>
            <span>NFA</span>
            <span>FINMA</span>
            <span>BaFin</span>
            <span>MAS</span>
            <span>SFC</span>
          </motion.div>
        </div>

        {/* RIGHT — globe on top, inline stats below. Mobile: appears before the calculator via order-first on container */}
        <div className="relative z-10 flex flex-col gap-4 lg:order-2 lg:sticky lg:top-6">
          {/* Globe container */}
          <div className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-[520px]">
            <div className="absolute inset-0">
              <GlobeStage />
            </div>
          </div>
          {/* Inline stats card directly under the globe, same column */}
          <InlineStats />
        </div>
      </section>

      {/* Top rebate rates carousel */}
      <TopRebateRates />

      {/* Top prop firms carousel */}
      <TopPropFirms />

      {/* How cashback works — 4-step diagram */}
      <HowCashbackWorks />

      {/* Deep research — corpus moat section */}
      <DeepResearch />

      {/* Section caption */}
      <section className="relative z-10 mx-auto mb-20 mt-20 w-full max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em] ph-glass"
            style={{ color: 'var(--ph-text-2)' }}
          >
            <Sparkles className="h-3 w-3" style={{ color: 'var(--ph-violet)' }} />
            <span>Prototype</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            <span className="ph-gradient-text">This is a </span>
            <span className="ph-gradient-text-brand">v1 preview.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[14px] leading-[1.65] md:text-[16px]" style={{ color: 'var(--ph-text-2)' }}>
            Wired up to real data: 536 brokers, 139 prop firms, 26 jurisdictions, and 60 live
            multi-regulator connections — audited and cross-checked from our research database.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/preview-hero/brokers/ig/"
              className="group flex items-center gap-2 rounded-full px-5 py-2 text-[14px] ph-glass-strong transition-all hover:border-white/20"
              style={{ color: 'var(--ph-text-1)', border: '1px solid var(--ph-border-subtle)' }}
            >
              See a full broker review
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer credit */}
      <footer
        className="relative z-10 mx-auto w-full max-w-6xl border-t px-6 py-6 text-[12px]"
        style={{ borderColor: 'var(--ph-border-subtle)', color: 'var(--ph-text-4)' }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>Preview v1 · Prototype data · Not indexed</div>
          <div className="flex gap-5">
            <span>React Three Fiber v8</span>
            <span>Next 14</span>
            <span>Tailwind 3</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
