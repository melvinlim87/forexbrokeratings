import Hero from '@/components/home/hero';
import FeaturedBrokers from '@/components/home/featured-brokers';
import ComparisonSection from '@/components/home/comparison-section';
import LatestReviews from '@/components/home/latest-reviews';
import TrustedBySection from '@/components/home/trusted-by-section';
import EducationSection from '@/components/home/education-section';
import Newsletter from '@/components/home/newsletter';

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <FeaturedBrokers />
      <ComparisonSection />
      <LatestReviews />
      <TrustedBySection />
      <EducationSection />
      <Newsletter />
    </div>
  );
}