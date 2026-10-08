"use client";

import { useVisitorHeatmap } from "../hooks/use-visitor-heatmap";
import type { VisitorHeatmapProps } from "../types";
import { DashboardPanel } from "./DashboardPanel";

export function VisitorHeatmap({ values }: VisitorHeatmapProps) {
  const { rows, legend, hours, lessLabel, moreLabel } = useVisitorHeatmap(values);

  return (
    <DashboardPanel
      title="Visitor Heatmap"
      description="Peak visitor activity distribution"
    >
      <div className="heatmap">
        {rows.map(function renderRow(row) {
          return (
            <div className="heatmap-row" key={row.dayIndex}>
              <span>{row.dayLabel}</span>
              {row.cells.map(function renderCell(cell) {
                return (
                  <span
                    key={cell.hour}
                    className={cell.className}
                    title={cell.title}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="chart-labels">
        {hours.map(function renderHour(hour) {
          return <span key={hour}>{hour}</span>;
        })}
      </div>
      <div className="heat-legend">
        <span>{lessLabel}</span>
        {legend.map(function renderLegend(item) {
          return <span key={item.level} className={item.className} />;
        })}
        <span>{moreLabel}</span>
      </div>
    </DashboardPanel>
  );
}
