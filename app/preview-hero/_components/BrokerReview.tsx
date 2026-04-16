'use client';

/**
 * Broker In-depth Review — full redesign matching the hero page theme.
 *
 * Sections (in order):
 *   1. Breadcrumb
 *   2. Sticky section jump nav
 *   3. Hero — dramatic glass card, broker colour glow, regulatory trust pills (with flags),
 *             SVG rating ring, cashback preview, CTA
 *   4. Quick-metrics 4-card strip
 *   5. Cashback highlight strip + animated bar chart
 *   6. Rebate rates table with bar visualisers
 *   7. Scores breakdown (if data present) — horizontal animated bars
 *   8. Regulation cards with country flags + tier badges
 *   9. Pros / Cons (generic placeholders filtered out)
 *  10. Full in-depth review (fullReview markdown, verbatim)
 *  11. User reviews panel
 *  12. FAQ animated accordion
 *  13. Quick facts + CTA
 *  14. Verification footer
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
  DollarSign,
  Globe2,
  Layers,
  Wallet,
  Check,
  X as XIcon,
  ExternalLink,
  BookOpen,
  HelpCircle,
  ChevronDown,
  TrendingUp,
  Award,
  BarChart2,
} from 'lucide-react';
import { initialsOf, isImageLogo } from '../_data/entities';
import { MarkdownProse, ReviewsPanel, FactRow } from './ReviewShared';
import { BrokerLogo } from './BrokerLogo';
import { PlatformBadges } from './PlatformBadges';
import { extractPaymentMethods, PaymentBadges } from './PaymentBadges';

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

type Summary = {
  slug: string;
  name: string;
  logo: string | null;
  logoColor: string;
  rating: number;
  minDeposit: number;
  jurisdictions: string[];
  jurisdictionIds: string[];
  platforms: string[];
  accountTypes: string[];
  defaultAccountType: string;
  rebateRates: Array<{ accountType: string; instrumentClass: string; ratePerLot: number; _synthesized?: boolean }>;
  lastVerified: string;
  popularityRank: number;
  headquarters: string | null;
  founded: string | null;
  affiliateUrl: string | null;
};

type EntityRegulation = {
  name?: string;
  regulator?: string;
  licenseNumber?: string;
  country?: string;
  flag?: string;
  status?: string;
  licenseType?: string;
  depositProtection?: string;
  tier?: number | string;
};

type FaqEntry = { question?: string; answer?: string };

type Rich = Record<string, unknown> & {
  fullReview?: string;
  description?: string;
  pros?: string[];
  cons?: string[];
  features?: string[];
  entityRegulations?: EntityRegulation[];
  faqData?: FaqEntry[];
  userReviewsData?: any;
  companyProfileData?: { founded?: string; headquarters?: string; parentCompany?: string; employees?: string };
  quickStats?: { minDeposit?: string; regulators?: string; tradingCost?: string; leverage?: string; platforms?: string; instruments?: string };
  avgSpreadEurUsd?: number;
  scores?: Record<string, number>;
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

const MONTHLY_LOTS = 40;

/** ISO 3166-1 alpha-2 code → flag emoji */
function codeToFlag(code: string): string {
  if (!code || code.length < 2) return '';
  const c = code.slice(0, 2).toUpperCase();
  try {
    return String.fromCodePoint(c.charCodeAt(0) + 127397) +
           String.fromCodePoint(c.charCodeAt(1) + 127397);
  } catch { return ''; }
}

/** Map common regulator abbreviations to country codes */
const REGULATOR_COUNTRY: Record<string, string> = {
  fca: 'gb', pra: 'gb',
  asic: 'au',
  cysec: 'cy',
  nfa: 'us', cftc: 'us', finra: 'us',
  bafin: 'de',
  mas: 'sg',
  sfc: 'hk',
  finma: 'ch',
  mfsa: 'mt',
  ifsc: 'bz', fsc: 'bz',
  cima: 'ky',
  fma: 'nz',
  fsca: 'za',
  dfsa: 'ae', fsra: 'ae', adgm: 'ae', sca: 'ae',
  fsa: 'jp', jfsa: 'jp',
  iiroc: 'ca',
  amf: 'fr',
  afm: 'nl',
  consob: 'it',
  cnmv: 'es',
  cmvm: 'pt',
  fma_at: 'at',
  fsb: 'za',
  secp: 'pk',
  sc: 'my',
  sec: 'us',
  fsra_abu: 'ae',
  msc: 'mu', fscm: 'mu',
  fsas: 'sc',
  cbr: 'ru',
  nbrb: 'by',
};

function regulatorToFlag(name: string): string {
  const key = name.toLowerCase().replace(/[^a-z]/g, '');
  const code = REGULATOR_COUNTRY[key];
  return code ? codeToFlag(code) : '';
}

