"use client";

import { useTrendChart } from "../hooks/use-trend-chart";
import type { ChartProps } from "../types";

export function TrendChart({ values }: ChartProps) {
  const chart = useTrendChart(values);

  return (
    <div>
      <svg
        className="trend-chart"
        viewBox="0 0 490 200"
        role="group"
        aria-label={chart.title}
      >
        <defs>
          <linearGradient id={chart.gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity=".28" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {chart.gridLines.map(function renderGridLine(line) {
          return (
            <line
              key={line}
              x1="0"
              y1={line}
              x2="490"
              y2={line}
              stroke="var(--border)"
              strokeDasharray="3 5"
            />
          );
        })}
        <polygon points={chart.areaPoints} fill={chart.gradientFill} />
        <polyline
          className="trend-line"
          pathLength="1"
          points={chart.linePoints}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {chart.points.map(function renderPoint(point) {
          return (
            <g key={point.index}>
              <circle
                cx={point.x}
                cy={point.y}
                r={point.radius}
                fill="var(--accent)"
              />
              <circle
                cx={point.x}
                cy={point.y}
                r="12"
                fill="transparent"
                tabIndex={0}
                role="button"
                aria-label={point.label}
                onMouseEnter={point.activate}
                onFocus={point.activate}
                onClick={point.activate}
                onKeyDown={point.activateWithKeyboard}
              />
            </g>
          );
        })}
      </svg>
      <p className="chart-readout" aria-live="polite">
        {chart.readout}
      </p>
      <div className="chart-labels">
        <span>{chart.startLabel}</span>
        <span>{chart.endLabel}</span>
      </div>
    </div>
  );
}
