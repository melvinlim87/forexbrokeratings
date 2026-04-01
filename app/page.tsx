import dynamic from 'next/dynamic';
import HeroConsolidated from '@/components/home/hero-consolidated';
import TrustStatsBar from '@/components/home/trust-stats-bar';
import CategoryWinners from '@/components/home/category-winners';
import FeaturedBrokers from '@/components/home/featured-brokers';
import { OrganizationSchema, WebSiteSchema, BrokerListSchema, FAQSchema } from '@/components/seo/structured-data';
import { faqs } from '@/lib/faq-data';

// Lazy-loaded below-fold sections with skeleton placeholders
const TrendingStrip = dynamic(() => import('@/components/home/trending-strip'), {
  loading: () => <div className="h-16 animate-pulse bg-muted rounded-md mx-4 my-2" />,
});
const DataFreshnessBadge = dynamic(() => import('@/components/home/data-freshness-badge'), {
  loading: () => <div className="h-10 w-48 animate-pulse bg-muted rounded-md mx-auto my-4" />,
});
const BrokerMatchQuiz = dynamic(() => import('@/components/home/broker-match-quiz'), {
  loading: () => <div className="h-48 animate-pulse bg-muted rounded-md mx-4 my-6" />,
});
const TradingCostCalculator = dynamic(() => import('@/components/home/trading-cost-calculator'), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse bg-muted rounded-md mx-4 my-6" />,
});
const LatestReviewsAndArticles = dynamic(() => import('@/components/home/latest-reviews-and-articles'), {
  ssr: false,
  loading: () => <div className="h-48 animate-pulse bg-muted rounded-md mx-4 my-6" />,
});
const HomeFAQ = dynamic(() => import('@/components/home/home-faq'), {
  loading: () => <div className="h-64 animate-pulse bg-muted rounded-md mx-4 my-6" />,
});
const AIToolsSection = dynamic(() => import('@/components/home/ai-tools-section'), {
  loading: () => <div className="h-48 animate-pulse bg-muted rounded-md mx-4 my-6" />,
});
const Newsletter = dynamic(() => import('@/components/home/newsletter'), {
  loading: () => <div className="h-40 animate-pulse bg-muted rounded-md mx-4 my-6" />,
});
const SocialProofToast = dynamic(() => import('@/components/home/social-proof-toast'), {
  ssr: false,
});
const BackToTop = dynamic(() => import('@/components/back-to-top'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Structured Data for SEO */}
      <OrganizationSchema />
      <WebSiteSchema />
      <BrokerListSchema />
      <FAQSchema faqs={faqs} />

      <HeroConsolidated />

      {/* Broker Match Quiz — #1 conversion tool, above the fold */}
      <BrokerMatchQuiz />

      <TrustStatsBar />
      <CategoryWinners />
      <TrendingStrip />

      {/* Data freshness indicator */}
      <DataFreshnessBadge />

      <FeaturedBrokers />

      {/* Trading Cost Calculator — shows real dollar costs */}
      <TradingCostCalculator />

      {/* Latest Reviews & Articles — tabbed section */}
      <LatestReviewsAndArticles />

      {/* FAQ Section — for SEO rich snippets */}
      <HomeFAQ />

      <AIToolsSection />
      <Newsletter />

      {/* Social Proof Toast — live activity notifications */}
      <SocialProofToast />

      {/* Back to Top — floating scroll button */}
      <BackToTop />
    </div>
  );
}
