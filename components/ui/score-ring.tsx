'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScoreRingProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
}

export default function ScoreRing({
  score,
  maxScore = 10,
  size = 44,
  strokeWidth = 3,
  className,
  showLabel = true,
}: ScoreRingProps) {
  const normalizedScore = (score / maxScore) * 100;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  // Color based on score
  const getColor = (score: number) => {
    if (score >= 9) return { stroke: '#10b981', bg: 'bg-emerald-50', text: 'text-emerald-600' }; // emerald
    if (score >= 8) return { stroke: '#3b82f6', bg: 'bg-blue-50', text: 'text-blue-600' }; // blue
    if (score >= 7) return { stroke: '#f59e0b', bg: 'bg-amber-50', text: 'text-amber-600' }; // amber
    return { stroke: '#ef4444', bg: 'bg-red-50', text: 'text-red-600' }; // red
  };

  const color = getColor(score);

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Score ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
        />
      </svg>
      {showLabel && (
        <div className={cn('absolute inset-0 flex items-center justify-center')}>
          <span className={cn('text-xs font-bold', color.text)}>
            {score.toFixed(1)}
          </span>
        </div>
      )}
    </div>
  );
}
