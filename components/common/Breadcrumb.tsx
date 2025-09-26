'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n-client';

export type Crumb = {
  labelKey?: string; // i18n key
  label?: string;    // raw label string
  href?: string;     // no href for current page
};

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  const { t } = useI18n();
  const renderText = (item: Crumb) => (item.label ?? (item.labelKey ? t(item.labelKey) : ''));

  return (
    <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
      <ol className="list-reset flex">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center">
            {item.href ? (
              <Link href={item.href} className="hover:underline">
                {renderText(item)}
              </Link>
            ) : (
              <span aria-current="page">{renderText(item)}</span>
            )}
            {idx < items.length - 1 && <span className="mx-2">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
