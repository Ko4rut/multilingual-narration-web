"use client";
import { usePreferences } from "@/features/preferences/hooks/usePreferences";
import type { DashboardData } from "../types";

export function StatCard({ stat }: { stat: DashboardData["stats"][number] }) {
  const { t } = usePreferences();
  return <section className="card stat-card"><div><h2>{t(stat.label)}</h2><span className={`change ${stat.positive ? "positive" : "negative"}`}>{stat.change}</span></div><strong>{stat.value}</strong></section>;
}
