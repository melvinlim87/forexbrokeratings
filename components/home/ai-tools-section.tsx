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
    <section className="py-16 bg-gray-50 dark:bg-gray-900 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">AI Trading Tools</h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Enhance your trading with our cutting-edge AI-powered tools and analytics.
          </p>
          <Link href="/ai-tools" className="mt-4 inline-flex items-center text-blue-600 dark:text-blue-500 font-medium hover:text-blue-800 dark:hover:text-blue-400 mx-auto">
            View all tools <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12 w-full py-8">
          {aiTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              className="h-full w-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={`/ai-tools/${tool.slug}`} className="h-full block w-full">
                <Card className="h-full w-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden group">
                  <CardContent className="p-6 flex flex-col h-full w-full">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-full">
                        {tool.icon}
                      </div>
                      <span className="ml-2 text-sm font-medium text-blue-600 dark:text-blue-500">
                        {tool.category}
                      </span>
                      <div className="ml-auto flex items-center text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        <Zap className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span>AI-Powered</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 min-h-[3rem]">
                      {tool.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-grow">
                      {tool.description}
                    </p>
                    
                    <div className="mt-auto pt-2 text-blue-600 dark:text-blue-400 font-medium flex items-center group-hover:translate-x-1 transition-transform duration-200">
                      Try now 
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
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