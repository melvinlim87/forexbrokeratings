"use client";
import React from 'react';
import { useInView } from 'framer-motion';

const stats = [
  { label: 'Brokers benchmarked', value: 38, suffix: '+' },
  { label: 'Live trades executed for testing', value: 620 },
  { label: 'Regulators tracked', value: 8 },
  { label: 'Verified client-fund certificates', value: 125, prefix: 'US $', suffix: 'k' },
];

function Counter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 1000;
      const step = Math.ceil(end / (duration / 16));
      let current = start;
      const interval = setInterval(() => {
        current += step;
        if (current >= end) {
          setDisplay(end);
          clearInterval(interval);
        } else {
          setDisplay(current);
        }
      }, 16);
      return () => clearInterval(interval);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-2xl md:text-3xl font-bold">
      {prefix}{display}{suffix}
    </span>
  );
}

const StatsStrip = () => (
  <section className="my-10 bg-[#091f40] rounded-xl flex flex-wrap justify-around items-center py-6 px-2 text-white">
    {stats.map((stat) => (
      <div key={stat.label} className="flex flex-col items-center m-2 min-w-[150px]">
        <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
        <div className="text-sm mt-1 opacity-80">{stat.label}</div>
      </div>
    ))}
  </section>
);

export default StatsStrip;
