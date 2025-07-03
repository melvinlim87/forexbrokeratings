"use client"
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-xl shadow-xl border border-border rounded-2xl bg-white/90 dark:bg-background/80 backdrop-blur-md">
      <CardHeader className="flex flex-col items-center gap-2 pb-0">
        <div className="w-full mb-2">
          <Image
            src="/assets/images/logo/logo.png"
            alt="Forex Broker Ratings Logo"
            width={240}
            height={60}
            className="w-full h-24 object-cover"
            priority
          />
        </div>
        <CardTitle className="text-3xl font-bold text-center text-gray-900 dark:text-white tracking-tight">Forgot your password?</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-6 px-4 md:px-6">
        {sent ? (
          <div className="text-green-600 text-center font-medium">Password reset email sent. Check your inbox!</div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              className="block w-full rounded-md border border-border bg-white dark:bg-background px-3 py-2 text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Email*"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoFocus
            />
            {error && <div className="text-red-500 text-sm text-center font-medium bg-red-50 dark:bg-red-900/20 rounded py-2 px-3">{error}</div>}
            <Button type="submit" className="w-full h-11 text-base font-semibold shadow-sm bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-600 hover:to-blue-700 focus:ring-2 focus:ring-cyan-300 transition-colors" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
            <div className="text-center mt-2 text-sm text-muted-foreground">
              Back to{' '}
              <Link href="/login" className="text-primary underline hover:text-primary/80 transition-colors font-semibold">Login</Link>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
