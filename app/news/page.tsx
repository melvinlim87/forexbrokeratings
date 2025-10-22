import QueryProvider from '../../src/components/QueryProvider';
import React from 'react';
import HeroHeader from '../../src/components/news/HeroHeader';
import FilterBar from '../../src/components/news/FilterBar';
import NewsFeed from '../../src/components/news/NewsFeed';
import ScrollToTopFAB from '../../src/components/news/ScrollToTopFAB';
import DisclaimerFooter from '../../src/components/news/DisclaimerFooter';

const NewsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#f3f6fa]">
      <HeroHeader />
      <div className="max-w-5xl mx-auto px-2 sm:px-4">
        <NewsFeed />
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
