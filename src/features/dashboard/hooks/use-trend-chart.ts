"use client";

import { useId, useState } from "react";
import type { KeyboardEvent } from "react";
import { usePreferences } from "@/features/preferences/hooks/use-preferences";
import { TREND_GRID_LINES } from "../constants";

export function useTrendChart(values: number[]) {
  const { t, locale } = usePreferences();
  const gradientId = useId();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const maximumValue = Math.max(1, ...values);
  const intervalCount = Math.max(1, values.length - 1);

  const points = values.map(function preparePoint(value, index) {
    const x = 20 + index * 448 / intervalCount;
    const y = 170 - value / maximumValue * 135;
    const label = `${t("Interval")} ${index + 1}: ${value.toLocaleString(locale)} ${t("minutes")}`;
    let radius = 3;

    if (activeIndex === index) {
      radius = 6;
    }

    function activate() {
      setActiveIndex(index);
    }

    function activateWithKeyboard(event: KeyboardEvent<SVGCircleElement>) {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      activate();
    }

    return { index, x, y, label, radius, activate, activateWithKeyboard };
  });

  const linePoints = points.map(function getCoordinates(point) {
    return `${point.x},${point.y}`;
  }).join(" ");

  let lastX = 20;
  let readout = t("Total listening time in minutes");

  if (points.length > 0) {
    lastX = points[points.length - 1].x;
  }

  if (activeIndex !== null && points[activeIndex] !== undefined) {
    readout = points[activeIndex].label;
  }

  return {
    points,
    linePoints,
    areaPoints: `20,190 ${linePoints} ${lastX},190`,
    gradientId,
    gradientFill: `url(#${gradientId})`,
    gridLines: TREND_GRID_LINES,
    readout,
    title: t("Listening Duration Trends"),
    startLabel: t("Period start"),
    endLabel: t("Period end"),
  };
}
