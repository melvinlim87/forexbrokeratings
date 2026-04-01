'use client';

import { useState } from 'react';
import Link from 'next/link';
import { articlesMeta, getCategories, getArticlesByCategory } from '@/lib/articles-meta';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, ArrowRight } from 'lucide-react';

export default function BlogPage() {
  const categories = getCategories();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered = getArticlesByCategory(selectedCategory);
  // Sort by date descending
  filtered.sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Broker Reviews & Insights
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Honest, in-depth analysis of forex brokers. No affiliate bias — just real research to help you trade smarter.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'secondary'}
              className="text-sm px-4 py-2 cursor-pointer hover:opacity-80"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((article) => (
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
                    Read Review <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Article Count */}
        <div className="text-center mt-12 text-muted-foreground">
          <FileText className="h-5 w-5 inline mr-2" />
          {filtered.length} article{filtered.length !== 1 ? 's' : ''} {selectedCategory !== 'All' ? `in ${selectedCategory}` : 'published'}
        </div>
      </div>
    </div>
  );
}
