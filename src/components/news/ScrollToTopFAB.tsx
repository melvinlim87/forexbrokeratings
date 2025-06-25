"use client";
import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTopFAB = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 800);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return show ? (
    <button
      className="fixed bottom-4 right-4 z-50 rounded-full bg-[#00c7d4] text-white p-3 shadow-lg hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
      aria-label="Scroll to top"
      onClick={scrollToTop}
      tabIndex={0}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  ) : null;
};

export default ScrollToTopFAB;
