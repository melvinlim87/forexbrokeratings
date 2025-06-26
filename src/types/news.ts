export type NewsCategory = 'Macro' | 'Broker' | 'Market Alert' | 'Education';

// NewsItem is now compatible with News type from Supabase
export interface NewsItem {
  id: string;
  slug: string; // URL-friendly unique identifier
  headline: string; // ≤110 chars
  summary: string;  // ≤170 chars
  category: string; // matches Supabase News
  created_at: string; // ISO 8601
  source: string;
  tags: string[];
}
