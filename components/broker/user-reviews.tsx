"use client";

import { useState } from 'react';
import { MessageSquare, Star, ThumbsUp, ThumbsDown, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

interface ReviewSource {
  platform: string;
  score: number;
  maxScore: number;
  reviewCount: string;
  url?: string;
  logo?: string;
}

interface ReviewQuote {
  text: string;
  source: string;
  date: string;
  rating?: number;
  sentiment: 'positive' | 'negative' | 'mixed';
}

interface UserReviewsProps {
  brokerName: string;
  sources: ReviewSource[];
  quotes: ReviewQuote[];
  overallSentiment: string;
  prosCons?: {
    pros: string[];
    cons: string[];
  };
}

export function UserReviews({ brokerName, sources, quotes, overallSentiment, prosCons }: UserReviewsProps) {
  const [showAll, setShowAll] = useState(false);
  const displayQuotes = showAll ? quotes : quotes.slice(0, 2);

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-3">
      {/* Compact Header */}
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="h-4 w-4 text-purple-400" />
        <h3 className="text-base font-semibold text-white">User Reviews</h3>
      </div>

      {/* Aggregated Scores — compact row */}
      <div className="flex gap-2 mb-2">
        {sources.map((source, i) => (
          <a
            key={i}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gray-800/50 rounded px-2 py-1.5 text-center hover:bg-gray-800/70 transition-colors block"
          >
            <div className="text-[10px] text-gray-500 flex items-center justify-center gap-0.5">
              {source.platform}
              <ExternalLink className="h-2.5 w-2.5" />
            </div>
            <div className="flex items-center justify-center gap-0.5">
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
              <span className="text-base font-bold text-white">{source.score}</span>
              <span className="text-[10px] text-gray-500">/{source.maxScore}</span>
            </div>
          </a>
        ))}
      </div>

      {/* Pros/Cons — compact inline */}
      {prosCons && (
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            {prosCons.pros.slice(0, 3).map((pro, i) => (
              <div key={i} className="text-[11px] text-gray-300 flex items-start gap-1 mb-0.5">
                <span className="text-emerald-400 mt-0.5 text-base">+</span>
                <span className="line-clamp-1">{pro}</span>
              </div>
            ))}
          </div>
          <div>
            {prosCons.cons.slice(0, 3).map((con, i) => (
              <div key={i} className="text-[11px] text-gray-300 flex items-start gap-1 mb-0.5">
                <span className="text-red-400 mt-0.5 text-base">−</span>
                <span className="line-clamp-1">{con}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Quotes — compact */}
      <div className="space-y-1.5">
        {displayQuotes.map((quote, i) => (
          <div key={i} className={`rounded px-2 py-1.5 border text-base ${
            quote.sentiment === 'positive' ? 'bg-emerald-500/5 border-emerald-500/15' :
            quote.sentiment === 'negative' ? 'bg-red-500/5 border-red-500/15' :
            'bg-gray-800/20 border-gray-700/30'
          }`}>
            <p className="text-gray-300 italic line-clamp-2">&ldquo;{quote.text}&rdquo;</p>
            <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
              <span>{quote.source}</span>
              <span>{quote.date}</span>
            </div>
          </div>
        ))}
      </div>
      {quotes.length > 2 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-1.5 text-[10px] text-gray-500 hover:text-gray-300 flex items-center gap-0.5"
        >
          {showAll ? <><ChevronUp className="h-3 w-3" />Less</> : <><ChevronDown className="h-3 w-3" />All {quotes.length} reviews</>}
        </button>
      )}
    </div>
  );
}
