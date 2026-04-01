"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface TocItem {
  id: string;
  label: string;
}

interface BrokerTocProps {
  items: TocItem[];
}

/**
 * Interactive table of contents with IntersectionObserver-based active section tracking.
 * Inspired by BrokerChooser and NerdWallet's sticky navigation.
 * Highlights the current section as user scrolls, and smooth-scrolls on click.
 */
export default function BrokerToc({ items }: BrokerTocProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || '');
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Track which section is in view
  useEffect(() => {
    const sectionIds = items.map(i => i.id);
    
    // Clean up previous observer
    if (observerRef.current) observerRef.current.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry closest to the top of the viewport
        const visibleEntries = entries.filter(e => e.isIntersecting);
        if (visibleEntries.length > 0) {
          // Pick the one with the smallest boundingClientRect.top (closest to top)
          const topEntry = visibleEntries.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActiveId(topEntry.target.id);
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px', // Account for sticky header
        threshold: 0.1,
      }
    );

    observerRef.current = observer;

    // Observe all sections
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const offset = 90; // Account for sticky header
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      setActiveId(id);
      // Update URL hash without jumping
      history.replaceState(null, '', `#${id}`);
    }
  }, []);

  return (
    <nav className="sticky top-24 rounded-xl border border-gray-800 bg-gray-900/80 backdrop-blur-sm p-3" aria-label="Table of contents">
      <h3 className="text-base font-semibold text-gray-400 uppercase tracking-wider mb-2">On This Page</h3>
      <div className="space-y-0.5">
        {items.map(({ id, label }) => {
          const isActive = activeId === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => handleClick(e, id)}
              className={cn(
                "block text-base rounded-lg px-3 py-1.5 transition-all duration-200",
                isActive
                  ? "text-emerald-400 bg-emerald-500/10 font-medium border-l-2 border-emerald-500 pl-[10px]"
                  : "text-gray-300 hover:text-emerald-400 hover:bg-emerald-500/5"
              )}
              aria-current={isActive ? 'true' : undefined}
            >
              {label}
            </a>
          );
        })}
      </div>
      {/* Scroll progress indicator */}
      <div className="mt-3 pt-3 border-t border-gray-800">
        <div className="flex items-center gap-2 text-base text-gray-500">
          <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, ((items.findIndex(i => i.id === activeId) + 1) / items.length) * 100)}%`
              }}
            />
          </div>
          <span>{items.findIndex(i => i.id === activeId) + 1}/{items.length}</span>
        </div>
      </div>
    </nav>
  );
}
