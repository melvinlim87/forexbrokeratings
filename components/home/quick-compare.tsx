'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, ChevronLeft, BarChart3, Shield, GraduationCap, Zap, Check } from 'lucide-react';
import { brokers } from '@/lib/brokers';

type Experience = 'beginner' | 'intermediate' | 'advanced';
type Priority = 'low-cost' | 'regulated' | 'platforms' | 'education';
type TradingType = 'forex' | 'cfd' | 'stocks' | 'crypto' | 'all';

interface QuizAnswers {
  experience: Experience | null;
  tradingType: TradingType | null;
  priority: Priority | null;
}

const steps = [
  {
    question: 'What\'s your trading experience?',
    key: 'experience' as const,
    options: [
      { value: 'beginner' as Experience, label: 'Beginner', desc: 'Just starting out', icon: GraduationCap },
      { value: 'intermediate' as Experience, label: 'Intermediate', desc: '1–3 years of trading', icon: BarChart3 },
      { value: 'advanced' as Experience, label: 'Advanced', desc: '3+ years, active trader', icon: Zap },
    ],
  },
  {
    question: 'What do you want to trade?',
    key: 'tradingType' as const,
    options: [
      { value: 'forex' as TradingType, label: 'Forex Only', desc: 'Currency pairs' },
      { value: 'cfd' as TradingType, label: 'Forex & CFDs', desc: 'Currencies, indices, commodities' },
      { value: 'stocks' as TradingType, label: 'Stocks & ETFs', desc: 'Real stocks alongside forex' },
      { value: 'all' as TradingType, label: 'Everything', desc: 'Forex, CFDs, stocks, crypto' },
    ],
  },
  {
    question: 'What matters most to you?',
    key: 'priority' as const,
    options: [
      { value: 'low-cost' as Priority, label: 'Lowest Costs', desc: 'Tight spreads, low commissions', icon: BarChart3 },
      { value: 'regulated' as Priority, label: 'Strong Regulation', desc: 'Top-tier FCA/ASIC protection', icon: Shield },
      { value: 'platforms' as Priority, label: 'Best Platforms', desc: 'MT4, MT5, cTrader, TradingView', icon: Zap },
      { value: 'education' as Priority, label: 'Education & Support', desc: 'Learning resources, good support', icon: GraduationCap },
    ],
  },
];

function getRecommendedBrokers(answers: QuizAnswers) {
  let sorted = [...brokers];

  // Filter by experience
  if (answers.experience === 'beginner') {
    sorted.sort((a, b) => {
      const score = (r: typeof a) => {
        let s = 0;
        if (r.minDeposit <= 50) s += 40;
        else if (r.minDeposit <= 100) s += 25;
        s += (r.scores?.customerService ?? 0) * 3;
        s += r.rating * 2;
        if (r.platforms.includes('MT4')) s += 5;
        return s;
      };
      return score(b) - score(a);
    });
  } else if (answers.experience === 'advanced') {
    sorted.sort((a, b) => {
      const score = (r: typeof a) => {
        let s = 0;
        s += (5 - (r.avgSpreadEurUsd ?? 1.5)) * 10;
        s += r.platforms.length * 3;
        s += (r.scores?.security ?? 0) * 2;
        return s;
      };
      return score(b) - score(a);
    });
  }

  // Override with priority
  if (answers.priority === 'low-cost') {
    sorted.sort((a, b) => ((a.avgSpreadEurUsd ?? 0) + (a.commissionRt ?? 0) / 10) - ((b.avgSpreadEurUsd ?? 0) + (b.commissionRt ?? 0) / 10));
  } else if (answers.priority === 'regulated') {
    sorted.sort((a, b) => {
      const tier1 = (r: typeof a) => r.regulations.filter(reg =>
        ['FCA', 'ASIC', 'CFTC/NFA', 'CySEC', 'MAS', 'IIROC'].includes(reg)
      ).length;
      return tier1(b) - tier1(a) || (b.scores?.security ?? 0) - (a.scores?.security ?? 0);
    });
  } else if (answers.priority === 'platforms') {
    sorted.sort((a, b) => b.platforms.length - a.platforms.length);
  } else if (answers.priority === 'education') {
    sorted.sort((a, b) => (b.scores?.customerService ?? 0) - (a.scores?.customerService ?? 0));
  }

  return sorted.slice(0, 3);
}

