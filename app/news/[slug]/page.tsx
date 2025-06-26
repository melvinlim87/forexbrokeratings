import { notFound } from 'next/navigation';
import React from 'react';
import { fetchNews, type News } from '../../../lib/supabase';

interface NewsPageProps {
  params: { slug: string };
}

// Helper to sanitize slugs for safe filenames/paths
function sanitizeSlug(slug: string) {
  // Replace invalid filename characters with '-'
  return slug.replace(/[\\/:*?"<>|]/g, '-');
}

export async function generateStaticParams() {
  const news: News[] = await fetchNews();
  return news.map((item) => ({ slug: sanitizeSlug(item.slug) })) ?? [];
}

export default async function NewsSlugPage(props: { params: { slug: string } }) {
  const news: News[] = await fetchNews();
  const article = news.find((item) => item.slug === props.params.slug);
  if (!article) return notFound();

  return (
    <article className="prose dark:prose-invert mx-auto">
      <h1 className="mb-2 text-2xl font-bold">{article.headline}</h1>
      <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">{article.created_at} • {article.category}</div>
      <img
        src={'/mock/news-default.jpg'}
        alt={article.headline}
        className="rounded w-full mb-4 max-h-64 object-cover"
      />
      <div className="mb-6 text-lg leading-relaxed">{article.summary}</div>
    </article>
  );
}
