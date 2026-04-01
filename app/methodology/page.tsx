import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Search, Calculator, Users, Award, TrendingUp, CheckCircle2, AlertTriangle, BookOpen, FlaskConical, BarChart3, Target, Scale, Zap, FileCheck, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SITE_URL = 'https://forexbrokeratings.netlify.app';

export const metadata: Metadata = {
  title: 'How We Test & Rate Forex Brokers — Our Methodology | Forex Broker Ratings',
  description: 'Learn how ForexBrokerRatings tests and scores forex brokers. Our transparent methodology covers regulation, fees, platforms, and user experience across 200+ data points.',
  alternates: {
    canonical: `${SITE_URL}/methodology`,
  },
};

const SCORING_CATEGORIES = [
  {
    icon: Shield,
    name: 'Regulation & Safety',
    weight: '25%',
    weightValue: 25,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    description: 'The foundation of our scoring. We verify every broker\'s regulatory status directly with the issuing authority.',
    criteria: [
      'Tier-1 regulation (FCA, ASIC, CFTC/NFA, CySEC, MAS, IIROC, BaFin)',
      'Tier-2 regulation (DFSA, CMA, FSCA, FSA Japan)',
      'Client fund segregation in segregated bank accounts',
      'Investor compensation scheme membership (FSCS, ICF)',
      'Negative balance protection for retail clients',
      'Regular third-party audits and financial reporting',
      'Regulatory history — no major sanctions or fines',
    ],
  },
  {
    icon: Calculator,
    name: 'Fees & Trading Costs',
    weight: '25%',
    weightValue: 25,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    description: 'We calculate real-world trading costs using live spread data, not just advertised minimums.',
    criteria: [
      'Average EUR/USD spread on standard accounts',
      'Raw/ECN spread + commission per round turn',
      'Commission structure transparency',
      'Swap/overnight financing rates',
      'Deposit and withdrawal fees',
      'Inactivity fees and account maintenance costs',
      'Currency conversion spreads',
    ],
  },
  {
    icon: BarChart3,
    name: 'Platform & Technology',
    weight: '20%',
    weightValue: 20,
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-50 dark:bg-violet-900/20',
    borderColor: 'border-violet-200 dark:border-violet-800',
    description: 'We test every platform and tool offered — desktop, web, and mobile — on real trading accounts.',
    criteria: [
      'Platform variety (MT4, MT5, cTrader, TradingView, proprietary)',
      'Mobile app quality and feature parity with desktop',
      'Charting tools and technical analysis depth',
      'Order types available (market, limit, stop, trailing)',
      'Execution speed and slippage rates',
      'API trading support (FIX, REST)',
      'One-click trading and automation capabilities',
    ],
  },
  {
    icon: Target,
    name: 'Instruments & Markets',
    weight: '15%',
    weightValue: 15,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    borderColor: 'border-amber-200 dark:border-amber-800',
    description: 'Breadth and depth of tradeable instruments matters for portfolio diversification.',
    criteria: [
      'Number of forex pairs (majors, minors, exotics)',
      'CFD availability (indices, commodities, stocks, crypto)',
      'Real stock and ETF availability',
      'Cryptocurrency CFDs and spot trading',
      'Futures and options availability',
      'Fractional share trading',
      'Bonds and fixed income instruments',
    ],
  },
  {
    icon: Users,
    name: 'User Experience',
    weight: '10%',
    weightValue: 10,
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    borderColor: 'border-pink-200 dark:border-pink-800',
    description: 'How easy is it to open an account, deposit, trade, and withdraw? We test the full lifecycle.',
    criteria: [
      'Account opening speed and KYC process',
      'Deposit method variety and processing speed',
      'Withdrawal processing time and reliability',
      'Customer support responsiveness (live chat, email, phone)',
      'Educational resources (webinars, courses, guides)',
      'Research tools and market analysis',
      'Multi-language support availability',
    ],
  },
  {
    icon: Award,
    name: 'Reputation & Reviews',
    weight: '5%',
    weightValue: 5,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-200 dark:border-orange-800',
    description: 'Real trader feedback from multiple independent sources — not just testimonials on the broker\'s website.',
    criteria: [
      'TrustPilot score and review volume',
      'Forex Peace Army rating',
      'Reddit and forum sentiment analysis',
      'App Store and Google Play ratings',
      'Complaint resolution rate',
      'Industry awards and recognition',
    ],
  },
];

