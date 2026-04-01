"use client";

import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

type OperationStatus = 'active' | 'ceased' | 'under_review';

interface StateBadgeProps {
  status: OperationStatus;
  since?: string;
}

const STATUS_CONFIG: Record<string, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: typeof CheckCircle;
}> = {
  active: {
    label: 'Actively Operating',
    color: 'text-emerald-700 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    icon: CheckCircle,
  },
  ceased: {
    label: 'Ceased Operations',
    color: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    icon: XCircle,
  },
  under_review: {
    label: 'Under Review',
    color: 'text-amber-700 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    borderColor: 'border-amber-200 dark:border-amber-800',
    icon: AlertTriangle,
  },
};

export function StateBadge({ status, since }: StateBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.active;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-base font-semibold border ${config.bgColor} ${config.color} ${config.borderColor}`}
    >
      <Icon className="h-4 w-4" />
      {config.label}
      {since && <span className="opacity-70 font-normal ml-1">since {since}</span>}
    </span>
  );
}
