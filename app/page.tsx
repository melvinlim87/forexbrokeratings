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
import { getUserByEmail } from '@/lib/supabase';
import { signJwt } from '@/lib/jwt';

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  
  useEffect(() => {
    const loginUser = async () => {
      const params = new URLSearchParams(window.location.search);
      const verifiedUser = params.get('verified_user');
      if (verifiedUser) {
        try {
          const encodedUser = JSON.parse(decodeURIComponent(verifiedUser));
          const jwt = encodedUser.jwt;
          const { verifyJwt } = await import('@/lib/jwt');
          const user : any = await verifyJwt(jwt);
          user.user_detail = await getUserByEmail(user?.email as string);
          await dispatch(login(user));
          // Optionally show toast or alert
          router.push('/');
          // window.location.href = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
          // window.alert('Email verified! You are now logged in.');
        } catch (e) {
          // console.log('error', e)
        }
        // Remove the query param from the URL
        // params.delete('verified_user');
        // const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
        // window.history.replaceState({}, '', newUrl);
      }
    }
    loginUser()
    // if (typeof window !== 'undefined') {
    //   const params = new URLSearchParams(window.location.search);
    //   const verifiedUser = params.get('verified_user');
    //   if (verifiedUser) {
    //     loginUser()
    //     try {
    //       const user = JSON.parse(decodeURIComponent(verifiedUser));
    //       dispatch(login(user));
    //       // Optionally show toast or alert
    //       router.push('/');
    //       // window.location.href = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    //       // window.alert('Email verified! You are now logged in.');
    //     } catch (e) {
    //       // console.log('error', e)
    //     }
    //     // Remove the query param from the URL
    //     // params.delete('verified_user');
    //     // const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
    //     // window.history.replaceState({}, '', newUrl);
    //   }
    // }
  }, [dispatch]);

  useEffect(() => {
    const setCountry = async () => {
      const cache = localStorage.getItem('forexbrokeratings_country');
      const cacheTime = localStorage.getItem('forexbrokeratings_country_time');

      if (cache && cacheTime && Date.now() - Number(cacheTime) < 7 * 24 * 60 * 60 * 1000) {
        return;
      }

      let country = await getCountry();
      localStorage.setItem('forexbrokeratings_country', country);
      localStorage.setItem('forexbrokeratings_country_time', Date.now().toString());
    };

    const getCountry = async () => {
      try {
        const ipRes = await fetch("https://ipwho.is/");
        const ipData = await ipRes.json();
        return ipData.country;
      } catch (error) {
        return getCountry2();
      }
    };

    const getCountry2 = async () => {
      try {
        const ipRes = await fetch("https://ipapi.co/json/");
        const ipData = await ipRes.json();
        return ipData.country_name;
      } catch (error) {
        return "Malaysia";
      }
    };

    setCountry();
  }, []);

    useEffect(() => {
    fetch(window.location.href)
      .then(res => {
        const country = res.headers.get('x-country');
        if (country) {
          localStorage.setItem('country', country);
        }
      })
      .catch(console.error);
  }, []);

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