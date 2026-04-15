'use client';

import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { Activity, Users, Globe2, LineChart } from 'lucide-react';
import { LIVE_STATS } from '../_data/entities';

export default function LiveTicker() {
  const [paid, setPaid] = useState(LIVE_STATS.totalPaidOutUSD);
  const [traders, setTraders] = useState(LIVE_STATS.activeTradersRightNow);

  // Increment the counters slowly so they feel alive.
  useEffect(() => {
    const id = setInterval(() => {
      setPaid((v) => v + Math.random() * 42 + 8);
      setTraders((v) => v + (Math.random() > 0.55 ? 1 : 0));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  const items = [
    {
      icon: Activity,
      label: 'Paid to traders this year',
      value: paid,
      prefix: '$',
      decimals: 2,
      accent: 'var(--ph-emerald)',
    },
    {
      icon: Users,
      label: 'Earning cashback right now',
      value: traders,
      prefix: '',
      decimals: 0,
      accent: 'var(--ph-cyan)',
    },
    {
      icon: Globe2,
      label: 'Brokers tracked',
      value: LIVE_STATS.brokerCount,
      prefix: '',
      decimals: 0,
      accent: 'var(--ph-violet)',
    },
    {
      icon: LineChart,
      label: 'Prop firms tracked',
      value: LIVE_STATS.propFirmCount,
      prefix: '',
      decimals: 0,
      accent: 'var(--ph-amber)',
    },
  ];

  return (
    <section className="relative z-10 mx-auto mt-12 w-full max-w-6xl px-4">
      <div className="rounded-3xl ph-glass-strong p-4 md:p-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: `${item.accent}18`,
                    border: `1px solid ${item.accent}44`,
                    color: item.accent,
                  }}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="ph-money text-xl font-bold md:text-2xl" style={{ color: 'var(--ph-text-1)' }}>
                    <CountUp
                      end={item.value}
                      duration={1.2}
                      separator=","
                      prefix={item.prefix}
                      decimals={item.decimals}
                      preserveValue
                    />
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--ph-text-3)' }}>
                    {item.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
