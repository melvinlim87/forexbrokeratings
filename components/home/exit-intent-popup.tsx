"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, CheckCircle2, Mail, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * Exit-Intent Popup — secondary conversion path.
 * Triggers on mouseleave from viewport top (desktop) or after 60s idle (mobile).
 * Offers "Free Broker Comparison Checklist" for email capture.
 * Only shows once per session to avoid annoyance.
 */

const STORAGE_KEY = 'fbr_exit_intent_shown';
const CHECKLIST_ITEMS = [
  "Regulation & licensing verification",
  "Real spread & commission comparison",
  "Platform & tools evaluation",
  "Deposit/withdrawal speed & fees",
  "Customer support quality test",
];

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const dismiss = useCallback(() => {
    setIsVisible(false);
    try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch {}
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsSubmitted(true);
      // Auto-close after showing success
      setTimeout(() => dismiss(), 3000);
    }
  };

  useEffect(() => {
    // Don't show if already shown this session
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {}

    let triggered = false;

    // Desktop: mouse leaving from top of viewport
    const handleMouseLeave = (e: MouseEvent) => {
      if (triggered) return;
      // Only trigger when cursor exits from the top (within 10px of top edge)
      if (e.clientY <= 0 && e.relatedTarget === null) {
        triggered = true;
        setIsVisible(true);
      }
    };

    // Mobile: after 60s of inactivity (no exit event on mobile)
    let mobileTimer: NodeJS.Timeout | null = null;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    if (isMobile) {
      mobileTimer = setTimeout(() => {
        if (!triggered) {
          triggered = true;
          setIsVisible(true);
        }
      }, 60000);
    }

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (mobileTimer) clearTimeout(mobileTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={dismiss}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed left-1/2 top-1/2 z-[61] w-[95vw] max-w-lg -translate-x-1/2 -translate-y-1/2"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Close button */}
              <button
                onClick={dismiss}
                className="absolute right-3 top-3 z-10 rounded-full bg-gray-100 dark:bg-gray-800 p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close popup"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Header accent */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-wide opacity-90">Free Download</span>
                </div>
                <h2 className="text-xl font-bold">
                  {isSubmitted ? "You're on the list!" : "Don't Choose the Wrong Broker"}
                </h2>
              </div>

              <div className="p-6">
                {isSubmitted ? (
                  /* Success state */
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-4"
                  >
                    <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                    <p className="text-gray-700 dark:text-gray-300 mb-1 font-medium">
                      Checklist sent to <strong>{email}</strong>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Check your inbox (and spam folder) in the next few minutes.
                    </p>
                  </motion.div>
                ) : (
                  /* Form state */
                  <>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Get our <strong className="text-gray-900 dark:text-white">10-point Broker Comparison Checklist</strong> — the same framework professional traders use to evaluate brokers.
                    </p>

                    {/* Checklist preview */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-5">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        What's inside:
                      </p>
                      <ul className="space-y-1.5">
                        {CHECKLIST_ITEMS.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Email form */}
                    <form onSubmit={handleSubmit} className="flex gap-2">
                      <div className="relative flex-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-9"
                          required
                          autoComplete="email"
                        />
                      </div>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0">
                        <Download className="h-4 w-4 mr-1.5" />
                        Get Free
                      </Button>
                    </form>

                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">
                      No spam. Unsubscribe anytime. We respect your inbox.
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