function tierColor(tier: number | string | undefined): { bg: string; text: string; label: string } {
  const t = Number(tier);
  if (t === 1) return { bg: 'rgba(74,222,128,0.14)', text: 'var(--ph-emerald)', label: 'Tier 1' };
  if (t === 2) return { bg: 'rgba(34,211,238,0.14)', text: 'var(--ph-cyan)',    label: 'Tier 2' };
  if (t === 3) return { bg: 'rgba(251,191,36,0.14)',  text: 'var(--ph-amber)',   label: 'Tier 3' };
  return { bg: 'rgba(167,139,250,0.14)', text: 'var(--ph-violet)', label: String(tier ?? 'Offshore') };
}

/** Filter out auto-generated placeholder pros/cons so only meaningful copy shows. */
function filterMeaningful(items: string[]): string[] {
  const SKIP = [
    /^regulated by /i,
    /^supports /i,
    /^low entry barrier$/i,
    /offshore regulation offers/i,
    /spreads may vary based on market conditions/i,
  ];
  return items.filter((s) => s.length > 20 && !SKIP.some((re) => re.test(s.trim())));
}

function ratingStars(rating: number, outOf = 10) {
  const filled = Math.round((rating / outOf) * 5);
  return Array.from({ length: 5 }, (_, i) => i < filled);
}

