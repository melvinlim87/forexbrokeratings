"use client";

import { ShieldCheck, ShieldAlert, Shield, ShieldOff } from 'lucide-react';

type RiskTier = 'SS' | 'S' | 'A' | 'B' | 'C';

interface RiskFactor {
  name: string;
  score: number;
  maxScore: number;
  detail: string;
}

interface RiskAnalysisProps {
  tier: RiskTier;
  overallScore: number;
  factors: RiskFactor[];
  summary: string;
}

const TIER_CONFIG: Record<RiskTier, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: typeof ShieldCheck;
}> = {
  SS: { label: 'SS — Exceptional', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30', icon: ShieldCheck },
  S: { label: 'S — Excellent', color: 'text-green-400', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30', icon: ShieldCheck },
  A: { label: 'A — Good', color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30', icon: Shield },
  B: { label: 'B — Average', color: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/30', icon: ShieldAlert },
  C: { label: 'C — High Risk', color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30', icon: ShieldOff },
};

export function RiskAnalysis({ tier, overallScore, factors, summary }: RiskAnalysisProps) {
  const config = TIER_CONFIG[tier];
  const Icon = config.icon;

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-3">
      {/* Compact Header */}
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="h-4 w-4 text-blue-400" />
        <h3 className="text-base font-semibold text-white">Risk Analysis</h3>
      </div>

      {/* Compact Tier Badge — horizontal row */}
      <div className={`flex items-center gap-3 ${config.bgColor} border ${config.borderColor} rounded-md px-3 py-2 mb-2`}>
        <Icon className={`h-6 w-6 ${config.color}`} />
        <div className="flex-1 min-w-0">
          <div className={`text-base font-bold ${config.color}`}>{config.label}</div>
          <div className="text-[10px] text-gray-400 truncate">{(config as any).summary || summary.slice(0, 80)}...</div>
        </div>
        <div className={`text-2xl font-black ${config.color} tabular-nums`}>{overallScore}<span className="text-base text-gray-500">/100</span></div>
      </div>

      {/* Inline Risk Factors */}
      <div className="space-y-1.5">
        {factors.map((factor, i) => {
          const pct = (factor.score / factor.maxScore) * 100;
          const barColor = pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-blue-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-500';

          return (
            <div key={i} className="flex items-center gap-2">
              <span className="text-base text-gray-300 w-24 truncate flex-shrink-0">{factor.name}</span>
              <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
              </div>
              <span className="text-base text-white font-medium w-12 text-right tabular-nums">{factor.score}/{factor.maxScore}</span>
            </div>
          );
        })}
      </div>

      {/* Tier Legend — compact row */}
      <div className="mt-2 pt-1.5 border-t border-gray-800/30 flex gap-1">
        {(['SS', 'S', 'A', 'B', 'C'] as RiskTier[]).map((t) => {
          const tc = TIER_CONFIG[t];
          return (
            <div key={t} className={`flex-1 text-center py-1 rounded text-[10px] font-semibold ${
              t === tier ? `${tc.bgColor} ${tc.color} ${tc.borderColor} border` : 'bg-gray-800/50 text-gray-400'
            }`}>
              {t}
            </div>
          );
        })}
      </div>
    </div>
  );
}
