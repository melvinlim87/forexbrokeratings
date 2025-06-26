"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { saveSubscribers } from '@/lib/supabase';

export default function Newsletter() {
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
      setError('Name is required.');
      return;
    }
    if (!email) {
      setError('Email is required.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      // await saveSubscribers({
      //   id: undefined as any, // Let Supabase auto-increment
      //   name,
      //   email,
      //   country_code: '',
      //   mobileno: '',
      //   created_at: new Date().toISOString(),
      // });
      // Send welcome email
      try {
        await fetch('/api/send-welcome-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name }),
        });
      } catch (e) {
        // Optionally log or toast, but don't block success
        console.warn('Welcome email failed to send', e);
      }
      setSuccess(true);
      setIsSubmitted(true);
      setName('');
      setEmail('');
    } catch (err) {
      console.log(err)
      setError('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <section className="py-10 bg-blue-50 dark:bg-blue-900/20">
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
                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full w-fit mb-4">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Stay Updated with Forex Insights
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Subscribe to receive broker updates, new reviews, market analysis, and exclusive trading tips.
                </p>
                
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="gap-3">
                      <Input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="flex-grow mb-2"
                        disabled={loading}
                      />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="flex-grow mb-2"
                        disabled={loading}
                      />
                      <Button type="submit" className="whitespace-nowrap" disabled={loading}>
                        {loading ? 'Subscribing…' : 'Subscribe'}
                      </Button>
                    </div>
                    {error && (
                      <div className="text-red-600 text-xs mt-1" role="alert">{error}</div>
                    )}
                    {success && (
                      <div className="text-green-700 text-xs mt-1" role="status">Successfully subscribed!</div>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      We respect your privacy. Unsubscribe at any time.
                    </p>
                  </form>
                ) : (
                  <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start">
                    <div className="bg-green-100 dark:bg-green-800 rounded-full p-1 mr-3 mt-0.5">
                      <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-300">Thanks for subscribing!</p>
                      <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                        {/* We've sent a confirmation email to <span className="font-medium">{email}</span> */}
                        We'll keep you updated with the latest broker reviews, news, and insights.
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
                
                <h4 className="text-xl font-bold mb-4">Subscriber Benefits</h4>
                
                <ul className="space-y-3">
                  {[
                    'New broker reviews delivered first',
                    'Exclusive educational content',
                    'Special broker promotions and deals',
                    'Market analysis and trading tips',
                    'Industry updates and regulation changes'
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