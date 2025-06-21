'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface HexagonChartProps {
  data: {
    label: string;
    value: number;
    maxValue: number;
  }[];
  size?: number;
  className?: string;
}

export function HexagonChart({ data, size = 200, className }: HexagonChartProps) {
  const center = size / 2;
  const radius = size * 0.4;
  const angle = (2 * Math.PI) / data.length;

  // Calculate hexagon points
  const points = Array.from({ length: 6 }).map((_, i) => {
    const x = center + radius * Math.cos(i * angle - Math.PI / 2);
    const y = center + radius * Math.sin(i * angle - Math.PI / 2);
    return { x, y };
  });

  // Calculate data points
  const dataPoints = data.map((item, i) => {
    const valueRadius = (item.value / item.maxValue) * radius * 0.9; // 90% of max radius
    const angleRad = i * angle - Math.PI / 2;
    return {
      x: center + valueRadius * Math.cos(angleRad),
      y: center + valueRadius * Math.sin(angleRad),
      label: item.label,
      value: item.value,
    };
  });

  // Create polygon points string
  const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');
  const dataPolygonPoints = [...dataPoints, dataPoints[0]]
    .map(p => `${p.x},${p.y}`)
    .join(' ');

  return (
    <div className={cn('relative', className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background hexagon */}
        <polygon
          points={polygonPoints}
          className="fill-none stroke-indigo-600 dark:stroke-indigo-600"
          strokeWidth="1"
        />

        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((scale, i) => {
          const scaledPoints = points.map(p => ({
            x: center + (p.x - center) * scale,
            y: center + (p.y - center) * scale,
          }));
          const pointsStr = scaledPoints.map(p => `${p.x},${p.y}`).join(' ');
          return (
            <polygon
              key={i}
              points={pointsStr}
              className="fill-none stroke-indigo-300 dark:stroke-indigo-300"
            />
          );
        })}

        {/* Data area with gradient */}
        <defs>
          <linearGradient id="hexagon-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#409eff"/>
            <stop offset="100%" stopColor="#a166f4"/>
          </linearGradient>
        </defs>
        <polygon
          points={dataPolygonPoints}
          fill="url(#hexagon-gradient)"
          stroke="#409eff"
          strokeWidth="1.5"
        />

        {/* Data points */}
        {dataPoints.map((point, i) => (
          <g key={i}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              className="fill-indigo-500 dark:fill-indigo-500"
            />
            <text
              x={point.x}
              y={point.y - 8}
              textAnchor="middle"
              className="text-[10px] font-medium fill-black dark:fill-black"
            >
              {point.label}
            </text>
            <text
              x={point.x}
              y={point.y + 20}
              textAnchor="middle"
              className="text-xs fill-black dark:fill-black"
            >
              {point.value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
