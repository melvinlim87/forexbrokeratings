'use client';

/**
 * Prop firm in-depth review — /preview-hero/firms/[slug]/
 *
 * Enhancements over v1:
 *   - SVG animated rating ring
 *   - Challenge phase visual stepper with progress bars for % targets
 *   - Pricing table with savings % badge
 *   - Animated trust metric cards with CountUp
 *   - Staggered pros/cons animation
 *   - Country flags on any jurisdiction data
 */

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  Star,
  Zap,
  Clock,
  Target,
  TrendingUp,
  Wallet,
  Activity,
  Check,
  X as XIcon,
  BookOpen,
  HelpCircle,
  ChevronDown,
  ExternalLink,
  Trophy,
  Users,
  DollarSign,
  BarChart2,
} from 'lucide-react';
import { initialsOf, isImageLogo } from '../_data/entities';
import { MarkdownProse, ReviewsPanel, FactRow } from './ReviewShared';
import { BrokerLogo } from './BrokerLogo';
import { PlatformBadges } from './PlatformBadges';

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

type Summary = {
  slug: string;
  name: string;
  logo: string | null;
  logoColor: string;
  rating: number;
  evaluationModel: string;
  accountSizes: number[];
  pricing: Record<string, { standard: number; discounted: number; additionalRebate: number }>;
  profitSplit: string;
  lastVerified: string;
  popularityRank: number;
  headquarters: string | null;
  founded: string | null;
  affiliateUrl: string | null;
};

type ChallengePhase = {
  name?: string;
  profit_target?: string;
  max_daily_loss?: string;
  max_total_loss?: string;
  min_trading_days?: number;
  time_limit?: string;
};

type Rich = Record<string, unknown> & {
  fullReview?: string;
  review_content?: string;
  summary?: string;
  description?: string;
  pros?: string[];
  cons?: string[];
  challenge_phases?: ChallengePhase[];
  platforms?: string[];
  instruments?: string[];
  payout_frequency?: string;
  payout_speed?: string;
  payout_methods?: string[];
  reset_fee?: string;
  scaling_details?: string;
  faqData?: Array<{ question?: string; answer?: string }>;
  userReviewsData?: any;
  trust_and_credibility?: {
    trustpilot_score?: number;
    trustpilot_review_count?: string;
    years_active?: number;
    total_funded_traders?: string;
    total_payouts_amount?: string;
    controversies?: string[];
  };
  ceo?: string;
  parent_company?: string;
  legal_entity?: string;
  leverage?: string;
  spreads?: string;
  commission?: string;
  ea_allowed?: boolean;
  news_trading?: boolean;
  weekend_holding?: boolean;
  copy_trading?: boolean;
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Parse percentage string like "8%" or "8" → number */
function parsePct(val: string | undefined): number | null {
  if (!val) return null;
  const m = val.match(/[\d.]+/);
  return m ? parseFloat(m[0]) : null;
}

/** Parse dollar/k string like "$5,000" or "5k" → number */
function parseMoney(val: string | undefined): number | null {
  if (!val) return null;
  const clean = val.replace(/[$,]/g, '').toLowerCase();
  const m = clean.match(/[\d.]+/);
  if (!m) return null;
  const n = parseFloat(m[0]);
  return clean.includes('k') ? n * 1000 : n;
}

/* ------------------------------------------------------------------ */
/*  Shared sub-components                                               */
/* ------------------------------------------------------------------ */

/** Animated SVG rating ring */
function RatingRing({ rating, max = 10, color = '#4ADE80' }: { rating: number; max?: number; color?: string }) {
  const pct = Math.min(1, rating / max);
  const r = 34;
  const circ = 2 * Math.PI * r;
  const id = `rg-firm-${Math.round(rating * 10)}`;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="90" height="90" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
        <circle cx="45" cy="45" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5.5" />
        <motion.circle
          cx="45" cy="45" r={r} fill="none"
          stroke={`url(#${id})`} strokeWidth="5.5"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - pct) }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '45px 45px' }}
        />
      </svg>
      <div className="absolute text-center">
        <div
          className="ph-money text-[22px] font-bold leading-none"
          style={{
            background: 'linear-gradient(180deg,#fff 0%,#cbd5e1 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {rating.toFixed(1)}
        </div>
        <div className="mt-0.5 text-[10px]" style={{ color: 'var(--ph-text-3)' }}>/ {max}</div>
      </div>
    </div>
  );
}

