'use client';

/**
 * Prop firms listing client — searchable + sortable grid of all prop firms.
 * Matches the preview-hero dark glass theme.
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, Star, Zap, Trophy, Target, ChevronRight, SlidersHorizontal } from 'lucide-react';

type HeroFirm = {
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

const SORT_OPTIONS = [
  { value: 'rating',   label: 'Top Rated' },
  { value: 'split',    label: 'Highest Profit Split' },
  { value: 'price',    label: 'Lowest Entry Price' },
  { value: 'name',     label: 'A → Z' },
];

const FILTER_OPTIONS = [
  { value: 'all',      label: 'All Firms',         icon: null },
  { value: 'top',      label: 'Rating ≥ 8',        icon: Star },
  { value: '1step',    label: '1-Step',            icon: Zap },
  { value: '2step',    label: '2-Step',            icon: Target },
  { value: 'instant',  label: 'Instant Funding',  icon: Trophy },
];

function getLowestPrice(firm: HeroFirm): number {
  const prices = Object.values(firm.pricing || {}).map(p => p.discounted || p.standard).filter(Boolean);
  return prices.length ? Math.min(...prices) : 999;
}

function parseSplit(split: string): number {
  const match = split.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

function initials(name: string): string {
  return name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function fmtAccountSize(sizes: number[]): string {
  if (!sizes?.length) return '—';
  const min = Math.min(...sizes);
  const max = Math.max(...sizes);
  if (min === max) return `$${(min / 1000).toFixed(0)}K`;
  return `$${(min / 1000).toFixed(0)}K – $${max >= 1000000 ? (max / 1000000).toFixed(0) + 'M' : (max / 1000).toFixed(0) + 'K'}`;
}

const PAGE_SIZE = 48;

export default function FirmsListClient({ firms }: { firms: HeroFirm[] }) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'rating' | 'split' | 'price' | 'name'>('rating');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = firms;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(f =>
        f.name.toLowerCase().includes(q) ||
        (f.headquarters || '').toLowerCase().includes(q) ||
        f.evaluationModel.toLowerCase().includes(q)
      );
    }

    if (filter === 'top')     list = list.filter(f => f.rating >= 8);
    if (filter === '1step')   list = list.filter(f => /1.?step|one.?step/i.test(f.evaluationModel));
    if (filter === '2step')   list = list.filter(f => /2.?step|two.?step/i.test(f.evaluationModel));
    if (filter === 'instant') list = list.filter(f => /instant|direct/i.test(f.evaluationModel));

    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === 'split')  list = [...list].sort((a, b) => parseSplit(b.profitSplit) - parseSplit(a.profitSplit));
    if (sort === 'price')  list = [...list].sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
    if (sort === 'name')   list = [...list].sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [firms, search, sort, filter]);

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
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: '#FBBF24' }}>
            {firms.length}+ funded trader programs
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl" style={{ color: 'var(--ph-text-1)' }}>
            Prop Trading Firm Reviews
          </h1>
          <p className="mx-auto max-w-2xl text-[16px] leading-relaxed" style={{ color: 'var(--ph-text-2)' }}>
            Independent reviews of prop firms — challenge rules, payout speeds, profit splits and trader feedback.
          </p>
        </motion.div>

        {/* Search + sort */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--ph-text-3)' }} />
            <input
              type="text"
              placeholder="Search firm, model, country…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full rounded-2xl py-3 pl-10 pr-4 text-[14px] outline-none transition-colors ph-glass"
              style={{ color: 'var(--ph-text-1)', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--ph-border-subtle)' }}
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--ph-text-3)' }} />
            <select
              value={sort}
              onChange={e => { setSort(e.target.value as any); setPage(1); }}
              className="rounded-xl py-2 pl-3 pr-8 text-[13px] outline-none ph-glass"
              style={{ color: 'var(--ph-text-1)', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--ph-border-subtle)' }}
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
                background: filter === value ? 'linear-gradient(135deg, #FBBF24, #F59E0B)' : 'rgba(255,255,255,0.06)',
                color: filter === value ? '#05070E' : 'var(--ph-text-2)',
                border: filter === value ? 'none' : '1px solid var(--ph-border-subtle)',
              }}
            >
              {Icon && <Icon className="h-3.5 w-3.5" />}
              {label}
            </button>
          ))}
        </div>

        {/* Result count */}
        <div className="mb-6 text-[13px]" style={{ color: 'var(--ph-text-3)' }}>
          Showing {pagedList.length} of {filtered.length} prop firms
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pagedList.map((firm, i) => (
            <FirmCard key={firm.slug} firm={firm} index={i} />
          ))}
        </div>

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
            No prop firms match. Try clearing the filter.
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Firm card                                                            */
/* ------------------------------------------------------------------ */

function FirmCard({ firm, index }: { firm: HeroFirm; index: number }) {
  const lowestPrice = getLowestPrice(firm);
  const ratingColor = firm.rating >= 8 ? '#FBBF24' : firm.rating >= 6 ? 'var(--ph-cyan)' : '#F87171';
  const splitPct = parseSplit(firm.profitSplit);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index, 12) * 0.04 }}
    >
      <Link
        href={`/preview-hero/firms/${firm.slug}/`}
        className="group flex flex-col gap-3 rounded-2xl p-4 transition-all ph-glass hover:border-white/20"
        style={{ border: '1px solid var(--ph-border-subtle)' }}
      >
        {/* Logo + rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-[13px] font-bold"
              style={{
                background: firm.logo ? 'rgba(255,255,255,0.07)' : `${firm.logoColor}22`,
                border: `1px solid ${firm.logoColor}44`,
                color: firm.logoColor,
              }}
            >
              {firm.logo ? (
                <Image
                  src={firm.logo}
                  alt={firm.name}
                  width={28}
                  height={28}
                  className="rounded-lg"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                initials(firm.name)
              )}
            </div>
            <div>
              <div className="line-clamp-1 text-[14px] font-semibold" style={{ color: 'var(--ph-text-1)' }}>
                {firm.name}
              </div>
              <div className="text-[11px]" style={{ color: 'var(--ph-text-3)' }}>
                {firm.evaluationModel}
              </div>
            </div>
          </div>
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-[13px] font-bold"
            style={{ background: `${ratingColor}18`, border: `1px solid ${ratingColor}44`, color: ratingColor }}
          >
            {firm.rating.toFixed(1)}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg p-2 text-center ph-glass">
            <div className="text-[10px] uppercase tracking-[0.1em]" style={{ color: 'var(--ph-text-3)' }}>Profit Split</div>
            <div className="mt-0.5 text-[13px] font-semibold" style={{ color: '#FBBF24' }}>
              {firm.profitSplit || '—'}
            </div>
          </div>
          <div className="rounded-lg p-2 text-center ph-glass">
            <div className="text-[10px] uppercase tracking-[0.1em]" style={{ color: 'var(--ph-text-3)' }}>From</div>
            <div className="mt-0.5 text-[13px] font-semibold" style={{ color: 'var(--ph-text-1)' }}>
              {lowestPrice < 999 ? `$${lowestPrice}` : '—'}
            </div>
          </div>
        </div>

        {/* Account sizes */}
        <div className="text-[11px]" style={{ color: 'var(--ph-text-3)' }}>
          <span className="mr-1" style={{ color: 'var(--ph-text-4)' }}>Accounts:</span>
          {fmtAccountSize(firm.accountSizes)}
        </div>

        <div className="flex items-center justify-end pt-0.5">
          <ChevronRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            style={{ color: 'var(--ph-text-3)' }}
          />
        </div>
      </Link>
    </motion.div>
  );
}
