import type { DashboardData, Period } from "../types";

export function createDashboardMock(period: Period): DashboardData {
  const factor = period === "7" ? 0.25 : period === "90" ? 2.8 : 1;
  const count = (value: number) => Math.round(value * factor);
  return {
    stats: [
      { label: "Total Listening Sessions", value: count(152482).toLocaleString("en-US"), change: "+14.2%", positive: true },
      { label: "Total Active POIs", value: "1,240", change: "+8.3%", positive: true },
      { label: "Completion Rate", value: "78.4%", change: "+4.6%", positive: true },
      { label: "Average Listening Duration", value: "4m 24s", change: "−2.1%", positive: false },
    ],
    minutes: count(14820),
    trend: [22, 34, 65, 46, 78, 53, 72, 91].map(count),
    popularPois: [
      { name: "Hoàn Kiếm Lake", plays: count(12450) },
      { name: "Huế Imperial Citadel", plays: count(9840) },
      { name: "Hội An Ancient Town", plays: count(8120) },
      { name: "Independence Palace", plays: count(5400) },
    ],
    hourlyVisits: [9, 16, 29, 48, 58, 52, 38, 26, 32, 45, 55, 20].map(count),
    heatmap: Array.from({ length: 7 }, (_, day) => Array.from({ length: 15 }, (_, hour) => (day * 3 + hour * 7 + Number(period)) % 5)),
  };
}
