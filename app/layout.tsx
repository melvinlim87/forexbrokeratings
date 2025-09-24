import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { AppProviders } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Forex Broker Ratings | Find the Best Forex Brokers',
  description: 'Compare top forex brokers with our comprehensive ratings and reviews. Find the most trusted brokers for your trading needs.',
  keywords: 'forex brokers, forex trading, broker ratings, forex comparison, best forex brokers',
  metadataBase: new URL('https://forexbrokeratings.com'),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: 'https://forexbrokeratings.com',
    title: 'Top Forex Broker Reviews & Ratings 2025',
    description:
      'Explore unbiased Forex broker ratings, user reviews, and in-depth analysis of trading platforms, regulations, and more.',
    images: [
      {
        url: 'https://forexbrokeratings.com/images/forex-broker-thumbnail.jpg',
        width: 1200,
        height: 630,
        alt: 'Forex Broker Ratings',
      },
    ],
    siteName: 'Forex Broker Ratings',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top Forex Broker Reviews & Ratings 2025',
    description:
      'Discover the best Forex brokers globally with honest reviews, safety scores, spreads, and real trader experiences.',
    images: ['https://forexbrokeratings.com/images/forex-broker-thumbnail.jpg'],
    site: '@forexbrokeratings',
  },
  verification: {
    google: 'google2d637bd8102ea166',
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
        <AppProviders>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">
                <div>
                  {children}
                </div>
              </main>
              <Footer />
            </div>
          </ThemeProvider>
        </AppProviders>
      </body>
    </html>
  );
}