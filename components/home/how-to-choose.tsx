'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  Shield,
  TrendingDown,
  Monitor,
  BarChart3,
  Headphones,
  CheckCircle2,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * "How to Choose a Forex Broker" — Step-by-step guide section.
 * Inspired by NerdWallet's "How to choose" and Investopedia's educational content.
 * Targets featured snippet SERP for "how to choose forex broker" queries.
 */
const steps = [
  {
    number: 1,
    icon: Shield,
    title: 'Check Regulation & Safety',
    summary: 'Only trade with brokers licensed by Tier 1 regulators.',
    details: [
      'Look for FCA (UK), ASIC (Australia), CySEC (EU), CFTC/NFA (US), or MAS (Singapore) licenses',
      'Verify the license number directly on the regulator\'s website',
      'Ensure client funds are held in segregated accounts at major banks',
      'Check for negative balance protection — you should never lose more than your deposit',
      'Prefer brokers with investor compensation schemes (e.g., FSCS up to £85,000 in the UK)',
    ],
    proTip: 'A broker regulated in 3+ Tier 1 jurisdictions is almost always safer than one regulated only offshore.',
  },
  {
    number: 2,
    icon: TrendingDown,
    title: 'Compare Trading Costs',
    summary: 'Spreads and commissions directly impact your profits.',
    details: [
      'Compare EUR/USD spreads — the most traded pair and your benchmark',
      'Raw/ECN accounts offer tighter spreads (0.0–0.3 pips) but charge $3–$7/lot commission',
      'Standard accounts have wider spreads (0.6–1.5 pips) with zero commission',
      'Check swap/overnight rates if you hold positions overnight',
      'Watch for hidden fees: inactivity fees, withdrawal fees, currency conversion charges',
    ],
    proTip: 'For a trader doing 20 lots/month, saving 0.2 pips per trade equals ~$400/year in savings.',
  },
  {
    number: 3,
    icon: Monitor,
    title: 'Evaluate Trading Platforms',
    summary: 'Your platform affects speed, analysis, and execution quality.',
    details: [
      'MetaTrader 4 (MT4) — industry standard, best for EA/algo trading',
      'MetaTrader 5 (MT5) — more timeframes, depth of market, hedging + netting',
      'cTrader — best for scalping with Level 2 pricing and one-click trading',
      'TradingView integration — growing demand for charting-first traders',
      'Proprietary platforms — often more polished but less flexible',
    ],
    proTip: 'Always test a platform with a demo account before committing real capital. Most brokers offer free demos.',
  },
  {
    number: 4,
    icon: BarChart3,
    title: 'Check Available Instruments',
    summary: 'More instruments = more trading opportunities.',
    details: [
      'Major & minor forex pairs — most brokers offer 40–60+ pairs',
      'Commodities — gold, silver, oil (Brent & WTI)',
      'Indices — S&P 500, NASDAQ, FTSE 100, DAX 40',
      'Stocks & ETFs — individual stock CFDs from major exchanges',
      'Crypto — BTC, ETH, and altcoins (if you want 24/7 trading)',
    ],
    proTip: 'If you trade gold or crypto, check the broker\'s weekend trading availability and overnight costs.',
  },
  {
    number: 5,
    icon: Headphones,
    title: 'Test Customer Support',
    summary: 'When something goes wrong, support quality matters.',
    details: [
      'Live chat response time — under 2 minutes is ideal',
      '24/5 support is standard; 24/7 is a premium differentiator',
      'Phone support availability — important for urgent account issues',
      'Multilingual support — critical for non-English-speaking traders',
      'Check TrustPilot and Reddit reviews for real support experiences',
    ],
    proTip: 'Test support before depositing. Open a live chat and ask a technical question. Response quality reveals a lot.',
  },
];

export default function HowToChoose() {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  const toggle = (num: number) => {
    setExpandedStep(expandedStep === num ? null : num);
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white to-blue-50/30 dark:from-gray-900 dark:to-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <BookOpen className="h-4 w-4" />
            Free Guide
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How to Choose a Forex Broker in 2026
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Follow this 5-step framework used by professional traders to find a safe, low-cost broker
            that fits your trading style.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-3xl mx-auto space-y-4">
          {steps.map((step) => {
            const Icon = step.icon;
            const isOpen = expandedStep === step.number;

            return (
              <div
                key={step.number}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 overflow-hidden transition-shadow hover:shadow-md"
              >
                {/* Step Header */}
                <button
                  onClick={() => toggle(step.number)}
                  className="w-full flex items-center gap-4 p-5 text-left"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-sm flex-shrink-0 shadow-sm">
                    {step.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {step.summary}
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </motion.div>
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0">
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                          {/* Checklist */}
                          <ul className="space-y-3 mb-4">
                            {step.details.map((detail, i) => (
                              <li key={i} className="flex items-start gap-2.5">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                  {detail}
                                </span>
                              </li>
                            ))}
                          </ul>

                          {/* Pro Tip */}
                          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3.5">
                            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">
                              💡 Pro Tip
                            </p>
                            <p className="text-sm text-amber-800 dark:text-amber-300">
                              {step.proTip}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Want us to do the work for you? Take our 2-minute quiz.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg"
            asChild
          >
            <Link href="/#quick-compare">
              Find My Best Broker
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
