export type NewsCategory = 'Macro' | 'Broker' | 'Market Alert' | 'Education';

export interface NewsItem {
  id: string;
  slug: string; // URL-friendly unique identifier
  headline: string; // ≤110 chars
  summary: string;  // ≤170 chars
  category: NewsCategory;
  publishedAt: string; // ISO 8601
  source: string;
  tags: string[];
}
