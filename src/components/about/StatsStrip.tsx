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
  <section className="w-full my-10 bg-[#f8fafc] rounded-xl shadow-sm border border-gray-100 py-8 px-2 text-[#0b1e3c]">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-0 w-full">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col items-center justify-center w-full pt-4">
          <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
          <div className="text-sm mt-2 opacity-80 text-[#0b1e3c] text-center leading-snug">{stat.label}</div>
        </div>
      ))}
    </div>
  </section>
);

export default StatsStrip;
