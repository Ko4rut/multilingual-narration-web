"use client";

import { useMemo } from "react";

import { usePreferences } from "@/features/preferences/hooks/use-preferences";
import type { FeatureFormMode, FormComboboxOption } from "@/types/components";
import {
  USER_ROLE_OPTIONS,
  USER_STATUS_OPTIONS,
} from "../constants/user.constants";

export function useUserFormSheet(mode: FeatureFormMode) {
  const { t } = usePreferences();

  const roleOptions = useMemo<FormComboboxOption[]>(function createRoleOptions() {
    return USER_ROLE_OPTIONS.map(function translateRoleOption(option) {
      return { value: option.value, label: t(option.label) };
    });
  }, [t]);

  const statusOptions = useMemo<FormComboboxOption[]>(function createStatusOptions() {
    return USER_STATUS_OPTIONS.map(function translateStatusOption(option) {
      return { value: option.value, label: t(option.label) };
    });
  }, [t]);

  let description = t("Create a new administrator account and assign its access role.");
  if (mode === "view") {
    description = t("Review this administrator account and its access settings.");
  }
  if (mode === "edit") {
    description = t("Update this administrator account and its access settings.");
  }

  return { t, roleOptions, statusOptions, description };
}
