'use client';

/**
 * Full-page instant search — the Cmd+K command menu pattern.
 *
 * Shows all 675 entities (536 brokers + 139 prop firms) with a searchable
 * input at the top. Filters update on every keystroke. Keyboard arrows +
 * Enter navigate to the selected dossier.
 *
 * Dark, premium, keyboard-first — Linear / Arc browser aesthetic.
 */

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Search,
  Shield,
  Star,
  Target,
  X,
  Filter,
  Sparkles,
  Command,
  CornerDownLeft,
} from 'lucide-react';
import {
  BROKERS,
  PROP_FIRMS,
  initialsOf,
  isImageLogo,
  type BrokerEntity,
  type PropFirmEntity,
} from '../_data/entities';

type Mode = 'all' | 'broker' | 'prop-firm';

type Result = {
  type: 'broker' | 'prop-firm';
  slug: string;
  name: string;
  logo: string;
  logoColor: string;
  trustScore: number;
  href: string;
  subtitle: string;
  matchScore: number;
};

/* ------------------------------------------------------------------
 * Scoring + filtering
 * ------------------------------------------------------------------ */

function scoreMatch(query: string, name: string, slug: string): number {
  if (!query) return 1;
  const q = query.toLowerCase();
  const n = name.toLowerCase();
  const s = slug.toLowerCase();

  // Exact start match = highest
  if (n.startsWith(q)) return 1000 - q.length;
  if (s.startsWith(q)) return 950 - q.length;

  // Word-boundary match
  const nameWords = n.split(/\s+/);
  for (const w of nameWords) {
    if (w.startsWith(q)) return 800 - q.length;
  }

  // Contained somewhere
  if (n.includes(q)) return 600 - (n.indexOf(q) * 2);
  if (s.includes(q)) return 550 - (s.indexOf(q) * 2);

  // Fuzzy: every character present in order
  let cursor = 0;
  for (const ch of q) {
    cursor = n.indexOf(ch, cursor);
    if (cursor === -1) return 0;
    cursor += 1;
  }
  return 200;
}

function hydrateBroker(b: BrokerEntity): Result {
  return {
    type: 'broker',
    slug: b.slug,
    name: b.name,
    logo: b.logo,
    logoColor: b.logoColor,
    trustScore: b.trustScore,
    href: `/preview-hero/brokers/${b.slug}/`,
    subtitle: b.jurisdictions.slice(0, 3).join(' · ') || b.headquarters || '—',
    matchScore: 0,
  };
}

function hydratePropFirm(f: PropFirmEntity): Result {
  return {
    type: 'prop-firm',
    slug: f.slug,
    name: f.name,
    logo: f.logo,
    logoColor: f.logoColor,
    trustScore: f.trustScore,
    href: `/preview-hero/firms/${f.slug}/`,
    subtitle: `${f.evaluationModel} · ${f.profitSplit}`,
    matchScore: 0,
  };
}

/* ------------------------------------------------------------------
 * Main component
 * ------------------------------------------------------------------ */

