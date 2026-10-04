"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { useDashboardOverview } from "../hooks/useDashboardOverview";
import type { DashboardOverviewProps } from "../types";
import { DashboardPanel } from "./DashboardPanel";
import { PeriodFilter } from "./PeriodFilter";
import { PopularPois } from "./PopularPois";
import { StatsGrid } from "./StatsGrid";
import { TrendChart } from "./TrendChart";
import { VisitorHeatmap } from "./VisitorHeatmap";
import { VisitsChart } from "./VisitsChart";

export function DashboardOverview(props: DashboardOverviewProps) {
  const { data, period } = props;
  const { t, chartKey, minutesLabel, replayAnimation } = useDashboardOverview(props);

  return (
    <>
      <PageHeader
        title="Dashboard Overview"
        description="System health and global visitor activities"
      >
        <div className="dashboard-actions">
          <Button type="button" variant="outline" onClick={replayAnimation}>
            <RotateCcw aria-hidden="true" />
            {t("Replay animation")}
          </Button>
          <PeriodFilter period={period} />
        </div>
      </PageHeader>

      <StatsGrid stats={data.stats} />

      <div className="dashboard-grid">
        <DashboardPanel
          title="Listening Duration Trends"
          description="Total listening time in minutes"
          action={
            <strong className="accent metric">
              {minutesLabel}
            </strong>
          }
        >
          <TrendChart key={chartKey} values={data.trend} />
        </DashboardPanel>
        <PopularPois pois={data.popularPois} />
      </div>

      <div className="dashboard-bottom">
        <VisitorHeatmap values={data.heatmap} />
        <DashboardPanel
          title="Peak Visiting Time"
          description="Hourly visitor volume distribution"
        >
          <VisitsChart key={chartKey} values={data.hourlyVisits} />
        </DashboardPanel>
      </div>

      <footer className="dashboard-footer">
        <span className="status-dot" />
        {t("Demo workspace \u00b7 All metrics are sample data")}
      </footer>
    </>
  );
}
