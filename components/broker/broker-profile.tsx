"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Award, Shield, Check, X, ChevronDown, ChevronUp, Info, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HexagonChart } from './hexagon-chart';
import { cn } from '@/lib/utils';
import { BrokerDetails } from '@/lib/supabase';

// Define the type for the scores object
interface Scores {
  [key: string]: number;
}

// Define the type for the broker data
interface BrokerData {
  id: number;
  created_at: string;
  name: string;
  source: string;
  website: string;
  logo: string;
  image: string | null;
  description: string;
  summary: string;
  rating: string;
  year_published: string;
  headquarters: string;
  country: string;
  offices: string[];
  employees: number | null;
  address: string;
  regulators: string[];
  licenses: string[];
  is_regulated: boolean;
  instruments: string[];
  spread_eur_usd: string;
  leverage_max: string;
  account_types: string[];
  base_currencies: string[];
  platforms: string[];
  deposit_methods: string[];
  withdraw_methods: string[];
  min_deposit: string;
  min_withdrawl: string;
  deposit_fees: string | null;
  withdrawal_fees: string | null;
  deposit_process_time: string;
  withdrawal_process_time: string;
  languages: string[];
  availability: string;
  channels: string[] | null;
  phone_numbers: string[];
  email: string;
  response_time: string;
  pros: string[];
  cons: string[];
  sw: number;
  regulations: number;
  risk_control: number;
  promotions: number;
  user_experience: number;
  environment: number;
}

interface BrokerProfileProps {
  brokerData: BrokerDetails;
  relatedBrokers: any[];
}

