'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { fetchBlogContents, BlogContents } from '@/lib/supabase';
import { useI18n } from '@/lib/i18n-client';
import T from '@/components/common/T';

interface BlogListClientProps {
  initialPosts: BlogContents[];
  pageSize?: number;
}

export default function BlogListClient({ initialPosts, pageSize = 9 }: BlogListClientProps) {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [blogs, setBlogs] = useState<BlogContents[]>(initialPosts || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState((initialPosts || []).length === pageSize);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return blogs.filter(post =>
      post.title.toLowerCase().includes(q) || (post.content && post.content.toLowerCase().includes(q))
    );
  }, [blogs, searchQuery]);

  const handleLoadMore = async () => {
    try {
      setLoading(true);
      const nextPage = page + 1;
      const data = await fetchBlogContents(nextPage);
      if (Array.isArray(data) && data.length > 0) {
        setBlogs(prev => [...prev, ...data]);
        setPage(nextPage);
        setHasMore(data.length === pageSize);
      } else {
        setHasMore(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load more blogs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pb-12">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <input
          type="text"
          placeholder={t('blog.search_placeholder')}
          className="w-full px-4 py-2 border rounded"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {error && <div className="py-8 text-center text-red-500">{error}</div>}

      {!error && filteredPosts.length === 0 && (
        <div className="py-16 text-center text-gray-500"><T k="blog.no_results" /></div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post, idx) => (
          <BlogPostCard key={`${post.id}-${idx}`} post={post} index={idx} />
        ))}
      </div>

      {!loading && hasMore && filteredPosts.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? t('blog.loading') : t('blog.load_more')}
          </button>
        </div>
      )}
    </div>
  );
}

function BlogPostCard({ post, index }: { post: BlogContents; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
    >
      <Link href={`/blog/${post.slug}`}>
        <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row">
          <div className="w-full md:w-2/5 relative h-48 md:h-auto min-h-[180px]">
            <Image
              src={post.images ? (typeof post.images == 'string' ? JSON.parse(post.images)[0] : post.images[0]) : '/assets/images/blog-default.jpg'}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover rounded-b-none md:rounded-l-xl md:rounded-b-none"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <CardContent className="p-4 md:p-6 w-full md:w-3/5 flex flex-col justify-between">
            <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-4">
              {post.title}
            </h3>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="mr-4">{post.date ? new Date(post.date).toLocaleDateString('en-GB') : ''}</span>
            </div>
            <div className="flex items-center text-blue-600 font-medium">
              <T k="blog.read_article" /> <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
