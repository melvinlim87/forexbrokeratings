'use client';

import Link from 'next/link';
import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import CountUp from 'react-countup';
import confetti from 'canvas-confetti';
import { ArrowRight, ChevronDown, Check, Search, Shield, Zap, ExternalLink } from 'lucide-react';
import { BROKERS, PROP_FIRMS, initialsOf, isImageLogo, type BrokerEntity, type PropFirmEntity } from '../_data/entities';

/** Build the dossier URL for an entity based on its type. */
function dossierUrl(entity: BrokerEntity | PropFirmEntity): string {
  return entity.type === 'broker'
    ? `/preview-hero/brokers/${entity.slug}/`
    : `/preview-hero/firms/${entity.slug}/`;
}

/* -------------------------------------------------------------
 * State
 * ----------------------------------------------------------- */

type Mode = 'broker' | 'prop-firm';

type CalcState = {
  mode: Mode;
  brokerSlug: string;
  propFirmSlug: string;
  accountType: string;
  volumeLots: number;
  accountSize: number;
  celebrated: boolean;
};

type CalcAction =
  | { type: 'SET_MODE'; mode: Mode }
  | { type: 'SELECT_BROKER'; slug: string }
  | { type: 'SELECT_PROP_FIRM'; slug: string }
  | { type: 'SET_ACCOUNT_TYPE'; accountType: string }
  | { type: 'SET_VOLUME'; lots: number }
  | { type: 'SET_ACCOUNT_SIZE'; size: number }
  | { type: 'CELEBRATED' };

// Pick the first broker with the highest rating AND a resolved jurisdiction
// (gives a visually interesting default on page load).
const DEFAULT_BROKER =
  BROKERS.find((b) => b.jurisdictions.length > 0) ?? BROKERS[0];
const DEFAULT_PROP_FIRM = PROP_FIRMS[0];

const initial: CalcState = {
  mode: 'broker',
  brokerSlug: DEFAULT_BROKER?.slug ?? '',
  propFirmSlug: DEFAULT_PROP_FIRM?.slug ?? '',
  accountType: DEFAULT_BROKER?.defaultAccountType ?? 'Standard',
  volumeLots: 40,
  accountSize:
    DEFAULT_PROP_FIRM?.accountSizes?.includes(100000)
      ? 100000
      : DEFAULT_PROP_FIRM?.accountSizes?.[Math.floor((DEFAULT_PROP_FIRM.accountSizes.length ?? 1) / 2)] ?? 100000,
  celebrated: false,
};

function reducer(state: CalcState, action: CalcAction): CalcState {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.mode, celebrated: false };
    case 'SELECT_BROKER': {
      const b = BROKERS.find((x) => x.slug === action.slug);
      return { ...state, brokerSlug: action.slug, accountType: b?.defaultAccountType ?? state.accountType, celebrated: false };
    }
    case 'SELECT_PROP_FIRM':
      return { ...state, propFirmSlug: action.slug, celebrated: false };
    case 'SET_ACCOUNT_TYPE':
      return { ...state, accountType: action.accountType, celebrated: false };
    case 'SET_VOLUME':
      return { ...state, volumeLots: Math.max(0, Math.min(500, Math.round(action.lots))) };
    case 'SET_ACCOUNT_SIZE':
      return { ...state, accountSize: action.size, celebrated: false };
    case 'CELEBRATED':
      return { ...state, celebrated: true };
  }
}

/* -------------------------------------------------------------
 * Helpers
 * ----------------------------------------------------------- */

