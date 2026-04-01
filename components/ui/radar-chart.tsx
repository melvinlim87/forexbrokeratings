'use client';

import { cn } from '@/lib/utils';

interface RadarChartProps {
  brokers: Array<{
    name: string;
    color: string;
    scores: {
      fees: number;
      security: number;
      platforms: number;
      instruments: number;
      deposit: number;
      support: number;
    };
  }>;
  size?: number;
}

const AXES = [
  { key: 'fees', label: 'Fees', angle: 0 },
  { key: 'security', label: 'Security', angle: 60 },
  { key: 'platforms', label: 'Platforms', angle: 120 },
  { key: 'instruments', label: 'Instruments', angle: 180 },
  { key: 'deposit', label: 'Deposit', angle: 240 },
  { key: 'support', label: 'Support', angle: 300 },
] as const;

export default function RadarChart({ brokers, size = 280 }: RadarChartProps) {
  const center = size / 2;
  const radius = (size / 2) - 40;
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  function getPoint(angle: number, value: number) {
    const rad = (angle - 90) * (Math.PI / 180);
    const r = (value / 10) * radius;
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),
    };
  }

  function getPath(scores: RadarChartProps['brokers'][0]['scores']) {
    const values = AXES.map(a => scores[a.key] as number);
    const points = AXES.map((a, i) => getPoint(a.angle, values[i]));
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  }

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Grid levels */}
        {levels.map((level) => (
          <polygon
            key={level}
            points={AXES.map(a => {
              const p = getPoint(a.angle, level * 10);
              return `${p.x},${p.y}`;
            }).join(' ')}
            fill="none"
            stroke="currentColor"
            strokeWidth={0.5}
            className="text-gray-200 dark:text-gray-700"
          />
        ))}

        {/* Axis lines */}
        {AXES.map((a) => {
          const p = getPoint(a.angle, 10);
          return (
            <line
              key={a.key}
              x1={center}
              y1={center}
              x2={p.x}
              y2={p.y}
              stroke="currentColor"
              strokeWidth={0.5}
              className="text-gray-200 dark:text-gray-700"
            />
          );
        })}

        {/* Axis labels */}
        {AXES.map((a) => {
          const p = getPoint(a.angle, 11.5);
          return (
            <text
              key={a.key}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[10px] font-medium fill-gray-500 dark:fill-gray-400"
            >
              {a.label}
            </text>
          );
        })}

        {/* Broker data polygons */}
        {brokers.map((broker, bi) => (
          <g key={bi}>
            <polygon
              points={AXES.map(a => {
                const val = broker.scores[a.key] as number;
                const p = getPoint(a.angle, val);
                return `${p.x},${p.y}`;
              }).join(' ')}
              fill={broker.color}
              fillOpacity={0.15}
              stroke={broker.color}
              strokeWidth={2}
              strokeLinejoin="round"
            />
            {/* Data points */}
            {AXES.map((a) => {
              const val = broker.scores[a.key] as number;
              const p = getPoint(a.angle, val);
              return (
                <circle
                  key={a.key}
                  cx={p.x}
                  cy={p.y}
                  r={3}
                  fill={broker.color}
                  className="drop-shadow-sm"
                />
              );
            })}
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {brokers.map((b, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: b.color }} />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{b.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
