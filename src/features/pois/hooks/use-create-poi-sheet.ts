"use client";

import { useMemo } from "react";

import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type { FormComboboxOption } from "@/types/shared/feature-form.types";
import type { Region } from "../types";

export function useCreatePoiSheet(regions: readonly Region[]) {
  const { t } = usePreferences();

  const regionOptions = useMemo(function createRegionOptions() {
    return regions.map(function createRegionOption(region) {
      return { value: region.id, label: region.name };
    });
  }, [regions]);

  const statusOptions = useMemo<FormComboboxOption[]>(
    function createStatusOptions() {
      return [
        { value: "active", label: t("Active") },
        { value: "inactive", label: t("Inactive") },
        { value: "maintenance", label: t("Maintenance") },
      ];
    },
    [t],
  );

  return { t, regionOptions, statusOptions };
}
