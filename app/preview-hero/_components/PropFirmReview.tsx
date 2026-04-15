'use client';

/**
 * Prop firm in-depth review page — at /preview-hero/firms/[slug]/.
 * Same shape as BrokerReview but sourced from a different schema
 * (Prop Firms/data/*.json has more structured fields like
 * `challenge_phases`, `profit_split`, `payout_methods`, etc.).
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
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
  ExternalLink,
  Trophy,
} from 'lucide-react';
import { initialsOf, isImageLogo } from '../_data/entities';
import { MarkdownProse, ReviewsPanel, FactRow } from './ReviewShared';

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
  review_content?: string; // Prop Firms/data uses this name sometimes
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

export default function PropFirmReview({ summary, rich }: { summary: Summary; rich: Rich | null }) {
  const pricingRows = Object.entries(summary.pricing)
    .map(([k, v]) => ({ size: Number(k), ...v }))
    .filter((r) => !Number.isNaN(r.size))
    .sort((a, b) => a.size - b.size);

  const lowestPrice = pricingRows[0]?.discounted ?? 0;
  const totalCashback = pricingRows.reduce((sum, r) => sum + r.additionalRebate, 0);

  const fullReview =
    (typeof rich?.fullReview === 'string' && rich.fullReview.length > 200 && rich.fullReview) ||
    (typeof rich?.review_content === 'string' && rich.review_content.length > 200 && rich.review_content) ||
    '';
  const summaryText = typeof rich?.summary === 'string' ? rich.summary : typeof rich?.description === 'string' ? rich.description : '';
  const pros = rich?.pros ?? [];
  const cons = rich?.cons ?? [];
  const phases = rich?.challenge_phases ?? [];
  const faqs = rich?.faqData ?? [];
  const userReviews = rich?.userReviewsData ?? null;
  const trust = rich?.trust_and_credibility ?? null;

  return (
    <div className="preview-hero-root relative isolate min-h-screen overflow-hidden">
      <div className="ph-mesh-bg" />
      <div className="absolute inset-0 ph-grid-bg opacity-30" />

      <div className="relative z-10 mx-auto max-w-[1100px] px-5 pb-20 pt-6 md:px-8 lg:pt-10">
        {/* Breadcrumb */}
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

        {/* Hero */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-6 overflow-hidden rounded-3xl ph-glass-strong p-6 md:p-8"
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: `radial-gradient(ellipse 60% 40% at 100% 0%, ${summary.logoColor}28 0%, transparent 60%)` }}
          />
          <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div
                className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl md:h-20 md:w-20"
                style={{
                  background: `linear-gradient(135deg, ${summary.logoColor}33 0%, ${summary.logoColor}11 100%)`,
                  border: `1px solid ${summary.logoColor}55`,
                  padding: isImageLogo(summary.logo) ? 10 : 0,
                  color: summary.logoColor,
                }}
              >
                {isImageLogo(summary.logo) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={summary.logo!} alt="" className="h-full w-full object-contain" loading="eager" />
                ) : (
                  <span className="text-xl font-bold md:text-2xl">{initialsOf(summary.name)}</span>
                )}
              </div>

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

                <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-tight leading-[1.1]">
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
            </div>

            <div className="flex flex-col items-stretch gap-3 md:items-end">
              <div className="flex items-center gap-2 rounded-2xl px-4 py-2.5 ph-glass" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <Star className="h-5 w-5" style={{ color: '#FBBF24' }} fill="#FBBF24" />
                <span className="ph-money text-2xl font-bold" style={{ color: 'var(--ph-text-1)' }}>
                  {summary.rating.toFixed(1)}
                </span>
                <span className="text-[13px]" style={{ color: 'var(--ph-text-3)' }}>
                  / 10
                </span>
              </div>

              <a
                href={summary.affiliateUrl ?? '#'}
                target="_blank"
                rel="noopener sponsored"
                className="ph-focus-ring group flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-[14px] font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #4ADE80 0%, #22D3EE 100%)',
                  color: '#05070E',
                  boxShadow: '0 0 32px rgba(74,222,128,0.35), 0 1px 0 rgba(255,255,255,0.25) inset',
                }}
              >
                Start a challenge
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </motion.header>

        {/* Quick metrics */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4"
        >
          <MetricCard icon={Target} label="Evaluation" value={summary.evaluationModel} color="var(--ph-emerald)" />
          <MetricCard icon={TrendingUp} label="Profit split" value={summary.profitSplit} color="var(--ph-cyan)" />
          <MetricCard icon={Wallet} label="Min challenge" value={`$${lowestPrice.toLocaleString()}`} color="var(--ph-violet)" />
          <MetricCard icon={Activity} label="Tiers" value={`${summary.accountSizes.length}`} color="var(--ph-amber)" />
        </motion.div>

        {/* Cashback strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6 overflow-hidden rounded-3xl ph-glass-strong p-5 md:p-6"
          style={{ background: 'radial-gradient(ellipse at 0% 50%, rgba(74,222,128,0.10) 0%, transparent 60%), rgba(10,14,26,0.85)' }}
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
                    background: 'linear-gradient(180deg, #FFFFFF 0%, #CBD5E1 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  <CountUp end={totalCashback} duration={1.2} separator="," prefix="$" />
                </span>
                <span className="text-[13px]" style={{ color: 'var(--ph-text-3)' }}>
                  across all tiers
                </span>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px]" style={{ background: 'rgba(74, 222, 128, 0.12)', border: '1px solid rgba(74, 222, 128, 0.3)', color: 'var(--ph-emerald)' }}>
              <Zap className="h-3.5 w-3.5" />
              Discount + additional rebate
            </div>
          </div>
        </motion.div>

        {/* Pricing table */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.12 }}
          className="mb-6 rounded-3xl ph-glass-strong p-5 md:p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold md:text-xl" style={{ color: 'var(--ph-text-1)' }}>
              Account sizes & pricing
            </h2>
            <div className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.12em]" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--ph-text-2)' }}>
              {pricingRows.length} tiers
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-[14px]">
              <thead>
                <tr className="border-b text-left text-[11px] uppercase tracking-[0.1em]" style={{ borderColor: 'var(--ph-border-subtle)', color: 'var(--ph-text-3)' }}>
                  <th className="pb-3">Account</th>
                  <th className="pb-3 text-right">Standard</th>
                  <th className="pb-3 text-right">Your price</th>
                  <th className="pb-3 text-right">+ Rebate</th>
                  <th className="pb-3 text-right">Total saving</th>
                </tr>
              </thead>
              <tbody>
                {pricingRows.map((row) => {
                  const saving = row.standard - row.discounted + row.additionalRebate;
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
                        <span className="ph-money inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold" style={{ background: 'rgba(74, 222, 128, 0.12)', color: 'var(--ph-emerald)' }}>
                          <Zap className="h-3 w-3" />${saving}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Challenge phases */}
        {phases.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.14 }}
            className="mb-6 rounded-3xl ph-glass-strong p-5 md:p-6"
          >
            <div className="mb-4">
              <h2 className="text-lg font-bold md:text-xl" style={{ color: 'var(--ph-text-1)' }}>
                Challenge rules
              </h2>
              <p className="mt-1 text-[13px]" style={{ color: 'var(--ph-text-3)' }}>
                Phase-by-phase evaluation conditions
              </p>
            </div>
            <div className="space-y-3">
              {phases.map((phase, i) => (
                <div key={i} className="rounded-2xl p-4 ph-glass" style={{ border: '1px solid var(--ph-border-subtle)' }}>
                  <div className="mb-2 text-[13px] font-semibold" style={{ color: 'var(--ph-emerald)' }}>
                    {phase.name ?? `Phase ${i + 1}`}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-[13px] md:grid-cols-4">
                    {phase.profit_target && <MiniFact label="Profit target" value={phase.profit_target} />}
                    {phase.max_daily_loss && <MiniFact label="Daily loss limit" value={phase.max_daily_loss} />}
                    {phase.max_total_loss && <MiniFact label="Max loss" value={phase.max_total_loss} />}
                    {phase.min_trading_days !== undefined && <MiniFact label="Min days" value={String(phase.min_trading_days)} />}
                    {phase.time_limit && <MiniFact label="Time limit" value={phase.time_limit} />}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Payout + trust strip */}
        {(rich?.payout_frequency || rich?.payout_speed || trust?.total_payouts_amount || trust?.total_funded_traders) && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mb-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4"
          >
            {rich?.payout_frequency && <MetricCard icon={Wallet} label="Payout frequency" value={String(rich.payout_frequency)} color="var(--ph-emerald)" />}
            {rich?.payout_speed && <MetricCard icon={Clock} label="Payout speed" value={String(rich.payout_speed)} color="var(--ph-cyan)" />}
            {trust?.total_funded_traders && <MetricCard icon={Target} label="Funded traders" value={String(trust.total_funded_traders)} color="var(--ph-violet)" />}
            {trust?.total_payouts_amount && <MetricCard icon={TrendingUp} label="Total paid out" value={String(trust.total_payouts_amount)} color="var(--ph-amber)" />}
          </motion.section>
        )}

        {/* Pros / Cons */}
        {(pros.length > 0 || cons.length > 0) && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.16 }}
            className="mb-6 grid gap-4 md:grid-cols-2"
          >
            {pros.length > 0 && (
              <div className="rounded-3xl ph-glass-strong p-5 md:p-6">
                <h3 className="mb-3 text-base font-bold md:text-lg" style={{ color: 'var(--ph-emerald)' }}>
                  Pros
                </h3>
                <ul className="space-y-2">
                  {pros.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-[14px] leading-[1.55]" style={{ color: 'var(--ph-text-2)' }}>
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: 'var(--ph-emerald)' }} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {cons.length > 0 && (
              <div className="rounded-3xl ph-glass-strong p-5 md:p-6">
                <h3 className="mb-3 text-base font-bold md:text-lg" style={{ color: '#F87171' }}>
                  Cons
                </h3>
                <ul className="space-y-2">
                  {cons.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-[14px] leading-[1.55]" style={{ color: 'var(--ph-text-2)' }}>
                      <XIcon className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: '#F87171' }} />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.section>
        )}

        {/* Summary fallback if no fullReview */}
        {!fullReview && summaryText && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.18 }}
            className="mb-6 rounded-3xl ph-glass-strong p-5 md:p-6"
          >
            <h2 className="mb-3 text-lg font-bold md:text-xl" style={{ color: 'var(--ph-text-1)' }}>
              Overview
            </h2>
            <p className="text-[15px] leading-[1.75]" style={{ color: 'var(--ph-text-2)' }}>
              {summaryText}
            </p>
          </motion.section>
        )}

        {/* FULL IN-DEPTH REVIEW */}
        {fullReview && (
          <motion.section
            id="review"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.18 }}
            className="mb-6 rounded-3xl ph-glass-strong p-5 md:p-8"
          >
            <div className="mb-5 flex items-center gap-2">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: 'rgba(74, 222, 128, 0.14)', border: '1px solid rgba(74, 222, 128, 0.35)', color: 'var(--ph-emerald)' }}
              >
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--ph-emerald)' }}>
                  In-depth review
                </div>
                <h2 className="text-xl font-bold md:text-2xl" style={{ color: 'var(--ph-text-1)' }}>
                  Our full breakdown of {summary.name}
                </h2>
              </div>
            </div>
            <MarkdownProse content={fullReview} />
          </motion.section>
        )}

        {/* Reviews */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-6"
        >
          <ReviewsPanel reviews={userReviews} />
        </motion.section>

        {/* FAQ */}
        {faqs.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.22 }}
            className="mb-6 rounded-3xl ph-glass-strong p-5 md:p-6"
          >
            <div className="mb-4 flex items-center gap-2">
              <HelpCircle className="h-4 w-4" style={{ color: 'var(--ph-cyan)' }} />
              <h2 className="text-lg font-bold md:text-xl" style={{ color: 'var(--ph-text-1)' }}>
                Frequently asked questions
              </h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details key={i} className="group rounded-2xl p-4 ph-glass" style={{ border: '1px solid var(--ph-border-subtle)' }}>
                  <summary className="cursor-pointer list-none text-[14px] font-semibold" style={{ color: 'var(--ph-text-1)' }}>
                    <span className="inline-block transition-transform group-open:rotate-90">›</span> {faq.question}
                  </summary>
                  {faq.answer && (
                    <p className="mt-2 text-[14px] leading-[1.65]" style={{ color: 'var(--ph-text-2)' }}>
                      {faq.answer}
                    </p>
                  )}
                </details>
              ))}
            </div>
          </motion.section>
        )}

        {/* Quick facts + CTA */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.24 }}
          className="mb-6 grid gap-4 md:grid-cols-2"
        >
          <div className="rounded-3xl ph-glass-strong p-5 md:p-6">
            <h3 className="mb-4 text-base font-bold md:text-lg" style={{ color: 'var(--ph-text-1)' }}>
              Quick facts
            </h3>
            <div className="space-y-3">
              <FactRow label="Evaluation model" value={summary.evaluationModel} />
              <FactRow label="Profit split" value={summary.profitSplit} />
              <FactRow label="Account tiers" value={summary.accountSizes.map((s) => `$${(s / 1000).toFixed(0)}K`).join(' · ')} />
              {summary.headquarters && <FactRow label="Headquarters" value={summary.headquarters} />}
              {summary.founded && <FactRow label="Founded" value={String(summary.founded)} />}
              {rich?.ceo && <FactRow label="CEO" value={String(rich.ceo)} />}
              {rich?.parent_company && <FactRow label="Parent company" value={String(rich.parent_company)} />}
              {rich?.leverage && <FactRow label="Leverage" value={String(rich.leverage)} />}
              {rich?.reset_fee && <FactRow label="Reset fee" value={String(rich.reset_fee)} />}
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-3xl ph-glass-strong p-5 md:p-6">
            <div>
              <h3 className="mb-3 text-base font-bold md:text-lg" style={{ color: 'var(--ph-text-1)' }}>
                Ready to take the challenge?
              </h3>
              <p className="text-[14px] leading-[1.6]" style={{ color: 'var(--ph-text-2)' }}>
                Buy your {summary.name} challenge through us and get discounted pricing plus a
                rebate on the fee. Everything else stays the same.
              </p>
            </div>
            <a
              href={summary.affiliateUrl ?? '#'}
              target="_blank"
              rel="noopener sponsored"
              className="ph-focus-ring group mt-4 flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-[14px] font-semibold"
              style={{
                background: 'linear-gradient(135deg, #4ADE80 0%, #22D3EE 100%)',
                color: '#05070E',
                boxShadow: '0 0 32px rgba(74,222,128,0.3)',
              }}
            >
              Start a challenge with {summary.name}
              <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </motion.section>

        {/* Verification footer */}
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
          <div style={{ color: 'var(--ph-text-4)' }}>
            We re-audit every firm on a rolling 90-day cycle for peace of mind.
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Target;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl ph-glass p-3 md:p-4">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--ph-text-3)' }}>
        <Icon className="h-3.5 w-3.5" style={{ color }} />
        {label}
      </div>
      <div className="mt-1.5 truncate text-base font-bold md:text-lg" style={{ color: 'var(--ph-text-1)' }}>
        {value}
      </div>
    </div>
  );
}

function MiniFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.1em]" style={{ color: 'var(--ph-text-3)' }}>
        {label}
      </div>
      <div className="mt-0.5 font-semibold" style={{ color: 'var(--ph-text-1)' }}>
        {value}
      </div>
    </div>
  );
}
