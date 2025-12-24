
import { fetchBlogContents } from '@/lib/supabase';
import BlogListClient from '@/components/blog/BlogListClient';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const initialPosts = await fetchBlogContents(1);
  const posts = Array.isArray(initialPosts) ? initialPosts : [];

  return (
    <div className="min-h-screen bg-transparent">
      <BlogListClient initialPosts={posts} pageSize={9} />
    </div>
  );
}