"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/lib/i18n-client';
import { Zap, ChevronRight, ArrowRight, Star } from 'lucide-react';

export interface Tool {
  id: number;
  titleKey: string;
  categoryKey: string;
  icon: React.ReactNode;
  descriptionKey: string;
  featureKeys: string[];
  rating: number;
  reviews: number;
  popular?: boolean;
  slug: string;
  href?: string;
  disabled: boolean;
}

export default function ToolCard({
  tool,
  index,
  hoveredCard,
  setHoveredCard,
}: {
  tool: Tool;
  index: number;
  hoveredCard: number | null;
  setHoveredCard: (id: number | null) => void;
}) {
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onMouseEnter={() => setHoveredCard(tool.id)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div className="relative h-full">
        <Card className={`h-full hover:shadow-md transition-all duration-300 ${tool.disabled ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-50 p-2 rounded-full">{tool.icon}</div>
              <span className="ml-2 text-sm font-medium text-blue-600">{t(tool.categoryKey)}</span>
              <div className="ml-auto flex items-center text-sm text-gray-500">
                <Zap className="h-4 w-4 mr-1" />
                <span>{t('ai.ai_powered')}</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">{t(tool.titleKey)}</h3>
            <p className="text-gray-600 mb-4">{t(tool.descriptionKey)}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {tool.featureKeys.slice(0, 2).map((featureKey, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {t(featureKey)}
                </Badge>
              ))}
              {tool.featureKeys.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{tool.featureKeys.length - 2} {t('ai.more')}
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="ml-1 text-sm font-medium">{tool.rating}</span>
                <span className="ml-1 text-xs text-gray-500">({tool.reviews})</span>
              </div>
              {tool.disabled === false ? (
                <Button variant="default" asChild>
                  <Link href={tool.href ?? ''}>
                    {t('ai.launch')} <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <div className="flex items-center text-gray-400 font-medium">
                  <span className="mr-2">{t('ai.coming_soon')}</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </div>
            {tool.disabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-lg">
                <span className="text-xl font-bold text-yellow-700">{t('ai.coming_soon')}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
