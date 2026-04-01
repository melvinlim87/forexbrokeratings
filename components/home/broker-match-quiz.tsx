'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, Check, Sparkles, Target, DollarSign, Globe2,
  BarChart3, Shield, Monitor, TrendingDown, Clock, Star, ExternalLink,
  RotateCcw, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import ScoreRing from '@/components/ui/score-ring';
import { brokers } from '@/lib/brokers';

interface QuizAnswer {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface QuizQuestion {
  id: string;
  question: string;
  subtitle: string;
  answers: QuizAnswer[];
}

const questions: QuizQuestion[] = [
  {
    id: 'experience',
    question: 'What\'s your trading experience?',
    subtitle: 'This helps us match brokers with the right tools and support',
    answers: [
      { id: 'beginner', label: 'Beginner', description: 'New to forex trading', icon: <Sparkles className="h-5 w-5" /> },
      { id: 'intermediate', label: 'Intermediate', description: '1-3 years of trading', icon: <Target className="h-5 w-5" /> },
      { id: 'advanced', label: 'Advanced', description: '3+ years, looking for pro tools', icon: <BarChart3 className="h-5 w-5" /> },
    ],
  },
  {
    id: 'budget',
    question: 'How much do you plan to deposit?',
    subtitle: 'We\'ll prioritize brokers within your budget range',
    answers: [
      { id: 'low', label: '$0 – $100', description: 'Start small, grow later', icon: <DollarSign className="h-5 w-5" /> },
      { id: 'mid', label: '$100 – $1,000', description: 'A solid starting point', icon: <DollarSign className="h-5 w-5" /> },
      { id: 'high', label: '$1,000+', description: 'Ready to trade seriously', icon: <DollarSign className="h-5 w-5" /> },
    ],
  },
  {
    id: 'priority',
    question: 'What matters most to you?',
    subtitle: 'Pick your #1 priority — we\'ll weight it highest',
    answers: [
      { id: 'cost', label: 'Lowest Trading Costs', description: 'Tight spreads, low commissions', icon: <TrendingDown className="h-5 w-5" /> },
      { id: 'safety', label: 'Safety & Regulation', description: 'Tier 1 licenses, fund protection', icon: <Shield className="h-5 w-5" /> },
      { id: 'platform', label: 'Best Platform', description: 'MT5, cTrader, TradingView', icon: <Monitor className="h-5 w-5" /> },
      { id: 'support', label: 'Customer Support', description: '24/7 help, fast responses', icon: <Clock className="h-5 w-5" /> },
    ],
  },
  {
    id: 'region',
    question: 'Where are you based?',
    subtitle: 'We\'ll show brokers regulated in your region',
    answers: [
      { id: 'us', label: 'United States', description: 'CFTC/NFA regulated', icon: <Globe2 className="h-5 w-5" /> },
      { id: 'uk', label: 'United Kingdom', description: 'FCA regulated', icon: <Globe2 className="h-5 w-5" /> },
      { id: 'eu', label: 'Europe / EU', description: 'CySEC / BaFin regulated', icon: <Globe2 className="h-5 w-5" /> },
      { id: 'au', label: 'Australia', description: 'ASIC regulated', icon: <Globe2 className="h-5 w-5" /> },
      { id: 'other', label: 'Rest of World', description: 'International options', icon: <Globe2 className="h-5 w-5" /> },
    ],
  },
];

function scoreBroker(broker: any, answers: Record<string, string>): number {
  let score = 0;
  const scores = broker.scores || {};
  const regs = (broker.regulations || []).map((r: string) => r.toUpperCase());

  // Experience scoring
  switch (answers.experience) {
    case 'beginner':
      score += (scores.customerService || 5) * 2;
      score += broker.minDeposit <= 50 ? 15 : broker.minDeposit <= 100 ? 10 : 5;
      break;
    case 'intermediate':
      score += (scores.platforms || 5) * 1.5;
      score += (scores.tradingInstruments || 5) * 1.5;
      break;
    case 'advanced':
      score += (scores.platforms || 5) * 2;
      score += (scores.fees || 5) * 1.5;
      break;
  }

  // Budget scoring
  switch (answers.budget) {
    case 'low':
      score += broker.minDeposit <= 50 ? 20 : broker.minDeposit <= 100 ? 10 : 0;
      break;
    case 'mid':
      score += broker.minDeposit <= 500 ? 10 : 5;
      break;
    case 'high':
      score += 10; // All brokers are accessible
      break;
  }

  // Priority scoring (highest weight)
  switch (answers.priority) {
    case 'cost':
      score += (scores.fees || 5) * 3;
      break;
    case 'safety':
      score += (scores.security || 5) * 3;
      score += regs.filter((r: string) => ['FCA', 'ASIC', 'CFTC/NFA', 'CYSEC', 'MAS', 'IIROC'].includes(r)).length * 5;
      break;
    case 'platform':
      score += (scores.platforms || 5) * 3;
      break;
    case 'support':
      score += (scores.customerService || 5) * 3;
      break;
  }

  // Region scoring
  const regionRegs: Record<string, string[]> = {
    us: ['CFTC', 'NFA'],
    uk: ['FCA'],
    eu: ['CYSEC', 'BAFIN', 'CONSOB', 'AMF'],
    au: ['ASIC'],
    other: [],
  };
  const requiredRegs = regionRegs[answers.region] || [];
  if (requiredRegs.length > 0) {
    const hasReg = regs.some((r: string) => requiredRegs.some((req: string) => r.includes(req)));
    score += hasReg ? 25 : -5;
  }

  // Base rating bonus
  score += (broker.rating || 0) * 2;

  return score;
}

function getMatchReason(broker: any, answers: Record<string, string>): string {
  const reasons: string[] = [];
  const scores = broker.scores || {};

  if (answers.experience === 'beginner' && broker.minDeposit <= 100) {
    reasons.push('Low minimum deposit — perfect for beginners');
  }
  if (answers.priority === 'cost' && (scores.fees || 0) >= 8) {
    reasons.push('Among the lowest trading costs in our database');
  }
  if (answers.priority === 'safety' && (broker.regulations || []).length >= 3) {
    reasons.push('Multi-jurisdiction regulation — strong fund protection');
  }
  if (answers.priority === 'platform' && (scores.platforms || 0) >= 9) {
    reasons.push('Top-rated platforms with advanced charting');
  }
  if (answers.priority === 'support' && (scores.customerService || 0) >= 9) {
    reasons.push('Excellent customer support ratings');
  }

  if (reasons.length === 0) {
    reasons.push(broker.bestFor || 'Strong overall ratings across all categories');
  }

  return reasons[0];
}

export default function BrokerMatchQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const isComplete = currentStep >= questions.length;
  const progress = showResults ? 100 : ((currentStep) / questions.length) * 100;