const REGULATOR_TIERS = [
  {
    tier: 'Tier 1',
    label: 'Highest Trust',
    color: 'bg-emerald-500',
    textColor: 'text-emerald-700 dark:text-emerald-400',
    description: 'Strictest regulatory standards. Client funds protected by compensation schemes. Regular audits required.',
    regulators: ['FCA (UK)', 'ASIC (Australia)', 'CFTC/NFA (USA)', 'MAS (Singapore)', 'IIROC (Canada)', 'BaFin (Germany)', 'JFSA (Japan)'],
  },
  {
    tier: 'Tier 2',
    label: 'Strong Regulation',
    color: 'bg-blue-500',
    textColor: 'text-blue-700 dark:text-blue-400',
    description: 'Solid regulatory frameworks with meaningful client protections, though less stringent than Tier 1.',
    regulators: ['CySEC (Cyprus)', 'DFSA (Dubai)', 'FSCA (South Africa)', 'CMA (Kenya)', 'FSA (Japan)', 'SFC (Hong Kong)'],
  },
  {
    tier: 'Tier 3',
    label: 'Moderate Regulation',
    color: 'bg-amber-500',
    textColor: 'text-amber-700 dark:text-amber-400',
    description: 'Basic regulatory oversight. Limited client protection compared to higher tiers.',
    regulators: ['FSC (Mauritius)', 'FSC (Belize)', 'IFSC (Belize)', 'SVG FSA', 'VFSC (Vanuatu)'],
  },
  {
    tier: 'Tier 4–5',
    label: 'Minimal Oversight',
    color: 'bg-red-500',
    textColor: 'text-red-700 dark:text-red-400',
    description: 'Little to no regulatory oversight. Traders should exercise extreme caution with these jurisdictions.',
    regulators: ['Offshore/unregulated entities', 'No client fund protection', 'No compensation scheme'],
  },
];

const PROCESS_STEPS = [
  {
    step: 1,
    title: 'Account Opening',
    description: 'We open real trading accounts with each broker, completing the full KYC process just like any trader would.',
    icon: FileCheck,
  },
  {
    step: 2,
    title: 'Data Collection',
    description: 'Our team collects 200+ data points per broker: spreads, fees, platform features, regulation details, and more.',
    icon: Search,
  },
  {
    step: 3,
    title: 'Live Trading',
    description: 'We trade on real accounts to test execution speed, slippage, platform stability, and order processing.',
    icon: Zap,
  },
  {
    step: 4,
    title: 'Cost Analysis',
    description: 'We calculate actual trading costs across multiple scenarios: scalping, swing trading, and long-term positions.',
    icon: Calculator,
  },
  {
    step: 5,
    title: 'Support Testing',
    description: 'We contact customer support via live chat, email, and phone to test response times and quality.',
    icon: Eye,
  },
  {
    step: 6,
    title: 'Scoring & Ranking',
    description: 'Data is fed into our proprietary scoring algorithm. Scores are reviewed by our editorial team before publication.',
    icon: Scale,
  },
];

