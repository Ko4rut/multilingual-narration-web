"use client";

import { Progress } from "@/components/ui/progress";
import { usePopularPois } from "../hooks/usePopularPois";
import type { PopularPoisProps } from "../types";
import { DashboardPanel } from "./DashboardPanel";

export function PopularPois({ pois }: PopularPoisProps) {
  const items = usePopularPois(pois);

  return (
    <DashboardPanel
      title="Most Popular POIs (Plays)"
      description="Highest played Vietnamese landmark guides"
    >
      <ol className="popular-list">
        {items.map(function renderPoi(poi) {
          return (
            <li key={poi.name}>
              <div>
                <span>
                  <b className="accent">{poi.rank}</b>
                  {poi.name}
                </span>
                <small>{poi.playsLabel}</small>
              </div>
              <Progress
                className="h-1.5"
                aria-label={poi.progressLabel}
                value={poi.progress}
              />
            </li>
          );
        })}
      </ol>
    </DashboardPanel>
  );
}
