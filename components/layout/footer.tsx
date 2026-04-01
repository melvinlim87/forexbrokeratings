import Link from 'next/link';
import { Globe, Shield, Award, BookOpen, TrendingUp } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t">
      {/* Trust Bar */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center">
              <Shield className="h-6 w-6 text-blue-600 mb-2" />
              <div className="text-sm font-semibold text-gray-900 dark:text-white">100% Independent</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">No paid placements</div>
            </div>
            <div className="flex flex-col items-center">
              <Award className="h-6 w-6 text-amber-500 mb-2" />
              <div className="text-sm font-semibold text-gray-900 dark:text-white">50+ Brokers Reviewed</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">200+ data points each</div>
            </div>
            <div className="flex flex-col items-center">
              <TrendingUp className="h-6 w-6 text-emerald-500 mb-2" />
              <div className="text-sm font-semibold text-gray-900 dark:text-white">Updated Quarterly</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Always current data</div>
            </div>
            <div className="flex flex-col items-center">
              <BookOpen className="h-6 w-6 text-violet-500 mb-2" />
              <div className="text-sm font-semibold text-gray-900 dark:text-white">Expert Methodology</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <Link href="/methodology" className="underline hover:text-primary">Read how we rate</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <Globe className="h-6 w-6 text-primary mr-2" />
              <span className="text-xl font-bold">ForexBrokerRatings</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              ForexBrokerRatings.com provides unbiased forex broker reviews and comparisons to help traders find the most trusted brokers. Our data-driven ratings are built on 200+ verified data points per broker.
            </p>
            {/* Editorial Independence Statement */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-4 max-w-md">
              <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                <strong>Editorial Independence:</strong> Our ratings are never influenced by affiliate partnerships. 
                We may earn a commission when you click links to brokers, but this never affects our scores, 
                rankings, or recommendations.
              </p>
            </div>
            <div className="flex space-x-3">
              <Link href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
              Brokers
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/brokers" className="text-base text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  All Brokers
                </Link>
              </li>
              <li>
                <Link href="/rankings" className="text-base text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  Top Rated
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-base text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  Compare Brokers
                </Link>
              </li>
              <li>
                <Link href="/singapore" className="text-base text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  Singapore Brokers
                </Link>
              </li>
            </ul>
          </div>

          {/* Best Brokers by Category — expanded for SEO */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
              Best By Category
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/best/ecn-brokers" className="text-base text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  ECN Brokers
                </Link>
              </li>
              <li>
                <Link href="/best/low-spread-brokers" className="text-base text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  Lowest Spread Brokers
                </Link>
              </li>
              <li>
                <Link href="/best/beginner-brokers" className="text-base text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  Best for Beginners
                </Link>
              </li>
              <li>
                <Link href="/category/fca-regulated" className="text-base text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  FCA Regulated Brokers
                </Link>
              </li>
              <li>
                <Link href="/category/copy-trading" className="text-base text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  Copy Trading Brokers
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/ai-tools" className="text-base text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  AI Trading Tools
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-base text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="text-base text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  Our Methodology
                </Link>
              </li>
              <li>
                <Link href="/rankings" className="text-base text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  2026 Awards
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-base text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="text-base text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  How We Rate
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-base text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-base text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Risk Disclaimer + Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="bg-amber-50 dark:bg-amber-900/10 rounded-lg p-4 mb-6">
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              <strong>Risk Warning:</strong> Trading foreign exchange on margin carries a high level of risk, and may not be suitable for all investors. 
              Past performance is not indicative of future results. The high degree of leverage can work against you as well as for you. 
              Before deciding to trade foreign exchange you should carefully consider your investment objectives, level of experience, and risk appetite. 
              The possibility exists that you could sustain a loss of some or all of your initial investment and therefore you should not invest money that you cannot afford to lose.
            </p>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            &copy; {new Date().getFullYear()} ForexBrokerRatings.com. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