export default function BrokerProfile({ brokerData, relatedBrokers }: BrokerProfileProps) {
  const [openSection, setOpenSection] = useState<string | null>('overview');
  console.log('checking current broker data',brokerData)
  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Helper function to safely render any value type
  const renderValue = (value: unknown): string => {
    if (typeof value === 'boolean') {
      return String(value);
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (value === null || value === undefined) {
      return '-';
    }
    return String(value);
  };

  return (
    <div className="min-h-screen">
      <div className="bg-metallic pt-28 pb-16 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-20 w-20 relative bg-white backdrop-blur-sm rounded p-2">
                {brokerData.logo ? (
                  <Image
                    src={brokerData.logo}
                    alt={brokerData.name}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                ) : 
                  null
                }
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {brokerData.name} Review
                  </h1>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-3 py-1.5">
                        <div className="flex space-x-0.5">
                          {[1, 2, 3, 4, 5].map((star) => {
                          const rating = parseFloat(brokerData.rating) || 0;
                          return (
                            <Star
                              key={star}
                              className={cn(
                                "h-5 w-5",
                                star <= Math.floor(rating)
                                  ? "text-amber-500 fill-amber-500"
                                  : "text-gray-300 dark:text-gray-600"
                              )}
                            />
                          );
                        })}
                        <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                          {brokerData.rating}
                        </span>
                        </div>
                      </div>
                    <Badge variant="outline" className="ml-3 bg-white/10 backdrop-blur-sm">
                      {brokerData.min_deposit || 'N/A'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl">
                {brokerData.summary}
              </p>
            </div>
            
            <div className="flex flex-col gap-3 min-w-[200px]">
                <Link 
                  href={brokerData.website || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full"
                >
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-br from-gray-700 to-gray-900 text-white border-0 shadow-metallic hover:shadow-metallic-hover"
                    disabled={!brokerData.website}
                  >
                    {brokerData.website ? `Visit ${brokerData.name}` : 'Website Not Available'}
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full"
                  onClick={async () => {
                    if (typeof window === 'undefined') return;
                    
                    try {
                      // Dynamically import the compare-utils
                      const { setCompareSelection } = await import('@/components/broker/compare-utils');
                      
                      // Prepare broker data to be stored
                      const brokerInfo = {
                        id: brokerData.id?.toString(),
                        name: brokerData.name,
                        logo: brokerData.logo,
                        rating: brokerData.rating,
                        spread_eur_usd: brokerData.spread_eur_usd,
                        leverage_max: brokerData.leverage_max,
                        regulators: brokerData.regulators,
                        min_deposit: brokerData.min_deposit
                      };
                      
                      // Store the broker data in localStorage
                      localStorage.setItem('compare_broker_data', JSON.stringify([brokerInfo]));
                      
                      // Also save the ID for backward compatibility
                      if (brokerData.id) {
                        setCompareSelection(brokerData.id.toString());
                      }
                      
                      // Redirect to compare page
                      window.location.href = '/compare';
                    } catch (error) {
                      console.error('Error preparing comparison:', error);
                      // Fallback to simple redirect if there's an error
                      window.location.href = '/compare';
                    }
                  }}
                >
                  Add to Compare
                </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card 
              className={cn(
                "overflow-hidden relative",
                "bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40",
                "backdrop-blur-sm",
                "border-0",
                "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]",
                "before:absolute before:inset-0 before:p-[1px] before:rounded-lg before:-z-10",
                "before:bg-gradient-to-br before:from-gray-300 before:via-gray-100 before:to-gray-400",
                "dark:before:from-gray-600 dark:before:via-gray-700 dark:before:to-gray-800",
                "after:absolute after:inset-0 after:p-[1px] after:rounded-lg after:-z-20",
                "after:bg-gradient-to-br after:from-black/20 after:via-black/10 after:to-transparent",
                "dark:after:from-black/30 dark:after:via-black/20 dark:after:to-transparent",
                "shadow-metallic hover:shadow-metallic-hover transition-all duration-300"
              )}
            >
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Broker Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Trading Info */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Trading Information</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-green-400">Minimum Deposit</span>
                        <span className="font-medium">{brokerData.min_deposit || 'N/A'}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-blue-400">Maximum Leverage</span>
                        <span className="font-medium">{brokerData.leverage_max || 'N/A'}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">EUR/USD Spread</span>
                        <span className="font-medium text-cyan-600">{brokerData.spread_eur_usd || 'N/A'}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Trading Platforms</span>
                        <span className="font-medium text-right">
                          {brokerData.platforms?.length ? brokerData.platforms.join(', ') : 'N/A'}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Instruments</span>
                        <span className="font-medium text-right">
                          {brokerData.instruments?.length ? brokerData.instruments.join(', ') : 'N/A'}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Year Established</span>
                        <span className="font-medium">{brokerData.year_published || 'N/A'}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Account & Support */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Account & Support</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Account Types</span>
                        <div>
                          {brokerData.account_types?.map((account_type, index) => (
                            <span key={index} className="bg-white text-black px-2 mx-0.5 py-0.5 rounded text-xs font-medium border border-cyan-700" style={{borderRadius: '1.25rem'}}>{account_type}</span>
                          )) }
                        </div>
                        {/* <span className="font-medium text-right">
                          {brokerData.account_types?.length ? brokerData.account_types.join(', ') : 'N/A'}
                        </span> */}
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Base Currencies</span>
                        <div>
                          {brokerData.base_currencies?.map((base_currency, index) => (
                            <span key={index} className="bg-white text-black px-2 mx-0.5 py-0.5 rounded text-xs font-medium border border-cyan-700" style={{borderRadius: '1.25rem'}}>{base_currency}</span>
                          )) }
                        </div>
                        {/* <span className="font-medium text-right">
                          {brokerData.base_currencies?.length ? brokerData.base_currencies.join(', ') : 'N/A'}
                        </span> */}
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Customer Support</span>
                        <span className="font-medium">{brokerData.availability || 'N/A'}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Response Time</span>
                        <span className="font-medium">{brokerData.response_time || 'N/A'}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Languages</span>
                        <div>
                          {brokerData.languages?.map((language, index) => (
                            <span key={index} className="bg-white text-black px-2 mx-0.5 py-0.5 rounded text-xs font-medium border border-cyan-700" style={{borderRadius: '1.25rem'}}>{language}</span>
                          )) }
                        </div>
                        {/* <span className="font-medium text-right">
                          {brokerData.languages?.length ? brokerData.languages.join(', ') : 'N/A'}
                        </span> */}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            {/* Regulation & Safety */}
            <Card className="mt-6">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Regulation & Safety</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Regulatory Information</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Regulators</span>
                        <div>
                          {brokerData.regulators?.map((regulator, index) => (
                            <span key={index} className="bg-white text-black px-2 mx-0.5 py-0.5 rounded text-xs font-medium border border-cyan-700" style={{borderRadius: '1.25rem'}}>{regulator}</span>
                          )) }
                        </div>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Licenses</span>
                        <div>
                          {brokerData.licenses?.map((license, index) => (
                            <span key={index} className="bg-white text-black px-2 mx-0.5 py-0.5 rounded text-xs font-medium border border-cyan-700" style={{borderRadius: '1.25rem'}}>{license}</span>
                          )) }
                        </div>  
                        {/* <span className="font-medium text-right">
                          {brokerData.licenses?.length ? brokerData.licenses.join(', ') : 'N/A'}
                        </span> */}
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Headquarters</span>
                        <span className="font-medium text-right">{brokerData.headquarters || 'N/A'}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Regulation Status</span>
                        <span className="font-medium">
                          {brokerData.is_regulated ? (
                            <span className="text-green-600 dark:text-green-400 flex items-center">
                              <Shield className="h-4 w-4 mr-1" /> Regulated
                            </span>
                          ) : (
                            <span className="text-amber-600 dark:text-amber-400">Not Regulated</span>
                          )}
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Contact Information</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Email</span>
                        <span className="font-medium">
                          {brokerData.email ? (
                            <a href={`mailto:${brokerData.email}`} className="text-blue-600 hover:underline">
                              {brokerData.email}
                            </a>
                          ) : 'N/A'}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Phone</span>
                        <div className="flex flex-col items-end">
                          {brokerData.phone_numbers?.length ? (
                            brokerData.phone_numbers.map((phone, index) => (
                              <a 
                                key={index} 
                                href={`tel:${phone.replace(/\D/g, '')}`} 
                                className="text-blue-600 hover:underline block"
                              >
                                {phone}
                              </a>
                            ))
                          ) : 'N/A'}
                        </div>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Support Channels</span>
                        <div className="flex flex-col items-end">
                          {brokerData.channels?.length ? (
                            brokerData.channels.map((channel, index) => (
                              <span key={index} className="block">
                                {channel}
                              </span>
                            ))
                          ) : 'N/A'}
                        </div>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Availability</span>
                        <span className="font-medium">{brokerData.availability || 'N/A'}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Response Time</span>
                        <span className="font-medium">{brokerData.response_time || 'N/A'}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Address</span>
                        <span className="font-medium text-right">{brokerData.address || 'N/A'}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            {/* Deposit & Withdrawal */}
            <Card 
              className={cn(
                "overflow-hidden relative",
                "bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40",
                "backdrop-blur-sm",
                "border-0",
                "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]",
                "before:absolute before:inset-0 before:p-[1px] before:rounded-lg before:-z-10",
                "before:bg-gradient-to-br before:from-gray-300 before:via-gray-100 before:to-gray-400",
                "dark:before:from-gray-600 dark:before:via-gray-700 dark:before:to-gray-800",
                "after:absolute after:inset-0 after:p-[1px] after:rounded-lg after:-z-20",
                "after:bg-gradient-to-br after:from-black/20 after:via-black/10 after:to-transparent",
                "dark:after:from-black/30 dark:after:via-black/20 dark:after:to-transparent",
                "shadow-metallic hover:shadow-metallic-hover transition-all duration-300"
              )}
            >
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Deposit & Withdrawal</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Deposit Methods</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {brokerData.deposit_methods?.length ? (
                      brokerData.deposit_methods.map((method, index) => (
                          <span key={index} className="bg-white text-black px-2 mx-0.5 py-0.5 rounded text-xs font-medium border border-cyan-700" style={{borderRadius: '1.25rem'}}>{method}</span>                        ))
                      ) : (
                        <span className="text-gray-500">No deposit methods listed</span>
                      )}
                    </div>
                    <ul className="space-y-2">
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Minimum Deposit</span>
                        <span className="font-medium">
                          {brokerData.min_deposit ? `${brokerData.min_deposit}` : 'N/A'}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Processing Time</span>
                        <span className="font-medium">
                          {brokerData.deposit_process_time || 'Varies by method'}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Fees</span>
                        <span className="font-medium">
                          {brokerData.deposit_fees === '0' || !brokerData.deposit_fees 
                            ? 'No fees' 
                            : brokerData.deposit_fees}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Methods</span>
                        <div className="text-right">
                          {brokerData.deposit_methods?.length ? (
                            <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
                              {brokerData.deposit_methods.map((method, index) => (
                                <span key={index} className="bg-white text-black px-2 mx-0.5 py-0.5 rounded text-xs font-medium border border-cyan-700" style={{borderRadius: '1.25rem'}}>{method}</span>                        
                              ))}
                            </div>
                          ) : 'N/A'}
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Withdrawal Methods</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {brokerData.withdraw_methods?.length ? (
                        brokerData.withdraw_methods.map((method) => (
                          <Badge key={method} variant="outline" className="bg-gray-100 dark:bg-gray-800">
                            {method}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-500">No withdrawal methods listed</span>
                      )}
                    </div>
                    <ul className="space-y-2">
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Minimum Withdrawal</span>
                        <span className="font-medium">
                          {brokerData.min_withdrawl ? `${brokerData.min_withdrawl}` : 'N/A'}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Processing Time</span>
                        <span className="font-medium">
                          {brokerData.withdrawal_process_time || 'Varies by method'}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Fees</span>
                        <span className="font-medium">
                          {brokerData.withdrawal_fees === '0' || !brokerData.withdrawal_fees 
                            ? 'No fees' 
                            : brokerData.withdrawal_fees}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Methods</span>
                        <div className="text-right">
                          {brokerData.withdraw_methods?.length ? (
                            <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
                              {brokerData.withdraw_methods.map((method, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {method}
                                </Badge>
                              ))}
                            </div>
                          ) : 'N/A'}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            {/* Pros & Cons */}
            <Card className="mt-6">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Pros & Cons</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-green-600 dark:text-green-400">Pros</h3>
                    <ul className="space-y-2">
                      {brokerData.pros?.length ? (
                        brokerData.pros.map((pro, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{pro}</span>
                          </li>
                        ))
                      ) : (
                        <li>No pros available</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-red-600 dark:text-red-400">Cons</h3>
                    <ul className="space-y-2">
                      {brokerData.cons?.length ? (
                        brokerData.cons.map((con, index) => (
                          <li key={index} className="flex items-start">
                            <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{con}</span>
                          </li>
                        ))
                      ) : (
                        <li>No cons available</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>


          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Broker Metrics Hexagon Chart */}
            <Card 
              className={cn(
                "overflow-hidden relative",
                "bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40",
                "backdrop-blur-sm",
                "border-0",
                "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]",
                "before:absolute before:inset-0 before:p-[1px] before:rounded-lg before:-z-10",
                "before:bg-gradient-to-br before:from-gray-300 before:via-gray-100 before:to-gray-400",
                "dark:before:from-gray-600 dark:before:via-gray-700 dark:before:to-gray-800",
                "after:absolute after:inset-0 after:p-[1px] after:rounded-lg after:-z-20",
                "after:bg-gradient-to-br after:from-black/20 after:via-black/10 after:to-transparent",
                "dark:after:from-black/30 dark:after:via-black/20 dark:after:to-transparent",
                "shadow-metallic hover:shadow-metallic-hover transition-all duration-300"
              )}
            >
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-center">Broker Metrics</h3>
                <div className="flex justify-center">
                  <div className="p-[2px] rounded-xl bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500">
                    <div className="bg-white rounded-lg">
                      <HexagonChart 
                        data={[
                          { 
                            label: 'User Traffic', 
                            value: brokerData.sw,
                            maxValue: 5 
                          },
                          { 
                            label: 'Regulations', 
                            value: brokerData.regulations,
                            maxValue: 5 
                          },
                          { 
                            label: 'Risk Control', 
                            value: brokerData.risk_control,
                            maxValue: 5 
                          },
                          { 
                            label: 'Promotions', 
                            value: brokerData.promotions,
                            maxValue: 5 
                          },
                          { 
                            label: 'User Ratings', 
                            value: brokerData.user_experience,
                            maxValue: 5 
                          },
                          { 
                            label: 'Environment', 
                            value: brokerData.environment,
                            maxValue: 5 
                          },
                        ]} 
                        size={240}
                      />
                    </div>
                  </div>  
                </div>
                <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                  <p>Overall Rating: <span className="font-semibold text-foreground">
                    {(() => {
                      // Convert all values to numbers and filter out any invalid values
                      const metrics = [
                        parseFloat(brokerData.sw as any) || 0,
                        parseFloat(brokerData.regulations as any) || 0,
                        parseFloat(brokerData.risk_control as any) || 0,
                        parseFloat(brokerData.promotions as any) || 0,
                        parseFloat(brokerData.user_experience as any) || 0,
                        parseFloat(brokerData.environment as any) || 0
                      ];
                      
                      // Calculate average
                      const sum = metrics.reduce((a, b) => a + b, 0);
                      const avg = sum / metrics.length;
                      
                      // Format to 1 decimal place and ensure it's a valid number
                      return isNaN(avg) ? 'N/A' : avg.toFixed(1) + '/5';
                    })()}
                  </span></p>
                </div>
              </CardContent>
            </Card>
            
            {/* Overall Rating */}
            <Card 
              className={cn(
                "overflow-hidden relative",
                "bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40",
                "backdrop-blur-sm",
                "border-0",
                "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]",
                "before:absolute before:inset-0 before:p-[1px] before:rounded-lg before:-z-10",
                "before:bg-gradient-to-br before:from-gray-300 before:via-gray-100 before:to-gray-400",
                "dark:before:from-gray-600 dark:before:via-gray-700 dark:before:to-gray-800",
                "after:absolute after:inset-0 after:p-[1px] after:rounded-lg after:-z-20",
                "after:bg-gradient-to-br after:from-black/20 after:via-black/10 after:to-transparent",
                "dark:after:from-black/30 dark:after:via-black/20 dark:after:to-transparent",
                "shadow-metallic hover:shadow-metallic-hover transition-all duration-300"
              )}
            >
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Overall Rating</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Trust & Reliability
                    </span>
                    <span className="font-medium">{brokerData.rating}/5</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                      style={{ width: `${(parseFloat(brokerData.rating) / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            

            
            {/* Related Brokers */}
            <Card 
              className={cn(
                "overflow-hidden relative",
                "bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40",
                "backdrop-blur-sm",
                "border-0",
                "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]",
                "before:absolute before:inset-0 before:p-[1px] before:rounded-lg before:-z-10",
                "before:bg-gradient-to-br before:from-gray-300 before:via-gray-100 before:to-gray-400",
                "dark:before:from-gray-600 dark:before:via-gray-700 dark:before:to-gray-800",
                "after:absolute after:inset-0 after:p-[1px] after:rounded-lg after:-z-20",
                "after:bg-gradient-to-br after:from-black/20 after:via-black/10 after:to-transparent",
                "dark:after:from-black/30 dark:after:via-black/20 dark:after:to-transparent",
                "shadow-metallic hover:shadow-metallic-hover transition-all duration-300"
              )}
            >
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Similar Brokers</h3>
                <div className="space-y-4">
                  {relatedBrokers.map((broker: any) => (
                    <Link key={broker.id} href={`/broker/${broker.slug || broker.id}`}>
                      <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <div className="h-20 w-20 relative bg-white rounded-lg mr-3">
                          {broker.logo ? (
                            <Image
                              src={broker.logo}
                              alt={broker.name}
                              fill
                              style={{ objectFit: "contain" }}
                              className="rounded-lg bg-white"
                            /> ) : null}
                        </div>
                        <div>
                          <div className="font-medium">{broker.name}</div>
                          <div className="flex items-center text-sm">
                            <Award className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                            <span>{broker.rating}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