export default function MethodologyPage() {
  // JSON-LD: BreadcrumbList
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'How We Test', item: `${SITE_URL}/methodology` },
    ],
  };

  // JSON-LD: AboutPage
  const aboutJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'How We Test & Rate Forex Brokers',
    description: 'Our transparent methodology for testing and scoring forex brokers across 200+ data points.',
    url: `${SITE_URL}/methodology`,
    mainEntity: {
      '@type': 'Organization',
      name: 'ForexBrokerRatings',
      description: 'Independent forex broker review platform',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <FlaskConical className="h-4 w-4" />
            Editorial Methodology
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How We Test & Rate Forex Brokers
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Our ratings are built on verified data, real trading experience, and rigorous analysis. 
            We evaluate each broker across 200+ data points and 6 scoring categories to produce 
            unbiased, data-driven rankings you can trust.
          </p>
        </div>

        {/* Our Promise */}
        <Card className="mb-12 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Our Editorial Promise</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Since our founding, we've maintained complete editorial independence. We may earn affiliate commissions 
                  when you open an account through our links, but this <strong className="text-gray-900 dark:text-white">never</strong> influences 
                  our scores, rankings, or recommendations. Our scoring methodology is transparent, data-driven, and 
                  applied consistently across all brokers.
                </p>
                <div className="flex flex-wrap gap-3">
                  {['No Paid Placements', 'Independent Reviews', 'Data-Driven Scores', 'Quarterly Updates'].map((badge) => (
                    <span key={badge} className="flex items-center gap-1.5 text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-full px-3 py-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How We Score */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Our Scoring System</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Each broker is scored across 6 weighted categories. The weighted average produces a final score out of 10.
          </p>

          {/* Weight visualization */}
          <div className="flex rounded-xl overflow-hidden h-4 mb-8 bg-gray-200 dark:bg-gray-800">
            {SCORING_CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className={`${cat.bgColor} border-r border-white dark:border-gray-900 last:border-r-0 relative group`}
                style={{ width: `${cat.weightValue}%` }}
                title={`${cat.name}: ${cat.weight}`}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {cat.name} ({cat.weight})
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-4">
            {SCORING_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Card key={cat.name} className={`${cat.borderColor}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 ${cat.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`h-5 w-5 ${cat.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{cat.name}</h3>
                          <Badge variant="outline" className={`${cat.color} border-current text-xs`}>{cat.weight} weight</Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{cat.description}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {cat.criteria.map((c, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                              <CheckCircle2 className={`h-3 w-3 mt-0.5 flex-shrink-0 ${cat.color}`} />
                              <span>{c}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Regulation Tiers */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Regulation Tier System</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We classify regulatory bodies into tiers based on the strength of client protections, 
            enforcement history, and compensation schemes available.
          </p>

          <div className="grid gap-4">
            {REGULATOR_TIERS.map((tier) => (
              <Card key={tier.tier}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-3 h-3 ${tier.color} rounded-full mt-1.5 flex-shrink-0`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-lg font-bold ${tier.textColor}`}>{tier.tier}</h3>
                        <Badge variant="outline" className="text-xs">{tier.label}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{tier.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {tier.regulators.map((reg) => (
                          <span key={reg} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
                            {reg}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Our Testing Process */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Our Testing Process</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Every broker review follows a rigorous, repeatable process to ensure consistency and accuracy.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROCESS_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <Card key={step.step}>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Step {step.step}</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Yes/No + Opinion Scoring */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Scoring Methodology</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Our scoring combines objective data analysis with expert qualitative assessment.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Variable Scoring (Yes/No)</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Every broker is assessed against 130+ binary variables. Each "Yes" earns points based on 
                  variable importance. The total is divided by maximum possible points to produce a 
                  Variable Score (0–100%).
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <p className="text-xs text-blue-800 dark:text-blue-300">
                    <strong>Example:</strong> "Does the broker offer negative balance protection?" — Yes = points, No = 0 points. 
                    More critical variables (like Tier-1 regulation) earn more points than nice-to-haves.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-violet-200 dark:border-violet-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Opinion Scoring (1–10)</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Our expert reviewers assign opinion scores for aspects that can't be reduced to Yes/No — 
                  like platform usability, educational quality, or support responsiveness. Scores range 
                  from 1 (poor) to 10 (excellent), with half-point increments.
                </p>
                <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-3">
                  <p className="text-xs text-violet-800 dark:text-violet-300">
                    <strong>Example:</strong> "How intuitive is the mobile trading app?" — Reviewed by our team 
                    with 5+ years of trading experience across multiple brokers.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Transparency Note */}
        <Card className="mb-12 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Affiliate Disclosure</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Some links on our site are affiliate links. If you open an account through these links, 
                  we may earn a commission at no extra cost to you. This does NOT affect our ratings, 
                  scores, rankings, or recommendations. Our scoring methodology is applied uniformly 
                  regardless of affiliate relationships. We never accept payment for higher rankings, 
                  and all affiliate relationships are clearly disclosed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Ready to find your broker?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Use our data-driven rankings and comparison tools to find the best broker for your trading style.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/top-10" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors">
              View Top 10 Brokers
            </Link>
            <Link href="/compare-tool" className="border border-gray-300 dark:border-gray-600 hover:border-blue-400 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-medium transition-colors">
              Compare Brokers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