/** Visual phase card with progress bars for % values */
function PhaseCard({ phase, idx, total }: { phase: ChallengePhase; idx: number; total: number }) {
  const profitPct    = parsePct(phase.profit_target);
  const dailyLossPct = parsePct(phase.max_daily_loss);
  const totalLossPct = parsePct(phase.max_total_loss);

  const isLast = idx === total - 1;
  const phaseColor = isLast ? 'var(--ph-emerald)' : idx === 0 ? 'var(--ph-cyan)' : 'var(--ph-violet)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: idx * 0.1 }}
      className="relative overflow-hidden rounded-2xl p-4 md:p-5"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${phaseColor}33`,
      }}
    >
      {/* Phase label */}
      <div className="mb-3 flex items-center gap-2">
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold"
          style={{ background: `${phaseColor}20`, color: phaseColor, border: `1px solid ${phaseColor}55` }}
        >
          {idx + 1}
        </div>
        <span className="text-[14px] font-bold" style={{ color: 'var(--ph-text-1)' }}>
          {phase.name ?? `Phase ${idx + 1}`}
        </span>
        {isLast && (
          <span className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase"
            style={{ background: 'rgba(74,222,128,0.14)', color: 'var(--ph-emerald)', border: '1px solid rgba(74,222,128,0.3)' }}>
            Funded
          </span>
        )}
      </div>

      {/* Visual bars for % targets */}
      <div className="space-y-2.5">
        {profitPct !== null && (
          <div>
            <div className="mb-1 flex justify-between text-[12px]">
              <span style={{ color: 'var(--ph-text-3)' }}>Profit target</span>
              <span className="ph-money font-bold" style={{ color: 'var(--ph-emerald)' }}>{phase.profit_target}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.min(100, profitPct * 5)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.16,1,0.3,1], delay: idx * 0.1 + 0.15 }}
                style={{ background: 'linear-gradient(90deg,#4ADE80,#22D3EE)' }}
              />
            </div>
          </div>
        )}
        {dailyLossPct !== null && (
          <div>
            <div className="mb-1 flex justify-between text-[12px]">
              <span style={{ color: 'var(--ph-text-3)' }}>Daily loss limit</span>
              <span className="ph-money font-bold" style={{ color: '#F87171' }}>{phase.max_daily_loss}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.min(100, dailyLossPct * 10)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.16,1,0.3,1], delay: idx * 0.1 + 0.2 }}
                style={{ background: 'linear-gradient(90deg,#F87171,#FB923C)' }}
              />
            </div>
          </div>
        )}
        {totalLossPct !== null && (
          <div>
            <div className="mb-1 flex justify-between text-[12px]">
              <span style={{ color: 'var(--ph-text-3)' }}>Max total loss</span>
              <span className="ph-money font-bold" style={{ color: '#FB923C' }}>{phase.max_total_loss}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.min(100, totalLossPct * 5)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.16,1,0.3,1], delay: idx * 0.1 + 0.25 }}
                style={{ background: 'linear-gradient(90deg,#FB923C,#FBBF24)' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Grid stats */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-[12px] sm:grid-cols-3">
        {phase.min_trading_days !== undefined && (
          <div className="rounded-lg px-2.5 py-1.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div style={{ color: 'var(--ph-text-3)' }}>Min days</div>
            <div className="font-bold" style={{ color: 'var(--ph-text-1)' }}>{phase.min_trading_days}d</div>
          </div>
        )}
        {phase.time_limit && (
          <div className="rounded-lg px-2.5 py-1.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div style={{ color: 'var(--ph-text-3)' }}>Time limit</div>
            <div className="font-bold" style={{ color: 'var(--ph-text-1)' }}>{phase.time_limit}</div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                      */
/* ------------------------------------------------------------------ */

export default function PropFirmReview({ summary, rich }: { summary: Summary; rich: Rich | null }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const pricingRows = Object.entries(summary.pricing)
    .map(([k, v]) => ({ size: Number(k), ...v }))
    .filter((r) => !Number.isNaN(r.size))
    .sort((a, b) => a.size - b.size);

  const lowestPrice   = pricingRows[0]?.discounted ?? 0;
  const totalCashback = pricingRows.reduce((sum, r) => sum + r.additionalRebate, 0);

  const fullReview =
    (typeof rich?.fullReview === 'string' && rich.fullReview.length > 200 && rich.fullReview) ||
    (typeof rich?.review_content === 'string' && rich.review_content.length > 200 && rich.review_content) ||
    '';
  const summaryText  = typeof rich?.summary === 'string' ? rich.summary : typeof rich?.description === 'string' ? rich.description : '';
  const pros         = rich?.pros ?? [];
  const cons         = rich?.cons ?? [];
  const phases       = rich?.challenge_phases ?? [];
  const faqs         = rich?.faqData ?? [];
  const userReviews  = rich?.userReviewsData ?? null;
  const trust        = rich?.trust_and_credibility ?? null;

  // Feature flags for quick facts display
  const tradingFlags = [
    rich?.ea_allowed       !== undefined && { label: 'EAs allowed',    val: rich.ea_allowed       as boolean },
    rich?.news_trading     !== undefined && { label: 'News trading',   val: rich.news_trading     as boolean },
    rich?.weekend_holding  !== undefined && { label: 'Weekend holds',  val: rich.weekend_holding  as boolean },
    rich?.copy_trading     !== undefined && { label: 'Copy trading',   val: rich.copy_trading     as boolean },
  ].filter(Boolean) as Array<{ label: string; val: boolean }>;

  return (
    <div className="preview-hero-root relative isolate min-h-screen overflow-hidden">
      <div className="ph-mesh-bg" />
      <div className="absolute inset-0 ph-grid-bg opacity-30" />

      <div className="relative z-10 mx-auto max-w-[1100px] px-5 pb-20 pt-6 md:px-8 lg:pt-10">

        {/* ── Breadcrumb ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-5 flex items-center gap-3 text-[13px]"
          style={{ color: 'var(--ph-text-3)' }}
        >
          <Link
            href="/preview-hero/"
            className="ph-focus-ring inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ph-glass transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to hero
          </Link>
          <span className="opacity-50">·</span>
          <span>Prop Firms</span>
          <span className="opacity-50">›</span>
          <span style={{ color: 'var(--ph-text-1)' }}>{summary.name}</span>
        </motion.div>

        {/* ── Hero ───────────────────────────────────────────────── */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-6 overflow-hidden rounded-3xl ph-glass-strong p-6 md:p-8"
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: `radial-gradient(ellipse 60% 40% at 100% 0%,${summary.logoColor}28 0%,transparent 60%)` }}
          />
          <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            {/* Left: logo + name + meta */}
            <div className="flex items-center gap-4">
              <BrokerLogo logo={summary.logo} name={summary.name} logoColor={summary.logoColor} size={64} className="md:!h-20 md:!w-20" />

              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--ph-text-3)' }}>
                  <span className="ph-live-dot" aria-hidden />
                  Prop firm review
                  {summary.popularityRank <= 10 && (
                    <>
                      <span className="opacity-40">·</span>
                      <span style={{ color: 'var(--ph-violet)' }}>
                        <Trophy className="mr-1 inline-block h-3 w-3" />#{summary.popularityRank} most popular
                      </span>
                    </>
                  )}
                </div>
                <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-tight">
                  <span className="ph-gradient-text">{summary.name} Review</span>
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]" style={{ color: 'var(--ph-text-2)' }}>
                  {summary.founded && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Since {summary.founded}
                    </span>
                  )}
                  {summary.headquarters && (
                    <>
                      <span className="opacity-40">·</span>
                      <span>{summary.headquarters}</span>
                    </>
                  )}
                  <span className="opacity-40">·</span>
                  <span className="flex items-center gap-1" style={{ color: 'var(--ph-emerald)' }}>
                    <Shield className="h-3.5 w-3.5" />
                    Audited {summary.lastVerified}
                  </span>
                </div>
              </div>
              {/* Platform badges for prop firms */}
              {(rich?.platforms as string[] | undefined)?.length ? (
                <div className="mt-3">
                  <PlatformBadges platforms={rich!.platforms as string[]} />
                </div>
              ) : null}
            </div>

            {/* Right: SVG ring + CTA */}
            <div className="flex flex-col items-stretch gap-3 md:items-end">
              <div className="flex items-center gap-3 rounded-2xl px-4 py-2 ph-glass" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <RatingRing rating={summary.rating} color={summary.logoColor} />
                <div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5"
                        style={{ color: '#FBBF24' }}
                        fill={i < Math.round((summary.rating / 10) * 5) ? '#FBBF24' : 'none'}
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  <div className="mt-0.5 text-[11px]" style={{ color: 'var(--ph-text-3)' }}>
                    Expert rating
                  </div>
                </div>
              </div>
              <a
                href={summary.affiliateUrl ?? '#'}
                target="_blank"
                rel="noopener sponsored"
                className="ph-focus-ring group flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-[14px] font-semibold"
                style={{
                  background: 'linear-gradient(135deg,#4ADE80 0%,#22D3EE 100%)',
                  color: '#05070E',
                  boxShadow: '0 0 32px rgba(74,222,128,0.35),0 1px 0 rgba(255,255,255,0.25) inset',
                }}
              >
                Start a challenge
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </motion.header>

        {/* ── Quick metrics ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4"
        >
          <MetricCard icon={Target}     label="Evaluation"   value={summary.evaluationModel}   color="var(--ph-emerald)" />
          <MetricCard icon={TrendingUp} label="Profit split" value={summary.profitSplit}        color="var(--ph-cyan)" />
          <MetricCard icon={Wallet}     label="Min challenge" value={`$${lowestPrice.toLocaleString()}`} color="var(--ph-violet)" />
          <MetricCard icon={Activity}   label="Tiers"        value={`${summary.accountSizes.length}`} color="var(--ph-amber)" />
        </motion.div>

        {/* ── Cashback / saving strip ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6 overflow-hidden rounded-3xl ph-glass-strong p-5 md:p-6"
          style={{ background: 'radial-gradient(ellipse at 0% 50%,rgba(74,222,128,0.10) 0%,transparent 60%),rgba(10,14,26,0.85)' }}
        >
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--ph-emerald)' }}>
                Your saving on this firm
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  className="ph-money text-4xl font-bold md:text-5xl"
                  style={{
                    background: 'linear-gradient(180deg,#fff 0%,#cbd5e1 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  <CountUp end={totalCashback} duration={1.2} separator="," prefix="$" />
                </span>
                <span className="text-[13px]" style={{ color: 'var(--ph-text-3)' }}>across all tiers</span>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px]"
              style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)', color: 'var(--ph-emerald)' }}>
              <Zap className="h-3.5 w-3.5" />
              Discount + additional rebate
            </div>
          </div>
        </motion.div>

        {/* ── Pricing table with savings % ──────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.12 }}
          className="mb-6 rounded-3xl ph-glass-strong p-5 md:p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold md:text-xl" style={{ color: 'var(--ph-text-1)' }}>
              Account sizes &amp; pricing
            </h2>
            <div className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.12em]" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--ph-text-2)' }}>
              {pricingRows.length} tiers
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[540px] text-[14px]">
              <thead>
                <tr className="border-b text-left text-[11px] uppercase tracking-[0.1em]" style={{ borderColor: 'var(--ph-border-subtle)', color: 'var(--ph-text-3)' }}>
                  <th className="pb-3">Account</th>
                  <th className="pb-3 text-right">Standard</th>
                  <th className="pb-3 text-right">Your price</th>
                  <th className="pb-3 text-right">+ Rebate</th>
                  <th className="pb-3 text-right">Saving</th>
                  <th className="pb-3 text-right">Save %</th>
                </tr>
              </thead>
              <tbody>
                {pricingRows.map((row, ridx) => {
                  const saving  = row.standard - row.discounted + row.additionalRebate;
                  const savePct = row.standard > 0 ? Math.round((saving / row.standard) * 100) : 0;
                  return (
                    <tr key={row.size} className="border-b transition-colors hover:bg-white/[0.02]" style={{ borderColor: 'var(--ph-border-subtle)' }}>
                      <td className="py-3 font-semibold" style={{ color: 'var(--ph-text-1)' }}>
                        ${(row.size / 1000).toFixed(0)}K
                      </td>
                      <td className="py-3 text-right ph-money" style={{ color: 'var(--ph-text-3)', textDecoration: 'line-through' }}>
                        ${row.standard}
                      </td>
                      <td className="py-3 text-right ph-money font-bold" style={{ color: 'var(--ph-text-1)' }}>
                        ${row.discounted}
                      </td>
                      <td className="py-3 text-right ph-money" style={{ color: 'var(--ph-cyan)' }}>
                        +${row.additionalRebate}
                      </td>
                      <td className="py-3 text-right">
                        <span className="ph-money inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold"
                          style={{ background: 'rgba(74,222,128,0.12)', color: 'var(--ph-emerald)' }}>
                          <Zap className="h-3 w-3" />${saving}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <motion.span
                          className="inline-block ph-money text-[13px] font-bold"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: ridx * 0.07 }}
                          style={{ color: savePct >= 20 ? 'var(--ph-emerald)' : 'var(--ph-cyan)' }}
                        >
                          {savePct}%
                        </motion.span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* ── Challenge phases — visual stepper ─────────────────── */}
        {phases.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.14 }}
            className="mb-6 rounded-3xl ph-glass-strong p-5 md:p-6"
          >
            <div className="mb-5">
              <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--ph-cyan)' }}>
                <Target className="h-3.5 w-3.5" />
                Evaluation roadmap
              </div>
              <h2 className="text-lg font-bold md:text-xl" style={{ color: 'var(--ph-text-1)' }}>
                Challenge rules
              </h2>
              <p className="mt-1 text-[13px]" style={{ color: 'var(--ph-text-3)' }}>
                Phase-by-phase evaluation conditions — pass all phases to get funded
              </p>
            </div>

            {/* Phase path indicator */}
            <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {phases.map((phase, i) => (
                <div key={i} className="flex items-center gap-2 shrink-0">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold shrink-0"
                    style={{
                      background: i === phases.length - 1 ? 'linear-gradient(135deg,#4ADE80,#22D3EE)' : 'rgba(255,255,255,0.08)',
                      color: i === phases.length - 1 ? '#05070E' : 'var(--ph-text-2)',
                    }}
                  >
                    {i + 1}
                  </div>
                  {i < phases.length - 1 && (
                    <div className="h-px w-8 shrink-0" style={{ background: 'var(--ph-border-subtle)' }} />
                  )}
                </div>
              ))}
              <div className="ml-2 shrink-0 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                style={{ background: 'rgba(74,222,128,0.12)', color: 'var(--ph-emerald)', border: '1px solid rgba(74,222,128,0.3)' }}>
                <Trophy className="h-3 w-3" />
                Funded
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {phases.map((phase, i) => (
                <PhaseCard key={i} phase={phase} idx={i} total={phases.length} />
              ))}
            </div>
          </motion.section>
        )}

        {/* ── Payout + trust metrics ─────────────────────────────── */}
        {(rich?.payout_frequency || rich?.payout_speed || trust?.total_payouts_amount || trust?.total_funded_traders) && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mb-6 overflow-hidden rounded-3xl ph-glass-strong p-5 md:p-6"
          >
            <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 40% at 0% 0%,rgba(34,211,238,0.07) 0%,transparent 60%)' }} />
            <div className="relative">
              <div className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--ph-cyan)' }}>
                <BarChart2 className="h-3.5 w-3.5" />
                Track record &amp; payouts
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {rich?.payout_frequency && (
                  <div className="rounded-2xl p-3.5 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--ph-border-subtle)' }}>
                    <Wallet className="mx-auto mb-1.5 h-5 w-5" style={{ color: 'var(--ph-emerald)' }} />
                    <div className="text-[13px] font-bold" style={{ color: 'var(--ph-text-1)' }}>{String(rich.payout_frequency)}</div>
                    <div className="text-[11px]" style={{ color: 'var(--ph-text-3)' }}>Payout frequency</div>
                  </div>
                )}
                {rich?.payout_speed && (
                  <div className="rounded-2xl p-3.5 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--ph-border-subtle)' }}>
                    <Clock className="mx-auto mb-1.5 h-5 w-5" style={{ color: 'var(--ph-cyan)' }} />
                    <div className="text-[13px] font-bold" style={{ color: 'var(--ph-text-1)' }}>{String(rich.payout_speed)}</div>
                    <div className="text-[11px]" style={{ color: 'var(--ph-text-3)' }}>Payout speed</div>
                  </div>
                )}
                {trust?.total_funded_traders && (
                  <div className="rounded-2xl p-3.5 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--ph-border-subtle)' }}>
                    <Users className="mx-auto mb-1.5 h-5 w-5" style={{ color: 'var(--ph-violet)' }} />
                    <div className="text-[15px] font-bold" style={{ color: 'var(--ph-text-1)' }}>{String(trust.total_funded_traders)}</div>
                    <div className="text-[11px]" style={{ color: 'var(--ph-text-3)' }}>Funded traders</div>
                  </div>
                )}
                {trust?.total_payouts_amount && (
                  <div className="rounded-2xl p-3.5 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--ph-border-subtle)' }}>
                    <DollarSign className="mx-auto mb-1.5 h-5 w-5" style={{ color: 'var(--ph-amber)' }} />
                    <div className="text-[15px] font-bold" style={{ color: 'var(--ph-text-1)' }}>{String(trust.total_payouts_amount)}</div>
                    <div className="text-[11px]" style={{ color: 'var(--ph-text-3)' }}>Total paid out</div>
                  </div>
                )}
              </div>

              {/* Trustpilot score if present */}
              {trust?.trustpilot_score && (
                <div className="mt-4 flex items-center gap-3 rounded-2xl px-4 py-3"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--ph-border-subtle)' }}>
                  <Star className="h-5 w-5 shrink-0" style={{ color: '#FBBF24' }} fill="#FBBF24" />
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="ph-money text-xl font-bold" style={{ color: 'var(--ph-text-1)' }}>
                        {trust.trustpilot_score}
                      </span>
                      <span className="text-[12px]" style={{ color: 'var(--ph-text-3)' }}>
                        / 5 on Trustpilot
                        {trust.trustpilot_review_count && ` · ${trust.trustpilot_review_count} reviews`}
                      </span>
                    </div>
                    {/* Mini star bar */}
                    <div className="mt-1 h-1.5 w-32 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(trust.trustpilot_score / 5) * 100}%`,
                          background: 'linear-gradient(90deg,#FBBF24,#F59E0B)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* ── Trading rules quick-flags ──────────────────────────── */}
        {tradingFlags.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.155 }}
            className="mb-6 rounded-3xl ph-glass-strong p-5 md:p-6"
          >
            <h2 className="mb-4 text-lg font-bold md:text-xl" style={{ color: 'var(--ph-text-1)' }}>
              Trading rules
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {tradingFlags.map(({ label, val }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 rounded-2xl px-3.5 py-3"
                  style={{
                    background: val ? 'rgba(74,222,128,0.07)' : 'rgba(248,113,113,0.07)',
                    border: `1px solid ${val ? 'rgba(74,222,128,0.25)' : 'rgba(248,113,113,0.25)'}`,
                  }}
                >
                  {val
                    ? <Check className="h-4 w-4 shrink-0" style={{ color: 'var(--ph-emerald)' }} />
                    : <XIcon className="h-4 w-4 shrink-0" style={{ color: '#F87171' }} />
                  }
                  <span className="text-[13px] font-medium" style={{ color: 'var(--ph-text-2)' }}>{label}</span>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ── Pros / Cons ────────────────────────────────────────── */}
        {(pros.length > 0 || cons.length > 0) && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.16 }}
            className="mb-6 grid gap-4 md:grid-cols-2"
          >
            {pros.length > 0 && (
              <div className="relative overflow-hidden rounded-3xl ph-glass-strong p-5 md:p-6">
                <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 40% at 0% 0%,rgba(74,222,128,0.08) 0%,transparent 60%)' }} />
                <div className="relative">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-base font-bold md:text-lg" style={{ color: 'var(--ph-emerald)' }}>Pros</h3>
                    <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ background: 'rgba(74,222,128,0.12)', color: 'var(--ph-emerald)' }}>{pros.length}</span>
                  </div>
                  <ul className="space-y-2">
                    {pros.map((p, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.06 }}
                        className="flex items-start gap-2 text-[14px] leading-[1.55]"
                        style={{ color: 'var(--ph-text-2)' }}
                      >
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: 'var(--ph-emerald)' }} />
                        {p}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {cons.length > 0 && (
              <div className="relative overflow-hidden rounded-3xl ph-glass-strong p-5 md:p-6">
                <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 40% at 0% 0%,rgba(248,113,113,0.06) 0%,transparent 60%)' }} />
                <div className="relative">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-base font-bold md:text-lg" style={{ color: '#F87171' }}>Cons</h3>
                    <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ background: 'rgba(248,113,113,0.12)', color: '#F87171' }}>{cons.length}</span>
                  </div>
                  <ul className="space-y-2">
                    {cons.map((c, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.06 }}
                        className="flex items-start gap-2 text-[14px] leading-[1.55]"
                        style={{ color: 'var(--ph-text-2)' }}
                      >
                        <XIcon className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: '#F87171' }} />
                        {c}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </motion.section>
        )}

        {/* Summary fallback */}
        {!fullReview && summaryText && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.18 }}
            className="mb-6 rounded-3xl ph-glass-strong p-5 md:p-6"
          >
            <h2 className="mb-3 text-lg font-bold md:text-xl" style={{ color: 'var(--ph-text-1)' }}>Overview</h2>
            <p className="text-[15px] leading-[1.75]" style={{ color: 'var(--ph-text-2)' }}>{summaryText}</p>
          </motion.section>
        )}

        {/* ── Full in-depth review ───────────────────────────────── */}
        {fullReview && (
          <motion.section
            id="review"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.18 }}
            className="relative mb-6 overflow-hidden rounded-3xl ph-glass-strong p-5 md:p-8"
          >
            <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 30% at 100% 0%,rgba(34,211,238,0.07) 0%,transparent 55%)' }} />
            <div className="relative">
              <div className="mb-5 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'rgba(74,222,128,0.14)', border: '1px solid rgba(74,222,128,0.35)', color: 'var(--ph-emerald)' }}>
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--ph-emerald)' }}>In-depth review</div>
                  <h2 className="text-xl font-bold md:text-2xl" style={{ color: 'var(--ph-text-1)' }}>
                    Our full breakdown of {summary.name}
                  </h2>
                </div>
              </div>
              <MarkdownProse content={fullReview} />
            </div>
          </motion.section>
        )}

        {/* ── User reviews ───────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-6"
        >
          <ReviewsPanel reviews={userReviews} />
        </motion.section>

        {/* ── FAQ accordion ──────────────────────────────────────── */}
        {faqs.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.22 }}
            className="mb-6 overflow-hidden rounded-3xl ph-glass-strong p-5 md:p-6"
          >
            <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 40% 30% at 50% 0%,rgba(34,211,238,0.06) 0%,transparent 60%)' }} />
            <div className="relative">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'rgba(34,211,238,0.14)', border: '1px solid rgba(34,211,238,0.35)', color: 'var(--ph-cyan)' }}>
                  <HelpCircle className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-bold md:text-xl" style={{ color: 'var(--ph-text-1)' }}>
                  Frequently asked questions
                </h2>
              </div>
              <div className="space-y-2.5">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-2xl transition-colors"
                    style={{
                      background: openFaq === i ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${openFaq === i ? 'rgba(34,211,238,0.25)' : 'var(--ph-border-subtle)'}`,
                    }}
                  >
                    <button
                      type="button"
                      className="ph-focus-ring flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span className="text-[14px] font-semibold leading-[1.4]" style={{ color: 'var(--ph-text-1)' }}>
                        {faq.question}
                      </span>
                      <ChevronDown
                        className="h-4 w-4 shrink-0 transition-transform duration-200"
                        style={{ color: 'var(--ph-text-3)', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {openFaq === i && faq.answer && (
                        <motion.div
                          key="ans"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="border-t px-4 pb-4 pt-3 text-[14px] leading-[1.65]" style={{ borderColor: 'var(--ph-border-subtle)', color: 'var(--ph-text-2)' }}>
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* ── Quick facts + CTA ──────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.24 }}
          className="mb-6 grid gap-4 md:grid-cols-2"
        >
          <div className="rounded-3xl ph-glass-strong p-5 md:p-6">
            <h3 className="mb-4 text-base font-bold md:text-lg" style={{ color: 'var(--ph-text-1)' }}>Quick facts</h3>
            <div className="space-y-3">
              <FactRow label="Evaluation model" value={summary.evaluationModel} />
              <FactRow label="Profit split"     value={summary.profitSplit} />
              <FactRow label="Account tiers"    value={summary.accountSizes.map((s) => `$${(s / 1000).toFixed(0)}K`).join(' · ')} />
              {summary.headquarters && <FactRow label="Headquarters"   value={summary.headquarters} />}
              {summary.founded      && <FactRow label="Founded"        value={String(summary.founded)} />}
              {rich?.ceo            && <FactRow label="CEO"            value={String(rich.ceo)} />}
              {rich?.parent_company && <FactRow label="Parent company" value={String(rich.parent_company)} />}
              {rich?.leverage       && <FactRow label="Leverage"       value={String(rich.leverage)} />}
              {rich?.reset_fee      && <FactRow label="Reset fee"      value={String(rich.reset_fee)} />}
              {rich?.spreads        && <FactRow label="Spreads"        value={String(rich.spreads)} />}
              {rich?.commission     && <FactRow label="Commission"     value={String(rich.commission)} />}
              {(rich?.payout_methods as string[] | undefined)?.length && (
                <FactRow label="Payout methods" value={(rich.payout_methods as string[]).join(', ')} />
              )}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl ph-glass-strong p-5 md:p-6">
            <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse 70% 50% at 50% 100%,${summary.logoColor}18 0%,transparent 60%)` }} />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <h3 className="mb-3 text-base font-bold md:text-lg" style={{ color: 'var(--ph-text-1)' }}>
                  Ready to take the challenge?
                </h3>
                <p className="text-[14px] leading-[1.6]" style={{ color: 'var(--ph-text-2)' }}>
                  Buy your {summary.name} challenge through us and get discounted pricing plus a
                  rebate on the fee. Everything else stays the same.
                </p>
                {totalCashback > 0 && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[13px]"
                    style={{ background: 'rgba(74,222,128,0.10)', border: '1px solid rgba(74,222,128,0.25)' }}>
                    <Zap className="h-3.5 w-3.5" style={{ color: 'var(--ph-emerald)' }} />
                    <span style={{ color: 'var(--ph-text-2)' }}>
                      Save up to <span className="ph-money font-bold" style={{ color: 'var(--ph-emerald)' }}>${totalCashback}</span> across all tiers
                    </span>
                  </div>
                )}
              </div>
              <a
                href={summary.affiliateUrl ?? '#'}
                target="_blank"
                rel="noopener sponsored"
                className="ph-focus-ring group mt-4 flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-[14px] font-semibold"
                style={{ background: 'linear-gradient(135deg,#4ADE80 0%,#22D3EE 100%)', color: '#05070E', boxShadow: '0 0 32px rgba(74,222,128,0.3)' }}
              >
                Start a challenge with {summary.name}
                <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </motion.section>

        {/* ── Verification footer ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.26 }}
          className="flex flex-col items-center gap-1.5 rounded-2xl p-5 text-center text-[12px] ph-glass"
          style={{ color: 'var(--ph-text-3)' }}
        >
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5" style={{ color: 'var(--ph-emerald)' }} />
            <span style={{ color: 'var(--ph-text-2)' }}>
              Audited on {summary.lastVerified} · Public fee page, payout records, and user forums cross-checked
            </span>
          </div>
          <div>We re-audit every firm on a rolling 90-day cycle for peace of mind.</div>
        </motion.div>

      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Subcomponents                                                       */
/* ------------------------------------------------------------------ */

function MetricCard({ icon: Icon, label, value, color }: { icon: typeof Target; label: string; value: string; color: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl ph-glass p-3 md:p-4">
      <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse 80% 60% at 0% 0%,${color}0D 0%,transparent 70%)` }} />
      <div className="relative">
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--ph-text-3)' }}>
          <Icon className="h-3.5 w-3.5" style={{ color }} />
          {label}
        </div>
        <div className="mt-1.5 truncate text-base font-bold md:text-lg" style={{ color: 'var(--ph-text-1)' }}>{value}</div>
      </div>
    </div>
  );
}
