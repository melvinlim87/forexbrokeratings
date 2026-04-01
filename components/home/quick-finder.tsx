'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Target, TrendingDown, Shield, BookOpen, Zap, BarChart3, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { brokers } from '@/lib/brokers';

type Step = 'experience' | 'priority' | 'result';

interface Answers {
  experience: string;
  priority: string;
}

const experienceOptions = [
  { id: 'beginner', label: 'Beginner', desc: 'New to forex trading', icon: BookOpen },
  { id: 'intermediate', label: 'Intermediate', desc: '1-3 years experience', icon: BarChart3 },
  { id: 'advanced', label: 'Advanced', desc: '3+ years, active trader', icon: Zap },
];

const priorityOptions = [
  { id: 'low-fees', label: 'Lowest Fees', desc: 'Tight spreads & low commissions', icon: TrendingDown },
  { id: 'safety', label: 'Safety & Trust', desc: 'Top-tier regulation & fund protection', icon: Shield },
  { id: 'platforms', label: 'Best Platforms', desc: 'MT4/MT5, cTrader, TradingView', icon: BarChart3 },
  { id: 'beginner-friendly', label: 'Easy to Use', desc: 'Simple UI, education, demo account', icon: BookOpen },
];

function getRecommendations(answers: Answers) {
  let scored = brokers.map(b => {
    let score = b.rating * 10;
    // Experience scoring
    if (answers.experience === 'beginner') {
      score += (b.scores?.customerService ?? b.rating) * 3;
      score += (b.scores?.deposit ?? b.rating) * 2;
      if (b.minDeposit <= 50) score += 15;
      if (b.platforms.includes('MT4')) score += 5;
    } else if (answers.experience === 'advanced') {
      score += (b.scores?.platforms ?? b.rating) * 3;
      score += (b.scores?.fees ?? b.rating) * 2;
      if (b.platforms.includes('cTrader') || b.platforms.includes('TradingView')) score += 10;
    } else {
      score += b.rating * 2;
    }
    // Priority scoring
    if (answers.priority === 'low-fees') {
      score += (b.scores?.fees ?? b.rating) * 5;
      if ((b as any).avgSpreadEurUsd < 0.5) score += 20;
      if ((b as any).commissionRt === 0) score += 10;
    } else if (answers.priority === 'safety') {
      score += (b.scores?.security ?? b.rating) * 5;
      score += b.regulations.length * 5;
      if (b.regulations.includes('FCA')) score += 15;
      if (b.regulations.includes('ASIC')) score += 15;
    } else if (answers.priority === 'platforms') {
      score += (b.scores?.platforms ?? b.rating) * 5;
      score += b.platforms.length * 3;
    } else if (answers.priority === 'beginner-friendly') {
      score += (b.scores?.customerService ?? b.rating) * 4;
      score += (b.scores?.deposit ?? b.rating) * 3;
      if (b.minDeposit <= 50) score += 15;
    }
    return { ...b, matchScore: score };
  });
  return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
}

export default function QuickFinder() {
  const [step, setStep] = useState<Step>('experience');
  const [answers, setAnswers] = useState<Answers>({ experience: '', priority: '' });
  const [results, setResults] = useState<typeof brokers>([]);

  const handleExperience = (exp: string) => {
    setAnswers(prev => ({ ...prev, experience: exp }));
    setStep('priority');
  };

  const handlePriority = (pri: string) => {
    const newAnswers = { ...answers, priority: pri };
    setAnswers(newAnswers);
    setResults(getRecommendations(newAnswers));
    setStep('result');
  };

  const reset = () => {
    setStep('experience');
    setAnswers({ experience: '', priority: '' });
    setResults([]);
  };

  return (
    <section className="py-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-6">
            <Badge className="mb-3 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
              <Target className="h-3 w-3 mr-1" /> Broker Finder
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Find Your Perfect Broker in 30 Seconds
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Answer 2 quick questions and we&apos;ll match you with the best brokers for your needs.
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={cn(
              "h-2 w-16 rounded-full transition-colors",
              step === 'experience' ? 'bg-blue-600' : 'bg-blue-200 dark:bg-blue-800'
            )} />
            <div className={cn(
              "h-2 w-16 rounded-full transition-colors",
              step === 'priority' ? 'bg-blue-600' : step === 'result' ? 'bg-blue-200 dark:bg-blue-800' : 'bg-gray-200 dark:bg-gray-700'
            )} />
            <div className={cn(
              "h-2 w-16 rounded-full transition-colors",
              step === 'result' ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'
            )} />
          </div>

          <Card className="border-0 shadow-xl bg-white dark:bg-gray-900 overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                {step === 'experience' && (
                  <motion.div
                    key="experience"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      What&apos;s your trading experience?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {experienceOptions.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => handleExperience(opt.id)}
                          className="group flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 text-left"
                        >
                          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/40 transition-colors">
                            <opt.icon className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 dark:text-white">{opt.label}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{opt.desc}</div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 'priority' && (
                  <motion.div
                    key="priority"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <button
                        onClick={() => setStep('experience')}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-500" />
                      </button>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        What matters most to you?
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {priorityOptions.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => handlePriority(opt.id)}
                          className="group flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 text-left"
                        >
                          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/40 transition-colors">
                            <opt.icon className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 dark:text-white">{opt.label}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{opt.desc}</div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 'result' && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Your Top 3 Matches
                        </h3>
                      </div>
                      <button
                        onClick={reset}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Start over
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {results.map((broker, i) => (
                        <motion.div
                          key={broker.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800"
                        >
                          {/* Rank badge */}
                          <div className={cn(
                            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white",
                            i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-gray-400' : 'bg-amber-700'
                          )}>
                            {i + 1}
                          </div>
                          
                          {/* Logo */}
                          <div className="h-10 w-16 relative bg-white dark:bg-gray-700 rounded flex-shrink-0 overflow-hidden">
                            <Image
                              src={broker.logo}
                              alt={broker.name}
                              fill
                              className="object-contain p-1"
                              unoptimized
                            />
                          </div>
                          
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 dark:text-white text-sm">{broker.name}</div>
                            <div className="text-xs text-blue-600 dark:text-blue-400">{broker.bestFor}</div>
                            <div className="flex items-center gap-2 mt-1">
                              {/* Rating bar */}
                              <div className="flex-1 max-w-24">
                                <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${broker.rating * 10}%` }}
                                    transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                                    className={cn(
                                      "h-full rounded-full",
                                      broker.rating >= 9 ? 'bg-emerald-500' :
                                      broker.rating >= 8 ? 'bg-blue-500' :
                                      broker.rating >= 7 ? 'bg-amber-500' : 'bg-orange-500'
                                    )}
                                  />
                                </div>
                              </div>
                              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{broker.rating}/10</span>
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex gap-2 flex-shrink-0">
                            <Button size="sm" variant="outline" className="h-7 text-xs" asChild>
                              <Link href={`/broker/${broker.slug}`}>Review</Link>
                            </Button>
                            <Button size="sm" className="h-7 text-xs bg-blue-600 hover:bg-blue-700" asChild>
                              <a href={broker.affiliateUrl} target="_blank" rel="noopener noreferrer">
                                Visit <ArrowRight className="h-3 w-3 ml-1" />
                              </a>
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="mt-4 text-center">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/compare">
                          Compare All Brokers <ArrowRight className="ml-2 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
