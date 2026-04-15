'use client';

/**
 * Deep Research section — surfaces the research corpus moat.
 *
 * Shows:
 *   - 4 big animated counters (files, words, regulators cross-referenced, years of data)
 *   - 3 highlight cards showing example research entries (deep-dive MD, broker JSON, prop firm dossier)
 *   - A "How we research" strip at the bottom
 *
 * Numbers come from the Phase 0.A inventory report:
 *   1,689 files · 26.31 MB · 26 jurisdictions · 680 brokers parsed · 139 prop firms
 */

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import CountUp from 'react-countup';
import {
  FileText,
  Database,
  Eye,
  Sparkles,
  ArrowRight,
  BookOpen,
  Shield,
  Search,
  FileSearch,
} from 'lucide-react';
import { BROKERS, PROP_FIRMS, LIVE_STATS } from '../_data/entities';
import { JURISDICTIONS } from '../_data/jurisdictions';

/* ------------------------------------------------------------------
 * Data constants pulled from the consolidation inventory report
 * ------------------------------------------------------------------ */

const CORPUS_STATS = {
  totalFiles: 1689,
  totalWords: 8_507_457,
  researchMB: 26.31,
  deepDiveMarkdowns: 465,   // prop-firm + broker deep-dive MDs from the inventory
  sources: 10,              // 10 research source folders
  yearsOfData: 4,
};

/* ------------------------------------------------------------------
 * Animated stat tile
 * ------------------------------------------------------------------ */