export default function QuickCompare() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    experience: null,
    tradingType: null,
    priority: null,
  });
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (key: keyof QuizAnswers, value: any) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    if (step < steps.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
    } else if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleRestart = () => {
    setStep(0);
    setAnswers({ experience: null, tradingType: null, priority: null });
    setShowResults(false);
  };

  const results = showResults ? getRecommendedBrokers(answers) : [];
  const progress = showResults ? 100 : ((step + 1) / steps.length) * 100;

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <BarChart3 className="h-4 w-4" />
            Broker Finder
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Find Your Perfect Broker in 3 Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Tell us what you need — we'll match you with the best brokers from 50+ we've reviewed.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-2">
            {steps.map((s, i) => (
              <div key={i} className="flex-1 flex items-center gap-1">
                <div className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                  i <= step || showResults
                    ? 'bg-blue-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Experience</span>
            <span>What you trade</span>
            <span>Priority</span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Quiz Steps */}
          {!showResults && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 md:p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                {steps[step].question}
              </h3>
              <div className="space-y-3">
                {steps[step].options.map((option) => {
                  const isSelected = answers[steps[step].key] === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleSelect(steps[step].key, option.value)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      {'icon' in option && option.icon && (
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                        }`}>
                          {(() => {
                            const Icon = (option as any).icon;
                            return Icon ? <Icon className="h-5 w-5" /> : null;
                          })()}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{option.desc}</div>
                      </div>
                      <ChevronRight className={`h-5 w-5 transition-all ${
                        isSelected ? 'text-blue-500' : 'text-gray-300 dark:text-gray-600'
                      }`} />
                    </button>
                  );
                })}
              </div>

              {/* Back button */}
              {step > 0 && (
                <button
                  onClick={handleBack}
                  className="mt-6 flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
              )}
            </div>
          )}

          {/* Results */}
          {showResults && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full px-4 py-1.5 text-sm font-medium mb-2">
                  <Check className="h-4 w-4" />
                  Your Matches
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Based on your preferences, here are your top 3 brokers
                </p>
              </div>

              {results.map((broker, index) => (
                <div
                  key={broker.id}
                  className={`group flex items-center gap-4 bg-white dark:bg-gray-900 rounded-xl p-4 border transition-all duration-200 hover:shadow-lg ${
                    index === 0
                      ? 'border-blue-300 dark:border-blue-600 shadow-md ring-1 ring-blue-100 dark:ring-blue-900/30'
                      : 'border-gray-200 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-700'
                  }`}
                >
                  {/* Rank */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                    index === 0
                      ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-500/20'
                      : index === 1
                      ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                      : 'bg-gradient-to-br from-orange-400 to-orange-500 text-white'
                  }`}>
                    {index === 0 ? '🏆' : `#${index + 1}`}
                  </div>

                  {/* Broker Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {broker.name}
                      </h3>
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
                        {broker.rating}/10
                      </span>
                      {index === 0 && (
                        <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium">
                          Best Match
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {broker.bestFor}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {broker.regulations.slice(0, 3).map((reg) => (
                        <span key={reg} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded">
                          {reg}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Stats */}
                  <div className="hidden sm:flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {broker.avgSpreadEurUsd} pips
                      </div>
                      <div className="text-xs text-gray-500">EUR/USD</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        ${broker.minDeposit}
                      </div>
                      <div className="text-xs text-gray-500">Min Deposit</div>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/broker/${broker.slug}`}
                    className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    Review
                  </Link>
                </div>
              ))}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  onClick={handleRestart}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm font-medium transition-colors"
                >
                  ← Retake Quiz
                </button>
                <Link
                  href="/rankings"
                  className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                  View All Rankings
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
