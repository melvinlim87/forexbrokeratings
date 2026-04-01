"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Bell, Users, Download, FileText, CheckCircle2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

/**
 * Newsletter + Lead Magnet — dual conversion approach.
 * Inspired by NerdWallet's downloadable guides and BrokerChooser's checklist offers.
 * Offers a free broker comparison checklist to boost email capture rates.
 */

const LEAD_MAGNET_CHECKLIST = [
  "✓ Is the broker regulated by a Tier 1 authority (FCA, ASIC, CFTC)?",
  "✓ What are the real EUR/USD spreads on a standard account?",
  "✓ Commission per round-turn lot (if ECN/raw spread account)?",
  "✓ Total trading cost per lot (spread + commission)?",
  "✓ Available platforms (MT4, MT5, cTrader, TradingView)?",
  "✓ Minimum deposit and funding methods available?",
  "✓ Withdrawal speed and any withdrawal fees?",
  "✓ Negative balance protection in your jurisdiction?",
  "✓ Number of tradeable instruments (forex pairs, CFDs)?",
  "✓ Customer support quality and availability (24/5 vs 24/7)?",
];

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'subscribe' | 'checklist'>('subscribe');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle submission logic here
    if (email) {
      setIsSubmitted(true);
    }
  };
  
  return (
    <section className="py-16 md:py-20 bg-blue-50 dark:bg-blue-900/20">
      <div className="container mx-auto px-4">
        <Card className="max-w-5xl mx-auto overflow-hidden shadow-xl border-0">
          <div className="grid grid-cols-1 md:grid-cols-7">
            {/* Left: Email Capture + Tab Switch */}
            <div className="p-6 md:p-8 md:col-span-4 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full w-fit mb-4">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {activeTab === 'subscribe' ? 'Stay Updated with Forex Insights' : 'Free Broker Comparison Checklist'}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {activeTab === 'subscribe' 
                    ? 'Subscribe to receive broker updates, new reviews, market analysis, and exclusive trading tips.'
                    : 'Download our 10-point checklist used by professional traders to evaluate and compare brokers. Never choose the wrong broker again.'
                  }
                </p>

                {/* Social proof — subscriber count */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex -space-x-2">
                    {['bg-blue-400', 'bg-emerald-400', 'bg-amber-400', 'bg-violet-400'].map((color, i) => (
                      <div key={i} className={`w-7 h-7 rounded-full ${color} border-2 border-white dark:border-gray-900 flex items-center justify-center`}>
                        <Users className="h-3.5 w-3.5 text-white" />
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Join <strong className="text-gray-900 dark:text-white">52,000+</strong> forex traders
                  </span>
                </div>
                
                {!isSubmitted ? (
                  <>
                    {/* Tab toggle */}
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={() => setActiveTab('subscribe')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          activeTab === 'subscribe'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Bell className="h-3 w-3" />
                        Newsletter
                      </button>
                      <button
                        onClick={() => setActiveTab('checklist')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          activeTab === 'checklist'
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Download className="h-3 w-3" />
                        Free Checklist
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="flex-grow"
                        />
                        <Button 
                          type="submit" 
                          className={`whitespace-nowrap ${
                            activeTab === 'checklist' 
                              ? 'bg-emerald-600 hover:bg-emerald-700' 
                              : ''
                          }`}
                        >
                          {activeTab === 'subscribe' ? (
                            <>Subscribe</>
                          ) : (
                            <><Download className="h-4 w-4 mr-1" /> Get Free Checklist</>
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activeTab === 'subscribe' 
                          ? 'We respect your privacy. Unsubscribe at any time.'
                          : 'Instant download. No credit card required. We\'ll also send you weekly broker insights.'
                        }
                      </p>
                    </form>
                  </>
                ) : (
                  <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start">
                    <div className="bg-green-100 dark:bg-green-800 rounded-full p-1 mr-3 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-300">
                        {activeTab === 'checklist' ? 'Checklist sent!' : 'Thanks for subscribing!'}
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                        {activeTab === 'checklist' 
                          ? `We've sent the Broker Comparison Checklist to `
                          : `We've sent a confirmation email to `
                        }
                        <span className="font-medium">{email}</span>
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
            
            {/* Right: Checklist Preview or Subscriber Benefits */}
            <div className="hidden md:block md:col-span-3 bg-gradient-to-br from-blue-600 to-indigo-700 p-6 md:p-8 text-white">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-full flex flex-col justify-center"
              >
                {activeTab === 'checklist' ? (
                  <>
                    <div className="bg-white/20 p-2 rounded-full w-fit mb-4">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="text-lg font-bold mb-1">10-Point Broker Checklist</h4>
                    <p className="text-sm text-blue-200 mb-4">What the pros check before opening an account</p>
                    <ul className="space-y-2">
                      {LEAD_MAGNET_CHECKLIST.slice(0, 6).map((item, i) => (
                        <li key={i} className="text-sm text-blue-50 leading-relaxed">
                          {item}
                        </li>
                      ))}
                      <li className="text-sm text-blue-300 italic pl-4">
                        + 4 more points in the full checklist...
                      </li>
                    </ul>
                    <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-sm text-blue-100">4.9/5 from 2,300+ downloads</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white/20 p-2 rounded-full w-fit mb-4">
                      <Bell className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="text-lg font-bold mb-4">Subscriber Benefits</h4>
                    <ul className="space-y-3">
                      {[
                        'New broker reviews delivered first',
                        'Exclusive educational content',
                        'Special broker promotions and deals',
                        'Market analysis and trading tips',
                        'Industry updates and regulation changes'
                      ].map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <svg className="h-5 w-5 text-blue-200 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-blue-50">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
