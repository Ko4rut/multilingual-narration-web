import type { Locale } from "@/i18n/types";
import type { Theme } from "../types";

export function parseLocale(value?: string): Locale | undefined {
  return value === "vi" || value === "en" ? value : undefined;
}

export function parseTheme(value?: string): Theme | undefined {
  return value === "dark" || value === "light" ? value : undefined;
}

export function resolveLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    const locale = parseLocale(language.trim().toLowerCase().split("-")[0]);
    if (locale) return locale;
  }
  return "en";
}

export function localeFromHeader(header: string): Locale {
  const languages = header.split(",").map((part) => {
    const [language, quality] = part.trim().split(";");
    return { language, quality: quality ? Number(quality.trim().replace(/^q=/, "")) : 1 };
  }).filter(({ quality }) => quality > 0 && quality <= 1)
    .sort((a, b) => b.quality - a.quality);
  return resolveLocale(languages.map(({ language }) => language));
}

export function savePreference(name: "locale" | "theme", value: Locale | Theme) {
  document.cookie = `${name}=${value};path=/;max-age=31536000;SameSite=Lax`;
}
