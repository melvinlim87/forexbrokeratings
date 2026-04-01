export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  content: string;
}

function slugify(filename: string): string {
  return filename.replace(/\.md$/, '');
}

function extractExcerpt(content: string): string {
  // 1. Try YAML frontmatter description field
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const yaml = frontmatterMatch[1];
    const descMatch = yaml.match(/^description:\s*["'](.+?)["']/m);
    if (descMatch) return descMatch[1].trim();
  }

  // 2. Try inline Meta Description bold pattern (old format)
  const metaMatch = content.match(/\*\*Meta Description:\*\*\s*(.+?)(?:\n|$)/);
  if (metaMatch) return metaMatch[1].trim();

  // 3. Fallback: get the first paragraph after the title/frontmatter
  const bodyContent = frontmatterMatch
    ? content.slice(frontmatterMatch[0].length)
    : content;
  const lines = bodyContent.split('\n').filter(l => l.trim());
  for (const line of lines) {
    if (line.startsWith('#')) continue;
    if (line.startsWith('---')) continue;
    if (line.startsWith('**')) continue;
    if (line.startsWith('>')) continue;
    if (line.trim().length > 30) return line.trim().slice(0, 200) + '...';
  }
  return 'Expert forex broker analysis and review.';
}

function extractTitle(content: string, fallback: string): string {
  const match = content.match(/^#\s+(.+?)(?:\n|$)/);
  if (match) return match[1].trim();
  return fallback.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function categorize(slug: string): string {
  if (slug.includes('-vs-') || slug.includes('-comparison')) return 'Comparison';
  if (slug.includes('best-forex-brokers')) return 'Rankings';
  return 'Broker Reviews';
}

import fs from 'fs';
import path from 'path';

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');

// Get all article slugs from the articles directory
export function getArticleSlugs(): string[] {
  try {
    const files = fs.readdirSync(ARTICLES_DIR);
    return files
      .filter(f => f.endsWith('.md'))
      .map(f => f.replace(/\.md$/, ''));
  } catch {
    return [];
  }
}

export function getArticleMeta(slug: string): Omit<Article, 'content'> {
  const slugClean = slug.replace(/\.md$/, '');
  const filename = `${slugClean}.md`;
  const filePath = path.join(ARTICLES_DIR, filename);
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return {
      slug: slugClean,
      title: extractTitle(content, slugClean),
      excerpt: extractExcerpt(content),
      date: '2026-03-28',
      category: categorize(slugClean),
    };
  } catch {
    return {
      slug: slugClean,
      title: slugClean.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      excerpt: 'Expert forex broker analysis and review.',
      date: '2026-03-28',
      category: categorize(slugClean),
    };
  }
}

export function getAllArticleMeta(): Omit<Article, 'content'>[] {
  return getArticleSlugs().map(slug => getArticleMeta(slug));
}

export async function getArticleBySlug(slug: string): Promise<Article> {
  const filename = `${slug}.md`;
  const filePath = path.join(ARTICLES_DIR, filename);
  
  const content = fs.readFileSync(filePath, 'utf-8');
  
  return {
    slug,
    title: extractTitle(content, slug),
    excerpt: extractExcerpt(content),
    date: '2026-03-28',
    category: categorize(slug),
    content,
  };
}
