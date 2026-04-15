'use client';

/**
 * Shared building blocks for the in-depth review pages.
 *
 * - <MarkdownProse>   renders the full `fullReview` field verbatim with
 *                     react-markdown + remark-gfm, styled to fit the dark
 *                     glass theme.
 * - <ReviewsPanel>    surfaces userReviewsData (Trustpilot, FPA, Reddit,
 *                     common complaints, quotes) when present.
 * - <FactRow>         small label/value row, slightly larger type than
 *                     previous dossier version for readability.
 */

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ExternalLink, MessageSquare, Quote, Star, TrendingUp, Users } from 'lucide-react';

/* ------------------------------------------------------------------
 * <MarkdownProse>
 * ------------------------------------------------------------------ */

export function MarkdownProse({ content }: { content: string }) {
  return (
    <div className="ph-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2 className="mb-4 mt-10 text-2xl font-bold md:text-3xl" style={{ color: 'var(--ph-text-1)' }}>
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h3 className="mb-3 mt-8 text-xl font-bold md:text-2xl" style={{ color: 'var(--ph-text-1)' }}>
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h4 className="mb-2 mt-6 text-base font-semibold md:text-lg" style={{ color: 'var(--ph-text-1)' }}>
              {children}
            </h4>
          ),
          h4: ({ children }) => (
            <h5 className="mb-2 mt-5 text-sm font-semibold uppercase tracking-[0.08em]" style={{ color: 'var(--ph-text-2)' }}>
              {children}
            </h5>
          ),
          p: ({ children }) => (
            <p className="mb-4 text-[15px] leading-[1.75]" style={{ color: 'var(--ph-text-2)' }}>
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong style={{ color: 'var(--ph-text-1)', fontWeight: 600 }}>{children}</strong>
          ),
          em: ({ children }) => <em style={{ color: 'var(--ph-text-1)' }}>{children}</em>,
          a: ({ href, children }) => (
            <a
              href={href}
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener nofollow' : undefined}
              className="inline-flex items-center gap-0.5 underline decoration-dotted underline-offset-2"
              style={{ color: 'var(--ph-cyan)' }}
            >
              {children}
              {href?.startsWith('http') && <ExternalLink className="ml-0.5 inline-block h-3 w-3" />}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 space-y-1.5 pl-5 text-[15px]" style={{ color: 'var(--ph-text-2)', listStyle: 'disc' }}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol
              className="mb-4 space-y-1.5 pl-5 text-[15px]"
              style={{ color: 'var(--ph-text-2)', listStyle: 'decimal' }}
            >
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-[1.7]" style={{ color: 'var(--ph-text-2)' }}>
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote
              className="my-4 rounded-r-lg border-l-2 py-2 pl-4 text-[14px] italic"
              style={{
                borderColor: 'var(--ph-emerald)',
                background: 'rgba(74, 222, 128, 0.05)',
                color: 'var(--ph-text-2)',
              }}
            >
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isInline = !className?.includes('language-');
            if (isInline) {
              return (
                <code
                  className="rounded px-1.5 py-0.5 font-mono text-[13px]"
                  style={{
                    background: 'rgba(34, 211, 238, 0.1)',
                    border: '1px solid rgba(34, 211, 238, 0.2)',
                    color: 'var(--ph-cyan)',
                  }}
                >
                  {children}
                </code>
              );
            }
            return (
              <pre
                className="my-4 overflow-x-auto rounded-xl p-4 text-[13px] leading-[1.6]"
                style={{
                  background: 'rgba(5, 7, 14, 0.6)',
                  border: '1px solid var(--ph-border-subtle)',
                }}
              >
                <code className="font-mono" style={{ color: 'var(--ph-text-2)' }}>
                  {children}
                </code>
              </pre>
            );
          },
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-xl ph-glass">
              <table className="w-full border-collapse text-[13px]">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead style={{ background: 'rgba(255,255,255,0.03)' }}>{children}</thead>
          ),
          th: ({ children }) => (
            <th
              className="border-b px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.08em]"
              style={{ borderColor: 'var(--ph-border-subtle)', color: 'var(--ph-text-3)' }}
            >
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td
              className="border-b px-3 py-2 leading-[1.5]"
              style={{ borderColor: 'var(--ph-border-subtle)', color: 'var(--ph-text-2)' }}
            >
              {children}
            </td>
          ),
          hr: () => (
            <hr className="my-6" style={{ borderColor: 'var(--ph-border-subtle)' }} />
          ),
          img: () => null, // skip images in preview; they often 404 in deep-dive research
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/* ------------------------------------------------------------------
 * <ReviewsPanel>
 *
 * Pulls from the consolidated userReviewsData field. Gracefully hides
 * sub-sections that are missing.
 * ------------------------------------------------------------------ */