function StatTile({
  icon: Icon,
  label,
  value,
  suffix,
  prefix,
  decimals,
  accent,
  index,
}: {
  icon: typeof FileText;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  accent: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl ph-glass-strong p-5"
    >
      {/* Accent glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 0% 0%, ${accent}18 0%, transparent 70%)`,
        }}
      />

      <div className="relative">
        <div
          className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
          style={{
            background: `${accent}18`,
            border: `1px solid ${accent}40`,
            color: accent,
          }}
        >
          <Icon className="h-4 w-4" />
        </div>

        <div
          className="ph-money text-3xl font-bold md:text-4xl"
          style={{
            background: 'linear-gradient(180deg, #FFFFFF 0%, #CBD5E1 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {isInView && (
            <CountUp
              end={value}
              duration={2.2}
              separator=","
              prefix={prefix}
              suffix={suffix}
              decimals={decimals ?? 0}
            />
          )}
        </div>

        <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--ph-text-3)' }}>
          {label}
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------
 * Highlight card — shows a single example of research content
 * ------------------------------------------------------------------ */

function HighlightCard({
  icon: Icon,
  kicker,
  title,
  body,
  metric,
  accent,
  index,
  href,
}: {
  icon: typeof FileText;
  kicker: string;
  title: string;
  body: string;
  metric: string;
  accent: string;
  index: number;
  href?: string;
}) {
  const content = (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl ph-glass-strong p-6 transition-all">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(ellipse 60% 40% at 100% 0%, ${accent}22 0%, transparent 60%)` }}
      />

      <div className="relative flex-1">
        <div className="mb-4 flex items-center justify-between">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl"
            style={{
              background: `${accent}18`,
              border: `1px solid ${accent}40`,
              color: accent,
            }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div
            className="rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider"
            style={{
              background: `${accent}18`,
              color: accent,
              border: `1px solid ${accent}33`,
            }}
          >
            {metric}
          </div>
        </div>

        <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: accent }}>
          {kicker}
        </div>
        <h3 className="mb-2 text-lg font-bold leading-tight" style={{ color: 'var(--ph-text-1)' }}>
          {title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--ph-text-2)' }}>
          {body}
        </p>
      </div>

      {href && (
        <div
          className="relative mt-4 flex items-center justify-between text-xs font-semibold transition-transform group-hover:translate-x-1"
          style={{ color: 'var(--ph-emerald)' }}
        >
          See a live example
          <ArrowRight className="h-3 w-3" />
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      {href ? <Link href={href} className="block h-full">{content}</Link> : content}
    </motion.div>
  );
}

/* ------------------------------------------------------------------
 * Main section
 * ------------------------------------------------------------------ */

export default function DeepResearch() {
  return (
    <section className="relative z-10 mx-auto mt-20 w-full max-w-[1400px] px-6 lg:px-10">
      {/* Section header */}
      <div className="mb-10 text-center">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em] ph-glass" style={{ color: 'var(--ph-text-2)' }}>
          <Sparkles className="h-3 w-3" style={{ color: 'var(--ph-violet)' }} />
          Read with peace of mind
        </div>
        <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
          <span className="ph-gradient-text">The deepest broker research </span>
          <span className="ph-gradient-text-brand">you&apos;ll find anywhere.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-[1.65] md:text-[17px]" style={{ color: 'var(--ph-text-2)' }}>
          Most review sites pull 100 brokers from Wikipedia and call it done. We audit every
          broker we list against primary sources, regulator registries, and real user reports —
          so you can read our reviews with confidence.
        </p>
      </div>

      {/* Stats grid */}
      <div className="mb-14 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatTile
          icon={FileText}
          label="Research files"
          value={CORPUS_STATS.totalFiles}
          accent="#4ADE80"
          index={0}
        />
        <StatTile
          icon={BookOpen}
          label="Words of original content"
          value={CORPUS_STATS.totalWords}
          accent="#22D3EE"
          index={1}
        />
        <StatTile
          icon={Shield}
          label="Jurisdictions mapped"
          value={JURISDICTIONS.length}
          accent="#A78BFA"
          index={2}
        />
        <StatTile
          icon={Database}
          label="Brokers + prop firms"
          value={BROKERS.length + PROP_FIRMS.length}
          accent="#FBBF24"
          index={3}
        />
      </div>

      {/* Highlight cards row */}
      <div className="mb-12 grid gap-5 md:grid-cols-3">
        <HighlightCard
          icon={FileSearch}
          kicker="In-depth reviews"
          title="3,000+ words per broker"
          body="Every review covers founding history, regulation, trading conditions, payouts, real risk factors, and controversies. Not rewrites — original research by our editorial team."
          metric="465+ reviews"
          accent="#4ADE80"
          index={0}
          href="/preview-hero/brokers/ic-markets/"
        />
        <HighlightCard
          icon={Eye}
          kicker="Multi-jurisdiction checks"
          title={`${JURISDICTIONS.length} regulators verified`}
          body="For brokers like IG and Interactive Brokers, we track every country-specific license — numbers, leverage caps, retail vs. professional classifications. One broker, every legal truth."
          metric={`${JURISDICTIONS.length} regulators`}
          accent="#22D3EE"
          index={1}
          href="/preview-hero/firms/ftmo/"
        />
        <HighlightCard
          icon={Search}
          kicker="Every fact sourced"
          title="Receipts for every claim"
          body="When we say a broker is regulated by 10 agencies, we show you the license numbers and when we last audited them. Nothing in our reviews is taken on trust."
          metric="Auditable"
          accent="#A78BFA"
          index={2}
        />
      </div>

      {/* How we audit strip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden rounded-3xl ph-glass-strong p-6 md:p-8"
      >
        <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--ph-emerald)' }}>
              How we audit
            </div>
            <h3 className="text-2xl font-bold" style={{ color: 'var(--ph-text-1)' }}>
              Every review goes through 4 checks
            </h3>
            <p className="mt-1 text-[13px]" style={{ color: 'var(--ph-text-3)' }}>
              So you can read with peace of mind — nothing shipped on our word alone
            </p>
          </div>
          <Link
            href="/preview-hero/brokers/ig/"
            className="ph-focus-ring group inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-semibold"
            style={{
              background: 'rgba(74, 222, 128, 0.1)',
              border: '1px solid rgba(74, 222, 128, 0.25)',
              color: 'var(--ph-emerald)',
            }}
          >
            See a full review
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-4 text-[14px] md:grid-cols-4" style={{ color: 'var(--ph-text-2)' }}>
          <MethodologyStep
            step="01"
            title="Regulator cross-check"
            body="Every license number is verified against the official regulator's public register before it goes in a review."
          />
          <MethodologyStep
            step="02"
            title="In-depth research"
            body="Each broker and firm gets a 3,000+ word breakdown covering company history, regulation, fees, payouts, and real risk factors."
          />
          <MethodologyStep
            step="03"
            title="Independent audit"
            body="Our editorial team audits each review against primary sources and user reports — no single author pushes a broker through."
          />
          <MethodologyStep
            step="04"
            title="90-day re-audit"
            body="Every review is re-audited on a rolling 90-day cycle. Changes in regulation, ownership, or conditions get surfaced immediately."
          />
        </div>
      </motion.div>
    </section>
  );
}

function MethodologyStep({ step, title, body }: { step: string; title: string; body: string }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--ph-border-subtle)' }}>
      <div className="mb-2 text-[10px] font-mono font-semibold" style={{ color: 'var(--ph-emerald)' }}>
        {step}
      </div>
      <div className="mb-1 text-sm font-semibold" style={{ color: 'var(--ph-text-1)' }}>
        {title}
      </div>
      <div className="text-xs leading-relaxed" style={{ color: 'var(--ph-text-3)' }}>
        {body}
      </div>
    </div>
  );
}
