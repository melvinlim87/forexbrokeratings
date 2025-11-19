export const revalidate = 0;
import { notFound } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import { fetchNews, type News } from '../../../lib/supabase';
import { ChevronLeft } from 'lucide-react';
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
  
  const date = new Date(article?.created_at ?? '');
  const year = date.getFullYear();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const formatted = `${year}-${day}-${month} ${hours}:${minutes}:${seconds}`;
  if (!article) return notFound();

  return (
    <article className="prose mx-auto">
      <Link href="/news" className="mb-4 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 no-underline">
        <ChevronLeft className="w-4 h-4" />
        <span>Back to News</span>
      </Link>
      <h1 className="mb-2 text-3xl font-bold">{article.headline}</h1>
      <div className="mb-4 text-sm text-gray-500">{formatted} • {article.category}</div>
      {/* <img
        src={'/mock/news-default.jpg'}
        alt={article.headline}
        className="rounded w-full mb-4 max-h-64 object-cover"
      /> */}
      {article?.content != null && article?.content.length > 0 ? (
        <div className="mb-6 text-lg leading-relaxed">
          {article?.content?.map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>
      ) : (
      <div className="mb-6 text-lg leading-relaxed">{article.summary}</div> 
      )}
    </article>
  );
}
