"use client";
import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n-client';

const categories: { value: string; labelKey: string }[] = [
  { value: 'All', labelKey: 'news.categories.all' },
  { value: 'Macro', labelKey: 'news.categories.macro' },
  { value: 'Broker', labelKey: 'news.categories.broker' },
  { value: 'Market Alert', labelKey: 'news.categories.market_alert' },
  { value: 'Education', labelKey: 'news.categories.education' },
];

interface FilterBarProps {
  onCategoryChange?: (cat: string) => void;
  onSearch?: (term: string) => void;
  activeCategory?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  onCategoryChange,
  onSearch,
  activeCategory = 'All',
}) => {
  const [search, setSearch] = useState('');
  const { t } = useI18n();

  return (
    <div className="mb-4">
      <div className="rounded-lg border border-[#e6e8ec] bg-white shadow-sm p-3">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr,220px] gap-3 items-center">
          <form
            role="search"
            className="w-full flex items-center rounded-md bg-white border border-[#e6e8ec] px-3 py-2 focus-within:ring-2 focus-within:ring-cyan-400"
            onSubmit={e => {
              e.preventDefault();
              onSearch?.(search);
            }}
          >
            <span className="inline-block mr-2 text-gray-400">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-2-2"/></svg>
            </span>
            <input
              type="text"
              className="w-full border-0 outline-none text-sm"
              placeholder={t('news.search_placeholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label={t('news.search_placeholder')}
            />
          </form>
          <div className="w-full">
            <label htmlFor="news-category" className="sr-only">{t('news.categories.all')}</label>
            <select
              id="news-category"
              className="w-full rounded-md border border-[#e6e8ec] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              value={activeCategory}
              onChange={(e) => onCategoryChange?.(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{t(c.labelKey)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
