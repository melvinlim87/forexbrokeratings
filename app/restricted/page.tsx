import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function RestrictedPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="max-w-2xl text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Access Restricted
        </h1>
        
        <div className="p-6 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg mb-8">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            We've detected that you're accessing our site from Singapore. 
            Due to regulatory requirements, some broker information may not be available in your region.
          </p>
          
          <p className="text-gray-600 dark:text-gray-400">
            Please note that the brokers listed on our site may not be authorized to provide services in your jurisdiction.
            Always verify the regulatory status of any financial service provider before engaging with them.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button asChild variant="default" size="lg">
            <Link href="/">
              Return to Homepage
            </Link>
          </Button>
          
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            If you believe you've reached this page in error, please 
            <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
              contact our support team
            </Link>.
          </div>
        </div>
      </div>
    </div>
  );
}
