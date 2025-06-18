'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const IP_CHECK_URL = 'https://ipapi.co/json/';

export function IPChecker() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkIP = async () => {
      try {
        const response = await fetch(IP_CHECK_URL);
        const data = await response.json();
        
        // Check if the IP is from Singapore
        if (data.country === 'SG') {
          console.log('Singapore IP detected, redirecting...');
          router.push('/restricted');
        }
      } catch (error) {
        console.error('Error checking IP:', error);
        // Continue loading the page if there's an error
      }
    };

    checkIP();
  }, [router, pathname]);

  return null; // This component doesn't render anything
}
