export const revalidate = 0;
import { Metadata } from 'next';
import React from 'react';
import Script from 'next/script';
import Image from 'next/image';
import { fetchBlogContents } from '@/lib/supabase';

function getDummyPost(slug: string) {
  const dummyPosts = [
    {
      slug: 'understanding-forex-volatility-2025',
      title: 'Understanding Forex Market Volatility in 2025',
      date: '2025-05-28',
      author: 'Sarah Johnson',
      summary: 'Learn how to navigate the increasingly volatile forex markets and identify trading opportunities.',
      content: `
        <p>The forex market in 2025 has become more volatile than ever, driven by global economic shifts, geopolitical tensions, and rapid technological advancements. Traders need to adapt to these changes to find success.</p>
        <h2>Key Drivers of Volatility</h2>
        <ul>
          <li><b>Global Events:</b> Political elections, wars, and pandemics continue to shake currency values. For example, the recent elections in the EU and ongoing trade disputes have led to sharp swings in the EUR/USD pair.</li>
          <li><b>Central Bank Policies:</b> Interest rate changes and monetary policy shifts create sharp market moves. The U.S. Federal Reserve's surprise rate hike in March 2025 triggered a 2% move in USD pairs within hours.</li>
          <li><b>Technology:</b> Algorithmic trading and high-frequency trading increase short-term price swings, making it crucial for manual traders to adapt quickly.</li>
        </ul>
        <h2>Practical Strategies for Traders</h2>
        <h3>1. Use Volatility Indicators</h3>
        <p>Indicators like Average True Range (ATR) and Bollinger Bands can help you measure and anticipate volatility. Set alerts for when volatility spikes to avoid being caught off guard.</p>
        <h3>2. Adjust Position Sizing</h3>
        <p>Reduce your lot size during periods of high volatility to limit risk. Conversely, consider scaling up when volatility is low and trends are stable.</p>
        <h3>3. Stay Informed</h3>
        <p>Follow economic calendars and news feeds. <blockquote>"The best traders are always prepared for the unexpected."</blockquote> Make it a habit to check for scheduled announcements before entering trades.</p>
        <h2>How to Trade Volatility</h2>
        <ol>
          <li>Use tight stop-losses to manage risk.</li>
          <li>Focus on major currency pairs for better liquidity.</li>
          <li>Stay updated with economic calendars and news feeds.</li>
        </ol>
        <h2>Case Study: GBP/USD in Q2 2025</h2>
        <p>During the UK general election, GBP/USD experienced a 500-pip swing in one day. Traders who used trailing stops and avoided over-leveraging were able to lock in profits and minimize losses.</p>
        <h2>Conclusion</h2>
        <p>By understanding and preparing for volatility, traders can turn risk into opportunity in the dynamic forex landscape of 2025. Stay flexible, keep learning, and always manage your risk.</p>
      `,
      tags: ['Volatility', 'Market Analysis', '2025', 'Strategy'],
      readingTime: '8 min read',
      coverImage: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Market Analysis'
    },
    {
      slug: 'top-5-technical-indicators',
      title: 'Top 5 Technical Indicators Every Forex Trader Should Know',
      date: '2025-06-02',
      author: 'Michael Chen',
      summary: 'Master these essential technical indicators to improve your trading strategy and decision-making.',
      content: `
        <p>Technical analysis is a cornerstone of successful forex trading. Here are the top 5 indicators every trader should master:</p>
        <ol>
          <li><b>Moving Average (MA):</b> Smooths price data to identify trends. <br/> <i>Tip:</i> Use both simple and exponential moving averages for better signals.</li>
          <li><b>Relative Strength Index (RSI):</b> Measures speed and change of price movements. <br/> <i>Tip:</i> Watch for RSI divergence to spot potential reversals.</li>
          <li><b>MACD:</b> Shows the relationship between two moving averages. <br/> <i>Tip:</i> MACD crossovers can signal strong momentum shifts.</li>
          <li><b>Bollinger Bands:</b> Indicates volatility and overbought/oversold conditions. <br/> <i>Tip:</i> Price touching the outer band often precedes a reversal.</li>
          <li><b>Stochastic Oscillator:</b> Compares a particular closing price to a range of its prices over time. <br/> <i>Tip:</i> Use in conjunction with RSI for more reliable signals.</li>
        </ol>
        <h2>How to Combine Indicators</h2>
        <p>Don’t rely on just one indicator. Combine two or three for confirmation. For example, use MA to identify trend direction and RSI to time your entries.</p>
        <h3>Common Mistakes to Avoid</h3>
        <ul>
          <li>Overfitting your strategy to past data.</li>
          <li>Ignoring market context (e.g., using trend indicators in a ranging market).</li>
          <li>Chasing signals without a clear plan.</li>
        </ul>
        <blockquote>"Indicators are tools, not guarantees. Always use risk management."</blockquote>
        <h2>Conclusion</h2>
        <p>Integrating these tools can help you spot trends, reversals, and optimal entry/exit points. Practice on a demo account before using real funds, and always keep learning.</p>
      `,
      tags: ['Technical Analysis', 'Indicators', 'Strategy'],
      readingTime: '6 min read',
      coverImage: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Technical Analysis'
    },
    {
      slug: 'central-bank-policies-currency-pairs',
      title: 'How Central Bank Policies Affect Currency Pairs',
      date: '2025-05-15',
      author: 'Emma Roberts',
      summary: 'Understand the relationship between monetary policy decisions and forex market movements.',
      content: `
        <p>Central banks play a pivotal role in the forex market. Their policy decisions can move currency pairs dramatically.</p>
        <h2>What Are Central Bank Policies?</h2>
        <ul>
          <li><b>Interest Rates:</b> Changes in rates affect the attractiveness of a currency.</li>
          <li><b>Quantitative Easing:</b> Central banks may inject liquidity to stimulate the economy.</li>
          <li><b>Forward Guidance:</b> Statements about future policy can shift market sentiment.</li>
        </ul>
        <h2>Impact on Major Pairs</h2>
        <p>For example, when the Federal Reserve raises rates, the USD often strengthens against other currencies. Conversely, dovish signals can lead to weakness.</p>
        <h2>Case Study: ECB Policy in 2025</h2>
        <p>In early 2025, the European Central Bank surprised markets with a new stimulus package, causing the EUR/USD to drop by 1.5% in a single day.</p>
        <h2>Trading Tips</h2>
        <ol>
          <li>Monitor central bank calendars for scheduled meetings.</li>
          <li>Read official statements and look for changes in tone.</li>
          <li>Be cautious around policy announcements—volatility can spike.</li>
        </ol>
        <blockquote>"Never underestimate the power of central banks in the forex market."</blockquote>
        <h2>Conclusion</h2>
        <p>Understanding central bank policies is essential for all forex traders. Stay informed and adjust your strategy accordingly.</p>
      `,
      tags: ['Central Banks', 'Fundamental Analysis', 'Policy'],
      readingTime: '10 min read',
      coverImage: 'https://images.pexels.com/photos/7567434/pexels-photo-7567434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Fundamental Analysis'
    },
    {
      slug: 'risk-management-strategies',
      title: 'Risk Management Strategies for Forex Traders',
      date: '2025-05-10',
      author: 'David Kim',
      summary: 'Protect your capital and maximize profits with these proven risk management techniques.',
      content: `
        <p>Risk management is the foundation of long-term trading success. Without it, even the best strategy can fail.</p>
        <h2>Why Risk Management Matters</h2>
        <ul>
          <li><b>Capital Preservation:</b> Protecting your trading capital is your top priority.</li>
          <li><b>Emotional Control:</b> A sound plan helps prevent fear and greed from taking over.</li>
          <li><b>Consistency:</b> Risk management leads to more stable trading results.</li>
        </ul>
        <h2>Top Strategies</h2>
        <ol>
          <li>Use stop-loss orders on every trade.</li>
          <li>Risk only a small percentage of your capital per trade (e.g., 1-2%).</li>
          <li>Diversify your trades and avoid over-leveraging.</li>
        </ol>
        <h2>Common Pitfalls</h2>
        <ul>
          <li>Chasing losses after a losing trade.</li>
          <li>Ignoring your trading plan during emotional swings.</li>
          <li>Overtrading in pursuit of quick gains.</li>
        </ul>
        <blockquote>"Successful traders manage risk first and profits second."</blockquote>
        <h2>Conclusion</h2>
        <p>Make risk management a non-negotiable part of your trading routine. It’s the key to survival and growth in the forex market.</p>
      `,
      tags: ['Risk Management', 'Trading Psychology', 'Strategy'],
      readingTime: '7 min read',
      coverImage: 'https://images.pexels.com/photos/4386366/pexels-photo-4386366.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Risk Management'
    },
    {
      slug: 'forex-trading-basics',
      title: 'Forex Trading Basics',
      date: '2025-06-15',
      author: 'Jane Smith',
      summary: 'A beginner’s guide to understanding the fundamentals of forex trading.',
      content: `
        <p>Forex trading involves exchanging one currency for another with the aim of making a profit. Here are the basics:</p>
        <ul>
          <li><b>What is Forex?</b> The global marketplace for currency exchange. The forex market operates 24 hours a day, five days a week, and is the most liquid market in the world.</li>
          <li><b>Major Pairs:</b> EUR/USD, GBP/USD, USD/JPY, and more. These pairs have the highest liquidity and tightest spreads.</li>
          <li><b>How to Start:</b> Choose a regulated broker, open an account, and practice with a demo. <br/> <i>Tip:</i> Never risk money you can’t afford to lose.</li>
        </ul>
        <h2>Common Forex Terms</h2>
        <ul>
          <li><b>Pip:</b> The smallest price move in a currency pair.</li>
          <li><b>Leverage:</b> Using borrowed funds to increase trade size.</li>
          <li><b>Spread:</b> The difference between the bid and ask price.</li>
        </ul>
        <h2>Getting Started Safely</h2>
        <ol>
          <li>Research brokers and check their regulatory status.</li>
          <li>Start with a demo account to build confidence.</li>
          <li>Develop a simple trading plan and stick to it.</li>
        </ol>
        <blockquote>"Education is the most powerful tool for new traders."</blockquote>
        <p>Understanding these fundamentals will set you on the right path as a new trader. Keep learning and never stop practicing.</p>
      `,
      tags: ['Beginner', 'Forex', 'Education'],
      readingTime: '4 min read',
      coverImage: 'https://images.pexels.com/photos/6801647/pexels-photo-6801647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Education'
    },
    {
      slug: 'choosing-a-forex-broker',
      title: 'Choosing a Forex Broker',
      date: '2025-06-18',
      author: 'John Lee',
      summary: 'How to select the right forex broker for your trading needs.',
      content: `
        <p>Selecting a broker is one of the most important decisions for a forex trader. Consider the following:</p>
        <ul>
          <li><b>Regulation:</b> Ensure the broker is licensed by a reputable authority. <br/> <i>Tip:</i> Check for FCA, ASIC, or CySEC licenses.</li>
          <li><b>Fees and Spreads:</b> Compare costs across brokers. <br/> <i>Tip:</i> Look beyond headline spreads—consider commissions and overnight fees.</li>
          <li><b>Platform:</b> Look for a user-friendly and reliable trading platform. <br/> <i>Tip:</i> MetaTrader 4 and 5 are popular, but some brokers offer proprietary platforms with extra features.</li>
          <li><b>Customer Support:</b> 24/7 support can be crucial in volatile markets. <br/> <i>Tip:</i> Test support response before opening a live account.</li>
        </ul>
        <h2>Red Flags to Avoid</h2>
        <ul>
          <li>Unregulated brokers or those with a history of complaints.</li>
          <li>Promises of guaranteed profits.</li>
          <li>Poor website security or lack of transparency.</li>
        </ul>
        <h2>How to Compare Brokers</h2>
        <ol>
          <li>Read reviews from trusted sources.</li>
          <li>Test platforms with a demo account.</li>
          <li>Contact support with questions.</li>
        </ol>
        <blockquote>"The best broker is the one that fits your needs and trading style."</blockquote>
        <p>Take your time to research and test brokers before committing real funds. Your choice of broker can make or break your trading career.</p>
      `,
      tags: ['Broker', 'Guide', 'Forex'],
      readingTime: '3 min read',
      coverImage: 'https://images.pexels.com/photos/6781443/pexels-photo-6781443.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Guide'
    }
  ];
  return dummyPosts.find(post => post.slug === slug) || null;
}

