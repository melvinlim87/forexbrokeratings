'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface HexagonChartProps {
  data: {
    label: string;
    value: number;
    maxValue: number;
  }[][]; // Array of datasets (each dataset is an array of points)
  size?: number;
  className?: string;
  showBg?: boolean;
  strokeColors?: string[]; // Array of stroke colors, one per dataset
}

export function HexagonChart({ data, size = 200, className, showBg = true, strokeColors }: HexagonChartProps) {
  const center = size / 2;
  const radius = size * 0.4;
  // Always 6 axes
  const angle = (2 * Math.PI) / 6;

  // Calculate hexagon points (for grid)
  const points = Array.from({ length: 6 }).map((_, i) => {
    const x = center + radius * Math.cos(i * angle - Math.PI / 2);
    const y = center + radius * Math.sin(i * angle - Math.PI / 2);
    return { x, y };
  });

  // Animation state
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    let start: number | null = null;
    const duration = 900; // ms
    function animate(ts: number) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);
      if (p < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    }
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [data]);

  // Default colors for up to 3 overlays
  const defaultStrokeColors = ["#00c7d4", "#f59e42", "#7c3aed"];
  const usedStrokeColors = strokeColors && strokeColors.length > 0 ? strokeColors : defaultStrokeColors;

  // If only one dataset, treat it as single chart for backward compatibility
  const datasets = Array.isArray(data[0]) ? (data as HexagonChartProps["data"]) : [data as HexagonChartProps["data"][0]];

  // Create grid
  const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');

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

        {/* Data polygons */}
        <defs>
          <linearGradient id="hexagon-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#409eff"/>
            <stop offset="100%" stopColor="#a166f4"/>
          </linearGradient>
        </defs>
        {datasets.map((dataset, idx) => {
          // Animate each dataset
          const dataPoints = dataset.map((item, i) => {
            const animatedValue = item.value * progress;
            const valueRadius = (animatedValue / item.maxValue) * radius * 0.9;
            const angleRad = i * angle - Math.PI / 2;
            return {
              x: center + valueRadius * Math.cos(angleRad),
              y: center + valueRadius * Math.sin(angleRad),
              label: item.label,
              value: animatedValue.toFixed(2),
            };
          });
          const dataPolygonPoints = [...dataPoints, dataPoints[0]].map(p => `${p.x},${p.y}`).join(' ');
          return (
            <polygon
              key={idx}
              points={dataPolygonPoints}
              fill={showBg && idx === 0 ? "url(#hexagon-gradient)" : "transparent"}
              stroke={usedStrokeColors[idx] || defaultStrokeColors[idx]}
              strokeWidth={idx === 0 ? 2 : 1.5}
              style={{ transition: 'stroke 0.3s' }}
            />
          );
        })}

        {/* Data points and labels for the first dataset */}
        {(() => {
          const dataset = datasets[0];
          const dataPoints = dataset.map((item, i) => {
            const animatedValue = item.value * progress;
            const valueRadius = (animatedValue / item.maxValue) * radius * 0.9;
            const angleRad = i * angle - Math.PI / 2;
            return {
              x: center + valueRadius * Math.cos(angleRad),
              y: center + valueRadius * Math.sin(angleRad),
              label: item.label,
              value: animatedValue.toFixed(2),
            };
          });
          return dataPoints.map((point, i) => (
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
              {datasets.length == 1 && (
                <text 
                  x={point.x}
                  y={point.y + 20}
                  textAnchor="middle"
                  className="text-xs fill-black dark:fill-black"
                >
                  {point.value}
                </text>
              )}
            </g>
          ));
        })()}
      </svg>
    </div>
  );
}
