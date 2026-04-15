'use client';

/**
 * 3-way compare — pick up to 3 entities (brokers, prop firms, or mixed)
 * and render a side-by-side comparison grid.
 *
 * Empty slots show a big dashed "+" that opens an entity picker.
 * Each populated slot renders a compact card with the row headers on
 * the left (sticky) matching every slot's field.
 */

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Plus,
  Search,
  X,
  Shield,
  Target,
  Star,
  Check,
  Minus,
  Sparkles,
  ExternalLink,
  Trophy,
} from 'lucide-react';
import {
  BROKERS,
  PROP_FIRMS,
  initialsOf,
  isImageLogo,
  type BrokerEntity,
  type PropFirmEntity,
} from '../_data/entities';

type Slot = (BrokerEntity | PropFirmEntity) | null;

/* ------------------------------------------------------------------
 * Field definitions
 *
 * The grid renders these rows. Each row has an "accessor" that pulls
 * a value out of a broker or prop firm entity. When an entity doesn't
 * have the field, it renders a tasteful "—".
 * ------------------------------------------------------------------ */

type FieldRow = {
  label: string;
  group: 'trust' | 'terms' | 'cashback' | 'access';
  get: (e: BrokerEntity | PropFirmEntity) => string | null;
  highlight?: 'best-high' | 'best-low'; // comparison hint
};

function formatBrokerRate(b: BrokerEntity): string {
  if (!b.rebateRates.length) return '—';
  const best = Math.max(...b.rebateRates.map((r) => r.ratePerLot));
  return `$${best.toFixed(2)}/lot`;
}

function brokerRateValue(b: BrokerEntity): number {
  if (!b.rebateRates.length) return 0;
  return Math.max(...b.rebateRates.map((r) => r.ratePerLot));
}

function propFirmTopSaving(f: PropFirmEntity): string {
  const biggest = f.accountSizes[f.accountSizes.length - 1];
  const tier = f.pricing[biggest];
  if (!tier) return '—';
  return `$${tier.standard - tier.discounted + tier.additionalRebate}`;
}

const FIELDS: FieldRow[] = [
  // Trust group
  {
    label: 'Trust score',
    group: 'trust',
    highlight: 'best-high',
    get: (e) => e.trustScore.toFixed(1) + '/10',
  },
  {
    label: 'Founded',
    group: 'trust',
    get: (e) => e.founded ?? '—',
  },
  {
    label: 'Headquarters',
    group: 'trust',
    get: (e) => e.headquarters ?? '—',
  },
  {
    label: 'Regulators',
    group: 'trust',
    get: (e) =>
      e.type === 'broker'
        ? e.jurisdictions.length > 0
          ? e.jurisdictions.join(' · ')
          : '—'
        : '—',
  },
  // Terms group
  {
    label: 'Min deposit',
    group: 'terms',
    get: (e) => (e.type === 'broker' ? (e.minDeposit === 0 ? 'No minimum' : `$${e.minDeposit}`) : '—'),
  },
  {
    label: 'Account types',
    group: 'terms',
    get: (e) => (e.type === 'broker' ? e.accountTypes.join(' · ') : '—'),
  },
  {
    label: 'Platforms',
    group: 'terms',
    get: (e) => (e.type === 'broker' ? (e.platforms.length > 0 ? e.platforms.join(' · ') : '—') : '—'),
  },
  {
    label: 'Evaluation',
    group: 'terms',
    get: (e) => (e.type === 'prop-firm' ? e.evaluationModel : '—'),
  },
  {
    label: 'Profit split',
    group: 'terms',
    get: (e) => (e.type === 'prop-firm' ? e.profitSplit : '—'),
  },
  {
    label: 'Account sizes',
    group: 'terms',
    get: (e) =>
      e.type === 'prop-firm' ? e.accountSizes.map((s) => `$${(s / 1000).toFixed(0)}K`).join(' · ') : '—',
  },
  // Cashback group
  {
    label: 'Best rebate',
    group: 'cashback',
    highlight: 'best-high',
    get: (e) => (e.type === 'broker' ? formatBrokerRate(e) : propFirmTopSaving(e)),
  },
  {
    label: 'Rebate model',
    group: 'cashback',
    get: (e) => (e.type === 'broker' ? 'per lot' : 'discount + rebate'),
  },
];

