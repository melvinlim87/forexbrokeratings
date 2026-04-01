import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingDown, GraduationCap, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Best Forex Brokers 2026 | Expert Rankings by Category',
  description: 'Our expert-ranked lists of the best forex brokers in 2026. Find top ECN brokers, lowest spreads, and beginner-friendly platforms.',
};

const categories = [
  {
    title: 'Best ECN Brokers',
    href: '/best/ecn-brokers',
    icon: Zap,
    color: 'blue',
    description: 'Direct market access brokers with raw spreads from 0.0 pips, no dealing desk, and institutional-grade execution.',
    highlights: ['Raw spreads from 0.0 pips', 'No dealing desk', 'Fast execution (<100ms)'],
  },
  {
    title: 'Lowest Spread Brokers',
    href: '/best/low-spread-brokers',
    icon: TrendingDown,
    color: 'green',
    description: 'Forex brokers offering the tightest EUR/USD spreads and lowest total trading costs for active traders.',
    highlights: ['Spreads from 0.02 pips', 'Low commissions', 'Cost-effective for scalpers'],
  },
  {
    title: 'Best Brokers for Beginners',
    href: '/best/beginner-brokers',
    icon: GraduationCap,
    color: 'purple',
    description: 'Beginner-friendly brokers with low minimum deposits, demo accounts, educational resources, and easy platforms.',
    highlights: ['Low deposits from $1', 'Demo accounts', 'Educational resources'],
  },
];

const colorMap: Record<string, { bg: string; text: string; ring: string; badge: string; iconBg: string }> = {
  blue: { bg: 'bg-blue-50 dark:bg-blue-900/10', text: 'text-blue-600 dark:text-blue-400', ring: 'hover:ring-blue-200 dark:hover:ring-blue-800', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', iconBg: 'bg-blue-100 dark:bg-blue-900/30' },
  green: { bg: 'bg-green-50 dark:bg-green-900/10', text: 'text-green-600 dark:text-green-400', ring: 'hover:ring-green-200 dark:hover:ring-green-800', badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', iconBg: 'bg-green-100 dark:bg-green-900/30' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-900/10', text: 'text-purple-600 dark:text-purple-400', ring: 'hover:ring-purple-200 dark:hover:ring-purple-800', badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', iconBg: 'bg-purple-100 dark:bg-purple-900/30' },
};

export default function BestBrokersPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <Badge variant="outline" className="mb-3">Expert Ranked — Updated March 2026</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Best Forex Brokers 2026
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Our expert team tests, analyzes, and ranks forex brokers across key categories. 
            Find the best broker for your trading style below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const colors = colorMap[cat.color];
            const Icon = cat.icon;
            return (
              <Link key={cat.href} href={cat.href}>
                <Card className={`h-full hover:shadow-xl transition-all duration-300 hover:ring-2 ${colors.ring} cursor-pointer group`}>
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center mb-4`}>
                      <Icon className={`h-6 w-6 ${colors.text}`} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {cat.title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {cat.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {cat.highlights.map((h) => (
                        <span key={h} className={`text-xs px-2 py-1 rounded-full ${colors.badge}`}>
                          {h}
                        </span>
                      ))}
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-medium ${colors.text} group-hover:gap-2 transition-all`}>
                      View Rankings <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
