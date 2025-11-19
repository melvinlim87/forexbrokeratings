import QueryProvider from '../../src/components/QueryProvider';
import React from 'react';
import HeroHeader from '../../src/components/news/HeroHeader';
import NewsFeed from '../../src/components/news/NewsFeed';
import ScrollToTopFAB from '../../src/components/news/ScrollToTopFAB';
import DisclaimerFooter from '../../src/components/news/DisclaimerFooter';

const NewsPage = () => {
  return (
    <div className="min-h-screen bg-transparent">
      <HeroHeader />
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-1">
          <main>
            <NewsFeed />
          </main>
        </div>
      </div>
      <ScrollToTopFAB />
      <DisclaimerFooter />
    </div>
  );
};

export default function NewsPageWithQueryProvider() {
  return (
    <QueryProvider>
      <NewsPage />
    </QueryProvider>
  );
}
