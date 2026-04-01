"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Brain, LineChart, Zap, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const upcomingTools = [
  {
    id: 1,
    title: 'AI Trading Signal Generator',
    category: 'Analysis',
    icon: <LineChart className="h-5 w-5" />,
    description: 'Real-time trading signals powered by machine learning algorithms trained on historical price action.',
  },
  {
    id: 2,
    title: 'Market Sentiment Analyzer',
    category: 'Research',
    icon: <Brain className="h-5 w-5" />,
    description: 'Analyze market sentiment across news, social media, and positioning data using NLP.',
  },
  {
    id: 3,
    title: 'AI Portfolio Optimizer',
    category: 'Portfolio',
    icon: <Bot className="h-5 w-5" />,
    description: 'Optimize your trading portfolio allocation using AI-driven risk management models.',
  },
];

export default function AIToolsSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // In production, this would call an API to save the email
      setSubmitted(true);
    }
  };

  return (
    <section className="py-8 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            <Zap className="h-4 w-4" />
            Coming Soon
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Trading Tools</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We're building AI-powered tools to help you trade smarter. Get early access when they launch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {upcomingTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-full">
                      {tool.icon}
                    </div>
                    <span className="ml-2 text-sm font-medium text-blue-600 dark:text-blue-500">
                      {tool.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {tool.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Email capture */}
        <motion.div
          className="max-w-xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {submitted ? (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle className="h-10 w-10 text-green-600" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">You're on the list!</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                We'll email you as soon as our AI tools are ready to use.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-full w-fit mx-auto mb-4">
                <Mail className="h-6 w-6 text-blue-600 dark:text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Get Early Access</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                Be the first to try our AI trading tools. No spam — just one email when we launch.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-white dark:bg-gray-800"
                />
                <Button type="submit">
                  Notify Me
                </Button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
