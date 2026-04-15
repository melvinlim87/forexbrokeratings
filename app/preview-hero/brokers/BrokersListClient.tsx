'use client';

/**
 * Brokers listing client — searchable, sortable, filterable grid of all 500+ brokers.
 * Matches the preview-hero dark glass theme.
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, Star, Shield, TrendingUp, Zap, GraduationCap, Award, ChevronRight, SlidersHorizontal } from 'lucide-react';

type HeroBroker = {
  slug: string;
  name: string;
  logo: string | null;
  logoColor: string;
  rating: number;
  minDeposit: number;
  jurisdictions: string[];
  platforms: string[];
  accountTypes: string[];
  rebateRates: Array<{ accountType: string; instrumentClass: string; ratePerLot: number }>;
  lastVerified: string;
  popularityRank: number;
  headquarters: string | null;
  founded: string | null;
  affiliateUrl: string | null;
};

const SORT_OPTIONS = [
  { value: 'rating',   label: 'Top Rated' },
  { value: 'rebate',   label: 'Highest Cashback' },
  { value: 'deposit',  label: 'Lowest Deposit' },
  { value: 'name',     label: 'A → Z' },
];

const FILTER_OPTIONS = [
  { value: 'all',        label: 'All Brokers',   icon: null },
  { value: 'top',        label: 'Rating ≥ 8',    icon: Star },
  { value: 'ecn',        label: 'ECN / cTrader', icon: Zap },
  { value: 'beginner',   label: 'Low Deposit',   icon: GraduationCap },
  { value: 'regulated',  label: 'FCA / ASIC',    icon: Shield },
];

function getBestRebate(broker: HeroBroker): number {
  if (!broker.rebateRates?.length) return 0;
  return Math.max(...broker.rebateRates.map(r => r.ratePerLot));
}

function initials(name: string): string {
  return name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

const PAGE_SIZE = 48;

export default function BrokersListClient({ brokers }: { brokers: HeroBroker[] }) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'rating' | 'rebate' | 'deposit' | 'name'>('rating');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = brokers;

    // Text search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(b =>
        b.name.toLowerCase().includes(q) ||
        (b.headquarters || '').toLowerCase().includes(q) ||
        b.platforms.some(p => p.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (filter === 'top')       list = list.filter(b => b.rating >= 8);
    if (filter === 'ecn')       list = list.filter(b => b.platforms.includes('cTrader'));
    if (filter === 'beginner')  list = list.filter(b => b.minDeposit <= 50);
    if (filter === 'regulated') list = list.filter(b => b.jurisdictions.some(j => /FCA|ASIC/i.test(j)));

    // Sort
    if (sort === 'rating')  list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === 'rebate')  list = [...list].sort((a, b) => getBestRebate(b) - getBestRebate(a));
    if (sort === 'deposit') list = [...list].sort((a, b) => a.minDeposit - b.minDeposit);
    if (sort === 'name')    list = [...list].sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [brokers, search, sort, filter]);

  // Reset to page 1 whenever filter/search changes
  const pagedList = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = pagedList.length < filtered.length;

  return (
    <div className="relative isolate min-h-screen">
      <div className="ph-mesh-bg" />
      <div className="absolute inset-0 ph-grid-bg opacity-20" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 md:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--ph-emerald)' }}>
            {brokers.length}+ verified brokers
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl" style={{ color: 'var(--ph-text-1)' }}>
            Forex Broker Reviews
          </h1>
          <p className="mx-auto max-w-2xl text-[16px] leading-relaxed" style={{ color: 'var(--ph-text-2)' }}>
            Independent ratings, cashback rates, and deep-dive regulation analysis — updated regularly.
          </p>
        </motion.div>

        {/* Search + controls */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: 'var(--ph-text-3)' }}
            />
            <input
              type="text"
              placeholder="Search broker, platform, country…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full rounded-2xl py-3 pl-10 pr-4 text-[14px] outline-none transition-colors ph-glass"
              style={{
                color: 'var(--ph-text-1)',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--ph-border-subtle)',
              }}
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--ph-text-3)' }} />
            <select
              value={sort}
              onChange={e => { setSort(e.target.value as any); setPage(1); }}
              className="rounded-xl py-2 pl-3 pr-8 text-[13px] outline-none ph-glass"
              style={{
                color: 'var(--ph-text-1)',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--ph-border-subtle)',
              }}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category pills */}
        <div className="mb-8 flex flex-wrap gap-2">
          {FILTER_OPTIONS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => { setFilter(value); setPage(1); }}
              className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors"
              style={{
                background: filter === value ? 'linear-gradient(135deg, #4ADE80, #22D3EE)' : 'rgba(255,255,255,0.06)',
                color: filter === value ? '#05070E' : 'var(--ph-text-2)',
                border: filter === value ? 'none' : '1px solid var(--ph-border-subtle)',
              }}
            >
              {Icon && <Icon className="h-3.5 w-3.5" />}
              {label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="mb-6 text-[13px]" style={{ color: 'var(--ph-text-3)' }}>
          Showing {Math.min(pagedList.length, filtered.length)} of {filtered.length} brokers
        </div>

        {/* Broker grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pagedList.map((broker, i) => (
            <BrokerCard key={broker.slug} broker={broker} index={i} />
          ))}
        </div>

        {/* Load more */}
        {hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setPage(p => p + 1)}
              className="rounded-2xl px-8 py-3 text-[14px] font-semibold transition-colors ph-glass"
              style={{ color: 'var(--ph-text-1)', border: '1px solid var(--ph-border-subtle)' }}
            >
              Load more — {filtered.length - pagedList.length} remaining
            </button>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="py-20 text-center" style={{ color: 'var(--ph-text-3)' }}>
            No brokers match your search. Try clearing filters.
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Broker card                                                          */
/* ------------------------------------------------------------------ */

function BrokerCard({ broker, index }: { broker: HeroBroker; index: number }) {
  const bestRebate = getBestRebate(broker);
  const ratingColor = broker.rating >= 8 ? 'var(--ph-emerald)' : broker.rating >= 6 ? 'var(--ph-cyan)' : '#F87171';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index, 12) * 0.04 }}
    >
      <Link
        href={`/preview-hero/brokers/${broker.slug}/`}
        className="group flex flex-col gap-3 rounded-2xl p-4 transition-all ph-glass hover:border-white/20"
        style={{ border: '1px solid var(--ph-border-subtle)' }}
      >
        {/* Logo + rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-[13px] font-bold"
              style={{
                background: broker.logo ? 'rgba(255,255,255,0.07)' : `${broker.logoColor}22`,
                border: `1px solid ${broker.logoColor}44`,
                color: broker.logoColor,
              }}
            >
              {broker.logo ? (
                <Image
                  src={broker.logo}
                  alt={broker.name}
                  width={28}
                  height={28}
                  className="rounded-lg"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                initials(broker.name)
              )}
            </div>
            <div>
              <div className="line-clamp-1 text-[14px] font-semibold" style={{ color: 'var(--ph-text-1)' }}>
                {broker.name}
              </div>
              {broker.headquarters && (
                <div className="text-[11px]" style={{ color: 'var(--ph-text-3)' }}>
                  {broker.headquarters.split(',').pop()?.trim()}
                </div>
              )}
            </div>
          </div>

          {/* Rating badge */}
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-[13px] font-bold"
            style={{ background: `${ratingColor}18`, border: `1px solid ${ratingColor}44`, color: ratingColor }}
          >
            {broker.rating.toFixed(1)}
          </div>
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg p-2 text-center ph-glass">
            <div className="text-[10px] uppercase tracking-[0.1em]" style={{ color: 'var(--ph-text-3)' }}>
              Min. Deposit
            </div>
            <div className="mt-0.5 text-[13px] font-semibold" style={{ color: 'var(--ph-text-1)' }}>
              {broker.minDeposit === 0 ? 'None' : `$${broker.minDeposit}`}
            </div>
          </div>
          <div className="rounded-lg p-2 text-center ph-glass">
            <div className="text-[10px] uppercase tracking-[0.1em]" style={{ color: 'var(--ph-text-3)' }}>
              Cashback
            </div>
            <div className="mt-0.5 text-[13px] font-semibold" style={{ color: 'var(--ph-emerald)' }}>
              {bestRebate > 0 ? `$${bestRebate.toFixed(1)}/lot` : '—'}
            </div>
          </div>
        </div>

        {/* Platforms */}
        {broker.platforms.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {broker.platforms.slice(0, 3).map(p => (
              <span
                key={p}
                className="rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--ph-text-3)' }}
              >
                {p}
              </span>
            ))}
          </div>
        )}

        {/* Arrow */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex gap-1">
            {broker.jurisdictions.slice(0, 2).map(j => (
              <span key={j} className="text-[10px]" style={{ color: 'var(--ph-text-4)' }}>
                {j}
              </span>
            ))}
          </div>
          <ChevronRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            style={{ color: 'var(--ph-text-3)' }}
          />
        </div>
      </Link>
    </motion.div>
  );
}
