"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { saveSubscribers } from '@/lib/supabase';
import { useI18n } from '@/lib/i18n-client';

export default function Newsletter() {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!name.trim()) {
      setError(t('newsletter.name_is_required'));
      return;
    } 
    if (!email) {
      setError(t('newsletter.email_is_required'));
      return;
    }
    if (!validateEmail(email)) {
      setError(t('newsletter.invalid_email'));
      return;
    }
    setLoading(true);
    try {
      type SaveSubscribersResult = { error?: { code?: string; message?: string } };
      const result: SaveSubscribersResult | any = await saveSubscribers({
        id: undefined as any, // Let Supabase auto-increment
        name,
        email,
        country_code: '',
        mobileno: '',
        created_at: new Date().toISOString(),
      });
      // If result is null, treat as error
      // if (!result) {
      //   setError('Failed to subscribe. Please try again later.');
      //   setLoading(false);
      //   return;
      // }
      // If result has error and is duplicate email, handle
      if (result.error && (result.error.code === '23505' || result.error.message?.toLowerCase().includes('duplicate'))) {
        setError(t('newsletter.email_already_used'));
        setLoading(false);
        return;
      } else if (result.error) {
        setError(t('newsletter.failed_to_subscribe'));
        setLoading(false);
        return;
      }
      // Send welcome email
      try {
        await fetch('/api/send-welcome-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email }),
        });
      } catch (err) {
        // Ignore email error
      }
      setSuccess(true);
      setIsSubmitted(true);
      setName('');
      setEmail('');
    } catch (err: any) {
      if (err && err.message.includes('duplicate')) {
        setError(t('newsletter.you_already_subscribed'));
        setLoading(false);
        return;
      }
      setError(t('newsletter.failed_to_subscribe'));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <section className="py-10 bg-blue-50">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto overflow-hidden shadow-xl border-0">
          <div className="grid grid-cols-1 md:grid-cols-5">
            <div className="p-8 md:p-10 md:col-span-3 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-blue-100 p-2 rounded-full w-fit mb-4">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {t('newsletter.title')}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {t('newsletter.subtitle')}
                </p>
                
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="gap-3">
                      <Input
                        type="text"
                        placeholder={t('newsletter.name_placeholder')}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="flex-grow mb-2"
                        disabled={loading}
                      />
                      <Input
                        type="email"
                        placeholder={t('newsletter.email_placeholder')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="flex-grow mb-2"
                        disabled={loading}
                      />
                      <Button type="submit" className="whitespace-nowrap" disabled={loading}>
                        {loading ? t('newsletter.subscribing') : t('newsletter.subscribe')}
                      </Button>
                    </div>
                    {error && (
                      <div className="text-red-600 text-xs mt-1" role="alert">{error}</div>
                    )}
                    {success && (
                      <div className="text-green-700 text-xs mt-1" role="status">{t('newsletter.success_message')}</div>
                    )}
                    <p className="text-xs text-gray-500">
                      {t('newsletter.privacy_message')}
                    </p>
                  </form>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                    <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-green-800">{t('newsletter.thanks_for_subscribing')}</p>
                      <p className="text-sm text-green-700 mt-1">
                        {t('newsletter.confirmation_email_sent')}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
            
            <div className="hidden md:block md:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 p-10 text-white">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-full flex flex-col justify-center"
              >
                <div className="bg-white/20 p-2 rounded-full w-fit mb-4">
                  <Bell className="h-5 w-5 text-white" />
                </div>
                
                <h4 className="text-xl font-bold mb-4">{t('newsletter.subscriber_benefits')}</h4>
                
                <ul className="space-y-3">
                  {[
                    t('newsletter.benefit_1'),
                    t('newsletter.benefit_2'),
                    t('newsletter.benefit_3'),
                    t('newsletter.benefit_4'),
                    t('newsletter.benefit_5')
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="h-5 w-5 text-blue-200 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-blue-50">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}