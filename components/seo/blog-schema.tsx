interface BlogSchemaProps {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  category: string;
  image?: string;
}

export default function BlogSchema({ title, excerpt, date, slug, category, image }: BlogSchemaProps) {
  const baseUrl = 'https://forexbrokeratings.netlify.app';
  const url = `${baseUrl}/blog/${slug}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: excerpt,
    url,
    datePublished: date,
    dateModified: date,
    author: {
      '@type': 'Organization',
      name: 'ForexBrokerRatings',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ForexBrokerRatings',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(image && {
      image: {
        '@type': 'ImageObject',
        url: image.startsWith('http') ? image : `${baseUrl}${image}`,
      },
    }),
    articleSection: category,
    inLanguage: 'en',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${baseUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: url,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
