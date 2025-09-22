'use client';

import React, { useEffect, useMemo, useState } from 'react';

// Simple API route fetcher (powered by yahoo-finance2)
// Symbols used:
// - ^GSPC (S&P 500)
// - CL=F (Crude Oil Futures)
// - GC=F (Gold Futures)
// - USDJPY=X (USD/JPY)
// - AUDUSD=X (AUD/USD)
// - ^TNX (US 10Y Treasury Yield index; value ≈ yield% * 10)

const API_ENDPOINT = '/api/risk-on-risk-off/quotes?symbols=';

type Quote = {
  symbol: string;
  shortName?: string;
  regularMarketPrice?: number;
  regularMarketChangePercent?: number;
};

type Indicator = {
  key: string;
  label: string;
  symbol: string;
  side: 'riskon' | 'riskoff';
};

const INDICATORS: Indicator[] = [
  { key: 'spx', label: 'S&P 500', symbol: '^GSPC', side: 'riskon' },
  { key: 'oil', label: 'Crude Oil', symbol: 'CL=F', side: 'riskon' },
  { key: 'audusd', label: 'AUD/USD', symbol: 'AUDUSD=X', side: 'riskon' },
  { key: 'gold', label: 'Gold', symbol: 'GC=F', side: 'riskoff' },
  { key: 'usdjpy', label: 'USD/JPY', symbol: 'USDJPY=X', side: 'riskoff' },
  { key: 'us10y', label: 'US 10Y Yield', symbol: '^TNX', side: 'riskoff' },
];

function classNames(...arr: (string | false | undefined)[]) {
  return arr.filter(Boolean).join(' ');
}

function formatPct(n?: number) {
  if (n === undefined || n === null || Number.isNaN(n)) return '-';
  return `${n.toFixed(2)}%`;
}

function normalizeContribution(pct: number): number {
  // Map daily % change to [-1, 1], saturate beyond ±2%
  const capped = Math.max(-2, Math.min(2, pct));
  return capped / 2; // -1..1
}

function computeRiskScore(data: Record<string, Quote>): { score: number; parts: Record<string, number> } {
  const parts: Record<string, number> = {};
  let sum = 0;
  let count = 0;

  for (const ind of INDICATORS) {
    const q = data[ind.symbol];
    const pct = q?.regularMarketChangePercent ?? 0;
    const contrib = normalizeContribution(pct) * (ind.side === 'riskon' ? 1 : -1);
    parts[ind.key] = contrib; // -1..1
    sum += contrib;
    count += 1;
  }

  const avg = count ? sum / count : 0; // -1..1
  const score = Math.round(((avg + 1) / 2) * 100); // 0..100
  return { score, parts };
}

