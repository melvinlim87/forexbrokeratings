import { Broker } from '@/lib/brokers';
import { Star, Shield, TrendingUp, Monitor } from 'lucide-react';
import Link from 'next/link';

interface ComparisonTableProps {
  currentBroker: Broker;
  competitors: Broker[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      <span className="font-semibold">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function ComparisonTable({ currentBroker, competitors }: ComparisonTableProps) {
  const allBrokers = [currentBroker, ...competitors];

  return (
    <section className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">How {currentBroker.name} Compares</h2>
      </div>
      <p className="text-muted-foreground mb-6">
        See how {currentBroker.name} stacks up against similar brokers in key trading metrics.
      </p>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-base">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold">Broker</th>
              <th className="px-4 py-3 text-center font-semibold">Rating</th>
              <th className="px-4 py-3 text-center font-semibold">Min Deposit</th>
              <th className="px-4 py-3 text-center font-semibold">Spread EUR/USD</th>
              <th className="px-4 py-3 text-center font-semibold">Regulation</th>
              <th className="px-4 py-3 text-center font-semibold">Platforms</th>
            </tr>
          </thead>
          <tbody>
            {allBrokers.map((broker, i) => {
              const isCurrent = broker.slug === currentBroker.slug;
              return (
                <tr
                  key={broker.slug}
                  className={`border-t border-border transition-colors ${
                    isCurrent
                      ? 'bg-primary/5 font-medium'
                      : 'hover:bg-muted/30'
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/broker/${broker.slug}`}
                        className={`hover:underline ${isCurrent ? 'text-primary font-semibold' : ''}`}
                      >
                        {broker.name}
                      </Link>
                      {isCurrent && (
                        <span className="text-base bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          Viewing
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StarRating rating={broker.rating} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    {broker.minDeposit === 0 ? '$0' : `$${broker.minDeposit.toLocaleString()}`}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {broker.avgSpreadEurUsd !== undefined
                      ? `${broker.avgSpreadEurUsd} pips`
                      : broker.spreads}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {broker.regulations.slice(0, 3).map((reg) => (
                        <span
                          key={reg}
                          className="inline-flex items-center gap-1 text-base bg-muted px-1.5 py-0.5 rounded"
                        >
                          <Shield className="h-3 w-3 text-green-500" />
                          {reg}
                        </span>
                      ))}
                      {broker.regulations.length > 3 && (
                        <span className="text-base text-muted-foreground">
                          +{broker.regulations.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {broker.platforms.slice(0, 3).map((p) => (
                        <span
                          key={p}
                          className="inline-flex items-center gap-1 text-base bg-muted px-1.5 py-0.5 rounded"
                        >
                          <Monitor className="h-3 w-3 text-blue-500" />
                          {p}
                        </span>
                      ))}
                      {broker.platforms.length > 3 && (
                        <span className="text-base text-muted-foreground">
                          +{broker.platforms.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {allBrokers.map((broker) => {
          const isCurrent = broker.slug === currentBroker.slug;
          return (
            <div
              key={broker.slug}
              className={`rounded-xl border p-4 ${
                isCurrent ? 'border-primary/50 bg-primary/5' : 'border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Link
                  href={`/broker/${broker.slug}`}
                  className={`font-semibold hover:underline ${isCurrent ? 'text-primary' : ''}`}
                >
                  {broker.name}
                </Link>
                {isCurrent && (
                  <span className="text-base bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    Viewing
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 text-base">
                <div>
                  <span className="text-muted-foreground text-base">Rating</span>
                  <StarRating rating={broker.rating} />
                </div>
                <div>
                  <span className="text-muted-foreground text-base">Min Deposit</span>
                  <p className="font-medium">
                    {broker.minDeposit === 0 ? '$0' : `$${broker.minDeposit.toLocaleString()}`}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground text-base">Spread EUR/USD</span>
                  <p className="font-medium">
                    {broker.avgSpreadEurUsd !== undefined
                      ? `${broker.avgSpreadEurUsd} pips`
                      : broker.spreads}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground text-base">Regulation</span>
                  <p className="font-medium">{broker.regulations.slice(0, 2).join(', ')}</p>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-muted-foreground text-base">Platforms</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {broker.platforms.slice(0, 3).map((p) => (
                    <span key={p} className="text-base bg-muted px-1.5 py-0.5 rounded">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
