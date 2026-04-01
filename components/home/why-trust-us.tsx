'use client';

import { Shield, Search, Calculator, Users, Award, TrendingUp } from 'lucide-react';

const methodologySteps = [
  {
    icon: Search,
    title: 'Research & Data Collection',
    description: 'We analyze 50+ brokers across 200+ data points including spreads, commissions, execution speed, platform features, and regulatory status.',
    stat: '200+',
    statLabel: 'Data Points Per Broker',
  },
  {
    icon: Shield,
    title: 'Regulatory Verification',
    description: 'Every broker\'s regulatory status is verified directly with regulators — FCA, ASIC, CySEC, CFTC/NFA, and more. We check license numbers, entity structures, and compliance history.',
    stat: '6',
    statLabel: 'Regulators Checked',
  },
  {
    icon: Calculator,
    title: 'Cost Analysis',
    description: 'We calculate real trading costs using live spread data, commission structures, swap rates, and hidden fees. Our cost models reflect actual trading scenarios.',
    stat: '28',
    statLabel: 'Major & Minor Pairs Tracked',
  },
  {
    icon: Users,
    title: 'User Review Aggregation',
    description: 'We aggregate reviews from TrustPilot, Forex Peace Army, Reddit, and trading forums to capture real trader experiences — not just marketing claims.',
    stat: '50K+',
    statLabel: 'Reviews Analyzed',
  },
  {
    icon: Award,
    title: 'Scoring & Ranking',
    description: 'Our proprietary scoring system weights regulation (25%), fees (20%), platforms (20%), instruments (15%), user sentiment (10%), and support (10%).',
    stat: '7',
    statLabel: 'Scoring Categories',
  },
  {
    icon: TrendingUp,
    title: 'Continuous Monitoring',
    description: 'Broker ratings are updated quarterly. We monitor regulatory changes, spread movements, platform updates, and user feedback to keep rankings current.',
    stat: '24/7',
    statLabel: 'Monitoring',
  },
];

export default function WhyTrustUs() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Shield className="h-4 w-4" />
            Editorial Independence
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Traders Trust Our Ratings
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Our ratings are built on verified data, rigorous methodology, and editorial independence.
            We never let affiliate relationships influence our scores.
          </p>
        </div>

        {/* Methodology Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {methodologySteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg"
              >
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                  <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                  {step.description}
                </p>

                {/* Stat */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {step.stat}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {step.statLabel}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Independent Reviews
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            No Paid Placements
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Data-Driven Rankings
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Quarterly Updates
          </div>
        </div>
      </div>
    </section>
  );
}
