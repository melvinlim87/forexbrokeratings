import React from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Bot, Brain, LineChart } from 'lucide-react';
import AiToolsInteractive from '@/components/ai-tools/AiToolsInteractive';

export const metadata: Metadata = {
  title: 'AI Forex Trading Tools | Forex Broker Ratings',
  description: 'Explore AI-powered forex trading tools, analyzers, and products to enhance your strategies. Discover smart analytics, signals, and more.',
  metadataBase: new URL('https://forexbrokeratings.com'),
  alternates: {
    canonical: 'https://forexbrokeratings.com/ai-tools',
    languages: {
      en: 'https://forexbrokeratings.com/ai-tools',
      zh: 'https://forexbrokeratings.com/zh/ai-tools',
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://forexbrokeratings.com/ai-tools',
    title: 'AI Forex Trading Tools | Forex Broker Ratings',
    description: 'Explore AI-powered forex trading tools, analyzers, and products to enhance your strategies.',
    images: ['https://forexbrokeratings.com/assets/images/ai-tools-default.jpg'],
    siteName: 'Forex Broker Ratings',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Forex Trading Tools | Forex Broker Ratings',
    description: 'Explore AI-powered forex trading tools, analyzers, and products to enhance your strategies.',
    images: ['https://forexbrokeratings.com/assets/images/ai-tools-default.jpg'],
  },
};

// Revalidate this page every hour for SEO-friendly pre-rendering
export const revalidate = 3600;

// Sample data - would come from API in real implementation
// Localized via i18n keys stored in each tool entry
const aiTools = [
  {
    id: 1,
    titleKey: 'ai.tools.trading_assistant.title',
    categoryKey: 'ai.categories.trading',
    icon: <Bot className="h-5 w-5" />,
    descriptionKey: 'ai.tools.trading_assistant.description',
    featureKeys: [
      'ai.tools.trading_assistant.features.market_analysis',
      'ai.tools.trading_assistant.features.trade_suggestions',
      'ai.tools.trading_assistant.features.risk_management',
      'ai.tools.trading_assistant.features.performance_tracking'
    ],
    rating: 4.9,
    reviews: 312,
    popular: true,
    slug: 'trading-assistant',
    href: '/ai-tools/trading-assistant',
    disabled: false,
    hasBackground: true
  },
  {
    id: 2,
    titleKey: 'ai.tools.economic_calendar.title',
    categoryKey: 'ai.categories.fundamental',
    icon: <Brain className="h-5 w-5" />,
    descriptionKey: 'ai.tools.economic_calendar.description',
    featureKeys: [
      'ai.tools.economic_calendar.features.impact_prediction',
      'ai.tools.economic_calendar.features.historical_correlation',
      'ai.tools.economic_calendar.features.custom_alerts',
      'ai.tools.economic_calendar.features.reaction_tracking'
    ],
    rating: 4.4,
    reviews: 98,
    popular: false,
    slug: 'economic-calendar',
    href: '/ai-tools/economic-calendar',
    disabled: false,
    hasBackground: true
  },
  {
    id: 3,
    titleKey: 'ai.tools.forex_market_hours.title',
    categoryKey: 'ai.categories.fundamental',
    icon: <Brain className="h-5 w-5" />,
    descriptionKey: 'ai.tools.forex_market_hours.description',
    featureKeys: [
      'ai.tools.forex_market_hours.features.detect_overlaps',
      'ai.tools.forex_market_hours.features.current_open_sessions',
      'ai.tools.forex_market_hours.features.custom_alerts',
      'ai.tools.forex_market_hours.features.reaction_tracking'
    ],
    rating: 4.4,
    reviews: 98,
    popular: false,
    slug: 'forex-market-hours',
    href: '/ai-tools/forex-market-hours',
    disabled: false,
    hasBackground: true
  },
  {
    id: 4,
    titleKey: 'ai.tools.market_sentiment_analyzer.title',
    categoryKey: 'ai.categories.research',
    icon: <Brain className="h-5 w-5" />,
    descriptionKey: 'ai.tools.market_sentiment_analyzer.description',
    featureKeys: [
      'ai.tools.market_sentiment_analyzer.features.social_media_tracking',
      'ai.tools.market_sentiment_analyzer.features.news_analysis',
      'ai.tools.market_sentiment_analyzer.features.trend_visualization',
      'ai.tools.market_sentiment_analyzer.features.real_time_updates'
    ],
    rating: 4.6,
    reviews: 189,
    popular: true,
    slug: 'market-sentiment-analyzer',
    href: '/ai-tools/market-sentiment-analyzer',
    disabled: false,
    hasBackground: true
  },
  {
    id: 5,
    titleKey: 'ai.tools.decyphers.title',
    // categoryKey: 'ai.categories.technical',
    icon: <img src="/assets/images/ai-tools/decyphers-logo.png" alt="Decyphers" className="h-10 w-full" />,
    descriptionKey: 'ai.tools.decyphers.description',
    featureKeys: [
      'ai.tools.decyphers.features.upload_charts',
      'ai.tools.decyphers.features.pattern_detection',
      'ai.tools.decyphers.features.next_move_prediction',
      'ai.tools.decyphers.features.actionable_insights'
    ],
    rating: 4.8,
    reviews: 321,
    popular: true,
    slug: 'decyphers',
    href: 'https://ai.decyphers.com/signup?referral_code=fbr_u8kt',
    disabled: false,
    hasBackground: false
  },
  {
    id: 6,
    titleKey: 'ai.tools.portfolio_optimizer.title',
    categoryKey: 'ai.categories.portfolio',
    icon: <Bot className="h-5 w-5" />,
    descriptionKey: 'ai.tools.portfolio_optimizer.description',
    featureKeys: [
      'ai.tools.portfolio_optimizer.features.risk_adjusted_allocation',
      'ai.tools.portfolio_optimizer.features.correlation_analysis',
      'ai.tools.portfolio_optimizer.features.rebalancing_recommendations',
      'ai.tools.portfolio_optimizer.features.performance_projections'
    ],
    rating: 4.7,
    reviews: 156,
    popular: false,
    slug: 'portfolio-optimizer',
    disabled: true,
    hasBackground: true
  },
  {
    id: 7,
    titleKey: 'ai.tools.pattern_scanner.title',
    categoryKey: 'ai.categories.technical',
    icon: <LineChart className="h-5 w-5" />,
    descriptionKey: 'ai.tools.pattern_scanner.description',
    featureKeys: [
      'ai.tools.pattern_scanner.features.multi_timeframe_scanning',
      'ai.tools.pattern_scanner.features.custom_pattern_definitions',
      'ai.tools.pattern_scanner.features.alert_notifications',
      'ai.tools.pattern_scanner.features.historical_backtest'
    ],
    rating: 4.5,
    reviews: 132,
    popular: true,
    slug: 'pattern-scanner',
    disabled: true,
    hasBackground: true
  },
  {
    id: 8,
    titleKey: 'ai.tools.trading_signals.title',
    categoryKey: 'ai.categories.analysis',
    icon: <LineChart className="h-5 w-5" />,
    descriptionKey: 'ai.tools.trading_signals.description',
    featureKeys: [
      'ai.tools.trading_signals.features.real_time_analysis',
      'ai.tools.trading_signals.features.multi_timeframe',
      'ai.tools.trading_signals.features.custom_alert_settings',
      'ai.tools.trading_signals.features.historical_performance'
    ],
    rating: 4.8,
    reviews: 245,
    popular: true,
    slug: 'trading-signals',
    disabled: true,
    hasBackground: true
  },
  {
    id: 9,
    titleKey: 'ai.tools.trading_bots.title',
    categoryKey: 'ai.categories.trading',
    icon: <Bot className="h-5 w-5" />,
    descriptionKey: 'ai.tools.trading_bots.description',
    featureKeys: [
      'ai.tools.trading_bots.features.strategy_builder',
      'ai.tools.trading_bots.features.risk_settings',
      'ai.tools.trading_bots.features.performance_analytics',
      'ai.tools.trading_bots.features.multi_broker_integration'
    ],
    rating: 4.7,
    reviews: 276,
    popular: true,
    slug: 'trading-bots',
    disabled: true,
    hasBackground: true
  },
  {
    id: 10,
    titleKey: 'ai.tools.news_predictor.title',
    categoryKey: 'ai.categories.research',
    icon: <Brain className="h-5 w-5" />,
    descriptionKey: 'ai.tools.news_predictor.description',
    featureKeys: [
      'ai.tools.news_predictor.features.real_time_news',
      'ai.tools.news_predictor.features.impact_prediction',
      'ai.tools.news_predictor.features.historical_correlation',
      'ai.tools.news_predictor.features.alert_system'
    ],
    rating: 4.5,
    reviews: 143,
    popular: false,
    slug: 'news-predictor',
    disabled: true,
    hasBackground: true
  },
];

const categories = [
  { value: 'all', labelKey: 'ai.categories.all' },
  { value: 'analysis', labelKey: 'ai.categories.analysis' },
  { value: 'research', labelKey: 'ai.categories.research' },
  { value: 'portfolio', labelKey: 'ai.categories.portfolio' },
  { value: 'technical-analysis', labelKey: 'ai.categories.technical' },
  { value: 'trading', labelKey: 'ai.categories.trading' },
  { value: 'fundamental-analysis', labelKey: 'ai.categories.fundamental' }
];
export default function AIToolsPage() {
  return (
    <div className="min-h-screen bg-transparent">
      {/* Breadcrumbs JSON-LD */}
      <Script id="jsonld-breadcrumbs" type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://forexbrokeratings.com/' },
            { '@type': 'ListItem', position: 2, name: 'AI Tools', item: 'https://forexbrokeratings.com/ai-tools' }
          ]
        })}
      </Script>

      {/* JSON-LD Product structured data (static English for SEO) */}
      {/* <Script id="jsonld-semi-auto-ea" type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'Semi Auto Trading EA',
          description: 'A Semi Auto Trading Expert Advisor (EA) combines automation with human control. It provides signals and entry suggestions while you make the final decision, reducing workload and improving accuracy.',
          brand: { '@type': 'Brand', name: 'Forex Broker Ratings' },
          offers: { '@type': 'Offer', priceCurrency: 'USD', price: '499', availability: 'https://schema.org/PreOrder' }
        })}
      </Script>
      <Script id="jsonld-full-auto-ea" type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'Full Auto Trading EA',
          description: 'A fully automated EA that analyzes markets, identifies opportunities, and executes trades end-to-end with predefined risk management—eliminating emotional decisions for consistent performance.',
          brand: { '@type': 'Brand', name: 'Forex Broker Ratings' },
          offers: { '@type': 'Offer', priceCurrency: 'USD', price: '799', availability: 'https://schema.org/PreOrder' }
        })}
      </Script>
      <Script id="jsonld-proven-semi" type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'Proven Strategies Set Files (Semi-Auto)',
          description: 'Ready-to-use, backtested set files tailored for semi-auto trading. Load and trade with confidence across different market conditions and account sizes.',
          brand: { '@type': 'Brand', name: 'Forex Broker Ratings' },
          offers: { '@type': 'Offer', priceCurrency: 'USD', price: '150', availability: 'https://schema.org/PreOrder' }
        })}
      </Script>
      <Script id="jsonld-proven-full" type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'Proven Strategies Set Files (Full-Auto)',
          description: 'Ready-to-use, backtested set files optimized for full-auto systems. Achieve consistency and efficiency with parameters refined for automated execution.',
          brand: { '@type': 'Brand', name: 'Forex Broker Ratings' },
          offers: { '@type': 'Offer', priceCurrency: 'USD', price: '250', availability: 'https://schema.org/PreOrder' }
        })}
      </Script> */}

      <AiToolsInteractive aiTools={aiTools as any} categories={categories as any} />
    </div>
  );
}

// Define interface for tool object
interface Tool {
  id: number;
  titleKey: string;
  categoryKey: string;
  icon: React.ReactNode;
  descriptionKey: string;
  featureKeys: string[];
  rating: number;
  reviews: number;
  popular?: boolean;
  slug: string;
  href?: string;
  disabled: boolean;
}

// ToolCard moved to components/ai-tools/ToolCard.tsx (client component)
