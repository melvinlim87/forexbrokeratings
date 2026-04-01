import Link from 'next/link';
import { ArrowRight, Shield, TrendingDown, Zap, Users } from 'lucide-react';

interface ComparisonPair {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  brokerA: {
    name: string;
    slug: string;
    rating: number;
    spreads: string;
    minDeposit: number;
    regulations: string[];
    platforms: string;
  };
  brokerB: {
    name: string;
    slug: string;
    rating: number;
    spreads: string;
    minDeposit: number;
    regulations: string[];
    platforms: string;
  };
}

const comparisons: ComparisonPair[] = [
  {
    title: 'Pepperstone vs IC Markets',
    subtitle: 'Lowest-Cost ASIC Brokers',
    icon: <TrendingDown className="h-5 w-5" />,
    brokerA: {
      name: 'Pepperstone',
      slug: 'pepperstone',
      rating: 9.6,
      spreads: 'From 0.0 pips',
      minDeposit: 0,
      regulations: ['FCA', 'ASIC', 'CySEC', 'BaFin'],
      platforms: 'MT4, MT5, cTrader, TradingView',
    },
    brokerB: {
      name: 'IC Markets',
      slug: 'ic-markets',
      rating: 8.6,
      spreads: 'From 0.0 pips',
      minDeposit: 200,
      regulations: ['ASIC', 'CySEC'],
      platforms: 'MT4, MT5, cTrader',
    },
  },
  {
    title: 'eToro vs Plus500',
    subtitle: 'Best for Beginners',
    icon: <Users className="h-5 w-5" />,
    brokerA: {
      name: 'eToro',
      slug: 'etoro',
      rating: 8.2,
      spreads: 'From 1.0 pips',
      minDeposit: 50,
      regulations: ['FCA', 'CySEC', 'ASIC'],
      platforms: 'eToro Platform',
    },
    brokerB: {
      name: 'Plus500',
      slug: 'plus500',
      rating: 7.5,
      spreads: 'From 0.6 pips',
      minDeposit: 100,
      regulations: ['FCA', 'ASIC', 'CySEC', 'MAS'],
      platforms: 'Plus500 Platform',
    },
  },
  {
    title: 'IG vs Saxo Bank',
    subtitle: 'Best for Advanced Traders',
    icon: <Zap className="h-5 w-5" />,
    brokerA: {
      name: 'IG',
      slug: 'ig',
      rating: 9.2,
      spreads: 'From 0.6 pips',
      minDeposit: 0,
      regulations: ['FCA', 'ASIC', 'MAS', 'BaFin', 'JFSA'],
      platforms: 'MT4, ProRealTime, L2 Dealer',
    },
    brokerB: {
      name: 'Saxo Bank',
      slug: 'saxo-bank',
      rating: 9.0,
      spreads: 'From 0.7 pips',
      minDeposit: 0,
      regulations: ['FCA', 'ASIC', 'MAS', 'JFSA', 'FINMA'],
      platforms: 'SaxoTraderGO, SaxoTraderPRO',
    },
  },
];

function BrokerCard({ broker }: { broker: ComparisonPair['brokerA'] }) {
  return (
    <div className="flex-1 rounded-lg bg-slate-800/50 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="font-semibold text-white">{broker.name}</h4>
        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-sm font-bold text-emerald-400">
          {broker.rating}/10
        </span>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Spreads</span>
          <span className="text-slate-200">{broker.spreads}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Min Deposit</span>
          <span className="text-slate-200">
            {broker.minDeposit === 0 ? '$0' : `$${broker.minDeposit}`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Platforms</span>
          <span className="text-right text-slate-200 text-xs leading-tight max-w-[60%]">
            {broker.platforms}
          </span>
        </div>
        <div className="flex items-center gap-1 pt-1">
          <Shield className="h-3 w-3 text-emerald-400" />
          <div className="flex flex-wrap gap-1">
            {broker.regulations.slice(0, 4).map((reg) => (
              <span
                key={reg}
                className="rounded bg-slate-700 px-1.5 py-0.5 text-[10px] text-slate-300"
              >
                {reg}
              </span>
            ))}
            {broker.regulations.length > 4 && (
              <span className="text-[10px] text-slate-500">
                +{broker.regulations.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeadToHeadComparison() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl">
            Head-to-Head Comparisons
          </h2>
          <p className="text-slate-400">
            Side-by-side breakdowns of the most popular broker matchups
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {comparisons.map((pair) => (
            <div
              key={pair.title}
              className="group rounded-xl border border-slate-700/50 bg-slate-900/50 p-5 transition-all hover:border-emerald-500/30 hover:bg-slate-900/80"
            >
              {/* Header */}
              <div className="mb-4 flex items-center gap-2">
                <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                  {pair.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{pair.title}</h3>
                  <p className="text-xs text-slate-400">{pair.subtitle}</p>
                </div>
              </div>

              {/* VS Cards */}
              <div className="mb-4 flex items-start gap-2">
                <BrokerCard broker={pair.brokerA} />
                <div className="flex items-center self-center">
                  <span className="rounded-full bg-slate-700 px-2 py-1 text-xs font-bold text-slate-300">
                    VS
                  </span>
                </div>
                <BrokerCard broker={pair.brokerB} />
              </div>

              {/* CTA */}
              <Link
                href="/compare-tool"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 py-2.5 text-sm font-medium text-emerald-400 transition-all hover:bg-emerald-500/20"
              >
                Compare Full Details
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
