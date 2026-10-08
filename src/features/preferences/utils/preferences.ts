import type { Locale } from "@/i18n/types";
import type { Theme } from "../types";

export function parseLocale(value?: string): Locale | undefined {
  return value === "vi" || value === "en" ? value : undefined;
}

export function parseTheme(value?: string): Theme | undefined {
  return value === "dark" || value === "light" ? value : undefined;
}

export function savePreference(name: "locale" | "theme", value: Locale | Theme) {
  document.cookie = `${name}=${value};path=/;max-age=31536000;SameSite=Lax`;
}
