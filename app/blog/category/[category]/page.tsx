import { Metadata } from 'next';
import Link from 'next/link';
import { articlesMeta, getArticlesByCategory, getCategories } from '@/lib/articles-meta';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight, FileText, ChevronRight } from 'lucide-react';

// Map URL slugs to display names and actual category values
const CATEGORY_MAP: Record<string, { display: string; filter: string }> = {
  'reviews': { display: 'Broker Reviews', filter: 'Broker Reviews' },
  'comparisons': { display: 'Comparisons', filter: 'Comparison' },
  'guides': { display: 'Guides & Rankings', filter: 'Rankings' },
};

const CATEGORY_SLUGS = Object.keys(CATEGORY_MAP);

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return CATEGORY_SLUGS.map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORY_MAP[category];
  if (!cat) return { title: 'Category Not Found' };
  return {
    title: `${cat.display} — Forex Broker Ratings 2026`,
    description: `${cat.display} of forex brokers for 2026. Expert analysis, honest reviews, and detailed comparisons.`,
    alternates: { canonical: `/blog/category/${category}` },
  };
}

export default async function BlogCategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = CATEGORY_MAP[category];

  if (!cat) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-6">The category "{category}" doesn't exist.</p>
          <Link href="/blog" className="text-primary hover:underline">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  const articles = getArticlesByCategory(cat.filter).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">{cat.display}</span>
        </nav>

        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            {cat.display}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {category === 'reviews' && 'In-depth, honest reviews of forex brokers. No affiliate bias — just real research.'}
            {category === 'comparisons' && 'Head-to-head broker comparisons to help you choose the right platform.'}
            {category === 'guides' && 'Expert guides and rankings to help you find the best brokers for your needs.'}
          </p>
        </div>

        {/* Category Nav */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Link href="/blog">
            <Badge variant="secondary" className="text-sm px-4 py-2 cursor-pointer hover:opacity-80">
              All Articles
            </Badge>
          </Link>
          {CATEGORY_SLUGS.map(slug => (
            <Link key={slug} href={`/blog/category/${slug}`}>
              <Badge
                variant={slug === category ? 'default' : 'secondary'}
                className="text-sm px-4 py-2 cursor-pointer hover:opacity-80"
              >
                {CATEGORY_MAP[slug].display}
              </Badge>
            </Link>
          ))}
        </div>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No articles yet</h2>
            <p className="text-muted-foreground">Check back soon for new {cat.display.toLowerCase()}.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link key={article.slug} href={`/blog/${article.slug}`}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/30">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {article.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(article.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <CardTitle className="text-lg leading-tight line-clamp-3 group-hover:text-primary">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 mt-2">
                      {article.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm font-medium text-primary">
                      Read Article <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Article Count */}
        <div className="text-center mt-12 text-muted-foreground">
          <FileText className="h-5 w-5 inline mr-2" />
          {articles.length} article{articles.length !== 1 ? 's' : ''} in {cat.display}
        </div>
      </div>
    </div>
  );
}
