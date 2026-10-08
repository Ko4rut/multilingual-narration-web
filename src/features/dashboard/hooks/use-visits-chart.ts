"use client";

import { useState } from "react";
import { usePreferences } from "@/features/preferences/hooks/use-preferences";

export function useVisitsChart(values: number[]) {
  const { t, locale } = usePreferences();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const maximumValue = Math.max(1, ...values);

  const bars = values.map(function prepareBar(value, index) {
    const hourLabel = `${index + 8}:00`;
    const label = `${hourLabel} \u2014 ${value.toLocaleString(locale)} ${t("visits")}`;

    function activate() {
      setActiveIndex(index);
    }

    return {
      index,
      hourLabel,
      label,
      style: {
        height: `${value / maximumValue * 100}%`,
        animationDelay: `${index * 35}ms`,
      },
      activate,
    };
  });

  const hourLabels = bars.filter(function showHourLabel(bar) {
    if (bar.index % 2 === 0) {
      return true;
    }

    return bar.index === bars.length - 1;
  });

  let readout = t("Hourly visitor volume distribution");

  if (activeIndex !== null && bars[activeIndex] !== undefined) {
    readout = bars[activeIndex].label;
  }

  return { bars, hourLabels, readout };
}
