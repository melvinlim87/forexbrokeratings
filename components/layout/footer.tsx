'use client';

import Link from 'next/link';
import { Globe } from 'lucide-react';
import { useI18n } from '@/lib/i18n-client';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="bg-gray-50 border-t w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <Globe className="h-6 w-6 text-primary mr-2" />
              <span className="text-xl font-bold">{t('footer.title')}</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              {t('footer.tagline')}
            </p>
          </div>
          
          <div>
            <h3 className="text-md font-semibold text-gray-900 tracking-wider uppercase mb-4">
              {t('footer.col_brokers')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/brokers" className="text-base text-gray-600 hover:text-primary">
                  {t('footer.link_all_brokers')}
                </Link>
              </li>
              <li>
                <Link href="/rankings" className="text-base text-gray-600 hover:text-primary">
                  {t('footer.link_top_rated')}
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-base text-gray-600 hover:text-primary">
                  {t('footer.link_compare_brokers')}
                </Link>
              </li>
              <li>
                <Link href="/regulations" className="text-base text-gray-600 hover:text-primary">
                  {t('footer.link_regulation')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-md font-semibold text-gray-900 tracking-wider uppercase mb-4">
              {t('footer.col_resources')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/ai-tools" className="text-base text-gray-600 hover:text-primary">
                  {t('footer.link_ai_tools')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-base text-gray-600 hover:text-primary">
                  {t('footer.link_blog')}
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-base text-gray-600 hover:text-primary">
                  {t('footer.link_guides')}
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-base text-gray-600 hover:text-primary">
                  {t('footer.link_news')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-md font-semibold text-gray-900 tracking-wider uppercase mb-4">
              {t('footer.col_company')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about-us" className="text-base text-gray-600 hover:text-primary">
                  {t('footer.link_about')}
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-base text-gray-600 hover:text-primary">
                  {t('footer.link_contact')}
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-base text-gray-600 hover:text-primary">
                  {t('footer.link_privacy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <p className="text-base text-gray-500 text-center">
              &copy; {new Date().getFullYear()} ForexBrokeratings.com. {t('footer.copyright')}
            </p>
            <p className="text-sm text-gray-500 text-center mt-2">
              {t('footer.risk_disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}