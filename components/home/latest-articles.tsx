import Link from 'next/link';
import { ArrowRight, Calendar, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAllArticleMeta } from '@/lib/articles';

export default function LatestArticles() {
  let articles: ReturnType<typeof getAllArticleMeta> = [];
  try {
    articles = getAllArticleMeta().slice(0, 6);
  } catch {
    // Articles directory may not exist in build env
    articles = [];
  }

  if (articles.length === 0) return null;

  return (
    <section className="py-8 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Articles</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
              Expert insights, broker comparisons, and trading guides to help you make informed decisions.
            </p>
          </div>
          <Link href="/blog" className="mt-4 md:mt-0 inline-flex items-center text-blue-600 dark:text-blue-500 font-medium hover:text-blue-800 dark:hover:text-blue-400">
            View all articles <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Card key={article.slug} className="h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-5 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs">
                    <FolderOpen className="h-3 w-3 mr-1" />
                    {article.category}
                  </Badge>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    {article.date}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  <Link href={`/blog/${article.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {article.title}
                  </Link>
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 flex-1">
                  {article.excerpt}
                </p>
                <div className="mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/blog/${article.slug}`}>Read More</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
