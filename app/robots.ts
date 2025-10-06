import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://forexbrokeratings.com';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          // unprefixed (will redirect to /en, but disallow anyway for safety)
          '/restricted/',
          '/login',
          '/register',
          '/reset-password',
          '/forgot-password',
          // locale-prefixed restricted paths
          '/en/restricted/',
          '/en/login',
          '/en/register',
          '/en/reset-password',
          '/en/forgot-password',
          '/zh/restricted/',
          '/zh/login',
          '/zh/register',
          '/zh/reset-password',
          '/zh/forgot-password',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
