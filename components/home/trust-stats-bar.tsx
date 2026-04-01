'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, FileText, Award, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';

/**
 * Animated counter hook — counts up from 0 to target when element enters viewport.
 * Inspired by NerdWallet's dynamic stat animations.
 */
function useAnimatedCounter(target: number, duration: number = 2000, inView: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration, inView]);

  return count;
}

interface StatConfig {
  icon: any;
  value: number;
  suffix: string;
  label: string;
  color: string;
}

const stats: StatConfig[] = [
  { icon: Users, value: 9, suffix: 'M+', label: 'Visitors Served', color: 'text-blue-600' },
  { icon: FileText, value: 50, suffix: 'K+', label: 'Data Points Verified', color: 'text-emerald-600' },
  { icon: Award, value: 50, suffix: '+', label: 'Brokers Tested', color: 'text-amber-600' },
  { icon: ShieldCheck, value: 99, suffix: '.9%', label: 'Data Accuracy', color: 'text-violet-600' },
];

function AnimatedStat({ stat, inView, delay }: { stat: StatConfig; inView: boolean; delay: number }) {
  const count = useAnimatedCounter(stat.value, 2000, inView);
  const Icon = stat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay }}
      className="flex items-center gap-3 md:justify-center group"
    >
      <div className={`p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 group-hover:scale-110 transition-transform duration-300 ${stat.color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
          {count}{stat.suffix}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
      </div>
    </motion.div>
  );
}

export default function TrustStatsBar() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative z-10 -mt-8 mb-4" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-4 md:p-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, i) => (
              <AnimatedStat key={stat.label} stat={stat} inView={inView} delay={0.3 + i * 0.15} />
            ))}
          </div>

          {/* Quiz CTA — connects trust signals to conversion flow (BrokerChooser pattern) */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 1.0 }}
            className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>
                Not sure which broker? <strong className="text-gray-900 dark:text-white">Take our 30-second quiz</strong> — matched to your experience level.
              </span>
            </div>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md text-xs px-4 flex-shrink-0"
              asChild
            >
              <Link href="/#quick-compare">
                Find My Broker
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
