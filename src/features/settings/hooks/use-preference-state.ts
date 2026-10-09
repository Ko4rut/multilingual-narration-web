"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { vi } from "@/i18n/messages";
import type { Locale } from "@/i18n/types";
import type { PreferenceState, PreferencesContextValue, Theme } from "../types/settings.types";
import { savePreference } from "../utils/preferences";

function subscribeTheme(notify: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}
function browserTheme(): Theme {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  return "light";
}

export function usePreferenceState({ initialLocale, savedLocale, savedTheme }: PreferenceState): PreferencesContextValue {
  const [localeOverride, updateLocale] = useState(savedLocale);
  const [themeOverride, updateTheme] = useState(savedTheme);
  const systemTheme = useSyncExternalStore(subscribeTheme, browserTheme, () => savedTheme ?? "light");
  const locale = localeOverride ?? initialLocale;
  const theme = themeOverride ?? systemTheme;

  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  useEffect(() => { document.documentElement.dataset.theme = themeOverride ?? "system"; }, [themeOverride]);

  function setLocale(value: Locale) {
    updateLocale(value);
    savePreference("locale", value);
  }
  function setTheme(value: Theme) {
    updateTheme(value);
    savePreference("theme", value);
  }

  function translate(key: string) {
    if (locale === "vi") return vi[key] ?? key;
    return key;
  }

  return { locale, theme, setLocale, setTheme, t: translate };
}
