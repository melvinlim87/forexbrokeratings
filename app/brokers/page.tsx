export const revalidate = 300;

import { fetchAllBrokerDetails } from '@/lib/supabase';
import BrokersListClient, { BrokerListItem } from '@/components/brokers/BrokersListClient';

function toListItem(broker: any, index: number): BrokerListItem {
  const parseArrayField = (field: string[] | string | null | undefined) => {
    if (!field) return [] as string[];
    if (Array.isArray(field)) return field as string[];
    try {
      const parsed = JSON.parse(field as string);
      return Array.isArray(parsed) ? parsed : [String(parsed)];
    } catch {
      return [String(field)];
    }
  };

  return {
    id: broker.id || index + 1,
    name: broker.name || `Broker ${index + 1}`,
    logo: broker.logo || `https://via.placeholder.com/120x60?text=${broker.name || 'Broker'}`,
    rating: broker.rating || 4.0,
    minDeposit: broker.min_deposit || 100,
    features: parseArrayField(broker.features),
    regulations: parseArrayField(broker.regulators),
    tradingPlatforms: parseArrayField(broker.platforms),
    pros: parseArrayField(broker.pros),
    cons: parseArrayField(broker.cons),
    bestFor: broker.bestFor || 'Forex Trading',
    description: broker.description || 'A reliable forex broker offering competitive trading conditions.',
    url: broker.url || '#',
    website: broker.website || '#',
    slug: broker.name ? broker.name.toLowerCase().replace(/\s+/g, '-') : `broker-${index + 1}`,
  };
}

export default async function BrokersPage() {
  const data = await fetchAllBrokerDetails();
  const initialBrokers: BrokerListItem[] = Array.isArray(data) ? data.map(toListItem) : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="bg-gradient-to-r from-[#091f40] to-[#0f2d59] h-[180px] flex flex-col justify-center items-center text-center px-4 mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow">Top Forex Brokers</h1>
        <h2 className="text-lg md:text-2xl text-cyan-200 font-medium max-w-2xl mx-auto">Browse and compare the best forex brokers for your trading needs.</h2>
      </header>

      <div className="container mx-auto px-4">
        {/* Visible Breadcrumbs */}
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
          <ol className="list-reset flex">
            <li>
              <a href="/" className="hover:underline">Home</a>
            </li>
            <li className="mx-2">/</li>
            <li aria-current="page">Brokers</li>
          </ol>
        </nav>
      </div>

      <BrokersListClient initialBrokers={initialBrokers} />
    </div>
  );
}
