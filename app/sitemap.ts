import type { MetadataRoute } from 'next';
import { fetchBlogContents, fetchAllBrokerDetails } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://forexbrokeratings.com';

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/blog',
    '/brokers',
    '/compare',
    '/economic-calendar',
    '/ai-tools',
    '/ai-tools/trading-assistant',
    '/ai-tools/economic-calendar',
    '/ai-tools/forex-market-hours',
    '/ai-tools/market-sentiment-analyzer',
    '/contact-us',
    '/about-us',
    '/privacy-policy',
    '/guides',
  ].map((path) => ({
    url: `${baseUrl}${path === '' ? '/' : path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.7,
  }));

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogs = await fetchBlogContents();
    if (Array.isArray(blogs)) {
      blogRoutes = blogs
        .filter((b: any) => b?.slug)
        .map((b: any) => ({
          url: `${baseUrl}/blog/${b.slug}`,
          lastModified: b.updated_at ? new Date(b.updated_at) : now,
          changeFrequency: 'weekly',
          priority: 0.6,
        }));
    }
  } catch {
    // ignore
  }

  let brokerRoutes: MetadataRoute.Sitemap = [];
  try {
    const brokers = await fetchAllBrokerDetails();
    if (Array.isArray(brokers)) {
      brokerRoutes = brokers
        .filter((b: any) => b?.name)
        .map((b: any) => {
          const slug = String(b.name).toLowerCase().replace(/\s+/g, '-');
          return {
            url: `${baseUrl}/broker/${slug}`,
            lastModified: now,
            changeFrequency: 'weekly' as const,
            priority: 0.6,
          };
        });
    }
  } catch {
    // ignore
  }

  return [...staticRoutes, ...blogRoutes, ...brokerRoutes];
}