function formatMoney(n: number, currency: string = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function calculateBroker(broker: BrokerEntity, accountType: string, volumeLots: number) {
  // Use forex rate for the chosen account type, fall back to first rate.
  const rates = broker.rebateRates.filter((r) => r.accountType === accountType);
  const forex = rates.find((r) => r.instrumentClass === 'forex') ?? broker.rebateRates[0];
  const ratePerLot = forex?.ratePerLot ?? 0;
  const monthly = volumeLots * ratePerLot;
  const yearly = monthly * 12;
  const perTrade = volumeLots > 0 ? monthly / volumeLots : 0;
  // Effective cost reduction: assume avg spread cost = $10/lot (industry avg).
  const costReductionPct = ratePerLot > 0 ? Math.min(100, (ratePerLot / 10) * 100) : 0;
  return { ratePerLot, monthly, yearly, perTrade, costReductionPct };
}

function calculatePropFirm(firm: PropFirmEntity, accountSize: number) {
  const tier = firm.pricing[accountSize];
  if (!tier) return { standardPrice: 0, discountedPrice: 0, rebate: 0, totalSaving: 0 };
  const discount = tier.standard - tier.discounted;
  return {
    standardPrice: tier.standard,
    discountedPrice: tier.discounted,
    rebate: tier.additionalRebate,
    totalSaving: discount + tier.additionalRebate,
  };
}

/* -------------------------------------------------------------
 * Subcomponents
 * ----------------------------------------------------------- */

function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <LayoutGroup id="calc-mode-toggle">
      <div
        role="tablist"
        aria-label="Select entity type"
        className="relative inline-flex rounded-full p-1 ph-glass-strong"
      >
        {(['broker', 'prop-firm'] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => onChange(m)}
            className="ph-focus-ring relative z-10 rounded-full px-5 py-2 text-sm font-medium transition-colors"
            style={{ color: mode === m ? '#05070E' : 'var(--ph-text-2)' }}
          >
            {mode === m && (
              <motion.span
                layoutId="ph-toggle-pill"
                className="absolute inset-0 -z-10 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #4ADE80 0%, #22D3EE 100%)',
                  boxShadow: '0 0 24px rgba(74,222,128,0.45)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 34 }}
              />
            )}
            {m === 'broker' ? 'Broker' : 'Prop Firm'}
          </button>
        ))}
      </div>
    </LayoutGroup>
  );
}

