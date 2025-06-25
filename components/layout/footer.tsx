import Link from 'next/link';
import { Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <Globe className="h-6 w-6 text-primary mr-2" />
              <span className="text-xl font-bold">Forex Broker Ratings</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              ForexBrokerRatings.com provides unbiased forex broker reviews and comparisons to help traders find the most trusted brokers.
            </p>
            {/* <div className="flex space-x-4">
              <Link href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </Link>
            </div> */}
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
                <Link href="/regulations" className="text-base text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  Regulation
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
                <Link href="/guides" className="text-base text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-base text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  News
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
                <Link href="/about-us" className="text-base text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-base text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-base text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <p className="text-base text-gray-500 dark:text-gray-400 text-center">
              &copy; {new Date().getFullYear()} ForexBrokerRatings.com. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
              Trading foreign exchange on margin carries a high level of risk and may not be suitable for all investors. 
              The high degree of leverage can work against you as well as for you.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}