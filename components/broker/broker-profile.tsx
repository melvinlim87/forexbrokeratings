"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Award, Shield, Check, X, ChevronDown, ChevronUp, Info, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Define the type for the scores object
interface Scores {
  [key: string]: number;
}

// Define the type for the broker data
interface BrokerData {
  name: string;
  logo: string;
  rating: number;
  minDeposit: number;
  summary: string;
  tradingInfo: Record<string, unknown>;
  tradingFeatures: Record<string, unknown>;
  fees: {
    trading: Record<string, unknown>;
    nonTrading: Record<string, unknown>;
  };
  depositWithdrawal: {
    methods: string[];
    depositTime: string;
    withdrawalTime: string;
    baseCurrencies: string[];
  };
  regulation: {
    primary: string;
    additional: string[];
    clientFunds: string;
    investorCompensation: string;
  };
  customerSupport: {
    channels: string[];
    hours: string;
    responseTime: string;
    languages: string[];
  };
  scores: Scores;
  pros: string[];
  cons: string[];
}

interface BrokerProfileProps {
  brokerData: BrokerData;
  relatedBrokers: any[];
}

export default function BrokerProfile({ brokerData, relatedBrokers }: BrokerProfileProps) {
  const [openSection, setOpenSection] = useState<string | null>('overview');

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
      {/* Hero Section */}
      <div className="bg-metallic pt-28 pb-16 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2 }}
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
                <div className="h-16 w-32 relative bg-white/10 backdrop-blur-sm rounded p-2">
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
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-5 w-5",
                              i < Math.floor(brokerData.rating)
                                ? "text-amber-500 fill-amber-500"
                                : "text-gray-300 dark:text-gray-600"
                            )}
                          />
                        ))}
                      </div>
                      <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                        {brokerData.rating}
                      </span>
                    </div>
                    <Badge variant="outline" className="ml-3 bg-white/10 backdrop-blur-sm">
                      Min ${brokerData.minDeposit}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl">
                {brokerData.summary}
              </p>
            </div>
            
            <div className="flex flex-col gap-3 min-w-[200px]">
              <Button size="lg" className="w-full bg-gradient-to-br from-gray-700 to-gray-900 text-white border-0 shadow-metallic hover:shadow-metallic-hover">
                Visit Broker
              </Button>
              <Button size="lg" variant="outline" className="w-full">
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
                      {Object.entries(brokerData.tradingInfo).map(([key, value]: [string, unknown]) => (
                        <li key={key} className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="font-medium">{renderValue(value)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Trading Features */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Trading Features</h3>
                    <ul className="space-y-2">
                      {Object.entries(brokerData.tradingFeatures).map(([key, value]: [string, unknown]) => (
                        <li key={key} className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          {typeof value === 'boolean' ? (
                            value ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : (
                              <X className="h-5 w-5 text-red-500" />
                            )
                          ) : (
                            <span className="font-medium">{renderValue(value)}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            {/* Fees Section */}
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
                <h2 className="text-2xl font-semibold mb-4">Fees & Commissions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Trading Fees</h3>
                    <ul className="space-y-2">
                      {Object.entries(brokerData.fees.trading).map(([key, value]) => (
                        <li key={key} className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            {key.charAt(0).toUpperCase() + key.slice(1).  replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="font-medium">{renderValue(value)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-3">Non-Trading Fees</h3>
                    <ul className="space-y-2">
                      {Object.entries(brokerData.fees.nonTrading).map(([key, value]) => (
                        <li key={key} className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="font-medium">{renderValue(value)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            {/* Deposit & Withdrawal Section */}
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
                <h2 className="text-2xl font-semibold mb-4">Deposits & Withdrawals</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Payment Methods</h3>
                    <div className="flex flex-wrap gap-2">
                      {brokerData.depositWithdrawal.methods.map((method: string) => (
                        <Badge key={method} variant="secondary" className="bg-gray-100 dark:bg-gray-800">
                          {method}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Processing Times</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-gray-600 dark:text-gray-400">Deposits: </span>
                          <span className="ml-2 font-medium">{brokerData.depositWithdrawal.depositTime}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-gray-600 dark:text-gray-400">Withdrawals: </span>
                          <span className="ml-2 font-medium">{brokerData.depositWithdrawal.withdrawalTime}</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Base Currencies</h3>
                      <div className="flex flex-wrap gap-2">
                        {brokerData.depositWithdrawal.baseCurrencies.map((currency: string) => (
                          <Badge key={currency} variant="outline">
                            {currency}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Regulation Section */}
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
                <h2 className="text-2xl font-semibold mb-4">Regulation & Security</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Primary Regulator</h3>
                    <p className="font-medium">{brokerData.regulation.primary}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Additional Regulations</h3>
                    <div className="flex flex-wrap gap-2">
                      {brokerData.regulation.additional.map((reg: string) => (
                        <Badge key={reg} variant="secondary" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                          {reg}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Security Features</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Shield className="h-5 w-5 text-green-500 mr-2" />
                        <span>{brokerData.regulation.clientFunds}</span>
                      </li>
                      <li className="flex items-center">
                        <Shield className="h-5 w-5 text-green-500 mr-2" />
                        <span>{brokerData.regulation.investorCompensation}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            {/* Customer Support Section */}
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
                <h2 className="text-2xl font-semibold mb-4">Customer Support</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Contact Channels</h3>
                    <ul className="space-y-2">
                      {brokerData.customerSupport.channels.map((channel: string) => (
                        <li key={channel} className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <span>{channel}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-3">Support Details</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-gray-600 dark:text-gray-400">Hours: </span>
                        <span className="ml-2 font-medium">{brokerData.customerSupport.hours}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gray-600 dark:text-gray-400">Response Time: </span>
                        <span className="ml-2 font-medium">{brokerData.customerSupport.responseTime}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gray-600 dark:text-gray-400">Languages: </span>
                        <span className="ml-2 font-medium">{brokerData.customerSupport.languages.join(', ')}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
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
                <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full bg-gradient-to-br from-gray-700 to-gray-900 text-white border-0 shadow-metallic hover:shadow-metallic-hover">
                    Open Account
                  </Button>
                  <Button variant="outline" className="w-full">
                    Try Demo Account
                  </Button>
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
                  {Object.entries(brokerData.scores).map(([key, value]: [string, unknown]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="font-medium">{value as number}/5</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                          style={{ width: `${(Number(value) / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Pros & Cons */}
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
                <h3 className="text-xl font-semibold mb-4">Pros & Cons</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-medium text-green-600 dark:text-green-500 mb-2">Pros</h4>
                    <ul className="space-y-2">
                      {brokerData.pros.map((pro: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-red-600 dark:text-red-500 mb-2">Cons</h4>
                    <ul className="space-y-2">
                      {brokerData.cons.map((con: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <X className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
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
                    <Link key={broker.id} href={`/broker/${broker.slug}`}>
                      <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <div className="h-10 w-20 relative bg-gray-100 dark:bg-gray-800 rounded mr-3">
                          {broker.logo ? (
                            <Image
                              src={broker.logo}
                              alt={broker.name}
                              fill
                              style={{ objectFit: "contain" }}
                              className="p-1"
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