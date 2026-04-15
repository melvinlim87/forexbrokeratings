'use client';

/**
 * Inline stats grid — lives in the hero's right column directly under
 * the globe. Replaces the old separate LiveTicker bar.
 *
 * Shows the same 4 animated counters but in a compact 2×2 grid that
 * fits a narrow column. Gets full-width treatment on mobile.
 */

import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { Activity, Users, Globe2, LineChart } from 'lucide-react';
import { LIVE_STATS } from '../_data/entities';

export default function InlineStats() {
  const [paid, setPaid] = useState(LIVE_STATS.totalPaidOutUSD);
  const [traders, setTraders] = useState(LIVE_STATS.activeTradersRightNow);

  useEffect(() => {
    const id = setInterval(() => {
      setPaid((v) => v + Math.random() * 42 + 8);
      setTraders((v) => v + (Math.random() > 0.55 ? 1 : 0));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  const items = [
    { icon: Activity, label: 'Paid to traders this year', value: paid, prefix: '$', decimals: 2, accent: 'var(--ph-emerald)' },
    { icon: Users, label: 'Earning cashback right now', value: traders, prefix: '', decimals: 0, accent: 'var(--ph-cyan)' },
    { icon: Globe2, label: 'Brokers tracked', value: LIVE_STATS.brokerCount, prefix: '', decimals: 0, accent: 'var(--ph-violet)' },
    { icon: LineChart, label: 'Prop firms tracked', value: LIVE_STATS.propFirmCount, prefix: '', decimals: 0, accent: 'var(--ph-amber)' },
  ];

  return (
    <div className="relative z-10 grid grid-cols-2 gap-3 rounded-2xl ph-glass-strong p-4 md:p-5">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="flex items-start gap-3">
            <div
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
              style={{
                background: `${item.accent}18`,
                border: `1px solid ${item.accent}44`,
                color: item.accent,
              }}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div
                className="ph-money truncate text-[20px] font-bold leading-tight md:text-[22px]"
                style={{ color: 'var(--ph-text-1)' }}
              >
                <CountUp
                  end={item.value}
                  duration={1.2}
                  separator=","
                  prefix={item.prefix}
                  decimals={item.decimals}
                  preserveValue
                />
              </div>
              <div
                className="text-[11px] uppercase tracking-[0.08em] leading-tight"
                style={{ color: 'var(--ph-text-2)' }}
              >
                {item.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