/* Tiny inline avatar that prefers an image logo, falling back to colored initials. */
function EntityLogo({
  entity,
  size = 44,
  rounded = 'xl',
}: {
  entity: { name: string; logo: string; logoColor: string };
  size?: number;
  rounded?: 'lg' | 'xl';
}) {
  const r = rounded === 'xl' ? 'rounded-xl' : 'rounded-lg';
  const hasImage = isImageLogo(entity.logo);
  if (hasImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={entity.logo}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        className={`${r} object-contain`}
        style={{
          width: size,
          height: size,
          background: `linear-gradient(135deg, ${entity.logoColor}33 0%, ${entity.logoColor}11 100%)`,
          border: `1px solid ${entity.logoColor}55`,
          padding: 6,
        }}
      />
    );
  }
  return (
    <div
      className={`${r} flex items-center justify-center text-sm font-bold`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${entity.logoColor}33 0%, ${entity.logoColor}11 100%)`,
        border: `1px solid ${entity.logoColor}55`,
        color: entity.logoColor,
        fontSize: size * 0.32,
      }}
    >
      {initialsOf(entity.name)}
    </div>
  );
}

function EntityPicker({
  mode,
  selectedSlug,
  onSelect,
}: {
  mode: Mode;
  selectedSlug: string;
  onSelect: (slug: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const list = mode === 'broker' ? BROKERS : PROP_FIRMS;
  const selected = list.find((x) => x.slug === selectedSlug);

  const filtered = useMemo(() => {
    if (!query) return list;
    const q = query.toLowerCase();
    return list.filter((x) => x.name.toLowerCase().includes(q) || x.slug.includes(q));
  }, [query, list]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (!selected) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="ph-focus-ring ph-glass flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-all hover:border-white/20"
      >
        <EntityLogo entity={selected} size={44} rounded="xl" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold truncate" style={{ color: 'var(--ph-text-1)' }}>
              {selected.name}
            </span>
            <Shield className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--ph-emerald)' }} />
          </div>
          <div className="text-xs" style={{ color: 'var(--ph-text-3)' }}>
            {mode === 'broker'
              ? `${(selected as BrokerEntity).jurisdictions.slice(0, 3).join(' · ')}`
              : `${(selected as PropFirmEntity).evaluationModel} · ${(selected as PropFirmEntity).profitSplit}`}
          </div>
        </div>
        <ChevronDown
          className="h-4 w-4 transition-transform"
          style={{
            color: 'var(--ph-text-3)',
            transform: open ? 'rotate(180deg)' : 'none',
          }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl ph-glass-strong"
          >
            <div className="flex items-center gap-2 border-b border-white/5 px-3 py-2.5">
              <Search className="h-4 w-4" style={{ color: 'var(--ph-text-3)' }} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${mode === 'broker' ? 'brokers' : 'prop firms'}…`}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-500"
                style={{ color: 'var(--ph-text-1)' }}
                autoFocus
              />
            </div>
            <div role="listbox" className="max-h-72 overflow-y-auto p-1.5">
              {filtered.map((x) => {
                const isSelected = x.slug === selectedSlug;
                return (
                  <button
                    key={x.slug}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onSelect(x.slug);
                      setOpen(false);
                      setQuery('');
                    }}
                    className="group flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-white/5"
                  >
                    <EntityLogo entity={x} size={36} rounded="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate" style={{ color: 'var(--ph-text-1)' }}>
                        {x.name}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--ph-text-3)' }}>
                        Trust {x.trustScore}/10
                      </div>
                    </div>
                    {isSelected && <Check className="h-4 w-4" style={{ color: 'var(--ph-emerald)' }} />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AccountTypeSelector({
  accountTypes,
  value,
  onChange,
}: {
  accountTypes: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {accountTypes.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className="ph-focus-ring rounded-full border px-3 py-1 text-xs font-medium transition-all"
          style={{
            background: value === t ? 'rgba(74,222,128,0.12)' : 'transparent',
            borderColor: value === t ? 'rgba(74,222,128,0.4)' : 'var(--ph-border-subtle)',
            color: value === t ? 'var(--ph-emerald)' : 'var(--ph-text-2)',
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

function VolumeSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const pct = Math.min(100, (value / 200) * 100);
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs uppercase tracking-wider" style={{ color: 'var(--ph-text-3)' }}>
          Monthly volume
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChange(value - 1)}
            className="ph-focus-ring flex h-6 w-6 items-center justify-center rounded-md border text-xs"
            style={{ borderColor: 'var(--ph-border-subtle)', color: 'var(--ph-text-2)' }}
            aria-label="Decrease lots"
          >
            −
          </button>
          <input
            type="number"
            min={0}
            max={500}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="ph-money ph-focus-ring w-14 rounded-md border bg-transparent px-2 py-0.5 text-right text-sm font-semibold"
            style={{ borderColor: 'var(--ph-border-subtle)', color: 'var(--ph-text-1)' }}
          />
          <span className="text-xs" style={{ color: 'var(--ph-text-3)' }}>
            lots
          </span>
          <button
            type="button"
            onClick={() => onChange(value + 1)}
            className="ph-focus-ring flex h-6 w-6 items-center justify-center rounded-md border text-xs"
            style={{ borderColor: 'var(--ph-border-subtle)', color: 'var(--ph-text-2)' }}
            aria-label="Increase lots"
          >
            +
          </button>
        </div>
      </div>
      <div className="relative h-2">
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        />
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #4ADE80 0%, #22D3EE 100%)',
            boxShadow: '0 0 16px rgba(74,222,128,0.4)',
          }}
        />
        <input
          type="range"
          min={0}
          max={200}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full cursor-pointer opacity-0"
          aria-label="Monthly trading volume slider"
        />
        <div
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 pointer-events-none"
          style={{
            left: `${pct}%`,
            background: 'var(--ph-bg-raised)',
            borderColor: 'var(--ph-emerald)',
            boxShadow: '0 0 12px rgba(74,222,128,0.6)',
          }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px]" style={{ color: 'var(--ph-text-4)' }}>
        <span>0</span>
        <span>50</span>
        <span>100</span>
        <span>150</span>
        <span>200+</span>
      </div>
    </div>
  );
}

function AccountSizePicker({
  sizes,
  value,
  onChange,
}: {
  sizes: number[];
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-wider" style={{ color: 'var(--ph-text-3)' }}>
        Account size
      </label>
      <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5">
        {sizes.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className="ph-focus-ring rounded-lg border px-2 py-2 text-xs font-medium transition-all"
            style={{
              background: value === s ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.02)',
              borderColor: value === s ? 'rgba(74,222,128,0.45)' : 'var(--ph-border-subtle)',
              color: value === s ? 'var(--ph-emerald)' : 'var(--ph-text-2)',
            }}
          >
            ${(s / 1000).toFixed(0)}K
          </button>
        ))}
      </div>
    </div>
  );
}

