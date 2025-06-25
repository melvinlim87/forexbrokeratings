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
  const animationRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    const duration = 1000; // ms
    const startTime = performance.now();
    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(progress * (end - start) + start);
      setDisplay(current);
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplay(end);
      }
    }
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-2xl md:text-3xl font-bold text-black">
      {prefix}{display}{suffix}
    </span>
  );
}

const StatsStrip = () => (
  <section className="w-full my-10 bg-[#f8fafc] dark:bg-slate-900 rounded-xl flex flex-row justify-between items-stretch py-8 px-2 text-[#0b1e3c] dark:text-white shadow-sm border border-gray-100 dark:border-slate-800">
    {stats.map((stat, idx) => (
      <React.Fragment key={stat.label}>
        {idx !== 0 && (
          <div className="hidden md:flex items-center mx-6">
            <div className="h-14 w-px bg-gray-300 dark:bg-slate-700" />
          </div>
        )}
        <div className="flex flex-col items-center min-w-[140px] px-2">
          <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
          <div className="text-sm mt-1 opacity-80 text-[#0b1e3c] dark:text-gray-200 text-center leading-snug">{stat.label}</div>
        </div>
      </React.Fragment>
    ))}
  </section>
);

export default StatsStrip;
