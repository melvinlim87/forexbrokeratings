"use client";

import { useState, useEffect } from 'react';
import { List, ChevronDown, ChevronUp } from 'lucide-react';

interface TocSection {
  id: string;
  label: string;
}

const SECTIONS: TocSection[] = [
  { id: 'broker-overview', label: 'Broker Overview' },
  { id: 'regulation', label: 'Regulation' },
  { id: 'trading-conditions', label: 'Trading Conditions' },
  { id: 'company-profile', label: 'Company Profile' },
  { id: 'user-reviews', label: 'User Reviews' },
  { id: 'pros-cons', label: 'Pros & Cons' },
  { id: 'faq', label: 'FAQ' },
  { id: 'related-brokers', label: 'Related Brokers' },
];

export function TableOfContents() {
  const [activeId, setActiveId] = useState<string>('');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          // Pick the one with highest intersection ratio
          const best = visible.reduce((a, b) => a.intersectionRatio > b.intersectionRatio ? a : b);
          setActiveId(best.target.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-16 z-30 bg-gray-900/95 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-3 py-2 text-base font-semibold text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-1.5">
          <List className="h-3.5 w-3.5 text-emerald-400" />
          <span>On This Page</span>
        </div>
        {collapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
      </button>

      {/* Links */}
      {!collapsed && (
        <div className="px-2 pb-2 space-y-0.5">
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`w-full text-left text-base px-2 py-1.5 rounded transition-colors block ${
                activeId === id
                  ? 'bg-emerald-500/15 text-emerald-400 font-medium'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
