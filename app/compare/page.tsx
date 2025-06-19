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
  min_deposit: string;
  min_withdrawl: string;
  spread_eur_usd: string;
  leverage_max: string;
  platforms: string[];
  regulators: string[];
  account_types: string[];
  deposit_methods: string[];
  withdraw_methods: string[];
  base_currencies: string[];
  instruments: string[];
  deposit_fees: string | null;
  withdrawal_fees: string | null;
  deposit_process_time: string;
  withdrawal_process_time: string;
  languages: string[];
  availability: string;
  channels: string[];
  phone_numbers: string[];
  email: string;
  response_time: string;
  pros: string[];
  cons: string[];
  slug: string;
  rating: number;
  sw: number;
  regulations: number;
  risk_control: number;
  promotions: number;
  user_experience: number;
  environment: number;
  headquarters: string;
  country: string;
  is_regulated: boolean;
  year_published: string;
  description: string;
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
          .select('*')
          .order('name', { ascending: true });

        if (error) throw error;

        // Transform the data to match our Broker interface
        const formattedBrokers = data.map((broker: any) => ({
          id: broker.id.toString(),
          name: broker.name || 'Unnamed Broker',
          logo: broker.logo || '/default-broker-logo.png',
          min_deposit: broker.min_deposit || 'Not specified',
          min_withdrawl: broker.min_withdrawl || 'Not specified',
          spread_eur_usd: broker.spread_eur_usd || 'Variable',
          leverage_max: broker.leverage_max || 'Not specified',
          platforms: Array.isArray(broker.platforms) ? broker.platforms : [],
          regulators: Array.isArray(broker.regulators) ? broker.regulators : [],
          account_types: Array.isArray(broker.account_types) ? broker.account_types : [],
          deposit_methods: Array.isArray(broker.deposit_methods) ? broker.deposit_methods : [],
          withdraw_methods: Array.isArray(broker.withdraw_methods) ? broker.withdraw_methods : [],
          base_currencies: Array.isArray(broker.base_currencies) ? broker.base_currencies : [],
          instruments: Array.isArray(broker.instruments) ? broker.instruments : [],
          deposit_fees: broker.deposit_fees || null,
          withdrawal_fees: broker.withdrawal_fees || null,
          deposit_process_time: broker.deposit_process_time || '1-3 business days',
          withdrawal_process_time: broker.withdrawal_process_time || '1-3 business days',
          languages: Array.isArray(broker.languages) ? broker.languages : ['English'],
          availability: broker.availability || '24/5',
          channels: Array.isArray(broker.channels) ? broker.channels : ['Email', 'Live Chat'],
          phone_numbers: Array.isArray(broker.phone_numbers) ? broker.phone_numbers : [],
          email: broker.email || 'support@example.com',
          response_time: broker.response_time || '24 hours',
          pros: Array.isArray(broker.pros) ? broker.pros : [],
          cons: Array.isArray(broker.cons) ? broker.cons : [],
          slug: broker.slug || (broker.name ? broker.name.toLowerCase().replace(/\s+/g, '-') : ''),
          rating: typeof broker.rating === 'number' ? broker.rating : 0,
          sw: typeof broker.sw === 'number' ? broker.sw : 4.0,
          regulations: typeof broker.regulations === 'number' ? broker.regulations : 4.0,
          risk_control: typeof broker.risk_control === 'number' ? broker.risk_control : 4.0,
          promotions: typeof broker.promotions === 'number' ? broker.promotions : 4.0,
          user_experience: typeof broker.user_experience === 'number' ? broker.user_experience : 4.0,
          environment: typeof broker.environment === 'number' ? broker.environment : 4.0,
          headquarters: broker.headquarters || 'Not specified',
          country: broker.country || 'International',
          is_regulated: !!broker.is_regulated,
          year_published: broker.year_published || new Date().getFullYear().toString(),
          description: broker.description || `${broker.name || 'This broker'} offers forex and CFD trading services.`
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
                {/* Basic Info */}
                <tr className="bg-gray-50">
                  <td colSpan={selectedBrokers.length + 1} className="px-6 py-3 text-sm font-semibold text-gray-700 uppercase tracking-wider">Basic Information</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Minimum Deposit</td>
                  {selectedBrokers.map((broker) => (
                    <td key={broker.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {broker.min_deposit || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Minimum Withdrawal</td>
                  {selectedBrokers.map((broker) => (
                    <td key={broker.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {broker.min_withdrawl || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">EUR/USD Spread</td>
                  {selectedBrokers.map((broker) => (
                    <td key={broker.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {broker.spread_eur_usd || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Max Leverage</td>
                  {selectedBrokers.map((broker) => (
                    <td key={broker.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {broker.leverage_max ? `1:${broker.leverage_max}` : 'N/A'}
                    </td>
                  ))}
                </tr>

                {/* Trading Conditions */}
                <tr className="bg-gray-50">
                  <td colSpan={selectedBrokers.length + 1} className="px-6 py-3 text-sm font-semibold text-gray-700 uppercase tracking-wider">Trading Conditions</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Account Types</td>
                  {selectedBrokers.map((broker) => (
                    <td key={broker.id} className="px-6 py-4 text-sm text-gray-500">
                      {broker.account_types?.join(', ') || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Trading Platforms</td>
                  {selectedBrokers.map((broker) => (
                    <td key={broker.id} className="px-6 py-4 text-sm text-gray-500">
                      {broker.platforms?.join(', ') || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Instruments</td>
                  {selectedBrokers.map((broker) => (
                    <td key={broker.id} className="px-6 py-4 text-sm text-gray-500">
                      {broker.instruments?.slice(0, 3).join(', ')}
                      {broker.instruments?.length > 3 && '...'}
                    </td>
                  ))}
                </tr>

                {/* Fees & Payments */}
                <tr className="bg-gray-50">
                  <td colSpan={selectedBrokers.length + 1} className="px-6 py-3 text-sm font-semibold text-gray-700 uppercase tracking-wider">Fees & Payments</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Deposit Fees</td>
                  {selectedBrokers.map((broker) => (
                    <td key={broker.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {broker.deposit_fees || 'No fees'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Withdrawal Fees</td>
                  {selectedBrokers.map((broker) => (
                    <td key={broker.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {broker.withdrawal_fees || 'No fees'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Deposit Methods</td>
                  {selectedBrokers.map((broker) => (
                    <td key={broker.id} className="px-6 py-4 text-sm text-gray-500">
                      {broker.deposit_methods?.join(', ') || 'N/A'}
                    </td>
                  ))}
                </tr>

                {/* Broker Ratings */}
                <tr className="bg-gray-50">
                  <td colSpan={selectedBrokers.length + 1} className="px-6 py-3 text-sm font-semibold text-gray-700 uppercase tracking-wider">Ratings</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Overall Rating</td>
                  {selectedBrokers.map((broker) => {
                    const avgRating = (
                      (broker.sw +
                      broker.regulations +
                      broker.risk_control +
                      broker.promotions +
                      broker.user_experience +
                      broker.environment) / 6
                    ).toFixed(1);
                    return (
                      <td key={broker.id} className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-yellow-500 font-medium">{avgRating}</span>
                          <span className="text-gray-400 ml-1">/5</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Regulation Status</td>
                  {selectedBrokers.map((broker) => (
                    <td key={broker.id} className="px-6 py-4 whitespace-nowrap">
                      {broker.is_regulated ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Regulated
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Not Regulated
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Contact Information */}
                <tr className="bg-gray-50">
                  <td colSpan={selectedBrokers.length + 1} className="px-6 py-3 text-sm font-semibold text-gray-700 uppercase tracking-wider">Contact & Support</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Email</td>
                  {selectedBrokers.map((broker) => (
                    <td key={broker.id} className="px-6 py-4 whitespace-nowrap text-sm">
                      {broker.email ? (
                        <a href={`mailto:${broker.email}`} className="text-blue-600 hover:underline">
                          {broker.email}
                        </a>
                      ) : 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Phone</td>
                  {selectedBrokers.map((broker) => (
                    <td key={broker.id} className="px-6 py-4 whitespace-nowrap text-sm">
                      {broker.phone_numbers?.length ? (
                        <div className="space-y-1">
                          {broker.phone_numbers.map((phone, i) => (
                            <a key={i} href={`tel:${phone.replace(/\D/g, '')}`} className="block text-blue-600 hover:underline">
                              {phone}
                            </a>
                          ))}
                        </div>
                      ) : 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Support Channels</td>
                  {selectedBrokers.map((broker) => (
                    <td key={broker.id} className="px-6 py-4 text-sm text-gray-500">
                      {broker.channels?.join(', ') || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Response Time</td>
                  {selectedBrokers.map((broker) => (
                    <td key={broker.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {broker.response_time || 'N/A'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
