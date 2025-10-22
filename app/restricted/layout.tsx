import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Access Restricted | Forex Broker Ratings',
  description: 'This content is restricted in your region due to regulatory requirements.',
};

export default function RestrictedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
