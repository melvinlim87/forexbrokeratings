import TopHero from '@/components/home/top-hero';
import Hero from '@/components/home/hero';
import FeaturedBrokers from '@/components/home/featured-brokers';
import ComparisonSection from '@/components/home/comparison-section';
import PromotionsSection from '@/components/home/promotions-section';
import LatestReviews from '@/components/home/latest-reviews';
import TrustedBySection from '@/components/home/trusted-by-section';
import AIToolsSection from '@/components/home/ai-tools-section';
import Newsletter from '@/components/home/newsletter';

export default function Home() {

  return (
    <div className="flex flex-col">
      <TopHero />
      <div className="px-4 sm:px-6 lg:px-8">
        <Hero />
        <FeaturedBrokers />
        <ComparisonSection />
        <PromotionsSection />
        <LatestReviews />
        <TrustedBySection />
        <AIToolsSection />
      </div>
      <Newsletter />
    </div>
  );
}