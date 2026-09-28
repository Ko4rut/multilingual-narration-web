import type { Metadata } from "next";
import { DashboardOverview } from "@/features/dashboard/components/DashboardOverview";
import { getDashboard } from "@/features/dashboard/services/dashboard.service";
import { parsePeriod } from "@/features/dashboard/types";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ period?: string | string[] }> }) {
  const period = parsePeriod((await searchParams).period);
  const data = await getDashboard(period);
  return <DashboardOverview data={data} period={period} />;
}
