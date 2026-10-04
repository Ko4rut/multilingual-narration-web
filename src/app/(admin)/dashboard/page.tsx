import type { Metadata } from "next";
import { DashboardOverview } from "@/features/dashboard/components/DashboardOverview";
import { getDashboard } from "@/features/dashboard/services/dashboard.service";
import { parsePeriod } from "@/features/dashboard/utils/parsePeriod";
import type { DashboardPageProps } from "@/features/dashboard/types";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const period = parsePeriod((await searchParams).period);
  const data = await getDashboard(period);
  return (
    <DashboardOverview data={data} period={period} />
  );
}