export default function RiskOnRiskOffPage() {
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [hoveredInd, setHoveredInd] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const symbols = INDICATORS.map(i => i.symbol).join(',');
      const res = await fetch(`${API_ENDPOINT}${encodeURIComponent(symbols)}`);
      if (!res.ok) throw new Error(`Failed to fetch quotes (${res.status})`);
      const json = await res.json();
      const arr: Quote[] = json?.result ?? [];
      const next: Record<string, Quote> = {};
      for (const q of arr) next[q.symbol] = q;
      setQuotes(next);
      setLastUpdated(new Date());
    } catch (e: any) {
      setError(e?.message || 'Failed to load market data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 60_000); // auto-refresh each minute
    return () => clearInterval(id);
  }, []);

  const { score, parts } = useMemo(() => computeRiskScore(quotes), [quotes]);

  const gaugeLabel = score > 58 ? 'Risk-On' : score < 42 ? 'Risk-Off' : 'Neutral';

  // When hovering an indicator card, move the gauge pointer to that indicator's contribution position
  const pointerPercent = useMemo(() => {
    if (hoveredInd) {
      const contrib = parts[hoveredInd] ?? 0; // -1..1
      return ((contrib + 1) / 2) * 100; // 0..100
    }
    return score; // default to overall score
  }, [hoveredInd, parts, score]);

  return (
    <div className="space-y-8">
      {/* Gauge Card */}
      <section className="rounded-xl overflow-hidden shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 ">
        <div className="px-4 sm:px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white">
          <div className="bg-white">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Market Sentiment Analyzer</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Aggregated from stocks, commodities, FX and yields</p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-slate-500 dark:text-slate-400">Updated {lastUpdated.toLocaleTimeString()}</span>
            )}
            <button onClick={fetchData} className="text-sm px-3 py-1.5 rounded-md bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white">Refresh</button>
          </div>
        </div>

        <div className="p-6 bg-white">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-700" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-300">{error}</p>
              <button onClick={fetchData} className="mt-3 text-sm px-3 py-1.5 rounded-md bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white">Try again</button>
            </div>
          ) : (
            <>
              {/* Horizontal gauge with neutral center */}
              <div className="relative h-10 rounded-full overflow-hidden ring-1 ring-slate-300 dark:ring-slate-700" aria-label="Risk meter">
                {/* Background bands: Risk-Off (left), Neutral (center), Risk-On (right) */}
                <div className="absolute inset-0 flex">
                  <div className="w-[45%] bg-rose-600/45 dark:bg-rose-900/70" />
                  <div className="w-[10%] bg-white/90 dark:bg-slate-800" />
                  <div className="w-[45%] bg-emerald-700/45 dark:bg-emerald-900/70" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/0 via-white/10 to-black/0 dark:via-white/5 pointer-events-none" />
                {/* Marker knob */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-[130%] w-1 bg-slate-900 dark:bg-white shadow ring-2 ring-white/70 dark:ring-slate-900/60 transition-all duration-700"
                  style={{ left: `${pointerPercent}%` }}
                  aria-hidden
                />
              </div>
              {/* Labels under gauge */}
              <div className="mt-2 grid grid-cols-3 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                <div className="text-left">Risk-Off</div>
                <div className="text-center">Neutral</div>
                <div className="text-right">Risk-On</div>
              </div>
              <div className="mt-4 flex items-end gap-4">
                <div className="text-5xl font-bold tracking-tight text-slate-800 dark:text-slate-100">{score}</div>
                <div className="text-lg font-semibold text-slate-700 dark:text-slate-300">{gaugeLabel}</div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Indicators */}
      <section className="rounded-xl overflow-hidden shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900">
        <div className="px-4 sm:px-6 py-5 border-b border-slate-200 dark:border-slate-800  bg-white">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Market Sentiment Indicators</h3>
        </div>
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4  bg-white">
          {INDICATORS.map((ind) => {
            const q = quotes[ind.symbol];
            const price = q?.regularMarketPrice;
            const pct = q?.regularMarketChangePercent;
            const isUp = (pct ?? 0) >= 0;
            const sideLabel = ind.side === 'riskon' ? 'Risk-On' : 'Risk-Off';
            const contrib = parts[ind.key] ?? 0; // -1..1
            const barLeft = `${((contrib + 1) / 2) * 100}%`;
            const accent = ind.side === 'riskon' ? 'emerald' : 'rose';

            return (
              <div
                key={ind.key}
                className="relative rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
                onMouseEnter={() => setHoveredInd(ind.key)}
                onMouseLeave={() => setHoveredInd(null)}
                onFocus={() => setHoveredInd(ind.key)}
                onBlur={() => setHoveredInd(null)}
                tabIndex={0}
                aria-label={`${ind.label} indicator card`}
              >
                {/* Accent strip */}
                <div className={
                  ind.side === 'riskon'
                    ? 'absolute inset-y-0 left-0 w-1.5 bg-emerald-600'
                    : 'absolute inset-y-0 left-0 w-1.5 bg-rose-600'
                } />
                <div className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] uppercase tracking-wide text-slate-500">{sideLabel}</div>
                      <div className="text-base font-semibold text-slate-800 dark:text-slate-100">{ind.label}</div>
                      <div className="text-xs text-slate-400">{ind.symbol}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">{price ?? '-'}</div>
                      <span className={
                        `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${isUp ? 'bg-emerald-600/15 text-emerald-700 dark:text-emerald-300' : 'bg-rose-600/15 text-rose-700 dark:text-rose-300'}`
                      }>
                        <span className={isUp ? 'rotate-0 text-emerald-600' : 'rotate-180 text-rose-600'}>▲</span>
                        {formatPct(pct)}
                      </span>
                    </div>
                  </div>

                  {/* contribution bar with stronger contrast and center marker */}
                  <div className="mt-4 h-3 relative rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <div className="absolute inset-0 flex">
                      <div className="w-1/2 bg-rose-600/25 dark:bg-rose-900/50" />
                      <div className="w-0.5 bg-white/90 dark:bg-slate-700" />
                      <div className="w-1/2 bg-emerald-700/25 dark:bg-emerald-900/50" />
                    </div>
                    <div className="absolute -top-1 bottom-0 w-1.5 rounded bg-slate-800 dark:bg-slate-100 transition-all duration-700" style={{ left: barLeft }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

        {/* How to use - educational content */}
      <section id="how-to" className="rounded-xl overflow-hidden shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900">
        <div className="px-4 sm:px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-white">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">How to use the Market Sentiment Analyzer</h3>
        </div>
        <div className="p-5 sm:p-6 space-y-6 text-slate-700 dark:text-slate-300  bg-white">
          <p>
            The meter gives a quick read on the market’s risk appetite right now. When the gauge leans to
            <span className="font-semibold"> Risk-On</span>, traders tend to favor growth and higher‑yield assets. When it leans to
            <span className="font-semibold"> Risk-Off</span>, capital often rotates into defensive assets and safe havens.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-2">What “Risk-On” means</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Optimistic mood; higher willingness to take risk.</li>
                <li>Tailwinds often include upbeat data, strong earnings, or supportive policy.</li>
                <li>Flows tilt toward equities, oil/commodities, and higher‑beta FX like AUD.</li>
              </ul>
            </div>
            <div>
              <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-2">What “Risk-Off” means</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>More cautious mood; preference for safety and capital preservation.</li>
                <li>Often driven by weak data, earnings misses, geopolitics, or uncertainty.</li>
                <li>Flows tilt toward gold, USD/JPY strength, and higher Treasury yields.</li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-2">How to apply it</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use the reading as a short‑term context tool, not a stand‑alone signal.</li>
              <li>Align ideas with the prevailing mood (trade with, not against, sentiment).</li>
              <li>Risk sentiment can flip day‑to‑day—reassess frequently.</li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-2">How the score is built</h4>
            <p>
              The score blends daily changes across a small basket of widely‑watched assets. Risk‑on assets (e.g., S&P 500, Oil, AUD/USD)
              push the score higher when they rise; risk‑off assets (e.g., Gold, USD/JPY, US 10Y yield) pull it lower when they rise.
              The final reading ranges from <span className="font-semibold">0</span> (maximum Risk‑Off) to <span className="font-semibold">100</span> (maximum Risk‑On).
            </p>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">Tip: If you’re unsure how much a trade idea depends on broad risk appetite, glance at the meter first and make sure your plan fits the current mood.</p>
        </div>
      </section>          
    </div>
  );
}
