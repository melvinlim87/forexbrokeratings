import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Forex Broker Reviews & Comparisons',
  description: 'Expert forex broker reviews, honest comparisons, and trading guides for 2026. Make informed decisions with our in-depth analysis.',
  alternates: {
    canonical: '/blog',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
