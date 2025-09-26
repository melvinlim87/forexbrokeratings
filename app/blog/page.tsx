
import { fetchBlogContents } from '@/lib/supabase';
import BlogListClient from '@/components/blog/BlogListClient';

export const revalidate = 300;

export default async function BlogPage() {
  const initialPosts = await fetchBlogContents(1);
  const posts = Array.isArray(initialPosts) ? initialPosts : [];

  return (
    <div className="min-h-screen">
      <BlogListClient initialPosts={posts} pageSize={9} />
    </div>
  );
}