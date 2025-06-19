import { notFound } from 'next/navigation';
import { BrokerDetails, fetchTopBroker } from '@/lib/supabase';
import Image from 'next/image';

interface BrokerDetailsPageProps {
  params: { slug: string };
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default async function BrokerDetailsPage({ params }: BrokerDetailsPageProps) {
  const brokers: BrokerDetails[] = await fetchTopBroker();
  const broker = brokers.find(b => slugify(b.name) === params.slug);
    
  if (!broker) return notFound();

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 relative rounded-full overflow-hidden border-2 border-cyan-400">
          <Image src={broker.logo || ''} alt={broker.name} fill className="object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-cyan-400 mb-1">{broker.name}</h1>
          <div className="text-sm text-gray-400">Founded: {broker.year_published ? broker.year_published : 'N/A'}</div>
          <div className="text-sm text-gray-400">Headquarters: {broker.headquarters ? broker.headquarters : broker.country ? broker.country : 'N/A'}</div>
        </div>
      </div>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Overview</h2>
        <p className="text-gray-200 mb-2">{broker.description ? broker.description : 'No description available.'}</p>
        <div className="flex flex-wrap gap-4 text-sm mt-4">
          <div className="bg-cyan-900/30 rounded p-2">Min Deposit: <span className="font-bold text-green-400">{broker.min_deposit ? broker.min_deposit : 'N/A'}</span></div>
          <div className="bg-cyan-900/30 rounded p-2">Leverage: <span className="font-bold text-purple-400">{broker.leverage_max ? broker.leverage_max : 'N/A'}</span></div>
          <div className="bg-cyan-900/30 rounded p-2">Spread EUR/USD: <span className="font-bold text-cyan-400">{broker.spread_eur_usd ? broker.spread_eur_usd + ' pips' : 'N/A'}</span></div>
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Regulation</h2>
        <div className="flex flex-wrap gap-2">
          {Array.isArray(broker.regulators) && broker.regulators.length > 0 ? broker.regulators.map(reg => (
            <span key={reg} className="bg-blue-700/30 text-blue-200 px-2 py-1 rounded text-xs">{reg}</span>
          )) : <span className="text-gray-400">N/A</span>}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2 text-white">More Info</h2>
        <ul className="list-disc ml-5 text-gray-200">
          <li>Platforms: {Array.isArray(broker.platforms) && broker.platforms.length > 0 ? broker.platforms.join(', ') : 'N/A'}</li>
          <li>Instruments: {Array.isArray(broker.instruments) && broker.instruments.length > 0 ? broker.instruments.join(', ') : 'N/A'}</li>
          <li>Licenses: {Array.isArray(broker.licenses) && broker.licenses.length > 0 ? broker.licenses.join(', ') : 'N/A'}</li>
        </ul>
      </section>
      <div className="mt-8">
        <a
          href={broker.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold shadow hover:from-cyan-600 hover:to-purple-600 transition"
        >
          Visit Broker Website
        </a>
      </div>
    </main>
  );
}