function prettyScoreKey(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                      */
/* ------------------------------------------------------------------ */

/** Animated SVG rating ring */
function RatingRing({ rating, max = 10, color = '#4ADE80' }: { rating: number; max?: number; color?: string }) {
  const pct = Math.min(1, rating / max);
  const r = 34;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="90" height="90" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={`rg-${rating}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
        <circle cx="45" cy="45" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5.5" />
        <motion.circle
          cx="45" cy="45" r={r} fill="none"
          stroke={`url(#rg-${rating})`} strokeWidth="5.5"
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

/** Animated bar chart of cashback at different lot volumes */
function CashbackBars({ ratePerLot, highlightLots = MONTHLY_LOTS }: { ratePerLot: number; highlightLots?: number }) {
  const volumes = [10, 20, 40, 80, 120];
  const maxEarning = ratePerLot * Math.max(...volumes);
  return (
    <div className="mt-5 space-y-2.5">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--ph-text-3)' }}>
        Monthly cashback by trading volume
      </div>
      {volumes.map((lots, idx) => {
        const amount = ratePerLot * lots;
        const pct = maxEarning > 0 ? (amount / maxEarning) * 100 : 0;
        const isHl = lots === highlightLots;
        return (
          <div key={lots} className="flex items-center gap-3">
            <div className="w-[52px] shrink-0 text-right text-[12px] tabular-nums" style={{ color: 'var(--ph-text-3)' }}>
              {lots} lots
            </div>
            <div className="relative h-7 flex-1 overflow-hidden rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <motion.div
                className="absolute inset-y-0 left-0 rounded-lg"
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: idx * 0.07 }}
                style={{
                  background: isHl
                    ? 'linear-gradient(90deg,#4ADE80,#22D3EE)'
                    : 'linear-gradient(90deg,rgba(74,222,128,0.3),rgba(34,211,238,0.3))',
                }}
              />
              {isHl && (
                <div className="absolute inset-y-0 left-3 flex items-center">
                  <span className="text-[10px] font-bold" style={{ color: '#05070E' }}>← typical</span>
                </div>
              )}
            </div>
            <div
              className="w-[72px] shrink-0 text-right ph-money text-[13px] font-semibold tabular-nums"
              style={{ color: isHl ? 'var(--ph-emerald)' : 'var(--ph-text-2)' }}
            >
              ${amount.toFixed(0)}/mo
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Horizontal animated score bars */
function ScoreBars({ scores }: { scores: Record<string, number> }) {
  const entries = Object.entries(scores).filter(([, v]) => typeof v === 'number' && v > 0);
  if (!entries.length) return null;
  return (
    <div className="space-y-3.5">
      {entries.map(([key, val], idx) => {
        const pct = Math.min(100, (val / 10) * 100);
        const color = pct >= 80 ? 'var(--ph-emerald)' : pct >= 60 ? 'var(--ph-cyan)' : pct >= 40 ? 'var(--ph-amber)' : '#F87171';
        return (
          <div key={key}>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span className="text-[13px]" style={{ color: 'var(--ph-text-2)' }}>{prettyScoreKey(key)}</span>
              <span className="ph-money text-[13px] font-bold" style={{ color }}>{val.toFixed(1)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: idx * 0.06 }}
                style={{ background: `linear-gradient(90deg,${color},${color}aa)` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Regulation card with flag + tier badge */
/** Get 2-letter ISO country code for a regulator (for flagcdn images) */
function regToCountryCode(regName: string): string {
  const key = regName.toLowerCase().replace(/[^a-z]/g, '');
  return REGULATOR_COUNTRY[key] ?? '';
}

function RegCard({ reg, idx }: { reg: EntityRegulation; idx: number }) {
  const regName = reg.regulator || reg.name || '—';
  // Derive country code for flagcdn.com image
  const countryCode = regToCountryCode(regName);
  const tc = tierColor(reg.tier);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: idx * 0.07 }}
      className="relative overflow-hidden rounded-2xl p-4"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--ph-border-subtle)',
      }}
    >
      {/* Top row: flag image + regulator + tier */}
      <div className="mb-2.5 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {countryCode ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`https://flagcdn.com/w80/${countryCode}.png`}
              alt={countryCode.toUpperCase()}
              width={32}
              height={24}
              className="rounded-[2px] shrink-0"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <Shield className="h-7 w-7 shrink-0" style={{ color: 'var(--ph-emerald)' }} />
          )}
          <div>
            <div className="text-[15px] font-bold" style={{ color: 'var(--ph-text-1)' }}>{regName}</div>
            {reg.country && (
              <div className="text-[12px]" style={{ color: 'var(--ph-text-3)' }}>{reg.country}</div>
            )}
          </div>
        </div>
        {reg.tier !== undefined && (
          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
            style={{ background: tc.bg, color: tc.text, border: `1px solid ${tc.text}33` }}
          >
            {tc.label}
          </span>
        )}
      </div>

      {/* License number */}
      {reg.licenseNumber && (
        <div className="mb-1.5 flex items-center gap-1.5">
          <Shield className="h-3 w-3 shrink-0" style={{ color: 'var(--ph-violet)' }} />
          <span className="ph-money text-[12px]" style={{ color: 'var(--ph-text-2)' }}>
            {reg.licenseNumber}
          </span>
        </div>
      )}

      {/* Status badge */}
      <div className="flex flex-wrap gap-1.5">
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
          style={{ background: 'rgba(74,222,128,0.12)', color: 'var(--ph-emerald)', border: '1px solid rgba(74,222,128,0.25)' }}
        >
          <Check className="h-3 w-3" />
          {reg.status || 'Active'}
        </span>
        {reg.licenseType && (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px]"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--ph-text-3)', border: '1px solid var(--ph-border-subtle)' }}
          >
            {reg.licenseType}
          </span>
        )}
      </div>

      {/* Deposit protection */}
      {reg.depositProtection && (
        <div className="mt-2 flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--ph-cyan)' }}>
          <Shield className="h-3 w-3" />
          <span>{reg.depositProtection}</span>
        </div>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                      */
/* ------------------------------------------------------------------ */

export default function BrokerReview({ summary, rich }: { summary: Summary; rich: Rich | null }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const highestRate = Math.max(...summary.rebateRates.map((r) => r.ratePerLot), 0);
  const bestMonthly = highestRate * MONTHLY_LOTS;
  const bestAnnual  = bestMonthly * 12;

  const ratesByAccount = summary.accountTypes.map((at) => {
    const rates = summary.rebateRates.filter((r) => r.accountType === at);
    const forex = rates.find((r) => r.instrumentClass === 'forex') ?? rates[0];
    return { accountType: at, forexRate: forex?.ratePerLot ?? 0 };
  });

  const entityRegs   = rich?.entityRegulations ?? [];
  const rawPros      = rich?.pros ?? [];
  const rawCons      = rich?.cons ?? [];
  const pros         = filterMeaningful(rawPros);
  const cons         = filterMeaningful(rawCons);
  const faqs         = rich?.faqData ?? [];
  const userReviews  = rich?.userReviewsData ?? null;
  const fullReview   = typeof rich?.fullReview === 'string' && rich.fullReview.length > 200 ? rich.fullReview : '';
  const description  = typeof rich?.description === 'string' ? rich.description : '';
  const stars        = ratingStars(summary.rating);
  const scores       = rich?.scores && Object.keys(rich.scores).length > 0 ? rich.scores : null;
  const paymentMethods = extractPaymentMethods(fullReview || (typeof rich?.description === 'string' ? rich.description : ''));

  // Build jurisdiction pills with country codes for flagcdn.com images
  const jurisdictionPills = summary.jurisdictions.slice(0, 8).map((j, idx) => {
    const rawId = summary.jurisdictionIds[idx] ?? '';
    // jurisdictionIds are like "au-asic", "cy-cysec" — extract the 2-letter country code
    const countryCode = rawId.slice(0, 2).toLowerCase();
    return { name: j, countryCode: countryCode.length === 2 ? countryCode : '' };
  });

  const SECTIONS = [
    { id: 'overview',    label: 'Overview'    },
    { id: 'cashback',    label: 'Cashback'    },
    ...(scores ? [{ id: 'scores', label: 'Scores' }] : []),
    { id: 'regulation',  label: 'Regulation'  },
    ...(fullReview ? [{ id: 'review', label: 'Review' }] : []),
    ...(userReviews ? [{ id: 'reviews', label: 'Reviews' }] : []),
    ...(faqs.length  ? [{ id: 'faq',     label: 'FAQ'     }] : []),
  ];

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="preview-hero-root relative isolate min-h-screen overflow-hidden">
      <div className="ph-mesh-bg" />
      <div className="absolute inset-0 ph-grid-bg opacity-30" />

      <div className="relative z-10 mx-auto max-w-[1100px] px-5 pb-24 pt-6 md:px-8 lg:pt-10">

        {/* ── Breadcrumb ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4 flex items-center gap-3 text-[13px]"
          style={{ color: 'var(--ph-text-3)' }}
        >
          <Link
            href="/preview-hero/"
            className="ph-focus-ring inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ph-glass transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to hero
          </Link>
          <span className="opacity-50">›</span>
          <span>Brokers</span>
          <span className="opacity-50">›</span>
          <span style={{ color: 'var(--ph-text-1)' }}>{summary.name}</span>
        </motion.div>

        {/* ── Section jump nav ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="no-scrollbar sticky top-0 z-30 mb-7 -mx-5 flex gap-2 overflow-x-auto px-5 py-3 md:-mx-8 md:px-8"
          style={{
            background: 'rgba(5,7,14,0.75)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--ph-border-subtle)',
          }}
        >
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollTo(s.id)}
              className="ph-focus-ring whitespace-nowrap rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ph-glass hover:text-white"
              style={{ color: 'var(--ph-text-2)' }}
            >
              {s.label}
            </button>
          ))}
        </motion.div>

        {/* ── Hero card ──────────────────────────────────────────── */}
        <motion.header
          id="overview"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-6 overflow-hidden rounded-3xl ph-glass-strong"
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: `radial-gradient(ellipse 80% 60% at -10% -10%, ${summary.logoColor}28 0%, transparent 55%)` }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: `radial-gradient(ellipse 50% 50% at 110% 110%, ${summary.logoColor}14 0%, transparent 60%)` }}
          />
          <div className="absolute inset-0 ph-grid-bg opacity-10" />

          <div className="relative p-6 md:p-8 lg:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

              {/* LEFT — logo · name · meta · regulator pills */}
              <div className="flex-1">
                <div className="flex items-start gap-4 md:gap-5">
                  <BrokerLogo logo={summary.logo} name={summary.name} logoColor={summary.logoColor} size={76} className="md:!h-20 md:!w-20" />

                  <div className="flex-1">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--ph-text-3)' }}>
                      <span className="ph-live-dot" aria-hidden />
                      Broker review
                      {summary.popularityRank <= 20 && (
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px]"
                          style={{ background: 'rgba(74,222,128,0.12)', color: 'var(--ph-emerald)', border: '1px solid rgba(74,222,128,0.25)' }}>
                          <Award className="h-2.5 w-2.5" />
                          #{summary.popularityRank} most popular
                        </span>
                      )}
                    </div>

                    <h1 className="text-[clamp(1.9rem,4.5vw,3rem)] font-bold leading-[1.07] tracking-[-0.025em]">
                      <span className="ph-gradient-text">{summary.name}</span>{' '}
                      <span className="ph-gradient-text-brand">Review</span>
                    </h1>

                    <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]" style={{ color: 'var(--ph-text-2)' }}>
                      {summary.founded && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          Since {summary.founded}
                        </span>
                      )}
                      {summary.headquarters && (
                        <>
                          <span className="opacity-30">·</span>
                          <span>{summary.headquarters}</span>
                        </>
                      )}
                      <span className="opacity-30">·</span>
                      <span className="flex items-center gap-1.5" style={{ color: 'var(--ph-emerald)' }}>
                        <Shield className="h-3.5 w-3.5" />
                        Audited {summary.lastVerified}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Regulatory trust pills — with country flags */}
                {jurisdictionPills.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {jurisdictionPills.map((pill) => (
                      <span
                        key={pill.name}
                        className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-semibold ph-glass"
                        style={{ color: 'var(--ph-text-1)', border: '1px solid var(--ph-border-subtle)' }}
                      >
                        {pill.countryCode ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`https://flagcdn.com/w40/${pill.countryCode}.png`}
                            alt={pill.countryCode.toUpperCase()}
                            width={20}
                            height={15}
                            className="rounded-[2px]"
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <Shield className="h-4 w-4" style={{ color: 'var(--ph-emerald)' }} />
                        )}
                        {pill.name}
                      </span>
                    ))}
                    {summary.jurisdictions.length > 8 && (
                      <span className="rounded-full px-2.5 py-1 text-[11px]" style={{ color: 'var(--ph-text-3)', border: '1px solid var(--ph-border-subtle)' }}>
                        +{summary.jurisdictions.length - 8} more
                      </span>
                    )}
                  </div>
                )}

                {/* Platform badges */}
                {summary.platforms.length > 0 && (
                  <div className="mt-4">
                    <PlatformBadges platforms={summary.platforms} />
                  </div>
                )}
              </div>

              {/* RIGHT — SVG rating ring + cashback + CTA */}
              <div className="flex flex-row items-center gap-4 lg:flex-col lg:items-end lg:gap-4 lg:min-w-[200px]">
                {/* SVG animated rating ring */}
                <div className="flex-shrink-0 rounded-2xl p-3 text-center ph-glass" style={{ minWidth: 110 }}>
                  <div className="flex justify-center">
                    <RatingRing rating={summary.rating} color={summary.logoColor} />
                  </div>
                  <div className="mt-1 flex justify-center gap-0.5">
                    {stars.map((filled, i) => (
                      <Star
                        key={i}
                        className="h-3 w-3"
                        style={{ color: '#FBBF24' }}
                        fill={filled ? '#FBBF24' : 'none'}
                        strokeWidth={filled ? 0 : 1.5}
                      />
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col gap-2">
                  <a
                    href={summary.affiliateUrl ?? '#'}
                    target="_blank"
                    rel="noopener sponsored"
                    className="ph-focus-ring group flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl px-5 py-3 text-[14px] font-semibold"
                    style={{
                      background: 'linear-gradient(135deg,#4ADE80 0%,#22D3EE 100%)',
                      color: '#05070E',
                      boxShadow: '0 0 32px rgba(74,222,128,0.35),0 1px 0 rgba(255,255,255,0.25) inset',
                    }}
                  >
                    Open an account
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                  {bestMonthly > 0 && (
                    <div className="text-center text-[12px]" style={{ color: 'var(--ph-text-3)' }}>
                      Earn{' '}
                      <span className="ph-money font-semibold" style={{ color: 'var(--ph-emerald)' }}>
                        ${bestMonthly.toFixed(0)}/mo
                      </span>{' '}
                      cashback
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* ── Quick metrics — inline compact strip ────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.06 }}
          className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl px-5 py-3.5 ph-glass-strong"
        >
          <InlineMetric icon={DollarSign} label="Min Deposit" value={summary.minDeposit === 0 ? 'No min' : `$${summary.minDeposit.toLocaleString()}`} color="var(--ph-emerald)" />
          <span className="hidden md:block h-5 w-px" style={{ background: 'var(--ph-border-subtle)' }} />
          <InlineMetric icon={Globe2}     label="Regulators"  value={`${summary.jurisdictions.length}`} color="var(--ph-cyan)" />
          <span className="hidden md:block h-5 w-px" style={{ background: 'var(--ph-border-subtle)' }} />
          <InlineMetric icon={Layers}     label="Accounts"    value={`${summary.accountTypes.length} types`} color="var(--ph-violet)" />
          <span className="hidden md:block h-5 w-px" style={{ background: 'var(--ph-border-subtle)' }} />
          <InlineMetric icon={Wallet}     label="Platforms"   value={summary.platforms.length > 0 ? `${summary.platforms.length}` : '—'} color="var(--ph-amber)" />
          {rich?.quickStats?.instruments && (
            <>
              <span className="hidden md:block h-5 w-px" style={{ background: 'var(--ph-border-subtle)' }} />
              <InlineMetric icon={BarChart2} label="Instruments" value={rich.quickStats.instruments} color="var(--ph-text-2)" />
            </>
          )}
          {rich?.quickStats?.leverage && (
            <>
              <span className="hidden md:block h-5 w-px" style={{ background: 'var(--ph-border-subtle)' }} />
              <InlineMetric icon={TrendingUp} label="Leverage" value={rich.quickStats.leverage} color="var(--ph-text-2)" />
            </>
          )}
        </motion.div>

        {/* ── Payment methods ─────────────────────────────────────── */}
        {paymentMethods.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.07 }}
            className="mb-6 rounded-3xl ph-glass-strong p-5 md:p-6"
          >
            <PaymentBadges methods={paymentMethods} />
          </motion.section>
        )}

        {/* ── Cashback strip + bar chart ─────────────────────────── */}
        <motion.section
          id="cashback"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mb-6 overflow-hidden rounded-3xl ph-glass-strong p-5 md:p-7"
          style={{ background: 'radial-gradient(ellipse at 0% 50%,rgba(74,222,128,0.12) 0%,transparent 55%),rgba(10,14,26,0.85)' }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'linear-gradient(90deg,rgba(74,222,128,0.04) 0%,transparent 60%)' }}
          />
          <div className="relative">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--ph-emerald)' }}>
                  <Zap className="h-3.5 w-3.5" />
                  Your cashback on this broker
                </div>
                <div className="flex items-baseline gap-3">
                  <span
                    className="ph-money text-[clamp(2.5rem,6vw,3.75rem)] font-bold leading-none"
                    style={{
                      background: 'linear-gradient(180deg,#fff 0%,#cbd5e1 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    <CountUp end={bestMonthly} duration={1.4} separator="," prefix="$" />
                  </span>
                  <span className="text-[13px]" style={{ color: 'var(--ph-text-3)' }}>
                    /month<br />at {MONTHLY_LOTS} lots
                  </span>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-3 text-[13px]">
                  <span style={{ color: 'var(--ph-text-2)' }}>
                    Best rate:{' '}
                    <span className="ph-money font-semibold" style={{ color: 'var(--ph-emerald)' }}>
                      ${highestRate.toFixed(2)}/lot
                    </span>{' '}
                    on the <span style={{ color: 'var(--ph-text-1)' }}>{summary.defaultAccountType}</span> account
                  </span>
                  <span style={{ color: 'var(--ph-text-3)' }}>·</span>
                  <span style={{ color: 'var(--ph-text-2)' }}>
                    <span className="ph-money font-semibold" style={{ color: 'var(--ph-text-1)' }}>
                      ${bestAnnual.toLocaleString()}
                    </span>{' '}
                    per year
                  </span>
                </div>

                {/* Bar chart */}
                {highestRate > 0 && <CashbackBars ratePerLot={highestRate} />}
              </div>

              <div className="shrink-0 inline-flex items-center gap-2 self-start rounded-2xl px-4 py-3 text-[13px] font-semibold"
                style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)', color: 'var(--ph-emerald)' }}>
                <TrendingUp className="h-4 w-4" />
                Up to 85% of commission rebated
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Rebate rates table with bar visualisers ─────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mb-6 rounded-3xl ph-glass-strong p-5 md:p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold md:text-xl" style={{ color: 'var(--ph-text-1)' }}>
                Rebate rates by account
              </h2>
              <p className="mt-0.5 text-[13px]" style={{ color: 'var(--ph-text-3)' }}>
                Based on {MONTHLY_LOTS} forex lots/month
              </p>
            </div>
            <div className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.1em]" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--ph-text-3)', border: '1px solid var(--ph-border-subtle)' }}>
              {ratesByAccount.length} tiers
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-[14px]">
              <thead>
                <tr className="border-b text-left text-[11px] uppercase tracking-[0.1em]" style={{ borderColor: 'var(--ph-border-subtle)', color: 'var(--ph-text-3)' }}>
                  <th className="pb-3 w-[140px]">Account Type</th>
                  <th className="pb-3 w-[100px]">Rate</th>
                  <th className="pb-3">Visual</th>
                  <th className="pb-3 text-right">@ {MONTHLY_LOTS} lots/mo</th>
                  <th className="pb-3 text-right">Annually</th>
                </tr>
              </thead>
              <tbody>
                {ratesByAccount.map((row, ridx) => {
                  const monthly = row.forexRate * MONTHLY_LOTS;
                  const yearly  = monthly * 12;
                  const isBest  = row.forexRate === highestRate;
                  const barPct  = highestRate > 0 ? (row.forexRate / highestRate) * 100 : 0;
                  return (
                    <tr key={row.accountType} className="border-b transition-colors hover:bg-white/[0.025]" style={{ borderColor: 'var(--ph-border-subtle)' }}>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold" style={{ color: 'var(--ph-text-1)' }}>{row.accountType}</span>
                          {isBest && (
                            <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider" style={{ background: 'rgba(74,222,128,0.14)', color: 'var(--ph-emerald)', border: '1px solid rgba(74,222,128,0.3)' }}>
                              Best
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 pr-4 ph-money font-bold" style={{ color: 'var(--ph-text-1)' }}>
                        ${row.forexRate.toFixed(2)}/lot
                      </td>
                      <td className="py-3 pr-6">
                        <div className="relative h-2 w-full overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <motion.div
                            className="absolute inset-y-0 left-0 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${barPct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55, ease: [0.16,1,0.3,1], delay: ridx * 0.06 }}
                            style={{ background: isBest ? 'linear-gradient(90deg,#4ADE80,#22D3EE)' : 'rgba(74,222,128,0.35)' }}
                          />
                        </div>
                      </td>
                      <td className="py-3 text-right ph-money" style={{ color: 'var(--ph-emerald)' }}>
                        ${monthly.toFixed(0)}
                      </td>
                      <td className="py-3 text-right ph-money font-semibold" style={{ color: 'var(--ph-text-1)' }}>
                        ${yearly.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* ── Scores breakdown ───────────────────────────────────── */}
        {scores && (
          <motion.section
            id="scores"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.11 }}
            className="mb-6 overflow-hidden rounded-3xl ph-glass-strong p-5 md:p-6"
          >
            <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 40% at 100% 0%,rgba(74,222,128,0.06) 0%,transparent 60%)' }} />
            <div className="relative">
              <div className="mb-5 flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: 'rgba(74,222,128,0.14)', border: '1px solid rgba(74,222,128,0.35)', color: 'var(--ph-emerald)' }}
                >
                  <BarChart2 className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--ph-emerald)' }}>
                    Category breakdown
                  </div>
                  <h2 className="text-lg font-bold md:text-xl" style={{ color: 'var(--ph-text-1)' }}>
                    Score by category
                  </h2>
                </div>
              </div>
              <ScoreBars scores={scores} />
            </div>
          </motion.section>
        )}

        {/* ── Regulation cards with flags ────────────────────────── */}
        {entityRegs.length > 0 && (
          <motion.section
            id="regulation"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="mb-6 overflow-hidden rounded-3xl ph-glass-strong p-5 md:p-6"
          >
            <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 40% at 100% 0%,rgba(167,139,250,0.08) 0%,transparent 55%)' }} />
            <div className="relative">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--ph-violet)' }}>
                    <Shield className="h-3.5 w-3.5" />
                    Verified regulatory licences
                  </div>
                  <h2 className="text-lg font-bold md:text-xl" style={{ color: 'var(--ph-text-1)' }}>
                    Regulation details
                  </h2>
                  <p className="mt-0.5 text-[13px]" style={{ color: 'var(--ph-text-3)' }}>
                    Every active licence we verified, with jurisdiction-specific terms
                  </p>
                </div>
                <div className="rounded-2xl px-3 py-2 text-center ph-glass shrink-0" style={{ minWidth: 72 }}>
                  <div className="ph-money text-2xl font-bold" style={{ color: 'var(--ph-violet)' }}>
                    {entityRegs.length}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.1em]" style={{ color: 'var(--ph-text-3)' }}>licences</div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {entityRegs.map((reg, i) => (
                  <RegCard key={i} reg={reg} idx={i} />
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* ── Pros / Cons ────────────────────────────────────────── */}
        {(pros.length > 0 || cons.length > 0) && (
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.14 }}
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
                  <ul className="space-y-2.5">
                    {pros.map((p, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.06 }}
                        className="flex items-start gap-2.5 text-[14px] leading-[1.55]"
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
                  <ul className="space-y-2.5">
                    {cons.map((c, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.06 }}
                        className="flex items-start gap-2.5 text-[14px] leading-[1.55]"
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

        {/* Description fallback */}
        {!fullReview && description && (
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="mb-6 rounded-3xl ph-glass-strong p-5 md:p-6"
          >
            <h2 className="mb-3 text-lg font-bold md:text-xl" style={{ color: 'var(--ph-text-1)' }}>Overview</h2>
            <p className="text-[15px] leading-[1.75]" style={{ color: 'var(--ph-text-2)' }}>{description}</p>
          </motion.section>
        )}

        {/* ── Full in-depth review ───────────────────────────────── */}
        {fullReview && (
          <motion.section
            id="review"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.16 }}
            className="relative mb-6 overflow-hidden rounded-3xl ph-glass-strong p-5 md:p-8"
          >
            <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 30% at 100% 0%,rgba(34,211,238,0.07) 0%,transparent 55%)' }} />
            <div className="relative">
              <div className="mb-6 flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: 'var(--ph-border-subtle)' }}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: 'rgba(74,222,128,0.14)', border: '1px solid rgba(74,222,128,0.35)', color: 'var(--ph-emerald)' }}>
                    <BookOpen className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--ph-emerald)' }}>Updated deep research</div>
                    <h2 className="text-xl font-bold md:text-2xl" style={{ color: 'var(--ph-text-1)' }}>
                      {summary.name} — deep research across multiple platforms
                    </h2>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full px-3 py-1.5 text-[11px] font-semibold ph-glass" style={{ color: 'var(--ph-text-3)' }}>
                    Last updated {summary.lastVerified}
                  </span>
                </div>
              </div>
              <MarkdownProse content={fullReview} />
            </div>
          </motion.section>
        )}

        {/* ── User reviews ───────────────────────────────────────── */}
        {userReviews && (
          <motion.div
            id="reviews"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.18 }}
            className="mb-6"
          >
            <ReviewsPanel reviews={userReviews} />
          </motion.div>
        )}

        {/* ── FAQ accordion ──────────────────────────────────────── */}
        {faqs.length > 0 && (
          <motion.section
            id="faq"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="mb-6 overflow-hidden rounded-3xl ph-glass-strong p-5 md:p-6"
          >
            <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 40% 30% at 50% 0%,rgba(34,211,238,0.06) 0%,transparent 60%)' }} />
            <div className="relative">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'rgba(34,211,238,0.14)', border: '1px solid rgba(34,211,238,0.35)', color: 'var(--ph-cyan)' }}>
                  <HelpCircle className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--ph-cyan)' }}>Common questions</div>
                  <h2 className="text-lg font-bold md:text-xl" style={{ color: 'var(--ph-text-1)' }}>
                    Frequently asked questions
                  </h2>
                </div>
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
                        className="h-4 w-4 flex-shrink-0 transition-transform duration-200"
                        style={{ color: 'var(--ph-text-3)', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {openFaq === i && faq.answer && (
                        <motion.div
                          key="answer"
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
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.22 }}
          className="mb-6 grid gap-4 md:grid-cols-2"
        >
          <div className="rounded-3xl ph-glass-strong p-5 md:p-6">
            <h3 className="mb-4 text-base font-bold md:text-lg" style={{ color: 'var(--ph-text-1)' }}>Quick facts</h3>
            <div className="space-y-3">
              <FactRow label="Min deposit"   value={summary.minDeposit === 0 ? 'No minimum' : `$${summary.minDeposit}`} />
              <FactRow label="Account types" value={summary.accountTypes.join(' · ')} />
              <FactRow label="Platforms"     value={summary.platforms.join(' · ') || '—'} />
              {summary.headquarters && <FactRow label="Headquarters" value={summary.headquarters} />}
              {summary.founded      && <FactRow label="Founded"      value={String(summary.founded)} />}
              {rich?.companyProfileData?.parentCompany && <FactRow label="Parent company" value={rich.companyProfileData.parentCompany} />}
              {rich?.quickStats?.instruments           && <FactRow label="Instruments"    value={rich.quickStats.instruments} />}
              {rich?.quickStats?.tradingCost           && <FactRow label="Trading cost"   value={rich.quickStats.tradingCost} />}
              {rich?.quickStats?.leverage              && <FactRow label="Max leverage"   value={rich.quickStats.leverage} />}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl ph-glass-strong p-5 md:p-6">
            <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse 70% 50% at 50% 100%,${summary.logoColor}18 0%,transparent 60%)` }} />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <h3 className="mb-3 text-base font-bold md:text-lg" style={{ color: 'var(--ph-text-1)' }}>
                  Ready to start earning?
                </h3>
                <p className="text-[14px] leading-[1.65]" style={{ color: 'var(--ph-text-2)' }}>
                  Link your {summary.name} account through us and we&apos;ll pay most of your
                  commission back. No change to your trading, platform, or strategy.
                </p>
                {bestMonthly > 0 && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[13px]" style={{ background: 'rgba(74,222,128,0.10)', border: '1px solid rgba(74,222,128,0.25)' }}>
                    <Zap className="h-3.5 w-3.5" style={{ color: 'var(--ph-emerald)' }} />
                    <span style={{ color: 'var(--ph-text-2)' }}>
                      Est. <span className="ph-money font-bold" style={{ color: 'var(--ph-emerald)' }}>${bestAnnual.toLocaleString()}</span> back per year at {MONTHLY_LOTS} lots/mo
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
                Open an account with {summary.name}
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
          transition={{ duration: 0.4, delay: 0.24 }}
          className="flex flex-col items-center gap-1.5 rounded-2xl p-5 text-center text-[12px] ph-glass"
          style={{ color: 'var(--ph-text-3)' }}
        >
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5" style={{ color: 'var(--ph-emerald)' }} />
            <span style={{ color: 'var(--ph-text-2)' }}>
              Audited on {summary.lastVerified} · Cross-checked against {summary.jurisdictions.length} regulator{summary.jurisdictions.length !== 1 ? 's' : ''} and public sources
            </span>
          </div>
          <div>We re-audit every broker on a rolling 90-day cycle for peace of mind.</div>
        </motion.div>

      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Subcomponents                                                       */
/* ------------------------------------------------------------------ */

function MetricCard({ icon: Icon, label, value, color }: { icon: typeof DollarSign; label: string; value: string; color: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl ph-glass p-3.5 md:p-4">
      <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse 80% 60% at 0% 0%,${color}0D 0%,transparent 70%)` }} />
      <div className="relative">
        <div className="mb-1.5 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--ph-text-3)' }}>
          <Icon className="h-3.5 w-3.5" style={{ color }} />
          {label}
        </div>
        <div className="text-base font-bold md:text-lg" style={{ color: 'var(--ph-text-1)' }}>{value}</div>
      </div>
    </div>
  );
}

/** Compact inline metric for the single-row strip */
function InlineMetric({ icon: Icon, label, value, color }: { icon: typeof DollarSign; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 shrink-0" style={{ color }} />
      <span className="text-[11px] uppercase tracking-[0.1em]" style={{ color: 'var(--ph-text-3)' }}>{label}</span>
      <span className="text-[14px] font-bold" style={{ color: 'var(--ph-text-1)' }}>{value}</span>
    </div>
  );
}