import { fetchBlogContentsBySlug } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  // Fetch all blog posts from Supabase
  const data = await fetchBlogContents();
  if (!data) return [];
  return data.map((item: any) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await fetchBlogContentsBySlug(params.slug);
  if (!post) return { title: 'Blog Not Found' };
  return {
    title: post.title,
    description: post.summary,
    alternates: {
      canonical: `/blog/${params.slug}`,
    },
    openGraph: {
      type: 'article',
      url: `https://forexbrokeratings.com/blog/${params.slug}`,
      title: post.title,
      description: post.summary,
      images: post.images
        ? (typeof post.images === 'string' ? JSON.parse(post.images) : post.images)
        : [],
      siteName: 'Forex Broker Ratings',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: post.images
        ? (typeof post.images === 'string' ? JSON.parse(post.images) : post.images)
        : [],
      site: '@forexbrokeratings',
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  // Fetch the blog post from Supabase by slug
  const data = await fetchBlogContentsBySlug(params.slug);
  if (!data) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Blog Not Found</h1>
        <p>The blog post you are looking for does not exist.</p>
      </main>
    );
  }

  let htmlContent = '';
  try {
    htmlContent = JSON.parse(data.content);
  } catch {
    htmlContent = data.content || '';
  }

  htmlContent = htmlContent.replaceAll('```', '')
  htmlContent = htmlContent.replace('html', '')

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      {/* JSON-LD Article structured data */}
      <Script id="blog-article-jsonld" type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: data.title,
            description: data.summary || '',
            image: data.images ? (typeof data.images === 'string' ? JSON.parse(data.images) : data.images) : [],
            datePublished: data.created_at || undefined,
            author: data.author ? [{ '@type': 'Person', name: data.author }] : undefined,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://forexbrokeratings.com/blog/${params.slug}`,
            },
          }),
        }}
      />
      {/* Visible Breadcrumbs */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-4" aria-label="Breadcrumb">
        <ol className="list-reset flex">
          <li>
            <a href="/" className="hover:underline">Home</a>
          </li>
          <li className="mx-2">/</li>
          <li>
            <a href="/blog" className="hover:underline">Blog</a>
          </li>
          <li className="mx-2">/</li>
          <li aria-current="page" className="truncate max-w-[60ch]">{data.title}</li>
        </ol>
      </nav>
      {/* Cover Image */}
      {data.images?.[0] && (
        <div className="relative w-full aspect-[1200/450] mb-6 rounded-lg overflow-hidden">
          <Image
            src={data.images ? (typeof data.images === 'string' ? JSON.parse(data.images)[0] : data.images[0]) : ''}
            alt={data.title}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
            priority
          />
        </div>
      )}
      {/* Title and Meta */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
        <h1 className="text-3xl font-bold mb-1 md:mb-0">{data.title}</h1>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between text-gray-500 mb-4 text-sm gap-2">
        <span>{data.created_at ? new Date(data.created_at).toLocaleDateString('en-GB') : ''}</span>
      </div>
      {/* Content */}
      <article className="prose prose-lg dark:prose-invert" dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </main>
  );
}
