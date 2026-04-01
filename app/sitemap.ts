import { MetadataRoute } from 'next'
import { brokers } from '@/lib/brokers'
import { getArticleSlugs } from '@/lib/articles'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://forexbrokeratings.netlify.app'
  const now = new Date()

  // Broker pages from actual broker data with lastmod
  const brokerPages = brokers.map(broker => ({
    url: `${baseUrl}/broker/${broker.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: broker.rating >= 8 ? 0.9 : 0.8,
  }))

  // Blog article pages
  let articleSlugs: string[] = []
  try {
    articleSlugs = getArticleSlugs()
  } catch {
    // articles dir may not exist
  }
  const blogPages = articleSlugs.map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Category pages
  const categorySlugs = ['ecn', 'mt4', 'low-spread', 'us-friendly', 'fca-regulated', 'copy-trading', 'zero-deposit', 'ctrader']
  const categoryPages: MetadataRoute.Sitemap = categorySlugs.map(slug => ({
    url: `${baseUrl}/category/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/brokers`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/compare`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/compare-tool`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/top-10`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/rankings`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/methodology`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/singapore`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]

  // Blog category pages
  const blogCategorySlugs = ['reviews', 'comparisons', 'guides']
  const blogCategoryPages: MetadataRoute.Sitemap = blogCategorySlugs.map(slug => ({
    url: `${baseUrl}/blog/category/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    ...staticPages,
    ...brokerPages,
    ...blogPages,
    ...categoryPages,
    ...blogCategoryPages,
  ]
}