const GROUP_LABELS: Record<FieldRow['group'], { label: string; color: string }> = {
  trust: { label: 'Trust & Identity', color: '#4ADE80' },
  terms: { label: 'Terms & Conditions', color: '#22D3EE' },
  cashback: { label: 'Cashback', color: '#A78BFA' },
  access: { label: 'Access', color: '#FBBF24' },
};

/* ------------------------------------------------------------------
 * Main component
 * ------------------------------------------------------------------ */

export default function CompareClient() {
  const [slots, setSlots] = useState<Slot[]>([null, null, null]);
  const [pickerForSlot, setPickerForSlot] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const pickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (pickerForSlot !== null) {
      setTimeout(() => pickerRef.current?.focus(), 50);
    }
  }, [pickerForSlot]);

  function setSlot(slotIdx: number, entity: BrokerEntity | PropFirmEntity | null) {
    setSlots((prev) => {
      const next = [...prev];
      next[slotIdx] = entity;
      return next;
    });
    setPickerForSlot(null);
    setQuery('');
  }

  const activeSlots = slots.filter((s): s is BrokerEntity | PropFirmEntity => s !== null);

  // For "best" highlighting — compute winners per row
  const rowWinners = useMemo(() => {
    const winners: Record<number, number> = {};
    FIELDS.forEach((field, fieldIdx) => {
      if (!field.highlight || activeSlots.length < 2) return;
      // Only compare broker-specific fields (rates) among populated broker slots
      if (field.label === 'Best rebate') {
        let bestIdx = -1;
        let bestVal = -Infinity;
        slots.forEach((slot, i) => {
          if (!slot) return;
          const val = slot.type === 'broker' ? brokerRateValue(slot) : 0;
          if (val > bestVal) {
            bestVal = val;
            bestIdx = i;
          }
        });
        if (bestIdx >= 0) winners[fieldIdx] = bestIdx;
      } else if (field.label === 'Trust score') {
        let bestIdx = -1;
        let bestVal = -Infinity;
        slots.forEach((slot, i) => {
          if (!slot) return;
          if (slot.trustScore > bestVal) {
            bestVal = slot.trustScore;
            bestIdx = i;
          }
        });
        if (bestIdx >= 0) winners[fieldIdx] = bestIdx;
      }
    });
    return winners;
  }, [slots, activeSlots.length]);

  // Picker filtered list
  const pickerResults = useMemo(() => {
    const all: Array<BrokerEntity | PropFirmEntity> = [...BROKERS, ...PROP_FIRMS];
    if (!query) return all.sort((a, b) => b.trustScore - a.trustScore).slice(0, 50);
    const q = query.toLowerCase();
    return all
      .filter((e) => e.name.toLowerCase().includes(q) || e.slug.includes(q))
      .sort((a, b) => b.trustScore - a.trustScore)
      .slice(0, 50);
  }, [query]);

  return (
    <div className="preview-hero-root relative isolate min-h-screen overflow-hidden">
      <div className="ph-mesh-bg" />
      <div className="absolute inset-0 ph-grid-bg opacity-30" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 pb-24 pt-8 lg:px-10 lg:pt-10">
        {/* Breadcrumb + title */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 flex items-center gap-3 text-xs"
          style={{ color: 'var(--ph-text-3)' }}
        >
          <Link
            href="/preview-hero/"
            className="ph-focus-ring inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ph-glass transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to hero
          </Link>
          <span className="opacity-50">·</span>
          <span style={{ color: 'var(--ph-text-1)' }}>Compare</span>
        </motion.div>

        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-center"
        >
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.14em] ph-glass" style={{ color: 'var(--ph-text-2)' }}>
            <Sparkles className="h-3 w-3" style={{ color: 'var(--ph-cyan)' }} />
            3-way compare
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
            <span className="ph-gradient-text">Side by side, </span>
            <span className="ph-gradient-text-brand">truth by truth.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm md:text-base" style={{ color: 'var(--ph-text-2)' }}>
            Pick up to three entities. Brokers and prop firms can be mixed. Best-in-row fields get
            highlighted in emerald so the winner is obvious.
          </p>
        </motion.header>

        {/* Slot header row */}
        <div className="mb-3 grid gap-4 md:grid-cols-[220px_1fr_1fr_1fr]">
          <div className="hidden md:block" />
          {slots.map((slot, i) => (
            <SlotHeader
              key={i}
              slot={slot}
              slotIdx={i}
              onPick={() => setPickerForSlot(i)}
              onClear={() => setSlot(i, null)}
            />
          ))}
        </div>

        {/* Comparison grid */}
        <div className="rounded-3xl ph-glass-strong p-5">
          {(['trust', 'terms', 'cashback'] as const).map((group, groupIdx) => {
            const groupMeta = GROUP_LABELS[group];
            const groupFields = FIELDS.map((f, idx) => ({ ...f, idx })).filter(
              (f) => f.group === group
            );
            return (
              <div key={group} className={groupIdx > 0 ? 'mt-6' : ''}>
                <div
                  className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em]"
                  style={{ color: groupMeta.color }}
                >
                  <div className="h-1 w-6 rounded-full" style={{ background: groupMeta.color }} />
                  {groupMeta.label}
                </div>
                <div className="overflow-hidden rounded-2xl" style={{
                  background: 'rgba(255,255,255,0.015)',
                  border: '1px solid var(--ph-border-subtle)',
                }}>
                  {groupFields.map((field, fieldIdx) => (
                    <div
                      key={field.idx}
                      className={`grid grid-cols-[220px_1fr_1fr_1fr] items-stretch text-sm ${
                        fieldIdx !== groupFields.length - 1 ? 'border-b' : ''
                      }`}
                      style={{ borderColor: 'var(--ph-border-subtle)' }}
                    >
                      <div
                        className="px-4 py-3 text-[11px] uppercase tracking-[0.1em]"
                        style={{ color: 'var(--ph-text-3)' }}
                      >
                        {field.label}
                      </div>
                      {slots.map((slot, slotIdx) => {
                        const value = slot ? field.get(slot) : null;
                        const isWinner = rowWinners[field.idx] === slotIdx && activeSlots.length >= 2;
                        return (
                          <div
                            key={slotIdx}
                            className="relative flex items-center gap-2 border-l px-4 py-3 text-[13px]"
                            style={{
                              borderColor: 'var(--ph-border-subtle)',
                              background: isWinner ? 'rgba(74, 222, 128, 0.06)' : 'transparent',
                              color: value && value !== '—' ? 'var(--ph-text-1)' : 'var(--ph-text-4)',
                            }}
                          >
                            <span className="truncate">{value ?? '—'}</span>
                            {isWinner && (
                              <span
                                className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full"
                                style={{
                                  background: 'rgba(74, 222, 128, 0.18)',
                                  color: 'var(--ph-emerald)',
                                }}
                                aria-label="Best in row"
                              >
                                <Check className="h-2.5 w-2.5" strokeWidth={3} />
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action CTAs per populated slot */}
        {activeSlots.length > 0 && (
          <div className="mt-6 grid gap-4 md:grid-cols-[220px_1fr_1fr_1fr]">
            <div className="hidden md:block" />
            {slots.map((slot, i) => (
              <div key={i}>
                {slot ? (
                  <Link
                    href={
                      slot.type === 'broker'
                        ? `/preview-hero/brokers/${slot.slug}/`
                        : `/preview-hero/firms/${slot.slug}/`
                    }
                    className="ph-focus-ring group flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold transition-transform hover:scale-[1.02]"
                    style={{
                      background: 'linear-gradient(135deg, #4ADE80 0%, #22D3EE 100%)',
                      color: '#05070E',
                      boxShadow: '0 0 32px rgba(74,222,128,0.3)',
                    }}
                  >
                    Open {slot.name} dossier
                    <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ) : (
                  <div
                    className="flex items-center justify-center rounded-2xl py-3 text-xs"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px dashed var(--ph-border-subtle)',
                      color: 'var(--ph-text-4)',
                    }}
                  >
                    Empty slot
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Entity picker modal */}
      <AnimatePresence>
        {pickerForSlot !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-20"
            style={{ background: 'rgba(5, 7, 14, 0.75)', backdropFilter: 'blur(8px)' }}
            onClick={() => setPickerForSlot(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl overflow-hidden rounded-2xl ph-glass-strong"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 border-b px-5 py-4" style={{ borderColor: 'var(--ph-border-subtle)' }}>
                <Search className="h-4 w-4" style={{ color: 'var(--ph-text-2)' }} />
                <input
                  ref={pickerRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search brokers and prop firms..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-500"
                  style={{ color: 'var(--ph-text-1)' }}
                />
                <button
                  type="button"
                  onClick={() => setPickerForSlot(null)}
                  className="ph-focus-ring rounded-lg p-1 transition-colors hover:bg-white/5"
                  aria-label="Close picker"
                >
                  <X className="h-4 w-4" style={{ color: 'var(--ph-text-3)' }} />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {pickerResults.map((e) => (
                  <button
                    key={e.type + ':' + e.slug}
                    type="button"
                    onClick={() => setSlot(pickerForSlot, e)}
                    className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-white/5"
                  >
                    <div
                      className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg"
                      style={{
                        background: `linear-gradient(135deg, ${e.logoColor}33 0%, ${e.logoColor}11 100%)`,
                        border: `1px solid ${e.logoColor}55`,
                        padding: isImageLogo(e.logo) ? 4 : 0,
                        color: e.logoColor,
                      }}
                    >
                      {isImageLogo(e.logo) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={e.logo} alt="" className="h-full w-full object-contain" loading="lazy" />
                      ) : (
                        <span className="text-xs font-bold">{initialsOf(e.name)}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium" style={{ color: 'var(--ph-text-1)' }}>
                          {e.name}
                        </span>
                        <span
                          className="rounded-full px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider"
                          style={{
                            background: e.type === 'broker' ? 'rgba(74,222,128,0.1)' : 'rgba(167,139,250,0.1)',
                            color: e.type === 'broker' ? 'var(--ph-emerald)' : 'var(--ph-violet)',
                          }}
                        >
                          {e.type === 'broker' ? 'Broker' : 'Firm'}
                        </span>
                      </div>
                      <div className="truncate text-[11px]" style={{ color: 'var(--ph-text-3)' }}>
                        Trust {e.trustScore.toFixed(1)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Slot header
 * ------------------------------------------------------------------ */

function SlotHeader({
  slot,
  slotIdx,
  onPick,
  onClear,
}: {
  slot: Slot;
  slotIdx: number;
  onPick: () => void;
  onClear: () => void;
}) {
  if (!slot) {
    return (
      <button
        type="button"
        onClick={onPick}
        className="ph-focus-ring flex min-h-[120px] w-full flex-col items-center justify-center gap-2 rounded-2xl text-sm transition-colors hover:bg-white/[0.02]"
        style={{
          background: 'rgba(255,255,255,0.01)',
          border: '1px dashed var(--ph-border-subtle)',
          color: 'var(--ph-text-3)',
        }}
      >
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <Plus className="h-5 w-5" />
        </div>
        <span className="font-medium">Add entity #{slotIdx + 1}</span>
      </button>
    );
  }

  return (
    <div className="relative rounded-2xl ph-glass p-4">
      <button
        type="button"
        onClick={onClear}
        className="ph-focus-ring absolute right-2 top-2 rounded-lg p-1 transition-colors hover:bg-white/5"
        aria-label="Remove"
      >
        <X className="h-3 w-3" style={{ color: 'var(--ph-text-3)' }} />
      </button>

      <div className="flex items-center gap-3">
        <div
          className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${slot.logoColor}33 0%, ${slot.logoColor}11 100%)`,
            border: `1px solid ${slot.logoColor}55`,
            padding: isImageLogo(slot.logo) ? 5 : 0,
            color: slot.logoColor,
          }}
        >
          {isImageLogo(slot.logo) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={slot.logo} alt="" className="h-full w-full object-contain" loading="lazy" />
          ) : (
            <span className="text-sm font-bold">{initialsOf(slot.name)}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-bold" style={{ color: 'var(--ph-text-1)' }}>
              {slot.name}
            </span>
            {slot.type === 'broker' ? (
              <Shield className="h-3 w-3 flex-shrink-0" style={{ color: 'var(--ph-emerald)' }} />
            ) : (
              <Target className="h-3 w-3 flex-shrink-0" style={{ color: 'var(--ph-violet)' }} />
            )}
          </div>
          <div className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--ph-text-3)' }}>
            <Star className="h-2.5 w-2.5" style={{ color: '#FBBF24' }} fill="#FBBF24" />
            <span className="ph-money">{slot.trustScore.toFixed(1)}</span>
            <span className="opacity-40">·</span>
            <span>{slot.type === 'broker' ? 'Broker' : 'Prop firm'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
