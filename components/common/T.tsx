'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n-client';

export default function T({ k, as: Tag = 'span', className }: { k: string; as?: keyof JSX.IntrinsicElements; className?: string }) {
  const { t } = useI18n();
  return <Tag className={className}>{t(k)}</Tag>;
}
