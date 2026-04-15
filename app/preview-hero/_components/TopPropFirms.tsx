'use client';

/**
 * Top Prop Firms — horizontal card carousel parallel to TopRebateRates.
 *
 * Ranks the 12 top prop firms by their total saving (discount + additional
 * rebate) on the biggest account tier. Each card shows profit split,
 * evaluation model, and biggest-tier savings. 3D tilt on hover, clicks
 * navigate to the prop firm dossier.
 */

import Link from 'next/link';
import { useMemo, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Shield, Star, Sparkles, Target, Trophy } from 'lucide-react';
import { PROP_FIRMS, initialsOf, isImageLogo, type PropFirmEntity } from '../_data/entities';

type TopFirmPick = {
  firm: PropFirmEntity;
  biggestSize: number;
  biggestSaving: number;
  biggestDiscountedPrice: number;
};

function computePick(firm: PropFirmEntity): TopFirmPick | null {
  const sizes = firm.accountSizes ?? [];
  if (sizes.length === 0) return null;
  const biggest = sizes[sizes.length - 1];
  const tier = firm.pricing[biggest];
  if (!tier) return null;
  const saving = tier.standard - tier.discounted + tier.additionalRebate;
  return {
    firm,
    biggestSize: biggest,
    biggestSaving: saving,
    biggestDiscountedPrice: tier.discounted,
  };
}

/* ------------------------------------------------------------------
 * Card
 * ------------------------------------------------------------------ */

function FirmCard({ pick, index }: { pick: TopFirmPick; index: number }) {
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

  const { firm, biggestSize, biggestSaving, biggestDiscountedPrice } = pick;

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
        href={`/preview-hero/firms/${firm.slug}/`}
        className="ph-focus-ring group relative block h-[320px] w-[240px] overflow-hidden rounded-3xl ph-glass-strong p-5 transition-all sm:h-[340px] sm:w-[280px]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Rank badge */}
        <div
          className="absolute left-4 top-4 flex h-6 items-center gap-1 rounded-full px-2 text-[10px] font-semibold uppercase tracking-[0.12em]"
          style={{
            background: 'rgba(167, 139, 250, 0.14)',
            color: 'var(--ph-violet)',
            border: '1px solid rgba(167, 139, 250, 0.3)',
          }}
        >
          <Trophy className="h-3 w-3" />#{index + 1}
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
          <span className="ph-money">{firm.trustScore.toFixed(1)}</span>
        </div>

        {/* Logo + name */}
        <div className="mt-8 flex items-center gap-3" style={{ transform: 'translateZ(18px)' }}>
          <div
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${firm.logoColor}33 0%, ${firm.logoColor}11 100%)`,
              border: `1px solid ${firm.logoColor}55`,
              padding: isImageLogo(firm.logo) ? 6 : 0,
              color: firm.logoColor,
            }}
          >
            {isImageLogo(firm.logo) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={firm.logo} alt="" className="h-full w-full object-contain" loading="lazy" />
            ) : (
              <span className="text-sm font-bold">{initialsOf(firm.name)}</span>
            )}
          </div>
          <div className="min-w-0">
            <div className="truncate text-base font-bold" style={{ color: 'var(--ph-text-1)' }}>
              {firm.name}
            </div>
            <div className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--ph-text-3)' }}>
              <Target className="h-3 w-3" style={{ color: 'var(--ph-violet)' }} />
              <span>{firm.evaluationModel} evaluation</span>
            </div>
          </div>
        </div>

        {/* Savings block */}
        <div className="mt-5" style={{ transform: 'translateZ(22px)' }}>
          <div className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--ph-text-3)' }}>
            Saving on biggest tier
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
              ${biggestSaving}
            </span>
            <span className="text-xs" style={{ color: 'var(--ph-text-3)' }}>
              on ${(biggestSize / 1000).toFixed(0)}K
            </span>
          </div>
        </div>

        {/* Your price preview */}
        <div
          className="mt-4 flex items-center justify-between rounded-xl px-3 py-2"
          style={{
            background: 'rgba(167, 139, 250, 0.08)',
            border: '1px solid rgba(167, 139, 250, 0.2)',
            transform: 'translateZ(18px)',
          }}
        >
          <div className="text-[10px]" style={{ color: 'var(--ph-text-2)' }}>
            Your price
          </div>
          <div className="ph-money text-sm font-bold" style={{ color: 'var(--ph-violet)' }}>
            ${biggestDiscountedPrice}
          </div>
        </div>

        {/* Profit split row */}
        <div className="mt-4 flex flex-wrap items-center gap-1" style={{ transform: 'translateZ(15px)' }}>
          <span
            className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
            style={{
              background: 'rgba(74, 222, 128, 0.1)',
              border: '1px solid rgba(74, 222, 128, 0.2)',
              color: 'var(--ph-emerald)',
            }}
          >
            {firm.profitSplit}
          </span>
          <span
            className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
            style={{
              background: 'rgba(34, 211, 238, 0.1)',
              border: '1px solid rgba(34, 211, 238, 0.2)',
              color: 'var(--ph-cyan)',
            }}
          >
            {firm.accountSizes.length} tiers
          </span>
        </div>

        {/* CTA footer */}
        <div
          className="absolute bottom-4 left-5 right-5 flex items-center justify-between"
          style={{ transform: 'translateZ(12px)' }}
        >
          <span className="text-[10px]" style={{ color: 'var(--ph-text-3)' }}>
            Verified {firm.lastVerified}
          </span>
          <div
            className="flex items-center gap-1 text-[13px] font-semibold transition-transform group-hover:translate-x-0.5"
            style={{ color: 'var(--ph-violet)' }}
          >
            Read full review
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Hover glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${firm.logoColor}26 0%, transparent 60%)`,
          }}
        />
      </Link>
    </motion.div>
  );
}

