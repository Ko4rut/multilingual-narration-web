"use client";
import { usePreferences } from "../hooks/use-preferences";
import type { Locale } from "@/i18n/types";
import type { Theme } from "../types";

export function PreferenceControls() {
  const { locale, theme, t, setLocale, setTheme } = usePreferences();
  return <div className="preference-controls">
    <label><span>{t("Theme")}</span><select aria-label={t("Theme")} value={theme} onChange={(event) => setTheme(event.target.value as Theme)}><option value="dark">{t("Dark")}</option><option value="light">{t("Light")}</option></select></label>
    <label><span>{t("Language")}</span><select aria-label={t("Language")} value={locale} onChange={(event) => setLocale(event.target.value as Locale)}><option value="vi">Tiếng Việt</option><option value="en">English</option></select></label>
  </div>;
}