  const handleAnswer = (questionId: string, answerId: string) => {
    const newAnswers = { ...answers, [questionId]: answerId };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
  };

  const results = useMemo(() => {
    if (!showResults) return [];
    return [...brokers]
      .map(broker => ({
        ...broker,
        matchScore: scoreBroker(broker, answers),
        matchReason: getMatchReason(broker, answers),
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
  }, [showResults, answers]);

  if (showResults) {
    return (
      <section id="broker-match-quiz" className="py-12 md:py-16 bg-gradient-to-b from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Results Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium mb-3">
                <Check className="h-3.5 w-3.5" />
                Quiz Complete
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Your Top 3 Broker Matches
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Based on your experience, budget, priority, and region
              </p>
            </motion.div>

            {/* Results Cards */}
            <div className="space-y-4">
              {results.map((broker, index) => (
                <motion.div
                  key={broker.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.15 }}
                >
                  <Card className={cn(
                    "overflow-hidden transition-all duration-300 hover:shadow-lg",
                    index === 0 ? "border-2 border-emerald-300 dark:border-emerald-700 ring-1 ring-emerald-500/20" : "border border-gray-200 dark:border-gray-800"
                  )}>
                    <CardContent className="p-4 md:p-5">
                      <div className="flex items-start gap-4">
                        {/* Match Rank */}
                        <div className={cn(
                          "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold",
                          index === 0 ? "bg-emerald-500 text-white" :
                          index === 1 ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" :
                          "bg-gray-100 dark:bg-gray-800 text-gray-500"
                        )}>
                          {index === 0 ? <Star className="h-5 w-5" /> : `#${index + 1}`}
                        </div>

                        {/* Logo */}
                        <div className="h-10 w-20 relative bg-gray-50 dark:bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden">
                          <Image src={broker.logo} alt={broker.name} fill className="object-contain p-1" unoptimized />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div>
                              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                {broker.name}
                                {index === 0 && (
                                  <Badge className="ml-2 bg-emerald-500 text-white text-[10px] px-1.5 py-0">Best Match</Badge>
                                )}
                              </h3>
                              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{broker.bestFor}</p>
                            </div>
                            <ScoreRing score={broker.rating} size={40} strokeWidth={3} />
                          </div>

                          {/* Match Reason */}
                          <div className="flex items-start gap-1.5 mt-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg px-3 py-2">
                            <Sparkles className="h-3.5 w-3.5 text-indigo-500 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-indigo-700 dark:text-indigo-300">{broker.matchReason}</p>
                          </div>

                          {/* Quick Stats */}
                          <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500 dark:text-gray-400">
                            <span>Min: <strong className="text-gray-700 dark:text-gray-300">${broker.minDeposit}</strong></span>
                            <span>Spreads: <strong className="text-gray-700 dark:text-gray-300">{broker.spreads}</strong></span>
                            <span>{broker.platforms.slice(0, 2).join(', ')}</span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 mt-3">
                            <Button size="sm" className="h-7 text-xs px-3 bg-blue-600 hover:bg-blue-700 text-white gap-1" asChild>
                              <a href={broker.affiliateUrl} target="_blank" rel="noopener noreferrer">
                                Visit Broker <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 text-xs px-3" asChild>
                              <Link href={`/broker/${broker.slug}`}>Full Review</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Retake + Browse */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8"
            >
              <Button variant="outline" size="sm" onClick={resetQuiz} className="gap-2">
                <RotateCcw className="h-3.5 w-3.5" />
                Retake Quiz
              </Button>
              <Button variant="ghost" size="sm" asChild className="gap-1 text-gray-500">
                <Link href="/brokers">
                  Browse All Brokers <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  const currentQuestion = questions[currentStep];

  return (
    <section id="broker-match-quiz" className="py-12 md:py-16 bg-gradient-to-b from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-gray-950">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-medium mb-3">
              <Target className="h-3.5 w-3.5" />
              Broker Match Quiz
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Find Your Perfect Broker
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Answer 4 quick questions — get your top 3 matches in 30 seconds
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Question {currentStep + 1} of {questions.length}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {currentQuestion.question}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentQuestion.subtitle}
                </p>
              </div>

              {/* Answer Options */}
              <div className="space-y-3">
                {currentQuestion.answers.map((answer, index) => {
                  const isSelected = answers[currentQuestion.id] === answer.id;
                  return (
                    <motion.button
                      key={answer.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      onClick={() => handleAnswer(currentQuestion.id, answer.id)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left",
                        isSelected
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      )}
                    >
                      <div className={cn(
                        "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
                        isSelected ? "bg-indigo-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                      )}>
                        {answer.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 dark:text-white">{answer.label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{answer.description}</div>
                      </div>
                      {isSelected && (
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                          <Check className="h-3.5 w-3.5 text-white" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Back button */}
              {currentStep > 0 && (
                <div className="mt-4 flex justify-start">
                  <Button variant="ghost" size="sm" onClick={goBack} className="gap-1 text-gray-500">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
