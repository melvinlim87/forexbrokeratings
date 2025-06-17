"use client";

import { useState, useEffect } from 'react';
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
import { Search, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Sample broker data for search
const brokerData = [
  {
    name: 'IronFX',
    logo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    slug: 'ironfx',
    description: 'Forex and CFD trading with competitive spreads'
  },
  {
    name: 'FXTM',
    logo: 'https://images.pexels.com/photos/7876439/pexels-photo-7876439.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    slug: 'fxtm',
    description: 'Educational resources and user-friendly platforms'
  },
  {
    name: 'Pepperstone',
    logo: 'https://images.pexels.com/photos/8370578/pexels-photo-8370578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    slug: 'pepperstone',
    description: 'Ultra-low spreads and institutional-grade liquidity'
  },
  {
    name: 'IG',
    logo: 'https://images.pexels.com/photos/8370724/pexels-photo-8370724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    slug: 'ig',
    description: 'Wide range of trading instruments and markets'
  },
  {
    name: 'XM',
    logo: 'https://images.pexels.com/photos/6771985/pexels-photo-6771985.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    slug: 'xm',
    description: 'Ultra-low minimum deposit and multi-account options'
  },
  {
    name: 'eToro',
    logo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    slug: 'etoro',
    description: 'Pioneer in social trading and copy trading features'
  },
  {
    name: 'Interactive Brokers',
    logo: 'https://images.pexels.com/photos/8370578/pexels-photo-8370578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    slug: 'interactive-brokers',
    description: 'Comprehensive research and advanced trading platforms'
  },
  {
    name: 'Saxo Bank',
    logo: 'https://images.pexels.com/photos/8370724/pexels-photo-8370724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    slug: 'saxo-bank',
    description: 'Premium research and institutional-grade platforms'
  },
  {
    name: 'OANDA',
    logo: 'https://images.pexels.com/photos/8370578/pexels-photo-8370578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    slug: 'oanda',
    description: 'Transparent pricing and excellent educational resources'
  },
  {
    name: 'AvaTrade',
    logo: 'https://images.pexels.com/photos/7876439/pexels-photo-7876439.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    slug: 'avatrade',
    description: 'Multi-regulated globally with wide range of platforms'
  }
];

export function SearchDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<typeof brokerData>([]);
  const router = useRouter();

  // Handle search input changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filteredResults = brokerData.filter(broker => 
      broker.name.toLowerCase().includes(query) || 
      broker.description.toLowerCase().includes(query)
    );
    
    setResults(filteredResults);
  }, [searchQuery]);

  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim() === '') return;
    
    // If we have results and user presses enter, navigate to the first result
    if (results.length > 0) {
      router.push(`/broker/${results[0].slug}`);
      setOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Search Brokers
          </DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input
                placeholder="Search for brokers..."
                className="pl-10 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>
        </div>
        
        {results.length > 0 && (
          <div className="max-h-[400px] overflow-y-auto p-2">
            {results.map((broker) => (
              <Link
                key={broker.slug}
                href={`/broker/${broker.slug}`}
                onClick={() => {
                  setOpen(false);
                  setSearchQuery('');
                }}
                className="flex items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="h-10 w-20 relative mr-3 bg-gray-100 dark:bg-gray-800 rounded">
                  <Image
                    src={broker.logo}
                    alt={broker.name}
                    fill
                    style={{ objectFit: "contain" }}
                    className="p-1"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{broker.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{broker.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>
            ))}
          </div>
        )}
        
        {searchQuery && results.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No brokers found matching "{searchQuery}"
          </div>
        )}
        
        <div className="p-4 border-t text-xs text-gray-500 dark:text-gray-400">
          Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">Enter</kbd> to navigate to the first result
        </div>
      </DialogContent>
    </Dialog>
  );
}
