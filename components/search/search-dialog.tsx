"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, ArrowRight, Loader2, Star } from 'lucide-react';
import Image from 'next/image';
import { useDebounce } from 'use-debounce';
import { fetchAllBrokerDetails } from '@/lib/supabase';

interface Broker {
  id: string;
  name: string;
  logo?: string;
  slug: string;
  description?: string;
  rating?: number;
  spread_eur_usd?: string;
  leverage_max?: string;
}

export function SearchDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchQuery, 300);
  const [results, setResults] = useState<Broker[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch search results
  useEffect(() => {
    const searchBrokers = async () => {
      if (!debouncedSearchTerm.trim()) {
        setResults([]);
        return;
      }
      
      setIsSearching(true);
      try {
        const allBrokers = await fetchAllBrokerDetails();
        const filtered = allBrokers.filter(broker => 
          broker.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          (broker.name && broker.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
        ).slice(0, 5); // Limit to 5 results
        
        setResults(filtered);
      } catch (error) {
        console.error('Error searching brokers:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };
    
    searchBrokers();
  }, [debouncedSearchTerm]);

  // Close results when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchQuery('');
      setResults([]);
    }
  }, [open]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchQuery('');
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/brokers?search=${encodeURIComponent(searchQuery.trim())}`);
      setOpen(false);
      setSearchQuery('');
    }
  };

  const handleBrokerSelect = (broker: Broker) => {
    router.push(`/broker/${broker.slug || broker.name.toLowerCase().replace(/\s+/g, '-')}`);
    setOpen(false);
    setSearchQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden bg-white dark:bg-gray-900">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center text-gray-900 dark:text-white">
            <Search className="h-5 w-5 mr-2" />
            Search Brokers
          </DialogTitle>
        </DialogHeader>
        <div className="p-4" ref={searchRef}>
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                {isSearching ? (
                  <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                ) : (
                  <Search className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <div className="relative p-[2px] rounded-xl bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500">
                <Input
                  type="text"
                  placeholder="Search for brokers..."
                  className="pl-10 py-6 w-full bg-white dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white placeholder:text-gray-500 focus:ring-2 focus:ring-blue-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
        
        {(isSearching || results.length > 0) && (
          <div className="max-h-[400px] overflow-y-auto border-t border-gray-200 dark:border-gray-800">
            {isSearching && results.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                <p>Searching...</p>
              </div>
            ) : results.length > 0 ? (
              results.map((broker) => (
                <div
                  key={broker.id}
                  onClick={() => handleBrokerSelect(broker)}
                  className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                >
                  <div className="h-14 w-14 flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center mr-4 border border-gray-200 dark:border-gray-700">
                    {broker.logo ? (
                      <Image
                        src={broker.logo}
                        alt={broker.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 object-contain p-1"
                      />
                    ) : (
                      <div className="h-10 w-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded">
                        <span className="text-xs font-medium text-gray-500">
                          {broker.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {broker.name}
                      </h4>
                      {typeof broker.rating !== 'undefined' && (
                        <div className="flex items-center ml-2">
                          <Star className="h-3.5 w-3.5 text-yellow-400 fill-current mr-0.5" />
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {broker.rating}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-1 flex items-center flex-wrap gap-1">
                      {broker.spread_eur_usd && (
                        <span className="text-xs text-blue-600 dark:text-blue-400">
                          Spread: {broker.spread_eur_usd} pips
                        </span>
                      )}
                      {broker.leverage_max && (
                        <span className="text-xs text-purple-600 dark:text-purple-400">
                          Leverage: 1:{broker.leverage_max}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                </div>
              ))
            ) : null}
          </div>
        )}
        
        {searchQuery && !isSearching && results.length === 0 && (
          <div className="p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No brokers found matching "{searchQuery}"</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                router.push(`/brokers?search=${encodeURIComponent(searchQuery)}`);
                setOpen(false);
              }}
            >
              View all results
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
