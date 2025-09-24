"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { fetchBlogContents, BlogContents } from '@/lib/supabase';

export const revalidate = 300;

import BlogListClient from '@/components/blog/BlogListClient';

export default async function BlogPage() {
  // Fetch first page server-side for fast TTFB and caching via ISR
  const initialPosts = await fetchBlogContents(1);
  const posts = Array.isArray(initialPosts) ? initialPosts : [];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4">
        {/* Visible Breadcrumbs */}
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
          <ol className="list-reset flex">
            <li>
              <a href="/" className="hover:underline">Home</a>
            </li>
            <li className="mx-2">/</li>
            <li aria-current="page">Blog</li>
          </ol>
        </nav>
      </div>
      <BlogListClient initialPosts={posts} pageSize={9} />
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
          {/* Responsive image: full width on mobile, left side on desktop */}
          <div className="w-full md:w-2/5 relative h-48 md:h-auto min-h-[180px]">
            <Image
              src={post.images ? typeof post.images == 'string' ? JSON.parse(post.images)[0] : post.images[0] : "/assets/images/blog-default.jpg"}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover rounded-b-none md:rounded-l-xl md:rounded-b-none"
              style={{ objectFit: "cover" }}
            />
          </div>
          <CardContent className="p-4 md:p-6 w-full md:w-3/5 flex flex-col justify-between">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-4">
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
        </Card>
      </Link>
    </motion.div>
  );
}