/* ------------------------------------------------------------------
 * Section wrapper
 * ------------------------------------------------------------------ */

export default function TopPropFirms() {
  const picks = useMemo(() => {
    const candidates: TopFirmPick[] = [];
    for (const firm of PROP_FIRMS) {
      const pick = computePick(firm);
      if (pick) candidates.push(pick);
    }
    return candidates.sort((a, b) => b.biggestSaving - a.biggestSaving).slice(0, 12);
  }, []);

  return (
    <section className="relative z-10 mx-auto mt-16 w-full max-w-[1400px] px-6 lg:px-10">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <div
            className="mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.14em] ph-glass"
            style={{ color: 'var(--ph-text-2)' }}
          >
            <Sparkles className="h-3 w-3" style={{ color: 'var(--ph-violet)' }} />
            Prop firm savings leaderboard
          </div>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            <span className="ph-gradient-text">Top prop firms </span>
            <span className="ph-gradient-text-brand">right now.</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm md:text-base" style={{ color: 'var(--ph-text-2)' }}>
            Ranked by biggest-tier discount + rebate combined. All {PROP_FIRMS.length} prop firms in
            our database compete for these spots.
          </p>
        </div>

        <div
          className="hidden flex-col items-end text-right text-[10px] uppercase tracking-[0.12em] md:flex"
          style={{ color: 'var(--ph-text-3)' }}
        >
          <div className="flex items-center gap-1.5">
            <span className="ph-live-dot" aria-hidden />
            <span>{picks.length} top picks · live</span>
          </div>
          <div className="mt-0.5" style={{ color: 'var(--ph-text-4)' }}>
            Based on verified firm research
          </div>
        </div>
      </div>

      <div
        className="-mx-6 flex gap-5 overflow-x-auto px-6 pb-6 scrollbar-hide lg:-mx-10 lg:px-10"
        style={{ scrollSnapType: 'x mandatory', perspective: 1400 }}
      >
        {picks.map((pick, i) => (
          <div key={pick.firm.slug} style={{ scrollSnapAlign: 'start' }}>
            <FirmCard pick={pick} index={i} />
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs" style={{ color: 'var(--ph-text-3)' }}>
        <span>← scroll to see more firms</span>
        <Link
          href="/preview-hero/firms/ftmo/"
          className="inline-flex items-center gap-1 font-semibold"
          style={{ color: 'var(--ph-violet)' }}
        >
          Read FTMO review
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </section>
  );
}
