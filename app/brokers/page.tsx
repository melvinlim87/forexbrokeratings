export const dynamic = 'force-dynamic';

import { fetchAllBrokerDetails } from '@/lib/supabase';
import BrokersListClient, { BrokerListItem } from '@/components/brokers/BrokersListClient';
import BrokersHero from '@/components/brokers/BrokersHero';

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
    <div className="min-h-screen bg-transparent">
      <BrokersHero />

      <BrokersListClient initialBrokers={initialBrokers} />
    </div>
  );
}
