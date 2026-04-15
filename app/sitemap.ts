import { MetadataRoute } from 'next';
import * as fs from 'fs';
import * as path from 'path';
import { brokers } from '@/lib/brokers';
import { getArticleSlugs } from '@/lib/articles';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://forexbrokeratings.com';
const now = new Date();

/* ------------------------------------------------------------------ */
/* Helpers — read preview-hero generated JSON slugs at build time      */
/* ------------------------------------------------------------------ */

function getBrokerRichSlugs(): string[] {
  try {
    const dir = path.join(process.cwd(), 'app', 'preview-hero', '_data', 'generated', 'brokers-rich');
    return fs.readdirSync(dir)
      .filter(f => f.endsWith('.json'))
      .map(f => f.replace('.json', ''));
  } catch {
    return [];
  }
}

function getPropFirmRichSlugs(): string[] {
  try {
    const dir = path.join(process.cwd(), 'app', 'preview-hero', '_data', 'generated', 'prop-firms-rich');
    return fs.readdirSync(dir)
      .filter(f => f.endsWith('.json'))
      .map(f => f.replace('.json', ''));
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* Sitemap                                                              */
/* ------------------------------------------------------------------ */

export default function sitemap(): MetadataRoute.Sitemap {

  /* ---- New review pages (preview-hero) — the canonical SEO targets ---- */
  const brokerRichSlugs = getBrokerRichSlugs();
  const propFirmRichSlugs = getPropFirmRichSlugs();

  const newBrokerPages: MetadataRoute.Sitemap = brokerRichSlugs.map(slug => ({
    url: `${BASE_URL}/brokers/${slug}/`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const newPropFirmPages: MetadataRoute.Sitemap = propFirmRichSlugs.map(slug => ({
    url: `${BASE_URL}/firms/${slug}/`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  /* ---- Legacy dossier pages (old design, still indexed for now) ---- */
  const legacyBrokerPages: MetadataRoute.Sitemap = brokers.map(broker => ({
    url: `${BASE_URL}/${broker.type === 'prop-firm' ? 'prop-firm' : 'broker'}/${broker.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  /* ---- Blog articles ---- */
  let articleSlugs: string[] = [];
  try { articleSlugs = getArticleSlugs(); } catch { /* ok */ }
  const blogPages: MetadataRoute.Sitemap = articleSlugs.map(slug => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  /* ---- Category pages ---- */
  const categorySlugs = ['ecn', 'mt4', 'low-spread', 'us-friendly', 'fca-regulated', 'copy-trading', 'zero-deposit', 'ctrader'];
  const categoryPages: MetadataRoute.Sitemap = categorySlugs.map(slug => ({
    url: `${BASE_URL}/category/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  /* ---- Blog category pages ---- */
  const blogCategoryPages: MetadataRoute.Sitemap = ['reviews', 'comparisons', 'guides'].map(slug => ({
    url: `${BASE_URL}/blog/category/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  /* ---- Static pages ---- */
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                               lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE_URL}/brokers`,                  lastModified: now, changeFrequency: 'daily',   priority: 0.95 },
    { url: `${BASE_URL}/firms`,                    lastModified: now, changeFrequency: 'daily',   priority: 0.95 },
    { url: `${BASE_URL}/compare`,                  lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/top-10`,                   lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/rankings`,                 lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/methodology`,              lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/blog`,                     lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE_URL}/rebates`,                  lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/scam-check`,               lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/singapore`,                lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];

  return [
    ...staticPages,
    ...newBrokerPages,      // 536 broker review pages — highest priority
    ...newPropFirmPages,    // 139 prop firm review pages
    ...legacyBrokerPages,
    ...blogPages,
    ...categoryPages,
    ...blogCategoryPages,
  ];
}
