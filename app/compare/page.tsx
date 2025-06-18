"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, XCircle, Star, Search, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface Broker {
  id: string;
  name: string;
  logo: string;
  minDeposit: string;
  spreads: string;
  leverage: string;
  platforms: string[];
  regulations: string[];
  accountTypes: string[];
  depositMethods: string[];
  customerSupport: string[];
  pros: string[];
  cons: string[];
  slug: string;
  rating?: number;
  description?: string;
}

export default function ComparePage() {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [selectedBrokers, setSelectedBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch brokers from Supabase
  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const { data, error } = await supabase
          .from('broker_details')
          .select('*');

        if (error) throw error;

        // Transform the data to match our Broker interface
        const formattedBrokers = data.map((broker: any) => ({
          id: broker.id,
          name: broker.name || 'Unnamed Broker',
          logo: broker.logo || '/default-broker-logo.png',
          minDeposit: broker.min_deposit ? `$${broker.min_deposit}` : 'Not specified',
          spreads: broker.spread_type || 'Variable',
          leverage: broker.max_leverage ? `1:${broker.max_leverage}` : 'Not specified',
          platforms: Array.isArray(broker.platforms) ? broker.platforms : [],
          regulations: Array.isArray(broker.regulators) ? broker.regulators : [],
          accountTypes: Array.isArray(broker.account_types) ? broker.account_types : [],
          depositMethods: Array.isArray(broker.deposit_methods) ? broker.deposit_methods : [],
          customerSupport: Array.isArray(broker.customer_support) ? broker.customer_support : [],
          pros: Array.isArray(broker.pros) ? broker.pros : [],
          cons: Array.isArray(broker.cons) ? broker.cons : [],
          slug: broker.slug || broker.name.toLowerCase().replace(/\s+/g, '-'),
          rating: broker.rating || 0,
          description: broker.description || '',
        }));

        setBrokers(formattedBrokers);
      } catch (err) {
        console.error('Error fetching brokers:', err);
        setError('Failed to load brokers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBrokers();
  }, []);

  // Filter brokers based on search term
  const filteredBrokers = searchTerm
    ? brokers.filter(broker =>
        broker.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : brokers;

  // Handler functions
  const addBroker = (broker: Broker) => {
    if (selectedBrokers.length < 3 && !selectedBrokers.some(b => b.id === broker.id)) {
      setSelectedBrokers([...selectedBrokers, broker]);
    }
  };

  const removeBroker = (brokerId: string) => {
    setSelectedBrokers(selectedBrokers.filter(broker => broker.id !== brokerId));
  };

  // Render helper functions
  const renderCheckOrX = (value: boolean | string[] | undefined, item?: string) => {
    if (Array.isArray(value) && item) {
      return value.includes(item) ? (
        <CheckCircle className="h-5 w-5 text-green-500" />
      ) : (
        <XCircle className="h-5 w-5 text-red-500" />
      );
    }
    return null;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center p-4">
          <p>{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Compare Forex Brokers</h1>
      
      {/* Selected Brokers */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Selected Brokers ({selectedBrokers.length}/3)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedBrokers.map((broker) => (
            <Card key={broker.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <Image 
                    src={broker.logo} 
                    alt={broker.name} 
                    width={48} 
                    height={48} 
                    className="rounded-md mr-3"
                  />
                  <div>
                    <h3 className="font-medium">{broker.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-600">
                        {typeof broker.rating === 'string' ? broker.rating : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeBroker(broker.id)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
          
          {Array(3 - selectedBrokers.length).fill(0).map((_, index) => (
            <Card key={`empty-${index}`} className="border-2 border-dashed border-gray-300 min-h-[100px] flex items-center justify-center">
              <span className="text-gray-400">Select a broker</span>
            </Card>
          ))}
        </div>
      </div>

      {/* Broker Search and Selection */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search brokers..."
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBrokers
            .filter(broker => !selectedBrokers.some(selected => selected.id === broker.id))
            .map((broker) => (
              <Card 
                key={broker.id} 
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => addBroker(broker)}
              >
                <div className="flex items-center">
                  <Image 
                    src={broker.logo} 
                    alt={broker.name} 
                    width={40} 
                    height={40} 
                    className="rounded-md mr-3"
                  />
                  <div>
                    <h3 className="font-medium">{broker.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-600">
                        {typeof broker.rating === 'number' ? broker.rating.toFixed(1) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </div>

      {/* Comparison Table */}
      {selectedBrokers.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6">Comparison</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                  {selectedBrokers.map((broker) => (
                    <th key={broker.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {broker.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Minimum Deposit</td>
                  {selectedBrokers.map((broker) => (
                    <td key={broker.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {broker.minDeposit}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Spreads</td>
                  {selectedBrokers.map((broker) => (
                    <td key={broker.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {broker.spreads}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Leverage</td>
                  {selectedBrokers.map((broker) => (
                    <td key={broker.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {broker.leverage}
                    </td>
                  ))}
                </tr>
                {/* Add more comparison rows as needed */}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
