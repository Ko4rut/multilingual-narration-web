"use client";

import { useMemo } from "react";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type { FeatureFormMode, FormComboboxOption } from "@/types/shared/feature-form.types";
import { POI_STATUS, POI_STATUS_OPTIONS } from "../constants/poi.constants";
import type { PoiCategory } from "../types/poi-category.types";
import type { Region } from "../types/region.types";

export function usePoiFormSheet(
  mode: FeatureFormMode,
  canActivate: boolean,
  regions: readonly Region[],
  categories: readonly PoiCategory[],
) {
  const { t } = usePreferences();
  const regionOptions = useMemo<FormComboboxOption[]>(
    function createRegionOptions() {
      return regions.map(function createRegionOption(region) {
        return { value: region.id, label: t(region.region_name) };
      });
    },
    [regions, t],
  );
  const statusOptions = useMemo<FormComboboxOption[]>(
    function createStatusOptions() {
      return POI_STATUS_OPTIONS.flatMap(function translateStatusOption(option) {
        if (option.value === POI_STATUS.ACTIVE && !canActivate) {
          return [];
        }
        return [{ value: option.value, label: t(option.label) }];
      });
    },
    [canActivate, t],
  );
  const categoryOptions = useMemo<FormComboboxOption[]>(
    function createCategoryOptions() {
      return categories.map(function createCategoryOption(category) {
        return {
          value: category.id,
          label: t(category.category_name),
        };
      });
    },
    [categories, t],
  );

  let description = t("Create a POI. New POIs remain inactive until publish requirements are met.");
  if (mode === "view") {
    description = t("Review POI location, activation and synchronization metadata.");
  }
  if (mode === "edit") {
    description = t("Update POI metadata and activation status.");
  }

  return {
    t,
    regionOptions,
    categoryOptions,
    statusOptions,
    description,
  };
}
