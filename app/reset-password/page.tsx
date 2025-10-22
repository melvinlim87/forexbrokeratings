"use client"
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // No need for sessionChecked or useEffect for session

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== confirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { error, data } = await supabase.auth.updateUser({ password });
      
      if (error) {
        if (error.message && error.message.toLowerCase().includes('auth session missing')) {
          setError('Your reset link may have expired or is not valid in this browser. Please try clicking the link directly from your email, or request a new password reset.');
        } else {
          setError(error.message || 'Failed to reset password');
        }
        setLoading(false);
        return;
      }
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };


  return (
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
        <CardTitle className="text-3xl font-bold text-center text-gray-900 tracking-tight">Reset Your Password</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-6 px-4 md:px-6">
        {success ? (
          <div className="text-green-600 text-center font-medium">
            Password reset successful. <Link className="underline" href="/login">Log in</Link>.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              className="block w-full rounded-md border border-border bg-white px-3 py-2 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              type="password"
              placeholder="New password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              minLength={8}
            />
            <Input
              className="block w-full rounded-md border border-border bg-white px-3 py-2 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
              minLength={8}
            />
            {error && <div className="text-red-500 text-sm text-center font-medium bg-red-50 rounded py-2 px-3">{error}</div>}
            <Button type="submit" className="w-full h-11 text-base font-semibold shadow-sm bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-600 hover:to-blue-700 focus:ring-2 focus:ring-cyan-300 transition-colors" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
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
