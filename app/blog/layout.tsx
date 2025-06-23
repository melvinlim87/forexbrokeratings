import React from 'react';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="w-full py-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center shadow">
        <h1 className="text-3xl font-bold">ForexBrokerRatings Blog</h1>
        <p className="mt-2 text-lg text-white/80">Insights, guides, and news for forex traders</p>
      </header>
      <main className="mx-auto px-12 py-12">
        {children}
      </main>
    </div>
  );
}
