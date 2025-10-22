import React from 'react';
import HeroHeader from '../components/news/HeroHeader';
import FilterBar from '../components/news/FilterBar';
import NewsFeed from '../components/news/NewsFeed';
import ScrollToTopFAB from '../components/news/ScrollToTopFAB';
import DisclaimerFooter from '../components/news/DisclaimerFooter';

const NewsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#f3f6fa]">
      <HeroHeader />
      <div className="max-w-2xl mx-auto px-2 sm:px-4">
        <FilterBar />
        <NewsFeed />
      </div>
      <ScrollToTopFAB />
      <DisclaimerFooter />
    </div>
  );
};

export default NewsPage;
