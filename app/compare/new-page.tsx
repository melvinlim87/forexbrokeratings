"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, Search, X, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface Broker {
  id: string;
  name: string;
  logo: string;
  rating: number;
  min_deposit: string;
  spread_eur_usd: string;
  leverage_max: string;
  year_published: string;
  slug: string;
  is_regulated?: boolean;
  trading_platforms?: string[];
}

type ExpandedSections = {
  [key: string]: boolean;
};

export default function ComparePage() {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [selectedBrokers, setSelectedBrokers] = useState<Broker[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    basic: true,
    trading: false,
    fees: false,
    ratings: false,
    contact: false,
  });

  // Fetch brokers from the database
  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const { data, error } = await supabase
          .from('brokers')
          .select('*');
        
        if (error) throw error;
        
        setBrokers(data || []);
      } catch (error) {
        // console.error('Error fetching brokers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrokers();
  }, []);

  // Filter brokers based on search term
  const filteredBrokers = searchTerm
    ? brokers.filter(broker =>
        broker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (broker.trading_platforms?.some(platform =>
          platform.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      )
    : brokers;

  // Toggle broker selection
  const toggleBroker = (broker: Broker) => {
    setSelectedBrokers(prev => {
      const isSelected = prev.some(b => b.id === broker.id);
      if (isSelected) {
        return prev.filter(b => b.id !== broker.id);
      } else if (prev.length < 3) {
        return [...prev, broker];
      }
      return prev;
    });
  };

  // Clear all selected brokers
  const clearAllBrokers = () => {
    setSelectedBrokers([]);
  };

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Calculate average rating
  const calculateAverageRating = (rating: number) => {
    return rating ? Number(rating).toFixed(1) : 'N/A';
  };

  // Render star rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
      }
    }
    return stars;
  };

  // Render broker card
  const renderBrokerCard = (broker: Broker, isSelected: boolean) => (
    <Card 
      key={broker.id} 
      className={cn(
        "relative overflow-hidden border-2 transition-all cursor-pointer hover:shadow-md",
        isSelected ? "border-blue-500" : "border-transparent hover:border-gray-200"
      )}
      onClick={() => toggleBroker(broker)}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 relative flex-shrink-0">
              <Image 
                src={broker.logo} 
                alt={broker.name} 
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{broker.name}</h3>
              <div className="flex items-center mt-1">
                <div className="flex">
                  {renderStars(broker.rating)}
                </div>
                <span className="ml-1 text-sm text-gray-600">
                  {calculateAverageRating(broker.rating)}
                </span>
              </div>
            </div>
          </div>
          {isSelected && (
            <div className="bg-blue-100 p-1 rounded-full">
              <Check className="h-4 w-4 text-blue-600" />
            </div>
          )}
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500">Spread (EUR/USD)</p>
            <p className="font-medium">{broker.spread_eur_usd || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500">Leverage</p>
            <p className="font-medium">{broker.leverage_max || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500">Min. Deposit</p>
            <p className="font-medium">{broker.min_deposit || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500">Year</p>
            <p className="font-medium">{broker.year_published || 'N/A'}</p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              toggleBroker(broker);
            }}
          >
            {isSelected ? 'Remove from Compare' : 'Add to Compare'}
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Compare Forex Brokers</h1>
        <p className="text-gray-600">Select up to 3 brokers to compare their features side by side</p>
      </div>
      
      {/* Selected Brokers */}
      {selectedBrokers.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Selected for Comparison</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearAllBrokers}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Clear All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedBrokers.map(broker => renderBrokerCard(broker, true))}
          </div>
        </div>
      )}
      
      {/* Available Brokers */}
      <div className="mb-6">
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search brokers by name..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredBrokers
              .filter(broker => !selectedBrokers.some(selected => selected.id === broker.id))
              .map(broker => renderBrokerCard(broker, false))}
          </div>
        )}
      </div>
    </div>
  );
}
