'use client';

/**
 * Payment method badges — extracted at runtime from fullReview markdown.
 * Uses branded colours for ~20 known methods; generic fallback for others.
 */

import { CreditCard } from 'lucide-react';

const KNOWN_METHODS: Record<string, { label: string; color: string; bg: string }> = {
  visa:            { label: 'Visa',            color: '#1A1F71', bg: 'rgba(26,31,113,0.15)' },
  mastercard:      { label: 'Mastercard',      color: '#EB001B', bg: 'rgba(235,0,27,0.12)' },
  paypal:          { label: 'PayPal',          color: '#003087', bg: 'rgba(0,48,135,0.15)' },
  skrill:          { label: 'Skrill',          color: '#862165', bg: 'rgba(134,33,101,0.12)' },
  neteller:        { label: 'Neteller',        color: '#85BC22', bg: 'rgba(133,188,34,0.12)' },
  'bank wire':     { label: 'Bank Wire',       color: '#6B7280', bg: 'rgba(107,114,128,0.12)' },
  'bank transfer': { label: 'Bank Transfer',   color: '#6B7280', bg: 'rgba(107,114,128,0.12)' },
  bitcoin:         { label: 'Bitcoin',         color: '#F7931A', bg: 'rgba(247,147,26,0.12)' },
  crypto:          { label: 'Crypto',          color: '#F7931A', bg: 'rgba(247,147,26,0.12)' },
  'apple pay':     { label: 'Apple Pay',       color: '#A3AAAE', bg: 'rgba(163,170,174,0.12)' },
  'google pay':    { label: 'Google Pay',      color: '#4285F4', bg: 'rgba(66,133,244,0.12)' },
  unionpay:        { label: 'UnionPay',        color: '#E21836', bg: 'rgba(226,24,54,0.12)' },
  poli:            { label: 'POLi',            color: '#009B3A', bg: 'rgba(0,155,58,0.12)' },
  bpay:            { label: 'BPAY',            color: '#003478', bg: 'rgba(0,52,120,0.12)' },
  klarna:          { label: 'Klarna',          color: '#FFB3C7', bg: 'rgba(255,179,199,0.12)' },
  fasapay:         { label: 'FasaPay',         color: '#F7A900', bg: 'rgba(247,169,0,0.12)' },
  sticpay:         { label: 'SticPay',         color: '#FF6B00', bg: 'rgba(255,107,0,0.12)' },
  pix:             { label: 'PIX',             color: '#32BCAD', bg: 'rgba(50,188,173,0.12)' },
  sofort:          { label: 'SOFORT',          color: '#EF809F', bg: 'rgba(239,128,159,0.12)' },
  ideal:           { label: 'iDEAL',           color: '#CC0066', bg: 'rgba(204,0,102,0.12)' },
};

/**
 * Scan fullReview markdown for known payment method names.
 * Returns deduplicated array of labels in the order they appear.
 */
export function extractPaymentMethods(fullReview: string | undefined | null): string[] {
  if (!fullReview) return [];
  const lower = fullReview.toLowerCase();
  const found: string[] = [];
  for (const [key, val] of Object.entries(KNOWN_METHODS)) {
    if (lower.includes(key) && !found.includes(val.label)) {
      found.push(val.label);
    }
  }
  return found;
}

function getMethodStyle(label: string) {
  const entry = Object.values(KNOWN_METHODS).find((m) => m.label === label);
  return entry ?? { label, color: 'var(--ph-text-2)', bg: 'rgba(255,255,255,0.05)' };
}

export function PaymentBadge({ label }: { label: string }) {
  const s = getMethodStyle(label);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.color}33` }}
    >
      {label}
    </span>
  );
}

export function PaymentBadges({ methods }: { methods: string[] }) {
  if (!methods?.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--ph-text-3)' }}>
        <CreditCard className="h-3.5 w-3.5" />
        Deposit methods
      </span>
      {methods.map((m) => (
        <PaymentBadge key={m} label={m} />
      ))}
    </div>
  );
}
