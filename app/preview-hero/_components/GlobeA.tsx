'use client';

/**
 * Globe variant A — react-globe.gl
 *
 * TEMPORARILY DISABLED in v1 prototype.
 *
 * Reason: `react-globe.gl@2.27` pulls in `three-globe@2.45` and
 * `three-render-objects`, both of which import from newer `three`
 * subpaths (`three/webgpu`, `three/tsl`, direct `Timer` export)
 * that are not consistently available across three r160–r175.
 * Resolving this without breaking the rest of the app requires
 * pinning `three`, `three-globe`, and `three-render-objects` to a
 * compatible triple — a research task we'll take on separately.
 *
 * Globe B (raw @react-three/fiber) is fully working and is the
 * default in the prototype. This file renders a placeholder so the
 * A↔B switcher still compiles.
 */

import { AlertTriangle, Sparkles } from 'lucide-react';

type Props = {
  width: number;
  height: number;
};

export default function GlobeA({ width, height }: Props) {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center"
      style={{ width, height }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(251,191,36,0.08) 0%, rgba(34,211,238,0.04) 40%, transparent 70%)',
        }}
      />

      <div className="relative max-w-sm rounded-2xl p-6 text-center ph-glass-strong">
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
          style={{
            background: 'rgba(251, 191, 36, 0.14)',
            border: '1px solid rgba(251, 191, 36, 0.4)',
            color: '#FBBF24',
          }}
        >
          <AlertTriangle className="h-5 w-5" />
        </div>

        <div
          className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: '#FBBF24' }}
        >
          Globe A — pending
        </div>

        <h3 className="mb-3 text-lg font-bold" style={{ color: 'var(--ph-text-1)' }}>
          react-globe.gl disabled in v1
        </h3>

        <p className="mb-4 text-sm leading-relaxed" style={{ color: 'var(--ph-text-2)' }}>
          Depends on <code style={{ color: '#22D3EE' }}>three-globe</code> and{' '}
          <code style={{ color: '#22D3EE' }}>three-render-objects</code>, which need a
          specific <code style={{ color: '#22D3EE' }}>three</code> version triple. We&apos;ll
          pin a compatible combo before launch.
        </p>

        <div className="flex items-center justify-center gap-2 rounded-lg border px-3 py-2"
          style={{
            background: 'rgba(74, 222, 128, 0.08)',
            borderColor: 'rgba(74, 222, 128, 0.3)',
            color: 'var(--ph-emerald)',
          }}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">Switch to Globe B to see the hero →</span>
        </div>
      </div>
    </div>
  );
}
