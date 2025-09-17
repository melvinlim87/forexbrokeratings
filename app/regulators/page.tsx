'use client';

import Link from 'next/link';
import { fetchRegulators, Regulators } from '@/lib/supabase';
import { Search, Globe, Building2, ShieldCheck, Timer, Link2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function RegulatorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [regulators, setRegulators] = useState<Regulators[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRegulators = async () => {
      try {
        const data = await fetchRegulators();
        setRegulators(data || []);
      } catch (err) {
        setError('Failed to load regulators. Please try again later.');
        console.error('Error loading regulators:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadRegulators();
  }, []);

  // Filter regulators based on search term
  const filteredRegulators = regulators.filter(regulator => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      regulator.name.toLowerCase().includes(searchLower) ||
      (regulator.jurisdiction?.toLowerCase().includes(searchLower) ?? false) ||
      (regulator.source?.toLowerCase().includes(searchLower) ?? false)
    );
  });

  // Original group by jurisdiction, not affect the result
  const originalGroups = regulators.reduce<Record<string, Regulators[]>>((acc, item) => {
    const key = item.jurisdiction || 'Unknown';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  // Group by jurisdiction
  const groups = filteredRegulators.reduce<Record<string, Regulators[]>>((acc, item) => {
    const key = item.jurisdiction || 'Unknown';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const sortedJurisdictions = Object.keys(groups).sort((a, b) => a.localeCompare(b));
  
  // Count unique countries and total regulators
  const countryCount = Object.keys(originalGroups).length;
  const regulatorCount = regulators.length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Countries Covered</p>
                <p className="text-2xl font-bold text-gray-900">{countryCount}+</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <ShieldCheck className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Regulatory Bodies</p>
                <p className="text-2xl font-bold text-gray-900">{regulatorCount}+</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Timer className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Updated Database</p>
                <p className="text-2xl font-bold text-gray-900">24 / 7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search regulators by name, country"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Regulators Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {sortedJurisdictions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedJurisdictions.map((jurisdiction) => {
              const items = groups[jurisdiction].sort((a, b) => a.name.localeCompare(b.name));
              return (
                <div key={jurisdiction} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  <div className="bg-gradient-to-r from-cyan-400 to-purple-400 px-6 py-4">
                    <h2 className="text-xl font-bold text-white">{jurisdiction}</h2>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3">
                      {items.map((reg) => (
                        <li key={reg.id}>
                          <Link
                            href={reg.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            <Link2 className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{reg.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No regulators found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}