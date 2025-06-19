import { motion } from "framer-motion";
import { ArrowRight, Gift, Timer } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BrokerPromotion } from "@/app/promotions/page";

interface PromotionCardProps {
  promo: BrokerPromotion;
  index: number;
  hoveredCard: string | null;
  setHoveredCard: (id: string | null) => void;
  hideBrokerInfo?: boolean;
}

export default function PromotionCard({ 
  promo, 
  index, 
  hoveredCard, 
  setHoveredCard, 
  hideBrokerInfo = false 
}: PromotionCardProps) {
  // Format terms from condition if terms array is not provided
  const terms = promo.terms || (promo.condition ? [promo.condition] : ['No specific terms provided.']);

  // If hideBrokerInfo is true, show a simplified card without broker info
  if (hideBrokerInfo) {
    return (
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-gray-900 dark:text-white">{promo.title}</h3>
          {promo.category && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 whitespace-nowrap">
              {promo.category}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-2">
          {promo.description}
        </p>
        <div className="flex justify-end">
          <Button variant="link" size="sm" className="p-0 h-auto text-sm" asChild>
            <a href={promo.url} target="_blank" rel="noopener noreferrer">
              View Details <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    );
  }

  // Original card with broker info
  const brokerName = promo.broker_name || 'Broker';
  const brokerLogo = promo.broker_logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(brokerName)}&background=random`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="h-full"
    >
      <Card 
        className={cn(
          "h-full flex flex-col overflow-hidden transition-all duration-300",
          hoveredCard === promo.id 
            ? "ring-2 ring-amber-500 shadow-lg scale-[1.02]" 
            : "hover:shadow-md"
        )}
        onMouseEnter={() => setHoveredCard(promo.id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <CardContent className="p-0 flex flex-col h-full">
          {!hideBrokerInfo && (
            <div className="p-6 pb-4 flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="relative h-10 w-10 flex-shrink-0">
                    <Image
                      src={brokerLogo}
                      alt={`${brokerName} logo`}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {brokerName}
                    </h3>
                  </div>
                </div>
                
                {promo.featured && (
                  <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-xs font-medium px-2 py-0.5 rounded-full">
                    Featured
                  </div>
                )}
              </div>

              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {promo.title}
              </h4>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                {promo.description}
              </p>

              <div className="space-y-2 mb-4">
                {terms.length > 0 && (
                  <div className="text-sm">
                    <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Terms:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                      {terms.slice(0, 3).map((term, i) => (
                        <li key={i} className="text-sm">{term}</li>
                      ))}
                      {terms.length > 3 && (
                        <li className="text-sm font-medium text-amber-600 dark:text-amber-400">
                          +{terms.length - 3} more terms
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="px-6 pb-6 pt-2">
            <Button className="w-full" asChild>
              <a 
                href={promo.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                Claim Offer <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
