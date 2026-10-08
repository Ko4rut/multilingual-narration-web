"use client";

import { useVisitsChart } from "../hooks/use-visits-chart";
import type { ChartProps } from "../types";

export function VisitsChart({ values }: ChartProps) {
  const { bars, hourLabels, readout } = useVisitsChart(values);

  return (
    <>
      <div className="bar-chart">
        {bars.map(function renderBar(bar) {
          return (
            <div className="bar-column" key={bar.index}>
              <button
                type="button"
                className="bar"
                style={bar.style}
                aria-label={bar.label}
                onMouseEnter={bar.activate}
                onFocus={bar.activate}
                onClick={bar.activate}
              />
            </div>
          );
        })}
      </div>
      <div className="chart-labels">
        {hourLabels.map(function renderHour(bar) {
          return <span key={bar.index}>{bar.hourLabel}</span>;
        })}
      </div>
      <p className="chart-readout" aria-live="polite">
        {readout}
      </p>
    </>
  );
}
