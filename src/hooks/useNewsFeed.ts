import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import type { NewsItem } from '../types/news';

export interface UseNewsFeedOptions {
  category?: string;
  search?: string;
}

export function useNewsFeed({ category = 'All', search = '' }: UseNewsFeedOptions) {
  const [pageSize] = useState(8);

  return useInfiniteQuery<{ items: NewsItem[]; nextPage?: number }>({
    queryKey: ['news', category, search],
    queryFn: async ({ pageParam = 1 }) => {
      const page = Number(pageParam) || 1;
      // For dev, fetch from mock JSON
      const url = `/mock/news.json`;
      const res = await fetch(url);
      const allData: NewsItem[] = await res.json();
      // Filter by category and search
      let filtered = allData;
      if (category && category !== 'All') {
        filtered = filtered.filter((item) => item.category === category);
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.headline.toLowerCase().includes(q) ||
            item.summary.toLowerCase().includes(q) ||
            item.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      // Pagination
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const items = filtered.slice(start, end);
      const nextPage = end < filtered.length ? page + 1 : undefined;
      return { items, nextPage };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 1000 * 60,
    initialPageParam: 1,
  });
}
