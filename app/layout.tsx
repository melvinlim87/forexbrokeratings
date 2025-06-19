import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '600', '800'],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'Forex Broker Ratings - Compare Top Forex Brokers | Find Your Perfect Trading Partner',
  description: 'Compare the best forex brokers with real-time data, verified reviews, and transparent ratings. Find the perfect broker for your trading needs.',
  keywords: 'forex brokers, forex comparison, trading platforms, forex trading, broker reviews',
  authors: [{ name: 'Forex Broker Ratings Team' }],
  openGraph: {
    title: 'Forex Broker Ratings - Compare Top Forex Brokers',
    description: 'Find the perfect forex broker with our comprehensive comparison tool',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forex Broker Ratings - Compare Top Forex Brokers',
    description: 'Find the perfect forex broker with our comprehensive comparison tool',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Navigation Header */}
          <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10 shadow-lg">
            <div className="max-w-7xl mx-auto px-6 md:px-8">
              <div className="flex items-center justify-between h-18">
                {/* Logo and Brand - Left Side */}
                <Link href="/" className="flex items-center space-x-3 py-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-white leading-tight">Forex Broker Ratings</span>
                    <span className="text-xs text-cyan-300 font-medium tracking-wide">Compare • Analyze • Trade</span>
                  </div>
                </Link>
                
                {/* Navigation Links - Right Side */}
                <div className="hidden md:flex items-center space-x-8">
                  <Link href="/" className="text-cyan-200 hover:text-white transition-all duration-300 font-medium relative group">
                    Home
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link href="/rankings" className="text-cyan-200 hover:text-white transition-all duration-300 font-medium relative group">
                    Rankings
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link href="/promotions" className="text-cyan-200 hover:text-white transition-all duration-300 font-medium relative group">
                    Promotions
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link href="/comparisons" className="text-cyan-200 hover:text-white transition-all duration-300 font-medium relative group">
                    Comparisons
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link href="/blog" className="text-cyan-200 hover:text-white transition-all duration-300 font-medium relative group">
                    Blog
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link href="/rsfinance" className="text-cyan-200 hover:text-white transition-all duration-300 font-medium relative group">
                    RS Finance
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </div>
                
                {/* Mobile Menu Button */}
                <div className="md:hidden">
                  <button className="text-cyan-200 hover:text-white transition-colors p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </nav>
          
          {/* Main Content with top padding for fixed nav */}
          <div className="pt-18">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}