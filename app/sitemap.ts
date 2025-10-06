import type { MetadataRoute } from 'next';
import { fetchBlogContents, fetchAllBrokerDetails } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://forexbrokeratings.com';
  const locales = ['en', 'zh'] as const;

  const now = new Date();

  const staticPaths = [
    '/',
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
  ];

  const makeAlternates = (localized: Record<typeof locales[number], string>) => ({
    languages: {
      en: localized.en,
      zh: localized.zh,
      // You can also add 'x-default': localized.en if desired
    },
  });

  const staticRoutes: MetadataRoute.Sitemap = staticPaths.flatMap((path) => {
    const localized = {
      en: `${baseUrl}/en${path === '/' ? '/' : path}`,
      zh: `${baseUrl}/zh${path === '/' ? '/' : path}`,
    } as const;
    const alternates = makeAlternates(localized);
    const priority = path === '/' ? 1 : 0.7;
    return [
      {
        url: localized.en,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority,
        alternates,
      },
      {
        url: localized.zh,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority,
        alternates,
      },
    ];
  });

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogs = await fetchBlogContents();
    if (Array.isArray(blogs)) {
      blogRoutes = blogs
        .filter((b: any) => b?.slug)
        .flatMap((b: any) => {
          const lastModified = b.updated_at ? new Date(b.updated_at) : now;
          const localized = {
            en: `${baseUrl}/en/blog/${b.slug}`,
            zh: `${baseUrl}/zh/blog/${b.slug}`,
          } as const;
          const alternates = makeAlternates(localized);
          return [
            { url: localized.en, lastModified, changeFrequency: 'weekly' as const, priority: 0.6, alternates },
            { url: localized.zh, lastModified, changeFrequency: 'weekly' as const, priority: 0.6, alternates },
          ];
        });
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
        .flatMap((b: any) => {
          const slug = String(b.name).toLowerCase().replace(/\s+/g, '-');
          const localized = {
            en: `${baseUrl}/en/broker/${slug}`,
            zh: `${baseUrl}/zh/broker/${slug}`,
          } as const;
          const alternates = makeAlternates(localized);
          return [
            { url: localized.en, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.6, alternates },
            { url: localized.zh, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.6, alternates },
          ];
        });
    }
  } catch {
    // ignore
  }

  return [...staticRoutes, ...blogRoutes, ...brokerRoutes];
}
