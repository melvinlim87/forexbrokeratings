import Hero from '@/components/Hero';
import BrokerSlider from '@/components/BrokerSlider';
import ReviewsSection from '@/components/ReviewsSection';
import BenefitGrid from '@/components/BenefitGrid';
import ComparisonTable from '@/components/ComparisonTable';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-black">
      <Hero />
      <BrokerSlider />
      <ComparisonTable />
      <ReviewsSection />
      <BenefitGrid />
      <Footer />
    </main>
  );
}