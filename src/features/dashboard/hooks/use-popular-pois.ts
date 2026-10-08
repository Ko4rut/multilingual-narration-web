"use client";

import { usePreferences } from "@/features/preferences/hooks/use-preferences";
import type { PopularPoi } from "../types";

export function usePopularPois(pois: PopularPoi[]) {
  const { t, locale } = usePreferences();
  let maximumPlays = 1;

  for (const poi of pois) {
    maximumPlays = Math.max(maximumPlays, poi.plays);
  }

  return pois.map(function preparePoi(poi, index) {
    const playsLabel = `${poi.plays.toLocaleString(locale)} ${t("plays")}`;

    return {
      name: poi.name,
      rank: String(index + 1).padStart(2, "0"),
      playsLabel,
      progress: poi.plays / maximumPlays * 100,
      progressLabel: `${poi.name}: ${playsLabel}`,
    };
  });
}