function OutputDisplay({
  mode,
  broker,
  propFirm,
  calc,
  propCalc,
}: {
  mode: Mode;
  broker?: BrokerEntity;
  propFirm?: PropFirmEntity;
  calc: ReturnType<typeof calculateBroker>;
  propCalc: ReturnType<typeof calculatePropFirm>;
}) {
  const primary = mode === 'broker' ? calc.monthly : propCalc.totalSaving;
  const yearly = mode === 'broker' ? calc.yearly : propCalc.totalSaving;
  const perTrade = mode === 'broker' ? calc.perTrade : propCalc.rebate;
  const costReduction = mode === 'broker' ? calc.costReductionPct : 0;

  return (
    <div className="relative">
      <div className="mb-1 text-[11px] uppercase tracking-[0.15em]" style={{ color: 'var(--ph-text-3)' }}>
        {mode === 'broker' ? 'Your estimated cashback' : 'Your total saving'}
      </div>

      <div className="flex items-baseline gap-2">
        <span
          className="ph-money text-5xl font-bold md:text-6xl"
          style={{
            background: 'linear-gradient(180deg, #FFFFFF 0%, #CBD5E1 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            WebkitTextFillColor: 'transparent',
          }}
          aria-live="polite"
        >
          <CountUp
            end={primary}
            duration={0.6}
            separator=","
            prefix="$"
            preserveValue
            decimals={0}
          />
        </span>
        <span className="text-sm" style={{ color: 'var(--ph-text-3)' }}>
          {mode === 'broker' ? '/month' : 'per challenge'}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs" style={{ color: 'var(--ph-text-2)' }}>
        {mode === 'broker' ? (
          <>
            <span>
              <span className="ph-money font-semibold" style={{ color: 'var(--ph-text-1)' }}>
                <CountUp end={yearly} duration={0.6} separator="," prefix="$" preserveValue />
              </span>{' '}
              /year
            </span>
            <span className="opacity-50">·</span>
            <span>
              <span className="ph-money font-semibold" style={{ color: 'var(--ph-text-1)' }}>
                ${perTrade.toFixed(2)}
              </span>{' '}
              avg/lot
            </span>
          </>
        ) : (
          <>
            <span>
              Standard price{' '}
              <span className="ph-money line-through" style={{ color: 'var(--ph-text-3)' }}>
                ${propCalc.standardPrice}
              </span>
            </span>
            <span className="opacity-50">·</span>
            <span>
              Your price{' '}
              <span className="ph-money font-semibold" style={{ color: 'var(--ph-emerald)' }}>
                ${propCalc.discountedPrice}
              </span>
            </span>
          </>
        )}
      </div>

      {mode === 'broker' && costReduction > 0 && (
        <div
          className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
          style={{
            background: 'rgba(74, 222, 128, 0.1)',
            border: '1px solid rgba(74, 222, 128, 0.25)',
            color: 'var(--ph-emerald)',
          }}
        >
          <Zap className="h-3 w-3" />
          <span className="font-semibold">{costReduction.toFixed(0)}%</span>
          <span style={{ color: 'var(--ph-text-2)' }}>effective cost reduction</span>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------
 * Main component
 * ----------------------------------------------------------- */

export default function CashbackCalculator() {
  const [state, dispatch] = useReducer(reducer, initial);
  const broker = BROKERS.find((b) => b.slug === state.brokerSlug);
  const propFirm = PROP_FIRMS.find((p) => p.slug === state.propFirmSlug);

  // Ensure accountType is valid for the currently selected broker.
  useEffect(() => {
    if (state.mode !== 'broker' || !broker) return;
    if (!broker.accountTypes.includes(state.accountType)) {
      dispatch({ type: 'SET_ACCOUNT_TYPE', accountType: broker.defaultAccountType });
    }
  }, [state.mode, state.brokerSlug, broker, state.accountType]);

  // Ensure account size is valid for the selected prop firm.
  useEffect(() => {
    if (state.mode !== 'prop-firm' || !propFirm) return;
    if (!propFirm.accountSizes.includes(state.accountSize)) {
      const pick = propFirm.accountSizes.includes(100000) ? 100000 : propFirm.accountSizes[Math.floor(propFirm.accountSizes.length / 2)];
      dispatch({ type: 'SET_ACCOUNT_SIZE', size: pick });
    }
  }, [state.mode, state.propFirmSlug, propFirm, state.accountSize]);

  const calc = broker
    ? calculateBroker(broker, state.accountType, state.volumeLots)
    : { ratePerLot: 0, monthly: 0, yearly: 0, perTrade: 0, costReductionPct: 0 };

  const propCalc = propFirm
    ? calculatePropFirm(propFirm, state.accountSize)
    : { standardPrice: 0, discountedPrice: 0, rebate: 0, totalSaving: 0 };

  // Confetti celebration when monthly cashback crosses $200 (broker mode)
  const primaryValue = state.mode === 'broker' ? calc.monthly : propCalc.totalSaving;
  const threshold = state.mode === 'broker' ? 200 : 100;
  useEffect(() => {
    if (!state.celebrated && primaryValue >= threshold) {
      dispatch({ type: 'CELEBRATED' });
      if (typeof window !== 'undefined') {
        confetti({
          particleCount: 60,
          spread: 55,
          origin: { y: 0.6, x: 0.3 },
          colors: ['#4ADE80', '#22D3EE', '#A78BFA'],
          disableForReducedMotion: true,
        });
      }
    }
  }, [primaryValue, threshold, state.celebrated]);

  const lastVerified =
    state.mode === 'broker' ? broker?.lastVerified : propFirm?.lastVerified;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-[520px]"
    >
      {/* Animated border glow */}
      <div
        className="absolute -inset-px rounded-3xl opacity-70"
        style={{
          background: 'conic-gradient(from 180deg at 50% 50%, rgba(74,222,128,0.4), rgba(34,211,238,0.3), rgba(167,139,250,0.4), rgba(74,222,128,0.4))',
          filter: 'blur(20px)',
        }}
      />

      <div className="relative rounded-3xl ph-glass-strong p-6 md:p-8">
        {/* Eyebrow */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em]" style={{ color: 'var(--ph-text-2)' }}>
            <span className="ph-live-dot" aria-hidden />
            <span>Live rates</span>
            <span className="opacity-40">·</span>
            <span>Real brokers</span>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="mb-5">
          <ModeToggle mode={state.mode} onChange={(m) => dispatch({ type: 'SET_MODE', mode: m })} />
        </div>

        {/* Entity picker */}
        <AnimatePresence mode="wait">
          <motion.div
            key={state.mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <EntityPicker
              mode={state.mode}
              selectedSlug={state.mode === 'broker' ? state.brokerSlug : state.propFirmSlug}
              onSelect={(slug) =>
                dispatch(
                  state.mode === 'broker'
                    ? { type: 'SELECT_BROKER', slug }
                    : { type: 'SELECT_PROP_FIRM', slug }
                )
              }
            />

            {/* Broker mode controls */}
            {state.mode === 'broker' && broker && (
              <>
                <AccountTypeSelector
                  accountTypes={broker.accountTypes}
                  value={state.accountType}
                  onChange={(t) => dispatch({ type: 'SET_ACCOUNT_TYPE', accountType: t })}
                />
                <VolumeSlider
                  value={state.volumeLots}
                  onChange={(v) => dispatch({ type: 'SET_VOLUME', lots: v })}
                />
              </>
            )}

            {/* Prop firm mode controls */}
            {state.mode === 'prop-firm' && propFirm && (
              <AccountSizePicker
                sizes={propFirm.accountSizes}
                value={state.accountSize}
                onChange={(s) => dispatch({ type: 'SET_ACCOUNT_SIZE', size: s })}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Divider */}
        <div className="my-5 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--ph-border-subtle), transparent)' }} />

        {/* Output */}
        <OutputDisplay mode={state.mode} broker={broker} propFirm={propFirm} calc={calc} propCalc={propCalc} />

        {/* CTA */}
        <button
          type="button"
          className="ph-focus-ring group mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold transition-all hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(135deg, #4ADE80 0%, #22D3EE 100%)',
            color: '#05070E',
            boxShadow: '0 0 32px rgba(74,222,128,0.35), 0 1px 0 rgba(255,255,255,0.25) inset',
          }}
        >
          <span>Start earning this rate</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>

        {/* Trust footer */}
        <div className="mt-3 flex items-center justify-between text-[10px]" style={{ color: 'var(--ph-text-3)' }}>
          <div className="flex items-center gap-1.5">
            <Shield className="h-3 w-3" />
            <span>Rate verified · updated {lastVerified}</span>
          </div>
          {state.mode === 'broker' && broker && (
            <Link
              href={dossierUrl(broker)}
              className="ph-focus-ring inline-flex items-center gap-1 font-medium transition-colors hover:text-white"
              style={{ color: 'var(--ph-cyan)' }}
            >
              Read full review
              <ExternalLink className="h-3 w-3" />
            </Link>
          )}
          {state.mode === 'prop-firm' && propFirm && (
            <Link
              href={dossierUrl(propFirm)}
              className="ph-focus-ring inline-flex items-center gap-1 font-medium transition-colors hover:text-white"
              style={{ color: 'var(--ph-cyan)' }}
            >
              Read full review
              <ExternalLink className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
