"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Gift, Timer, ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Sample data - would come from API in real implementation
const promotions = [
  {
    id: 1,
    broker: 'XM',
    logo: 'https://images.pexels.com/photos/6771985/pexels-photo-6771985.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: '30% Welcome Bonus',
    description: 'Get up to $700 bonus on your first deposit',
    terms: [
      'Minimum deposit: $5',
      'Maximum bonus: $700',
      'Trading requirement: 5 standard lots',
      'Time limit: 30 days'
    ],
    validUntil: '2026-06-30',
    slug: 'xm'
  },
  {
    id: 2,
    broker: 'FXTM',
    logo: 'https://images.pexels.com/photos/7876439/pexels-photo-7876439.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: '100% Trading Bonus',
    description: 'Double your deposit up to $1000',
    terms: [
      'Minimum deposit: $100',
      'Maximum bonus: $1000',
      'Trading requirement: 10 standard lots',
      'Time limit: 60 days'
    ],
    validUntil: '2026-07-15',
    slug: 'fxtm'
  },
  {
    id: 3,
    broker: 'IronFX',
    logo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: 'Cashback Program',
    description: '$8 per standard lot traded',
    terms: [
      'Minimum deposit: $500',
      'Maximum cashback: Unlimited',
      'Trading requirement: 1 standard lot',
      'Monthly payout'
    ],
    validUntil: '2026-12-31',
    slug: 'ironfx'
  },
  {
    id: 4,
    broker: 'Pepperstone',
    logo: 'https://images.pexels.com/photos/8370578/pexels-photo-8370578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: 'Active Trader Program',
    description: 'Up to 15% commission rebates',
    terms: [
      'Minimum volume: 100 lots/month',
      'Progressive rebate tiers',
      'Monthly rewards',
      'VIP account service'
    ],
    validUntil: '2026-12-31',
    slug: 'pepperstone'
  }
];

export default function PromotionsSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="py-8 bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/20 dark:to-gray-950">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
            <Gift className="h-6 w-6 text-amber-600 dark:text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Top Broker Promotions
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Exclusive bonuses and rewards from leading forex brokers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {promotions.map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredCard(promo.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
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
                  "shadow-md hover:shadow-lg transition-all duration-300"
                )}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-20 relative bg-gray-100 dark:bg-gray-800 rounded">
                      <Image
                        src={promo.logo}
                        alt={promo.broker}
                        layout="fill"
                        objectFit="contain"
                        className="p-1"
                      />
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <ul className="text-sm space-y-1">
                            {promo.terms.map((term, i) => (
                              <li key={i}>{term}</li>
                            ))}
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {promo.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {promo.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <Timer className="h-4 w-4 mr-1" />
                    <span>Valid until {new Date(promo.validUntil).toLocaleDateString()}</span>
                  </div>

                  <Button className="w-full" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      Claim Bonus <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/promotions">
              View All Promotions <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}