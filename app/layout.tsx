import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { AppProviders } from './providers';
import { I18nProvider } from '@/lib/i18n-client';
import Script from 'next/script';
import GaListener from '@/components/analytics/GaListener';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Forex Broker Ratings | Find the Best Forex Brokers',
  description: 'Compare top forex brokers with our comprehensive ratings and reviews. Find the most trusted brokers for your trading needs.',
  keywords: 'forex brokers, forex trading, broker ratings, forex comparison, forex broker ratings',
  metadataBase: new URL('https://forexbrokeratings.com'),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: 'https://forexbrokeratings.com',
    title: 'Top Forex Broker Reviews & Ratings 2025',
    description: 'Explore unbiased Forex broker ratings, user reviews, and in-depth analysis of trading platforms, regulations, and more.',
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
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);} 
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
            <GaListener />
            {/* Organization JSON-LD */}
            <Script id="org-jsonld" type="application/ld+json" strategy="afterInteractive">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Forex Broker Ratings",
                "url": "https://forexbrokeratings.com/",
                "logo": "https://forexbrokeratings.com/images/forex-broker-thumbnail.jpg"
              })}
            </Script>
            {/* Website JSON-LD */}
            <Script id="website-jsonld" type="application/ld+json" strategy="afterInteractive">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Forex Broker Ratings",
                "url": "https://forexbrokeratings.com/",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://forexbrokeratings.com/brokers?query={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              })}
            </Script>
          </>
        )}
        <I18nProvider>
          <AppProviders>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">
                  <div>{children}</div>
                </main>
                <Footer />
              </div>
            </ThemeProvider>
          </AppProviders>
        </I18nProvider>
      </body>
    </html>
  );
}