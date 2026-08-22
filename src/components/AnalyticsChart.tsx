import React, { useState } from 'react';

interface ChartDataPoint {
  date: string;
  value: number;
}

interface AnalyticsChartProps {
  data: ChartDataPoint[];
  title: string;
  metricLabel: string;
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data, title, metricLabel }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG dimensions
  const width = 500;
  const height = 200;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Find min/max values
  const values = data.map(d => d.value);
  const maxValue = Math.max(...values, 10) * 1.1; // 10% headroom
  const minValue = 0; // standard floor

  // Calculate coordinates
  const points = data.map((d, index) => {
    const x = paddingLeft + (index / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((d.value - minValue) / (maxValue - minValue)) * chartHeight;
    return { x, y, ...d };
  });

  // Create path command
  const linePath = points.reduce((path, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
  }, '');

  // Create closed path for the gradient fill
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
    : '';

  return (
    <div className="bg-white border border-zinc-150 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-450 text-zinc-500">{title}</h4>
        {hoveredIndex !== null && (
          <span className="text-xs font-bold text-brand-700 animate-bounce-in bg-brand-50 px-2 py-0.5 rounded">
            {data[hoveredIndex].date}: {data[hoveredIndex].value.toLocaleString()} {metricLabel}
          </span>
        )}
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f766e" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0f766e" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {Array.from({ length: 4 }).map((_, i) => {
            const y = paddingTop + (i / 3) * chartHeight;
            const gridVal = Math.round(maxValue - (i / 3) * (maxValue - minValue));
            return (
              <g key={i} className="opacity-40">
                <line 
                  x1={paddingLeft} 
                  y1={y} 
                  x2={width - paddingRight} 
                  y2={y} 
                  stroke="#e4e4e7" 
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text 
                  x={paddingLeft - 8} 
                  y={y + 4} 
                  fill="#71717a" 
                  fontSize="9" 
                  fontWeight="600"
                  textAnchor="end"
                >
                  {gridVal}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#chartGradient)" />

          {/* Line Path */}
          <path 
            d={linePath} 
            fill="none" 
            stroke="#0f766e" 
            strokeWidth="2.5" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((p, idx) => (
            <g key={idx}>
              {/* Invisible hover area */}
              <circle
                cx={p.x}
                cy={p.y}
                r="16"
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              {/* Visual dot */}
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === idx ? "6" : "3.5"}
                fill={hoveredIndex === idx ? "#0f766e" : "#ffffff"}
                stroke="#0f766e"
                strokeWidth={hoveredIndex === idx ? "2.5" : "2"}
                className="transition-all pointer-events-none"
              />
            </g>
          ))}

          {/* X Axis Labels */}
          {points.map((p, idx) => (
            <text
              key={idx}
              x={p.x}
              y={height - 8}
              fill="#71717a"
              fontSize="9"
              fontWeight="600"
              textAnchor="middle"
              className="opacity-70"
            >
              {p.date}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};
