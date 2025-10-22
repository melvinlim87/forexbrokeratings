"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight, Bot, Brain, LineChart, ArrowRight, Zap, Search, Filter, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useI18n } from '@/lib/i18n-client';
import ToolCard, { Tool } from '@/components/ai-tools/ToolCard';

export interface Category { value: string; labelKey: string }

export default function AiToolsInteractive({ aiTools, categories }: { aiTools: Tool[]; categories: Category[] }) {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const filteredTools = aiTools.filter(tool => {
    const title = t(tool.titleKey).toLowerCase();
    const desc = t(tool.descriptionKey).toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch = title.includes(q) || desc.includes(q);

    const matchesCategory = selectedCategory === 'all' ||
      t(tool.categoryKey).toLowerCase().replace(' ', '-') === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const scrollToHash = () => {
      const raw = window.location.hash;
      if (!raw) return;
      const id = decodeURIComponent(raw.replace(/^#/, ''));
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      const header = document.querySelector('header');
      const headerHeight = header ? (header as HTMLElement).offsetHeight : 0;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    };
    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, []);

  return (
    <div className="min-h-screen bg-transparent">
      <header className="bg-gradient-to-r from-[#091f40] to-[#0f2d59] h-[180px] flex flex-col justify-center items-center text-center px-4 mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow">{t('ai.hero_title')}</h1>
        <h2 className="text-lg md:text-2xl text-cyan-200 font-medium max-w-2xl mx-auto">{t('ai.hero_subtitle')}</h2>
      </header>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-0 z-10 md:max-w-7xl mx-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder={t('ai.search_placeholder')} className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className="w-full md:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder={t('ai.filter_by_category')} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {t(category.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tools */}
      <section className="py-12 bg-white md:max-w-7xl mx-auto">
        <div className="container mx-auto px-4">
          <h2 id="popular" className="text-2xl font-bold text-gray-900 mb-8">{t('ai.popular')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredTools.filter(tool => tool.popular).map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} hoveredCard={hoveredCard} setHoveredCard={setHoveredCard} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-12 bg-gray-50 md:max-w-7xl mx-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <motion.div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <div className="bg-white p-3 rounded-full w-fit mb-4">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('ai.tools.trading_assistant.title')}</h3>
              <p className="text-gray-600 mb-5">{t('ai.tools.trading_assistant.description')}</p>
              <Button asChild>
                <Link href="/ai-tools/trading-assistant">{t('ai.try_assistant')} <ChevronRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </motion.div>

            <motion.div className="relative bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-8" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <span className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-yellow-400 text-yellow-900 text-xs font-bold shadow-md" aria-label={t('ai.coming_soon')}>{t('ai.coming_soon')}</span>
              <div className="bg-white p-3 rounded-full w-fit mb-4">
                <Bot className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('ai.tools.trading_bots.title')}</h3>
              <p className="text-gray-600 mb-5">{t('ai.tools.trading_bots.description')}</p>
              <Button variant="secondary" asChild disabled className='cursor-not-allowed'>
                <Link href="#">{t('ai.create_bot')} <ChevronRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </motion.div>
          </div>

          {/* <h2 id="products" className="text-2xl font-bold text-gray-900 mb-8">{t('ai.products')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <Card className="relative">
              <CardContent className="p-6">
                <span className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-yellow-400 text-yellow-900 text-xs font-bold shadow-md" aria-label={t('ai.coming_soon')}>{t('ai.coming_soon')}</span>
                <div className="flex items-center mb-4">
                  <div className="bg-blue-50 p-2 rounded-full"><Bot className="h-5 w-5 text-blue-600" /></div>
                  <span className="ml-auto text-sm font-semibold text-gray-900">$499 USD</span>
                </div>
                <div className="relative w-full h-40 mb-4">
                  <Image src="/assets/images/ai-tools/semi-auto-trading-ea.png" alt="Semi Auto Trading EA" fill className="object-contain rounded-md" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('ai.products.semi_auto_ea.title')}</h3>
                <p className="text-gray-600 mb-5">{t('ai.products.semi_auto_ea.description')}</p>
                <Button variant="secondary" disabled className="cursor-not-allowed">{t('ai.available_soon')}</Button>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardContent className="p-6">
                <span className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-yellow-400 text-yellow-900 text-xs font-bold shadow-md" aria-label={t('ai.coming_soon')}>{t('ai.coming_soon')}</span>
                <div className="flex items-center mb-4">
                  <div className="bg-amber-50 p-2 rounded-full"><Bot className="h-5 w-5 text-amber-600" /></div>
                  <span className="ml-auto text-sm font-semibold text-gray-900">$799 USD</span>
                </div>
                <div className="relative w-full h-40 mb-4">
                  <Image src="/assets/images/ai-tools/full-auto-trading-ea.png" alt="Full Auto Trading EA" fill className="object-contain rounded-md" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('ai.products.full_auto_ea.title')}</h3>
                <p className="text-gray-600 mb-5">{t('ai.products.full_auto_ea.description')}</p>
                <Button variant="secondary" disabled className="cursor-not-allowed">{t('ai.available_soon')}</Button>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardContent className="p-6">
                <span className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-yellow-400 text-yellow-900 text-xs font-bold shadow-md" aria-label={t('ai.coming_soon')}>{t('ai.coming_soon')}</span>
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-50 p-2 rounded-full"><LineChart className="h-5 w-5 text-indigo-600" /></div>
                  <span className="ml-auto text-sm font-semibold text-gray-900">$150 USD</span>
                </div>
                <div className="relative w-full h-40 mb-4">
                  <Image src="/assets/images/ai-tools/proven-strategies-set-files-semi-auto.png" alt="Proven Strategies Set Files (Semi-Auto)" fill className="object-contain rounded-md" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{t('ai.products.proven_strategies_semi.title')}</h3>
                <p className="text-gray-600 mb-5">{t('ai.products.proven_strategies_semi.description')}</p>
                <ul className="list-disc list-inside text-sm text-gray-600 mb-5 space-y-1">
                  <li>{t('ai.products.proven_strategies_semi.bullets.0')}</li>
                  <li>{t('ai.products.proven_strategies_semi.bullets.1')}</li>
                  <li>{t('ai.products.proven_strategies_semi.bullets.2')}</li>
                  <li>{t('ai.products.proven_strategies_semi.bullets.3')}</li>
                </ul>
                <Button variant="secondary" disabled className="cursor-not-allowed">{t('ai.available_soon')}</Button>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardContent className="p-6">
                <span className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-yellow-400 text-yellow-900 text-xs font-bold shadow-md" aria-label={t('ai.coming_soon')}>{t('ai.coming_soon')}</span>
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-50 p-2 rounded-full"><LineChart className="h-5 w-5 text-indigo-600" /></div>
                  <span className="ml-auto text-sm font-semibold text-gray-900">$250 USD</span>
                </div>
                <div className="relative w-full h-40 mb-4">
                  <Image src="/assets/images/ai-tools/proven-strategies-set-files-full-auto.png" alt="Proven Strategies Set Files (Full-Auto)" fill className="object-contain rounded-md" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{t('ai.products.proven_strategies_full.title')}</h3>
                <p className="text-gray-600 mb-5">{t('ai.products.proven_strategies_full.description')}</p>
                <ul className="list-disc list-inside text-sm text-gray-600 mb-5 space-y-1">
                  <li>{t('ai.products.proven_strategies_full.bullets.0')}</li>
                  <li>{t('ai.products.proven_strategies_full.bullets.1')}</li>
                  <li>{t('ai.products.proven_strategies_full.bullets.2')}</li>
                  <li>{t('ai.products.proven_strategies_full.bullets.3')}</li>
                </ul>
                <Button variant="secondary" disabled className="cursor-not-allowed">{t('ai.available_soon')}</Button>
              </CardContent>
            </Card>
          </div> */}

          <h2 id="all" className="text-2xl font-bold text-gray-900 mb-8">{t('ai.all')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredTools.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} hoveredCard={hoveredCard} setHoveredCard={setHoveredCard} />
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">{t('ai.no_results')}</p>
              <Button variant="outline" className="mt-4" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                {t('ai.clear_filters')}
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
