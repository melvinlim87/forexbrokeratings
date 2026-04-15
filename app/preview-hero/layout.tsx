import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forex Broker Ratings — Cashback, Reviews & Regulation',
  description: 'Compare 500+ forex brokers. Find the best cashback rebates, check regulation, and read independent in-depth reviews.',
  robots: { index: true, follow: true },
};

export default function PreviewHeroLayout({ children }: { children: React.ReactNode }) {
  // This layout intentionally does NOT render the site header/footer/chrome —
  // it gives the prototype a clean slate. The root layout still wraps this
  // with <html> + <body> + <ThemeProvider>, so dark mode still works.
  return (
    <div className="preview-hero-root relative min-h-screen">
      {children}
    </div>
  );
}
