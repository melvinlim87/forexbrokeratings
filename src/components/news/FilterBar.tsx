"use client";
import React, { useState } from 'react';

const categories = [
  'All',
  'Macro',
  'Broker',
  'Market Alert',
  'Education',
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

  return (
    <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2 pt-1 items-center mb-2">
      <div className="flex gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            aria-label={`Filter by ${cat}`}
            className={`px-4 py-1 rounded-full border text-sm font-semibold transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
              activeCategory === cat
                ? 'bg-[#00c7d4] text-black border-cyan-700'
                : 'bg-white dark:bg-slate-800 text-[#0b1e3c] dark:text-white border-[#e6e8ec] hover:bg-cyan-50 dark:hover:bg-slate-700'
            }`}
            onClick={() => onCategoryChange?.(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <form
        role="search"
        className="ml-auto flex items-center"
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
          className="border border-[#e6e8ec] rounded-full px-3 py-1 text-sm bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder="Search tags or keywords"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </form>
    </div>
  );
};

export default FilterBar;
