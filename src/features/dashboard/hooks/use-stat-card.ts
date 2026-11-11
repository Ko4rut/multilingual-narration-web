"use client";

import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type { DashboardStat } from "../types";

export function useStatCard(stat: DashboardStat) {
  const { t, locale } = usePreferences();
  let value = stat.value;
  let changeClassName = "negative";

  if (typeof stat.value === "number") {
    value = stat.value.toLocaleString(locale);
  }

  if (stat.positive) {
    changeClassName = "positive";
  }

  return {
    label: t(stat.label),
    value,
    change: stat.change,
    changeClassName,
  };
}
