"use client";

import { useState } from "react";
import { usePreferences } from "@/features/preferences/hooks/usePreferences";
import type { DashboardOverviewProps } from "../types";

export function useDashboardOverview({ data, period }: DashboardOverviewProps) {
  const { t, locale } = usePreferences();
  const [replay, setReplay] = useState(0);

  function replayAnimation() {
    setReplay(function incrementReplay(previousReplay) {
      return previousReplay + 1;
    });
  }

  const chartKey = `${period}-${replay}`;
  const minutesLabel = `${data.minutes.toLocaleString(locale)} ${t("minutes")}`;

  return {
    t,
    chartKey,
    minutesLabel,
    replayAnimation,
  };
}