export default function SearchClient() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<Mode>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Autofocus on mount + re-focus on Escape → clear
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Filtered + scored results
  const results = useMemo(() => {
    const base: Result[] = [];
    if (mode === 'all' || mode === 'broker') {
      for (const b of BROKERS) base.push(hydrateBroker(b));
    }
    if (mode === 'all' || mode === 'prop-firm') {
      for (const f of PROP_FIRMS) base.push(hydratePropFirm(f));
    }

    if (!query) {
      // Empty query → show everything sorted by trust score
      return base.sort((a, b) => b.trustScore - a.trustScore);
    }

    return base
      .map((r) => ({ ...r, matchScore: scoreMatch(query, r.name, r.slug) }))
      .filter((r) => r.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore || b.trustScore - a.trustScore);
  }, [query, mode]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, mode]);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(results.length - 1, i + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(0, i - 1));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        router.push(results[selectedIndex].href);
      } else if (e.key === 'Escape') {
        if (query) setQuery('');
        else router.push('/preview-hero/');
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [results, selectedIndex, router, query]);

  // Keep selected row in view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${selectedIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  const brokerCount = results.filter((r) => r.type === 'broker').length;
  const firmCount = results.filter((r) => r.type === 'prop-firm').length;

  return (
    <div className="preview-hero-root relative isolate min-h-screen overflow-hidden">
      <div className="ph-mesh-bg" />
      <div className="absolute inset-0 ph-grid-bg opacity-30" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[900px] flex-col px-6 pb-8 pt-8 lg:pt-12">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 flex items-center justify-between"
        >
          <Link
            href="/preview-hero/"
            className="ph-focus-ring inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs ph-glass transition-colors hover:text-white"
            style={{ color: 'var(--ph-text-2)' }}
          >
            <ArrowLeft className="h-3 w-3" />
            Back to hero
          </Link>

          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--ph-text-3)' }}>
            <Sparkles className="h-3 w-3" style={{ color: 'var(--ph-cyan)' }} />
            Instant search
          </div>
        </motion.header>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 text-center"
        >
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
            <span className="ph-gradient-text">Find any broker or </span>
            <span className="ph-gradient-text-brand">prop firm.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm" style={{ color: 'var(--ph-text-2)' }}>
            {BROKERS.length + PROP_FIRMS.length} entities indexed · type to filter · ↑↓ to navigate · ↵ to open
          </p>
        </motion.div>

        {/* Search input */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-4"
        >
          <div className="absolute -inset-px rounded-2xl opacity-60" style={{
            background: 'conic-gradient(from 180deg at 50% 50%, rgba(74,222,128,0.3), rgba(34,211,238,0.2), rgba(167,139,250,0.3), rgba(74,222,128,0.3))',
            filter: 'blur(16px)',
          }} />
          <div className="relative flex items-center gap-3 rounded-2xl ph-glass-strong px-5 py-4">
            <Search className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--ph-text-2)' }} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try 'IC Markets', 'FTMO', 'FCA regulated', 'zero account'..."
              className="flex-1 bg-transparent text-base outline-none placeholder:text-slate-500"
              style={{ color: 'var(--ph-text-1)' }}
              autoComplete="off"
              spellCheck={false}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="ph-focus-ring rounded-lg p-1 transition-colors hover:bg-white/5"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" style={{ color: 'var(--ph-text-3)' }} />
              </button>
            )}
            <div className="hidden items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-mono md:flex" style={{
              borderColor: 'var(--ph-border-subtle)',
              color: 'var(--ph-text-3)',
            }}>
              <Command className="h-3 w-3" />K
            </div>
          </div>
        </motion.div>

        {/* Mode filter pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-4 flex items-center gap-2"
        >
          <Filter className="h-3 w-3" style={{ color: 'var(--ph-text-3)' }} />
          {([
            { id: 'all' as Mode, label: `All (${BROKERS.length + PROP_FIRMS.length})` },
            { id: 'broker' as Mode, label: `Brokers (${BROKERS.length})` },
            { id: 'prop-firm' as Mode, label: `Prop Firms (${PROP_FIRMS.length})` },
          ]).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className="ph-focus-ring rounded-full border px-3 py-1 text-xs font-medium transition-all"
              style={{
                background: mode === m.id ? 'rgba(74, 222, 128, 0.12)' : 'transparent',
                borderColor: mode === m.id ? 'rgba(74, 222, 128, 0.4)' : 'var(--ph-border-subtle)',
                color: mode === m.id ? 'var(--ph-emerald)' : 'var(--ph-text-2)',
              }}
            >
              {m.label}
            </button>
          ))}
          <div className="ml-auto text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--ph-text-3)' }}>
            {results.length} {results.length === 1 ? 'result' : 'results'}
            {query && ` · ${brokerCount} brokers · ${firmCount} firms`}
          </div>
        </motion.div>

        {/* Results list */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto rounded-2xl ph-glass p-2"
          style={{ maxHeight: '58vh' }}
        >
          <AnimatePresence mode="popLayout">
            {results.length === 0 && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div
                  className="mb-3 flex h-12 w-12 items-center justify-center rounded-full"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--ph-border-subtle)',
                  }}
                >
                  <Search className="h-5 w-5" style={{ color: 'var(--ph-text-3)' }} />
                </div>
                <div className="text-sm font-semibold" style={{ color: 'var(--ph-text-1)' }}>
                  No matches for &quot;{query}&quot;
                </div>
                <div className="mt-1 text-xs" style={{ color: 'var(--ph-text-3)' }}>
                  Try a shorter query or switch the filter mode
                </div>
              </motion.div>
            )}

            {results.slice(0, 100).map((r, i) => (
              <motion.div
                key={r.type + ':' + r.slug}
                data-idx={i}
                layout
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Link
                  href={r.href}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className="ph-focus-ring flex items-center gap-3 rounded-xl p-3 transition-colors"
                  style={{
                    background: i === selectedIndex ? 'rgba(74, 222, 128, 0.08)' : 'transparent',
                    border: `1px solid ${i === selectedIndex ? 'rgba(74,222,128,0.25)' : 'transparent'}`,
                  }}
                >
                  {/* Logo */}
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl"
                    style={{
                      background: `linear-gradient(135deg, ${r.logoColor}33 0%, ${r.logoColor}11 100%)`,
                      border: `1px solid ${r.logoColor}55`,
                      padding: isImageLogo(r.logo) ? 5 : 0,
                      color: r.logoColor,
                    }}
                  >
                    {isImageLogo(r.logo) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.logo} alt="" className="h-full w-full object-contain" loading="lazy" />
                    ) : (
                      <span className="text-xs font-bold">{initialsOf(r.name)}</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold" style={{ color: 'var(--ph-text-1)' }}>
                        {r.name}
                      </span>
                      {r.type === 'broker' ? (
                        <Shield className="h-3 w-3 flex-shrink-0" style={{ color: 'var(--ph-emerald)' }} />
                      ) : (
                        <Target className="h-3 w-3 flex-shrink-0" style={{ color: 'var(--ph-violet)' }} />
                      )}
                      <span
                        className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
                        style={{
                          background: r.type === 'broker' ? 'rgba(74,222,128,0.1)' : 'rgba(167,139,250,0.1)',
                          color: r.type === 'broker' ? 'var(--ph-emerald)' : 'var(--ph-violet)',
                        }}
                      >
                        {r.type === 'broker' ? 'Broker' : 'Prop Firm'}
                      </span>
                    </div>
                    <div className="truncate text-xs" style={{ color: 'var(--ph-text-3)' }}>
                      {r.subtitle}
                    </div>
                  </div>

                  <div className="flex flex-shrink-0 items-center gap-2 text-xs" style={{ color: 'var(--ph-text-2)' }}>
                    <Star className="h-3 w-3" style={{ color: '#FBBF24' }} fill="#FBBF24" />
                    <span className="ph-money font-semibold">{r.trustScore.toFixed(1)}</span>
                    {i === selectedIndex && (
                      <CornerDownLeft className="h-3 w-3 ml-1" style={{ color: 'var(--ph-emerald)' }} />
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Hint bar */}
        <div className="mt-4 flex items-center justify-center gap-5 text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--ph-text-4)' }}>
          <Hint label="navigate" keys={['↑', '↓']} />
          <Hint label="open" keys={['↵']} />
          <Hint label="clear" keys={['esc']} />
        </div>
      </div>
    </div>
  );
}

function Hint({ label, keys }: { label: string; keys: string[] }) {
  return (
    <div className="flex items-center gap-1.5">
      {keys.map((k) => (
        <kbd
          key={k}
          className="rounded border px-1.5 py-0.5 font-mono text-[10px]"
          style={{
            borderColor: 'var(--ph-border-subtle)',
            background: 'rgba(255,255,255,0.02)',
            color: 'var(--ph-text-2)',
          }}
        >
          {k}
        </kbd>
      ))}
      <span>{label}</span>
    </div>
  );
}
