'use client';

/**
 * Shared logo component with proper initials fallback.
 * Uses bestLogoUrl() which returns local /logos/ or Google Favicon 256px.
 * On error → styled initials (never an empty box).
 */

import { useState } from 'react';
import { initialsOf, bestLogoUrl } from '../_data/entities';

export function BrokerLogo({
  logo,
  name,
  logoColor,
  size = 68,
  className = '',
}: {
  logo: string | null;
  name: string;
  logoColor: string;
  size?: number;
  className?: string;
}) {
  const src = bestLogoUrl(logo);
  const [failed, setFailed] = useState(false);
  const showImage = !!src && !failed;

  return (
    <div
      className={`flex flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl ${className}`}
      style={{
        width: size,
        height: size,
        background: showImage
          ? 'rgba(255,255,255,0.08)'
          : `linear-gradient(135deg,${logoColor}33 0%,${logoColor}11 100%)`,
        border: `1px solid ${showImage ? 'rgba(255,255,255,0.12)' : `${logoColor}55`}`,
        padding: showImage ? Math.round(size * 0.08) : 0,
        color: logoColor,
      }}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src!}
          alt={`${name} logo`}
          className="h-full w-full object-contain"
          loading="eager"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="font-bold" style={{ fontSize: Math.round(size * 0.3) }}>
          {initialsOf(name)}
        </span>
      )}
    </div>
  );
}
