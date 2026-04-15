'use client';

/**
 * Top Rebate Rates — horizontal card carousel.
 *
 * Renders the 12 highest-earning broker accounts from the consolidated
 * dataset, with 3D-tilt hover cards. Every number comes from real data
 * in _data/generated/brokers.json.
 */

import Link from 'next/link';
import { useMemo, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Shield, Star, Sparkles, TrendingUp } from 'lucide-react';
import { BROKERS, initialsOf, isImageLogo, type BrokerEntity, type RebateRate } from '../_data/entities';

type TopPick = {
  broker: BrokerEntity;
  bestRate: RebateRate;
  monthlyEstimate: number;
};

/** Volume basis for "earn per month at 40 lots" preview. */
const PREVIEW_MONTHLY_LOTS = 40;

function pickBestRate(broker: BrokerEntity): RebateRate | null {
  if (!broker.rebateRates || broker.rebateRates.length === 0) return null;
  // Prefer forex rates, then pick the single highest rate per lot.
  const forex = broker.rebateRates.filter((r) => r.instrumentClass === 'forex');
  const pool = forex.length > 0 ? forex : broker.rebateRates;
  return pool.slice().sort((a, b) => b.ratePerLot - a.ratePerLot)[0];
}

/* ------------------------------------------------------------------
 * Individual card with 3D tilt
 * ------------------------------------------------------------------ */

function RebateCard({ pick, index }: { pick: TopPick; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotX = useSpring(useTransform(y, [-0.5, 0.5], ['7deg', '-7deg']), { stiffness: 280, damping: 22 });
  const rotY = useSpring(useTransform(x, [-0.5, 0.5], ['-7deg', '7deg']), { stiffness: 280, damping: 22 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  const { broker, bestRate, monthlyEstimate } = pick;
  const jurisdictions = broker.jurisdictions.slice(0, 3);
  const hasMore = broker.jurisdictions.length > 3;

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      style={{
        rotateX: rotX,
        rotateY: rotY,
        transformPerspective: 1200,
        transformStyle: 'preserve-3d',
      }}
      className="relative flex-shrink-0"
    >
      <Link
        href={`/preview-hero/brokers/${broker.slug}/`}
        className="ph-focus-ring group relative block h-[320px] w-[240px] overflow-hidden rounded-3xl ph-glass-strong p-5 transition-all sm:h-[340px] sm:w-[280px]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Rank badge */}
        <div
          className="absolute left-4 top-4 flex h-6 items-center gap-1 rounded-full px-2 text-[10px] font-semibold uppercase tracking-[0.12em]"
          style={{
            background: 'rgba(74, 222, 128, 0.14)',
            color: 'var(--ph-emerald)',
            border: '1px solid rgba(74, 222, 128, 0.3)',
          }}
        >
          <TrendingUp className="h-3 w-3" />#{index + 1}
        </div>

        {/* Rating pill */}
        <div
          className="absolute right-4 top-4 flex h-6 items-center gap-1 rounded-full px-2 text-[10px] font-semibold"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'var(--ph-text-1)',
          }}
        >
          <Star className="h-3 w-3" style={{ color: '#FBBF24' }} fill="#FBBF24" />
          <span className="ph-money">{broker.trustScore.toFixed(1)}</span>
        </div>

        {/* Logo + name */}
        <div className="mt-8 flex items-center gap-3" style={{ transform: 'translateZ(18px)' }}>
          <div
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${broker.logoColor}33 0%, ${broker.logoColor}11 100%)`,
              border: `1px solid ${broker.logoColor}55`,
              padding: isImageLogo(broker.logo) ? 6 : 0,
              color: broker.logoColor,
            }}
          >
            {isImageLogo(broker.logo) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={broker.logo} alt="" className="h-full w-full object-contain" loading="lazy" />
            ) : (
              <span className="text-sm font-bold">{initialsOf(broker.name)}</span>
            )}
          </div>
          <div className="min-w-0">
            <div className="truncate text-base font-bold" style={{ color: 'var(--ph-text-1)' }}>
              {broker.name}
            </div>
            <div className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--ph-text-3)' }}>
              <Shield className="h-3 w-3" style={{ color: 'var(--ph-emerald)' }} />
              <span>{bestRate.accountType} account</span>
            </div>
          </div>
        </div>

        {/* Rate block */}
        <div className="mt-5" style={{ transform: 'translateZ(22px)' }}>
          <div className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--ph-text-3)' }}>
            Rebate per lot
          </div>
          <div className="mt-0.5 flex items-baseline gap-1.5">
            <span
              className="ph-money text-4xl font-bold"
              style={{
                background: 'linear-gradient(180deg, #FFFFFF 0%, #CBD5E1 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ${bestRate.ratePerLot.toFixed(2)}
            </span>
            <span className="text-xs" style={{ color: 'var(--ph-text-3)' }}>
              /lot
            </span>
          </div>
        </div>

        {/* Monthly preview */}
        <div
          className="mt-4 flex items-center justify-between rounded-xl px-3 py-2"
          style={{
            background: 'rgba(74, 222, 128, 0.08)',
            border: '1px solid rgba(74, 222, 128, 0.18)',
            transform: 'translateZ(18px)',
          }}
        >
          <div className="text-[10px]" style={{ color: 'var(--ph-text-2)' }}>
            At {PREVIEW_MONTHLY_LOTS} lots/mo
          </div>
          <div
            className="ph-money text-sm font-bold"
            style={{ color: 'var(--ph-emerald)' }}
          >
            ${monthlyEstimate.toFixed(0)}/mo
          </div>
        </div>

        {/* Jurisdictions row */}
        {jurisdictions.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-1" style={{ transform: 'translateZ(15px)' }}>
            {jurisdictions.map((j) => (
              <span
                key={j}
                className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
                style={{
                  background: 'rgba(34, 211, 238, 0.1)',
                  border: '1px solid rgba(34, 211, 238, 0.2)',
                  color: 'var(--ph-cyan)',
                }}
              >
                {j}
              </span>
            ))}
            {hasMore && (
              <span className="text-[9px]" style={{ color: 'var(--ph-text-3)' }}>
                +{broker.jurisdictions.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer CTA */}
        <div
          className="absolute bottom-4 left-5 right-5 flex items-center justify-between"
          style={{ transform: 'translateZ(12px)' }}
        >
          <span className="text-[10px]" style={{ color: 'var(--ph-text-3)' }}>
            Verified {broker.lastVerified}
          </span>
          <div
            className="flex items-center gap-1 text-[13px] font-semibold transition-transform group-hover:translate-x-0.5"
            style={{ color: 'var(--ph-emerald)' }}
          >
            Read full review
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Hover glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${broker.logoColor}22 0%, transparent 60%)`,
          }}
        />
      </Link>
    </motion.div>
  );
}

