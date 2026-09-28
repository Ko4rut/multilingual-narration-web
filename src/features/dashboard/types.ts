export type Period = "7" | "30" | "90";
export function parsePeriod(value: string | string[] | undefined): Period {
  return value === "7" || value === "90" ? value : "30";
}
export type DashboardData = {
  stats: { label: string; value: string; change: string; positive: boolean }[];
  minutes: number;
  trend: number[];
  popularPois: { name: string; plays: number }[];
  hourlyVisits: number[];
  heatmap: number[][];
};
