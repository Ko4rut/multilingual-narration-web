import type { ReactNode } from "react";
import type { Locale } from "@/i18n/types";

export type Theme = "dark" | "light";
export type PreferenceState = {
  initialLocale: Locale;
  savedLocale?: Locale;
  savedTheme?: Theme;
};
export type PreferencesProviderProps = PreferenceState & { children: ReactNode };
export type PreferencesContextValue = {
  locale: Locale;
  theme: Theme;
  t: (key: string) => string;
  setLocale: (value: Locale) => void;
  setTheme: (value: Theme) => void;
};