/* ------------------------------------------------------------------
 * Section wrapper
 * ------------------------------------------------------------------ */

export default function TopRebateRates() {
  const picks = useMemo(() => {
    const candidates: TopPick[] = [];
    for (const broker of BROKERS) {
      if (broker.jurisdictions.length === 0) continue; // only show brokers with verified jurisdictions
      const bestRate = pickBestRate(broker);
      if (!bestRate) continue;
      candidates.push({
        broker,
        bestRate,
        monthlyEstimate: bestRate.ratePerLot * PREVIEW_MONTHLY_LOTS,
      });
    }
    return candidates
      .sort((a, b) => b.bestRate.ratePerLot - a.bestRate.ratePerLot)
      .slice(0, 12);
  }, []);

  return (
    <section className="relative z-10 mx-auto mt-24 w-full max-w-[1400px] px-6 lg:px-10">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.14em] ph-glass" style={{ color: 'var(--ph-text-2)' }}>
            <Sparkles className="h-3 w-3" style={{ color: 'var(--ph-emerald)' }} />
            Live rebate leaderboard
          </div>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            <span className="ph-gradient-text">Top rebate rates </span>
            <span className="ph-gradient-text-brand">right now.</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm md:text-base" style={{ color: 'var(--ph-text-2)' }}>
            Ranked by highest cashback per round-turn lot. All {BROKERS.length} brokers in our database
            compete for these spots — hover a card to see it tilt in 3D.
          </p>
        </div>

        <div className="hidden flex-col items-end text-right text-[10px] uppercase tracking-[0.12em] md:flex" style={{ color: 'var(--ph-text-3)' }}>
          <div className="flex items-center gap-1.5">
            <span className="ph-live-dot" aria-hidden />
            <span>{picks.length} top picks · refreshed live</span>
          </div>
          <div className="mt-0.5" style={{ color: 'var(--ph-text-4)' }}>
            Based on verified broker research
          </div>
        </div>
      </div>

      {/* Scrollable carousel */}
      <div
        className="-mx-6 flex gap-5 overflow-x-auto px-6 pb-6 scrollbar-hide lg:-mx-10 lg:px-10"
        style={{ scrollSnapType: 'x mandatory', perspective: 1400 }}
      >
        {picks.map((pick, i) => (
          <div key={pick.broker.slug} style={{ scrollSnapAlign: 'start' }}>
            <RebateCard pick={pick} index={i} />
          </div>
        ))}
      </div>

      {/* Footer row */}
      <div className="mt-4 flex items-center justify-between text-xs" style={{ color: 'var(--ph-text-3)' }}>
        <span>← scroll to see more brokers</span>
        <a
          href="#"
          className="inline-flex items-center gap-1 font-semibold"
          style={{ color: 'var(--ph-emerald)' }}
        >
          View full leaderboard
          <ArrowRight className="h-3 w-3" />
        </a>
      </div>
    </section>
  );
}
