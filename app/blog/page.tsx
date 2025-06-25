"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { fetchBlogContents, BlogContents } from '@/lib/supabase';

// ...other imports remain unchanged

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  // Category filtering is disabled for now since API does not provide category
  // const [selectedCategory, setSelectedCategory] = useState('all');
  const [blogs, setBlogs] = useState<BlogContents[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        setLoading(true);
        const data = await fetchBlogContents();
        setBlogs(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || 'Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };
    getBlogs();
  }, []);

  // Filter by search query (title/content)
  const filteredPosts = blogs.filter(post => {
    const q = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(q) ||
      (post.content && post.content.toLowerCase().includes(q))
    );
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <input
          type="text"
          placeholder="Search blog posts..."
          className="w-full md:w-1/3 px-4 py-2 border rounded"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>
      {loading && <div className="py-16 text-center text-gray-500">Loading...</div>}
      {error && <div className="py-16 text-center text-red-500">{error}</div>}
      {!loading && !error && filteredPosts.length === 0 && (
        <div className="py-16 text-center text-gray-500">No blog posts found.</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post, idx) => (
          <BlogPostCard key={post.id} post={post} index={idx} />
        ))}
      </div>
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
        <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300">
          <div className="flex flex-col md:flex-row h-full">
            <div className="md:w-2/5 relative h-60 md:h-auto">
              <Image
                src={post.images ? typeof post.images == 'string' ? JSON.parse(post.images)[0] : post.images[0] : "/assets/images/blog-default.jpg"}
                alt={post.title}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <CardContent className="p-6 md:w-3/5 flex flex-col">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {post.title}
              </h3>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="mr-4">{post.created_at ? new Date(post.created_at).toLocaleDateString('en-GB') : ''}</span>
              </div>
              <div className="flex items-center text-blue-600 dark:text-blue-500 font-medium">
                Read article <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
