"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { login } from '@/store/slices/authSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import dynamic from 'next/dynamic';
const FilterableCountryCodeSelect = dynamic(() => import('./FilterableCountryCodeSelect'), { ssr: false });
import { useI18n } from '@/lib/i18n-client';
 

export default function RegisterPage() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const { t } = useI18n();

    // if user logged in, redirect to home page
    useEffect(() => {
      if (user) {
        router.push('/');
      }
    }, [router, user]);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [mobileno, setMobileno] = useState("");
  // CountryCodeSelect is dynamically imported below
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeSubscribe, setAgreeSubscribe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) {
      setError(t('auth.error_required_fields'));
       return;
     }
    if (!agreePrivacy) {
      setError(t('auth.error_must_agree_privacy'));
       return;
     }
     setLoading(true);
     try {
       const res = await fetch("/api/register", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           name,
           email,
           country_code: countryCode,
           mobileno,
           role: "user",
           created_at: new Date().toISOString(),
           password
         })
       });
       const data = await res.json();
       if (!res.ok) throw new Error(data.error || t('auth.register_failed'));
       // If user agreed to subscribe, save subscriber info
       if (agreeSubscribe) {
         try {
           // Save subscriber info
           await fetch('/api/newsletter', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
               name,
               email,
               country_code: countryCode,
               mobileno,
               created_at: new Date().toISOString(),
             })
           });
         } catch (err) {
           // Optionally handle newsletter error silently
         }
       }
       setSuccess(true);
       // Do not redirect, show confirmation message instead
       return;
     } catch (err: any) {
       setError(err.message || t('auth.register_failed'));
     } finally {
       setLoading(false);
     }
  };

  return (
    <div className="min-h-screen w-full max-w-xl mx-auto flex flex-col items-center justify-start transition-colors duration-300">
      
      <Card className="w-full max-w-xl shadow-xl border border-border rounded-2xl bg-white/90 dark:bg-background/80 backdrop-blur-md">
        <CardHeader className="flex flex-col items-center gap-2 pb-0">
          <div className="w-full mb-2">
            <Image
              src="/assets/images/logo/logo2.png"
              alt="Forex Broker Ratings Logo"
              width={240}
              height={60}
              className="w-full h-40 object-cover"
              priority
            />
          </div>
          <CardTitle className="text-3xl font-bold text-center text-gray-900 dark:text-white tracking-tight">{t('auth.register_heading')}</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 pb-6 px-4 md:px-6">
          {success ? (
            <div className="py-8 flex flex-col items-center">
              <div className="text-2xl font-semibold text-center mb-4 text-cyan-700 dark:text-cyan-300">
                {t('auth.register_success_title')}
              </div>
              <div className="text-base text-center text-gray-800 dark:text-gray-200 max-w-md mb-2">
                {t('auth.register_success_sent_to')} <span className="font-semibold">{email}</span>.<br />
                {t('auth.register_success_next')}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                {t('auth.register_success_hint')}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="block w-full rounded-md border border-border bg-white dark:bg-background px-3 py-2 text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder={t('auth.name_placeholder')}
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <input
                className="block w-full rounded-md border border-border bg-white dark:bg-background px-3 py-2 text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder={t('auth.email_placeholder')}
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <div className="flex flex-col md:flex-row gap-3">
                <div className="md:w-1/3">
                  <FilterableCountryCodeSelect value={countryCode} onChange={setCountryCode} />
                </div>
                <div className="md:w-2/3">
                  <input
                    className="block w-full rounded-md border border-border bg-white dark:bg-background px-3 py-2 text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder={t('auth.mobile_placeholder')}
                    type="number"
                    value={mobileno}
                    onChange={e => setMobileno(e.target.value)}
                    required
                  />
                </div>
              </div>
              <input
                className="block w-full rounded-md border border-border bg-white dark:bg-background px-3 py-2 text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder={t('auth.password_placeholder')}
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              {/* Privacy Policy Agreement (required) */}
              <div className="flex items-start mb-2">
                <input
                  id="privacy-policy"
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={e => setAgreePrivacy(e.target.checked)}
                  className="mt-1 mr-2"
                  required
                />
                <label htmlFor="privacy-policy" className="text-sm select-none">
                  {t('auth.privacy_agree_label')}{' '}
                  <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline text-blue-600 hover:text-blue-800">{t('auth.privacy_policy')}</a>
                </label>
              </div>
              {/* Newsletter Subscription (optional) */}
              <div className="flex items-start mb-4">
                <input
                  id="subscribe-newsletter"
                  type="checkbox"
                  checked={agreeSubscribe}
                  onChange={e => setAgreeSubscribe(e.target.checked)}
                  className="mt-1 mr-2"
                />
                <label htmlFor="subscribe-newsletter" className="text-sm select-none">
                  {t('auth.subscribe_label')}
                </label>
              </div>
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              <Button type="submit" className="w-full h-11 text-base font-semibold shadow-sm bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-600 hover:to-blue-700 focus:ring-2 focus:ring-cyan-300 transition-colors" disabled={loading}>
                {loading ? t('auth.registering') : t('auth.register')}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
