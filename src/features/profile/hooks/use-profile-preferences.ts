"use client";

import { usePreferences } from "@/features/settings/hooks/use-preferences";
import { PROFILE_LANGUAGE_OPTIONS } from "../constants/profile.constants";
import type { ProfileLanguageOption } from "../types/profile.types";

/** Điều phối lựa chọn giao diện và ngôn ngữ của người dùng trên trang hồ sơ. */
export function useProfilePreferences() {
  const { locale, theme, t, setLocale, setTheme } = usePreferences();
  const selectedLanguage =
    PROFILE_LANGUAGE_OPTIONS.find(function findSelectedLanguage(option) {
      return option.value === locale;
    }) ?? PROFILE_LANGUAGE_OPTIONS[0];
  let themeLabel = "Light mode";
  if (theme === "dark") {
    themeLabel = "Dark mode";
  }

  function handleThemeChange(checked: boolean) {
    if (checked) {
      setTheme("dark");
      return;
    }
    setTheme("light");
  }

  function handleLanguageChange(option: ProfileLanguageOption | null) {
    if (!option) {
      return;
    }
    setLocale(option.value);
  }

  function getLanguageLabel(option: ProfileLanguageOption) {
    return option.label;
  }

  return {
    theme,
    themeLabel,
    t,
    languageOptions: PROFILE_LANGUAGE_OPTIONS,
    selectedLanguage,
    handleThemeChange,
    handleLanguageChange,
    getLanguageLabel,
  };
}
