"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useNewsFeed } from '../../hooks/useNewsFeed';
import NewsCard from './NewsCard';
import FilterBar from './FilterBar';
import T from '@/components/common/T';
import { useI18n } from '@/lib/i18n-client';

const InfiniteScroll = dynamic(() => import('react-infinite-scroll-component'), { ssr: false });

const NewsFeed: React.FC = () => {
  const { t } = useI18n();
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const { data, fetchNextPage, hasNextPage, isLoading } = useNewsFeed({ category, search });

  // Flatten paginated data
  const items = data?.pages.flatMap(page => page.items) || [];
  
  return (
    <div className="mt-4" aria-live="polite">
      <FilterBar
        activeCategory={category}
        onCategoryChange={setCategory}
        onSearch={setSearch}
      />
      {isLoading ? (
        <>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-[#e6e8ec] rounded-lg h-24 mb-4" />
          ))}
        </>
      ) : (
        <InfiniteScroll
          dataLength={items.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={<div className="py-6 text-center text-gray-400">{t('news.loading_more')}</div>}
          scrollThreshold={0.9}
        >
          {items.map(item => (
            <NewsCard key={item.id} item={item} />
          ))}
        </InfiniteScroll>
      )}
      {!isLoading && items.length === 0 && (
        <div className="text-center text-gray-500 py-12"><T k="news.no_results" /></div>
      )}
    </div>
  );
};

export default NewsFeed;
