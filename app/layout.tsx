import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import StickyTrustBar from '@/components/layout/sticky-trust-bar';
import StickyBottomCTA from '@/components/layout/sticky-bottom-cta';
import MarketTicker from '@/components/layout/market-ticker';
import ExitIntentPopup from '@/components/home/exit-intent-popup';

const inter = Inter({ subsets: ['latin'] });

const SITE_URL = 'https://forexbrokeratings.netlify.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Forex Broker Ratings 2026 | Compare & Find the Best Forex Brokers',
  description: 'Compare top forex brokers for 2026 with comprehensive ratings, reviews, and side-by-side comparisons. Find the most trusted brokers for your trading needs.',
  keywords: 'forex brokers 2026, forex trading, broker ratings, forex comparison, best forex brokers, forex broker reviews',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Forex Broker Ratings',
    title: 'Forex Broker Ratings 2026 | Compare & Find the Best Forex Brokers',
    description: 'Compare top forex brokers for 2026 with comprehensive ratings, reviews, and side-by-side comparisons. Find the most trusted brokers for your trading needs.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Forex Broker Ratings 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forex Broker Ratings 2026 | Compare & Find the Best Forex Brokers',
    description: 'Compare top forex brokers for 2026 with comprehensive ratings, reviews, and side-by-side comparisons.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
              Skip to main content
            </a>
            <StickyTrustBar />
            <StickyBottomCTA />
            <MarketTicker />
            <Header />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer />
            <ExitIntentPopup />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}