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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <meta name="description" content="Compare and review the best Forex brokers in 2025. Find trusted ratings, user reviews, regulations, spreads, and trading conditions for brokers worldwide."></meta>

      <meta property="og:type" content="website"></meta>
      <meta property="og:title" content="Top Forex Broker Reviews & Ratings 2025"></meta>
      <meta property="og:description" content="Explore unbiased Forex broker ratings, user reviews, and in-depth analysis of trading platforms, regulations, and more."></meta>
      <meta property="og:image" content="https://yourdomain.com/images/forex-broker-thumbnail.jpg"></meta>
      <meta property="og:url" content="https://yourdomain.com"></meta>
      <meta property="og:site_name" content="Forex Broker Ratings"></meta>

      <meta name="twitter:card" content="summary_large_image"></meta>
      <meta name="twitter:title" content="Top Forex Broker Reviews & Ratings 2025"></meta>
      <meta name="twitter:description" content="Discover the best Forex brokers globally with honest reviews, safety scores, spreads, and real trader experiences."></meta>
      <meta name="twitter:image" content="https://yourdomain.com/images/forex-broker-thumbnail.jpg"></meta>


      <meta name="keywords" content="Forex brokers, Forex broker reviews, best forex brokers 2025, ECN brokers, low spread brokers, Forex trading platforms, regulated brokers"></meta>
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