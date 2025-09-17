import Link from 'next/link';
import { fetchRegulators, Regulators } from '@/lib/supabase';

export const metadata = {
  title: 'Global Financial Regulators by Jurisdiction',
  description: 'Explore a list of financial market regulators organized by jurisdiction. Click a regulator to visit its official source.',
};

export default async function RegulatorsPage() {
  let regulators: Regulators[] = [];
  try {
    const data = await fetchRegulators();
    regulators = (data || []) as Regulators[];
  } catch (e) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 dark:text-red-400 font-medium">Failed to load regulators. Please try again later.</p>
      </div>
    );
  }

  if (!regulators || regulators.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 dark:text-gray-300">No regulators found.</p>
      </div>
    );
  }

  // Group by jurisdiction
  const groups = regulators.reduce<Record<string, Regulators[]>>((acc, item) => {
    const key = item.jurisdiction || 'Unknown';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const sortedJurisdictions = Object.keys(groups).sort((a, b) => a.localeCompare(b));

  return (
    <div className="space-y-12">
      {sortedJurisdictions.map((jurisdiction) => {
        const items = groups[jurisdiction].sort((a, b) => a.name.localeCompare(b.name));
        return (
          <section key={jurisdiction} className="">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">
              {jurisdiction}:
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              {items.map((reg) => (
                <li key={reg.id} className="leading-relaxed">
                  <Link
                    href={reg.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 decoration-slate-400 hover:decoration-slate-600 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white"
                  >
                    {reg.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
