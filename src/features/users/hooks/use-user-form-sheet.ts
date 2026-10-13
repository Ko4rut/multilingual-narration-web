"use client";

import { useMemo, useState } from "react";

import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type {
  FeatureFormMode,
  FormComboboxOption,
} from "@/types/shared/feature-form.types";
import { USER_STATUS_OPTIONS } from "../constants/user.constants";
import { MOCK_ROLES } from "../mocks/roles.mock";

export function useUserFormSheet(mode: FeatureFormMode) {
  const { t } = usePreferences();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const roleOptions = useMemo<FormComboboxOption[]>(function createRoleOptions() {
    return MOCK_ROLES.map(function translateRoleOption(role) {
      return { value: role.id, label: t(role.name) };
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

  /** Chuyển trạng thái ẩn hoặc hiện của mật khẩu ban đầu. */
  function togglePasswordVisibility() {
    setShowPassword(function updatePasswordVisibility(value) {
      return !value;
    });
  }

  /** Chuyển trạng thái ẩn hoặc hiện của trường xác nhận mật khẩu. */
  function togglePasswordConfirmationVisibility() {
    setShowPasswordConfirmation(function updatePasswordVisibility(value) {
      return !value;
    });
  }

  return {
    t,
    roleOptions,
    statusOptions,
    description,
    showPassword,
    showPasswordConfirmation,
    togglePasswordVisibility,
    togglePasswordConfirmationVisibility,
  };
}
