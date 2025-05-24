"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Bot, Brain, LineChart, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Sample data - would come from API in real implementation
const aiTools = [
  {
    id: 1,
    title: 'AI Trading Signal Generator',
    category: 'Analysis',
    icon: <LineChart className="h-5 w-5" />,
    description: 'Get real-time trading signals powered by advanced machine learning algorithms',
    slug: 'trading-signals'
  },
  {
    id: 2,
    title: 'Market Sentiment Analyzer',
    category: 'Research',
    icon: <Brain className="h-5 w-5" />,
    description: 'Analyze market sentiment across social media and news using NLP',
    slug: 'sentiment-analyzer'
  },
  {
    id: 3,
    title: 'AI Portfolio Optimizer',
    category: 'Portfolio',
    icon: <Bot className="h-5 w-5" />,
    description: 'Optimize your trading portfolio using AI-driven risk management',
    slug: 'portfolio-optimizer'
  }
];

export default function AIToolsSection() {
  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">AI Trading Tools</h2>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
              Enhance your trading with our cutting-edge AI-powered tools and analytics.
            </p>
          </div>
          <Link href="/ai-tools" className="mt-4 md:mt-0 inline-flex items-center text-blue-600 dark:text-blue-500 font-medium hover:text-blue-800 dark:hover:text-blue-400">
            View all tools <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {aiTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={`/ai-tools/${tool.slug}`}>
                <Card className="h-full hover:shadow-md transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-full">
                        {tool.icon}
                      </div>
                      <span className="ml-2 text-sm font-medium text-blue-600 dark:text-blue-500">
                        {tool.category}
                      </span>
                      <div className="ml-auto flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Zap className="h-4 w-4 mr-1" />
                        <span>AI-Powered</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {tool.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {tool.description}
                    </p>
                    
                    <div className="flex items-center text-blue-600 dark:text-blue-500 font-medium mt-4">
                      Try now <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white dark:bg-gray-800 p-3 rounded-full w-fit mb-4">
              <Brain className="h-6 w-6 text-blue-600 dark:text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">AI Trading Assistant</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-5">
              Get personalized trading insights and recommendations powered by advanced machine learning algorithms.
            </p>
            <Button asChild>
              <Link href="/ai-tools/assistant">
                Try Assistant <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-8"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white dark:bg-gray-800 p-3 rounded-full w-fit mb-4">
              <Bot className="h-6 w-6 text-amber-600 dark:text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Automated Trading Bots</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-5">
              Deploy AI-powered trading bots that execute trades based on your custom strategies and risk parameters.
            </p>
            <Button variant="secondary" asChild>
              <Link href="/ai-tools/bots">
                Create Bot <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}