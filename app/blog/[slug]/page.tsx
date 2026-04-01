import { notFound } from 'next/navigation';
import { getArticleBySlug, getArticleSlugs } from '@/lib/articles';
import { getRelatedArticles, articlesMeta } from '@/lib/articles-meta';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, ArrowLeft, BookOpen, ArrowRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SidebarTopBrokers from '@/components/widgets/sidebar-top-brokers';
import BlogSchema from '@/components/seo/blog-schema';
import Breadcrumbs from '@/components/breadcrumbs';

interface ArticlePageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ArticlePageProps) {
  try {
    const article = await getArticleBySlug(params.slug);
    return {
      title: `${article.title} — ForexBrokerRatings`,
      description: article.excerpt,
      alternates: {
        canonical: `/blog/${params.slug}`,
      },
    };
  } catch {
    return { title: 'Article Not Found' };
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  let article;
  try {
    article = await getArticleBySlug(params.slug);
  } catch {
    notFound();
  }

  const related = getRelatedArticles(params.slug, article.category);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <BlogSchema
        title={article.title}
        excerpt={article.excerpt}
        date={article.date}
        slug={article.slug}
        category={article.category}
      />
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Breadcrumbs for SEO + navigation */}
        <Breadcrumbs items={[
          { label: 'Blog', href: '/blog' },
          { label: article.category, href: `/blog/category/${article.category.toLowerCase().replace(/\s+/g, '-')}` },
          { label: article.title },
        ]} />

        {/* Article Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary">{article.category}</Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(article.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            {article.title}
          </h1>
          <p className="text-lg text-muted-foreground">{article.excerpt}</p>
        </header>

        {/* Divider */}
        <div className="border-t border-border mb-10" />

        {/* Article Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none
          prose-headings:font-bold prose-headings:tracking-tight
          prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
          prose-h2:mt-10 prose-h3:mt-8
          prose-p:leading-relaxed prose-p:text-foreground/90
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-strong:text-foreground
          prose-table:text-sm
          prose-img:rounded-lg
          prose-code:text-sm prose-code:bg-muted prose-code:px-1 prose-code:rounded
          prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-4
        ">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground border-b border-border pb-2">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold mt-8 mb-3 text-foreground">{children}</h3>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-6">
                  <table className="w-full border-collapse border border-border rounded-lg">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-muted/50">{children}</thead>
              ),
              th: ({ children }) => (
                <th className="border border-border px-4 py-3 text-left font-semibold text-sm">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-border px-4 py-3 text-sm">{children}</td>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 space-y-2 my-4">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 space-y-2 my-4">{children}</ol>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary pl-4 my-6 italic text-muted-foreground">
                  {children}
                </blockquote>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-foreground">{children}</strong>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {children}
                </a>
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        {/* FAQ Section — for SEO rich snippets */}
        <section className="mt-16" id="faq">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span>❓</span> Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: `Is ${article.title.split(' ')[0]} a regulated broker?`,
                a: 'Yes. We verify regulatory status directly with each regulator before including brokers in our reviews. Check the full review for specific license numbers and jurisdictions.',
              },
              {
                q: 'How accurate are these forex broker reviews?',
                a: 'Our reviews are based on 200+ data points per broker, verified against regulatory databases, live trading tests, and aggregated user reviews from TrustPilot and Forex Peace Army. We update ratings quarterly.',
              },
              {
                q: 'Do you earn commissions from broker referrals?',
                a: 'Yes, we may earn affiliate commissions when you open an account through our links. However, our editorial team maintains full independence — affiliate relationships never influence our ratings or recommendations.',
              },
            ].map((faq, i) => (
              <details key={i} className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <summary className="flex items-center justify-between cursor-pointer p-5 font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  {faq.q}
                  <ChevronRight className="h-4 w-4 text-gray-400 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
          {/* FAQ JSON-LD */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: [
                  {
                    '@type': 'Question',
                    name: `Is ${article.title.split(' ')[0]} a regulated broker?`,
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Yes. We verify regulatory status directly with each regulator before including brokers in our reviews. Check the full review for specific license numbers and jurisdictions.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How accurate are these forex broker reviews?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Our reviews are based on 200+ data points per broker, verified against regulatory databases, live trading tests, and aggregated user reviews from TrustPilot and Forex Peace Army. We update ratings quarterly.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'Do you earn commissions from broker referrals?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Yes, we may earn affiliate commissions when you open an account through our links. However, our editorial team maintains full independence — affiliate relationships never influence our ratings or recommendations.',
                    },
                  },
                ],
              }),
            }}
          />
        </section>

        {/* Related Articles */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {related.map((relatedArticle) => (
              <Link key={relatedArticle.slug} href={`/blog/${relatedArticle.slug}`}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/30">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {relatedArticle.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-base leading-tight line-clamp-3">
                      {relatedArticle.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-2 text-sm">
                      {relatedArticle.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm font-medium text-primary">
                      Read Review <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar: Top Brokers */}
        <div className="mt-12">
          <SidebarTopBrokers />
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 p-8 bg-muted/50 rounded-xl text-center border border-border/50">
          <BookOpen className="h-8 w-8 mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-bold mb-2">Want more broker insights?</h3>
          <p className="text-muted-foreground mb-4">
            Explore all our honest reviews and comparisons.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-6 py-3 font-medium hover:opacity-90 transition-opacity"
          >
            Browse All Articles
          </Link>
        </div>
      </article>
    </div>
  );
}