type ReviewSource = { platform?: string; score?: number; maxScore?: number; reviewCount?: number; url?: string };
type Quote = { text?: string; source?: string; date?: string; sentiment?: string };

type UserReviewsData = {
  trustpilot?: { rating?: number; reviews?: number; url?: string };
  fpa?: { rating?: number; reviews?: number; url?: string };
  reddit?: string;
  responseTime?: string;
  commonComplaints?: string[];
  redditSentiment?: string;
  redditMentions?: string;
  sources?: ReviewSource[];
  quotes?: Quote[];
};

export function ReviewsPanel({ reviews }: { reviews?: UserReviewsData | null }) {
  if (!reviews) return null;

  const hasSources =
    (reviews.trustpilot?.rating || reviews.fpa?.rating || (reviews.sources?.length ?? 0) > 0) ?? false;
  const hasQuotes = (reviews.quotes?.length ?? 0) > 0;
  const hasComplaints = (reviews.commonComplaints?.length ?? 0) > 0;

  if (!hasSources && !hasQuotes && !hasComplaints) return null;

  return (
    <section
      id="reviews"
      className="relative overflow-hidden rounded-3xl ph-glass-strong p-6 md:p-8"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 0% 0%, rgba(251, 191, 36, 0.10) 0%, transparent 60%)' }}
      />

      <div className="relative">
        <div className="mb-5 flex items-center gap-2">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{
              background: 'rgba(251, 191, 36, 0.14)',
              border: '1px solid rgba(251, 191, 36, 0.35)',
              color: '#FBBF24',
            }}
          >
            <Users className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: '#FBBF24' }}>
              User reviews
            </div>
            <h3 className="text-xl font-bold" style={{ color: 'var(--ph-text-1)' }}>
              What real traders say
            </h3>
          </div>
        </div>

        {/* Review source cards — prefer the normalised `sources` array; fall
            back to the flat trustpilot/fpa keys only when sources is absent. */}
        {hasSources && (
          <div className="mb-5 grid gap-3 sm:grid-cols-2">
            {(reviews.sources && reviews.sources.length > 0)
              ? (reviews.sources ?? []).map((src, idx) =>
                  src.platform && src.score ? (
                    <ReviewSourceCard
                      key={src.platform ?? idx}
                      name={src.platform}
                      rating={src.score}
                      maxScore={src.maxScore}
                      count={src.reviewCount}
                      url={src.url}
                      color={idx === 0 ? '#00B67A' : idx === 1 ? '#2563EB' : '#A78BFA'}
                    />
                  ) : null
                )
              : (
                <>
                  {reviews.trustpilot?.rating && (
                    <ReviewSourceCard
                      name="Trustpilot"
                      rating={reviews.trustpilot.rating}
                      count={reviews.trustpilot.reviews}
                      url={reviews.trustpilot.url}
                      color="#00B67A"
                    />
                  )}
                  {reviews.fpa?.rating && (
                    <ReviewSourceCard
                      name="Forex Peace Army"
                      rating={reviews.fpa.rating}
                      count={reviews.fpa.reviews}
                      url={reviews.fpa.url}
                      color="#2563EB"
                    />
                  )}
                </>
              )
            }
          </div>
        )}

        {/* Reddit sentiment strip */}
        {(reviews.redditSentiment || reviews.reddit) && (
          <div className="mb-5 rounded-2xl p-4 ph-glass">
            <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--ph-cyan)' }}>
              <MessageSquare className="h-3 w-3" />
              Reddit sentiment
            </div>
            <div className="text-[14px] leading-[1.6]" style={{ color: 'var(--ph-text-2)' }}>
              {reviews.redditSentiment || reviews.reddit}
            </div>
            {reviews.redditMentions && (
              <div className="mt-1 text-xs" style={{ color: 'var(--ph-text-3)' }}>
                {reviews.redditMentions}
              </div>
            )}
          </div>
        )}

        {/* Quotes */}
        {hasQuotes && (
          <div className="mb-5">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--ph-text-3)' }}>
              Quotes from users
            </div>
            <div className="space-y-3">
              {(reviews.quotes ?? []).slice(0, 5).map((q, i) => (
                <div key={i} className="flex gap-3 rounded-xl p-3 ph-glass">
                  <Quote
                    className="h-4 w-4 flex-shrink-0"
                    style={{
                      color:
                        q.sentiment === 'positive'
                          ? 'var(--ph-emerald)'
                          : q.sentiment === 'negative'
                          ? '#F87171'
                          : 'var(--ph-cyan)',
                    }}
                  />
                  <div className="flex-1">
                    <div className="text-[14px] italic leading-[1.55]" style={{ color: 'var(--ph-text-2)' }}>
                      &ldquo;{q.text}&rdquo;
                    </div>
                    <div className="mt-1 text-[11px]" style={{ color: 'var(--ph-text-4)' }}>
                      {q.source}
                      {q.date ? ` · ${q.date}` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Common complaints */}
        {hasComplaints && (
          <div>
            <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: '#F87171' }}>
              <TrendingUp className="h-3 w-3" />
              Common complaints
            </div>
            <ul className="space-y-1.5">
              {(reviews.commonComplaints ?? []).map((c, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-[14px] leading-[1.55]"
                  style={{ color: 'var(--ph-text-2)' }}
                >
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: '#F87171' }} />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        {reviews.responseTime && (
          <div
            className="mt-5 flex items-center justify-between rounded-xl p-3 text-[13px]"
            style={{
              background: 'rgba(74, 222, 128, 0.06)',
              border: '1px solid rgba(74, 222, 128, 0.2)',
              color: 'var(--ph-text-2)',
            }}
          >
            <span style={{ color: 'var(--ph-text-3)' }}>Average support response time</span>
            <span className="font-semibold" style={{ color: 'var(--ph-emerald)' }}>
              {reviews.responseTime}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

function ReviewSourceCard({
  name,
  rating,
  maxScore = 5,
  count,
  url,
  color,
}: {
  name: string;
  rating: number;
  maxScore?: number;
  count?: number | string;
  url?: string;
  color: string;
}) {
  const wrapperClass =
    'group flex items-center justify-between rounded-2xl p-4 ph-glass transition-colors hover:border-white/20';
  const inner = (
    <>
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: `${color}18`, border: `1px solid ${color}44`, color }}
        >
          <Star className="h-4 w-4" fill={color} />
        </div>
        <div>
          <div className="text-[13px] font-semibold" style={{ color: 'var(--ph-text-1)' }}>
            {name}
          </div>
          <div className="text-[11px]" style={{ color: 'var(--ph-text-3)' }}>
            {count ?? '—'} reviews
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="ph-money text-xl font-bold" style={{ color }}>
          {rating.toFixed(1)}
        </div>
        <div className="text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--ph-text-3)' }}>
          / {maxScore}
        </div>
      </div>
    </>
  );

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener nofollow" className={wrapperClass}>
        {inner}
      </a>
    );
  }
  return <div className={wrapperClass}>{inner}</div>;
}

/* ------------------------------------------------------------------
 * <FactRow>
 * ------------------------------------------------------------------ */

export function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b pb-2.5" style={{ borderColor: 'var(--ph-border-subtle)' }}>
      <span className="text-xs uppercase tracking-[0.1em]" style={{ color: 'var(--ph-text-3)' }}>
        {label}
      </span>
      <span className="text-right text-[14px] font-medium" style={{ color: 'var(--ph-text-1)' }}>
        {value}
      </span>
    </div>
  );
}
