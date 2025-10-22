"use client"
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useI18n } from '@/lib/i18n-client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`
      });
      if (error) throw error;
      setSent(true);
    } catch (err: any) {
      setError(err.message || t('auth.reset_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-xl mx-auto flex flex-col items-center justify-start transition-colors duration-300">
      
      <Card className="w-full max-w-xl shadow-xl border border-border rounded-2xl bg-white/90 backdrop-blur-md">
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
          <CardTitle className="text-3xl font-bold text-center text-gray-900 tracking-tight">{t('auth.forgot_password_heading')}</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 pb-6 px-4 md:px-6">
          {sent ? (
            <div className="text-green-600 text-center font-medium">{t('auth.reset_sent_success')}</div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input
                className="block w-full rounded-md border border-border bg-white px-3 py-2 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder={t('auth.email_placeholder')}
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
              />
              {error && <div className="text-red-500 text-sm text-center font-medium bg-red-50 rounded py-2 px-3">{error}</div>}
              <Button type="submit" className="w-full h-11 text-base font-semibold shadow-sm bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-600 hover:to-blue-700 focus:ring-2 focus:ring-cyan-300 transition-colors" disabled={loading}>
                {loading ? t('auth.sending') : t('auth.send_reset_link')}
              </Button>
              <div className="text-center mt-2 text-sm text-muted-foreground">
                {t('auth.back_to')}{' '}
                <Link href="/login" className="text-primary underline hover:text-primary/80 transition-colors font-semibold">{t('auth.login')}</Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
