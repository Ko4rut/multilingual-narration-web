"use client";

import { usePreferences } from "@/features/preferences/hooks/use-preferences";
import { HEAT_LEVELS, HEATMAP_HOURS, WEEKDAYS } from "../constants";

export function useVisitorHeatmap(values: number[][]) {
  const { t } = usePreferences();

  const rows = values.map(function prepareDay(levels, dayIndex) {
    const dayLabel = t(WEEKDAYS[dayIndex]);
    const cells = levels.map(function prepareCell(level, hourIndex) {
      const hour = hourIndex + 8;

      return {
        hour,
        className: `heat-cell level-${level}`,
        title: `${dayLabel}, ${hour}:00 \u2014 ${t("Activity")} ${level}/4`,
      };
    });

    return {
      dayIndex,
      dayLabel,
      cells,
    };
  });

  const legend = HEAT_LEVELS.map(function prepareLegend(level) {
    return {
      level,
      className: `heat-cell level-${level}`,
    };
  });

  return {
    rows,
    legend,
    hours: HEATMAP_HOURS,
    lessLabel: t("Less"),
    moreLabel: t("More"),
  };
}
