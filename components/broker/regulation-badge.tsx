"use client";

import Image from 'next/image';
import { Shield } from 'lucide-react';

interface RegulationInfo {
  code: string;
  name: string;
  country: string;
  flagFile: string;
  tier: 1 | 2 | 3;
}

const REGULATION_MAP: Record<string, RegulationInfo> = {
  FCA: { code: 'FCA', name: 'Financial Conduct Authority', country: 'United Kingdom', flagFile: '/logos/regulators/fca.png', tier: 1 },
  ASIC: { code: 'ASIC', name: 'Australian Securities & Investments Commission', country: 'Australia', flagFile: '/logos/regulators/asic.png', tier: 1 },
  CySEC: { code: 'CySEC', name: 'Cyprus Securities & Exchange Commission', country: 'Cyprus', flagFile: '/logos/regulators/cysec.png', tier: 1 },
  BaFin: { code: 'BaFin', name: 'Federal Financial Supervisory Authority', country: 'Germany', flagFile: '/logos/regulators/bafin.png', tier: 1 },
  DFSA: { code: 'DFSA', name: 'Dubai Financial Services Authority', country: 'UAE', flagFile: '/logos/regulators/dfsa.png', tier: 1 },
  FSCA: { code: 'FSCA', name: 'Financial Sector Conduct Authority', country: 'South Africa', flagFile: '/logos/regulators/fsca.png', tier: 2 },
  MAS: { code: 'MAS', name: 'Monetary Authority of Singapore', country: 'Singapore', flagFile: '/logos/regulators/mas.png', tier: 1 },
  CFTC: { code: 'CFTC', name: 'Commodity Futures Trading Commission', country: 'USA', flagFile: '/logos/regulators/cftc.png', tier: 1 },
  NFA: { code: 'NFA', name: 'National Futures Association', country: 'USA', flagFile: '/logos/regulators/nfa.png', tier: 1 },
  JFSA: { code: 'JFSA', name: 'Japan Financial Services Agency', country: 'Japan', flagFile: '/logos/regulators/jfsa.png', tier: 1 },
  FMA: { code: 'FMA', name: 'Financial Markets Authority', country: 'New Zealand', flagFile: '/logos/regulators/fma.png', tier: 2 },
  FINMA: { code: 'FINMA', name: 'Swiss Financial Market Supervisory Authority', country: 'Switzerland', flagFile: '/logos/regulators/finma.png', tier: 1 },
  SCB: { code: 'SCB', name: 'Securities Commission of The Bahamas', country: 'Bahamas', flagFile: '/logos/regulators/scb.png', tier: 3 },
  FSA: { code: 'FSA', name: 'Financial Services Authority', country: 'Seychelles', flagFile: '/logos/regulators/fsa.png', tier: 3 },
  FSC: { code: 'FSC', name: 'Financial Services Commission', country: 'Mauritius', flagFile: '/logos/regulators/fsc.png', tier: 2 },
  CIMA: { code: 'CIMA', name: 'Cayman Islands Monetary Authority', country: 'Cayman Islands', flagFile: '/logos/regulators/cima.png', tier: 2 },
  VFSC: { code: 'VFSC', name: 'Vanuatu Financial Services Commission', country: 'Vanuatu', flagFile: '/logos/regulators/vfsc.png', tier: 3 },
  IFSC: { code: 'IFSC', name: 'International Financial Services Commission', country: 'Belize', flagFile: '/logos/regulators/ifsc.png', tier: 3 },
  SVG: { code: 'SVG', name: 'Financial Services Authority', country: 'St. Vincent & Grenadines', flagFile: '/logos/regulators/svg.png', tier: 3 },
  SEC: { code: 'SEC', name: 'Securities and Exchange Commission', country: 'USA', flagFile: '/logos/regulators/sec.png', tier: 1 },
  IIROC: { code: 'IIROC', name: 'Investment Industry Regulatory Organization', country: 'Canada', flagFile: '/logos/regulators/iiroc.png', tier: 1 },
  CBI: { code: 'CBI', name: 'Central Bank of Ireland', country: 'Ireland', flagFile: '/logos/regulators/cbi.png', tier: 1 },
  SFC: { code: 'SFC', name: 'Securities & Futures Commission', country: 'Hong Kong', flagFile: '/logos/regulators/sfc.png', tier: 1 },
  CMA: { code: 'CMA', name: 'Capital Markets Authority', country: 'Kenya', flagFile: '/logos/regulators/cma.png', tier: 2 },
};

function getTierColor(tier: number): string {
  switch (tier) {
    case 1: return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700';
    case 2: return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700';
    case 3: return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700';
    default: return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600';
  }
}

function getTierLabel(tier: number): string {
  switch (tier) {
    case 1: return 'Tier 1';
    case 2: return 'Tier 2';
    case 3: return 'Tier 3';
    default: return 'Unknown';
  }
}

interface RegulationBadgeProps {
  regulation: string;
  licenseNumber?: string;
}

export function RegulationBadge({ regulation, licenseNumber }: RegulationBadgeProps) {
  const info = REGULATION_MAP[regulation];
  
  if (!info) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <Shield className="h-4 w-4 text-gray-500" />
        <span className="text-base font-medium">{regulation}</span>
        {licenseNumber && <span className="text-base text-gray-500">{licenseNumber}</span>}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border ${getTierColor(info.tier)}`}>
      <div className="relative w-6 h-4 flex-shrink-0 rounded-sm overflow-hidden">
        <Image
          src={info.flagFile}
          alt={`${info.country} flag`}
          fill
          className="object-cover"
          sizes="24px"
        />
      </div>
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold">{info.code}</span>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${getTierColor(info.tier)}`}>
            {getTierLabel(info.tier)}
          </span>
        </div>
        <span className="text-[11px] opacity-75 truncate">{info.country}{licenseNumber ? ` · ${licenseNumber}` : ''}</span>
      </div>
    </div>
  );
}

interface RegulationBadgesProps {
  regulations: string[];
  licenseNumbers?: string[];
}

export function RegulationBadges({ regulations, licenseNumbers = [] }: RegulationBadgesProps) {
  // Build a map of regulation -> license number
  const licenseMap: Record<string, string> = {};
  licenseNumbers.forEach(ln => {
    for (const reg of regulations) {
      if (ln.toUpperCase().includes(reg.toUpperCase()) || ln.includes(reg)) {
        licenseMap[reg] = ln;
        break;
      }
    }
  });

  // Sort: Tier 1 first, then Tier 2, then Tier 3
  const sorted = [...regulations].sort((a, b) => {
    const ta = REGULATION_MAP[a]?.tier ?? 99;
    const tb = REGULATION_MAP[b]?.tier ?? 99;
    return ta - tb;
  });

  return (
    <div className="flex flex-wrap gap-2">
      {sorted.map(reg => (
        <RegulationBadge
          key={reg}
          regulation={reg}
          licenseNumber={licenseMap[reg]}
        />
      ))}
    </div>
  );
}

export { REGULATION_MAP };
export type { RegulationInfo };
