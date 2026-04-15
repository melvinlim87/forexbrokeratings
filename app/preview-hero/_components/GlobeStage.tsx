'use client';

/**
 * Responsive wrapper around whichever globe variant is selected.
 * Measures its container with ResizeObserver so the globe stays crisp
 * on window resize, and offers an A↔B switcher chip.
 */

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { JURISDICTIONS } from '../_data/jurisdictions';
import { BROKERS } from '../_data/entities';

// Both variants are dynamically imported so their WebGL/three.js
// bundles are only loaded in the browser.
const GlobeA = dynamic(() => import('./GlobeA'), {
  ssr: false,
  loading: () => <GlobeSkeleton />,
});

const GlobeB = dynamic(() => import('./GlobeB'), {
  ssr: false,
  loading: () => <GlobeSkeleton />,
});

type Variant = 'A' | 'B';

export default function GlobeStage() {
  // Default to Globe B (raw @react-three/fiber) — the fully-working variant.
  // Globe A (react-globe.gl) is temporarily a placeholder while we pin a
  // compatible three/three-globe/three-render-objects triple.
  const [variant, setVariant] = useState<Variant>('B');
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!containerRef.current) return;
    const el = containerRef.current;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: Math.floor(width), h: Math.floor(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="relative h-full w-full" ref={containerRef}>
      {/* A↔B switcher + live map label — stacked in top-left */}
      <div className="absolute left-4 top-6 z-20 flex flex-col gap-2">
        <div className="flex rounded-full p-1 ph-glass-strong">
          {(['A', 'B'] as Variant[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVariant(v)}
              className="ph-focus-ring relative rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors"
              style={{
                color: variant === v ? '#05070E' : 'var(--ph-text-1)',
                background: variant === v ? 'linear-gradient(135deg, #4ADE80, #22D3EE)' : 'transparent',
              }}
            >
              Globe {v}
            </button>
          ))}
        </div>

        {/* Live regulatory map label — below the A/B switcher */}
        <div
          className="pointer-events-none text-left text-[12px] font-semibold uppercase tracking-[0.12em]"
          style={{ color: 'var(--ph-text-1)' }}
        >
          <div className="mb-1 flex items-center gap-1.5">
            <span className="ph-live-dot" aria-hidden />
            <span>Live regulatory map</span>
          </div>
          <div className="text-[11px] font-medium" style={{ color: 'var(--ph-text-2)' }}>
            {JURISDICTIONS.length} jurisdictions · {BROKERS.length} brokers
          </div>
        </div>
      </div>

      {/* The globe canvas */}
      <div className="absolute inset-0">
        {mounted && size.w > 0 && size.h > 0 && (
          <motion.div
            key={variant}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="h-full w-full"
          >
            {variant === 'A' ? (
              <GlobeA width={size.w} height={size.h} />
            ) : (
              <GlobeB width={size.w} height={size.h} />
            )}
          </motion.div>
        )}
      </div>

      {/* Bottom caption */}
      <div
        className="pointer-events-none absolute bottom-4 left-0 right-0 z-20 text-center text-[11px] uppercase tracking-[0.18em]"
        style={{ color: 'var(--ph-text-3)' }}
      >
        Drag · auto-rotating · arcs = multi-jurisdiction entities
      </div>
    </div>
  );
}

function GlobeSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative h-48 w-48">
        <div className="absolute inset-0 animate-pulse rounded-full" style={{
          background: 'radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 70%)',
        }} />
        <div className="absolute inset-4 rounded-full" style={{
          background: '#0A0E1A',
          border: '1px solid rgba(34,211,238,0.2)',
          boxShadow: '0 0 64px rgba(34,211,238,0.15)',
        }} />
      </div>
    </div>
  );
}
