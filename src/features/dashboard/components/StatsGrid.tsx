import type { StatsGridProps } from "../types";
import { StatCard } from "./StatCard";

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="stats-grid">
      {stats.map(function renderStat(stat) {
        return <StatCard key={stat.label} stat={stat} />;
      })}
    </div>
  );
}
