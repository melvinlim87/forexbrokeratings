'use client';

/**
 * How Cashback Works — 4-step interactive diagram.
 *
 * Scroll-linked reveal: as the user scrolls past this section, each step
 * lights up in sequence. Numbers animate in, connecting arrows draw
 * themselves, and the "You get" chip pulses at the end.
 *
 * Pure UI — no data dependencies. Section copy is static.
 */

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { UserPlus, LineChart, Banknote, Wallet, ArrowRight, Sparkles } from 'lucide-react';

type Step = {
  icon: typeof UserPlus;
  kicker: string;
  title: string;
  body: string;
  accent: string;
  glow: string;
};

const STEPS: Step[] = [
  {
    icon: UserPlus,
    kicker: 'Step 1',
    title: 'Open an account through us',
    body: 'Pick any broker or prop firm from our database and click "Start earning". We tag your signup so the broker knows cashback is on.',
    accent: '#4ADE80',
    glow: 'rgba(74, 222, 128, 0.35)',
  },
  {
    icon: LineChart,
    kicker: 'Step 2',
    title: 'Trade like you always do',
    body: 'Zero restrictions, zero changes to your strategy. Trade on your own platform, with your own stops, at your own size.',
    accent: '#22D3EE',
    glow: 'rgba(34, 211, 238, 0.35)',
  },
  {
    icon: Banknote,
    kicker: 'Step 3',
    title: 'Broker pays us commission',
    body: 'Every round-turn lot you trade, the broker pays us an introducer commission. We see it live in our dashboard, broken down by trade.',
    accent: '#A78BFA',
    glow: 'rgba(167, 139, 250, 0.35)',
  },
  {
    icon: Wallet,
    kicker: 'Step 4',
    title: 'We pay most of it back to you',
    body: 'You keep up to 85% of the commission. Daily, weekly, or monthly — your choice. Cash out via bank transfer, crypto, or PayPal.',
    accent: '#FBBF24',
    glow: 'rgba(251, 191, 36, 0.35)',
  },
];

/* ------------------------------------------------------------------
 * Individual step card with InView reveal
 * ------------------------------------------------------------------ */

function StepCard({ step, index }: { step: Step; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const Icon = step.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex-1"
    >
      {/* Floating step number badge */}
      <motion.div
        initial={{ scale: 0, rotate: -12 }}
        animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -12 }}
        transition={{ duration: 0.5, delay: index * 0.15 + 0.1, type: 'spring', stiffness: 220 }}
        className="absolute -left-3 -top-3 z-10 flex h-9 w-9 items-center justify-center rounded-xl font-bold"
        style={{
          background: `linear-gradient(135deg, ${step.accent} 0%, ${step.accent}99 100%)`,
          color: '#05070E',
          boxShadow: `0 0 24px ${step.glow}`,
        }}
      >
        {index + 1}
      </motion.div>

      <div
        className="relative h-full rounded-3xl ph-glass-strong p-6"
        style={{
          boxShadow: isInView ? `0 0 48px ${step.glow}` : 'none',
          transition: 'box-shadow 700ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Background gradient wash */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{
            background: `radial-gradient(circle at 80% 0%, ${step.accent}18 0%, transparent 55%)`,
          }}
        />

        {/* Icon */}
        <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl" style={{
          background: `linear-gradient(135deg, ${step.accent}22 0%, ${step.accent}08 100%)`,
          border: `1px solid ${step.accent}44`,
        }}>
          <Icon className="h-6 w-6" style={{ color: step.accent }} />
        </div>

        {/* Content */}
        <div className="relative">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: step.accent }}>
            {step.kicker}
          </div>
          <h3 className="mb-3 text-lg font-bold leading-snug" style={{ color: 'var(--ph-text-1)' }}>
            {step.title}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--ph-text-2)' }}>
            {step.body}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------
 * Connecting arrow between steps (desktop only)
 * ------------------------------------------------------------------ */

function ConnectingArrow({ index }: { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scaleX: 0 }}
      animate={isInView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
      transition={{ duration: 0.7, delay: index * 0.15 + 0.25, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: 'left center' }}
      className="relative hidden h-1 w-16 flex-shrink-0 self-center xl:block"
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
        }}
      />
      <motion.div
        className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full"
        animate={isInView ? { opacity: [0, 1, 1, 0], x: [0, 0, 6, 6] } : {}}
        transition={{ duration: 1.8, delay: index * 0.15 + 0.5, repeat: Infinity, repeatDelay: 2 }}
        style={{ background: '#FFFFFF', boxShadow: '0 0 10px rgba(255,255,255,0.6)' }}
      />
    </motion.div>
  );
}

/* ------------------------------------------------------------------
 * Main section
 * ------------------------------------------------------------------ */

export default function HowCashbackWorks() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Progress line fills as the user scrolls through the section
  const progressWidth = useTransform(scrollYProgress, [0.15, 0.7], ['0%', '100%']);

  return (
    <section ref={containerRef} className="relative z-10 mx-auto mt-24 w-full max-w-[1400px] px-6 lg:px-10">
      {/* Section header */}
      <div className="mb-14 text-center">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.14em] ph-glass" style={{ color: 'var(--ph-text-2)' }}>
          <Sparkles className="h-3 w-3" style={{ color: 'var(--ph-cyan)' }} />
          How it works
        </div>
        <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
          <span className="ph-gradient-text">Cashback without changing </span>
          <span className="ph-gradient-text-brand">a single thing.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base" style={{ color: 'var(--ph-text-2)' }}>
          Most rebate services expect you to use their platform, their stop levels, their
          restrictions. We don&apos;t. You trade exactly how you already trade — we just capture the
          commission and pay most of it back.
        </p>
      </div>

      {/* Progress rail (animated as user scrolls the section) */}
      <div className="relative mx-auto mb-10 hidden h-px max-w-4xl xl:block">
        <div className="absolute inset-0 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: progressWidth,
            background: 'linear-gradient(90deg, #4ADE80 0%, #22D3EE 33%, #A78BFA 66%, #FBBF24 100%)',
            boxShadow: '0 0 16px rgba(74, 222, 128, 0.4)',
          }}
        />
      </div>

      {/* Steps + connecting arrows */}
      <div className="flex flex-col gap-5 xl:flex-row xl:items-stretch xl:gap-0">
        {STEPS.map((step, i) => (
          <div key={step.kicker} className="flex flex-1 xl:flex-[1]">
            <StepCard step={step} index={i} />
            {i < STEPS.length - 1 && <ConnectingArrow index={i} />}
          </div>
        ))}
      </div>

      {/* Bottom summary chip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mt-12 flex w-fit items-center gap-3 rounded-full px-5 py-3 ph-glass-strong"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{
          background: 'linear-gradient(135deg, #4ADE80 0%, #22D3EE 100%)',
          boxShadow: '0 0 24px rgba(74, 222, 128, 0.4)',
        }}>
          <span className="text-xs font-bold" style={{ color: '#05070E' }}>✓</span>
        </div>
        <span className="text-sm font-medium" style={{ color: 'var(--ph-text-1)' }}>
          No minimum trade size · No exclusivity · Cancel anytime
        </span>
        <ArrowRight className="h-4 w-4" style={{ color: 'var(--ph-emerald)' }} />
      </motion.div>
    </section>
  );
}
