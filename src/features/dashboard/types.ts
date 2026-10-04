import type { ReactNode } from "react";

export type Period = "7" | "30" | "90";

export type DashboardStat = {
  label: string;
  value: string;
  change: string;
  positive: boolean;
};

export type PopularPoi = {
  name: string;
  plays: number;
};

export type DashboardData = {
  stats: DashboardStat[];
  minutes: number;
  trend: number[];
  popularPois: PopularPoi[];
  hourlyVisits: number[];
  heatmap: number[][];
};

export type DashboardOverviewProps = {
  data: DashboardData;
  period: Period;
};

export type PeriodFilterProps = {
  period: Period;
};

export type StatCardProps = {
  stat: DashboardStat;
};

export type StatsGridProps = {
  stats: DashboardStat[];
};

export type ChartProps = {
  values: number[];
};

export type PopularPoisProps = {
  pois: PopularPoi[];
};

export type VisitorHeatmapProps = {
  values: number[][];
};

export type DashboardPanelProps = {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
};

export type DashboardPanelActionProps = {
  action: ReactNode;
};

export type DashboardPageProps = {
  searchParams: Promise<{
    period?: string | string[];
  }>;
};
