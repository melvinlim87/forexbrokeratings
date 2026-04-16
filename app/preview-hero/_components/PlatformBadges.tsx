'use client';

/**
 * Color-coded platform badges for MT4, MT5, cTrader, TradingView, etc.
 * Uses letter marks (not trademarked logos) with distinctive brand colours.
 */

const PLATFORM_CONFIG: Record<string, { abbr: string; color: string; bg: string }> = {
  MT4:          { abbr: 'MT4',  color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
  MT5:          { abbr: 'MT5',  color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)' },
  cTrader:      { abbr: 'cT',   color: '#F97316', bg: 'rgba(249,115,22,0.12)' },
  TradingView:  { abbr: 'TV',   color: '#22C55E', bg: 'rgba(34,197,94,0.12)' },
  NinjaTrader:  { abbr: 'NT',   color: '#EAB308', bg: 'rgba(234,179,8,0.12)' },
  IRESS:        { abbr: 'IR',   color: '#06B6D4', bg: 'rgba(6,182,212,0.12)' },
  ProRealTime:  { abbr: 'PRT',  color: '#EC4899', bg: 'rgba(236,72,153,0.12)' },
  'xStation 5': { abbr: 'xS5',  color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  DXtrade:      { abbr: 'DX',   color: '#14B8A6', bg: 'rgba(20,184,166,0.12)' },
  'FIX API':    { abbr: 'FIX',  color: '#6366F1', bg: 'rgba(99,102,241,0.12)' },
};

function getPlatformStyle(name: string): { abbr: string; color: string; bg: string } {
  if (PLATFORM_CONFIG[name]) return PLATFORM_CONFIG[name];
  const lower = name.toLowerCase();
  if (lower.includes('mt4') || lower.includes('metatrader 4')) return PLATFORM_CONFIG.MT4;
  if (lower.includes('mt5') || lower.includes('metatrader 5')) return PLATFORM_CONFIG.MT5;
  if (lower.includes('ctrader'))      return PLATFORM_CONFIG.cTrader;
  if (lower.includes('tradingview'))  return PLATFORM_CONFIG.TradingView;
  if (lower.includes('ninjatrader'))  return PLATFORM_CONFIG.NinjaTrader;
  if (lower.includes('dxtrade'))      return PLATFORM_CONFIG.DXtrade;
  if (lower.includes('fix api'))      return PLATFORM_CONFIG['FIX API'];
  // Generic fallback
  return {
    abbr: name.replace(/[^A-Z0-9]/g, '').slice(0, 3) || name.slice(0, 3).toUpperCase(),
    color: 'var(--ph-text-2)',
    bg: 'rgba(255,255,255,0.05)',
  };
}

export function PlatformBadge({ name }: { name: string }) {
  const s = getPlatformStyle(name);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.color}33` }}
    >
      <span className="font-mono text-[10px] font-bold opacity-70">{s.abbr}</span>
      {name}
    </span>
  );
}

export function PlatformBadges({ platforms }: { platforms: string[] }) {
  if (!platforms?.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {platforms.map((p) => (
        <PlatformBadge key={p} name={p} />
      ))}
    </div>
  );
}
