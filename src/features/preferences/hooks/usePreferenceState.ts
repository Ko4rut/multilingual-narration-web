"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { vi } from "@/i18n/messages";
import type { Locale } from "@/i18n/types";
import type { PreferenceState, PreferencesContextValue, Theme } from "../types";
import { resolveLocale, savePreference } from "../utils/preferences";

function subscribeTheme(notify: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}
function subscribeLanguage(notify: () => void) {
  window.addEventListener("languagechange", notify);
  return () => window.removeEventListener("languagechange", notify);
}
const browserTheme = (): Theme => window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
const browserLocale = () => resolveLocale(navigator.languages);

export function usePreferenceState({ initialLocale, savedLocale, savedTheme }: PreferenceState): PreferencesContextValue {
  const [localeOverride, updateLocale] = useState(savedLocale);
  const [themeOverride, updateTheme] = useState(savedTheme);
  const systemTheme = useSyncExternalStore(subscribeTheme, browserTheme, () => savedTheme ?? "light");
  const systemLocale = useSyncExternalStore(subscribeLanguage, browserLocale, () => initialLocale);
  const locale = localeOverride ?? systemLocale;
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
  return { locale, theme, setLocale, setTheme, t: (key) => locale === "vi" ? vi[key] ?? key : key };
}
