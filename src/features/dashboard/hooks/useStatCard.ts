"use client";

import { usePreferences } from "@/features/preferences/hooks/usePreferences";
import type { DashboardStat } from "../types";

export function useStatCard(stat: DashboardStat) {
  const { t } = usePreferences();
  let changeClassName = "negative";

  if (stat.positive) {
    changeClassName = "positive";
  }

  return {
    label: t(stat.label),
    value: stat.value,
    change: stat.change,
    changeClassName,
  };
}
