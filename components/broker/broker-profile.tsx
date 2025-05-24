"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Shield, Check, X, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function BrokerProfile({ brokerData, relatedBrokers }: any) {
  const [openSection, setOpenSection] = useState<string | null>('overview');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
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
                  <Image
                    src={brokerData.logo}
                    alt={brokerData.name}
                    layout="fill"
                    objectFit="contain"
                  />
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
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Section */}
            <Card className="overflow-hidden bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40 backdrop-blur-sm border-0 shadow-metallic">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Broker Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Trading Info */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Trading Information</h3>
                    <ul className="space-y-2">
                      {Object.entries(brokerData.tradingInfo).map(([key, value]: [string, any]) => (
                        <li key={key} className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="font-medium">{value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Trading Features */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Trading Features</h3>
                    <ul className="space-y-2">
                      {Object.entries(brokerData.tradingFeatures).map(([key, value]: [string, any]) => (
                        <li key={key} className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          {typeof value === 'boolean' ? (
                            value ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : (
                              <X className="h-5 w-5 text-red-500" />
                            )
                          ) : (
                            <span className="font-medium">{value}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            {/* Additional sections would go here */}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40 backdrop-blur-sm border-0 shadow-metallic">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
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

            {/* Additional sidebar components would go here */}
          </div>
        </div>
      </div>
    </div>
  );
}