import { BrokerPromotion } from "@/app/promotions/page";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Gift } from "lucide-react";
import PromotionCard from "@/components/promotions/PromotionCard";

interface BrokerPromotionsCardProps {
  brokerName: string;
  brokerLogo?: string | null;
  promotions: BrokerPromotion[];
  hoveredCard: string | null;
  setHoveredCard: (id: string | null) => void;
}

export default function BrokerPromotionsCard({
  brokerName,
  brokerLogo,
  promotions,
  hoveredCard,
  setHoveredCard,
}: BrokerPromotionsCardProps) {
  return (
    <Card className="overflow-hidden bg-white border border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          {brokerLogo ? (
            <div className="relative h-8 w-8 flex-shrink-0">
              <Image
                src={brokerLogo}
                alt={`${brokerName} logo`}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <Gift className="h-4 w-4 text-gray-500" />
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-900">
            {brokerName}
          </h3>
          <span className="ml-auto bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {promotions.length} {promotions.length === 1 ? 'promotion' : 'promotions'}
          </span>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {promotions.map((promo, index) => (
          <div key={promo.id} className="p-4 hover:bg-gray-50 transition-colors">
            <PromotionCard 
              promo={promo} 
              index={index}
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
              hideBrokerInfo={true}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
