"use client";
import TopHero from '@/components/home/top-hero';
import { LoginModalProvider } from '@/components/broker/LoginModalContext';
import Hero from '@/components/home/hero';
import FeaturedBrokers from '@/components/home/featured-brokers';
import ComparisonSection from '@/components/home/comparison-section';
import PromotionsSection from '@/components/home/promotions-section';
import LatestReviews from '@/components/home/latest-reviews';
import TrustedBySection from '@/components/home/trusted-by-section';
import AIToolsSection from '@/components/home/ai-tools-section';
import Newsletter from '@/components/home/newsletter';
import PromotionPopup from '@/components/home/PromotionPopup';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { login } from '@/store/slices/authSlice';

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const verifiedUser = params.get('verified_user');
      if (verifiedUser) {
        try {
          const user = JSON.parse(decodeURIComponent(verifiedUser));
          dispatch(login(user));
          // Optionally show toast or alert
          window.location.href = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
          // window.alert('Email verified! You are now logged in.');
        } catch (e) {}
        // Remove the query param from the URL
        params.delete('verified_user');
        const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [dispatch]);

  return (
    <div className="flex flex-col">
      <PromotionPopup />
      <div className="w-full">
        <LoginModalProvider>
          <TopHero />
        </LoginModalProvider>
        <Hero />
      </div>
      <div className="px-4 sm:px-6 lg:px-8">
        <PromotionsSection />
        <FeaturedBrokers />
        <ComparisonSection />
        <LatestReviews />
        <TrustedBySection />
        {/* <AIToolsSection /> */}
      </div>
      <Newsletter />
    </div>
  );
}