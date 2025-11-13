import React from 'react';
import type { NewsItem } from '../../types/news';
import type { News } from '@/lib/supabase';

type NewsCardItem = NewsItem | News;
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Timer } from 'lucide-react';
dayjs.extend(relativeTime);

const categoryColors: Record<string, string> = {
  Macro: 'bg-cyan-100 text-cyan-800',
  Broker: 'bg-blue-100 text-blue-800',
  'Market Alert': 'bg-yellow-100 text-yellow-800',
  Education: 'bg-green-100 text-green-800',
};

const NewsCard: React.FC<{ item: NewsCardItem }> = ({ item }) => (
  <article
    className="w-full rounded-lg border border-[#e6e8ec] bg-white shadow-sm hover:shadow-md transition-shadow duration-150 p-4 mt-2 mb-2 cursor-pointer"
    tabIndex={0}
    aria-label={item.headline}
    onClick={() => window.open(item.link, '_blank')}
  >
    <h3 className="font-semibold text-[1.05rem] leading-snug mb-1 text-[#0b1e3c] focus:underline hover:underline outline-none">
      {item.headline}
    </h3>
    <p className="text-gray-800 text-base line-clamp-3 mb-2" style={{ lineHeight: 1.55 }}>
      {item.summary}
    </p>
    <div className="flex flex-wrap gap-2 items-center text-xs mt-2 text-[#6b7280]">
      <span className="flex items-center bg-gray-100 px-2 py-0.5 rounded-full">
        <Timer className="w-4 h-4 mr-1 pt-0.5 pb-0.5" /> {dayjs(item.created_at).fromNow()}
      </span>
      <span className={`px-2 py-0.5 rounded-full font-medium ${categoryColors[item.category] || 'bg-gray-200 text-gray-700'}`}>{item.category}</span>
      <span className="bg-gray-100 px-2 py-0.5 rounded-full">{item.source}</span>
      {item.tags && item.tags.length > 0 && (
        <span className="ml-auto flex flex-wrap gap-1">
          {item.tags.map((tag) => (
            <span key={tag} className="bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </span>
      )}
    </div>
  </article>
);

export default NewsCard;
