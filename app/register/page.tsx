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

export default function RegisterPage() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
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
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) {
      setError("Name, email, and password are required.");
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
      if (!res.ok) throw new Error(data.error || "Registration failed");
      dispatch(login(data.user));
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-xl mx-auto flex items-center justify-center transition-colors duration-300">
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
          <CardTitle className="text-3xl font-bold text-center text-gray-900 dark:text-white tracking-tight">Create your account</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 pb-6 px-4 md:px-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="block w-full rounded-md border border-border bg-white dark:bg-background px-3 py-2 text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Name*"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <input
              className="block w-full rounded-md border border-border bg-white dark:bg-background px-3 py-2 text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Email*"
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
                  placeholder="Mobile Number"
                  type="number"
                  value={mobileno}
                  onChange={e => setMobileno(e.target.value)}
                  required
                />
              </div>
            </div>
            <input
              className="block w-full rounded-md border border-border bg-white dark:bg-background px-3 py-2 text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Password*"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <Button type="submit" className="w-full h-11 text-base font-semibold shadow-sm bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-600 hover:to-blue-700 focus:ring-2 focus:ring-cyan-300 transition-colors" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
