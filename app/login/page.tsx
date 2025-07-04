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

export default function LoginPage() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  // if user logged in, redirect to home page
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [router, user]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      // add jwt token to user
      data.user.jwt = data.token;
      // save user to redux
      dispatch(login(data.user));
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-xl flex items-center justify-center transition-colors duration-300">
      <Card className="w-full max-w-xl shadow-xl border border-border rounded-2xl bg-white/90 dark:bg-background/80 backdrop-blur-md">
        <CardHeader className="flex flex-col items-center gap-2 pb-0">
          <div className="w-full mb-2">
            <Image
              src="/assets/images/logo/logo.png"
              alt="Forex Broker Ratings Logo"
              width={240}
              height={60}
              className="w-full h-40 object-cover"
              priority
            />
          </div>
          <CardTitle className="text-3xl font-bold text-center text-gray-900 dark:text-white tracking-tight">Sign in to your account</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 pb-6 px-4 md:px-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              className="block w-full rounded-md border border-border bg-white dark:bg-background px-3 py-2 text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Email*"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <input
              className="block w-full rounded-md border border-border bg-white dark:bg-background px-3 py-2 text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Password*"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <div className="text-right mb-1">
              <a href="/forgot-password" className="text-primary underline hover:text-primary/80 text-sm font-semibold transition-colors">Forgot your password?</a>
            </div>
            {error && <div className="text-red-500 text-sm text-center font-medium bg-red-50 dark:bg-red-900/20 rounded py-2 px-3">{error}</div>}
            <Button type="submit" className="w-full h-11 text-base font-semibold shadow-sm bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-600 hover:to-blue-700 focus:ring-2 focus:ring-cyan-300 transition-colors" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            <div className="text-center mt-2 text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <a href="/register" className="text-primary underline hover:text-primary/80 transition-colors font-semibold">Register</a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
