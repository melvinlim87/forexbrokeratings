'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

/**
 * Floating Back-to-Top button — appears after scrolling 600px.
 * Inspired by NerdWallet and Investopedia's scroll-to-top patterns.
 * Smooth scroll, subtle pulse animation on first appearance.
 */
export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAppeared, setHasAppeared] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 600) {
        setIsVisible(true);
        if (!hasAppeared) setHasAppeared(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [hasAppeared]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          className={`
            fixed bottom-6 right-6 z-50
            w-10 h-10 rounded-full
            bg-gray-900/90 dark:bg-white/90
            text-white dark:text-gray-900
            shadow-lg shadow-black/10 dark:shadow-white/10
            backdrop-blur-sm
            flex items-center justify-center
            hover:bg-gray-800 dark:hover:bg-gray-100
            hover:shadow-xl
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          `}
          aria-label="Back to top"
          title="Back to top"
        >
          <ChevronUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
