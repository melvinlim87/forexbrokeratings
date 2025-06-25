import { notFound } from 'next/navigation';
import { readFileSync } from 'fs';
import path from 'path';
import React from 'react';
import type { NewsItem } from '../../../src/types/news';

interface NewsPageProps {
  params: { slug: string };
}

function getNewsData(): NewsItem[] {
  // Read mock data from public/mock/news.json
  try {
    const dataPath = path.join(process.cwd(), 'public', 'mock', 'news.json');
    const file = readFileSync(dataPath, 'utf-8');
    return JSON.parse(file) as NewsItem[];
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const news = getNewsData();
  return news.map((item) => ({ slug: item.slug }));
}

export default function NewsSlugPage({ params }: NewsPageProps) {
  const news = getNewsData();
  const article = news.find((item) => item.slug === params.slug);
  if (!article) return notFound();

  return (
    <article className="prose dark:prose-invert mx-auto">
      <h1 className="mb-2 text-2xl font-bold">{article.headline}</h1>
      <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">{article.publishedAt} • {article.category}</div>
      <img
        src={'/mock/news-default.jpg'}
        alt={article.headline}
        className="rounded w-full mb-4 max-h-64 object-cover"
      />
      <div className="mb-6 text-lg leading-relaxed">{article.summary}</div>
    </article>
  );
}
