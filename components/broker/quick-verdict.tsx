"use client";

import Link from 'next/link';
import { Award, ThumbsUp, ThumbsDown, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickVerdictProps {
  brokerName: string;
  rating: number;
  bestFor: string;
  pros: string[];
  cons: string[];
  affiliateUrl: string;
}

/**
 * Quick Verdict — conversion-focused "Our Recommendation" section.
 * Inspired by BrokerChooser's verdict box and NerdWallet's "Our Take".
 * Gives users a fast decision framework without reading the full review.
 */
export default function QuickVerdict({ brokerName, rating, bestFor, pros, cons, affiliateUrl }: QuickVerdictProps) {
  const getVerdictLabel = (rating: number) => {
    if (rating >= 9.0) return { label: 'Excellent', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', emoji: '🏆' };
    if (rating >= 8.5) return { label: 'Outstanding', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', emoji: '⭐' };
    if (rating >= 8.0) return { label: 'Very Good', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', emoji: '👍' };
    if (rating >= 7.0) return { label: 'Good', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', emoji: '✓' };
    return { label: 'Average', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', emoji: '—' };
  };

  const verdict = getVerdictLabel(rating);
  const topPros = pros.slice(0, 3);
  const topCons = cons.slice(0, 2);

  return (
    <div className={`rounded-xl border ${verdict.border} ${verdict.bg} p-4`}>
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Verdict badge + rating */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gray-900/60 border border-gray-700/50">
            <span className="text-2xl font-bold text-white">{rating.toFixed(1)}</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <Award className={`h-4 w-4 ${verdict.color}`} />
              <span className={`text-sm font-bold ${verdict.color}`}>
                {verdict.emoji} {verdict.label}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Best for: <span className="text-gray-300 font-medium">{bestFor}</span>
            </p>
          </div>
        </div>

        {/* Key highlights */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {/* Top pros */}
            <div className="space-y-1">
              {topPros.map((pro, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{pro}</span>
                </div>
              ))}
            </div>
            {/* Top cons */}
            <div className="space-y-1">
              {topCons.map((con, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs">
                  <AlertTriangle className="h-3 w-3 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">{con}</span>
                </div>
              ))}
            </div>
          </div>
          {/* CTA */}
          <div className="flex items-center gap-3">
            <a href={affiliateUrl} target="_blank" rel="noopener noreferrer sponsored">
              <Button size="sm" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5">
                Open Account with {brokerName} <ArrowRight className="h-3 w-3" />
              </Button>
            </a>
            <span className="text-[10px] text-gray-500">Free to open · Risk warning applies</span>
          </div>
        </div>
      </div>
    </div>
  );
}
