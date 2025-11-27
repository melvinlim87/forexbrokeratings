import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchNews, type News } from '../../lib/supabase';

export interface UseNewsFeedOptions {
  category?: string;
  search?: string;
}

export function useNewsFeed({ category = 'All', search = '' }: UseNewsFeedOptions) {
  const [pageSize] = useState(10);

  return useInfiniteQuery<{ items: News[]; nextPage?: number }>({
    queryKey: ['news', category, search],
    queryFn: async ({ pageParam = 1 }) => {
      const page = Number(pageParam) || 1;
      // Fetch a single page from Supabase
      const pageData: News[] = await fetchNews(page, pageSize);
      // Filter by category and search (client-side on this page of data)
      let filtered = pageData;
      if (category && category !== 'All') {
        filtered = filtered.filter((item) => item.category === category);
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.headline.toLowerCase().includes(q) ||
            item.summary.toLowerCase().includes(q) ||
            (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)))
        );
      }
      // Determine if there may be another page based on raw page size
      const nextPage = (pageData.length === pageSize) ? page + 1 : undefined;
      return { items: filtered, nextPage };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 1000 * 60,
    initialPageParam: 1,
  });
}
